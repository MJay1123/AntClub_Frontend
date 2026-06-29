<template>
  <div class="club-due-page">

    <!-- ===== 학기 선택 ===== -->
    <div class="semester-tabs">
      <button
        v-for="sem in semesters"
        :key="sem.semesterId"
        class="sem-tab"
        :class="{ active: selectedSemesterId === sem.semesterId }"
        @click="selectSemester(sem.semesterId)"
      >
        {{ sem.year }}년 {{ termLabel(sem.term) }}
        <span v-if="sem.isCurrent" class="current-badge">현재</span>
      </button>

      <!-- 임원 이상: 학기 추가 -->
      <button
        v-if="isExecutiveAbove"
        class="sem-tab add-tab"
        @click="showSemesterModal = true"
      >
        + 학기 추가
      </button>
    </div>

    <!-- ===== 선택된 학기 회비 정보 ===== -->
    <div v-if="selectedSemester" class="due-header">

      <div class="due-info-card">
        <div class="due-amounts">
          <div class="amount-item">
            <p class="amount-label">설정 회비</p>
            <p class="amount-value primary">
              {{ selectedSemester.due?.toLocaleString() ?? '미설정' }}원
            </p>
          </div>
          <div class="amount-item">
            <p class="amount-label">총 수납액</p>
            <p class="amount-value success">{{ summary.totalPaid.toLocaleString() }}원</p>
          </div>
          <div class="amount-item">
            <p class="amount-label">미납액</p>
            <p class="amount-value danger">{{ summary.totalUnpaid.toLocaleString() }}원</p>
          </div>
          <div class="amount-item">
            <p class="amount-label">납부율</p>
            <p class="amount-value">{{ summary.paidRate.toFixed(1) }}%</p>
          </div>
        </div>

        <!-- 계좌 정보 -->
        <div class="bank-info" v-if="selectedSemester.bankName">
          <span class="bank-icon">🏦</span>
          {{ selectedSemester.bankName }}
          {{ selectedSemester.accountNumber }}
          ({{ selectedSemester.accountHolder }})
        </div>

        <!-- 임원 이상: 학기 수정 -->
        <button
          v-if="isExecutiveAbove"
          class="btn btn-outline sm"
          @click="editSemester"
        >
          학기 설정 수정
        </button>
      </div>

      <!-- 납부 현황 프로그레스 바 -->
      <div class="progress-wrap">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: summary.paidRate + '%' }"
          />
        </div>
        <span class="progress-text">{{ summary.paidCount }} / {{ summary.totalCount }}명 납부</span>
      </div>
    </div>

    <!-- ===== 회비 납부 현황 테이블 ===== -->
    <div class="table-wrap">
      <div class="table-toolbar">
        <input
          v-model="searchKeyword"
          placeholder="이름, 학번 검색"
          class="search-input"
          @input="onSearch"
        />
        <select v-model="filterStatus" @change="loadPayments">
          <option value="">전체</option>
          <option value="PAID">완납</option>
          <option value="PARTIAL">부분납부</option>
          <option value="UNPAID">미납</option>
          <option value="EXEMPTED">면제</option>
        </select>

        <!-- 임원 이상: 일괄 알림 -->
        <button
          v-if="isExecutiveAbove"
          class="btn btn-outline sm"
          @click="sendReminder"
        >
          📢 미납자 알림
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>납부 금액</th>
            <th>납부일</th>
            <th>납부 방법</th>
            <th>상태</th>
            <th v-if="isExecutiveAbove">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in payments"
            :key="p.paymentId"
          >
            <td>{{ p.memberName }}</td>
            <td>{{ p.studentId }}</td>
            <td>
              <span v-if="p.paidAmount">{{ p.paidAmount.toLocaleString() }}원</span>
              <span v-else class="text-gray">-</span>
            </td>
            <td>{{ formatDate(p.paidAt) }}</td>
            <td>{{ paymentMethodLabel(p.paymentMethod) }}</td>
            <td>
              <span class="status-badge" :class="statusClass(p.status)">
                {{ statusLabel(p.status) }}
              </span>
            </td>
            <td v-if="isExecutiveAbove">
              <button
                class="btn btn-primary sm"
                @click="openPaymentModal(p)"
              >
                수정
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="payments.length === 0" class="empty">납부 내역이 없습니다.</div>
    </div>

    <BasePagination
      :current-page="page"
      :total-pages="totalPages"
      @change="onPageChange"
    />

    <!-- ===== 학기 설정 모달 ===== -->
    <BaseModal
      v-if="showSemesterModal"
      @close="showSemesterModal = false"
    >
      <template #title>
        {{ editingSemester ? '학기 수정' : '학기 추가' }}
      </template>
      <div class="modal-form">
        <div class="form-row">
          <label>연도</label>
          <input v-model="semesterForm.year" type="number" placeholder="2024" />
        </div>
        <div class="form-row">
          <label>학기</label>
          <select v-model="semesterForm.term">
            <option value="1">1학기</option>
            <option value="2">2학기</option>
            <option value="SUMMER">여름학기</option>
            <option value="WINTER">겨울학기</option>
          </select>
        </div>
        <div class="form-row">
          <label>시작일</label>
          <input v-model="semesterForm.startDate" type="date" />
        </div>
        <div class="form-row">
          <label>종료일</label>
          <input v-model="semesterForm.endDate" type="date" />
        </div>
        <div class="form-row">
          <label>회비 (원)</label>
          <input v-model="semesterForm.due" type="number" placeholder="30000" />
        </div>
        <div class="form-row">
          <label>은행명</label>
          <input v-model="semesterForm.bankName" placeholder="카카오뱅크" />
        </div>
        <div class="form-row">
          <label>계좌번호</label>
          <input v-model="semesterForm.accountNumber" placeholder="0000-00-0000000" />
        </div>
        <div class="form-row">
          <label>예금주</label>
          <input v-model="semesterForm.accountHolder" />
        </div>
        <div class="form-row">
          <label>현재 학기</label>
          <input v-model="semesterForm.isCurrent" type="checkbox" />
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="showSemesterModal = false">취소</button>
        <button class="btn btn-primary" @click="saveSemester">저장</button>
      </template>
    </BaseModal>

    <!-- ===== 납부 수정 모달 ===== -->
    <BaseModal
      v-if="showPaymentModal"
      @close="showPaymentModal = false"
    >
      <template #title>납부 정보 수정</template>
      <div class="modal-form">
        <div class="form-row">
          <label>납부 금액</label>
          <input v-model="paymentForm.paidAmount" type="number" />
        </div>
        <div class="form-row">
          <label>납부 방법</label>
          <select v-model="paymentForm.paymentMethod">
            <option value="CASH">현금</option>
            <option value="TRANSFER">계좌이체</option>
            <option value="CARD">카드</option>
          </select>
        </div>
        <div class="form-row">
          <label>납부 상태</label>
          <select v-model="paymentForm.status">
            <option value="UNPAID">미납</option>
            <option value="PARTIAL">부분납부</option>
            <option value="PAID">완납</option>
            <option value="EXEMPTED">면제</option>
          </select>
        </div>
        <div class="form-row">
          <label>납부일</label>
          <input v-model="paymentForm.paidAt" type="datetime-local" />
        </div>
        <div class="form-row">
          <label>메모</label>
          <input v-model="paymentForm.memo" placeholder="메모" />
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="showPaymentModal = false">취소</button>
        <button class="btn btn-primary" @click="savePayment">저장</button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute }                        from 'vue-router'
