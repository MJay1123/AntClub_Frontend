// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/main",
  },
  {
    path: "/main",
    name: "Main",
    component: MainPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: '/club',
    name: 'ClubList',
    component: () => import('@/views/club/ClubListPage.vue'),
  },
  {
    path: '/club/:clubId',
    name: 'ClubDetail',
    component: () => import('@/views/club/ClubDetailPage.vue'),
  },
  {
    path: '/club/:clubId/manage',
    component: () => import('@/views/club/ManageClubPage.vue'),
    children: [
      {
        path: '',
        redirect: 'members',
      },
      {
        path: 'members',
        name: 'ClubMember',
        component: () => import('@/views/club/ClubMemberPage.vue'),
      },
      {
        path: 'schedules',
        name: 'ClubSchedule',
        component: () => import('@/views/club/ClubSchedulePage.vue'),
      },
      {
        path: 'dues',
        name: 'ClubDue',
        component: () => import('@/views/club/ClubDuePage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
});

export default router;
