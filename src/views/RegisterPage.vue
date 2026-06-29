<template>
    <div class="register-page">
        <div class="register-header">
            <router-link to="/" class="back-logo">
                <span>🐜</span>
                <span>AntClub</span>
            </router-link>
            <div class="progress-bar">
                <div v-for="step in steps" :key="step.id" class="progress-step" :class="{
                    active: currentStep === step.id,
                    completed: currentStep > step.id
                }" @click="goToStep(step.id)">
                    <div class="step-circle">
                        <span v-if="currentStep > step.id">✓</span>
                        <span v-else>{{ step.id }}</span>
                    </div>
                    <span class="step-label">{{ step.label }}</span>
                </div>
                <div class="progress-line">
                    <div class="progress-fill"
                        :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }" />
                </div>
            </div>
        </div>

        <div class="register-container">
            <div v-if="authStore.error || submitError" class="alert alert-error">
                <span>⚠️</span>
                <span>{{ authStore.error || submitError }}</span>
            </div>

            <form @submit.prevent="handleSubmit">

                <div v-show="currentStep === 1" class="step-content">
                    <div class="step-header">
                        <h2>기본 계정 정보</h2>
                        <p>로그인에 사용할 기본 정보를 입력해주세요</p>
                    </div>

                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">
                                📧 이메일 <span class="required">*</span>
                            </label>
                            <input v-model="form.email" type="email" class="form-input"
                                :class="{ 'input-error': errors.email }" placeholder="example@email.com" />
                            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">
                                🔒 비밀번호 <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    class="form-input" :class="{ 'input-error': errors.password }"
                                    placeholder="비밀번호를 입력하세요" />
                                <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                                    {{ showPassword ? '🙈' : '👁️' }}
                                </button>
                            </div>
                            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">
                                🔒 비밀번호 확인 <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <input v-model="form.passwordConfirm" :type="showPasswordConfirm ? 'text' : 'password'"
                                    class="form-input" :class="{ 'input-error': errors.passwordConfirm }"
                                    placeholder="비밀번호를 다시 입력하세요" />
                                <button type="button" class="toggle-pw"
                                    @click="showPasswordConfirm = !showPasswordConfirm">
                                    {{ showPasswordConfirm ? '🙈' : '👁️' }}
                                </button>
                            </div>
                            <span v-if="errors.passwordConfirm" class="error-msg">{{ errors.passwordConfirm }}</span>
                        </div>
                    </div>
                </div>

                <div v-show="currentStep === 2" class="step-content">
                    <div class="step-header">
                        <h2>개인 정보</h2>
                        <p>회원님의 개인 정보를 입력해주세요</p>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">👤 이름 <span class="required">*</span></label>
                            <input v-model="form.name" type="text" class="form-input"
                                :class="{ 'input-error': errors.name }" placeholder="이름을 입력하세요" />
                            <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">📱 전화번호 <span class="required">*</span></label>
                            <input v-model="form.phoneNumber" type="tel" class="form-input"
                                :class="{ 'input-error': errors.phoneNumber }" placeholder="01012345678" />
                            <span v-if="errors.phoneNumber" class="error-msg">{{ errors.phoneNumber }}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">🎂 생년월일 <span class="required">*</span></label>
                            <input v-model="form.birthDate" type="date" class="form-input"
                                :class="{ 'input-error': errors.birthDate }" />
                            <span v-if="errors.birthDate" class="error-msg">{{ errors.birthDate }}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">⚥ 성별 <span class="required">*</span></label>
                            <div class="radio-group">
                                <label class="radio-label" :class="{ selected: form.gender === 'MALE' }">
                                    <input type="radio" v-model="form.gender" value="MALE" />
                                    <span>👨 남성</span>
                                </label>
                                <label class="radio-label" :class="{ selected: form.gender === 'FEMALE' }">
                                    <input type="radio" v-model="form.gender" value="FEMALE" />
                                    <span>👩 여성</span>
                                </label>
                            </div>
                            <span v-if="errors.gender" class="error-msg">{{ errors.gender }}</span>
                        </div>
                    </div>
                </div>

                <div v-show="currentStep === 3" class="step-content">
                    <div class="step-header">
                        <h2>학교 정보</h2>
                        <p>재학 중인 학교 정보를 입력해주세요</p>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">🏫 학교 <span class="required">*</span></label>
                            <select v-model="form.schoolId" class="form-input"
                                :class="{ 'input-error': errors.schoolId }">
                                <option value="">학교를 선택하세요</option>
                                <option v-for="school in schools" :key="school.schoolId" :value="school.schoolId">
                                    {{ school.name }}
                                </option>
                            </select>
                            <span v-if="errors.schoolId" class="error-msg">{{ errors.schoolId }}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">📚 전공 <span class="required">*</span></label>
                            <select v-model="form.majorId" class="form-input"
                                :class="{ 'input-error': errors.majorId }" :disabled="!form.schoolId">
                                <option value="">전공을 선택하세요</option>
                                <option v-for="major in majors" :key="major.majorId" :value="major.majorId">
                                    {{ major.name }}
                                </option>
                            </select>
                            <span v-if="errors.majorId" class="error-msg">{{ errors.majorId }}</span>
                            <span v-if="!form.schoolId && !errors.majorId" class="help-text">학교를 먼저 선택해주세요.</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">🆔 학번 <span class="required">*</span></label>
                            <input v-model="form.studentId" type="text" class="form-input"
                                :class="{ 'input-error': errors.studentId }" placeholder="학번을 입력하세요" />
                            <span v-if="errors.studentId" class="error-msg">{{ errors.studentId }}</span>
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">🎓 재학 상태 <span class="required">*</span></label>
                            <div class="radio-group-wrap">
                                <label v-for="status in enrollmentStatuses" :key="status.value" class="radio-label"
                                    :class="{ selected: form.enrollmentStatus === status.value }">
                                    <input type="radio" v-model="form.enrollmentStatus" :value="status.value" />
                                    <span>{{ status.label }}</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-group" v-if="form.enrollmentStatus === 'ENROLLED'">
                            <label class="form-label">📊 학년</label>
                            <select v-model="form.grade" class="form-input">
                                <option :value="0">선택하세요</option>
                                <option v-for="g in 6" :key="g" :value="g">{{ g }}학년</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-show="currentStep === 4" class="step-content">
                    <div class="step-header">
                        <h2>프로필 정보</h2>
                        <p>선택 사항입니다. 나중에 수정할 수 있습니다</p>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">🧠 MBTI</label>
                            <select v-model="form.mbti" class="form-input">
                                <option value="">선택하세요</option>
                                <option v-for="mbti in mbtiList" :key="mbti" :value="mbti">{{ mbti }}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">📸 인스타그램</label>
                            <input v-model="form.instagram" type="text" class="form-input" placeholder="@아이디" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">💡 관심사</label>
                            <input v-model="form.interest" type="text" class="form-input"
                                placeholder="관심사를 입력하세요 (e.g. 친목)" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">🏅 특기</label>
                            <input v-model="form.skill" type="text" class="form-input"
                                placeholder="특기를 입력하세요 (e.g. 운동)" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">📌 활동 선호도</label>
                            <select v-model="form.activityPreference" class="form-input">
                                <option value="">선택하세요</option>
                                <option v-for="pref in activityPreferences" :key="pref.value" :value="pref.value">
                                    {{ pref.label }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">💬 좌우명</label>
                            <input v-model="form.motto" type="text" class="form-input" placeholder="좌우명을 입력하세요" />
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">📝 자기소개</label>
                            <textarea v-model="form.introduction" class="form-textarea" rows="3"
                                placeholder="간단한 자기소개를 입력하세요" />
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">🗒️ 메모</label>
                            <textarea v-model="form.memo" class="form-textarea" rows="2"
                                placeholder="기타 메모 (e.g. 매직아이의 전설)" />
                        </div>
                    </div>
                </div>

                <div class="btn-navigation">
                    <button v-if="currentStep > 1" type="button" class="btn-prev" @click="prevStep">
                        ← 이전
                    </button>
                    <div v-else class="btn-spacer" />

                    <button v-if="currentStep < steps.length" type="button" class="btn-next" @click="nextStep">
                        다음 →
                    </button>
                    <button v-else type="submit" class="btn-submit" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner">⟳</span>
                        <span v-else>🐜 회원가입 완료</span>
                    </button>
                </div>

            </form>

            <p class="login-link">
                이미 계정이 있으신가요?
                <router-link to="/login">로그인 →</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSchoolStore } from '@/stores/school'
