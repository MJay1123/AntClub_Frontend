<template>
  <header>
    <AppHeader />
  </header>
  
  <main>
    <LoadingModal v-if="isLoading" :is-loading="isLoading"/>
    <ErrorModal v-else-if="isError" :is-error="isError" :error-message="errorMessage"/>
    <div>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
  
  <footer>
    <AppFooter />
  </footer>
</template>


<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from './stores/ui'
import { storeToRefs } from 'pinia'

import LoadingModal from './components/LoadingModal.vue'
import ErrorModal from './components/ErrorModal.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

const { isLoading, isError, errorMessage } = storeToRefs(uiStore)

onMounted(() => {
  if (authStore.isLoggedIn) {
    authStore.fetchMe()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1e293b;
  background: #f8fafc;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

/* ===== Page Transition ===== */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
