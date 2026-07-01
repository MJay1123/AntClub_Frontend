<template>
  <div class="club-schedule-page">

    <!-- ===== 상단 툴바 ===== -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 학기 선택 -->
        <select v-model="selectedSemesterId" @change="loadSchedules" class="semester-select">
          <option v-for="sem in semesters" :key="sem.semesterId" :value="sem.semesterId">
            {{ sem.year }}년 {{ termLabel(sem.term) }}
            <template v-if="sem.isCurrent"> (현재)</template>
          </option>
        </select>

        <!-- 뷰 전환 -->
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
            ☰ 목록
          </button>
          <button :class="{ active: viewMode === 'calendar' }" @click="viewMode = 'calendar'">
            📅 달력
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- 필터 -->
        <select v-model="filterType" @change="loadSchedules" class="filter-select">
          <option value="">전체 유형</option>
          <option value="REGULAR">정기모임</option>
          <option value="SPECIAL">특별활동</option>
          <option value="COMPETITION">대회</option>
          <option value="WORKSHOP">워크숍</option>
          <option value="PARTY">회식</option>
          <option value="ETC">기타</option>
        </select>
        <select v-model="filterStatus" @change="loadSchedules" class="filter-select">
          <option value="">전체 상태</option>
          <option value="SCHEDULED">예정</option>
          <option value="ONGOING">진행중</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELLED">취소</option>
        </select>

        <!-- 일정 생성 버튼 (임원 이상) -->
        <button
          v-if="isExecutiveAbove"
          class="btn btn-primary"
          @click="openCreateModal"
        >
          + 일정 추가
        </button>
      </div>
    </div>

    <!-- ===== 통계 카드 ===== -->
    <div class="stat-cards">
      <div class="stat-card">
        <p class="stat-label">전체 일정</p>
        <p class="stat-value">{{ stats.total }}<span>개</span></p>
      </div>
      <div class="stat-card">
        <p class="stat-label">예정</p>
        <p class="stat-value blue">{{ stats.scheduled }}<span>개</span></p>
      </div>
      <div class="stat-card">
        <p class="stat-label">완료</p>
        <p class="stat-value green">{{ stats.completed }}<span>개</span></p>
      </div>
      <div class="stat-card">
        <p class="stat-label">취소</p>
        <p class="stat-value red">{{ stats.cancelled }}<span>개</span></p>
      </div>
      <div class="stat-card">
        <p class="stat-label">평균 참여율</p>
        <p class="stat-value">{{ stats.avgAttendance }}<span>%</span></p>
      </div>
    </div>

    <!-- ===== 목록 뷰 ===== -->
    <div v-if="viewMode === 'list'" class="list-view">
      <div v-if="loading" class="loading">불러오는 중...</div>

      <template v-else>
        <div v-if="schedules.length === 0" class="empty">등록된 일정이 없습니다.</div>

        <div
          v-for="schedule in schedules"
          :key="schedule.scheduleId"
          class="schedule-item"
          :class="`status-${schedule.status.toLowerCase()}`"
          @click="openDetailModal(schedule)"
        >
          <!-- 왼쪽: 날짜 -->
          <div class="schedule-date">
            <span class="date-month">{{ formatMonth(schedule.startedAt) }}</span>
            <span class="date-day">{{ formatDay(schedule.startedAt) }}</span>
            <span class="date-weekday">{{ formatWeekday(schedule.startedAt) }}</span>
          </div>

          <!-- 중간: 내용 -->
          <div class="schedule-content">
            <div class="content-top">
              <ClubBadge type="scheduleType" :value="schedule.scheduleType" size="sm" />
              <ClubBadge type="scheduleStatus" :value="schedule.status" size="sm" />
              <span v-if="schedule.isTeamRequired" class="team-badge">🏃 팀배정</span>
            </div>
            <h3 class="schedule-title">{{ schedule.title }}</h3>
            <div class="schedule-meta">
              <span v-if="schedule.location">📍 {{ schedule.location }}</span>
              <span>🕐 {{ formatTime(schedule.startedAt) }} ~ {{ formatTime(schedule.endedAt) }}</span>
              <span v-if="schedule.maxParticipants">
                👥 {{ schedule.currentParticipants ?? 0 }} / {{ schedule.maxParticipants }}명
              </span>
            </div>
          </div>

          <!-- 오른쪽: 내 참여 상태 + 액션 -->
          <div class="schedule-action" @click.stop>
            <!-- 참여 신청 가능한 경우 -->
            <template v-if="schedule.status === 'SCHEDULED'">
              <template v-if="!schedule.myParticipation">
                <button
                  class="btn btn-primary sm"
                  :disabled="isDeadlinePassed(schedule.applyDeadline)"
                  @click="applySchedule(schedule)"
                >
                  {{ isDeadlinePassed(schedule.applyDeadline) ? '마감' : '참여 신청' }}
                </button>
              </template>
              <template v-else>
                <span class="applied-label">✅ 신청완료</span>
                <button
                  class="btn btn-outline sm"
                  @click="cancelSchedule(schedule)"
                >
                  취소
                </button>
              </template>
            </template>

            <!-- 진행중: 출석 체크 -->
            <template v-else-if="schedule.status === 'ONGOING'">
              <button
                v-if="schedule.myParticipation && !schedule.myParticipation.isAttended"
                class="btn btn-success sm"
                @click="openCheckInModal(schedule)"
              >
                출석 체크
              </button>
              <span
                v-else-if="schedule.myParticipation?.isAttended"
                class="checked-label"
              >
                ✅ 출석완료
              </span>
            </template>

            <!-- 완료: 참여 여부 표시 -->
            <template v-else-if="schedule.status === 'COMPLETED'">
              <span v-if="schedule.myParticipation?.isAttended" class="attended-label">✅ 참여</span>
              <span v-else-if="schedule.myParticipation" class="absent-label">❌ 불참</span>
              <span v-else class="no-apply-label">— 미신청</span>
            </template>

            <!-- 임원 이상: 관리 버튼 -->
            <button
              v-if="isExecutiveAbove"
              class="btn btn-outline sm icon-btn"
              @click="openEditModal(schedule)"
            >
              ✏️
            </button>
          </div>
        </div>
      </template>

      <BasePagination
        :current-page="page"
        :total-pages="totalPages"
        @change="onPageChange"
      />
    </div>

    <!-- ===== 달력 뷰 ===== -->
    <div v-else class="calendar-view">
      <div class="calendar-header">
        <button class="cal-nav" @click="prevMonth">‹</button>
        <span class="cal-title">{{ calYear }}년 {{ calMonth }}월</span>
        <button class="cal-nav" @click="nextMonth">›</button>
      </div>

      <div class="calendar-grid">
        <!-- 요일 헤더 -->
        <div
          v-for="day in ['일','월','화','수','목','금','토']"
          :key="day"
          class="cal-weekday"
          :class="{ sunday: day === '일', saturday: day === '토' }"
        >
          {{ day }}
        </div>

        <!-- 날짜 셀 -->
        <div
          v-for="cell in calendarCells"
          :key="cell.key"
          class="cal-cell"
          :class="{
            'other-month': !cell.isCurrentMonth,
            'today': cell.isToday,
          }"
        >
          <span class="cal-day">{{ cell.day }}</span>
          <div class="cal-events">
            <div
              v-for="s in cell.schedules"
              :key="s.scheduleId"
              class="cal-event"
              :class="`event-${s.scheduleType.toLowerCase()}`"
              @click="openDetailModal(s)"
            >
              {{ s.title }}
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- ===== 일정 상세 모달 ===== -->
    <BaseModal v-model="showDetailModal" size="lg">
      <template #title>일정 상세</template>

      <div v-if="selectedSchedule" class="detail-modal">

        <!-- 상태 뱃지 -->
        <div class="detail-badges">
          <ClubBadge type="scheduleType"   :value="selectedSchedule.scheduleType" />
          <ClubBadge type="scheduleStatus" :value="selectedSchedule.status" />
        </div>

        <!-- 제목 -->
        <h2 class="detail-title">{{ selectedSchedule.title }}</h2>

        <!-- 정보 그리드 -->
        <div class="detail-info-grid">
          <div class="info-item">
            <span class="info-label">📅 시작</span>
            <span>{{ formatDatetime(selectedSchedule.startedAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🏁 종료</span>
            <span>{{ formatDatetime(selectedSchedule.endedAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📍 장소</span>
            <span>
              {{ selectedSchedule.location ?? '-' }}
              <span v-if="selectedSchedule.locationDetail" class="text-gray">
                ({{ selectedSchedule.locationDetail }})
              </span>
            </span>
          </div>
          <div class="info-item" v-if="selectedSchedule.locationUrl">
            <span class="info-label">🗺️ 지도</span>
            <a :href="selectedSchedule.locationUrl" target="_blank" class="link">지도 보기</a>
          </div>
          <div class="info-item">
            <span class="info-label">👥 인원</span>
            <span>
              {{ selectedSchedule.currentParticipants ?? 0 }}명 신청
              <template v-if="selectedSchedule.maxParticipants">
                / 최대 {{ selectedSchedule.maxParticipants }}명
              </template>
            </span>
          </div>
          <div class="info-item" v-if="selectedSchedule.applyDeadline">
            <span class="info-label">⏰ 신청마감</span>
            <span :class="{ 'text-red': isDeadlinePassed(selectedSchedule.applyDeadline) }">
              {{ formatDatetime(selectedSchedule.applyDeadline) }}
            </span>
          </div>
          <div class="info-item" v-if="selectedSchedule.isTeamRequired">
            <span class="info-label">🏃 팀 배정</span>
            <span>팀당 {{ selectedSchedule.teamSize }}명</span>
          </div>
        </div>

        <!-- 설명 -->
        <div v-if="selectedSchedule.description" class="detail-desc">
          <p class="info-label">📝 활동 내용</p>
          <p class="desc-text">{{ selectedSchedule.description }}</p>
        </div>

        <!-- 취소 사유 -->
        <div
          v-if="selectedSchedule.status === 'CANCELLED' && selectedSchedule.cancelReason"
          class="cancel-reason"
        >
          <p class="info-label">❌ 취소 사유</p>
          <p>{{ selectedSchedule.cancelReason }}</p>
        </div>

        <!-- 참여자 목록 (임원 이상) -->
        <div v-if="isExecutiveAbove" class="participants-section">
          <p class="info-label">참여 신청자 ({{ participants.length }}명)</p>
          <div class="participants-list">
            <div
              v-for="p in participants"
              :key="p.clubMemberId"
              class="participant-item"
            >
              <img :src="p.profileImage || '/default-avatar.png'" class="avatar-xs" />
              <span class="p-name">{{ p.name }}</span>
              <span class="p-dept text-gray">{{ p.department }}</span>
              <span
                class="p-status"
                :class="p.isAttended ? 'text-green' : 'text-gray'"
              >
                {{ p.isAttended ? '✅ 출석' : '— 미확인' }}
              </span>
              <!-- 임원: 출석 수동 처리 -->
              <button
                v-if="isExecutiveAbove && selectedSchedule.status !== 'SCHEDULED'"
                class="btn btn-outline xs"
                @click="toggleAttendance(p)"
              >
                {{ p.isAttended ? '출석취소' : '출석처리' }}
              </button>
            </div>
            <div v-if="participants.length === 0" class="empty-sm">신청자가 없습니다.</div>
          </div>
        </div>

      </div>

      <template #footer>
        <button class="btn btn-outline" @click="showDetailModal = false">닫기</button>
        <button
          v-if="isExecutiveAbove && selectedSchedule"
          class="btn btn-outline"
          @click="openEditModal(selectedSchedule); showDetailModal = false"
        >
          수정
        </button>
      </template>
    </BaseModal>


    <!-- ===== 일정 생성/수정 모달 ===== -->
    <BaseModal v-model="showFormModal" size="lg">
      <template #title>{{ isEditing ? '일정 수정' : '일정 추가' }}</template>

      <div class="form-grid">
        <div class="form-row full">
          <label>제목 <span class="required">*</span></label>
          <input v-model="form.title" placeholder="일정 제목을 입력하세요" />
        </div>

        <div class="form-row">
          <label>일정 유형 <span class="required">*</span></label>
          <select v-model="form.scheduleType">
            <option value="REGULAR">정기모임</option>
            <option value="SPECIAL">특별활동</option>
            <option value="COMPETITION">대회</option>
            <option value="WORKSHOP">워크숍</option>
            <option value="PARTY">회식</option>
            <option value="ETC">기타</option>
          </select>
        </div>

        <div class="form-row">
          <label>상태 <span class="required">*</span></label>
          <select v-model="form.status">
            <option value="SCHEDULED">예정</option>
            <option value="ONGOING">진행중</option>
            <option value="COMPLETED">완료</option>
            <option value="CANCELLED">취소</option>
          </select>
        </div>

        <div class="form-row">
          <label>시작 일시 <span class="required">*</span></label>
          <input v-model="form.startedAt" type="datetime-local" />
        </div>

        <div class="form-row">
          <label>종료 일시</label>
          <input v-model="form.endedAt" type="datetime-local" />
        </div>

        <div class="form-row">
          <label>장소</label>
          <input v-model="form.location" placeholder="장소명" />
        </div>

        <div class="form-row">
          <label>상세 장소</label>
          <input v-model="form.locationDetail" placeholder="상세 주소" />
        </div>

        <div class="form-row full">
          <label>지도 링크</label>
          <input v-model="form.locationUrl" placeholder="https://..." />
        </div>

        <div class="form-row full">
          <label>활동 내용</label>
          <textarea v-model="form.description" rows="3" placeholder="활동 내용을 입력하세요" />
        </div>

        <div class="form-row">
          <label>최대 참여 인원</label>
          <input v-model.number="form.maxParticipants" type="number" placeholder="제한 없음" />
        </div>

        <div class="form-row">
          <label>신청 마감</label>
          <input v-model="form.applyDeadline" type="datetime-local" />
        </div>

        <div class="form-row full">
          <label class="checkbox-label">
            <input v-model="form.isTeamRequired" type="checkbox" />
            팀 배정 필요
          </label>
        </div>

        <div class="form-row" v-if="form.isTeamRequired">
          <label>팀당 인원</label>
          <input v-model.number="form.teamSize" type="number" placeholder="4" />
        </div>

        <!-- 출석 체크 설정 -->
        <div class="form-section-title full">출석 체크 설정</div>

        <div class="form-row">
          <label>출석 코드</label>
          <div class="input-with-btn">
            <input v-model="form.checkInCode" placeholder="자동생성 가능" maxlength="10" />
            <button class="btn btn-outline sm" type="button" @click="generateCode">생성</button>
          </div>
        </div>

        <div class="form-row">
          <label>출석 시작</label>
          <input v-model="form.checkInStart" type="datetime-local" />
        </div>

        <div class="form-row">
          <label>출석 마감</label>
          <input v-model="form.checkInEnd" type="datetime-local" />
        </div>

        <!-- 취소 사유 (취소 상태일 때만) -->
        <div class="form-row full" v-if="form.status === 'CANCELLED'">
          <label>취소 사유</label>
          <textarea v-model="form.cancelReason" rows="2" placeholder="취소 사유를 입력하세요" />
        </div>
      </div>

      <template #footer>
        <button class="btn btn-outline" @click="showFormModal = false">취소</button>
        <button class="btn btn-primary" @click="saveSchedule">
          {{ isEditing ? '수정' : '추가' }}
        </button>
      </template>
    </BaseModal>


    <!-- ===== 출석 체크 모달 ===== -->
    <BaseModal v-model="showCheckInModal" size="sm">
      <template #title>출석 체크</template>

      <div class="checkin-modal">
        <p class="checkin-guide">출석 코드 4~10자리를 입력해주세요</p>
        <input
          v-model="checkInCode"
          class="checkin-input"
          placeholder="출석 코드"
          maxlength="10"
          @keyup.enter="submitCheckIn"
        />
        <p v-if="checkInError" class="checkin-error">{{ checkInError }}</p>
      </div>

      <template #footer>
        <button class="btn btn-outline" @click="showCheckInModal = false">취소</button>
        <button class="btn btn-primary" @click="submitCheckIn">확인</button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute }                 from 'vue-router'
import { useUiStore }               from '@/stores/ui'
import ClubBadge      from '@/components/club/ClubBadge.vue'
import BaseModal      from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'


const route  = useRoute()
const ui     = useUiStore()
const clubId = computed(() => route.params.clubId)

// ── 일정 목록 ─────────────────────────────────────────
const schedules   = ref([])
const loading     = ref(false)
const page        = ref(1)
const totalPages  = ref(1)
const filterType   = ref('')
const filterStatus = ref('')

const stats = ref({
  total: 0, scheduled: 0, completed: 0, cancelled: 0, avgAttendance: 0,
})

// ── 뷰 모드 ───────────────────────────────────────────
const viewMode = ref('list')   // 'list' | 'calendar'

// ── 달력 ──────────────────────────────────────────────
const today    = new Date()
const calYear  = ref(today.getFullYear())
const calMonth = ref(today.getMonth() + 1)

const calendarCells = computed(() => {
  const firstDay = new Date(calYear.value, calMonth.value - 1, 1)
  const lastDay  = new Date(calYear.value, calMonth.value, 0)
  const cells    = []

  // 앞 빈칸
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(firstDay)
    d.setDate(d.getDate() - (firstDay.getDay() - i))
    cells.push({ key: `prev-${i}`, day: d.getDate(), isCurrentMonth: false, isToday: false, schedules: [] })
  }

  // 이번 달
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date     = new Date(calYear.value, calMonth.value - 1, d)
    const dateStr  = date.toISOString().slice(0, 10)
    const isToday  = dateStr === today.toISOString().slice(0, 10)
    const dayScheds = schedules.value.filter(s =>
      s.startedAt?.slice(0, 10) === dateStr
    )
    cells.push({ key: `cur-${d}`, day: d, isCurrentMonth: true, isToday, schedules: dayScheds })
  }

  // 뒤 빈칸 (6주 맞춤)
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ key: `next-${i}`, day: i, isCurrentMonth: false, isToday: false, schedules: [] })
  }

  return cells
})