import { useMajorStore } from '@/stores/major' // 추가됨
import { storeToRefs } from 'pinia'
import { memberApi } from '@/api/restApi'

const router = useRouter()
const authStore = useAuthStore()
const schoolStore = useSchoolStore()
const majorStore = useMajorStore() // 추가됨

const currentStep = ref(1)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

const steps = [
    { id: 1, label: '계정 정보' },
    { id: 2, label: '개인 정보' },
    { id: 3, label: '학교 정보' },
    { id: 4, label: '프로필' }
]

const form = reactive({
    // Step 1 - 계정
    email: '',
    password: '',
    passwordConfirm: '',

    // Step 2 - 개인
    name: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',

    // Step 3 - 학교
    schoolId: '',
    majorId: '',
    studentId: '',
    grade: 0,
    enrollmentStatus: 'ENROLLED',

    // Step 4 - 프로필
    memberId: null,
    mbti: '',
    interest: '',
    skill: '',
    activityPreference: '', // null에서 빈 문자열로 변경 (select 바인딩용)
    introduction: '',
    motto: null,
    instagram: '',
    memo: '',
    profileImage: null
})

const errors = reactive({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    schoolId: '',
    majorId: '',
    studentId: ''
})

// Store에서 목록 가져오기
const { schools } = storeToRefs(schoolStore)
const { majors } = storeToRefs(majorStore) // 추가됨

