# 🎨 Sistema de Temas Dinámicos - Cyber Blue Edition

## 🔧 Configuración Técnica

### Composable `useTheme.js`

```javascript
import { ref, computed, readonly, watch, onMounted } from 'vue'

const theme = ref('cyber') // ¡Del futuro venimos! 🚀

const themes = {
  dark: {
    name: 'Oscuro',
    icon: 'moon',
    colors: {
      primary: '16, 185, 129',     // Verde esmeralda
      primaryLight: '52, 211, 153',
      primaryDark: '5, 150, 105'
    }
  },
  light: {
    name: 'Claro', 
    icon: 'sun',
    colors: {
      primary: '59, 130, 246',     // Azul cielo
      primaryLight: '147, 197, 253',
      primaryDark: '29, 78, 216'
    }
  },
  cyber: {
    name: 'Cyber Blue',
    icon: 'zap',
    colors: {
      primary: '0, 255, 255',      // Cian puro #00ffff
      primaryLight: '125, 211, 252',
      primaryDark: '6, 182, 212'
    }
  }
}
```

### Funciones del Sistema

#### `applyTheme(newTheme)`
Aplica el tema seleccionado al DOM:
- Establece `data-theme` attribute
- Configura CSS custom properties
- Actualiza meta tags para móviles
- Cambia color de status bar

#### `toggleTheme()`
Cicla entre temas en orden específico:
```javascript
const themeOrder = ['cyber', 'dark', 'light'] // Cyber primero
```

#### `getInitialTheme()`
Determina tema inicial:
1. Verifica localStorage
2. Si no existe, usa **Cyber** como predeterminado
3. Respeta preferencias del sistema solo si no hay tema guardado

## 🎯 Implementación CSS

### Variables CSS Dinámicas

Cada tema define sus propias variables:

```css
[data-theme="cyber"] {
  /* Colores primarios */
  --primary-color: 0, 255, 255;          /* #00ffff */
  --primary-light: 125, 211, 252;        /* #7dd3fc */
  --primary-dark: 6, 182, 212;           /* #06b6d4 */
  
  /* Backgrounds */
  --background-primary: 10, 14, 26;      /* #0a0e1a - Como loading screen */
  --background-secondary: 17, 24, 39;    /* #111827 */
  --background-tertiary: 31, 41, 55;     /* #1f2937 */
  
  /* Surfaces */
  --surface-primary: 15, 23, 42;         /* #0f172a */
  --surface-secondary: 30, 41, 59;       /* #1e293b */
  
  /* Textos */
  --text-primary: 248, 250, 252;         /* #f8fafc */
  --text-secondary: 203, 213, 225;       /* #cbd5e1 */
  --text-tertiary: 148, 163, 184;        /* #94a3b8 */
  
  /* Estados */
  --success-color: 34, 197, 94;          /* #22c55e */
  --warning-color: 251, 191, 36;         /* #fbbf24 */
  --error-color: 239, 68, 68;            /* #ef4444 */
  --info-color: 59, 130, 246;            /* #3b82f6 */
}
```

### Efectos Especiales Cyber

#### Scrollbars Luminosos
```css
[data-theme="cyber"] ::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, 
    rgba(0, 255, 255, 0.6), 
    rgba(6, 182, 212, 0.8)
  );
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}
```

#### Borders Neón
```css
[data-theme="cyber"] .card,
[data-theme="cyber"] .input-field {
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

[data-theme="cyber"] .card:hover {
  border-color: rgba(0, 255, 255, 0.6);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
}
```

#### Backgrounds Espaciales
```css
[data-theme="cyber"] .hero-section {
  background: linear-gradient(135deg, 
    rgba(10, 14, 26, 0.95) 0%,
    rgba(17, 24, 39, 0.9) 50%,
    rgba(6, 182, 212, 0.1) 100%
  );
}
```

## 🔄 ThemeToggle Component

### Iconos Dinámicos por Tema
```vue
<!-- Sol (tema claro) -->
<Sun v-show="isLight" class="theme-icon sun-icon" :size="20" />

<!-- Luna (tema oscuro) -->
<Moon v-show="isDark" class="theme-icon moon-icon" :size="20" />

<!-- Rayo (tema cyber) -->
<Zap v-show="isCyber" class="theme-icon cyber-icon" :size="20" />
```

### Animaciones de Transición

#### Cyber Icon Animation
```css
.cyber-icon {
  animation: cyber-glow 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  color: #00ffff;
  filter: drop-shadow(0 0 8px #00ffff);
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
```

### Indicadores de Tema
```css
.theme-indicator.theme-cyber {
  background-color: #00ffff;
  box-shadow: 0 0 8px #00ffff;
}
```

## 📱 Meta Tags Dinámicos

### Status Bar Colors
```javascript
const themeColors = {
  light: '#f8fafc',    // Claro
  dark: '#111827',     // Oscuro
  cyber: '#0a0e1a'     // Cyber - Match con loading screen
}

// Aplicación automática
metaThemeColor.setAttribute('content', themeColors[newTheme])
```

### iOS Status Bar Style
```javascript
const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
metaStatusBar.setAttribute('content', 
  newTheme === 'light' ? 'default' : 'black-translucent'
)
```

## 🔄 Persistencia y Recuperación

### LocalStorage Integration
```javascript
// Guardar tema
localStorage.setItem('app-theme', newTheme)

// Recuperar tema
const savedTheme = localStorage.getItem('app-theme')
if (savedTheme && themes[savedTheme]) {
  return savedTheme
}
```

### System Preferences Detection
```javascript
const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
const handleSystemThemeChange = (e) => {
  // Solo cambiar si no hay tema guardado explícitamente
  if (!localStorage.getItem('app-theme')) {
    theme.value = e.matches ? 'light' : 'dark'
  }
}
```

## 🎨 Uso en Componentes

### Reactive Theme Detection
```javascript
const { theme, isDark, isLight, isCyber, currentTheme, toggleTheme } = useTheme()

// Clases dinámicas
const themeClass = computed(() => ({
  'theme-cyber': isCyber.value,
  'theme-dark': isDark.value,
  'theme-light': isLight.value
}))
```

### Conditional Styling
```vue
<div 
  :class="[
    'component-base',
    {
      'cyber-glow': isCyber.value,
      'dark-shadow': isDark.value,
      'light-border': isLight.value
    }
  ]"
>
```

## 🚀 Características Avanzadas

### Theme Preloading
```javascript
// Aplicar tema inmediatamente al cargar
watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('app-theme', newTheme)
}, { immediate: true })
```

### Seamless Transitions
```css
* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease, 
              box-shadow 0.3s ease;
}
```

### Theme Context Provider
```javascript
// Readonly access para componentes
return {
  theme: readonly(theme),
  isDark,
  isLight, 
  isCyber,
  currentTheme,
  availableThemes,
  toggleTheme,
  setTheme
}
```

## 🎯 Best Practices

1. **Usar CSS Custom Properties** para máxima flexibilidad
2. **Detectar preferencias del sistema** como fallback
3. **Persistir selección del usuario** en localStorage
4. **Aplicar cambios reactivamente** con Vue watchers
5. **Optimizar transiciones** para mejor UX
6. **Mantener accesibilidad** con ARIA labels apropiados

---

**Resultado**: Sistema de temas robusto y extensible que permite cambios instantáneos con persistencia automática y optimización móvil completa. ¡Del futuro venimos! 🚀