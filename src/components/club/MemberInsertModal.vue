<template>
    <BaseModal v-model="isVisible" size="lg" :close-on-backdrop="true">
        <template #header>
            <div class="title mb-0">신규 회원 등록</div>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" class="modal-form-container">

                <div class="form-section mb-3">
                    <h3 class="text-bold mb-1"
                        style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 4px;">
                        1. 회원 기본 정보
                    </h3>
                    <div class="form-grid">
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">이름 *</label>
                            <input type="text" v-model="memberDto.name" class="p-1 w-100 input-field" required
                                placeholder="홍길동">
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">성별</label>
                            <select v-model="memberDto.gender" class="p-1 w-100 input-field">
                                <option value="OTHERS">선택 안함</option>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">생년월일</label>
                            <input type="date" v-model="memberDto.birthDate" class="p-1 w-100 input-field">
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">전화번호</label>
                            <input type="tel" v-model="memberDto.phoneNumber" class="p-1 w-100 input-field"
                                placeholder="010-0000-0000">
                        </div>
                    </div>
                </div>

                <div class="form-section mb-3">
                    <h3 class="text-bold mb-1"
                        style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 4px;">
                        2. 학적 및 부가 정보
                    </h3>
                    <div class="form-grid">
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">학교 ID</label>
                            <input type="number" v-model.number="memberDto.schoolId" class="p-1 w-100 input-field">
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">전공 ID</label>
                            <input type="number" v-model.number="memberDto.majorId" class="p-1 w-100 input-field">
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">학번</label>
                            <input type="text" v-model="memberDto.studentId" class="p-1 w-100 input-field"
                                placeholder="학번 입력">
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">학년</label>
                            <select v-model.number="memberDto.grade" class="p-1 w-100 input-field">
                                <option :value="1">1학년</option>
                                <option :value="2">2학년</option>
                                <option :value="3">3학년</option>
                                <option :value="4">4학년</option>
                            </select>
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">재학 상태</label>
                            <select v-model="memberDto.enrollmentStatus" class="p-1 w-100 input-field">
                                <option value="ENROLLED">재학</option>
                                <option value="LEAVE">휴학</option>
                                <option value="GRADUATED">졸업</option>
                                <option value="EXPELLED">퇴학</option>
                            </select>
                        </div>
                        <div class="flex-col mb-1">
                            <label class="text-bold mb-1">MBTI</label>
                            <input type="text" v-model="memberDto.mbti" class="p-1 w-100 input-field" placeholder="ENFP"
                                maxlength="4">
                        </div>
                    </div>

                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">관심사 / 특기 / 활동 선호 시간</label>
                        <div class="flex-row" style="gap: 10px;">
                            <input type="text" v-model="memberDto.interest" class="p-1 w-100 input-field"
                                placeholder="주요 관심사">
                            <input type="text" v-model="memberDto.skill" class="p-1 w-100 input-field"
                                placeholder="특기">
                        </div>
                        <div>
                            <select v-model="memberDto.activityPreference" class="p-1 w-100 input-field">
                                <option value="MORNING">오전</option>
                                <option value="AFTERNOON">오후</option>
                                <option value="EVENING">저녁</option>
                                <option value="WEEKEND">주말</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">자기소개 / 좌우명</label>
                        <input type="text" v-model="memberDto.introduction" class="p-1 w-100 input-field mb-1"
                            placeholder="한줄 소개">
                        <input type="text" v-model="memberDto.motto" class="p-1 w-100 input-field" placeholder="좌우명">
                    </div>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">인스타그램 계정</label>
                        <input type="text" v-model="memberDto.instagram" class="p-1 w-100 input-field"
                            placeholder="@username">
                    </div>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">운영진 메모 (Member)</label>
                        <textarea v-model="memberDto.memo" class="p-1 w-100 input-field" rows="2"
                            placeholder="회원 관련 특이사항"></textarea>
                    </div>
                </div>

                <div class="form-section mb-3">
                    <h3 class="text-bold mb-1"
                        style="color: #0d6efd; border-bottom: 2px solid #0d6efd; padding-bottom: 4px;">
                        3. 동아리 가입 정보
                    </h3>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">동아리 가입일 *</label>
                        <input type="date" v-model="clubMemberDto.joinDate" class="p-1 w-100 input-field" required>
                    </div>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">가입 동기</label>
                        <textarea v-model="clubMemberDto.joinReason" class="p-1 w-100 input-field" rows="2"
                            placeholder="동아리에 지원한 이유를 적어주세요."></textarea>
                    </div>
                    <div class="flex-col mb-1">
                        <label class="text-bold mb-1">운영진 메모 (Club Member)</label>
                        <textarea v-model="clubMemberDto.memo" class="p-1 w-100 input-field" rows="2"
                            placeholder="동아리 활동 관련 메모"></textarea>
                    </div>
                </div>

            </form>
        </template>

        <template #footer>
            <div class="flex-end" style="gap: 10px; width: 100%; display: flex; justify-content: flex-end;">
                <button type="button" class="btn btn-light" @click="handleClose">취소</button>
                <button type="button" class="btn btn-primary" @click="handleSubmit">등록하기</button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { memberApi } from '@/api/restApi';
