<template>
  <div class="safe-wrapper">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <span class="ml-3 text-emerald-400">Cargando...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-20">
      <div class="bg-red-900/40 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-red-300 font-semibold text-lg mb-2">Error en el Componente</h3>
        <p class="text-red-200 mb-4 text-sm">{{ error }}</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button @click="retry" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium">
            Reintentar
          </button>
          <button @click="goToDashboard" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium">
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
    
    <!-- Component content -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const error = ref(null)

// Simular loading inicial
setTimeout(() => {
  loading.value = false
}, 100)

onErrorCaptured((err, instance, info) => {
  console.error('SafeComponentWrapper capturó error:', err, info)
  error.value = err.message || 'Error inesperado'
  loading.value = false
  return false
})

const retry = async () => {
  error.value = null
  loading.value = true
  await nextTick()
  
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.safe-wrapper {
  min-height: 200px;
}
</style>