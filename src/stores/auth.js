import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
    "auth",
    () => {
        const user = ref(null);
        // 예: user = { id: 1, name: '홍길동', email: 'hong@email.com' }
        const isLoggedIn = computed(() => !!user.value);

        function login(userData) {
            user.value = userData;
        }

        function logout() {
            user.value = null;
        }

        return { user, isLoggedIn, login, logout };
    },

);
