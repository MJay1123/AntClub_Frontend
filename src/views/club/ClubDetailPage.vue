<template>  
  <div class="club-detail-page" v-if="club">

    <!-- ===== 배너 ===== -->
    <div class="banner" :style="club.bannerImage ? `background-image:url(${club.bannerImage})` : ''">

      <button class="btn-back" @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="back-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </button>

      <button 
        v-if="myClubMember?.clubRole === 'PRESIDENT' || myClubMember?.clubRole === 'EXECUTIVE'" 
        class="btn-admin" 
        @click="router.push(`/club/${club.clubId}/manage`)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="admin-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        동아리 관리
      </button>

      <div class="banner-overlay">
        <img :src="club.logoImage || defaultLogo" class="club-logo" alt="logo"/>
        <div class="banner-info">
          <div class="badges">
            <span class="badge category">{{ club.category }}</span>
            <span class="badge" :class="statusClass(club.status)">
              {{ statusLabel(club.status) }}
            </span>
            <span class="badge join-type">{{ joinTypeLabel(club.joinType) }}</span>
          </div>
          <h1>{{ club.clubName }}</h1>
          <p class="sub">{{ club.location }}</p>
        </div>
      </div>

    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>



    <div class="content-wrap">

      <main class="main-content">

        <div v-if="currentTab === 'info'" class="tab-content">
          <section class="card">
            <h2>동아리 소개</h2>
            <p class="description">{{ club.description || '등록된 소개글이 없습니다.' }}</p>
          </section>

          <section class="card">
            <h2>기본 정보</h2>
            <ul class="info-list">
              <li>
                <span class="label">📍 활동 장소</span>
                <span>{{ club.location || '-' }}</span>
              </li>
              <li>
                <span class="label">👥 최대 인원</span>
                <span>{{ club.maxMembers ? `${club.maxMembers}명` : '제한 없음' }}</span>
              </li>
              <li>
                <span class="label">📧 연락처</span>
                <span>{{ club.contactEmail || '-' }}</span>
              </li>
              <li>
                <span class="label">🔗 SNS</span>
                <a v-if="club.snsLink" :href="club.snsLink" target="_blank" class="link">
                  {{ club.snsLink }}
                </a>
                <span v-else>-</span>
              </li>
              <li>
                <span class="label">📅 개설일</span>
                <span>{{ formatDate(club.createdAt) }}</span>
              </li>
            </ul>
          </section>

          <section class="card">
            <h2>임원 소개</h2>
            <div class="executive-list">
              <div v-if="president" class="executive-item">
                <img :src="president.profileImage || defaultLogo" class="avatar" alt="avatar"/>
                <div>
                  <p class="exec-name">{{ president.name }}</p>
                  <p class="exec-role">{{ roleLabel(president.clubRole) }}</p>
                  <p class="exec-info">🏫{{ president.schoolName }} - {{ president.majorName }}</p>
                  <p class="exec-info">🎂{{ formatDate(president.birthDate) }} || 📞{{ formatPhoneNumber(president.phoneNumber) }}</p>
                </div>
              </div>

              <div v-for="exec in executives" :key="exec.clubMemberId" class="executive-item">
                <img :src="exec.profileImage || defaultLogo" class="avatar" alt="avatar"/>
                <div>
                  <p class="exec-name">{{ exec.name }}</p>
                  <p class="exec-role">{{ roleLabel(exec.clubRole) }}</p>
                  <p class="exec-info">🏫{{ exec.schoolName }} - {{ exec.majorName }}</p>
                  <p class="exec-info">🎂{{ formatDate(exec.birthDate) }} || 📞{{ formatPhoneNumber(exec.phoneNumber) }}</p>
                </div>
              </div>
              <p v-if="executives.length === 0 && !president" class="empty">임원 정보가 없습니다.</p>
            </div>
          </section>
        </div>

        <div v-else-if="currentTab === 'schedule'" class="tab-content">
          <section class="card">
            <h2>동아리 일정</h2>
            <p class="empty">등록된 일정이 없습니다. (개발 예정)</p>
          </section>
        </div>

        <div v-else-if="currentTab === 'board'" class="tab-content">
          <section class="card">
            <h2>동아리 게시판</h2>
            <p class="empty">등록된 게시글이 없습니다. (개발 예정)</p>
          </section>
        </div>

        <div v-else-if="currentTab === 'my-record'" class="tab-content">
          <section class="card">
            <h2>내 참여 기록</h2>
            <p class="empty">참여 기록이 없습니다. (개발 예정)</p>
          </section>
        </div>

      </main>

      <aside class="sidebar">
        <section class="card action-card">
          <template v-if="myClubMember">
            <div v-if="myClubMember.status === 'APPROVED'" class="joined-badge">
              ✅ 회원 유형 : {{ roleLabel(myClubMember.clubRole) }}
            </div>
            <div v-else-if="myClubMember.status === 'PENDING'" class="pending-badge">
              ⏳ 가입 승인 대기 중
            </div>
            <button v-if="myClubMember.status === 'PENDING'" class="btn btn-outline" @click="cancelApply">
              신청 취소
            </button>
          </template>

          <template v-else>
            <p class="join-guide">{{ club.joinType === 'FREE' ? '자유롭게 가입할 수 있습니다.' : '가입 신청 후 임원 승인이 필요합니다.' }}</p>
            <textarea
              v-if="club.joinType === 'APPROVAL'"
              v-model="joinReason"
              placeholder="가입 동기를 입력해주세요"
              class="textarea"
              rows="4"
            />
            <button class="btn btn-primary" :disabled="club.status !== 'ACTIVE'" @click="showModal=true">
              {{ club.status === 'ACTIVE' ? '가입 신청' : '가입 불가' }}
            </button>
          </template>
        </section>
        
        <section class="card">
          <h2>현재 학기</h2>
          <div class="due-info" v-if="currentSemester">
            <p class="semester-label">
              {{ currentSemester.year }}년 {{ termLabel(currentSemester.term) }}
            </p>
            <p class="due-amount">
              {{ currentSemester.due != null ? `${currentSemester.due.toLocaleString()}원` : '미정' }}
            </p>
            <p v-if="currentSemester.bankName" class="bank-info">
              {{ currentSemester.bankName }} {{ currentSemester.accountNumber }}
              ({{ currentSemester.accountHolder }})
            </p>
          </div>
          <div v-else class="due-info">
            <p class="semester-label">이번 학기가 설정되지 않았습니다.</p>
          </div>
        </section>

        <section class="card">
          <h2>동아리 현황</h2>
          <ul class="stat-list">
            <li>
              <span>전체 회원</span>
              <strong>{{ approvedMembers.length || '-' }}명</strong>
            </li>
            <li>
              <span>이번 학기 일정</span>
              <strong>개발 중입니다...</strong>
            </li>
            <li>
              <span>평균 참여율</span>
              <strong>개발 중입니다...</strong>
            </li>
          </ul>
        </section>
      </aside>

    </div>

    <BaseModal v-model="showModal">
      <template #title>가입 신청</template>
      
      <div class="join-form">
        <p style="margin-bottom: 12px;"><strong>[{{ club.clubName }}]</strong>에 가입 신청하시겠습니까?</p>
        
        <textarea
          v-model="joinReason"
          placeholder="가입 동기를 입력해주세요 (예: 재밌어보여서 지원했습니다.)"
          class="textarea"
          rows="3"
          style="width: 100%; margin-bottom: 8px;"
        ></textarea>
        
        <textarea
          v-model="memo"
          placeholder="메모를 입력해주세요 (예: 잘 부탁드립니다.)"
          class="textarea"
          rows="2"
          style="width: 100%;"
        ></textarea>
      </div>

      <template #footer>
        <button class="btn btn-outline" @click="showModal=false">취소</button>
        <button class="btn btn-primary" @click="confirmApply">신청</button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUiStore } from '@/stores/ui'
