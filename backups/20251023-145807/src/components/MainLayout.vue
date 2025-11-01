<template>
  <div 
    class="main-layout"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    ref="mainLayout"
  >
    <!-- Sidebar -->
    <NewSidebar
      ref="sidebarRef"
      :userName="userData.name"
      :userEmail="userData.email"
    />
    
    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'content-shifted': isSwipeActive }">
      <!-- Mobile Header with Menu Toggle -->
      <div class="mobile-header md:hidden">
        <button 
          @click="toggleSidebar"
          class="mobile-menu-btn"
          aria-label="Abrir menú"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 class="mobile-page-title">{{ pageTitle }}</h1>
        
        <div class="mobile-header-actions">
          <slot name="mobile-header-actions"></slot>
        </div>
      </div>

      <!-- Top Header (desktop) -->
      <header class="content-header hidden md:block" v-if="showHeader">
        <div class="header-content">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <div class="header-actions">
            <slot name="header-actions"></slot>
          </div>
        </div>
      </header>
      
      <!-- Page Content with Pull-to-Refresh -->
      <div 
        class="page-content"
        @scroll="handleScroll"
        ref="pageContent"
      >
        <!-- Pull to Refresh Indicator -->
        <div 
          class="pull-refresh-indicator"
          :class="{ 'active': isPullToRefresh, 'refreshing': isRefreshing }"
          v-if="enablePullToRefresh"
        >
          <div class="pull-refresh-spinner">
            <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <span class="pull-refresh-text">
            {{ refreshText }}
          </span>
        </div>
        
        <div class="page-content-inner">
          <slot></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import NewSidebar from './NewSidebar.vue'

const route = useRoute()
const { currentUser } = useAuth()

// Props
const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  },
  enablePullToRefresh: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['refresh'])

// Refs
const mainLayout = ref(null)
const sidebarRef = ref(null)
const pageContent = ref(null)

// State
const isSwipeActive = ref(false)
const isPullToRefresh = ref(false)
const isRefreshing = ref(false)

// Touch gesture state
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)
const swipeDirection = ref('')

// Usuario actual desde el composable de autenticación
const userData = computed(() => {
  return {
    name: currentUser.value?.nombre || 'Usuario',
    email: currentUser.value?.email || 'solucionesintegralesgn@gmail.com'
  }
})

// Computed
const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/finanzas': 'Centro Financiero',
    '/cotizaciones': 'Cotizaciones',
    '/tiendas': 'Gestión de Tiendas',
    '/cobros': 'Control de Cobros',
    '/estadisticas': 'Estadísticas',
    '/configuracion': 'Configuración'
  }
  return titles[route.path] || 'GN Soluciones'
})

const refreshText = computed(() => {
  if (isRefreshing.value) return 'Actualizando...'
  if (isPullToRefresh.value) return 'Suelta para actualizar'
  return 'Desliza para actualizar'
})

// Methods
const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleMobile()
  }
}

// Touch gesture handlers for swipe navigation
const handleTouchStart = (e) => {
  if (window.innerWidth >= 768) return
  
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
  swipeDirection.value = ''
}

const handleTouchMove = (e) => {
  if (!isDragging.value || window.innerWidth >= 768) return
  
  touchCurrentX.value = e.touches[0].clientX
  touchCurrentY.value = e.touches[0].clientY
  
  const deltaX = touchCurrentX.value - touchStartX.value
  const deltaY = touchCurrentY.value - touchStartY.value
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 50 && touchStartX.value < 50) {
      swipeDirection.value = 'right'
      isSwipeActive.value = true
      
      if (mainLayout.value) {
        const progress = Math.min(deltaX / 200, 1)
        mainLayout.value.style.transform = `translateX(${deltaX * 0.3}px)`
        mainLayout.value.style.opacity = 1 - progress * 0.1
      }
    }
  }
}

const handleTouchEnd = (e) => {
  if (!isDragging.value || window.innerWidth >= 768) return
  
  const deltaX = touchCurrentX.value - touchStartX.value
  
  if (swipeDirection.value === 'right' && deltaX > 100) {
    toggleSidebar()
  }
  
  if (mainLayout.value) {
    mainLayout.value.style.transform = ''
    mainLayout.value.style.opacity = ''
  }
  
  isSwipeActive.value = false
  isDragging.value = false
  swipeDirection.value = ''
}

