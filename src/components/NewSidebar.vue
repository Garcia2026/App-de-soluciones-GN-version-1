<template>
  <aside
    class="ios-sidebar"
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
          <span class="gn-logo">GN</span>
        </div>
        <div class="logo-text">
          <span class="brand-name">Business</span>
          <span class="brand-subtitle">Navigation</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu - Infographic Style -->
    <nav class="ios-nav">
      <!-- Línea vertical conectora -->
      <div class="connector-line"></div>

      <div
        v-for="(item, index) in menuItems"
        :key="item.path"
        class="nav-item-wrapper"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="handleNavClick(item.path, $event)"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <!-- Número del paso -->
        <div class="step-number-container">
          <div
            :class="[
              'step-number',
              isActive(item.path) ? getActiveColorClass(index) : '',
              hoveredIndex === index && !isActive(item.path) ? 'step-number-hover' : ''
            ]"
          >
            <span class="number-text">{{ String(index + 1).padStart(2, '0') }}</span>

            <!-- Glow effect detrás del número cuando está activo -->
            <div v-if="isActive(item.path)" :class="['number-glow', getGlowClass(index)]"></div>
          </div>
        </div>

        <!-- Tarjeta del item -->
        <router-link
          :to="item.path"
          :class="[
            'nav-card',
            isActive(item.path) ? getActiveCardClass(index) + ' nav-card-active' : 'nav-card-inactive',
            hoveredIndex === index ? 'nav-card-hovered' : ''
          ]"
          :title="`${item.label} - ${getKeyboardShortcut(index)}`"
        >
          <!-- Ripple effect container -->
          <span ref="rippleContainer" class="ripple-container">
            <span
              v-for="ripple in ripples"
              :key="ripple.id"
              class="ripple-effect"
              :style="{
                left: ripple.x + 'px',
                top: ripple.y + 'px',
                animation: 'ripple-animation 0.6s ease-out'
              }"
            ></span>
          </span>

          <!-- Efecto de brillo -->
          <div :class="['card-glow', getGlowClass(index)]"></div>

          <!-- Contenido -->
          <div class="card-content">
            <!-- Icono -->
            <div
              :class="[
                'card-icon',
                isActive(item.path) ? getActiveIconClass(index) : 'card-icon-inactive'
              ]"
            >
              <component :is="item.icon" class="icon-svg" />
            </div>

            <!-- Texto -->
            <div class="card-text">
              <div class="title-row">
                <h3
                  :class="[
                    'card-title',
                    isActive(item.path) ? 'card-title-active' : ''
                  ]"
                >
                  {{ item.label }}
                </h3>
                <!-- Badge de notificaciones (opcional) -->
                <span
                  v-if="item.badge && item.badge > 0"
                  :class="['notification-badge', getBadgeClass(index)]"
                >
                  {{ item.badge > 99 ? '99+' : item.badge }}
                </span>
              </div>
              <p
                :class="[
                  'card-description',
                  isActive(item.path) ? 'card-description-active' : ''
                ]"
              >
                {{ item.description || getDescription(item.label) }}
              </p>
              <!-- Keyboard shortcut hint -->
              <span class="keyboard-hint">{{ getKeyboardShortcut(index) }}</span>
            </div>

            <!-- Indicador de activo -->
            <div v-if="isActive(item.path)" class="active-indicator"></div>
          </div>
        </router-link>
      </div>

      <!-- Logout Button -->
      <div class="nav-item-wrapper logout-wrapper">
        <div class="step-number-container">
          <div class="step-number step-number-logout">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        <button @click="handleLogout" class="nav-card nav-card-inactive logout-card">
          <div class="card-content">
            <div class="card-icon card-icon-inactive">
              <ArrowLeftOnRectangleIcon class="icon-svg" />
            </div>

            <div class="card-text">
              <h3 class="card-title">Cerrar Sesión</h3>
              <p class="card-description">Salir de la aplicación</p>
            </div>
          </div>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Toggle Button -->
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

// Interaction state
const hoveredIndex = ref(null)
const ripples = ref([])
const rippleContainer = ref(null)

// Menu items con descripciones y badges
const allMenuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon, badge: 0 },
  { path: '/finanzas', label: 'Finanzas', icon: CurrencyDollarIcon, badge: 0 },
  { path: '/proyectos', label: 'Proyectos', icon: FireIcon, badge: 3 },
  { path: '/cotizaciones', label: 'Cotizaciones', icon: ClipboardDocumentListIcon, badge: 5 },
  { path: '/tiendas', label: 'Tiendas', icon: BuildingStorefrontIcon, badge: 0 },
  { path: '/cobros', label: 'Cobros', icon: CreditCardIcon, badge: 12 },
  { path: '/estadisticas', label: 'Estadísticas', icon: ChartBarIcon, badge: 0 },
  { path: '/bitacora', label: 'Bitácora', icon: ScrollText, adminOnly: true, badge: 0 }
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

