<template>
  <span class="club-badge" :class="[typeClass, sizeClass]">
    <span v-if="icon" class="badge-icon">{{ icon }}</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

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

const UI_MAP = {
  gender: {
    MALE: { style: 'blue', label: '남자', icon: '♂️' },
    FEMALE: { style: 'red', label: '여자', icon: '♀️' },
    OTHER: { style: 'gray', label: '미정', icon: '❌' },
  },
  clubStatus: {
    ACTIVE: { style: 'green', label: '활동중', icon: '' },
    INACTIVE: { style: 'gray', label: '비활동', icon: '' },
    DISBANDED: { style: 'red', label: '해체', icon: '' },
  },
  role: {
    PRESIDENT: { style: 'yellow', label: '회장', icon: '👑' },
    EXECUTIVE: { style: 'blue', label: '임원', icon: '⭐' },
    MEMBER: { style: 'gray', label: '회원', icon: '👤' },
  },
  joinType: {
    FREE: { style: 'blue', label: '자유가입', icon: '' },
    APPROVAL: { style: 'yellow', label: '승인가입', icon: '' },
    CLOSED: { style: 'red', label: '가입불가', icon: '' },
  },
  paymentStatus: {
    PAID: { style: 'green', label: '납부', icon: '✓' },
    PARTIAL: { style: 'yellow', label: '부분 납부', icon: '△' },
    UNPAID: { style: 'red', label: '미납', icon: '✕' },
    EXEMPTED: { style: 'gray', label: '면제', icon: '-' },
  },
  memberStatus: {
    PENDING: { style: 'yellow', label: '대기', icon: '⏳' },
    APPROVED: { style: 'green', label: '승인', icon: '✅' },
    REJECTED: { style: 'red', label: '거절', icon: '❌' },
    WITHDRAW: { style: 'gray', label: '탈퇴', icon: '⚠️' },
    EXPELLED: { style: 'red', label: '추방', icon: '⛔' },
  },
  scheduleType: {
    REGULAR: { style: 'blue', label: '정기회합', icon: '' },
    SPECIAL: { style: 'purple', label: '특별회합', icon: '' },
    COMPETITION: { style: 'yellow', label: '대회', icon: '' },
    WORKSHOP: { style: 'green', label: '워크숍', icon: '' },
    PARTY: { style: 'pink', label: '파티', icon: '' },
    ETC: { style: 'gray', label: '그 외', icon: '' },
  },
  scheduleStatus: {
    SCHEDULED: { style: 'blue', label: '예정', icon: '' },
    ONGOING: { style: 'green', label: '진행중', icon: '' },
    COMPLETED: { style: 'gray', label: '완료', icon: '' },
    CANCELLED: { style: 'red', label: '취소됨', icon: '' },
  },
}

// 3. 상수 파일에서 label을 찾고, UI_MAP에서 style과 icon을 찾아 병합합니다.
const resolved = computed(() => {
  const ui = UI_MAP[props.type]?.[props.value]

  const label = ui?.label ?? props.value
  const icon = ui?.icon ?? ''
  const style = ui?.style ?? 'gray'

  return { label, icon, style};
})

const label = computed(() => resolved.value.label)
const icon = computed(() => resolved.value.icon)
const typeClass = computed(() => `badge-${resolved.value.style}`)
const sizeClass = computed(() => `badge-${props.size}`)
</script>

<style scoped>
.club-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border-radius: 30px;
  font-weight: 600;
  white-space: nowrap;
}

/* 사이즈 */
.badge-sm {
  padding: 2px 8px;
  font-size: 0.72rem;
}

.badge-md {
  padding: 3px 10px;
  font-size: 0.8rem;
}

/* 색상 */
.badge-red {
  background: #fee2e2;
  color: #dc2626;
}

.badge-orange {
  background: #ffc31f;
  color: #ffffff;
}

.badge-yellow {
  background: #fef3c7;
  color: #d97706;
}

.badge-green {
  background: #18da6f;
  color: #ffffff;
}

.badge-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-purple {
  background: #ede9fe;
  color: #6d28d9;
}

.badge-pink {
  background: #fce7f3;
  color: #9d174d;
}

.badge-gray {
  background: #f3f4f6;
  color: #6b7280;
}

.badge-black {
  background: #000000;
  color: #ffffff;
}
</style>