import { clubMemberApi } from '@/api/restApi';
import BaseModal from '../common/BaseModal.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    clubId: {
        type: [Number, String],
        required: true // 어떤 동아리에 멤버를 넣을지 받아야 하므로 필수 설정
    }
});

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const emit = defineEmits(['close', 'success']);

// 1. Member DTO 초기 상태 정의 (DB 스키마 스네이크 케이스 매핑)
const createInitialMemberDto = () => ({
    email: `${crypto.randomUUID()}@test.com`,
    password: `password${crypto.randomUUID()}`,
    name: '',
    gender: '',
    birthDate: '',
    phoneNumber: '',
    schoolId: null,
    majorId: null,
    studentId: '',
    grade: 1,
    enrollmentStatus: '재학',
    profileImage: null,
    mbti: '',
    interest: '',
    skill: '',
    activityPreference: '',
    introduction: '',
    motto: '',
    instagram: '',
    memo: '',
});

// 2. ClubMember DTO 초기 상태 정의 (직접 입력하지 않는 값은 기본값 설정)
const createInitialClubMemberDto = () => ({
    clubId: props.clubId,
    memberId: null, // 첫 번째 API 응답 후 주입 예정
    clubRole: 'MEMBER',
    status: 'APPROVED',
    joinReason: '',
    memo: ''
});

const memberDto = ref(createInitialMemberDto());
const clubMemberDto = ref(createInitialClubMemberDto());

// 모달이 열릴 때마다 clubId 동기화 및 폼 초기화
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        memberDto.value = createInitialMemberDto();
        clubMemberDto.value = createInitialClubMemberDto();
    }
});

const handleClose = () => {
    emit('close');
};

// 등록 버튼 클릭 시 순차 비동기 처리
const handleSubmit = async () => {
    // 필수값 검증 간단히 체크
    if (!memberDto.value.email || !memberDto.value.password || !memberDto.value.name || !clubMemberDto.value.joinDate) {
        alert('필수값(*)을 모두 입력해주세요.');
        console.log('email', memberDto.value.email)
        console.log('password', memberDto.value.password)
        console.log('name', memberDto.value.name)
        console.log('joinDate', memberDto.value.joinDate)
        return;
    }

    try {
        // Step 1: Member 생성 API 호출
        console.log('Sending Member DTO:', memberDto.value);
        const memberResponse = await memberApi.createMember(memberDto.value)

        // 백엔드에서 반환된 response.data에 member_id가 들어있다고 가정
        const generatedMemberId = memberResponse.data.memberId;

        if (!generatedMemberId) {
            throw new Error('회원 등록 응답에 member_id가 없습니다.');
        }

        // Step 2: 반환받은 member_id를 ClubMember DTO에 바인딩
        clubMemberDto.value.memberId = generatedMemberId;
        clubMemberDto.value.clubId = props.clubId; // 혹시 모를 변경 대비 재확인

        // Step 3: ClubMember 생성 API 호출
        console.log('Sending ClubMember DTO:', clubMemberDto.value);
        await clubMemberApi.create(clubMemberDto.value)

        alert('성공적으로 신규 회원 등록 및 동아리 추가가 완료되었습니다!');
        emit('success');
        handleClose();

    } catch (error) {
        console.error('회원 등록 중 오류 발생:', error);
        alert('등록 중 오류가 발생했습니다. 로그를 확인해주세요.');
    }
};
</script>

<style scoped>
/* style.css가 전역 반영되어 있지만, 폼 내부 레이아웃 처리를 위한 그리드 스타일 추가 */
.modal-form-container {
    max-height: 65vh;
    /* 모달 내부 스크롤 보장 */
    overflow-y: auto;
    padding-right: 8px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 2열 배치로 깔끔하게 정렬 */
    gap: 12px;
}

.input-field {
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
}

.input-field:focus {
    border-color: #6f42c1;
    /* 포커스 시 테두리 강조색 */
}

/* 모바일 등 좁은 화면 대응 */
@media (max-width: 576px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>