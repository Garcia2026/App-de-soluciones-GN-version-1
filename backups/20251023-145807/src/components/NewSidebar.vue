<template>
  <aside 
    class="curved-sidebar"
    :class="{ 'mobile-open': isMobileOpen }"
    ref="sidebar"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Mobile Header with Close Button -->
    <div class="mobile-header md:hidden">
      <button 
        @click="closeMobile"
        class="mobile-close-btn"
        aria-label="Cerrar menú"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Brand Logo -->
    <div class="brand-section">
      <div class="logo-container">
        <div class="logo-icon">
          <span class="gn-logo-sidebar">GN</span>
        </div>
        <div class="logo-text">
          <span class="brand-name">GN</span>
          <span class="brand-subtitle">Soluciones</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="curved-nav">
      <div
        v-for="(item, index) in menuItems"
        :key="item.path"
        class="nav-item-container"
        :class="{ 'is-active': isActive(item.path) }"
        @click="onNavItemClick(item.path)"
      >
        <!-- Curved Background for Active Item -->
        <div class="curved-background" v-if="isActive(item.path)"></div>

        <router-link
          :to="item.path"
          class="curved-nav-item"
          :class="{ 'active': isActive(item.path) }"
        >
          <component :is="item.icon" class="nav-icon" />
          <span class="nav-text">{{ item.label }}</span>
          <!-- Mobile Active Indicator -->
          <div class="mobile-active-indicator md:hidden" v-if="isActive(item.path)"></div>
        </router-link>
      </div>

      <!-- Logout Button -->
      <div class="nav-item-container logout-container">
        <button @click="handleLogout" class="curved-nav-item logout-btn">
          <ArrowLeftOnRectangleIcon class="nav-icon" />
          <span class="nav-text">Cerrar Sesión</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Toggle Button (Fixed Position) -->
    <button 
      class="mobile-menu-toggle md:hidden"
      @click="toggleMobile"
      :class="{ 'is-open': isMobileOpen }"
      aria-label="Toggle menu"
    >
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    </button>
  </aside>

  <!-- Mobile Overlay -->
  <div 
    v-if="isMobileOpen"
    class="mobile-overlay md:hidden"
    @click="closeMobile"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import {
  HomeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ChartBarIcon,
  FireIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { ScrollText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { currentUser, isAdmin, logout } = useAuth()
const toast = useToast()

// Accept userName and userEmail to remove extraneous non-props warnings
const props = defineProps({
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' }
})

// Mobile state
const isMobileOpen = ref(false)
const sidebar = ref(null)

// Touch gesture state
const touchStartX = ref(0)
const touchCurrentX = ref(0)
const isDragging = ref(false)

// Menu items simplificados para el diseño curvo
const allMenuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/finanzas', label: 'Finanzas', icon: CurrencyDollarIcon },
  { path: '/proyectos', label: 'Proyectos', icon: FireIcon },
  { path: '/cotizaciones', label: 'Cotizaciones', icon: ClipboardDocumentListIcon },
  { path: '/tiendas', label: 'Tiendas', icon: BuildingStorefrontIcon },
  { path: '/cobros', label: 'Cobros', icon: CreditCardIcon },
  { path: '/estadisticas', label: 'Estadísticas', icon: ChartBarIcon },
  { path: '/bitacora', label: 'Bitácora', icon: ScrollText, adminOnly: true }
]

// Filtrar items según el rol del usuario
const menuItems = computed(() => {
  return allMenuItems.filter(item => {
    if (item.adminOnly) {
      return isAdmin.value
    }
    return true
  })
})

// Method to check active route
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Mobile menu methods
const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
  
  // Haptic feedback on devices that support it
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

const closeMobile = () => {
  isMobileOpen.value = false
}

const onNavItemClick = (path) => {
  // Close mobile menu when nav item is clicked
  if (window.innerWidth < 768) {
    setTimeout(() => {
      closeMobile()
    }, 150) // Small delay for better UX
  }
}

// Logout handler
const handleLogout = async () => {
  try {
    await logout()
    toast.success('Sesión cerrada exitosamente')
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    toast.error('Error al cerrar sesión')
  }
}

// Touch gesture handlers for swipe-to-close
const handleTouchStart = (e) => {
  if (window.innerWidth >= 768) return // Only for mobile
  
  touchStartX.value = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value || window.innerWidth >= 768) return
  
  touchCurrentX.value = e.touches[0].clientX
  const deltaX = touchCurrentX.value - touchStartX.value
  
  // Only allow swiping left (closing gesture)
  if (deltaX < 0) {
    const opacity = Math.max(0, 1 + deltaX / 200)
    if (sidebar.value) {
      sidebar.value.style.opacity = opacity
      sidebar.value.style.transform = `translateX(${Math.min(0, deltaX)}px)`
    }
  }
}

const handleTouchEnd = (e) => {
  if (!isDragging.value || window.innerWidth >= 768) return
  
  const deltaX = touchCurrentX.value - touchStartX.value
  
  // If swiped left more than 100px, close sidebar
  if (deltaX < -100) {
    closeMobile()
  }
  
  // Reset styles
  if (sidebar.value) {
    sidebar.value.style.opacity = ''
    sidebar.value.style.transform = ''
  }
  
  isDragging.value = false
}

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && isMobileOpen.value) {
    closeMobile()
  }
}