const enrollmentStatuses = [
    { value: 'ENROLLED', label: '재학' },
    { value: 'ON_LEAVE', label: '휴학' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'DROPPED_OUT', label: '자퇴' }
]

// 활동 선호도 목록 추가됨
const activityPreferences = [
    { value: 'MORNING', label: '오전' },
    { value: 'AFTERNOON', label: '오후' },
    { value: 'EVENING', label: '저녁' },
    { value: 'WEEKEND', label: '주말' }
]

const mbtiList = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

watch(() => form.schoolId, async (newSchoolId) => {
    // 학교가 변경되면 기존에 선택했던 전공 초기화
    form.majorId = ''
    
    if (newSchoolId) {
        // 선택된 학교의 전공들만 스토어에서 불러오기
        await majorStore.fetchMajorsInSchool(newSchoolId)
    } else {
        // 학교 선택이 해제된 경우 (옵셔널: 스토어에 목록 비우는 로직이 있다면 호출)
        majors.value = [] 
    }
})

const validateStep = (step) => {
    let valid = true

    if (step === 1) {
        errors.email = ''
        errors.password = ''
        errors.passwordConfirm = ''

        if (!form.email) {
            errors.email = '이메일을 입력해주세요.'; valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = '올바른 이메일 형식이 아닙니다.'; valid = false
        }

        if (!form.password) {
            errors.password = '비밀번호를 입력해주세요.'; valid = false
        } else if (form.password.length < 4) {
            errors.password = '비밀번호는 4자 이상이어야 합니다.'; valid = false
        }

        if (!form.passwordConfirm) {
            errors.passwordConfirm = '비밀번호 확인을 입력해주세요.'; valid = false
        } else if (form.password !== form.passwordConfirm) {
            errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'; valid = false
        }
    }

    if (step === 2) {
        errors.name = ''
        errors.phoneNumber = ''
        errors.birthDate = ''
        errors.gender = ''

        if (!form.name) { errors.name = '이름을 입력해주세요.'; valid = false }
        if (!form.phoneNumber) { errors.phoneNumber = '전화번호를 입력해주세요.'; valid = false }
        else if (!/^\d{10,11}$/.test(form.phoneNumber)) {
            errors.phoneNumber = '올바른 전화번호 형식이 아닙니다.'; valid = false
        }
        if (!form.birthDate) { errors.birthDate = '생년월일을 입력해주세요.'; valid = false }
        if (!form.gender) { errors.gender = '성별을 선택해주세요.'; valid = false }
    }

    if (step === 3) {
        errors.schoolId = ''
        errors.majorId = ''
        errors.studentId = ''

        if (!form.schoolId) { errors.schoolId = '학교를 선택해주세요.'; valid = false }
        if (!form.majorId) { errors.majorId = '전공을 선택해주세요.'; valid = false }
        if (!form.studentId) { errors.studentId = '학번을 입력해주세요.'; valid = false }
    }

    return valid
}

const nextStep = () => {
    if (validateStep(currentStep.value)) {
        currentStep.value++
        window.scrollTo(0, 0)
    }
}

const prevStep = () => {
    currentStep.value--
    window.scrollTo(0, 0)
}

const goToStep = (step) => {
    if (step < currentStep.value) {
        currentStep.value = step
    }
}

