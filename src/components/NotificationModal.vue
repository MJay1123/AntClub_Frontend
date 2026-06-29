<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="show" class="modal-backdrop" @click.self="onCancel">
                <Transition name="modal-slide">
                    <div v-if="show" class="modal-container" role="dialog" aria-modal="true" :aria-labelledby="'modal-title-' + uid">

                        <div class="modal-header">
                            <h3 :id="'modal-title-' + uid" class="modal-title">
                                {{ mode === 'alert' ? '✅' : '❓'}}{{ title }}
                            </h3>
                        </div>

                        <div class="modal-body">
                            <p class="modal-content-text">{{ content }}</p>
                        </div>

                        <div class="modal-footer" :class="`footer-${mode}`">
                            
                            <button v-if="mode === 'confirm'" class="modal-btn btn-cancel" @click="onCancel">
                                취소
                            </button>
                            
                            <button class="modal-btn btn-confirm" @click="onConfirm" ref="confirmBtnRef">
                                확인
                            </button>

                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'

// ── Props ─────────────────────────────────────────────
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: 'alert',
        validator: (v) => ['alert', 'confirm'].includes(v),
    },
    title: {
        type: String,
        default: '알림',
    },
    content: {
        type: String,
        default: '',
    },
})

// ── Emits ─────────────────────────────────────────────
const emit = defineEmits(['confirm', 'cancel'])

// ── 내부 상태 ─────────────────────────────────────────
const confirmBtnRef = ref(null)
const uid = getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2)

// ── 이벤트 핸들러 ─────────────────────────────────────
function onConfirm() {
    emit('confirm')
}

function onCancel() {
    emit('cancel')
}

// ── ESC/Enter 키 조작 ─────────────────────────────────
function onKeydown(e) {
    if (!props.show) return
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter') {
        // 엔터 키 입력 기본 동작 방지 (중복 클릭 방지)
        e.preventDefault()
        onConfirm()
    }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// ── 열릴 때 확인 버튼에 자동 포커스 ─────────────────────
watch(() => props.show, (val) => {
    if (val) {
        setTimeout(() => confirmBtnRef.value?.focus(), 100)
    }
})
</script>

<style scoped>
/* ── 백드롭 ────────────────────────────────────────── */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
}

/* ── 모달 컨테이너 ─────────────────────────────────── */
.modal-container {
    background: #ffffff;
    border-radius: 16px;
    box-shadow:
        0 4px 6px rgba(0, 0, 0, 0.05),
        0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    max-width: 400px; /* 기본 크기 고정 */
}

/* ── 헤더 ──────────────────────────────────────────── */
.modal-header {
    padding: 24px 24px 0;
}

.modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.4;
}

/* ── 바디 ──────────────────────────────────────────── */
.modal-body {
    padding: 16px 24px 8px;
}

.modal-content-text {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line; /* 줄바꿈 지원 */
}

/* ── 푸터 ──────────────────────────────────────────── */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px 24px 24px;
}

/* ── 버튼 ──────────────────────────────────────────── */
.modal-btn {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    min-width: 88px;
    outline: none;
}

.modal-btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35); /* 파란색 포커스 링 */
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-confirm {
    background: #3b82f6; /* 기본 파란색 버튼 */
    color: #ffffff;
}

.btn-confirm:hover {
    background: #2563eb;
}

/* ── 트랜지션 ──────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.97);
}
</style>