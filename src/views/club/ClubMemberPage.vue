<template>
  <div class="club-member-page">

    <div v-if="approvedMembers && presidentMember && executiveMembers && pendingMembers">
      <div class="stat-cards">
        <div class="stat-card">
          <p class="stat-label">전체 회원</p>
          <p class="stat-value">{{ approvedMembers?.length }}<span>명</span></p>
        </div>
        <div class="stat-card">
          <p class="stat-label">회장</p>
          <p class="stat-value">{{ presidentMember?.length || 1 }}<span>명</span></p>
        </div>
        <div class="stat-card">
          <p class="stat-label">임원</p>
          <p class="stat-value">{{ executiveMembers?.length }}<span>명</span></p>
        </div>
        <div class="stat-card">
          <p class="stat-label">일반 회원</p>
          <p class="stat-value">{{ approvedMembers?.length - (presidentMember?.length | 1) - executiveMembers?.length
          }}<span>명</span></p>
        </div>
        <div class="stat-card warn">
          <p class="stat-label">가입 대기</p>
          <p class="stat-value">{{ pendingMembers?.length }}<span>명</span></p>
        </div>
      </div>
    </div>

    <div v-if="pendingMembers.length" class="pending-section">
      <h3>⏳ 가입 대기 ({{ pendingMembers?.length }}명)</h3>
      <div class="pending-list">
        <div v-for="m in pendingMembers" :key="m.clubMemberId" class="pending-card" @click="openPendingMemberDetail(m)">
          <div class="member-info">
            <strong>{{ m.name }}</strong>
            <span class="student-id">{{ m.studentId }}</span>
            <span class="dept">{{ m.majorName }}</span>
          </div>
          <p class="join-reason">{{ m.joinReason || '사유 없음' }}</p>
        </div>
      </div>
    </div>

    <PendingMemberDetailModal 
      v-model="showPendingMemberDetailModal"
      :member="memberStore.member"
      :club-member="clubMemberStore.clubMember"
      @approve="approveJoin"
      @reject="rejectJoin"
      @close="closePendingMemberDetail"
    />

    <button class="btn-primary shadow" @click="showInsertModal=true">회원 등록하기</button>

    <MemberInsertModal
      v-model="showInsertModal"
      :club-id="route.params.clubId"
      @success="closeMemberInsertModal"
      @close="showInsertModal=false"
    />

    <div class="toolbar">
      <input v-model="searchKeyword" placeholder="이름, 학번 검색" class="search-input" @input="onSearch" />
      <select v-model="filterRole" @change="loadMembers">
        <option value="">전체 역할</option>
        <option value="PRESIDENT">회장</option>
        <option value="EXECUTIVE">임원</option>
        <option value="MEMBER">회원</option>
      </select>
      <select v-model="filterStatus" @change="loadMembers">
        <option value="APPROVED">승인</option>
        <option value="PENDING">대기</option>
        <option value="REJECTED">거절</option>
        <option value="WITHDRAW">탈퇴</option>
        <option value="EXPELLED">추방</option>
      </select>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>성별</th>
            <th>학번</th>
            <th>전공</th>
            <th>역할</th>
            <th>가입 상태</th>
            <th>가입일</th>
            <th>신청</th>
            <th>참여</th>
            <th>참여율</th>
            <th>불참율</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in clubMembers" :key="m.clubMemberId" @click="openMemberDetail(m)" class="member-row">
            <td>
              <div class="name-cell">
                {{ m.name || '이름 없음' }}
              </div>
            </td>
            <td><ClubBadge type="gender" :value="m.gender" /></td>
            <td>{{ m.studentId || '학번 없음' }}</td>
            <td>{{ m.departmentName || '전공 없음' }}</td>
            <td><ClubBadge type="role" :value="m.clubRole" /></td>
            <td><ClubBadge type="memberStatus" :value="m.status"/></td>
            <td>{{ formatDate(m.joinDate) }}</td>
            <td>{{ m.appliedSchedules }}</td>
            <td>{{ m.attendedSchedules }}</td>
            <td>
              <span :class="rateClass(m.attendanceRate)">
                {{ m.attendanceRate?.toFixed(1) }}%
              </span>
            </td>
            <td>
              <span :class="noShowClass(m.noShowRate)">
                {{ m.noShowRate?.toFixed(1) }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="clubMembers.length === 0" class="empty">회원이 없습니다.</div>
    </div>

    <MemberDetailModal
      v-model="showMemberDetailModal"
      :member="memberStore.member"
      :club-member="clubMemberStore.clubMember"
      @updateRole="updateRole"
      @close="closeMemberDetail"
      />

    <BasePagination :current-page="page" :total-pages="totalPages" @change="onPageChange" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import BasePagination from '@/components/common/BasePagination.vue'
import MemberDetailModal from '@/components/club/MemberDetailModal.vue'
import PendingMemberDetailModal from '@/components/club/PendingMemberDetailModal.vue'
import MemberInsertModal from '@/components/club/MemberInsertModal.vue'
import ClubBadge from '@/components/club/ClubBadge.vue'

import { useClubMemberStore } from '@/stores/clubMember'
import { useMemberStore } from '@/stores/member'
import { useUiStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'
import { clubMemberApi } from '@/api/restApi'

const route = useRoute()
const clubMemberStore = useClubMemberStore()
const memberStore = useMemberStore()
const uiStore = useUiStore()

const { clubMembers, approvedMembers, pendingMembers, presidentMember, executiveMembers } = storeToRefs(clubMemberStore)

// ── 상태 ──────────────────────────────────────────────
const page = ref(1)
const totalPages = ref(1)
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('APPROVED')
const showPendingMemberDetailModal = ref(false)
const showMemberDetailModal = ref(false)
const showInsertModal = ref(false)

// ── 유틸 ──────────────────────────────────────────────
const onPageChange = (p) => {
  page.value = p
  fetchData()
}

let timer = null
function onSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => { page.value = 1; fetchData() }, 400)
}
function rateClass(r) { return r >= 80 ? 'rate-high' : r >= 50 ? 'rate-mid' : 'rate-low' }
function noShowClass(r) { return r >= 30 ? 'rate-low' : r >= 10 ? 'rate-mid' : 'rate-high' }

