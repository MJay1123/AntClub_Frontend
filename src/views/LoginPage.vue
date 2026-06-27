<template>
  <div
    class="min-h-screen flex items-center justify-center px-4"
    style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)"
  >
    <div class="w-full max-w-md">

      <!-- 카드 -->
      <div class="bg-white rounded-3xl shadow-2xl px-10 py-12">

        <!-- 로고 -->
        <div class="flex flex-col items-center mb-10">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
            style="background: linear-gradient(135deg, #38bdf8, #0ea5e9)"
          >
            🏘️
          </div>
          <h1 class="text-3xl font-extrabold" style="color: #0ea5e9">ClubMate</h1>
          <p class="text-sm mt-1" style="color: #94a3b8">소규모 모임 관리 서비스</p>
        </div>

        <!-- 폼 -->
        <form @submit.prevent="handleLogin" class="space-y-5">

          <!-- 이메일 -->
          <div class="space-y-1">
            <label class="text-sm font-semibold" style="color: #475569">
              이메일
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base">📧</span>
              <input
                v-model="form.email"
                type="email"
                placeholder="example@email.com"
                class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                       outline-none transition-all duration-200"
                style="border-color: #e2e8f0; background: #f8fafc; color: #334155"
                @focus="(e) => (e.target.style.borderColor = '#38bdf8')"
                @blur="(e) => (e.target.style.borderColor = '#e2e8f0')"
                required
              />
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="space-y-1">
            <label class="text-sm font-semibold" style="color: #475569">
              비밀번호
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔒</span>
              <input
                v-model="form.password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm
                       outline-none transition-all duration-200"
                style="border-color: #e2e8f0; background: #f8fafc; color: #334155"
                @focus="(e) => (e.target.style.borderColor = '#38bdf8')"
                @blur="(e) => (e.target.style.borderColor = '#e2e8f0')"
                required
              />
            </div>
          </div>

          <!-- 에러 -->
          <div
            v-if="errorMsg"
            class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style="background: #fef2f2; color: #ef4444"
          >
            <span>⚠️</span>
            {{ errorMsg }}
          </div>

          <!-- 로그인 버튼 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl text-white font-bold text-sm
                   transition-all duration-200 disabled:opacity-60"
            style="background: linear-gradient(135deg, #38bdf8, #0ea5e9)"
            @mouseenter="(e) => !isLoading && (e.target.style.opacity = '0.9')"
            @mouseleave="(e) => (e.target.style.opacity = '1')"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4"
                />
                <path
                  class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              로그인 중...
            </span>
            <span v-else>로그인</span>
          </button>

        </form>

        <!-- 테스트 계정 안내 -->
        <div
          class="mt-4 px-4 py-3 rounded-xl text-xs text-center"
          style="background: #f0f9ff; color: #0369a1"
        >
          🧪 테스트 계정 : test@test.com / 1234
        </div>

        <!-- 회원가입 -->
        <p class="text-center text-sm mt-6" style="color: #94a3b8">
          계정이 없으신가요?
          <span
            class="font-semibold cursor-pointer transition"
            style="color: #0ea5e9"
          >
            회원가입
          </span>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await new Promise((r) => setTimeout(r, 800))
    if (form.value.email === 'test@test.com' && form.value.password === '1234') {
      authStore.login({ id: 1, name: '홍길동', email: form.value.email })
      router.push({ name: 'main' })
    } else {
      errorMsg.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch {
    errorMsg.value = '로그인 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>