// Descripción por defecto basada en el label
const getDescription = (label) => {
  const descriptions = {
    'Dashboard': 'Panel principal y resumen',
    'Finanzas': 'Control financiero y reportes',
    'Proyectos': 'Gestión de proyectos activos',
    'Cotizaciones': 'Crear y gestionar cotizaciones',
    'Tiendas': 'Gestión de puntos de venta',
    'Cobros': 'Administrar pagos y cobros',
    'Estadísticas': 'Análisis y métricas',
    'Bitácora': 'Historial de actividades'
  }
  return descriptions[label] || 'Sección de la aplicación'
}

// Funciones para estilos dinámicos por índice
const getActiveColorClass = (index) => {
  const colors = [
    'step-number-emerald',
    'step-number-blue',
    'step-number-purple',
    'step-number-pink',
    'step-number-cyan',
    'step-number-orange',
    'step-number-amber',
    'step-number-red'
  ]
  return colors[index % colors.length]
}

const getActiveCardClass = (index) => {
  const classes = [
    'nav-card-emerald',
    'nav-card-blue',
    'nav-card-purple',
    'nav-card-pink',
    'nav-card-cyan',
    'nav-card-orange',
    'nav-card-amber',
    'nav-card-red'
  ]
  return classes[index % classes.length]
}

const getActiveIconClass = (index) => {
  const classes = [
    'card-icon-emerald',
    'card-icon-blue',
    'card-icon-purple',
    'card-icon-pink',
    'card-icon-cyan',
    'card-icon-orange',
    'card-icon-amber',
    'card-icon-red'
  ]
  return classes[index % classes.length]
}

const getGlowClass = (index) => {
  const classes = [
    'card-glow-emerald',
    'card-glow-blue',
    'card-glow-purple',
    'card-glow-pink',
    'card-glow-cyan',
    'card-glow-orange',
    'card-glow-amber',
    'card-glow-red'
  ]
  return classes[index % classes.length]
}

const getBadgeClass = (index) => {
  const classes = [
    'badge-emerald',
    'badge-blue',
    'badge-purple',
    'badge-pink',
    'badge-cyan',
    'badge-orange',
    'badge-amber',
    'badge-red'
  ]
  return classes[index % classes.length]
}

const getKeyboardShortcut = (index) => {
  return `Ctrl+${index + 1}`
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

// Ripple effect handler
const handleNavClick = (path, event) => {
  createRipple(event)
  onNavItemClick(path)
}

const createRipple = (event) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const ripple = {
    id: Date.now(),
    x,
    y
  }

  ripples.value.push(ripple)

  // Remove ripple after animation
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== ripple.id)
  }, 600)
}

// Keyboard shortcuts handler
const handleKeyboardShortcut = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
    e.preventDefault()
    const index = parseInt(e.key) - 1
    if (index < menuItems.value.length) {
      const item = menuItems.value[index]
      router.push(item.path)
    }
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
  document.addEventListener('keydown', handleKeyboardShortcut)

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
  document.removeEventListener('keydown', handleKeyboardShortcut)
  toggleBodyScroll(false)
})

// Expose methods for parent components
defineExpose({
  toggleMobile,
  closeMobile
})
</script>

<style scoped>
/* === IOS SIDEBAR - Infographic Style === */
.ios-sidebar {
  width: 320px;
  height: 100vh;
  background: linear-gradient(to bottom,
    #064e3b 0%,
    #065f46 40%,
    #047857 100%
  );
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Patrón de puntos sutil en el fondo */
.ios-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 0;
}

/* === BRAND SECTION === */
.brand-section {
  padding: 2rem 1.5rem 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
}

.gn-logo {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 0.05em;
}

/* === IOS NAVIGATION === */
.ios-nav {
  flex: 1;
  position: relative;
  padding: 0 1rem 1rem;
  z-index: 1;
}

/* Línea vertical conectora */
.connector-line {
  position: absolute;
  left: 2.5rem;
  top: 2rem;
  bottom: 6rem;
  width: 2px;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 10%,
    rgba(255, 255, 255, 0.2) 90%,
    transparent 100%
  );
  z-index: 0;
}

