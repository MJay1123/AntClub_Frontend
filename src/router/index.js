import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/views/LoginPage.vue'
import MainPage from '@/views/MainPage.vue'
import MajorPage from '@/views/MajorPage.vue'
import MemberPage from '@/views/MemberPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/majors',
    name: 'major-list',
    component: MajorPage,
  },
  {
    path: '/members',
    name: 'member-list',
    component: MemberPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 로그인 필요 시에 로그인 화면으로 이동
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if(to.meta.requiresAuth && !authStore.isLoggedIn){
    return {name: 'login'}
  }
})

export default router