function prevMonth() {
  if (calMonth.value === 1) { calYear.value--; calMonth.value = 12 }
  else calMonth.value--
}
function nextMonth() {
  if (calMonth.value === 12) { calYear.value++; calMonth.value = 1 }
  else calMonth.value++
}

// ── 모달 상태 ─────────────────────────────────────────
const showDetailModal  = ref(false)
const showFormModal    = ref(false)
const showCheckInModal = ref(false)
const selectedSchedule = ref(null)
const participants     = ref([])
const isEditing        = ref(false)

const checkInCode  = ref('')
const checkInError = ref('')

// ── 폼 기본값 ─────────────────────────────────────────
const defaultForm = () => ({
  title:           '',
  description:     '',
  location:        '',
  locationDetail:  '',
  locationUrl:     '',
  startedAt:       '',
  endedAt:         '',
  scheduleType:    'REGULAR',
  status:          'SCHEDULED',
  maxParticipants: null,
  applyDeadline:   '',
  isTeamRequired:  false,
  teamSize:        null,
  checkInCode:     '',
  checkInStart:    '',
  checkInEnd:      '',
  cancelReason:    '',
})
const form = ref(defaultForm())

// ── API ───────────────────────────────────────────────
async function loadSemesters() {
  const res        = await fetchSemesters(clubId.value)
  semesters.value  = res.data
  const current    = res.data.find(s => s.isCurrent) ?? res.data[0]
  if (current) {
    selectedSemesterId.value = current.semesterId
    await loadSchedules()
  }
}

