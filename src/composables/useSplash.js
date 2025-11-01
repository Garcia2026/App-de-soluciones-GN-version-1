import { ref, onMounted } from 'vue'

export function useSplash() {
  const isVisible = ref(true)
  const isReady = ref(false)
  
  const showSplash = () => {
    isVisible.value = true
  }
  
  const hideSplash = () => {
    return new Promise((resolve) => {
      isVisible.value = false
      setTimeout(() => {
        isReady.value = true
        resolve()
      }, 1000) // Tiempo de transición
    })
  }
  
  return {
    isVisible,
    isReady,
    showSplash,
    hideSplash
  }
}