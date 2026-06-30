<template>
  <div class="login-page">
    <div class="login-container">
      <div class="left-panel">
        <div class="left-content">
          <router-link to="/" class="back-logo">
            <span>🐜</span>
            <span>AntClub</span>
          </router-link>
          <div class="left-text">
            <h2>AntClub에 오신 것을</h2>
            <h2>환영합니다! 👋</h2>
            <p>로그인하여 동아리 활동을 이어가세요.</p>
          </div>
          <div class="left-features">
            <div class="left-feature-item" v-for="item in leftFeatures" :key="item">
              <span class="feature-dot">●</span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-wrapper">
          <h2 class="form-title">로그인</h2>
          <p class="form-subtitle">AntClub 계정으로 시작하세요</p>

          <form @submit.prevent="handleLogin" class="form">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📧</span> 이메일
              </label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'input-error': errors.email }"
                placeholder="이메일을 입력하세요"
                autocomplete="email"
              />
              <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🔒</span> 비밀번호
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'input-error': errors.password }"
                  placeholder="비밀번호를 입력하세요"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>로그인 상태 유지</span>
              </label>
              <a href="#" class="forgot-link">비밀번호 찾기</a>
            </div>

            <button
              type="submit"
              class="btn-submit"
              :disabled="uiStore.isLoading"
            >
              <span v-if="uiStore.isLoading" class="spinner">⟳</span>
              <span v-else>로그인</span>
            </button>
          </form>

          <div class="divider">
            <span>또는</span>
          </div>

          <p class="register-link">
            아직 계정이 없으신가요?
            <router-link to="/register">회원가입 →</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui' // ⭐️ uiStore 추가
import router from '@/router'

const authStore = useAuthStore()
const uiStore = useUiStore() // ⭐️ uiStore 초기화

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)

const leftFeatures = [
  '동아리 회원 통합 관리',
  '실시간 회비 납부 현황',
  '스마트 일정 캘린더',
  '편리한 공지 게시판'
]

const validateForm = () => {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = '이메일을 입력해주세요.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.'
    valid = false
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.'
    valid = false
  } else if (form.password.length < 4) {
    errors.password = '비밀번호는 4자 이상이어야 합니다.'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  uiStore.isLoading = true
  let isSuccess = false

  try {
    const request = {
      email : form.email,
      password : form.password
    }

    await authStore.login(request)

    isSuccess = true
    
  } catch (error) {
    uiStore.isError = true
    uiStore.errorMessage = error.message || '로그인 중 오류가 발생했습니다.'
  } finally {
    uiStore.isLoading = false
  }

  if(isSuccess){
    await uiStore.alert('로그인 성공', '로그인에 성공하셨습니다!')
    router.push('/club')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 580px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
}

/* ===== Left Panel ===== */
.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #1e293b, #334155);
  padding: 60px 48px;
  display: flex;
  align-items: center;
  color: white;
}

.left-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.back-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-size: 24px;
  font-weight: 800;
}

.back-logo span:first-child {
  font-size: 32px;
}

.left-text h2 {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.left-text p {
  color: #94a3b8;
  margin-top: 12px;
  font-size: 15px;
}

.left-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.left-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #cbd5e1;
}

.feature-dot {
  color: #6366f1;
  font-size: 8px;
}

/* ===== Right Panel ===== */
.right-panel {
  flex: 1;
  background: white;
  padding: 60px 48px;
  display: flex;
  align-items: center;
}

.form-wrapper {
  width: 100%;
}

.form-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 32px;
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

/* ===== Form ===== */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  font-size: 14px;
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
  transition: all 0.2s ease;
  box-sizing: border-box;
  outline: none;
  background: #f8fafc;
}

.form-input:focus {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.input-error {
  border-color: #ef4444 !important;
}

.toggle-password {
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

/* ===== Options ===== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
}

.forgot-link {
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* ===== Submit ===== */
.btn-submit {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== Divider ===== */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #94a3b8;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

/* ===== Register Link ===== */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.register-link a {
  color: #6366f1;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}

.register-link a:hover {
  text-decoration: underline;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .login-container { flex-direction: column; }
  .left-panel { padding: 40px 28px; }
  .right-panel { padding: 40px 28px; }
}
</style>
