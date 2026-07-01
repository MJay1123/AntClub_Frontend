<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <Transition name="slide">
          <div v-if="modelValue" class="modal-container" :class="`modal-${size}`">

            <div class="modal-header">
              <h3 class="modal-title">
                <slot name="title" />
              </h3>
              <button class="close-btn" @click="emit('update:modelValue', false)">
                ✕
              </button>
            </div>

            <div class="modal-body">
              <slot name="body"/>
            </div>

            <!-- 푸터 -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  size:       { type: String,  default: 'md' }, // sm | md | lg
  closeOnBackdrop: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'close'])

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}
.modal-sm { max-width: 380px; }
.modal-md { max-width: 520px; }
.modal-lg { max-width: 720px; }

/* 헤더 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}
.close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover { background: #e5e7eb; }

/* 바디 */
.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

/* 푸터 */
.modal-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 트랜지션 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-enter-from,   .slide-leave-to     { opacity: 0; transform: translateY(-16px) scale(0.97); }
</style>
