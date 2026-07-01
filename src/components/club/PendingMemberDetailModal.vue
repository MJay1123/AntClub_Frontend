<template>
    <BaseModal v-model="isVisible" size="md" :close-on-backdrop="true">

        <template #title>가입 신청자 상세 정보</template>

        <template #body>

            <div v-if="member && clubMember" class="member-detail-box">

                <h4 class="section-title">기본 정보</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <span class="detail-label">이름</span>
                        <span class="detail-value font-bold">{{ member.name }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">학번 / 학년</span>
                        <span class="detail-value">{{ member.studentId }} / {{ member.grade ? member.grade + '학년' : '-'
                        }}</span>
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
                    <div class="detail-row">
                        <span class="detail-label">이메일</span>
                        <span class="detail-value">{{ member.email }}</span>
                    </div>
                </div>

                <hr class="divider" />

                <h4 class="section-title">프로필 정보</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <span class="detail-label">MBTI</span>
                        <span class="detail-value badge-mbti">{{ member.mbti || '미입력' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">인스타그램</span>
                        <span class="detail-value">{{ member.instagram || member.Instagram || '미입력' }}</span>
                    </div>
                </div>

                <div v-if="member.introduction" class="detail-row full-width margin-top">
                    <span class="detail-label">자기소개 / 좌우명</span>
                    <p class="detail-value text-box small-text">
                        {{ member.introduction }}
                        <br v-if="member.introduction && member.motto" />
                        <span v-if="member.motto" class="motto-text">"{{ member.motto }}"</span>
                    </p>
                </div>

                <hr class="divider" />

                <h4 class="section-title text-primary">가입 신청 내용</h4>
                <div class="detail-row full-width">
                    <span class="detail-label">가입 동기 및 사유</span>
                    <p class="detail-value text-box highlight-box">
                        {{ clubMember.joinReason || '작성된 가입 사유가 없습니다.' }}
                    </p>
                </div>

            </div>
        </template>

        <template #footer>
            <button class="btn btn-outline" @click="isVisible = false">닫기</button>
            <div class="action-buttons">
                <button class="btn btn-danger" @click="$emit('reject', clubMember?.clubMemberId)">거절</button>
                <button class="btn btn-primary" @click="$emit('approve', clubMember?.clubMemberId)">승인</button>
            </div>
        </template>

    </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { formatDate, formatPhoneNumber } from '@/utils/format'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    member: { type: Object },
    clubMember: { type: Object },
})

const emit = defineEmits(['update:modelValue', 'approve', 'reject'])

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
/* 1. 전체 모달 내부 여백 및 폰트 설정 */
.member-detail-box {
    padding: 10px 0;
    color: #333;
}

/* 2. 섹션 제목 (구역 나누기) */
.section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
}

.text-primary {
    color: #3b82f6;
    /* 가입 신청 내용 강조 (파란색) */
}

/* 3. 2단 그리드 레이아웃 (정보를 깔끔하게 정렬) */
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 좌우 반반 */
    gap: 20px 16px;
    /* 위아래 20px, 좌우 16px 간격 */
}

/* 4. 개별 정보 단위 */
.detail-row {
    display: flex;
    flex-direction: column;
}

.full-width {
    grid-column: 1 / -1;
    /* 가로 전체를 차지하도록 설정 */
}

.margin-top {
    margin-top: 8px;
}

/* 5. 텍스트 요소들 */
.detail-label {
    font-size: 0.85rem;
    color: #6b7280;
    /* 부드러운 회색 */
    font-weight: 600;
    margin-bottom: 6px;
}

.detail-value {
    font-size: 1rem;
    color: #111827;
    /* 진한 검은색으로 가독성 확보 */
}

.font-bold {
    font-weight: 700;
    font-size: 1.05rem;
}

/* 6. 구분선 */
.divider {
    border: none;
    height: 1px;
    background-color: #e5e7eb;
    margin: 24px 0;
}

/* 7. MBTI 뱃지 스타일 */
.badge-mbti {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    color: #374151;
    padding: 4px 12px;
    border-radius: 9999px;
    /* 알약 모양 */
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1px;
    width: fit-content;
}

/* 8. 텍스트 박스 (자기소개 등) */
.text-box {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 16px;
    border-radius: 8px;
    line-height: 1.6;
    white-space: pre-wrap;
    /* 줄바꿈 유지 */
    margin: 0;
}

.small-text {
    font-size: 0.95rem;
    color: #4b5563;
}

.motto-text {
    display: inline-block;
    margin-top: 12px;
    font-style: italic;
    color: #6b7280;
    font-weight: 500;
}

/* 9. 가입 사유 강조 박스 (제일 눈에 띄게!) */
.highlight-box {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e3a8a;
    font-weight: 500;
    font-size: 1rem;
}

/* 10. 푸터 (버튼 영역 정렬) */
:deep(.modal-footer) {
    display: flex;
    justify-content: space-between;
    /* 닫기는 왼쪽, 승인/거절은 오른쪽 */
    align-items: center;
    width: 100%;
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.action-buttons {
    display: flex;
    gap: 12px;
}


.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-outline {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-outline:hover {
    background: #f3f4f6;
}

.btn-primary {
    background: #3b82f6;
    border: 1px solid #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
}

.btn-danger {
    background: #ef4444;
    border: 1px solid #ef4444;
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}
</style>