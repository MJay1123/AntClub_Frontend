import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api/restApi";
import { memberApi } from "@/api/restApi";
import { useUiStore } from "./ui";

const uiStore = useUiStore()

export const useAuthStore = defineStore("auth", () => {
  const myInfo = ref(null);
  const isLoggedIn = computed(() => myInfo.value !== null);

  const login = async (request) => {
    console.log('auth.js - login')
    uiStore.isLoading = true
    try {
      const response = await authApi.login(request)
      const memberId = response.data.memberId
      localStorage.setItem('memberId', memberId)

      const expireTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('expireTime', expireTime.toString())
    } catch (error) {
      console.log('error', error)
      throw error
    } finally {
      uiStore.isLoading = false
    }
  };

  const logout = async () => {
    console.log('auth.js - logout')
    myInfo.value = null;
    localStorage.removeItem("memberId");
  };

  const fetchLoginInfo = async () => {
    console.log('auth.js - fetchLoginInfo')
    uiStore.isLoading = true
    myInfo.value = null
    const memberId = localStorage.getItem('memberId')
    const expireTime = Number(localStorage.getItem("expireTime"));
    if(!memberId || !expireTime) {
      localStorage.removeItem('memberId')
      localStorage.removeItem('expireTime')
      return
    }
    if(Date.now() >= expireTime){
      console.log('로그인 정보 만료')
      localStorage.removeItem('memberId')
      localStorage.removeItem('expireTime')
    }
    try {
      const response = await memberApi.getMember(memberId)
      myInfo.value = response.data

      const expireTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('expireTime', expireTime.toString())
      
    } catch (error) {
      console.log('error', error)
      throw error
    } finally {
      uiStore.isLoading = false
    }
  }

  return {
    myInfo, isLoggedIn,
    login, logout, fetchLoginInfo
  }


});