async function loadSchedules() {
  loading.value = true
  try {
    const res = await fetchSchedules(clubId.value, {
      semesterId: selectedSemesterId.value,
      page:       page.value,
      type:       filterType.value,
      status:     filterStatus.value,
    })
    schedules.value  = res.data.content
    totalPages.value = res.data.totalPages
    stats.value      = res.data.stats
  } finally {
    loading.value = false
  }
}

// 일정 저장 (생성/수정)
async function saveSchedule() {
  if (!form.value.title) {
    await ui.alert('입력 오류', '제목을 입력해주세요.')
    return
  }
  if (!form.value.startedAt) {
    await ui.alert('입력 오류', '시작 일시를 입력해주세요.')
    return
  }

  try {
    if (isEditing.value) {
      await updateSchedule(selectedSchedule.value.scheduleId, {
        ...form.value,
        semesterId: selectedSemesterId.value,
      })
      await ui.alert('수정 완료', '일정이 수정되었습니다.')
    } else {
      await createSchedule(clubId.value, {
        ...form.value,
        semesterId: selectedSemesterId.value,
      })
      await ui.alert('추가 완료', '일정이 추가되었습니다.')
    }
    showFormModal.value = false
    await loadSchedules()
  } catch {
    await ui.alert('오류', '처리 중 문제가 발생했습니다.')
  }
}

