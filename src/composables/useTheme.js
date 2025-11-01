import { ref, computed, readonly, watch, onMounted } from 'vue'

const theme = ref('light') // Cambiado a tema claro profesional

// Definir temas disponibles
const themes = {
  dark: {
    name: 'Oscuro',
    icon: 'moon',
    colors: {
      primary: '16, 185, 129', // Verde esmeralda
      primaryLight: '52, 211, 153',
      primaryDark: '5, 150, 105'
    }
  },
  light: {
    name: 'Claro', 
    icon: 'sun',
    colors: {
      primary: '59, 130, 246', // Azul
      primaryLight: '147, 197, 253',
      primaryDark: '29, 78, 216'
    }
  },
  cyber: {
    name: 'Cyber Blue',
    icon: 'zap',
    colors: {
      primary: '0, 255, 255', // Cian
      primaryLight: '125, 211, 252',
      primaryDark: '6, 182, 212'
    }
  },
  premium: {
    name: 'Premium',
    icon: 'gem',
    colors: {
      // Verde profesional como primario
      primary: '22, 101, 52',      // green-800
      primaryLight: '22, 163, 74',   // green-600
      primaryDark: '20, 83, 45',       // green-900

      // Acento dorado/ámbar
      accent: '217, 119, 6',       // amber-600
      accentLight: '245, 158, 11',  // amber-500
      accentDark: '180, 83, 9',      // amber-700

      // Fondos limpios y claros
      bgPrimary: '249, 250, 251', // gray-50
      bgSecondary: '255, 255, 255', // white
      bgElevated: '255, 255, 255', // white

      // Textos de alto contraste
      textPrimary: '17, 24, 39',     // gray-900
      textSecondary: '55, 65, 81',   // gray-700
      textTertiary: '107, 114, 128', // gray-500
      
      // Separadores y bordes sutiles
      separator: '229, 231, 235', // gray-200

      // Colores semánticos
      success: '22, 163, 74',      // green-600
      error: '220, 38, 38',         // red-600
      warning: '245, 158, 11',     // amber-500
    }
  }
}

export function useTheme() {
  // Obtener tema guardado o usar Cyber como predeterminado
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme && themes[savedTheme]) {
      return savedTheme
    }
    
    // Tema claro profesional como predeterminado 
    return 'light'
  }

  // Aplicar tema al DOM
  const applyTheme = (newTheme) => {
    const html = document.documentElement
    const themeConfig = themes[newTheme]
    
    // Establecer atributo de tema
    html.setAttribute('data-theme', newTheme)
    
    // Aplicar colores CSS personalizados
    if (themeConfig && themeConfig.colors) {
      // Colores primarios (todos los temas)
      html.style.setProperty('--primary-color', themeConfig.colors.primary)
      html.style.setProperty('--primary-light', themeConfig.colors.primaryLight)
      html.style.setProperty('--primary-dark', themeConfig.colors.primaryDark)
      
      // Sistema de diseño "Premium iOS"
      if (newTheme === 'premium') {
        // Colores de Acento
        html.style.setProperty('--tint-color', themeConfig.colors.primary)
        
        // Colores Semánticos
        html.style.setProperty('--success-color', themeConfig.colors.green)
        html.style.setProperty('--error-color', themeConfig.colors.red)
        html.style.setProperty('--warning-color', themeConfig.colors.orange)

        // Fondos
        html.style.setProperty('--background-primary', themeConfig.colors.bgPrimary)
        html.style.setProperty('--background-secondary', themeConfig.colors.bgSecondary)
        html.style.setProperty('--background-elevated', themeConfig.colors.bgElevated)

        // Textos
        html.style.setProperty('--text-primary', themeConfig.colors.textPrimary)
        html.style.setProperty('--text-secondary', themeConfig.colors.textSecondary)
        html.style.setProperty('--text-tertiary', `rgba(${themeConfig.colors.textTertiary}, 0.3)`)

        // Separadores
        html.style.setProperty('--separator-color', `rgba(${themeConfig.colors.separator}, 0.16)`)
      }
    }
    
    // Cambiar color de la barra de estado en móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      const themeColors = {
        light: '#f8fafc',
        dark: '#111827', 
        cyber: '#0a0e1a', // Color de fondo de la loading screen
        premium: '#f2f2f7' // iOS systemGray6
      }
      metaThemeColor.setAttribute('content', themeColors[newTheme] || '#111827')
    }
    
    // Cambiar color de la barra de navegación en iOS/Android
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (metaStatusBar) {
      metaStatusBar.setAttribute('content', newTheme === 'light' ? 'default' : 'black-translucent')
    }
  }

  // Alternar entre temas (ciclo: cyber -> dark -> light -> premium -> cyber) 🚀
  const toggleTheme = () => {
    const themeOrder = ['cyber', 'dark', 'light', 'premium']
    const currentIndex = themeOrder.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    theme.value = themeOrder[nextIndex]
  }

  // Establecer tema específico
  const setTheme = (newTheme) => {
    if (themes[newTheme]) {
      theme.value = newTheme
    }
  }

  // Obtener información del tema actual
  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')
  const isCyber = computed(() => theme.value === 'cyber')
  const isPremium = computed(() => theme.value === 'premium')
  const currentTheme = computed(() => themes[theme.value])
  const availableThemes = computed(() => themes)

  // Watch para aplicar cambios automáticamente
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
  }, { immediate: true })

  // Escuchar cambios en la preferencia del sistema
  onMounted(() => {
    theme.value = getInitialTheme()
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleSystemThemeChange = (e) => {
      // Solo cambiar si no hay tema guardado explícitamente
      if (!localStorage.getItem('app-theme')) {
        theme.value = e.matches ? 'light' : 'dark'
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  })

  return {
    theme: readonly(theme),
    isDark,
    isLight,
    isCyber,
    isPremium,
    currentTheme,
    availableThemes,
    toggleTheme,
    setTheme
  }
}