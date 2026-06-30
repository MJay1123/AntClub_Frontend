<template>
  <div v-if="totalPages > 1" class="pagination">

    <!-- 처음으로 -->
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="$emit('change', 1)"
    >
      «
    </button>

    <!-- 이전 -->
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="$emit('change', currentPage - 1)"
    >
      ‹
    </button>

    <!-- 페이지 번호 -->
    <button
      v-for="page in pageNumbers"
      :key="page"
      class="page-btn"
      :class="{ active: page === currentPage, ellipsis: page === '...' }"
      :disabled="page === '...'"
      @click="page !== '...' && $emit('change', page)"
    >
      {{ page }}
    </button>

    <!-- 다음 -->
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('change', currentPage + 1)"
    >
      ›
    </button>

    <!-- 마지막으로 -->
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('change', totalPages)"
    >
      »
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true },
  range:       { type: Number, default: 2 }, // 현재 페이지 기준 좌우 범위
})

defineEmits(['change'])

const pageNumbers = computed(() => {
  const { currentPage, totalPages, range } = props
  const pages = []

  const start = Math.max(1, currentPage - range)
  const end   = Math.min(totalPages, currentPage + range)

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 24px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.page-btn.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
}
</style>