// 참여 신청
async function applySchedule(schedule) {
  const ok = await ui.confirm('참여 신청', `${schedule.title}에 참여 신청하시겠습니까?`)
  if (!ok) return
  await applyToSchedule(schedule.scheduleId)
  await ui.alert('신청 완료', '참여 신청이 완료되었습니다.')
  await loadSchedules()
}

// 참여 취소
async function cancelSchedule(schedule) {
  const ok = await ui.confirm('신청 취소', '참여 신청을 취소하시겠습니까?')
  if (!ok) return
  await cancelFromSchedule(schedule.scheduleId)
  await loadSchedules()
}

// 출석 체크
function openCheckInModal(schedule) {
  selectedSchedule.value = schedule
  checkInCode.value      = ''
  checkInError.value     = ''
  showCheckInModal.value = true
}

async function submitCheckIn() {
  if (!checkInCode.value) {
    checkInError.value = '출석 코드를 입력해주세요.'
    return
  }
  try {
    await checkInSchedule(selectedSchedule.value.scheduleId, checkInCode.value)
    showCheckInModal.value = false
    await ui.alert('출석 완료', '출석 처리가 완료되었습니다.')
    await loadSchedules()
  } catch {
    checkInError.value = '출석 코드가 올바르지 않습니다.'
  }
}