const openPendingMemberDetail = async(m) => {
  uiStore.isLoading = true 

  try {
    await clubMemberStore.fecthClubMemberByClubMemberId(m.clubMemberId) 
    await memberStore.fetchMember(m.memberId)

    showPendingMemberDetailModal.value = true 
    
  } catch (error) {
    uiStore.isError = true
    uiStore.errorMessage = '회원 상세 정보를 불러오지 못했습니다.'
    console.error(error)
  } finally {
    uiStore.isLoading = false 
  }
}

const approveJoin = async (clubMemberId) => {
  uiStore.isLoading = true
  try {
    await clubMemberApi.updateStatus(clubMemberId, {status: 'APPROVED'})
    showPendingMemberDetailModal.value = false // 💡 모달 닫기
    await fetchData() // 💡 목록 새로고침
  } catch (error) {
    console.log('error', error)
    uiStore.isError = true
    uiStore.errorMessage = '승인 처리에 실패했습니다.'
  } finally {
    uiStore.isLoading = false
  }
}

const rejectJoin = async (clubMemberId) => {
  uiStore.isLoading = true
  try {
    await clubMemberApi.updateStatus(clubMemberId, {status: 'REJECTED'})
    showPendingMemberDetailModal.value = false // 💡 모달 닫기
    await fetchData() // 💡 목록 새로고침
  } catch (error) {
    console.log('error', error)
    uiStore.isError = true
    uiStore.errorMessage = '거절 처리에 실패했습니다.'
  } finally {
    uiStore.isLoading = false
  }
}