// Prevent body scroll when mobile menu is open
const toggleBodyScroll = (disable) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  } else {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  
  // Watch for mobile state changes
  watchEffect(() => {
    if (isMobileOpen.value) {
      toggleBodyScroll(true)
    } else {
      toggleBodyScroll(false)
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  toggleBodyScroll(false)
})

// Expose methods for parent components
defineExpose({
  toggleMobile,
  closeMobile
})
</script>

<style scoped>
/* === CURVED SIDEBAR INSPIRED BY YOGA APP === */
.curved-sidebar {
  width: 240px;
  height: 100vh;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 
    8px 0 40px rgba(16, 185, 129, 0.2),
    4px 0 20px rgba(16, 185, 129, 0.1);
  
  /* Efecto glass sutil en todo el sidebar */
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

/* === BRAND SECTION === */
.brand-section {
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.logo-icon:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.logo-svg {
  width: 24px;
  height: 24px;
  color: white;
}

.gn-logo-sidebar {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(255,255,255,0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 2px;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* === CURVED NAVIGATION === */
.curved-nav {
  flex: 1;
  position: relative;
  padding: 0;
}

.nav-item-container {
  position: relative;
  margin-bottom: 8px;
}

/* La magia del efecto curvo - PERFECCIONADO */
.curved-background {
  position: absolute;
  top: 0;
  left: 0;
  right: -40px;
  height: 100%;
  
  /* Fondo glass más elegante */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  
  /* Curvas más suaves y redondeadas */
  border-radius: 0 35px 35px 0;
  z-index: 1;
  
  /* Efecto glass sofisticado */
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.15),
    0 4px 16px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  
  /* Borde glass sutil */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: none;
  
  transform: translateX(0);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Pseudo-elementos para crear las curvas PERFECTAMENTE REDONDEADAS */
.curved-background::before,
.curved-background::after {
  content: '';
  position: absolute;
  right: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
}

.curved-background::before {
  top: -40px;
  border-bottom-right-radius: 40px;
  box-shadow: 20px 20px 0 rgba(255, 255, 255, 0.95);
}

.curved-background::after {
  bottom: -40px;
  border-top-right-radius: 40px;
  box-shadow: 20px -20px 0 rgba(255, 255, 255, 0.95);
}

.curved-nav-item {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.curved-nav-item:hover {
  color: rgba(255, 255, 255, 1);
  transform: translateX(4px);
}

.curved-nav-item.active {
  color: #059669;
  font-weight: 600;
  transform: translateX(0);
}

.curved-nav-item.active:hover {
  color: #047857;
  transform: translateX(0);
}

.nav-icon {
  width: 22px;
  height: 22px;
  margin-right: 1rem;
  flex-shrink: 0;
  stroke-width: 2;
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* === LOGOUT BUTTON === */
.logout-container {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
}

.logout-btn:active {
  transform: scale(0.98);
}

/* === MOBILE HEADER === */
.mobile-header {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.mobile-close-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.mobile-close-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.15);
}

/* === MOBILE MENU TOGGLE === */
.mobile-menu-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 1001;
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
}

.mobile-menu-toggle:active {
  transform: scale(0.9);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-toggle.is-open .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.mobile-menu-toggle.is-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.is-open .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* === MOBILE ACTIVE INDICATOR === */
.mobile-active-indicator {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #059669;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(5, 150, 105, 0.6);
}

/* === MOBILE OVERLAY === */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .curved-sidebar {
    width: 320px;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 
      20px 0 60px rgba(0, 0, 0, 0.3),
      8px 0 40px rgba(16, 185, 129, 0.2);
  }
  
  .curved-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .curved-background {
    right: 0;
    border-radius: 0 20px 20px 0;
  }
  
  .curved-background::before,
  .curved-background::after {
    display: none;
  }
  
  .curved-nav-item {
    padding: 1.25rem 1.5rem;
    min-height: 60px;
  }
  
  .nav-icon {
    width: 24px;
    height: 24px;
  }
  
  .nav-text {
    font-size: 1rem;
    font-weight: 500;
  }
  
  .brand-section {
    padding: 2rem 1.5rem 1.5rem;
    margin-bottom: 1rem;
  }
}

/* === SAFE AREAS (iOS) === */
@supports (padding: env(safe-area-inset-left)) {
  @media (max-width: 768px) {
    .curved-sidebar {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    .mobile-header {
      padding-top: calc(1rem + env(safe-area-inset-top));
    }
    
    .mobile-menu-toggle {
      top: calc(20px + env(safe-area-inset-top));
      left: calc(20px + env(safe-area-inset-left));
    }
  }
}

/* === TOUCH OPTIMIZATIONS === */
@media (hover: none) and (pointer: coarse) {
  .curved-nav-item {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .curved-nav-item:active {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .mobile-close-btn:active,
  .mobile-menu-toggle:active {
    -webkit-tap-highlight-color: transparent;
  }
}

/* === HOVER EFFECTS GLASS === */
.nav-item-container:not(.is-active):hover .curved-nav-item {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin: 0 12px;
  transform: translateX(0);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
}

/* === SMOOTH ANIMATIONS === */
@media (prefers-reduced-motion: no-preference) {
  .curved-background {
    animation: slideInCurve 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideInCurve {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
</style>