// 참여자 출석 수동 처리
async function toggleAttendance(participant) {
  await updateAttendance(
    selectedSchedule.value.scheduleId,
    participant.clubMemberId,
    !participant.isAttended
  )
  // 참여자 목록 새로고침
  const res      = await fetchParticipants(selectedSchedule.value.scheduleId)
  participants.value = res.data
}

// ── 모달 열기 ─────────────────────────────────────────
function openCreateModal() {
  isEditing.value     = false
  form.value          = defaultForm()
  showFormModal.value = true
}

function openEditModal(schedule) {
  isEditing.value        = true
  selectedSchedule.value = schedule
  form.value = {
    title:           schedule.title,
    description:     schedule.description     ?? '',
    location:        schedule.location        ?? '',
    locationDetail:  schedule.locationDetail  ?? '',
    locationUrl:     schedule.locationUrl     ?? '',
    startedAt:       schedule.startedAt?.slice(0, 16) ?? '',
    endedAt:         schedule.endedAt?.slice(0, 16)   ?? '',
    scheduleType:    schedule.scheduleType,
    status:          schedule.status,
    maxParticipants: schedule.maxParticipants ?? null,
    applyDeadline:   schedule.applyDeadline?.slice(0, 16) ?? '',
    isTeamRequired:  schedule.isTeamRequired,
    teamSize:        schedule.teamSize ?? null,
    checkInCode:     schedule.checkInCode    ?? '',
    checkInStart:    schedule.checkInStart?.slice(0, 16) ?? '',
    checkInEnd:      schedule.checkInEnd?.slice(0, 16)   ?? '',
    cancelReason:    schedule.cancelReason   ?? '',
  }
  showFormModal.value = true
}

