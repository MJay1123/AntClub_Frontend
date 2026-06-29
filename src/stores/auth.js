import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api/restApi";
import { memberApi } from "@/api/restApi";

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref(null);
  const isLoggedIn = computed(() => userInfo.value !== null);

  const login = async (request) => {
    try {
      const response = await authApi.login(request)
      const memberId = response.data.memberId
      localStorage.setItem('memberId', memberId)

      await fetchMe()

    } catch (error) {
      console.log('auth.js - login :', error)
    }
  };

  const logout = async () => {
    userInfo.value = null;
    localStorage.removeItem("memberId");
  };

  const fetchMe = async () => {
    const memberId = localStorage.getItem('memberId')
    try {
      const response = await memberApi.getMember(memberId)
      userInfo.value = response.data
    } catch (error) {
      console.log('auth.js - fetchMe :', error)
    }
  }

  return {
    userInfo, isLoggedIn,
    login, logout, fetchMe
  }


});
