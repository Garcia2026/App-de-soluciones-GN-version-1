<template>
  <div class="min-h-screen bg-theme-primary py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="theme-card p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-theme-primary mb-2">
              🎨 Theme Showcase Premium
            </h1>
            <p class="text-theme-secondary">
              Material Design 3 · Tonos claros verdes y azules · Contornos redondeados
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <!-- Theme Info -->
        <div v-if="isPremium" class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200 shadow-xl animate-pulse-slow">
          <div class="flex items-center gap-3 mb-3">
            <Crown class="w-7 h-7 text-blue-600 animate-bounce" />
            <span class="font-black text-blue-800 text-xl">🚀 MATERIAL YOU ESPECTACULAR</span>
          </div>
          <p class="text-sm text-blue-700 mb-2 font-bold">
            <strong>Google Material Design 3 - EFECTOS EXTREMOS</strong>
          </p>
          <p class="text-sm text-blue-600">
            🔵 Blue Material (#42a5f5) • 🟢 Green Accent (#4caf50) • 🟠 Orange Energy (#ff9800)<br/>
            ✨ Gradientes animados • 🎭 Efectos 3D • 💫 Micro-interactions • 🌊 Morphing UI
          </p>
        </div>
      </div>

      <!-- Botones -->
      <div class="theme-card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Botones</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button class="btn-primary">
            🤖 PRIMARY
          </button>
          <button class="btn-secondary">
            SECONDARY  
          </button>
          <button class="btn-tertiary">
            TERTIARY
          </button>
          <button class="btn-outlined">
            OUTLINED
          </button>
        </div>
        <div class="mt-4 flex gap-4">
          <button class="fab">
            <Plus class="w-6 h-6" />
          </button>
          <button class="fab-extended">
            <MessageCircle class="w-5 h-5" />
            <span>Nuevo Chat</span>
          </button>
        </div>
      </div>

      <!-- Cards -->
      <div class="theme-card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-4">
            <h3 class="font-semibold mb-2">Card Regular</h3>
            <p class="text-sm text-theme-secondary">
              Esta es una card regular con el estilo premium aplicado.
            </p>
          </div>
          <div class="card-elevated p-4">
            <h3 class="font-semibold mb-2">Card Elevada</h3>
            <p class="text-sm text-theme-secondary">
              Esta card tiene mayor elevación y sombras más pronunciadas.
            </p>
          </div>
          <div class="card-compact p-3">
            <h3 class="font-semibold mb-2">Card Compacta</h3>
            <p class="text-sm text-theme-secondary">
              Card más pequeña para información secundaria.
            </p>
          </div>
        </div>
      </div>

      <!-- Inputs y Formularios -->
      <div class="theme-card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Inputs y Formularios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block mb-2">Input Regular</label>
              <input 
                type="text" 
                placeholder="Escribe aquí..." 
                class="input-field w-full"
              >
            </div>
            <div>
              <label class="block mb-2">Input Outlined</label>
              <input 
                type="text" 
                placeholder="Input con borde..." 
                class="input-outlined w-full"
              >
            </div>
            <div>
              <label class="block mb-2">Select</label>
              <select class="input-field w-full">
                <option>Opción 1</option>
                <option>Opción 2</option>
                <option>Opción 3</option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block mb-2">Textarea</label>
              <textarea 
                placeholder="Descripción extensa..." 
                rows="4"
                class="input-field w-full"
              ></textarea>
            </div>
            <div>
              <label class="block mb-2">Input con Error</label>
              <input 
                type="email" 
                placeholder="email@ejemplo.com" 
                class="input-field error w-full"
              >
              <p class="text-red-500 text-sm mt-1">Email requerido</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <div class="theme-card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Navegación</h2>
        
        <!-- Nav Items -->
        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-3">Nav Items</h3>
            <div class="flex gap-2">
              <div class="nav-item">
                <Home class="w-5 h-5" />
                <span class="text-sm">Inicio</span>
              </div>
              <div class="nav-item active">
                <Settings class="w-5 h-5" />
                <span class="text-sm">Activo</span>
              </div>
              <div class="nav-item">
                <User class="w-5 h-5" />
                <span class="text-sm">Perfil</span>
              </div>
            </div>
          </div>
          
          <!-- Breadcrumb -->
          <div>
            <h3 class="font-medium mb-3">Breadcrumb</h3>
            <nav class="breadcrumb flex items-center gap-2">
              <a href="#" class="hover:bg-theme-card">Inicio</a>
              <span>/</span>
              <a href="#" class="hover:bg-theme-card">Temas</a>
              <span>/</span>
              <span>Premium</span>
            </nav>
          </div>
        </div>
      </div>

      <!-- Chips y Badges -->
      <div class="theme-card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Chips y Badges</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-3">Chips</h3>
            <div class="flex flex-wrap gap-2">
              <span class="chip">
                <Tag class="w-4 h-4" />
                Diseño
              </span>
              <span class="chip selected">
                <Star class="w-4 h-4" />
                Premium
              </span>
              <span class="chip">
                Material Design 3
              </span>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium mb-3">Badges</h3>
            <div class="flex gap-4 items-center">
              <div class="relative">
                <Bell class="w-6 h-6" />
                <span class="badge absolute -top-1 -right-1">3</span>
              </div>
              <div class="relative">
                <MessageCircle class="w-6 h-6" />
                <span class="badge-secondary absolute -top-1 -right-1">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paleta de Colores -->
      <div class="theme-card p-6">
        <h2 class="text-xl font-semibold mb-4 text-theme-primary">Paleta de Colores Premium</h2>
        <div v-if="isPremium" class="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div class="text-center animate-bounce">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl animate-pulse" style="background: linear-gradient(45deg, rgb(66, 165, 245), rgb(25, 118, 210))"></div>
            <p class="text-sm font-black">🔵 Primary</p>
            <p class="text-xs font-bold text-blue-600">#42a5f5</p>
          </div>
          <div class="text-center animate-bounce" style="animation-delay: 0.1s;">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl animate-pulse" style="background: linear-gradient(45deg, rgb(144, 202, 249), rgb(66, 165, 245)); animation-delay: 0.1s;"></div>
            <p class="text-sm font-black">💙 Primary Light</p>
            <p class="text-xs font-bold text-blue-400">#90caf9</p>
          </div>
          <div class="text-center animate-bounce" style="animation-delay: 0.2s;">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl animate-pulse" style="background: linear-gradient(45deg, rgb(76, 175, 80), rgb(56, 142, 60)); animation-delay: 0.2s;"></div>
            <p class="text-sm font-black">🟢 Secondary</p>
            <p class="text-xs font-bold text-green-600">#4caf50</p>
          </div>
          <div class="text-center animate-bounce" style="animation-delay: 0.3s;">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl animate-pulse" style="background: linear-gradient(45deg, rgb(255, 152, 0), rgb(239, 108, 0)); animation-delay: 0.3s;"></div>
            <p class="text-sm font-black">🟠 Tertiary</p>
            <p class="text-xs font-bold text-orange-600">#ff9800</p>
          </div>
          <div class="text-center animate-bounce" style="animation-delay: 0.4s;">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl border-2 border-blue-200" style="background: linear-gradient(135deg, rgb(255, 255, 255), rgb(248, 250, 252))"></div>
            <p class="text-sm font-black">⚪ Surface</p>
            <p class="text-xs font-bold text-gray-600">#ffffff</p>
          </div>
          <div class="text-center animate-bounce" style="animation-delay: 0.5s;">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-2 shadow-xl border-2 border-gray-200" style="background: linear-gradient(135deg, rgb(248, 250, 252), rgb(241, 245, 249))"></div>
            <p class="text-sm font-black">🌫️ Surface Variant</p>
            <p class="text-xs font-bold text-gray-500">#f8fafc</p>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <Crown class="w-12 h-12 mx-auto mb-4 text-theme-muted" />
          <p class="text-theme-secondary">Activa el tema Premium para ver la paleta completa</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { 
  Crown, Plus, MessageCircle, Home, Settings, User, 
  Tag, Star, Bell, Target
} from 'lucide-vue-next'

const { isPremium } = useTheme()
</script>

<style scoped>
/* Estilos adicionales para el showcase */
.nav-item {
  @apply flex flex-col items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200;
}

/* Los demás estilos están definidos en premium-theme.css y tailwind.css */
</style>