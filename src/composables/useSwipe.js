import { ref, reactive, onMounted, onUnmounted } from 'vue'

/**
 * Composable para gestos swipe nativos en móvil
 * Optimizado para GN Jardinería
 */
export function useSwipe(elementRef, options = {}) {
  const {
    threshold = 50,
    timeout = 500,
    onSwipeLeft = () => {},
    onSwipeRight = () => {},
    onSwipeUp = () => {},
    onSwipeDown = () => {},
    enableHorizontal = true,
    enableVertical = false
  } = options

  const isSupported = typeof window !== 'undefined' && 'ontouchstart' in window
  
  const state = reactive({
    isSwiping: false,
    direction: null,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    startTime: 0
  })

  const touch = reactive({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0
  })

  const reset = () => {
    state.isSwiping = false
    state.direction = null
    touch.deltaX = 0
    touch.deltaY = 0
  }

  const onTouchStart = (e) => {
    if (!isSupported) return
    
    const touches = e.touches[0]
    state.startX = touches.clientX
    state.startY = touches.clientY
    state.startTime = Date.now()
    state.isSwiping = true
    
    touch.x = touches.clientX
    touch.y = touches.clientY

    // Agregar clase CSS para feedback visual
    if (elementRef.value) {
      elementRef.value.classList.add('swiping')
    }
  }

  const onTouchMove = (e) => {
    if (!state.isSwiping || !isSupported) return
    
    const touches = e.touches[0]
    touch.x = touches.clientX
    touch.y = touches.clientY
    
    touch.deltaX = touch.x - state.startX
    touch.deltaY = touch.y - state.startY

    // Prevenir scroll vertical si es swipe horizontal
    if (enableHorizontal && Math.abs(touch.deltaX) > Math.abs(touch.deltaY)) {
      e.preventDefault()
    }
    
    // Prevenir scroll horizontal si es swipe vertical
    if (enableVertical && Math.abs(touch.deltaY) > Math.abs(touch.deltaX)) {
      e.preventDefault()
    }

    // Feedback visual durante swipe
    if (elementRef.value && enableHorizontal) {
      const progress = Math.min(Math.abs(touch.deltaX) / threshold, 1)
      elementRef.value.style.transform = `translateX(${touch.deltaX * 0.3}px)`
      elementRef.value.style.opacity = 1 - (progress * 0.2)
    }
  }

  const onTouchEnd = (e) => {
    if (!state.isSwiping || !isSupported) return
    
    const duration = Date.now() - state.startTime
    state.endX = touch.x
    state.endY = touch.y
    
    const deltaX = state.endX - state.startX
    const deltaY = state.endY - state.startY
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Remover clase CSS
    if (elementRef.value) {
      elementRef.value.classList.remove('swiping')
      elementRef.value.style.transform = ''
      elementRef.value.style.opacity = ''
    }

    // Determinar dirección y ejecutar callback
    if (duration < timeout) {
      if (enableHorizontal && absDeltaX > threshold && absDeltaX > absDeltaY) {
        state.direction = deltaX > 0 ? 'right' : 'left'
        if (state.direction === 'left') {
          onSwipeLeft({ deltaX, deltaY, duration })
        } else {
          onSwipeRight({ deltaX, deltaY, duration })
        }
      } else if (enableVertical && absDeltaY > threshold && absDeltaY > absDeltaX) {
        state.direction = deltaY > 0 ? 'down' : 'up'
        if (state.direction === 'up') {
          onSwipeUp({ deltaX, deltaY, duration })
        } else {
          onSwipeDown({ deltaX, deltaY, duration })
        }
      }
    }

    reset()
  }

  const setupEventListeners = () => {
    if (!elementRef.value || !isSupported) return

    const element = elementRef.value
    
    element.addEventListener('touchstart', onTouchStart, { passive: false })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd, { passive: true })
  }

  const removeEventListeners = () => {
    if (!elementRef.value || !isSupported) return

    const element = elementRef.value
    
    element.removeEventListener('touchstart', onTouchStart)
    element.removeEventListener('touchmove', onTouchMove) 
    element.removeEventListener('touchend', onTouchEnd)
  }

  // Auto setup cuando el elemento esté disponible
  onMounted(() => {
    if (elementRef.value) {
      setupEventListeners()
    }
  })

  onUnmounted(() => {
    removeEventListeners()
  })

  return {
    isSupported,
    isSwiping: () => state.isSwiping,
    direction: () => state.direction,
    deltaX: () => touch.deltaX,
    deltaY: () => touch.deltaY,
    setup: setupEventListeners,
    destroy: removeEventListeners,
    reset
  }
}

/**
 * Composable específico para swipe en listas (cotizaciones)
 */
export function useSwipeList(options = {}) {
  const {
    onSwipeLeftAction = () => {},
    onSwipeRightAction = () => {},
    actionThreshold = 100
  } = options

  const activeSwipeIndex = ref(-1)
  const swipeProgress = ref(0)

  const handleSwipeLeft = (index, data) => {
    activeSwipeIndex.value = index
    swipeProgress.value = Math.min(Math.abs(data.deltaX) / actionThreshold, 1)
    
    if (Math.abs(data.deltaX) > actionThreshold) {
      onSwipeLeftAction(index)
      activeSwipeIndex.value = -1
      swipeProgress.value = 0
    }
  }

  const handleSwipeRight = (index, data) => {
    activeSwipeIndex.value = index
    swipeProgress.value = Math.min(Math.abs(data.deltaX) / actionThreshold, 1)
    
    if (Math.abs(data.deltaX) > actionThreshold) {
      onSwipeRightAction(index)
      activeSwipeIndex.value = -1 
      swipeProgress.value = 0
    }
  }

  const resetSwipe = () => {
    activeSwipeIndex.value = -1
    swipeProgress.value = 0
  }

  return {
    activeSwipeIndex,
    swipeProgress, 
    handleSwipeLeft,
    handleSwipeRight,
    resetSwipe
  }
}