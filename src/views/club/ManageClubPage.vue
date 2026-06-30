<template>
  <div class="manage-club-page" v-if="club">

    <div class="club-header">
      <img :src="club.logoImage || defaultLogo" class="logo" alt="logo" />
      <div>
        <h1>{{ club.clubName }}</h1>
        <p class="my-role">{{ roleLabel(clubMember?.clubRole) }}</p>
      </div>
      <button class="btn-back" @click="router.push(`/club/${club.clubId}`)">← 뒤로 가기</button>
    </div>

    <nav class="tab-nav">
      <router-link
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name, params: { clubId: club.clubId } }"
        class="tab-item"
        active-class="tab-active"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </router-link>
    </nav>

    <div class="tab-content">
      <router-view
        :club="club"
        :my-role="clubMember?.clubRole"
        :my-club-member-id="clubMember?.clubMemberId"
      >
    </router-view>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useClubStore } from '@/stores/club'
import { useClubMemberStore } from '@/stores/clubMember'
import defaultLogo from '@/assets/AntLogo.png'

const route  = useRoute()
const router = useRouter()

const clubStore = useClubStore()
const clubMemberStore = useClubMemberStore()

const { club } = storeToRefs(clubStore)
const { clubMembers, clubMember } = storeToRefs(clubMemberStore)

const tabs = [
  { name: 'ClubMember',   label: '회원 관리',  icon: '👥' },
  { name: 'ClubSchedule', label: '일정 관리',  icon: '📅' },
  { name: 'ClubDue',      label: '회비 관리',  icon: '💰' },
]

const fetchData = async () => {
  const clubId = route.params.clubId
  const memberId = localStorage.getItem('memberId')
  if(!club.value) await clubStore.fetchClub(clubId)
  if(!clubMember.value) await clubMemberStore.fetchClubMember(clubId, memberId)
  if(!clubMembers.value) await clubMemberStore.fetchClubMembers(clubId)
}

function roleLabel(v) {
  return { PRESIDENT: '회장', EXECUTIVE: '임원', MEMBER: '회원' }[v] ?? v
}

onMounted(async () => {
  await fetchData()
})

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
