<template>
    <header class="header" :class="{ scrolled: isScrolled }">
        <div class="header-inner">
            <a href="#" class="logo" @click.prevent="router.push('/')">
                <span class="logo-icon">🐜</span>
                <span class="logo-text">AntClub</span>
            </a>

            <nav class="nav-desktop">
                <a href="#" class="nav-item" :class="{ 'nav-active': route.path === '/' }" @click.prevent="router.push('/')">
                    <span class="nav-icon">🏠</span>
                    <span>홈</span>
                </a>

                <div v-if="isLoggedIn" class="nav-dropdown" @mouseenter="clubMenuOpen = true" @mouseleave="clubMenuOpen = false">
                    <button class="nav-item nav-dropdown-trigger" :class="{ 'nav-active': isClubRoute }">
                        <span class="nav-icon">🏛️</span>
                        <span>동아리 관리</span>
                        <span class="dropdown-arrow" :class="{ rotated: clubMenuOpen }">▾</span>
                    </button>

                    <transition name="dropdown">
                        <div v-if="clubMenuOpen" class="dropdown-menu">
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">📋</span>
                                <div>
                                    <p class="dropdown-title">동아리 목록</p>
                                    <p class="dropdown-desc">전체 동아리를 확인하세요</p>
                                </div>
                            </a>
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">➕</span>
                                <div>
                                    <p class="dropdown-title">동아리 등록</p>
                                    <p class="dropdown-desc">새 동아리를 만들어보세요</p>
                                </div>
                            </a>
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">👥</span>
                                <div>
                                    <p class="dropdown-title">회원 관리</p>
                                    <p class="dropdown-desc">동아리 회원을 관리하세요</p>
                                </div>
                            </a>
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">💰</span>
                                <div>
                                    <p class="dropdown-title">회비 관리</p>
                                    <p class="dropdown-desc">회비 납부 현황을 확인하세요</p>
                                </div>
                            </a>
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">📅</span>
                                <div>
                                    <p class="dropdown-title">일정 관리</p>
                                    <p class="dropdown-desc">동아리 일정을 등록하세요</p>
                                </div>
                            </a>
                            <a href="#" class="dropdown-item">
                                <span class="dropdown-icon">📋</span>
                                <div>
                                    <p class="dropdown-title">게시판</p>
                                    <p class="dropdown-desc">공지 및 자유게시판</p>
                                </div>
                            </a>
                        </div>
                    </transition>
                </div>

                <template v-if="isLoggedIn">
                    <div class="nav-dropdown" @mouseenter="profileMenuOpen = true" @mouseleave="profileMenuOpen = false">
                        <button class="nav-item nav-profile-trigger">
                            <div class="avatar">
                                <img v-if="authStore.currentUser?.profileImage"
                                    :src="authStore.currentUser.profileImage" alt="프로필" />
                                <span v-else class="avatar-fallback">
                                    {{ authStore.currentUser?.name?.charAt(0) || "?" }}
                                </span>
                            </div>
                            <span>{{ authStore.currentUser?.name || "내 정보" }}</span>
                            <span class="dropdown-arrow" :class="{ rotated: profileMenuOpen }">▾</span>
                        </button>

                        <transition name="dropdown">
                            <div v-if="profileMenuOpen" class="dropdown-menu dropdown-menu-right">
                                <div class="dropdown-user-info">
                                    <div class="user-avatar-lg">
                                        {{ authStore.currentUser?.name?.charAt(0) || "?" }}
                                    </div>
                                    <div>
                                        <p class="user-name">{{ authStore.currentUser?.name }}</p>
                                        <p class="user-email">{{ authStore.currentUser?.email }}</p>
                                    </div>
                                </div>
                                <div class="dropdown-divider" />
                                <a href="#" class="dropdown-item">
                                    <span class="dropdown-icon">👤</span>
                                    <div>
                                        <p class="dropdown-title">내 프로필</p>
                                        <p class="dropdown-desc">프로필 정보 확인 및 수정</p>
                                    </div>
                                </a>
                                <a href="#" class="dropdown-item">
                                    <span class="dropdown-icon">🏛️</span>
                                    <div>
                                        <p class="dropdown-title">내 동아리</p>
                                        <p class="dropdown-desc">가입된 동아리 목록</p>
                                    </div>
                                </a>
                                <a href="#" class="dropdown-item">
                                    <span class="dropdown-icon">⚙️</span>
                                    <div>
                                        <p class="dropdown-title">설정</p>
                                        <p class="dropdown-desc">계정 설정 변경</p>
                                    </div>
                                </a>
                                <div class="dropdown-divider" />
                                <button class="dropdown-item dropdown-logout" @click="handleLogout">
                                    <span class="dropdown-icon">🚪</span>
                                    <div>
                                        <p class="dropdown-title">로그아웃</p>
                                    </div>
                                </button>
                            </div>
                        </transition>
                    </div>
                </template>

                <template v-else>
                    <a href="#" class="nav-item" :class="{ 'nav-active': route.path === '/login' }">
                        <span class="nav-icon">🔑</span>
                        <span>로그인</span>
                    </a>
                    <a href="#" class="btn-register">
                        회원가입
                    </a>
                </template>
            </nav>

            <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
                <span :class="{ open: mobileMenuOpen }"></span>
                <span :class="{ open: mobileMenuOpen }"></span>
                <span :class="{ open: mobileMenuOpen }"></span>
            </button>
        </div>

        <transition name="slide-down">
            <div v-if="mobileMenuOpen" class="mobile-menu">
                <a href="#" class="mobile-nav-item" :class="{ 'nav-active': route.path === '/' }">
                    🏠 홈
                </a>

                <template v-if="isLoggedIn">
                    <div class="mobile-section">
                        <p class="mobile-section-title">동아리 관리</p>
                        <a href="#" class="mobile-nav-item sub">
                            📋 동아리 목록
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            ➕ 동아리 등록
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            👥 회원 관리
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            💰 회비 관리
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            📅 일정 관리
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            📋 게시판
                        </a>
                    </div>

                    <div class="mobile-section">
                        <p class="mobile-section-title">내 정보</p>
                        <a href="#" class="mobile-nav-item sub">
                            👤 내 프로필
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            🏛️ 내 동아리
                        </a>
                        <a href="#" class="mobile-nav-item sub">
                            ⚙️ 설정
                        </a>
                    </div>
                    <button class="mobile-logout-btn" @click="handleLogout">🚪 로그아웃</button>
                </template>

                <template v-else>
                    <a href="#" class="mobile-nav-item" :class="{ 'nav-active': route.path === '/login' }">
                        🔑 로그인
                    </a>
                    <a href="#" class="mobile-register-btn">
                        회원가입
                    </a>
                </template>
            </div>
        </transition>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter(); // useRouter 추가

