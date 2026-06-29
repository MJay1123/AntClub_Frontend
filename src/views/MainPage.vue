<template>
  <div class="main-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="logo-area">
          <span class="logo-icon">🐜</span>
          <h1 class="logo-text">AntClub</h1>
        </div>
        <p class="hero-subtitle">동아리 운영의 모든 것을 한 곳에서</p>
        <p class="hero-description">
          AntClub과 함께 동아리를 더 스마트하게 관리하세요.<br />
          회원 관리부터 회비, 일정, 게시판까지 모두 지원합니다.
        </p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn btn-primary">시작하기</router-link>
          <router-link to="/login" class="btn btn-outline">로그인</router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="ant-animation">
          <span class="ant">🐜</span>
          <span class="ant ant-2">🐜</span>
          <span class="ant ant-3">🐜</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-header">
        <h2>주요 기능</h2>
        <p>AntClub이 제공하는 강력한 동아리 관리 기능들을 만나보세요</p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.id" class="feature-card" @click="navigateTo(feature.path)">
          <div class="feature-icon" :style="{ backgroundColor: feature.color }">
            <span>{{ feature.icon }}</span>
          </div>
          <div class="feature-content">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <ul class="feature-list">
              <li v-for="item in feature.items" :key="item">
                <span class="check-icon">✓</span> {{ item }}
              </li>
            </ul>
          </div>
          <div class="feature-arrow">→</div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <span class="stat-number">{{ stat.number }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <h2>지금 바로 시작하세요!</h2>
      <p>무료로 동아리를 등록하고 스마트한 관리를 경험해보세요.</p>
      <router-link to="/register" class="btn btn-white">무료로 시작하기 🐜</router-link>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-icon">🐜</span>
          <span class="logo-text">AntClub</span>
        </div>
        <p class="footer-copy">© 2024 AntClub. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  {
    id: 1,
    title: '동아리 등록',
    icon: '🏛️',
    color: '#EEF2FF',
    path: '/clubs',
    description: '새로운 동아리를 간편하게 등록하고 관리하세요.',
    items: ['동아리 정보 등록 및 수정', '학교별 동아리 분류', '동아리 프로필 관리', '가입 신청 관리']
  },
  {
    id: 2,
    title: '회원 관리',
    icon: '👥',
    color: '#F0FDF4',
    path: '/members',
    description: '동아리 회원 정보를 체계적으로 관리하세요.',
    items: ['회원 프로필 관리', '학번 및 전공 정보', '출석 및 활동 현황', 'MBTI / 관심사 관리']
  },
  {
    id: 3,
    title: '회비 관리',
    icon: '💰',
    color: '#FFFBEB',
    path: '/dues',
    description: '회비 납부 현황과 수입·지출을 한눈에 파악하세요.',
    items: ['회비 납부 현황 조회', '수입/지출 내역 관리', '미납 회원 알림', '회비 통계 및 리포트']
  },
  {
    id: 4,
    title: '일정 관리',
    icon: '📅',
    color: '#FFF1F2',
    path: '/schedule',
    description: '동아리 일정을 캘린더로 편리하게 관리하세요.',
    items: ['월별 일정 캘린더', '이벤트 생성 및 알림', '참석 여부 확인', '정기 모임 설정']
  },
  {
    id: 5,
    title: '게시판',
    icon: '📋',
    color: '#F0F9FF',
    path: '/board',
    description: '공지사항과 자유게시판으로 소통하세요.',
    items: ['공지사항 게시판', '자유 게시판', '파일 첨부 기능', '댓글 및 좋아요']
  }
])

const stats = ref([
  { number: '500+', label: '등록된 동아리' },
  { number: '10,000+', label: '활성 회원' },
  { number: '50+', label: '연결된 학교' },
  { number: '99.9%', label: '서비스 안정성' }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* ===== Global ===== */
.main-page {
  font-family: 'Noto Sans KR', sans-serif;
  color: #1e293b;
  overflow-x: hidden;
}

/* ===== Hero ===== */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 1;
  max-width: 700px;
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.logo-icon {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 56px;
  font-weight: 800;
  background: linear-gradient(90deg, #a5b4fc, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 16px;
}

.hero-description {
  font-size: 16px;
  color: #cbd5e1;
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-visual {
  position: absolute;
  bottom: 40px;
  right: 10%;
}

.ant-animation {
  position: relative;
  width: 200px;
  height: 100px;
}

.ant {
  position: absolute;
  font-size: 32px;
  animation: marchAnt 4s linear infinite;
}

.ant-2 {
  animation-delay: 1.3s;
  top: 20px;
}

.ant-3 {
  animation-delay: 2.6s;
  top: 40px;
}

@keyframes marchAnt {
  0% {
    left: -50px;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    left: 200px;
    opacity: 0;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* ===== Buttons ===== */
.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
}

.btn-outline {
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  background: transparent;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.btn-white {
  background: white;
  color: #6366f1;
  font-weight: 700;
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* ===== Features ===== */
.features {
  padding: 100px 40px;
  background: #f8fafc;
}

.features-header {
  text-align: center;
  margin-bottom: 60px;
}

.features-header h2 {
  font-size: 40px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.features-header p {
  font-size: 18px;
  color: #64748b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.feature-content h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.feature-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  font-size: 13px;
  color: #475569;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-icon {
  color: #6366f1;
  font-weight: 700;
}

.feature-arrow {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #cbd5e1;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-arrow {
  color: #6366f1;
  transform: translateY(-50%) translateX(4px);
}

/* ===== Stats ===== */
.stats {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  gap: 80px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 48px;
  font-weight: 800;
}

.stat-label {
  display: block;
  font-size: 16px;
  opacity: 0.85;
  margin-top: 8px;
}

/* ===== CTA ===== */
.cta {
  background: #1e293b;
  padding: 100px 40px;
  text-align: center;
  color: white;
}

.cta h2 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 16px;
}

.cta p {
  font-size: 18px;
  color: #94a3b8;
  margin-bottom: 40px;
}

/* ===== Footer ===== */
.footer {
  background: #0f172a;
  padding: 32px 40px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.footer-copy {
  color: #64748b;
  font-size: 14px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .logo-text {
    font-size: 40px;
  }

  .hero {
    padding: 60px 20px;
  }

  .features {
    padding: 60px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    gap: 40px;
  }

  .stat-number {
    font-size: 36px;
  }
}
</style>
