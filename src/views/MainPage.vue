<template>
  <div
    class="min-h-screen"
    style="background: linear-gradient(160deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)"
  >

    <!-- 헤더 -->
    <header class="bg-white shadow-sm px-6 py-4">
      <div class="max-w-5xl mx-auto flex justify-between items-center">

        <!-- 로고 -->
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style="background: linear-gradient(135deg, #38bdf8, #0ea5e9)"
          >
            🏘️
          </div>
          <span class="text-xl font-extrabold" style="color: #0ea5e9">ClubMate</span>
        </div>

        <!-- 유저 영역 -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style="background: linear-gradient(135deg, #38bdf8, #0ea5e9)"
            >
              {{ authStore.user?.name?.charAt(0) }}
            </div>
            <span class="text-sm font-semibold" style="color: #334155">
              {{ authStore.user?.name }}님
            </span>
          </div>
          <button
            @click="handleLogout"
            class="text-xs px-3 py-1.5 rounded-lg border transition"
            style="border-color: #e2e8f0; color: #94a3b8"
            @mouseenter="(e) => { e.target.style.borderColor = '#fca5a5'; e.target.style.color = '#ef4444' }"
            @mouseleave="(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.color = '#94a3b8' }"
          >
            로그아웃
          </button>
        </div>

      </div>
    </header>

    <!-- 메인 -->
    <main class="max-w-5xl mx-auto px-4 py-10">

      <!-- 인사 배너 -->
      <div
        class="rounded-3xl px-8 py-8 mb-10 relative overflow-hidden"
        style="background: linear-gradient(135deg, #0ea5e9, #38bdf8)"
      >
        <!-- 배경 장식 원 -->
        <div
          class="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
          style="background: white"
        />
        <div
          class="absolute -right-4 bottom-0 w-28 h-28 rounded-full opacity-10"
          style="background: white"
        />

        <div class="relative">
          <p class="text-white text-opacity-80 text-sm font-medium mb-1">
            👋 안녕하세요!
          </p>
          <h2 class="text-white text-2xl font-extrabold mb-1">
            {{ authStore.user?.name }}님, 환영합니다 🎉
          </h2>
          <p class="text-sm" style="color: #bae6fd">
            현재
            <strong class="text-white">{{ myGroups.length }}개</strong>의 모임을 운영 중이에요.
          </p>
        </div>
      </div>

      <!-- 내 모임 목록 섹션 -->
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-bold" style="color: #334155">
          📋 내 모임 목록
        </h3>
        <button
          @click="openCreateModal"
          class="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl
                 text-white transition"
          style="background: linear-gradient(135deg, #38bdf8, #0ea5e9)"
        >
          <span class="text-base leading-none">＋</span>
          새 모임
        </button>
      </div>

      <!-- 모임 카드 그리드 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

        <div
          v-for="group in myGroups"
          :key="group.id"
          @click="selectGroup(group)"
          class="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200"
          :style="selectedGroup?.id === group.id
            ? 'box-shadow: 0 0 0 2px #0ea5e9, 0 10px 30px rgba(14,165,233,0.15)'
            : 'box-shadow: 0 2px 12px rgba(0,0,0,0.06)'"
          @mouseenter="(e) => e.currentTarget.style.transform = 'translateY(-3px)'"
          @mouseleave="(e) => e.currentTarget.style.transform = 'translateY(0)'"
        >
          <!-- 카드 헤더 -->
          <div class="flex items-start justify-between mb-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              :style="`background: ${group.bgColor}`"
            >
              {{ group.emoji }}
            </div>
            <!-- 선택됨 표시 -->
            <div
              v-if="selectedGroup?.id === group.id"
              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style="background: #0ea5e9"
            >
              ✓
            </div>
          </div>

          <!-- 모임 이름 -->
          <h4 class="font-bold text-base mb-1" style="color: #1e293b">
            {{ group.name }}
          </h4>

          <!-- 멤버 수 -->
          <p class="text-xs mb-4" style="color: #94a3b8">
            👥 멤버 {{ group.memberCount }}명
          </p>

          <!-- 태그 -->
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="tag in group.tags"
              :key="tag"
              class="text-xs px-2.5 py-1 rounded-full font-medium"
              style="background: #f0f9ff; color: #0284c7"
            >
              {{ tag }}
            </span>
          </div>
        </div>

      </div>

      <!-- 관리 메뉴 (모임 선택 후) -->
      <transition name="fade-up">
        <div v-if="selectedGroup">

          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
              style="background: #0ea5e9"
            >
              <span class="text-white text-xs">✓</span>
            </div>
            <h3 class="text-lg font-bold" style="color: #334155">
              {{ selectedGroup.name }} 관리 메뉴
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              v-for="menu in menuItems"
              :key="menu.label"
              @click="menu.action"
              class="bg-white rounded-2xl p-6 text-left transition-all duration-200
                     flex flex-col gap-3"
              style="box-shadow: 0 2px 12px rgba(0,0,0,0.06)"
              @mouseenter="(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 0 0 2px #38bdf8, 0 10px 30px rgba(14,165,233,0.12)'
              }"
              @mouseleave="(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
              }"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                :style="`background: ${menu.bgColor}`"
              >
                {{ menu.icon }}
              </div>
              <div>
                <p class="font-bold text-base" style="color: #1e293b">
                  {{ menu.label }}
                </p>
                <p class="text-xs mt-0.5" style="color: #94a3b8">
                  {{ menu.desc }}
                </p>
              </div>
            </button>
          </div>

        </div>
      </transition>

      <!-- 모임 선택 안내 (미선택시) -->
      <div
        v-if="!selectedGroup"
        class="text-center py-10"
        style="color: #cbd5e1"
      >
        <p class="text-4xl mb-3">☝️</p>
        <p class="text-sm font-medium">위에서 관리할 모임을 선택해주세요</p>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const selectedGroup = ref(null)

const myGroups = ref([
  {
    id: 1,
    name: '개발 스터디',
    emoji: '💻',
    bgColor: '#eff6ff',
    memberCount: 8,
    tags: ['스터디', '주 1회'],
  },
  {
    id: 2,
    name: '풋살 모임',
    emoji: '⚽',
    bgColor: '#f0fdf4',
    memberCount: 15,
    tags: ['운동', '주말'],
  },
  {
    id: 3,
    name: '독서 클럽',
    emoji: '📚',
    bgColor: '#fdf4ff',
    memberCount: 6,
    tags: ['독서', '격주'],
  },
])

const menuItems = [
  {
    icon: '👤',
    label: '회원 관리',
    desc: '회원 추가, 삭제, 정보 수정',
    bgColor: '#eff6ff',
    action: () => router.push('/members'),
  },
  {
    icon: '💰',
    label: '회비 관리',
    desc: '납부 현황 및 금액 설정',
    bgColor: '#f0fdf4',
    action: () => router.push('/fees'),
  },
  {
    icon: '📅',
    label: '모임 출석',
    desc: '참여 신청 및 출석 체크',
    bgColor: '#fff7ed',
    action: () => router.push('/meetings'),
  },
]

function selectGroup(group) {
  selectedGroup.value = selectedGroup.value?.id === group.id ? null : group
}

function openCreateModal() {
  alert('새 모임 만들기 - 추후 구현 예정!')
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.35s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