/* === NAV ITEM WRAPPER === */
.nav-item-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === STEP NUMBER === */
.step-number-container {
  flex-shrink: 0;
  width: 48px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.step-number-hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Glow effect detrás del número */
.number-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(12px);
  z-index: -1;
  animation: numberGlowPulse 2s ease-in-out infinite;
}

@keyframes numberGlowPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.number-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

/* Step number active colors */
.step-number-emerald {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #34d399;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  transform: scale(1.1);
}

.step-number-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #60a5fa;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.step-number-purple {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  border-color: #c084fc;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
  transform: scale(1.1);
}

.step-number-pink {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  border-color: #f472b6;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
  transform: scale(1.1);
}

.step-number-cyan {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-color: #22d3ee;
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
  transform: scale(1.1);
}

.step-number-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-color: #fb923c;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
  transform: scale(1.1);
}

.step-number-amber {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #fbbf24;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  transform: scale(1.1);
}

.step-number-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #f87171;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  transform: scale(1.1);
}

.step-number-emerald .number-text,
.step-number-blue .number-text,
.step-number-purple .number-text,
.step-number-pink .number-text,
.step-number-cyan .number-text,
.step-number-orange .number-text,
.step-number-amber .number-text,
.step-number-red .number-text {
  color: white;
}

/* === NAV CARD === */
.nav-card {
  flex: 1;
  border-radius: 16px;
  padding: 1rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
}

