<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isLoading" class="modal-overlay">
                <div class="modal-container loading-modal">
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <p class="loading-text">로딩 중입니다...</p>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
})
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
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    min-width: 200px;
}

/* 스피너 */
.loading-spinner {
    position: relative;
    width: 60px;
    height: 60px;
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 4px solid transparent;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
    border-top-color: #4f46e5;
    animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
    border-top-color: #7c3aed;
    animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
    border-top-color: #a855f7;
    animation-delay: -0.15s;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 15px;
    color: #6b7280;
    font-weight: 500;
    margin: 0;
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
</style>
