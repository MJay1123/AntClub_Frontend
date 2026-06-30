<template>
  <div class="my-club-card" @click="$emit('click')">

    <!-- 왼쪽: 로고 -->
    <img
      :src="club.logoImage || '/default-logo.png'"
      class="club-logo"
      alt="logo"
    />

    <!-- 중간: 정보 -->
    <div class="card-info">
      <div class="name-row">
        <h3 class="club-name">{{ club.clubName }}</h3>
        <span class="role-badge" :class="roleClass">{{ roleLabel }}</span>
      </div>
      <p class="club-desc">{{ club.description || '소개글 없음' }}</p>
      <div class="meta">
        <span v-if="club.location">📍 {{ club.location }}</span>
        <span>👥 {{ club.memberCount ?? 0 }}명</span>
        <span>📅 가입일 {{ formatDate(club.joinDate) }}</span>
      </div>
    </div>

    <!-- 오른쪽: 화살표 -->
    <div class="arrow">›</div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  club: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const roleLabel = computed(() => ({
  PRESIDENT: '회장',
  EXECUTIVE: '임원',
  MEMBER:    '회원',
}[props.club.clubRole] ?? '회원'))

const roleClass = computed(() => ({
  PRESIDENT: 'role-president',
  EXECUTIVE: 'role-executive',
  MEMBER:    'role-member',
}[props.club.clubRole] ?? 'role-member'))

function formatDate(d) {
  return d ? d.slice(0, 10) : '-'
}
</script>

<style scoped>
.my-club-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.15s;
}
.my-club-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
}

/* 로고 */
.club-logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

/* 정보 */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.club-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 역할 뱃지 */
.role-badge {
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}
.role-president { background: #fef3c7; color: #d97706; }
.role-executive { background: #dbeafe; color: #1d4ed8; }
.role-member    { background: #f3f4f6; color: #6b7280; }

.club-desc {
  font-size: 0.83rem;
  color: #9ca3af;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 0.78rem;
  color: #9ca3af;
  flex-wrap: wrap;
}

/* 화살표 */
.arrow {
  font-size: 1.4rem;
  color: #d1d5db;
  flex-shrink: 0;
}
</style>
