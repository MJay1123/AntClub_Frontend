import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false)
    const isError = ref(false)
    const errorMessage = ref('')

    const modal = ref({
        show: false,
        mode: 'alert', // 'alert' 또는 'confirm'
        title: '',
        content: '',
        resolve: null, // 각 컴포넌트에서 기다리고 있는 '성공/실패 응답 함수'
    })

    const openModal = (mode, title, content) => {
        return new Promise((resolve) => {
            modal.value = { show: true, mode, title, content, resolve }
        })
    }

    const alert = (title, content = '') => openModal('alert', title, content)
    
    const confirm = (title, content = '') => openModal('confirm', title, content)

    const onConfirm = () => {
        modal.value.resolve?.(true)
        modal.value.show = false
    }

    const onCancel = () => {
        modal.value.resolve?.(false)
        modal.value.show = false
    }

    return {
        isLoading, isError, errorMessage, modal,
        openModal, alert, confirm, onConfirm, onCancel
    }
})