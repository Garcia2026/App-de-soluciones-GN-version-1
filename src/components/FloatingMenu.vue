<template>
  <!-- FAB Principal -->
  <div
    :class="[
      'fixed z-50 transition-all duration-300',
      'right-6 bottom-20 md:bottom-6',
      'w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600',
      'rounded-full shadow-lg hover:shadow-xl',
      'flex items-center justify-center cursor-pointer',
      'transform hover:scale-110 active:scale-95',
      'border-2 border-emerald-400/20',
      { 'rotate-45': isOpen }
    ]"
    @click="toggleMenu"
  >
    <Menu :size="24" class="text-white transition-transform duration-300" />
  </div>

  <!-- Backdrop con efecto glassmorphism -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 transition-all duration-300"
      :class="isOpen ? 'opacity-100' : 'opacity-0'"
      @click="closeMenu"
    >
      <!-- Fondo con efecto blur y gradiente -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/90 to-slate-900/95 backdrop-blur-lg"></div>
      <!-- Patrón de puntos sutil -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
  </Teleport>

  <!-- Modal Menú Infográfico -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      :class="isOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      @click.self="closeMenu"
    >
      <div
        class="relative max-w-2xl w-full my-8 transform transition-all duration-300"
        :class="isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'"
      >
        <!-- Header -->
        <div class="text-center mb-8 space-y-2">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">GN</span>
              </div>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-white">Business</h2>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Navigation</h3>
          <p class="text-gray-400">Selecciona una sección para continuar</p>
        </div>

        <!-- Línea vertical conectora (absoluta) -->
        <div class="absolute left-[calc(50%-1px)] top-40 bottom-16 w-0.5 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent hidden md:block" style="left: 2.5rem;"></div>

        <!-- Lista de items en formato infográfico -->
        <div class="relative space-y-4">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="relative flex items-center space-x-4 group menu-item"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <!-- Número del paso -->
            <div class="relative z-10 flex-shrink-0">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                isActive(item.ruta)
                  ? getActiveNumberClass(index)
                  : 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50 group-hover:' + getHoverNumberClass(index)
              ]">
                <span :class="[
                  'text-sm font-bold transition-colors duration-300',
                  isActive(item.ruta) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                ]">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
              </div>
            </div>

            <!-- Tarjeta del item -->
            <router-link
              :to="item.ruta"
              @click="closeMenu"
              :class="[
                'flex-1 rounded-2xl p-4 transition-all duration-300 cursor-pointer',
                'backdrop-blur-xl border shadow-xl relative overflow-hidden',
                'hover:transform hover:scale-105',
                isActive(item.ruta)
                  ? getBorderClass(index)
                  : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50 hover:' + getBorderClass(index)
              ]"
            >
              <!-- Efecto de brillo -->
              <div :class="[
                'absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300',
                'group-hover:opacity-10',
                getGradientClass(index)
              ]"></div>

              <!-- Contenido -->
              <div class="relative z-10 flex items-center space-x-4">
                <!-- Icono -->
                <div :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0',
                  isActive(item.ruta)
                    ? getIconBgClass(index) + ' shadow-lg'
                    : 'bg-slate-700/50 group-hover:' + getIconBgClass(index) + ' group-hover:shadow-lg'
                ]">
                  <component
                    :is="getIconComponent(item.iconComponent)"
                    :size="24"
                    :class="[
                      'transition-colors duration-300',
                      isActive(item.ruta) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    ]"
                  />
                </div>

                <!-- Texto -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h3 :class="[
                      'font-bold text-base uppercase tracking-wide transition-colors duration-300 truncate',
                      isActive(item.ruta) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    ]">
                      {{ item.nombre }}
                    </h3>
                    <span v-if="item.destacado" class="flex-shrink-0 px-2 py-1 text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-sm">
                      ★
                    </span>
                  </div>
                  <p :class="[
                    'text-sm transition-colors duration-300 mt-1',
                    isActive(item.ruta) ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-300'
                  ]">
                    {{ item.descripcion }}
                  </p>
                </div>

                <!-- Indicador de activo -->
                <div v-if="isActive(item.ruta)" class="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 px-6 py-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50">
          <div class="flex items-center justify-between text-sm">
            <span class="text-emerald-300/70 font-mono">{{ formattedTime }}</span>
            <span class="text-emerald-200/70">{{ formattedDate }}</span>
          </div>
        </div>

        <!-- Botón cerrar -->
        <button
          @click="closeMenu"
          class="absolute -top-2 -right-2 w-10 h-10 bg-slate-800/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 group z-50"
        >
          <X :size="20" class="text-gray-400 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Menu,
  X,
  Home,
  FileText,
  DollarSign,
  Store,
  Receipt,
  BarChart3,
  Building2
} from 'lucide-vue-next'

