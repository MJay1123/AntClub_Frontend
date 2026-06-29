<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isError" class="modal-overlay" @click.self="handleClose">
                <Transition name="modal-slide">
                    <div v-if="isError" class="modal-container error-modal">
                        <!-- 아이콘 -->
                        <div class="error-icon-wrapper">
                            <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>

                        <!-- 텍스트 -->
                        <div class="error-content">
                            <h3 class="error-title">오류가 발생했습니다</h3>
                            <p class="error-message">{{ errorMessage || '알 수 없는 오류가 발생했습니다.' }}</p>
                        </div>

                        <!-- 버튼 -->
                        <div class="error-actions">
                            <button class="btn btn-retry" @click="handleRetry">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <polyline points="1 4 1 10 7 10" />
                                    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                                </svg>
                                다시 시도
                            </button>
                            <button class="btn btn-close" @click="handleClose">닫기</button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>

defineProps({
    isError: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['retry', 'close'])

const handleRetry = () => {
    emit('retry')
}

const handleClose = () => {
    emit('close')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.modal-container {
    background: #ffffff;
    border-radius: 16px;
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
}

/* 에러 아이콘 */
.error-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #fee2e2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.error-icon {
    width: 32px;
    height: 32px;
    color: #ef4444;
}

/* 텍스트 */
.error-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.error-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.error-message {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
    word-break: keep-all;
}

/* 버튼 */
.error-actions {
    display: flex;
    gap: 10px;
    width: 100%;
}

.btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-retry {
    background-color: #4f46e5;
    color: #ffffff;
}

.btn-retry:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
}

.btn-retry:active {
    transform: translateY(0);
}

.btn-retry svg {
    width: 16px;
    height: 16px;
}

.btn-close {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-close:hover {
    background-color: #e5e7eb;
}

/* 트랜지션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-enter-from,
.modal-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
}
</style>
