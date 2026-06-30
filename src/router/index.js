// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ClubListPage from "@/views/club/ClubListPage.vue";
import ClubDetailPage from "@/views/club/ClubDetailPage.vue";
import ManageClubPage from "@/views/club/ManageClubPage.vue";
import ClubMemberPage from "@/views/club/ClubMemberPage.vue";
import ClubSchedulePage from "@/views/club/ClubSchedulePage.vue";
import ClubDuePage from "@/views/club/ClubDuePage.vue";

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
    component: ClubListPage
  },
  {
    path: '/club/:clubId',
    name: 'ClubDetail',
    component: ClubDetailPage
  },
  {
    path: '/club/:clubId/manage',
    component: ManageClubPage,
    children: [
      {
        path: '',
        redirect: to => ({
          name: 'ClubMember',
          params: {
            clubId: to.params.clubId
          }
        })
      },
      {
        path: 'members',
        name: 'ClubMember',
        component: ClubMemberPage
      },
      {
        path: 'schedules',
        name: 'ClubSchedule',
        component: ClubSchedulePage
      },
      {
        path: 'dues',
        name: 'ClubDue',
        component: ClubDuePage
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