import { useClubStore } from '@/stores/club'
import { useClubMemberStore } from '@/stores/clubMember'
import { useSemesterStore } from '@/stores/semester'
import { memberApi } from '@/api/restApi'
import { clubMemberApi } from '@/api/restApi'


import BaseModal from '@/components/common/BaseModal.vue'
import defaultLogo from '@/assets/AntLogo.png'

const route     = useRoute()
const router    = useRouter()
const uiStore = useUiStore()
const clubStore = useClubStore()
const clubMemberStore = useClubMemberStore()
const semesterStore = useSemesterStore()

const { club } = storeToRefs(clubStore)
const { approvedMembers, presidentMember, executiveMembers, myClubMember } = storeToRefs(clubMemberStore)
const { currentSemester } = storeToRefs(semesterStore)

const president = ref(null)
const executives = ref([])

const currentTab = ref('info')
const tabs = [
  { id: 'info', name: '동아리 정보' },
  { id: 'schedule', name: '동아리 일정' },
  { id: 'board', name: '동아리 게시판' },
  { id: 'my-record', name: '내 참여 기록' },
]

const joinReason  = ref('')
const memo = ref('')
const showModal = ref(false)

const confirmApply = async () => {
  uiStore.isLoading = true
  let isSuccess = false

  try {
    const memberId = localStorage.getItem('memberId')
    const request = {
      clubId: route.params.clubId,
      memberId: memberId,
      clubRole: "MEMBER",
      status: "PENDING",
      joinReason: joinReason.value,
      memo: memo.value
    }
    await clubMemberApi.create(request)

    showModal.value = false
    joinReason.value = null
    memo.value = null
    isSuccess = true

    await fetchData()
  } catch (error) {
    uiStore.isError.value = true
    uiStore.errorMessage = '동아리 가입 신청에 실패하였습니다.'
    console.log('error', error)
  }
  if(isSuccess){
    uiStore.alert('신청 완료!', '동아리 가입이 신청되었습니다.')
  }
}

