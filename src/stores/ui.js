import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false)
    const isError = ref(false)
    const errorMessage = ref('')

    const startLoading = () => isLoading.value = true
    const stopLoading = () => isLoading.value = false

    const showError = (message) => {
        errorMessage.value = message
        isError.value = true
    }

    const closeError = () => {
        errorMessage.value = null
        isError.value = false
    }

    return isLoading, isError, errorMessage,
    startLoading, stopLoading, showError, closeError
})