async function openDetailModal(schedule) {
  selectedSchedule.value = schedule
  showDetailModal.value  = true
  if (isExecutiveAbove.value) {
    const res      = await fetchParticipants(schedule.scheduleId)
    participants.value = res.data
  }
}

// ── 유틸 ──────────────────────────────────────────────
function generateCode() {
  form.value.checkInCode = Math.random().toString(36).slice(2, 8).toUpperCase()
}

function isDeadlinePassed(deadline) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

function onPageChange(p) {
  page.value = p
  loadSchedules()
}

function termLabel(t)       { return { '1': '1학기', '2': '2학기', SUMMER: '여름', WINTER: '겨울' }[t] ?? t }
function formatMonth(dt)    { return dt ? `${new Date(dt).getMonth() + 1}월` : '-' }
function formatDay(dt)      { return dt ? new Date(dt).getDate() : '-' }
function formatWeekday(dt)  { return dt ? ['일','월','화','수','목','금','토'][new Date(dt).getDay()] : '' }
function formatTime(dt)     { return dt ? dt.slice(11, 16) : '-' }
function formatDatetime(dt) { return dt ? dt.slice(0, 16).replace('T', ' ') : '-' }

onMounted(loadSemesters)
</script>

<style scoped>
.club-schedule-page { display: flex; flex-direction: column; gap: 20px; }

