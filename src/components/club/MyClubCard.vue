<template>
  <div class="my-club-card" @click="$emit('click')">

    <div class="card-banner" :style="club.bannerImage ? `background-image: url(${club.bannerImage})` : ''">
      
      <span class="status-badge" :class="statusClass">
        {{ statusLabel }}
      </span>
    
    </div>


    <div class="card-body">
    
      <img :src="club.logoImage || defaultLogo" class="club-logo" alt="logo"/>

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

      <div class="card-footer">
        <span class="join-type-badge" :class="joinTypeClass">
          {{ joinTypeLabel }}
        </span>
      </div>

      <div class="arrow">›</div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import defaultLogo from '@/assets/AntLogo.png'

const props = defineProps({
  club: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const statusLabel = computed(() => ({
  ACTIVE:    '활동중',
  INACTIVE:  '비활동',
  DISBANDED: '해체',
}[props.club.status] ?? '-'))

const statusClass = computed(() => ({
  ACTIVE:    'badge-green',
  INACTIVE:  'badge-gray',
  DISBANDED: 'badge-red',
}[props.club.status] ?? ''))

const joinTypeLabel = computed(() => ({
  FREE:     '자유가입',
  APPROVAL: '승인가입',
  CLOSED:   '가입불가',
}[props.club.joinType] ?? '-'))

const joinTypeClass = computed(() => ({
  FREE:     'type-free',
  APPROVAL: 'type-approval',
  CLOSED:   'type-closed',
}[props.club.joinType] ?? ''))

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
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
}

.my-club-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-banner {
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
}

/* 상태 뱃지 */
.status-badge {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}
.badge-green  { background: rgba(22, 163, 74, 0.85); }
.badge-gray   { background: rgba(107, 114, 128, 0.85); }
.badge-red    { background: rgba(220, 38, 38, 0.85); }

.pending-badge {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.club-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
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