// Estado del menú
const isOpen = ref(false)
const router = useRouter()
const route = useRoute()

// Reloj
const currentTime = ref(new Date())
let clockInterval

// Iconos disponibles
const iconComponents = {
  Home,
  FileText,
  DollarSign,
  Store,
  Receipt,
  BarChart3,
  Building2
}

const getIconComponent = (iconName) => iconComponents[iconName]

// Elementos del menú con descripciones
const menuItems = [
  {
    nombre: 'Dashboard',
    ruta: '/dashboard',
    iconComponent: 'Home',
    descripcion: 'Panel principal y resumen'
  },
  {
    nombre: 'Cotizaciones',
    ruta: '/cotizaciones',
    iconComponent: 'FileText',
    descripcion: 'Crear y gestionar cotizaciones',
    destacado: true
  },
  {
    nombre: 'Finanzas',
    ruta: '/finanzas',
    iconComponent: 'DollarSign',
    descripcion: 'Control financiero y reportes'
  },
  {
    nombre: 'Tiendas',
    ruta: '/tiendas',
    iconComponent: 'Store',
    descripcion: 'Gestión de puntos de venta'
  },
  {
    nombre: 'Cobros',
    ruta: '/cobros',
    iconComponent: 'Receipt',
    descripcion: 'Administrar pagos y cobros'
  },
  {
    nombre: 'Estadísticas',
    ruta: '/estadisticas',
    iconComponent: 'BarChart3',
    descripcion: 'Análisis y métricas'
  }
]

// Funciones
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const isActive = (path) => {
  return route.path === path
}

// Funciones para estilos dinámicos por índice
const getBorderClass = (index) => {
  const colors = [
    'border-emerald-500/50 bg-emerald-500/5',
    'border-blue-500/50 bg-blue-500/5',
    'border-purple-500/50 bg-purple-500/5',
    'border-pink-500/50 bg-pink-500/5',
    'border-cyan-500/50 bg-cyan-500/5',
    'border-orange-500/50 bg-orange-500/5'
  ]
  return colors[index % colors.length]
}

const getGradientClass = (index) => {
  const gradients = [
    'from-emerald-500 to-emerald-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-orange-500 to-orange-600'
  ]
  return gradients[index % gradients.length]
}

const getIconBgClass = (index) => {
  const bgs = [
    'bg-gradient-to-r from-emerald-500 to-emerald-600',
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-cyan-500 to-cyan-600',
    'bg-gradient-to-r from-orange-500 to-orange-600'
  ]
  return bgs[index % bgs.length]
}

const getActiveNumberClass = (index) => {
  const classes = [
    'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/50 scale-110',
    'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/50 scale-110',
    'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/50 scale-110',
    'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-400 shadow-lg shadow-pink-500/50 scale-110',
    'bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/50 scale-110',
    'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50 scale-110'
  ]
  return classes[index % classes.length]
}

const getHoverNumberClass = (index) => {
  const classes = [
    'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/50 scale-110',
    'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/50 scale-110',
    'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/50 scale-110',
    'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-400 shadow-lg shadow-pink-500/50 scale-110',
    'bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/50 scale-110',
    'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50 scale-110'
  ]
  return classes[index % classes.length]
}

// Reloj
const formattedTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0')
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
})

const formattedDate = computed(() => {
  const options = { weekday: 'short', day: 'numeric', month: 'short' }
  return currentTime.value.toLocaleDateString('es-ES', options)
})

const updateClock = () => {
  currentTime.value = new Date()
}

// Cerrar menú con ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  clockInterval = setInterval(updateClock, 1000)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
  document.removeEventListener('keydown', handleKeydown)
})

// Cerrar menú cuando cambia la ruta
import { watch } from 'vue'
watch(() => route.path, () => {
  isOpen.value = false
})
</script>

<style scoped>
/* Animación de entrada para items del menú */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item {
  animation: fadeInUp 0.6s ease-out backwards;
}

.menu-item:nth-child(1) { animation-delay: 0.1s; }
.menu-item:nth-child(2) { animation-delay: 0.2s; }
.menu-item:nth-child(3) { animation-delay: 0.3s; }
.menu-item:nth-child(4) { animation-delay: 0.4s; }
.menu-item:nth-child(5) { animation-delay: 0.5s; }
.menu-item:nth-child(6) { animation-delay: 0.6s; }
.menu-item:nth-child(7) { animation-delay: 0.7s; }

/* Animación suave para el FAB */
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

/* Animación del modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Efecto de pulsación del FAB */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
}

/* Aplicar pulso ocasionalmente */
.pulse-animation {
  animation: pulse 2s infinite;
}

/* Asegurar que el scroll sea suave en el modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}
</style>