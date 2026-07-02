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
                            <div class="input-with-button">
                                <input v-model="form.email" type="email" class="form-input"
                                    :class="{ 'input-error': errors.email }" placeholder="example@email.com" />
                                <button v-if="!form.isEmailChecked" class="btn-primary check-btn" @click.prevent="handleCheckEmail">중복검사</button>
                                <button v-else class="btn-secondary check-btn" :disabled="true">확인완료</button>
                            </div>
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
                            <select v-model="form.universityId" class="form-input"
                                :class="{ 'input-error': errors.universityId }">
                                <option value="">학교를 선택하세요</option>
                                <option v-for="university in universities" :key="university.universityId"
                                    :value="university.universityId">
                                    {{ university.name }}
                                </option>
                            </select>
                            <span v-if="errors.universityId" class="error-msg">{{ errors.universityId }}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">🔬 학부 <span class="required">*</span></label>
                            <select v-model="form.collegeId" class="form-input"
                                :class="{ 'input-error': errors.collegeId }">
                                <option value="">학부를 선택하세요</option>
                                <option v-for="college in colleges" :key="college.collegeId" :value="college.collegeId">
                                    {{ college.name }}
                                </option>
                            </select>
                            <span v-if="errors.collegeId" class="error-msg">{{ errors.collegeId }}</span>
                            <span v-if="!form.universityId" class="help-text">학교를 먼저 선택해주세요.</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">📚 학과(전공) <span class="required">*</span></label>
                            <select v-model="form.departmentId" class="form-input"
                                :class="{ 'input-error': errors.departmentId }" :disabled="!form.collegeId">
                                <option value="">학과를 선택하세요</option>
                                <option v-for="department in departments" :key="department.departmentId"
                                    :value="department.departmentId">
                                    {{ department.name }}
                                </option>
                            </select>
                            <span v-if="errors.departmentId" class="error-msg">{{ errors.departmentId }}</span>
                            <span v-if="!form.universityId && !errors.collegeId" class="help-text">학부를 먼저 선택해주세요.</span>
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
                                <label v-for="status in ENROLLMENT_STATUS" :key="status.value" class="radio-label"
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
                                <option v-for="mbti in MBTI_LIST" :key="mbti" :value="mbti">{{ mbti }}</option>
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
                                <option v-for="pref in ACTIVITY_PREFERENCE" :key="pref.value" :value="pref.value">
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
                    <button v-else type="submit" class="btn-submit" :disabled="uiStore.isLoading">
                        <span v-if="uiStore.isLoading" class="spinner">⟳</span>
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
import { useSchoolStore } from '@/stores/school'
import { useUiStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import { memberApi } from '@/api/restApi'

import { ENROLLMENT_STATUS, ACTIVITY_PREFERENCE, MBTI_LIST } from '@/constants'

const router = useRouter()
const schoolStore = useSchoolStore()
const uiStore = useUiStore()

const currentStep = ref(1)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const steps = [
    { id: 1, label: '계정 정보' },
    { id: 2, label: '개인 정보' },
    { id: 3, label: '학교 정보' },
    { id: 4, label: '프로필' }
]

const form = reactive({
    // Step 1 - 계정
    email: '',
    isEmailChecked: false,
    password: '',
    passwordConfirm: '',

    // Step 2 - 개인
    name: '',
    gender: '',
    birthDate: '',
    phoneNumber: '',

    // Step 3 - 학교
    universityId: '',
    collegeId: '',
    departmentId: '',
    studentId: '',
    grade: 0,
    enrollmentStatus: 'ENROLLED',

    profileImage: null,
    memberId: null,
    mbti: '',
    interest: '',
    skill: '',
    activityPreference: 'MORNING',
    introduction: '',
    motto: null,
    instagram: '',
    memo: '',
})

const errors = reactive({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    universityId: '',
    collegeId: '',
    departmentId: '',
    studentId: ''
})

watch(() => form.email, () => {
    if (form.isEmailChecked) {
        form.isEmailChecked = false
    }
    if (errors.email) {
        errors.email = ''
    }
})

const handleCheckEmail = async () => {
    if (!form.email) {
        errors.email = '이메일을 입력해주세요.'
        return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
        errors.email = '유효한 이메일 형식이 아닙니다.'
        return
    }

    uiStore.isLoading = true // (작성하신 uiStore 사용 환경에 맞춰 유지)
    try {
        const response = await memberApi.getMemberByEmail(form.email)

        if (response.data) {
            errors.email = '이미 사용 중인 이메일입니다.'
            form.isEmailChecked = false
        } else {
            errors.email = ''
            form.isEmailChecked = true
        }
    } catch (error) {
        errors.email = '중복 검사 중 서버 오류가 발생했습니다.'
        console.error(error)
    } finally {
        uiStore.isLoading = false
    }
}

// Store에서 목록 가져오기
const { universities, colleges, departments } = storeToRefs(schoolStore)

watch(() => form.universityId, async (newUniversityId) => {

    form.collegeId = ''
    form.departmentId = ''

    if (newUniversityId) {
        await schoolStore.fetchColleges(newUniversityId)
    } else {
        colleges.value = []
        departments.value = []
    }
})

watch(() => form.collegeId, async (newCollegeId) => {
    form.departmentId = ''
    if (newCollegeId) {
        await schoolStore.fetchDepartments(newCollegeId)
    } else {
        departments.value = []
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

        if(!form.isEmailChecked) {
            errors.email = '이메일 중복검사를 진행해주세요.'; valid = false
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
        errors.collegeId = ''
        errors.departmentId = ''
        errors.studentId = ''

        if (!form.universityId) { errors.universityId = '학교를 선택해주세요.'; valid = false }
        if (!form.collegeId) { errors.collegeId = '학부를 선택해주세요.'; valid = false }
        if (!form.departmentId) { errors.departmentId = '학과를 선택해주세요.'; valid = false }
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

    uiStore.isLoading = true
    let isSuccess = false

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
        isSuccess = true
        router.push('/login')

    } catch (error) {
        console.error('회원가입 에러:', error)
        uiStore.isError = true
        uiStore.errorMessage = error.message || '서버와의 통신 중 오류가 발생했습니다.'
    } finally {
        uiStore.isLoading = false
        if (isSuccess) {
            await uiStore.alert('회원가입 성공', '회원가입되었습니다. 로그인해 주세요!')
        } else {
            await uiStore.alert('회원가입 실패', '회원가입에 실패하였습니다...!')
        }
    }
}

onMounted(async () => {
    await schoolStore.fetchUniversities()
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

.input-with-button {
    display: flex;
    gap: 8px;
    /* input과 버튼 사이 간격 */
    align-items: stretch;
    /* input과 버튼의 높이를 동일하게 맞춤 */
}

/* input이 남은 영역을 모두 차지하도록 flex: 1 적용 */
.input-with-button .form-input {
    flex: 1;
}

/* 버튼 텍스트가 줄바꿈되지 않도록 고정 */
.input-with-button .check-btn {
    white-space: nowrap;
    padding: 0 16px;
}

/* 중복 검사 성공 메시지 스타일 */
.success-msg {
    display: block;
    margin-top: 4px;
    font-size: 0.875rem;
    color: #16a34a;
    /* 초록색 */
}

/* 에러 메시지 스타일 (기존에 있다면 생략 가능) */
.error-msg {
    display: block;
    margin-top: 4px;
    font-size: 0.875rem;
    color: #dc2626;
    /* 빨간색 */
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
