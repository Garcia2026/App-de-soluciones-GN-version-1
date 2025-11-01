<template>
  <div class="theme-toggle-container">
    <button
      @click="toggleTheme"
      class="theme-toggle-btn group"
      :title="`Cambiar tema: ${getNextThemeName()}`"
      :aria-label="`Tema actual: ${currentTheme.name}. Cambiar a: ${getNextThemeName()}`"
    >
      <!-- Contenedor del icono con animación -->
      <div class="icon-container">
        <!-- Sol (tema claro) -->
        <Sun 
          v-show="isLight" 
          class="theme-icon sun-icon"
          :size="20"
        />
        
        <!-- Luna (tema oscuro) -->
        <Moon 
          v-show="isDark" 
          class="theme-icon moon-icon"
          :size="20"
        />
        
        <!-- Rayo (tema cyber) -->
        <Zap 
          v-show="isCyber" 
          class="theme-icon cyber-icon"
          :size="20"
        />
        
        <!-- Corona (tema premium) -->
        <Crown 
          v-show="isPremium" 
          class="theme-icon premium-icon"
          :size="20"
        />
      </div>
      
      <!-- Texto opcional para desktop -->
      <span class="theme-text hidden lg:inline-block ml-2">
        {{ currentTheme.name }}
      </span>
      
      <!-- Indicator dot con color del tema -->
      <div class="theme-indicator" :class="themeClass"></div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon, Zap, Crown } from 'lucide-vue-next'

const { theme, isDark, isLight, isCyber, isPremium, currentTheme, availableThemes, toggleTheme } = useTheme()

// Obtener nombre del siguiente tema
const getNextThemeName = () => {
  const themeOrder = ['cyber', 'dark', 'light', 'premium']
  const currentIndex = themeOrder.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themeOrder.length
  const nextTheme = themeOrder[nextIndex]
  return availableThemes.value[nextTheme].name
}

// Clase CSS para el indicador según el tema
const themeClass = computed(() => {
  return {
    'active': true,
    'theme-dark': isDark.value,
    'theme-light': isLight.value,
    'theme-cyber': isCyber.value,
    'theme-premium': isPremium.value
  }
})
</script>

<style scoped>
.theme-toggle-container {
  position: relative;
}

.theme-toggle-btn {
  @apply relative flex items-center justify-center p-2.5 transition-all duration-300;
  @apply backdrop-blur-sm text-gray-600 hover:text-emerald-500;
  @apply hover:scale-105 hover:shadow-lg;
  border-radius: 1rem; /* iOS button radius */
  min-width: 44px;
  min-height: 44px;
  cursor: pointer;
}

.theme-toggle-btn:hover {
  background-color: rgba(var(--primary-color), 0.1);
  border-color: rgba(var(--primary-color), 0.3);
}

.icon-container {
  @apply relative flex items-center justify-center;
  width: 20px;
  height: 20px;
}

.theme-icon {
  @apply w-5 h-5 absolute top-0 left-0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon {
  animation: rotate-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  color: rgb(var(--warning-color));
}

.moon-icon {
  animation: rotate-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  color: rgb(var(--info-color));
}

.cyber-icon {
  animation: cyber-glow 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  color: #00ffff;
  filter: drop-shadow(0 0 8px #00ffff);
}

.premium-icon {
  animation: premium-glow 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  color: rgb(102, 187, 106); /* Verde premium */
  filter: drop-shadow(0 0 8px rgba(102, 187, 106, 0.5));
}

.theme-text {
  @apply transition-colors duration-300;
  color: rgb(var(--text-secondary));
  font-size: 0.75rem; /* iOS button text size */
  font-weight: 600; /* iOS Semibold for buttons */
  letter-spacing: -0.01em;
}

.theme-indicator {
  @apply absolute -top-1 -right-1 w-2 h-2 rounded-full;
  @apply transition-all duration-300;
  background-color: rgb(var(--error-color));
  opacity: 0;
  transform: scale(0);
}

.theme-indicator.active {
  opacity: 1;
  transform: scale(1);
}

.theme-indicator.theme-dark {
  background-color: rgb(var(--success-color));
}

.theme-indicator.theme-light {
  background-color: rgb(var(--warning-color));
}

.theme-indicator.theme-cyber {
  background-color: #00ffff;
  box-shadow: 0 0 8px #00ffff;
}

.theme-indicator.theme-premium {
  background: linear-gradient(45deg, rgb(102, 187, 106), rgb(100, 181, 246));
  box-shadow: 0 0 8px rgba(102, 187, 106, 0.5);
}

/* Animaciones */
@keyframes rotate-in {
  0% {
    opacity: 0;
    transform: rotate(-180deg) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes cyber-glow {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: drop-shadow(0 0 4px #00ffff);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
    filter: drop-shadow(0 0 12px #00ffff);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: drop-shadow(0 0 8px #00ffff);
  }
}

@keyframes premium-glow {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
    filter: drop-shadow(0 0 4px rgba(102, 187, 106, 0.3));
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 12px rgba(102, 187, 106, 0.6)) drop-shadow(0 0 8px rgba(100, 181, 246, 0.4));
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 8px rgba(102, 187, 106, 0.5));
  }
}

/* Estados hover y focus */
.theme-toggle-btn:focus {
  @apply outline-none ring-2 ring-offset-2;
  ring-color: rgb(var(--primary-color));
  ring-offset-color: rgb(var(--background-primary));
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

/* Adaptaciones para el tema claro */
[data-theme="light"] .theme-toggle-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .theme-toggle-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .theme-toggle-btn {
    @apply p-2;
    min-width: 40px;
    min-height: 40px;
  }
  
  .theme-icon {
    @apply w-4 h-4;
  }
}
</style>