const isScrolled = ref(false);
const clubMenuOpen = ref(false);
const profileMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

// 로그인 상태 체크 (localStorage의 memberId 또는 authStore 활용)
const isLoggedIn = computed(() => {
    return authStore.isLoggedIn || !!localStorage.getItem("memberId");
});

const isClubRoute = computed(() =>
    ["/clubs", "/members", "/dues", "/schedule", "/board"].some((p) => route.path.startsWith(p)),
);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 10;
};

const handleLogout = () => {
    authStore.logout(); // authStore 내부에서 localStorage.removeItem('memberId') 등 처리 필요
    profileMenuOpen.value = false;
    mobileMenuOpen.value = false;
    router.push('/'); // 로그아웃 후 홈으로 리다이렉트 (필요에 따라 수정)
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
/* ===== Header Base ===== */
.header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
}

.header.scrolled {
    border-bottom-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

/* ===== Logo ===== */
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
}

.logo-icon {
    font-size: 30px;
    animation: float 3s ease-in-out infinite;
}

.logo-text {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

/* ===== Desktop Nav ===== */
.nav-desktop {
    display: flex;
    align-items: center;
    gap: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.nav-item:hover {
    background: #f1f5f9;
    color: #6366f1;
}

.nav-active {
    color: #6366f1 !important;
    background: #eef2ff !important;
    font-weight: 600;
}

.nav-icon {
    font-size: 15px;
}

/* ===== Dropdown ===== */
.nav-dropdown {
    position: relative;
}

.nav-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dropdown-arrow {
    font-size: 10px;
    transition: transform 0.2s;
    margin-left: 2px;
}

.dropdown-arrow.rotated {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 260px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    border: 1px solid #e2e8f0;
    padding: 8px;
    z-index: 100;
}

.dropdown-menu-right {
    left: auto;
    right: 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    color: #1e293b;
    transition: background 0.15s;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
}

.dropdown-item:hover {
    background: #f8fafc;
}

.dropdown-icon {
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border-radius: 8px;
    flex-shrink: 0;
}

.dropdown-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.dropdown-desc {
    font-size: 12px;
    color: #94a3b8;
    margin: 2px 0 0;
}

.dropdown-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 6px 0;
}

/* ===== User Info in Dropdown ===== */
.dropdown-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
}

.user-avatar-lg {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-name {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.user-email {
    font-size: 12px;
    color: #94a3b8;
    margin: 2px 0 0;
}

/* ===== Dropdown Logout ===== */
.dropdown-logout .dropdown-title {
    color: #ef4444;
}

.dropdown-logout:hover {
    background: #fef2f2 !important;
}

/* ===== Profile Trigger ===== */
.nav-profile-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 6px;
    border-radius: 40px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    transition: all 0.2s;
}

.nav-profile-trigger:hover {
    border-color: #6366f1;
    color: #6366f1;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-fallback {
    color: white;
    font-size: 14px;
    font-weight: 700;
}

/* ===== Register Button ===== */
.btn-register {
    display: inline-flex;
    align-items: center;
    padding: 9px 20px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
    white-space: nowrap;
}

.btn-register:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
}

/* ===== Dropdown Transition ===== */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* ===== Hamburger ===== */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
}

.hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #1e293b;
    border-radius: 2px;
    transition: all 0.3s;
}

.hamburger span:nth-child(1).open {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span:nth-child(2).open {
    opacity: 0;
}

.hamburger span:nth-child(3).open {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* ===== Mobile Menu ===== */
.mobile-menu {
    background: white;
    border-top: 1px solid #f1f5f9;
    padding: 16px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.mobile-section {
    margin-top: 8px;
}

.mobile-section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    padding: 8px 12px 4px;
    margin: 0;
}

.mobile-nav-item {
    display: block;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
    transition: all 0.15s;
}

.mobile-nav-item:hover {
    background: #f1f5f9;
    color: #6366f1;
}

.mobile-nav-item.sub {
    padding-left: 24px;
    font-size: 13px;
    color: #64748b;
}

.mobile-logout-btn {
    display: block;
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    margin-top: 8px;
    transition: background 0.15s;
}

.mobile-logout-btn:hover {
    background: #fef2f2;
}

.mobile-register-btn {
    display: block;
    margin-top: 12px;
    padding: 13px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
}

/* ===== Slide-down Transition ===== */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
    .nav-desktop {
        display: none;
    }

    .hamburger {
        display: flex;
    }

    .header-inner {
        padding: 0 20px;
    }
}
</style>