import {
  fetchSemesters,
  createSemester,
  updateSemester,
} from '@/api/semester'
import {
  fetchDuePayments,
  updateDuePayment,
  sendDueReminder,
} from '@/api/duePayment'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseModal      from '@/components/common/BaseModal.vue'

const props = defineProps({
  myRole: { type: String, default: 'MEMBER' },
})

const route  = useRoute()
const clubId = computed(() => route.params.clubId)

// ── 학기 ──────────────────────────────────────────────
const semesters          = ref([])
const selectedSemesterId = ref(null)
const selectedSemester   = computed(() =>
  semesters.value.find(s => s.semesterId === selectedSemesterId.value)
)

// ── 납부 현황 ─────────────────────────────────────────
const payments     = ref([])
const summary      = ref({ totalPaid: 0, totalUnpaid: 0, paidRate: 0, paidCount: 0, totalCount: 0 })
const page         = ref(1)
const totalPages   = ref(1)
const searchKeyword = ref('')
const filterStatus = ref('')

// ── 모달 ──────────────────────────────────────────────
const showSemesterModal = ref(false)
const editingSemester   = ref(false)
const semesterForm      = ref({})

const showPaymentModal  = ref(false)
const selectedPayment   = ref(null)
const paymentForm       = ref({})

const isExecutiveAbove = computed(() =>
  ['PRESIDENT', 'EXECUTIVE'].includes(props.myRole)
)

// ── API 호출 ──────────────────────────────────────────
async function loadSemesters() {
  const res       = await fetchSemesters(clubId.value)
  semesters.value = res.data
  const current   = res.data.find(s => s.isCurrent) ?? res.data[0]
  if (current) selectSemester(current.semesterId)
}

async function loadPayments() {
  if (!selectedSemesterId.value) return
  const res = await fetchDuePayments(selectedSemesterId.value, {
    page:    page.value,
    keyword: searchKeyword.value,
    status:  filterStatus.value,
  })
  payments.value   = res.data.content
  totalPages.value = res.data.totalPages
  summary.value    = res.data.summary
}

function selectSemester(id) {
  selectedSemesterId.value = id
  page.value = 1
  loadPayments()
}

