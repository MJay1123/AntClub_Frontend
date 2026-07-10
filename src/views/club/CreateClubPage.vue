<template>
    <div class="flex-center p-3 page-wrapper">
        <div class="card shadow w-100" style="max-width: 600px;">
            <h1 class="title text-center mb-3">새 모임 생성하기</h1>

            <form @submit.prevent="submitForm" class="flex-col">

                <div class="flex-col mb-2">
                    <label class="text-bold mb-1">모임 이름</label>
                    <input v-model="clubForm.clubName" type="text" class="form-control" placeholder="모임 이름을 입력하세요"
                        required />
                </div>

                <div class="flex-col mb-2">
                    <label class="text-bold mb-1">모임 소개</label>
                    <textarea v-model="clubForm.description" class="form-control" rows="4" placeholder="어떤 모임인지 소개해주세요"
                        required></textarea>
                </div>

                <div class="flex-row mb-2" style="gap: 16px;">
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">카테고리</label>
                        <input v-model="clubForm.category" type="text" class="form-control" placeholder="예: IT, 독서, 운동"
                            required />
                    </div>
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">최대 인원</label>
                        <input v-model="clubForm.maxMembers" type="number" class="form-control" min="1" required />
                    </div>
                </div>

                <div class="flex-row mb-2" style="gap: 16px;">
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">활동 지역 (Location)</label>
                        <input v-model="clubForm.location" type="text" class="form-control" placeholder="예: 서울, 온라인" />
                    </div>
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">연락처 이메일</label>
                        <input v-model="clubForm.contactEmail" type="email" class="form-control"
                            placeholder="contact@example.com" />
                    </div>
                </div>

                <div class="flex-col mb-2">
                    <label class="text-bold mb-1">SNS 링크</label>
                    <input v-model="clubForm.snsLink" type="text" class="form-control" placeholder="인스타그램, 노션 등의 링크" />
                </div>

                <div class="flex-row mb-3" style="gap: 16px;">
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">모임 상태</label>
                        <select v-model="clubForm.status" class="form-control">
                            <option value="">모임 상태를 선택하세요</option>
                            <option v-for="status in CLUB_STATUS" :key="status.value" :value="status.value">
                                {{ status.label }}
                            </option>
                            <!-- <option value="PREPARING">준비 중</option>
              <option value="RECRUITING">모집 중</option>
              <option value="ACTIVE">활동 중</option> -->
                        </select>
                    </div>
                    <div class="flex-col w-100">
                        <label class="text-bold mb-1">가입 방식</label>
                        <select v-model="clubForm.joinType" class="form-control">
                            <option value="">가입 방식을 선택하세요</option>
                            <option v-for="joinType in JOIN_TYPE" :key="joinType.value" :value="joinType.value">
                                {{ joinType.label }}
                            </option>
                            <!-- <option value="FREE">자유 가입</option>
              <option value="APPROVAL">승인제</option> -->
                        </select>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block mt-2 shadow-hover">
                    모임 만들기
                </button>
                <button type="button" class="btn btn-light btn-block mt-1" @click="cancelCreate">
                    취소
                </button>

            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { CLUB_STATUS, JOIN_TYPE } from '@/constants';
import { useUiStore } from '@/stores/ui';
import { clubApi } from '@/api/restApi';
import { useRouter } from 'vue-router';

const router = useRouter()
const uiStore = useUiStore()

// DTO 형식에 맞춘 상태 정의
const clubForm = reactive({
    clubId: null,
    clubName: '',
    description: '',
    category: '',
    status: 'ACTIVE',
    maxMembers: 10,
    location: '',
    snsLink: '',
    contactEmail: '',
    joinType: 'FREE',
});

const errors = reactive({

})

// API 요청 함수
const submitForm = async () => {
    uiStore.isLoading = true
    let isSuccess = false
    const request = {
        clubName: clubForm.clubName,
        description: clubForm.description,
        category: clubForm.category,
        status: clubForm.status,
        maxMembers: clubForm.maxMembers,
        location: clubForm.location,
        snsLink: clubForm.snsLink,
        contactEmail: clubForm.contactEmail,
        joinType: clubForm.joinType,
    }
    try {
        await clubApi.createClub(request)
        isSuccess = true
    } catch (error) {
        console.error('error', error);
    } finally {
        uiStore.isLoading = false
        if (isSuccess) {
            uiStore.alert('동아리 생성 성공', '동아리가 성공적으로 등록되었습니다.')
            router.push('/club')
        } else {
            uiStore.alert('동아리 생성 실패', '동아리 등록에 실패했습니다.')
        }
    }
};

// 취소 버튼
const cancelCreate = () => {
    if (confirm('모임 생성을 취소하시겠습니까? 작성 중인 내용이 사라집니다.')) {
        // 이전 페이지로 돌아가는 로직 (예: router.back())
        console.log('생성 취소');
        router.push('/club')
    }
};
</script>

<style scoped>
/* 페이지 배경을 살짝 띄워주기 위한 래퍼 (제공된 CSS에 배경색이 없어서 추가) */
.page-wrapper {
    min-height: 100vh;
    background-color: #f8f9fa;
}

/* 폼 입력 요소 기본 스타일 (제공된 CSS에 맞춰 심플하게 작성) */
.form-control {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;
    font-family: inherit;
}

.form-control:focus {
    border-color: #0d6efd;
}

textarea.form-control {
    resize: vertical;
    /* 세로로만 크기 조절 가능하게 설정 */
}
</style>