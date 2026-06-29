<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- Top Section -->
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <router-link to="/" class="brand-logo">
            <span class="logo-icon">🐜</span>
            <span class="logo-text">AntClub</span>
          </router-link>
          <p class="brand-desc">
            동아리 운영의 모든 것을 한 곳에서.<br />
            스마트한 동아리 관리 플랫폼 AntClub
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" title="Instagram">📸</a>
            <a href="#" class="social-btn" title="GitHub">🐱</a>
            <a href="#" class="social-btn" title="Email">📧</a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer-divider" />

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p class="footer-copy">
          © {{ currentYear }} AntClub. All rights reserved.
        </p>
        <div class="footer-meta">
          <span class="version">v1.0.0</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

const currentYear = new Date().getFullYear()

</script>

<style scoped>
.footer {
  background: #0f172a;
  color: #cbd5e1;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 32px 28px;
}

/* ===== Top ===== */
.footer-top {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}

/* ===== Brand ===== */
.footer-brand {
  flex: 0 0 260px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #a5b4fc, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #64748b;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-decoration: none;
  transition: all 0.2s;
}

.social-btn:hover {
  background: #334155;
  transform: translateY(-2px);
}

/* ===== Links ===== */
.footer-links-wrap {
  flex: 1;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.footer-link-group {
  min-width: 120px;
}

.link-group-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin: 0 0 16px;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #a5b4fc;
}

/* ===== Divider ===== */
.footer-divider {
  height: 1px;
  background: #1e293b;
  margin: 40px 0 24px;
}

/* ===== Bottom ===== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-copy {
  font-size: 13px;
  color: #475569;
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ===== API Status ===== */
.api-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-online {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
  animation: pulse 2s infinite;
}

.dot-offline {
  background: #ef4444;
}

.dot-checking {
  background: #f59e0b;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.version {
  font-size: 12px;
  color: #334155;
  background: #1e293b;
  padding: 3px 8px;
  border-radius: 6px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .footer-inner { padding: 40px 20px 20px; }
  .footer-top { gap: 32px; }
  .footer-brand { flex: 0 0 100%; }
  .footer-links-wrap { gap: 24px; }
}
</style>
