/**
 * Composable para gestos de deslizamiento nativos optimizado para móviles
 * Incluye soporte para swipe, pinch, long press y doble tap
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useSwipeGestures(element, options = {}) {
  // Configuración por defecto
  const config = {
    threshold: 50,           // Distancia mínima para considerar swipe
    velocity: 0.3,           // Velocidad mínima
    timeout: 300,            // Timeout para gestos
    longPressTime: 500,      // Tiempo para long press
    doubleTapTime: 300,      // Tiempo máximo entre taps
    preventScroll: false,    // Prevenir scroll durante gestos
    hapticFeedback: true,    // Feedback háptico
    ...options
  }

  // Estado de los gestos
  const isActive = ref(false)
  const direction = ref('')
  const distance = ref(0)
  const velocity = ref(0)
  
  // Estado interno del touch
  let startX = 0
  let startY = 0
  let currentX = 0
  let currentY = 0
  let startTime = 0
  let lastTap = 0
  let longPressTimer = null
  let isLongPress = false

  // Callbacks
  const callbacks = {
    onSwipeStart: config.onSwipeStart || (() => {}),
    onSwipeMove: config.onSwipeMove || (() => {}),
    onSwipeEnd: config.onSwipeEnd || (() => {}),
    onSwipeLeft: config.onSwipeLeft || (() => {}),
    onSwipeRight: config.onSwipeRight || (() => {}),
    onSwipeUp: config.onSwipeUp || (() => {}),
    onSwipeDown: config.onSwipeDown || (() => {}),
    onLongPress: config.onLongPress || (() => {}),
    onDoubleTap: config.onDoubleTap || (() => {}),
    onTap: config.onTap || (() => {}),
    onPinch: config.onPinch || (() => {})
  }

  // Utilidades
  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getAngle = (touch1, touch2) => {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI
  }

  const triggerHapticFeedback = (type = 'light') => {
    if (!config.hapticFeedback || !('vibrate' in navigator)) return
    
    const patterns = {
      light: 50,
      medium: [50, 50, 50],
      heavy: [100, 50, 100]
    }
    
    navigator.vibrate(patterns[type] || patterns.light)
  }

  // Handlers de eventos
  const handleTouchStart = (e) => {
    if (!element.value) return
    
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    currentX = startX
    currentY = startY
    startTime = Date.now()
    isActive.value = true
    isLongPress = false
    
    // Configurar long press timer
    longPressTimer = setTimeout(() => {
      if (isActive.value) {
        isLongPress = true
        triggerHapticFeedback('medium')
        callbacks.onLongPress({
          x: startX,
          y: startY,
          target: e.target
        })
      }
    }, config.longPressTime)

    // Multi-touch (pinch)
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1])
      callbacks.onPinch({
        distance,
        scale: 1,
        type: 'start'
      })
    }

    // Prevenir scroll si está configurado
    if (config.preventScroll) {
      e.preventDefault()
    }

    callbacks.onSwipeStart({
      startX,
      startY,
      touch,
      event: e
    })
  }

  const handleTouchMove = (e) => {
    if (!isActive.value || !element.value) return
    
    const touch = e.touches[0]
    currentX = touch.clientX
    currentY = touch.clientY
    
    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const currentTime = Date.now()
    const timeDelta = currentTime - startTime
    
    distance.value = currentDistance
    velocity.value = currentDistance / timeDelta
    
    // Determinar dirección
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction.value = deltaX > 0 ? 'right' : 'left'
    } else {
      direction.value = deltaY > 0 ? 'down' : 'up'
    }

    // Multi-touch (pinch)
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1])
      const initialDistance = config._initialPinchDistance || distance
      const scale = distance / initialDistance
      
      callbacks.onPinch({
        distance,
        scale,
        type: 'move'
      })
    }

    // Cancelar long press si se mueve demasiado
    if (currentDistance > config.threshold && longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    if (config.preventScroll) {
      e.preventDefault()
    }

    callbacks.onSwipeMove({
      deltaX,
      deltaY,
      distance: currentDistance,
      velocity: velocity.value,
      direction: direction.value,
      touch,
      event: e
    })
  }

  const handleTouchEnd = (e) => {
    if (!isActive.value || !element.value) return
    
    const endTime = Date.now()
    const timeDelta = endTime - startTime
    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const finalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const finalVelocity = finalDistance / timeDelta
    
    // Limpiar timers
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    // Determinar tipo de gesto
    if (isLongPress) {
      // Long press ya fue manejado
    } else if (finalDistance < config.threshold && timeDelta < config.timeout) {
      // Tap o doble tap
      const now = Date.now()
      if (now - lastTap < config.doubleTapTime) {
        triggerHapticFeedback('light')
        callbacks.onDoubleTap({
          x: startX,
          y: startY,
          target: e.target
        })
      } else {
        setTimeout(() => {
          if (Date.now() - now >= config.doubleTapTime) {
            callbacks.onTap({
              x: startX,
              y: startY,
              target: e.target
            })
          }
        }, config.doubleTapTime)
      }
      lastTap = now
    } else if (finalDistance >= config.threshold && finalVelocity >= config.velocity) {
      // Swipe válido
      triggerHapticFeedback('light')
      
      const swipeData = {
        direction: direction.value,
        distance: finalDistance,
        velocity: finalVelocity,
        duration: timeDelta,
        startX,
        startY,
        endX: currentX,
        endY: currentY
      }
      
      // Llamar callback específico de dirección
      switch (direction.value) {
        case 'left':
          callbacks.onSwipeLeft(swipeData)
          break
        case 'right':
          callbacks.onSwipeRight(swipeData)
          break
        case 'up':
          callbacks.onSwipeUp(swipeData)
          break
        case 'down':
          callbacks.onSwipeDown(swipeData)
          break
      }
    }

    // Multi-touch end
    if (e.changedTouches.length === 1 && e.touches.length === 0) {
      callbacks.onPinch({
        type: 'end'
      })
    }

    callbacks.onSwipeEnd({
      direction: direction.value,
      distance: finalDistance,
      velocity: finalVelocity,
      duration: timeDelta,
      event: e
    })

    // Reset estado
    isActive.value = false
    direction.value = ''
    distance.value = 0
    velocity.value = 0
  }

  // Prevenir context menu en long press
  const handleContextMenu = (e) => {
    if (config.preventContextMenu !== false) {
      e.preventDefault()
    }
  }

  // Lifecycle
  onMounted(() => {
    if (!element.value) return
    
    const el = element.value
    
    // Touch events
    el.addEventListener('touchstart', handleTouchStart, { passive: !config.preventScroll })
    el.addEventListener('touchmove', handleTouchMove, { passive: !config.preventScroll })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    el.addEventListener('contextmenu', handleContextMenu)

    // Optimización CSS
    el.style.touchAction = config.preventScroll ? 'none' : 'auto'
    el.style.webkitTouchCallout = 'none'
    el.style.webkitUserSelect = 'none'
    el.style.userSelect = 'none'
  })

  onUnmounted(() => {
    if (!element.value) return
    
    const el = element.value
    
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
    el.removeEventListener('touchcancel', handleTouchEnd)
    el.removeEventListener('contextmenu', handleContextMenu)
    
    if (longPressTimer) {
      clearTimeout(longPressTimer)
    }
  })

  // API pública
  return {
    isActive: isActive.readonly ? isActive.readonly() : isActive,
    direction: direction.readonly ? direction.readonly() : direction,
    distance: distance.readonly ? distance.readonly() : distance,
    velocity: velocity.readonly ? velocity.readonly() : velocity,
    
    // Métodos de utilidad
    reset: () => {
      isActive.value = false
      direction.value = ''
      distance.value = 0
      velocity.value = 0
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }
  }
}

// Composable simplificado para swipe básico
export function useSwipe(element, options = {}) {
  return useSwipeGestures(element, {
    threshold: options.threshold || 50,
    onSwipeLeft: options.onLeft,
    onSwipeRight: options.onRight,
    onSwipeUp: options.onUp,
    onSwipeDown: options.onDown,
    ...options
  })
}

// Composable para navegación con swipe
export function useSwipeNavigation(options = {}) {
  const canGoBack = ref(true)
  const canGoForward = ref(true)
  
  const swipeConfig = {
    threshold: 100,
    preventScroll: true,
    onSwipeRight: () => {
      if (canGoBack.value && options.onBack) {
        options.onBack()
      }
    },
    onSwipeLeft: () => {
      if (canGoForward.value && options.onForward) {
        options.onForward()
      }
    },
    ...options
  }
  
  return {
    canGoBack,
    canGoForward,
    swipeConfig,
    useSwipeGestures: (element) => useSwipeGestures(element, swipeConfig)
  }
}