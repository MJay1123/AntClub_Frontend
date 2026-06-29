<template>
  <div class="manage-club-page">

    <!-- ===== 상단 클럽 헤더 ===== -->
    <div class="club-header" v-if="club">
      <img :src="club.logoImage || '/default-logo.png'" class="logo" alt="logo" />
      <div>
        <h1>{{ club.clubName }}</h1>
        <p class="my-role">{{ roleLabel(myRole) }}</p>
      </div>
      <button class="btn-back" @click="router.push('/clubs')">← 목록으로</button>
    </div>

    <!-- ===== 탭 네비게이션 ===== -->
    <nav class="tab-nav">
      <router-link
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name, params: { clubId } }"
        class="tab-item"
        active-class="tab-active"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </router-link>
    </nav>

    <!-- ===== 탭 콘텐츠 ===== -->
    <div class="tab-content">
      <router-view
        :club="club"
        :my-role="myRole"
        :my-club-member-id="myClubMemberId"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchClubDetail } from '@/api/club'

const route  = useRoute()
const router = useRouter()

const clubId = computed(() => route.params.clubId)

const club            = ref(null)
const myRole          = ref('MEMBER')
const myClubMemberId  = ref(null)

const tabs = [
  { name: 'ClubMember',   label: '회원 관리',  icon: '👥' },
  { name: 'ClubSchedule', label: '일정 관리',  icon: '📅' },
  { name: 'ClubDue',      label: '회비 관리',  icon: '💰' },
]

async function load() {
  const res         = await fetchClubDetail(clubId.value)
  club.value        = res.data
  myRole.value      = res.data.myMembership?.clubRole     ?? 'MEMBER'
  myClubMemberId.value = res.data.myMembership?.clubMemberId ?? null
}

function roleLabel(v) {
  return { PRESIDENT: '회장', EXECUTIVE: '임원', MEMBER: '회원' }[v] ?? v
}

onMounted(load)
</script>

<style scoped>
.manage-club-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* 헤더 */
.club-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
}
.logo {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}
.club-header h1 { font-size: 1.4rem; font-weight: 700; }
.my-role        { font-size: 0.85rem; color: #1a73e8; font-weight: 600; }
.btn-back {
  margin-left: auto;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

/* 탭 */
.tab-nav {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 28px;
  gap: 4px;
}
.tab-item {
  padding: 12px 24px;
  text-decoration: none;
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px 8px 0 0;
  transition: all 0.15s;
}
.tab-item:hover { background: #f3f4f6; color: #111; }
.tab-active {
  color: #1a73e8;
  font-weight: 700;
  border-bottom: 3px solid #1a73e8;
  margin-bottom: -2px;
}
.tab-icon { font-size: 1.1rem; }
</style>
