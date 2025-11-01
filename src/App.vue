<template>
  <!-- Loading Screen -->
  <LoadingScreen 
    v-if="showSplash" 
    @loaded="onSplashLoaded"
  />
  
  <!-- Simple Professional App -->
  <div 
    v-else
    class="min-h-screen bg-gn-accent-100"
  >
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

// Splash Screen
const showSplash = ref(true)

const onSplashLoaded = () => {
  showSplash.value = false
}
</script>

<style scoped>
/* Estilos mínimos para la aplicación */
</style>