const handleScroll = (e) => {
  if (!props.enablePullToRefresh || window.innerWidth >= 768) return
  
  const scrollTop = e.target.scrollTop
  
  if (scrollTop === 0 && !isRefreshing.value) {
    const touchY = touchCurrentY.value - touchStartY.value
    
    if (touchY > 50) {
      isPullToRefresh.value = true
    } else {
      isPullToRefresh.value = false
    }
    
    if (touchY > 100 && !isDragging.value) {
      triggerRefresh()
    }
  }
}

const triggerRefresh = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  isPullToRefresh.value = false
  
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
  
  try {
    emit('refresh')
    await new Promise(resolve => setTimeout(resolve, 1500))
  } finally {
    isRefreshing.value = false
  }
}

const handleKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === '[') {
    e.preventDefault()
    if (window.innerWidth < 768) {
      toggleSidebar()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  toggleSidebar,
  triggerRefresh
})
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #F8FFFE;
}

/* === MAIN CONTENT === */
.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === CONTENT HEADER === */
.content-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: between;
  align-items: center;
  max-width: 100%;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #051F20;
  margin: 0;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* === PAGE CONTENT === */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #F8FFFE;
}

/* === MOBILE SIDEBAR OVERLAY === */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* === MOBILE HEADER === */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(16, 185, 129, 0.1);
}

.mobile-menu-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  transition: all 0.2s ease;
  touch-action: manipulation;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.mobile-menu-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.mobile-page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #051F20;
  text-align: center;
  flex: 1;
  margin: 0 1rem;
}

.mobile-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 44px;
  justify-content: flex-end;
}

/* === PULL TO REFRESH === */
.pull-refresh-indicator {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%,
    rgba(16, 185, 129, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.pull-refresh-indicator.active {
  top: 0;
}

.pull-refresh-indicator.refreshing {
  top: 0;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.2) 0%,
    rgba(16, 185, 129, 0.1) 100%
  );
}

.pull-refresh-spinner {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
  color: #10b981;
}

.pull-refresh-text {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
}

/* === CONTENT SHIFTING === */
.content-shifted {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-content-inner {
  position: relative;
  z-index: 1;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-header {
    padding: 1rem;
  }
  
  .page-content {
    padding: 0;
    position: relative;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  }
  
  .page-content-inner {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  /* Optimize scroll performance */
  .page-content {
    transform: translateZ(0);
    will-change: scroll-position;
  }
}

/* === SAFE AREAS (iOS) === */
@supports (padding: env(safe-area-inset-top)) {
  @media (max-width: 768px) {
    .mobile-header {
      padding-top: calc(1rem + env(safe-area-inset-top));
      padding-left: calc(1rem + env(safe-area-inset-left));
      padding-right: calc(1rem + env(safe-area-inset-right));
    }
    
    .page-content-inner {
      padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    }
  }
}

/* === TOUCH OPTIMIZATIONS === */
@media (hover: none) and (pointer: coarse) {
  .mobile-menu-btn {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .page-content {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
  }
  
  /* Prevent rubber band scrolling */
  .main-layout {
    overscroll-behavior: none;
    touch-action: pan-y;
  }
}

/* === SCROLL BEHAVIOR === */
.page-content {
  scroll-behavior: smooth;
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.page-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* === PROFESSIONAL CARD STYLES - GLASS EFFECT === */
:deep(.professional-card) {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.professional-card:hover) {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 48px rgba(16, 185, 129, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.4);
}

/* === GOLD BUTTON STYLES - GLASS EFFECT === */
:deep(.btn-gold) {
  background: linear-gradient(135deg,
    #D4AF37 0%,
    #B8941F 100%
  );
  color: #051F20;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 
    0 4px 16px rgba(212, 175, 55, 0.3),
    0 2px 8px rgba(212, 175, 55, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.btn-gold:hover) {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(212, 175, 55, 0.4),
    0 4px 12px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

:deep(.btn-gold:active) {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 16px rgba(212, 175, 55, 0.3),
    0 2px 8px rgba(212, 175, 55, 0.2);
}
</style>