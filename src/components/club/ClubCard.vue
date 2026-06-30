<template>
  <div class="club-card" @click="$emit('click')">

    <div class="card-banner" :style="club.bannerImage ? `background-image: url(${club.bannerImage})` : ''">
      
      <span class="status-badge" :class="statusClass">
        {{ statusLabel }}
      </span>

    </div>

    <div class="card-body">

      <!-- 로고 + 이름 -->
      <div class="card-title-row">
        <img
          :src="club.logoImage ? club.logoImage : defaultLogo"
          class="club-logo"
          alt="logo"
        />
        <div>
          <h3 class="club-name">{{ club.clubName }}</h3>
          <span class="club-category">{{ club.category ?? '기타' }}</span>
        </div>
      </div>

      <!-- 설명 -->
      <p class="club-desc">
        {{ club.description || '동아리 소개가 없습니다.' }}
      </p>

      <!-- 정보 -->
      <div class="card-info">
        <span v-if="club.location">
          📍 {{ club.location }}
        </span>
        <span v-if="club.maxMembers">
          👥 최대 {{ club.maxMembers }}명
        </span>
      </div>

      <!-- 하단 -->
      <div class="card-footer">
        <span class="join-type-badge" :class="joinTypeClass">
          {{ joinTypeLabel }}
        </span>
      </div>

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
</script>

<style scoped>
.club-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
}
.club-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 배너 */
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
.club-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.club-category {
  font-size: 0.78rem;
  color: #6b7280;
}

/* 설명 */
.club-desc {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* 정보 */
.card-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: #9ca3af;
}

/* 하단 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.join-type-badge {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
}
.type-free     { background: #eff6ff; color: #2563eb; }
.type-approval { background: #fef3c7; color: #d97706; }
.type-closed   { background: #fee2e2; color: #dc2626; }

.joined-label {
  font-size: 0.8rem;
  color: #16a34a;
  font-weight: 600;
}
</style>