const closePendingMemberDetail = async () => {
  showPendingMemberDetailModal.value = false
  await fetchData()
}

const closeMemberInsertModal = async () => {
  showInsertModal.value = false
  await fetchData()
}

const openMemberDetail = async(m) => {
  let isSuccess = false
  try {
    await clubMemberStore.fecthClubMemberByClubMemberId(m.clubMemberId)
    await memberStore.fetchMember(m.memberId)

    isSuccess = true
    
  } catch (error) {
    uiStore.isError = true
    uiStore.errorMessage = '회원 상세 정보를 불러오지 못했습니다.'
    console.error(error)
  } finally {
    uiStore.isLoading = false 
    if(isSuccess){
      showMemberDetailModal.value = true 
    } else {
      uiStore.alert('회원 정보 불러오기 실패', '회원 정보를 불러오는데 실패했습니다.')
    }
  }
}

const updateRole = async(clubMemberId, clubRole) => {
  console.log('updateMember')
  await clubMemberApi.updateRole(clubMemberId, {clubRole})
  showMemberDetailModal.value = false
  await fetchData()
}

const closeMemberDetail = async() => {
  showMemberDetailModal.value = false
  await fetchData()
}

const fetchData = async () => {
  const clubId = route.params.clubId
  await clubMemberStore.fetchClubMembers(clubId)
  await clubMemberStore.fetchMe(clubId)
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.club-member-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 통계 카드 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.stat-card.warn {
  border-color: #fcd34d;
  background: #fffbeb;
}

.stat-label {
  font-size: 0.82rem;
  color: #888;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111;
}

.stat-value span {
  font-size: 0.9rem;
  color: #888;
}

/* 툴바 */
.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 180px;
  padding: 9px 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.toolbar select {
  padding: 9px 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  font-size: 0.9rem;
}

/* 대기 섹션 */
.pending-section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 12px;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pending-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.pending-card:hover {
  background: #ffe7bd;
}


.btn-detail-arrow {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
  transition: color 0.2s;
}

.member-detail-box .detail-row {
  margin-bottom: 12px;
}

.detail-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
  font-weight: bold;
}

.detail-value {
  font-size: 1rem;
  color: #333;
}

.text-box {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  min-height: 60px;
  white-space: pre-wrap;
  /* 줄바꿈 유지 */
}

.member-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 240px;
}

.student-id {
  font-size: 0.82rem;
  color: #888;
}

.dept {
  font-size: 0.82rem;
  color: #555;
}

.join-reason {
  flex: 1;
  font-size: 0.85rem;
  color: #555;
}

.pending-actions {
  display: flex;
  gap: 6px;
}

/* 테이블 */
.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

thead {
  background: #f3f4f6;
}

th,
td {
  padding: 12px 14px;
  text-align: left;
  font-size: 0.88rem;
  border-bottom: 1px solid #f0f0f0;
}

th {
  font-weight: 600;
  color: #555;
}

.member-row {
  cursor: pointer;
  transition: background 0.1s;
}

.member-row:hover {
  background: #f9fafb;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

/* 역할 뱃지 */
.role-badge {
  padding: 3px 8px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
}

.role-president {
  background: #fef3c7;
  color: #d97706;
}

.role-executive {
  background: #dbeafe;
  color: #1d4ed8;
}

.role-member {
  background: #f3f4f6;
  color: #555;
}

/* 참여율 색상 */
.rate-high {
  color: #22c55e;
  font-weight: 600;
}

.rate-mid {
  color: #f59e0b;
  font-weight: 600;
}

.rate-low {
  color: #ef4444;
  font-weight: 600;
}

/* 버튼 */
.btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.btn.sm {
  padding: 4px 10px;
  font-size: 0.8rem;
}

.btn-primary {
  background: #1a73e8;
  color: #fff;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
  margin-left: 4px;
}

.role-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.82rem;
  margin-right: 4px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #aaa;
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
