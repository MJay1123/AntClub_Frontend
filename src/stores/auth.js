import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api/restApi";
import { memberApi } from "@/api/restApi";

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref(null);
  const isLoggedIn = computed(() => userInfo.value !== null);

  const login = async (request) => {
    console.log('auth.js - login')
    try {
      const response = await authApi.login(request)
      const memberId = response.data.memberId
      localStorage.setItem('memberId', memberId)

      const expireTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('expireTime', expireTime.toString())
      
      await fetchLoginInfo()

    } catch (error) {
      console.log('error', error)
    }
  };

  const logout = async () => {
    console.log('auth.js - logout')
    userInfo.value = null;
    localStorage.removeItem("memberId");
  };

  const fetchLoginInfo = async () => {
    console.log('auth.js - fetchLoginInfo')
    const expireTime = Number(localStorage.getItem("expireTime"));
    if(!expireTime) {
      localStorage.removeItem('memberId')
      return
    }
    if(Date.now() >= expireTime){
      console.log('로그인 정보 만료')
      localStorage.removeItem('memberId')
      localStorage.removeItem('expireTime')
    }
    const memberId = localStorage.getItem('memberId')
    if(!memberId) {
      return
    }
    try {
      const response = await memberApi.getMember(memberId)
      userInfo.value = response.data

      const expireTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('expireTime', expireTime.toString())
      
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    userInfo, isLoggedIn,
    login, logout, fetchLoginInfo
  }


});
