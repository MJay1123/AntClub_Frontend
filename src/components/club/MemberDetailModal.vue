<template>
    <BaseModal v-model="isVisible" size="lg" :close-on-backdrop="true">

        <template #title>회원 상세 정보</template>

        <template #body>
            <div v-if="member && clubMember" class="member-detail-container">

                <div class="tabs">
                    <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">기본
                        정보</button>
                    <button class="tab-btn" :class="{ active: activeTab === 'activity' }"
                        @click="activeTab = 'activity'">활동 내역</button>
                    <button class="tab-btn" :class="{ active: activeTab === 'manage' }" @click="activeTab = 'manage'">회원
                        관리</button>
                </div>

                <div v-show="activeTab === 'basic'" class="tab-content fade-in">
                    <h4 class="section-title">인적 사항</h4>
                    <div class="detail-grid">
                        <div class="detail-row"><span class="detail-label">이름</span>
                            <span class="detail-value font-bold">{{ member.name }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">성별</span>
                            <span class="detail-value">{{ member.gender === 'MALE' ? '남자' : '여자' }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">생년월일</span>
                            <span class="detail-value">{{ formatDate(member.birthDate) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">연락처</span>
                            <span class="detail-value">{{ formatPhoneNumber(member.phoneNumber) }}</span>
                        </div>
                        <div class="detail-row full-width">
                            <span class="detail-label">이메일</span>
                            <span class="detail-value">{{ member.email }}</span>
                        </div>
                    </div>

                    <hr class="divider" />

                    <h4 class="section-title">학적 & 프로필</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span class="detail-label">학번 / 학년</span>
                            <span class="detail-value">{{ member.studentId }} / {{ member.grade ? member.grade + '학년' : '-' }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">재학 상태</span>
                            <span class="detail-value">{{ translateStatus(member.enrollmentStatus) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">MBTI</span>
                            <span
                                class="detail-value badge-mbti">{{ member.mbti || '미입력' }}</span>
                            </div>
                        <div class="detail-row">
                            <span class="detail-label">인스타그램</span>
                            <span class="detail-value">{{ member.instagram || member.Instagram || '미입력' }}</span>
                        </div>
                        <div class="detail-row full-width">
                            <span class="detail-label">관심사 / 성향</span>
                            <span class="detail-value">{{ member.interest || '-' }} / {{ member.activityPreference || '-' }}</span>
                        </div>
                    </div>

                    <div v-if="member.introduction" class="detail-row full-width margin-top">
                        <span class="detail-label">자기소개 & 좌우명</span>
                        <p class="detail-value text-box">
                            {{ member.introduction }}
                            <br v-if="member.motto" />
                            <span v-if="member.motto" class="motto-text">"{{ member.motto }}"</span>
                        </p>
                    </div>
                </div>

                <div v-show="activeTab === 'activity'" class="tab-content fade-in">
                    <h4 class="section-title">가입 정보</h4>
                    <div class="detail-grid">
                        <div class="detail-row"><span class="detail-label">가입일</span><span class="detail-value">{{
                                formatDate(clubMember.joinDate) }}</span></div>
                        <div class="detail-row"><span class="detail-label">현재 역할</span><span
                                class="detail-value badge-role">{{ translateRole(clubMember.clubRole) }}</span></div>
                        <div class="detail-row full-width"><span class="detail-label">가입 사유</span>
                            <p class="detail-value text-box">{{ clubMember.joinReason || '없음' }}</p>
                        </div>
                    </div>

                    <hr class="divider" />

                    <h4 class="section-title">참여 통계</h4>
                    <div class="detail-grid stat-grid">
                        <div class="stat-box">
                            <span class="stat-label">참여율</span>
                            <span class="stat-value text-primary">{{ clubMember.attendanceRate?.toFixed(1) || 0
                                }}%</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">불참율 (노쇼)</span>
                            <span class="stat-value text-danger">{{ clubMember.noShowRate?.toFixed(1) || 0 }}%</span>
                        </div>
                    </div>
                    <div class="detail-grid mt-3">
                        <div class="detail-row"><span class="detail-label">전체 일정 수</span><span class="detail-value">{{
                                clubMember.totalSchedules || 0 }}회</span></div>
                        <div class="detail-row"><span class="detail-label">신청 횟수</span><span class="detail-value">{{
                                clubMember.appliedSchedules || 0 }}회</span></div>
                        <div class="detail-row"><span class="detail-label">실제 참석</span><span class="detail-value">{{
                                clubMember.attendedSchedules || 0 }}회</span></div>
                        <div class="detail-row"><span class="detail-label">무단 결석</span><span class="detail-value">{{
                                clubMember.absentAfterApply || 0 }}회</span></div>
                    </div>
                </div>

                <div v-show="activeTab === 'manage'" class="tab-content fade-in">

                    <h4 class="section-title">동아리 권한 변경</h4>
                    <div class="manage-box">
                        <p class="desc-text">이 회원의 동아리 내 직책(권한)을 변경합니다.</p>
                        <div class="role-control">
                            <select v-model="editRole" class="role-select">
                                <option value="MEMBER">일반 회원 (MEMBER)</option>
                                <option value="EXECUTIVE">임원 (EXECUTIVE)</option>
                                <option value="PRESIDENT">회장 (PRESIDENT)</option>
                            </select>
                            <button class="btn btn-primary" :disabled="editRole === clubMember.clubRole"
                                @click="onUpdateRole">
                                권한 적용
                            </button>
                        </div>
                    </div>

                    <h4 class="section-title margin-top-lg">운영진 메모</h4>
                    <div class="manage-box">
                        <div class="detail-row full-width">
                            <span class="detail-label">회원 계정 메모 (member)</span>
                            <p class="detail-value text-box">{{ member.memo || '작성된 메모가 없습니다.' }}</p>
                        </div>
                        <div class="detail-row full-width margin-top">
                            <span class="detail-label">동아리 활동 메모 (club_member)</span>
                            <p class="detail-value text-box">{{ clubMember.memo || '작성된 메모가 없습니다.' }}</p>
                        </div>
                    </div>

                    <h4 class="section-title margin-top-lg text-danger">위험 구역 (Danger Zone)</h4>
                    <div class="manage-box border-danger">
                        <p class="desc-text text-danger">회원을 동아리에서 강제로 탈퇴시킵니다. 이 작업은 취소할 수 없습니다.</p>
                        <button class="btn btn-danger" disabled>
                            동아리 강제 탈퇴 (개발 예정)
                        </button>
                    </div>

                </div>

            </div>
        </template>

        <template #footer>
            <button class="btn btn-outline" @click="isVisible = false">닫기</button>
        </template>

    </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { formatDate, formatPhoneNumber } from '@/utils/format'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    member: { type: Object },
    clubMember: { type: Object },
})

const emit = defineEmits(['update:modelValue', 'updateRole'])

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const activeTab = ref('basic')

const editRole = ref('')

watch(
    () => props.clubMember,
    (newVal) => {
        if (newVal) {
            editRole.value = newVal.clubRole
        }
    },
    { immediate: true }
)

const onUpdateRole = () => {
    if (confirm(`권한을 변경하시겠습니까?`)) {
        emit('updateRole', props.clubMember.clubMemberId, editRole.value)
    }
}

// 간단한 한글 변환기
const translateRole = (role) => {
    const map = { PRESIDENT: '회장', EXECUTIVE: '임원', MEMBER: '일반 회원' }
    return map[role] || role
}
const translateStatus = (status) => {
    const map = { ENROLLED: '재학', LEAVE_OF_ABSENCE: '휴학', GRADUATED: '졸업' }
    return map[status] || status || '미상'
}
</script>

<style scoped>
/* 모달 사이즈를 키워서 정보가 시원하게 보이도록 lg 사용 가정 */
.member-detail-container {
    padding: 0 4px;
}

/* --- 탭 네비게이션 CSS --- */
.tabs {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 20px;
}

.tab-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    /* 보더 겹침 처리 */
    transition: all 0.2s;
}

.tab-btn:hover {
    color: #3b82f6;
}

.tab-btn.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
}

/* 탭 전환 애니메이션 */
.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* --- 내용 디자인 --- */
.section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
}

.margin-top-lg {
    margin-top: 32px;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.detail-row {
    display: flex;
    flex-direction: column;
}

.full-width {
    grid-column: 1 / -1;
}

.margin-top {
    margin-top: 12px;
}

.detail-label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 4px;
}

.detail-value {
    font-size: 1rem;
    color: #111827;
}

.font-bold {
    font-weight: 700;
    font-size: 1.05rem;
}

.divider {
    border: 0;
    height: 1px;
    background: #e5e7eb;
    margin: 24px 0;
}

.badge-mbti,
.badge-role {
    display: inline-block;
    background-color: #f3f4f6;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    width: fit-content;
}

.badge-role {
    background-color: #dbeafe;
    color: #1e40af;
}

.text-box {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 16px;
    border-radius: 8px;
    line-height: 1.5;
    white-space: pre-wrap;
    margin: 0;
}

.motto-text {
    font-style: italic;
    color: #6b7280;
    margin-top: 8px;
    display: block;
}

/* 통계 영역 디자인 */
.stat-grid {
    gap: 12px;
    margin-bottom: 16px;
}

.stat-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
}

/* 관리 영역 박스 */
.manage-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
}

.border-danger {
    border-color: #fca5a5;
    background-color: #fef2f2;
}

.desc-text {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 12px;
}

.role-control {
    display: flex;
    gap: 12px;
    align-items: center;
}

.role-select {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    flex: 1;
}

.text-primary {
    color: #3b82f6;
}

.text-danger {
    color: #ef4444;
}

.mt-3 {
    margin-top: 12px;
}

:deep(.modal-footer) {
    justify-content: flex-end;
    /* 푸터 버튼 오른쪽 정렬 */
}
</style>