/* Elevation effect para item activo */
.nav-card-active {
  transform: translateX(6px) translateY(-2px);
  box-shadow:
    -4px 8px 24px rgba(0, 0, 0, 0.3),
    -2px 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-card-hovered:not(.nav-card-active) {
  transform: translateX(6px) translateY(-1px);
  box-shadow:
    -2px 4px 16px rgba(0, 0, 0, 0.2),
    -1px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Ripple container */
.ripple-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 16px;
}

.ripple-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

.nav-card-inactive {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.nav-card-inactive:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  transform: translateX(4px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow:
    0 4px 16px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(200%);
}

.nav-card-inactive:active {
  transform: translateX(2px) scale(0.98);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
}

/* Nav card active colors */
.nav-card-emerald {
  background: linear-gradient(135deg,
    rgba(16, 185, 129, 0.25) 0%,
    rgba(5, 150, 105, 0.15) 100%
  );
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow:
    0 4px 20px rgba(16, 185, 129, 0.3),
    0 0 40px rgba(16, 185, 129, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-blue {
  background: linear-gradient(135deg,
    rgba(59, 130, 246, 0.25) 0%,
    rgba(37, 99, 235, 0.15) 100%
  );
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow:
    0 4px 20px rgba(59, 130, 246, 0.3),
    0 0 40px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-purple {
  background: linear-gradient(135deg,
    rgba(168, 85, 247, 0.25) 0%,
    rgba(147, 51, 234, 0.15) 100%
  );
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow:
    0 4px 20px rgba(168, 85, 247, 0.3),
    0 0 40px rgba(168, 85, 247, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-pink {
  background: linear-gradient(135deg,
    rgba(236, 72, 153, 0.25) 0%,
    rgba(219, 39, 119, 0.15) 100%
  );
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow:
    0 4px 20px rgba(236, 72, 153, 0.3),
    0 0 40px rgba(236, 72, 153, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-cyan {
  background: linear-gradient(135deg,
    rgba(6, 182, 212, 0.25) 0%,
    rgba(8, 145, 178, 0.15) 100%
  );
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow:
    0 4px 20px rgba(6, 182, 212, 0.3),
    0 0 40px rgba(6, 182, 212, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-orange {
  background: linear-gradient(135deg,
    rgba(249, 115, 22, 0.25) 0%,
    rgba(234, 88, 12, 0.15) 100%
  );
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow:
    0 4px 20px rgba(249, 115, 22, 0.3),
    0 0 40px rgba(249, 115, 22, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-amber {
  background: linear-gradient(135deg,
    rgba(245, 158, 11, 0.25) 0%,
    rgba(217, 119, 6, 0.15) 100%
  );
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow:
    0 4px 20px rgba(245, 158, 11, 0.3),
    0 0 40px rgba(245, 158, 11, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-card-red {
  background: linear-gradient(135deg,
    rgba(239, 68, 68, 0.25) 0%,
    rgba(220, 38, 38, 0.15) 100%
  );
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow:
    0 4px 20px rgba(239, 68, 68, 0.3),
    0 0 40px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

/* === CARD GLOW EFFECT === */
.card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  filter: blur(20px);
}

.nav-card:hover .card-glow {
  opacity: 0.2;
}

.nav-card-active .card-glow {
  opacity: 0.25;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.25;
    filter: blur(20px);
  }
  50% {
    opacity: 0.35;
    filter: blur(25px);
  }
}

.card-glow-emerald { background: linear-gradient(135deg, #10b981, #059669); }
.card-glow-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.card-glow-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }
.card-glow-pink { background: linear-gradient(135deg, #ec4899, #db2777); }
.card-glow-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.card-glow-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.card-glow-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
.card-glow-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

/* === CARD CONTENT === */
.card-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.card-icon-inactive {
  background: rgba(255, 255, 255, 0.1);
}

.icon-svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.8);
}

/* Icon active colors */
.card-icon-emerald { background: linear-gradient(135deg, #10b981, #059669); }
.card-icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.card-icon-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }
.card-icon-pink { background: linear-gradient(135deg, #ec4899, #db2777); }
.card-icon-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.card-icon-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.card-icon-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
.card-icon-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

.card-icon-emerald .icon-svg,
.card-icon-blue .icon-svg,
.card-icon-purple .icon-svg,
.card-icon-pink .icon-svg,
.card-icon-cyan .icon-svg,
.card-icon-orange .icon-svg,
.card-icon-amber .icon-svg,
.card-icon-red .icon-svg {
  color: white;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.125rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.125rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.card-title-active {
  color: white;
}

.card-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.3;
}

.card-description-active {
  color: rgba(255, 255, 255, 0.7);
}

/* Notification badges */
.notification-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  color: white;
  min-width: 18px;
  text-align: center;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.badge-emerald { background: linear-gradient(135deg, #10b981, #059669); }
.badge-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.badge-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }
.badge-pink { background: linear-gradient(135deg, #ec4899, #db2777); }
.badge-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.badge-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.badge-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
.badge-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

/* Keyboard hint */
.keyboard-hint {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Courier New', monospace;
  margin-top: 0.25rem;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-card:hover .keyboard-hint {
  opacity: 1;
}

.active-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(255, 255, 255, 0.4);
  animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow:
      0 0 10px rgba(255, 255, 255, 0.8),
      0 0 20px rgba(255, 255, 255, 0.4);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
    box-shadow:
      0 0 15px rgba(255, 255, 255, 1),
      0 0 30px rgba(255, 255, 255, 0.6);
  }
}

/* === LOGOUT === */
.logout-wrapper {
  margin-top: auto;
  padding-top: 1rem;
}

.step-number-logout {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.logout-card {
  border-color: rgba(239, 68, 68, 0.2);
}

.logout-card:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

/* === MOBILE HEADER === */
.mobile-header {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(6, 78, 59, 0.95);
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
  top: clamp(16px, calc(12px + 2vh), 28px);
  left: clamp(16px, calc(12px + 4vw), 32px);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  border: none;
  border-radius: 16px;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(6, 78, 59, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
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

.mobile-menu-toggle.is-open {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9) translateY(-6px);
}

/* === MOBILE OVERLAY === */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  .ios-sidebar {
    width: min(320px, calc(100vw - 48px));
    max-width: 92vw;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.3);
  }

  .ios-sidebar.mobile-open {
    transform: translateX(0);
  }

  .nav-card {
    padding: 0.875rem;
  }

  .card-icon {
    width: 36px;
    height: 36px;
  }

  .icon-svg {
    width: 18px;
    height: 18px;
  }
}

/* === SAFE AREAS (iOS) === */
@supports (padding: env(safe-area-inset-left)) {
  @media (max-width: 768px) {
    .ios-sidebar {
      padding-top: calc(1.5rem + env(safe-area-inset-top));
      padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
    }

    .mobile-header {
      padding-top: calc(1rem + env(safe-area-inset-top));
    }

    .mobile-menu-toggle {
      top: calc(clamp(16px, calc(12px + 2vh), 28px) + env(safe-area-inset-top));
      left: calc(clamp(16px, calc(12px + 4vw), 32px) + env(safe-area-inset-left));
    }
  }
}

/* === TOUCH OPTIMIZATIONS === */
@media (hover: none) and (pointer: coarse) {
  .nav-card,
  .mobile-close-btn,
  .mobile-menu-toggle {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .nav-card:active {
    background: rgba(255, 255, 255, 0.15);
  }
}

/* === SCROLLBAR === */
.ios-sidebar::-webkit-scrollbar {
  width: 6px;
}

.ios-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.ios-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.ios-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