const cancelApply = async (clubMemberId) => {
  const answer = uiStore.confirm('동아리 가입 신청 취소', '정말 가입 신청을 취소하시겠습니까?')
  if(answer) {
    await clubMemberApi.delete(clubMemberId)
    await fetchData()
  }
}

// ── 유틸 ──────────────────────────────────────────────
function statusLabel(v)   {
  return { ACTIVE: '활동중', INACTIVE: '비활동', DISBANDED: '해체' }[v] ?? v
}
function statusClass(v)   {
  return { ACTIVE: 'badge-green', INACTIVE: 'badge-gray', DISBANDED: 'badge-red' }[v] ?? ''
}
function joinTypeLabel(v) {
  return { FREE: '자유가입', APPROVAL: '승인가입', CLOSED: '가입불가' }[v] ?? v
}
function roleLabel(v)     {
  return { PRESIDENT: '회장', EXECUTIVE: '임원', MEMBER: '회원' }[v] ?? v
}
function termLabel(v)     {
  return { 'FIRST': '1학기', 'SECOND': '2학기', SUMMER: '여름학기', WINTER: '겨울학기' }[v] ?? v
}

const formatDate = (datetime) => {
  const date = new Date(datetime)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}년 ${month}월 ${day}일`
}

const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  return phone.replace(
    /(\d{3})(\d{4})(\d{4})/,
    '$1-$2-$3'
  );
}


const fetchExecutives = async () => {
  const response = await memberApi.getMember(presidentMember.value.memberId)
  president.value = {
    ...presidentMember,
    ...response.data
  }
  console.log('president', president)
  executives.value = await Promise.all(
    executiveMembers.value.map(async member => {
      const response = await memberApi.getMember(member.memberId)
      
      return {
        ...member,
        ...response.data
      }
    })
  )
  console.log('executives', executives)
}

// ── API 호출 ──────────────────────────────────────────
const fetchData = async () => {
  uiStore.isLoading = true

  try {
    const clubId = route.params.clubId
    await clubStore.fetchClub(clubId)
    await clubMemberStore.fetchClubMembers(clubId)
    await clubMemberStore.fetchMe(clubId)

    await fetchExecutives()

    await semesterStore.fetchSemesters(clubId)

  } catch (error) {
    uiStore.isError = true
    uiStore.errorMessage = error.message || '로그인 중 오류가 발생했습니다.'
  } finally {
    uiStore.isLoading = false
  }
}

onMounted(async() => {
  await fetchData()
})

</script>

<style scoped>
.club-detail-page { max-width: 1100px; margin: 0 auto; padding-bottom: 60px; }

/* 배너 */
.banner {
  width: 100%;
  height: 240px;
  background: #1a73e8;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  position: relative
}

.banner-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.1));
  display: flex;
  align-items: flex-end;
  padding: 28px;
  gap: 20px;
}

.btn-back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px 8px 10px;
  
  /* 배너 위에서 잘 보이도록 반투명 유리 효과 */
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: #ffffff;
  
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back .back-icon {
  width: 16px;
  height: 16px;
}

.btn-back:hover {
  background-color: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-admin {
  position: absolute;
  top: 16px;
  right: 16px; /* 우측 상단 고정 */
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-admin:hover {
  background-color: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.4);
}

.admin-icon {
  width: 16px;
  height: 16px;
}

.tabs-container {
  width: 100%;
  max-width: 1200px; /* 사이트 본문 폭 맞춤 */
  margin: 24px auto 0;
  padding: 0 16px;
  border-bottom: 2px solid #e2e8f0;
}

.tabs {
  display: flex;
  gap: 8px;
}

/* 개별 탭 버튼 */
.tab-item {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #718096;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab-item:hover {
  color: #3182ce;
}

/* 활성화된 탭 밑줄 강조 */
.tab-item.active {
  color: #3182ce;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px; /* 부모 컨테이너 보더와 겹치게 처리 */
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3182ce;
}

/* 빈 상태 문구 스타일 */
.empty {
  text-align: center;
  color: #a0aec0;
  padding: 40px 0;
}

.club-logo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #fff;
}
.banner-info h1 { color: #fff; font-size: 1.8rem; font-weight: 700; margin: 6px 0 4px; }
.banner-info .sub { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
.badges { display: flex; gap: 6px; flex-wrap: wrap; }
.badge {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  color: #fff;
}
.badge-green  { background: #22c55e; }
.badge-gray   { background: #9ca3af; }
.badge-red    { background: #ef4444; }

/* 레이아웃 */
.content-wrap {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}
.main-content { display: flex; flex-direction: column; gap: 20px; }
.sidebar      { display: flex; flex-direction: column; gap: 20px; }

/* 카드 */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}
.card h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111;
}
.description { color: #444; line-height: 1.7; }

/* 정보 목록 */
.info-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.info-list li { display: flex; justify-content: space-between; font-size: 0.9rem; }
.label { color: #888; }
.link  { color: #1a73e8; text-decoration: none; }

/* 임원 */
.executive-list { display: flex; gap: 16px; flex-wrap: wrap; flex-direction: column; }
.executive-item { display: flex; gap: 10px; align-items: center; }
.avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.exec-name { font-weight: 600; font-size: 0.9rem; }
.exec-role { font-size: 0.78rem; color: #1a73e8; }
.exec-info { font-size: 0.78rem; color: #888; }


/* 액션 카드 */
.joined-badge  { color: #22c55e; font-weight: 600; margin-bottom: 8px; }
.pending-badge { color: #f59e0b; font-weight: 600; margin-bottom: 8px; }
.join-guide    { color: #555; font-size: 0.9rem; margin-bottom: 12px; }
.textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 12px;
  box-sizing: border-box;
}

/* 버튼 */
.btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  margin-top: 4px;
}
.btn-primary { background: #1a73e8; color: #fff; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
.btn-outline { background: #fff; border: 1px solid #ddd; color: #333; }

/* 회비 */
.due-info { text-align: center; }
.semester-label { font-size: 0.85rem; color: #888; margin-bottom: 4px; }
.due-amount { font-size: 1.6rem; font-weight: 700; color: #1a73e8; margin-bottom: 8px; }
.bank-info { font-size: 0.82rem; color: #555; }

/* 통계 */
.stat-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.stat-list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
.stat-list strong { color: #1a73e8; }

.loading-wrap { text-align: center; padding: 80px; color: #aaa; }
.empty        { color: #aaa; font-size: 0.9rem; }

@media (max-width: 768px) {
  .content-wrap { grid-template-columns: 1fr; }
}
</style>
