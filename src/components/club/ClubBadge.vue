<template>
  <span class="club-badge" :class="[typeClass, sizeClass]">
    <span v-if="icon" class="badge-icon">{{ icon }}</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 뱃지 종류 */
  type: {
    type: String,
    required: true,
    // status | role | joinType | scheduleType | paymentStatus
  },
  /** 뱃지 값 */
  value: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',  // sm | md
  },
})

// 타입별 라벨/색상/아이콘 맵
const MAP = {
  // 동아리 상태
  status: {
    ACTIVE:    { label: '활동중',  style: 'green',  icon: '' },
    INACTIVE:  { label: '비활동',  style: 'gray',   icon: '' },
    DISBANDED: { label: '해체',    style: 'red',    icon: '' },
  },
  // 동아리 내 역할
  role: {
    PRESIDENT: { label: '회장', style: 'yellow', icon: '👑' },
    EXECUTIVE: { label: '임원', style: 'blue',   icon: '⭐' },
    MEMBER:    { label: '회원', style: 'gray',   icon: '' },
  },
  // 가입 방식
  joinType: {
    FREE:     { label: '자유가입', style: 'blue',   icon: '' },
    APPROVAL: { label: '승인가입', style: 'yellow', icon: '' },
    CLOSED:   { label: '가입불가', style: 'red',    icon: '' },
  },
  // 회비 납부 상태
  paymentStatus: {
    PAID:     { label: '완납',     style: 'green',  icon: '✓' },
    PARTIAL:  { label: '부분납부', style: 'yellow', icon: '△' },
    UNPAID:   { label: '미납',     style: 'red',    icon: '✕' },
    EXEMPTED: { label: '면제',     style: 'gray',   icon: '-' },
  },
  // 회원 가입 상태
  memberStatus: {
    PENDING:   { label: '대기중', style: 'yellow', icon: '⏳' },
    APPROVED:  { label: '승인됨', style: 'green',  icon: '✓' },
    REJECTED:  { label: '거절됨', style: 'red',    icon: '✕' },
    WITHDRAWN: { label: '탈퇴',   style: 'gray',   icon: '' },
    EXPELLED:  { label: '강퇴',   style: 'red',    icon: '' },
  },
}

const resolved = computed(() => MAP[props.type]?.[props.value] ?? { label: props.value, style: 'gray', icon: '' })
const label    = computed(() => resolved.value.label)
const icon     = computed(() => resolved.value.icon)

const typeClass = computed(() => `badge-${resolved.value.style}`)
const sizeClass = computed(() => `badge-${props.size}`)
</script>

<style scoped>
.club-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border-radius: 99px;
  font-weight: 600;
  white-space: nowrap;
}

/* 사이즈 */
.badge-sm { padding: 2px 8px;  font-size: 0.72rem; }
.badge-md { padding: 3px 10px; font-size: 0.8rem; }

/* 색상 */
.badge-green  { background: #dcfce7; color: #16a34a; }
.badge-blue   { background: #dbeafe; color: #1d4ed8; }
.badge-yellow { background: #fef3c7; color: #d97706; }
.badge-red    { background: #fee2e2; color: #dc2626; }
.badge-gray   { background: #f3f4f6; color: #6b7280; }
</style>