/* ── 툴바 ──────────────────────────────────────────── */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.semester-select, .filter-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.88rem;
  background: #fff;
  cursor: pointer;
}
.view-toggle {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.view-toggle button {
  padding: 8px 14px;
  border: none;
  background: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
}
.view-toggle button.active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

/* ── 통계 카드 ─────────────────────────────────────── */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: center;
}
.stat-label { font-size: 0.8rem; color: #9ca3af; margin-bottom: 4px; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #111; }
.stat-value span { font-size: 0.85rem; color: #9ca3af; }
.stat-value.blue  { color: #2563eb; }
.stat-value.green { color: #16a34a; }
.stat-value.red   { color: #dc2626; }

/* ── 목록 뷰 ───────────────────────────────────────── */
.list-view { display: flex; flex-direction: column; gap: 10px; }

.schedule-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.15s;
  border-left: 4px solid transparent;
}
.schedule-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.07); }

/* 상태별 왼쪽 라인 색상 */
.status-scheduled  { border-left-color: #2563eb; }
.status-ongoing    { border-left-color: #16a34a; }
.status-completed  { border-left-color: #9ca3af; }
.status-cancelled  { border-left-color: #dc2626; opacity: 0.6; }

/* 날짜 */
.schedule-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
  gap: 1px;
}
.date-month   { font-size: 0.75rem; color: #9ca3af; }
.date-day     { font-size: 1.6rem; font-weight: 700; color: #111; line-height: 1; }
.date-weekday { font-size: 0.75rem; color: #6b7280; }

/* 내용 */
.schedule-content { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow: hidden; }
.content-top { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.team-badge {
  padding: 2px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}
.schedule-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.schedule-meta {
  display: flex;
  gap: 14px;
  font-size: 0.8rem;
  color: #9ca3af;
  flex-wrap: wrap;
}

/* 액션 */
.schedule-action {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.applied-label  { font-size: 0.82rem; color: #16a34a; font-weight: 600; }
.checked-label  { font-size: 0.82rem; color: #16a34a; font-weight: 600; }
.attended-label { font-size: 0.82rem; color: #16a34a; font-weight: 600; }
.absent-label   { font-size: 0.82rem; color: #dc2626; font-weight: 600; }
.no-apply-label { font-size: 0.82rem; color: #9ca3af; }
.icon-btn       { padding: 6px 8px !important; }

/* ── 달력 뷰 ───────────────────────────────────────── */
.calendar-view { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}
.cal-nav {
  width: 32px; height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  color: #6b7280;
}
.cal-nav:hover { background: #f3f4f6; }
.cal-title { font-size: 1rem; font-weight: 700; color: #111; }

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.cal-weekday {
  padding: 10px 0;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}
.cal-weekday.sunday   { color: #dc2626; }
.cal-weekday.saturday { color: #2563eb; }

.cal-cell {
  min-height: 90px;
  padding: 6px;
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}
.cal-cell:nth-child(7n) { border-right: none; }
.cal-cell.other-month   { background: #fafafa; }
.cal-cell.today .cal-day {
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  width: 24px; height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-day {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  display: inline-block;
  width: 24px; height: 24px;
  line-height: 24px;
  text-align: center;
}
.other-month .cal-day { color: #d1d5db; }

.cal-events { display: flex; flex-direction: column; gap: 2px; }
.cal-event {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.event-regular     { background: #dbeafe; color: #1d4ed8; }
.event-special     { background: #fce7f3; color: #9d174d; }
.event-competition { background: #fef3c7; color: #d97706; }
.event-workshop    { background: #dcfce7; color: #15803d; }
.event-party       { background: #ede9fe; color: #6d28d9; }
.event-etc         { background: #f3f4f6; color: #6b7280; }

/* ── 상세 모달 ─────────────────────────────────────── */
.detail-modal      { display: flex; flex-direction: column; gap: 16px; }
.detail-badges     { display: flex; gap: 8px; }
.detail-title      { font-size: 1.3rem; font-weight: 700; color: #111; margin: 0; }
.detail-info-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-item         { display: flex; flex-direction: column; gap: 3px; }
.info-label        { font-size: 0.8rem; font-weight: 600; color: #9ca3af; margin-bottom: 2px; }
.detail-desc       { display: flex; flex-direction: column; gap: 4px; }
.desc-text         { font-size: 0.9rem; color: #374151; line-height: 1.6; white-space: pre-line; }
.cancel-reason     { background: #fef2f2; border-radius: 8px; padding: 12px; }
.cancel-reason p   { color: #dc2626; margin: 0; }

/* 참여자 */
.participants-section  { display: flex; flex-direction: column; gap: 8px; }
.participants-list     { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.participant-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.88rem;
}
.avatar-xs { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; }
.p-name    { font-weight: 600; color: #111; min-width: 60px; }
.p-dept    { flex: 1; font-size: 0.8rem; }
.p-status  { font-size: 0.8rem; font-weight: 600; min-width: 60px; }

/* ── 폼 모달 ───────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.form-row { display: flex; flex-direction: column; gap: 5px; }
.form-row.full { grid-column: 1 / -1; }
.form-row label { font-size: 0.82rem; font-weight: 600; color: #374151; }
.form-row input, .form-row select, .form-row textarea {
  padding: 9px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border 0.15s;
}
.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus { border-color: #2563eb; }
.form-row textarea { resize: vertical; }
.form-section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  padding-top: 4px;
  border-top: 1px solid #f3f4f6;
}
.input-with-btn { display: flex; gap: 6px; }
.input-with-btn input { flex: 1; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }
.required { color: #dc2626; }

/* ── 출석 체크 모달 ────────────────────────────────── */
.checkin-modal  { display: flex; flex-direction: column; gap: 12px; }
.checkin-guide  { font-size: 0.9rem; color: #6b7280; margin: 0; }
.checkin-input  {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 0.2em;
  font-weight: 700;
  outline: none;
}
.checkin-input:focus { border-color: #2563eb; }
.checkin-error  { color: #dc2626; font-size: 0.85rem; margin: 0; }

/* ── 버튼 ──────────────────────────────────────────── */
.btn         { padding: 8px 18px; border-radius: 8px; font-size: 0.88rem; cursor: pointer; border: none; font-weight: 600; transition: all 0.15s; }
.btn.sm      { padding: 5px 12px; font-size: 0.82rem; }
.btn.xs      { padding: 3px 8px;  font-size: 0.78rem; }
.btn-primary { background: #2563eb; color: #fff; }
.btn-primary:hover   { background: #1d4ed8; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
.btn-success { background: #16a34a; color: #fff; }
.btn-success:hover { background: #15803d; }
.btn-outline { background: #fff; border: 1px solid #e5e7eb; color: #374151; }
.btn-outline:hover { background: #f3f4f6; }

/* ── 공통 ──────────────────────────────────────────── */
.loading   { text-align: center; padding: 40px; color: #9ca3af; }
.empty     { text-align: center; padding: 60px; color: #9ca3af; }
.empty-sm  { text-align: center; padding: 12px; color: #9ca3af; font-size: 0.85rem; }
.text-gray { color: #9ca3af; }
.text-red  { color: #dc2626; }
.text-green{ color: #16a34a; }
.link      { color: #2563eb; text-decoration: none; font-size: 0.9rem; }
.link:hover{ text-decoration: underline; }

@media (max-width: 768px) {
  .stat-cards      { grid-template-columns: repeat(3, 1fr); }
  .form-grid       { grid-template-columns: 1fr; }
  .detail-info-grid{ grid-template-columns: 1fr; }
  .schedule-item   { flex-wrap: wrap; }
}
</style>