const handleSubmit = async () => {
    submitError.value = ''
    isSubmitting.value = true

    const request = {
        email: form.email,
        password: form.password,
        name: form.name,
        gender: form.gender,
        birthDate: form.birthDate,
        phoneNumber: form.phoneNumber,

        schoolId: Number(form.schoolId),
        majorId: Number(form.majorId),
        studentId: form.studentId,
        grade: form.enrollmentStatus === 'ENROLLED' ? Number(form.grade) : 0,
        enrollmentStatus: form.enrollmentStatus,

        profileImage: form.profileImage,
        mbti: form.mbti || null,
        interest: form.interest || null,
        skill: form.skill || null,
        activityPreference: form.activityPreference || null,
        introduction: form.introduction || null,
        motto: form.motto || null,
        instagram: form.instagram || null,
        memo: form.memo || null
    }

    try {
        await memberApi.createMember(request);
        
        console.log('가입 성공!!!')
        
        router.push('/login')
        
    } catch (error) {
        console.error('회원가입 에러:', error)
        submitError.value = error.message || '서버와의 통신 중 오류가 발생했습니다.'
    } finally {
        isSubmitting.value = false
    }
}

onMounted(async () => {
    await schoolStore.fetchSchools()
})
</script>

<style scoped>
/* ===== Page ===== */
.register-page {
    min-height: 100vh;
    background: #f1f5f9;
    padding-bottom: 60px;
}

/* ===== Header ===== */
.register-header {
    background: white;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
    flex-wrap: wrap;
    gap: 20px;
}

.back-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #1e293b;
    font-size: 22px;
    font-weight: 800;
}

.back-logo span:first-child {
    font-size: 28px;
}

/* ===== Progress Bar ===== */
.progress-bar {
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;
}

.progress-line {
    position: absolute;
    top: 20px;
    left: 24px;
    right: 24px;
    height: 2px;
    background: #e2e8f0;
    z-index: 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    transition: width 0.4s ease;
}

.progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    min-width: 80px;
    z-index: 1;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.progress-step.active .step-circle {
    border-color: #6366f1;
    background: #6366f1;
    color: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.progress-step.completed .step-circle {
    border-color: #6366f1;
    background: #6366f1;
    color: white;
}

.step-label {
    font-size: 12px;
    color: #94a3b8;
    white-space: nowrap;
    transition: color 0.3s;
}

.progress-step.active .step-label,
.progress-step.completed .step-label {
    color: #6366f1;
    font-weight: 600;
}

/* ===== Container ===== */
.register-container {
    max-width: 720px;
    margin: 40px auto;
    padding: 0 20px;
}

/* ===== Alert ===== */
.alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 14px;
}

.alert-error {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fee2e2;
}

/* ===== Step Content ===== */
.step-content {
    background: white;
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.step-header {
    margin-bottom: 36px;
}

.step-header h2 {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
}

.step-header p {
    color: #64748b;
    font-size: 15px;
}

/* ===== Form Grid ===== */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.required {
    color: #ef4444;
    margin-left: 2px;
}

.input-wrapper {
    position: relative;
}

.form-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    color: #1e293b;
    background: #f8fafc;
    transition: all 0.2s;
    box-sizing: border-box;
    outline: none;
}

.form-input:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.input-error {
    border-color: #ef4444 !important;
}

.form-textarea {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    color: #1e293b;
    background: #f8fafc;
    resize: vertical;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
    font-family: inherit;
}

.form-textarea:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.toggle-pw {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
}

.error-msg {
    font-size: 12px;
    color: #ef4444;
}

/* ===== Radio Group ===== */
.radio-group {
    display: flex;
    gap: 12px;
}

.radio-group-wrap {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #475569;
    background: #f8fafc;
}

.radio-label input[type="radio"] {
    display: none;
}

.radio-label.selected {
    border-color: #6366f1;
    background: #eef2ff;
    color: #6366f1;
    font-weight: 600;
}

.radio-label:hover {
    border-color: #a5b4fc;
}

/* ===== Navigation Buttons ===== */
.btn-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
}

.btn-spacer {
    flex: 1;
}

.btn-prev {
    padding: 13px 28px;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-prev:hover {
    border-color: #6366f1;
    color: #6366f1;
}

.btn-next {
    padding: 13px 28px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}

.btn-next:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
}

.btn-submit {
    padding: 13px 36px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
}

.btn-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* ===== Login Link ===== */
.login-link {
    text-align: center;
    font-size: 14px;
    color: #64748b;
    margin-top: 24px;
}

.login-link a {
    color: #6366f1;
    font-weight: 700;
    text-decoration: none;
    margin-left: 4px;
}

.login-link a:hover {
    text-decoration: underline;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
    .register-header {
        padding: 16px 20px;
    }

    .step-content {
        padding: 28px 20px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .progress-step {
        min-width: 60px;
    }

    .step-label {
        font-size: 10px;
    }
}
</style>