// 학기 저장
async function saveSemester() {
  if (editingSemester.value) {
    await updateSemester(clubId.value, semesterForm.value.semesterId, semesterForm.value)
  } else {
    await createSemester(clubId.value, semesterForm.value)
  }
  showSemesterModal.value = false
  await loadSemesters()
}

function editSemester() {
  editingSemester.value   = true
  semesterForm.value      = { ...selectedSemester.value }
  showSemesterModal.value = true
}

// 납부 수정
function openPaymentModal(p) {
  selectedPayment.value  = p
  paymentForm.value      = { ...p }
  showPaymentModal.value = true
}

async function savePayment() {
  await updateDuePayment(paymentForm.value.paymentId, paymentForm.value)
  showPaymentModal.value = false
  await loadPayments()
}

async function sendReminder() {
  await sendDueReminder(selectedSemesterId.value)
  alert('미납자에게 알림을 발송했습니다.')
}

// ── 유틸 ──────────────────────────────────────────────
function onPageChange(p)  { page.value = p; loadPayments() }

let timer = null
function onSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => { page.value = 1; loadPayments() }, 400)
}

function termLabel(v)   { return { '1': '1학기', '2': '2학기', SUMMER: '여름', WINTER: '겨울' }[v] ?? v }
function statusLabel(v) { return { PAID: '완납', PARTIAL: '부분납부', UNPAID: '미납', EXEMPTED: '면제' }[v] ?? v }
function statusClass(v) { return { PAID: 'badge-green', PARTIAL: 'badge-yellow', UNPAID: 'badge-red', EXEMPTED: 'badge-gray' }[v] ?? '' }
function paymentMethodLabel(v) { return { CASH: '현금', TRANSFER: '계좌이체', CARD: '카드' }[v] ?? '-' }
function formatDate(d)  { return d ? d.slice(0, 10) : '-' }

onMounted(loadSemesters)
</script>

<style scoped>
.club-due-page { display: flex; flex-direction: column; gap: 24px; }

/* 학기 탭 */
.semester-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.sem-tab {
  padding: 8px 18px;
  border: 1px solid #ddd;
  border-radius: 99px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}
.sem-tab:hover { background: #f3f4f6; }
.sem-tab.active { background: #1a73e8; color: #fff; border-color: #1a73e8; }
.add-tab { border-style: dashed; color: #888; }
.current-badge {
  background: #22c55e;
  color: #fff;
  padding: 1px 7px;
  border-radius: 99px;
  font-size: 0.72rem;
}

/* 회비 헤더 */
.due-header { display: flex; flex-direction: column; gap: 12px; }
.due-info-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.due-amounts { display: flex; gap: 32px; flex: 1; }
.amount-item { text-align: center; }
.amount-label { font-size: 0.8rem; color: #888; margin-bottom: 4px; }
.amount-value { font-size: 1.4rem; font-weight: 700; color: #111; }
.amount-value.primary { color: #1a73e8; }
.amount-value.success { color: #22c55e; }
.amount-value.danger  { color: #ef4444; }

.bank-info { font-size: 0.85rem; color: #555; display: flex; align-items: center; gap: 6px; }

/* 프로그레스 */
.progress-wrap { display: flex; align-items: center; gap: 12px; }
.progress-bar  { flex: 1; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: #1a73e8; border-radius: 99px; transition: width 0.5s; }
.progress-text { font-size: 0.85rem; color: #555; white-space: nowrap; }

/* 테이블 */
.table-toolbar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.search-input  {
  flex: 1; min-width: 160px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}
.table-toolbar select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; }
thead { background: #f3f4f6; }
th, td { padding: 12px 14px; text-align: left; font-size: 0.88rem; border-bottom: 1px solid #f0f0f0; }
th { font-weight: 600; color: #555; }

/* 상태 뱃지 */
.status-badge  { padding: 3px 10px; border-radius: 99px; font-size: 0.78rem; font-weight: 600; }
.badge-green   { background: #dcfce7; color: #16a34a; }
.badge-yellow  { background: #fef3c7; color: #d97706; }
.badge-red     { background: #fee2e2; color: #dc2626; }
.badge-gray    { background: #f3f4f6; color: #6b7280; }

/* 모달 폼 */
.modal-form { display: flex; flex-direction: column; gap: 14px; }
.form-row   { display: flex; flex-direction: column; gap: 4px; }
.form-row label { font-size: 0.85rem; font-weight: 600; color: #555; }
.form-row input, .form-row select {
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

/* 버튼 */
.btn         { padding: 8px 18px; border-radius: 8px; font-size: 0.9rem; cursor: pointer; border: none; font-weight: 600; }
.btn.sm      { padding: 5px 12px; font-size: 0.82rem; }
.btn-primary { background: #1a73e8; color: #fff; }
.btn-outline { background: #fff; border: 1px solid #ddd; color: #333; }
.btn-outline:hover { background: #f3f4f6; }

.empty    { text-align: center; padding: 40px; color: #aaa; }
.text-gray{ color: #aaa; }
</style>
