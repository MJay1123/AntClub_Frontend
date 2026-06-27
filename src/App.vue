<template>
  <header>
    <Header/>
  </header>
  <RouterView/>
  <footer>
    <Footer/>
  </footer>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from './components/VHeader.vue';
import Footer from './components/VFooter.vue'
</script>

<style scoped></style>
