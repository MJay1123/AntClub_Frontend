<template>
  <span class="club-badge" :class="[typeClass, sizeClass]">
    <span v-if="icon" class="badge-icon">{{ icon }}</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import * as CONSTANTS from './constants.js'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',  // sm | md
  },
})

const CONSTANT_MAP = {
  gender: CONSTANTS.GENDER,
  clubStatus: CONSTANTS.CLUB_STATUS,
  clubRole: CONSTANTS.CLUB_ROLE,
  joinType: CONSTANTS.JOIN_TYPE,
  paymentStatus: CONSTANTS.PAYMENT_STATUS,
  memberStatus: CONSTANTS.CLUB_MEMBER_STATUS,
  scheduleType: CONSTANTS.SCHEDULE_TYPE,
  scheduleStatus: CONSTANTS.SCHEDULE_STATUS,
  paymentMethod: CONSTANTS.PAYMENT_METHOD,
  activityPreference: CONSTANTS.ACTIVITY_PREFERENCE,
  enrollmentStatus: CONSTANTS.ENROLLMENT_STATUS,
  role: CONSTANTS.ROLE,
  term: CONSTANTS.TERM
}

const UI_MAP = {
  gender: {
    MALE: { style: 'blue', icon: '♂️' },
    FEMALE: { style: 'red', icon: '♀️' },
    OTHER: { style: 'gray', icon: '❌' },
  },
  clubStatus: {
    ACTIVE:    { style: 'green', icon: '' },
    INACTIVE:  { style: 'gray',  icon: '' },
    DISBANDED: { style: 'red',   icon: '' },
  },
  role: {
    PRESIDENT: { style: 'yellow', icon: '👑' },
    EXECUTIVE: { style: 'blue',   icon: '⭐' },
    MEMBER:    { style: 'gray',   icon: '👤' },
  },
  joinType: {
    FREE:     { style: 'blue',   icon: '' },
    APPROVAL: { style: 'yellow', icon: '' },
    CLOSED:   { style: 'red',    icon: '' },
  },
  paymentStatus: {
    PAID:     { style: 'green',  icon: '✓' },
    PARTIAL:  { style: 'yellow', icon: '△' },
    UNPAID:   { style: 'red',    icon: '✕' },
    EXEMPTED: { style: 'gray',   icon: '-' },
  },
  memberStatus: {
    PENDING:  { style: 'yellow', icon: '⏳' },
    APPROVED: { style: 'green',  icon: '✅' },
    REJECTED: { style: 'red',    icon: '❌' },
    WITHDRAW: { style: 'gray',   icon: '⚠️' },
    EXPELLED: { style: 'red',    icon: '⛔' },
  },
  scheduleType: {
    REGULAR:     { style: 'blue',   icon: '' },
    SPECIAL:     { style: 'purple', icon: '' },
    COMPETITION: { style: 'yellow', icon: '' },
    WORKSHOP:    { style: 'green',  icon: '' },
    PARTY:       { style: 'pink',   icon: '' },
    ETC:         { style: 'gray',   icon: '' },
  },
  scheduleStatus: {
    SCHEDULED: { style: 'blue',  icon: '' },
    ONGOING:   { style: 'green', icon: '' },
    COMPLETED: { style: 'gray',  icon: '' },
    CANCELLED: { style: 'red',   icon: '' },
  },
}

// 3. 상수 파일에서 label을 찾고, UI_MAP에서 style과 icon을 찾아 병합합니다.
const resolved = computed(() => {
  const targetConstantArray = CONSTANT_MAP[props.type] || [];
  const constantItem = targetConstantArray.find(item => item.value === props.value);
  
  // 상수 파일에 매칭되는 label이 있으면 사용하고, 없으면 value 자체를 보여줍니다.
  const label = constantItem ? constantItem.label : props.value;
  
  // UI_MAP에 매칭되는 style/icon이 없으면 기본값인 gray를 반환합니다.
  const ui = UI_MAP[props.type]?.[props.value] || { style: 'gray', icon: '' };
  
  return { label, ...ui };
})

const label     = computed(() => resolved.value.label)
const icon      = computed(() => resolved.value.icon)
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
.badge-purple { background: #ede9fe; color: #6d28d9; }
.badge-pink   { background: #fce7f3; color: #9d174d; }
</style>