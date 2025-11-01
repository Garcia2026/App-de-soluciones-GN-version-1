# ⚡ Animaciones Futurísticas Exclusivas - Cyber Theme

## 🎯 Concepto de Animaciones Cyber

### Filosofía de Diseño
- **Exclusividad Temática**: Animaciones únicas que solo se activan en Cyber Theme
- **Efectos Cuánticos**: Simulación de partículas, teletransporte y distorsión dimensional
- **Performance Optimizada**: 60fps garantizado con GPU acceleration
- **Inmersión Futurística**: Experiencia cinematográfica para transiciones

## 🚀 Sistema de Transiciones Cyber

### Detección Condicional
```javascript
// App.vue - Lógica de detección de tema
import { useTheme } from '@/composables/useTheme'

const { isCyber } = useTheme()

// Aplicación condicional de animaciones
const shouldUseCyberAnimations = computed(() => isCyber.value)

const onTransitionEnter = (el) => {
  if (shouldUseCyberAnimations.value) {
    // Activar efectos cyber exclusivos
    createQuantumParticles(el)
    createRealityTears(el) 
    initiateTeleportEffect(el)
  }
}
```

### CSS Classes Dinámicas
```vue
<!-- Aplicación condicional de clases cyber -->
<div 
  :class="[
    'app-container',
    {
      'cyber-mode': isCyber,
      'cyber-app-enter': isCyber && isEntering,
      'quantum-active': isCyber && showQuantumEffects
    }
  ]"
>
```

## ⚡ Efectos de Entrada de Aplicación

### Cyber App Enter (Optimizado)
```css
/* Animación exclusiva para Cyber theme - Sin lag */
.cyber-app-enter {
  animation: cyberAppEntrance 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes cyberAppEntrance {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
    filter: blur(4px) hue-rotate(0deg);
  }
  30% {
    opacity: 0.7;
    transform: scale(1.02) translateY(-5px);
    filter: blur(1px) hue-rotate(90deg);
  }
  60% {
    opacity: 0.9;
    transform: scale(0.99) translateY(2px);
    filter: blur(0px) hue-rotate(180deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px) hue-rotate(360deg);
  }
}

/* Expansión de ondas cuánticas */
.cyber-app-enter::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border: 2px solid rgba(0, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: quantumWaveExpansion 0.8s ease-out forwards;
}

@keyframes quantumWaveExpansion {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  70% {
    width: 200vw;
    height: 200vh;
    opacity: 0.3;
  }
  100% {
    width: 300vw;
    height: 300vh;
    opacity: 0;
  }
}
```

### Quantum Particles System
```javascript
// Creación de partículas cuánticas para transiciones
const createQuantumParticles = (container) => {
  const particleCount = window.innerWidth < 768 ? 15 : 30
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'quantum-transition-particle'
    
    // Propiedades aleatorias
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const scale = 0.5 + Math.random() * 1.5
    const duration = 1000 + Math.random() * 2000
    
    // Estilos dinámicos
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: linear-gradient(45deg, #00ffff, #06b6d4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: scale(${scale});
      animation: quantumParticleFloat ${duration}ms ease-in-out infinite;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    `
    
    document.body.appendChild(particle)
    
    // Auto cleanup después de la animación
    setTimeout(() => {
      particle.remove()
    }, duration * 2)
  }
}

// Animación CSS para partículas
const quantumParticleCSS = `
@keyframes quantumParticleFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(0.5) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translate3d(50px, -50px, 0) scale(1.2) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: translate3d(-30px, 30px, 0) scale(0.8) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translate3d(-40px, -40px, 0) scale(1.1) rotate(270deg);
    opacity: 0.9;
  }
}
`
```

## 🌌 Reality Tears (Distorsiones Dimensionales)

### Efecto de Tears
```javascript
// Creación de distorsiones dimensionales
const createRealityTears = (container) => {
  const tearCount = 5
  
  for (let i = 0; i < tearCount; i++) {
    const tear = document.createElement('div')
    tear.className = 'reality-tear'
    
    // Posición aleatoria en los bordes
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    const position = Math.random() * 100
    
    let positionStyles = ''
    switch(side) {
      case 0: // top
        positionStyles = `top: 0; left: ${position}%; width: 2px; height: 30vh;`
        break
      case 1: // right
        positionStyles = `right: 0; top: ${position}%; width: 30vw; height: 2px;`
        break
      case 2: // bottom
        positionStyles = `bottom: 0; left: ${position}%; width: 2px; height: 30vh;`
        break
      case 3: // left
        positionStyles = `left: 0; top: ${position}%; width: 30vw; height: 2px;`
        break
    }
    
    tear.style.cssText = `
      position: fixed;
      ${positionStyles}
      background: linear-gradient(
        ${side % 2 === 0 ? '0deg' : '90deg'}, 
        transparent 0%, 
        rgba(0, 255, 255, 0.8) 50%, 
        transparent 100%
      );
      z-index: 9998;
      animation: realityTearPulse 2s ease-in-out;
      filter: blur(1px);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
    `
    
    document.body.appendChild(tear)
    
    setTimeout(() => {
      tear.remove()
    }, 2000)
  }
}

// CSS para Reality Tears
const realityTearCSS = `
@keyframes realityTearPulse {
  0% {
    opacity: 0;
    transform: scaleY(0);
    filter: blur(3px);
  }
  20% {
    opacity: 1;
    transform: scaleY(1);
    filter: blur(1px);
  }
  80% {
    opacity: 1;
    transform: scaleY(1);
    filter: blur(1px);
  }
  100% {
    opacity: 0;
    transform: scaleY(0);
    filter: blur(3px);
  }
}
`
```

## 🔄 Transiciones entre Páginas

### Teletransporte Effect
```javascript
// Efecto de teletransporte para cambios de ruta
const initiateTeleportEffect = (el) => {
  // Crear círculo de energía
  const energyCircle = document.createElement('div')
  energyCircle.className = 'teleport-energy-circle'
  energyCircle.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border: 3px solid rgba(0, 255, 255, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    animation: teleportExpand 0.6s ease-out forwards;
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.8),
      inset 0 0 20px rgba(0, 255, 255, 0.3);
  `
  
  document.body.appendChild(energyCircle)
  
  // Efecto de implosión después de la expansión
  setTimeout(() => {
    energyCircle.style.animation = 'teleportImplode 0.3s ease-in forwards'
    
    setTimeout(() => {
      energyCircle.remove()
    }, 300)
  }, 600)
  
  // Crear ondas de choque
  createShockwaves()
}

// Ondas de choque concéntricas
const createShockwaves = () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const shockwave = document.createElement('div')
      shockwave.className = 'cyber-shockwave'
      shockwave.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border: 1px solid rgba(0, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        animation: shockwaveExpand 1s ease-out forwards;
      `
      
      document.body.appendChild(shockwave)
      
      setTimeout(() => {
        shockwave.remove()
      }, 1000)
    }, i * 200)
  }
}

// CSS para efectos de teletransporte
const teleportCSS = `
@keyframes teleportExpand {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  70% {
    width: 150vw;
    height: 150vw;
    opacity: 0.8;
  }
  100% {
    width: 200vw;
    height: 200vw;
    opacity: 0.3;
  }
}

@keyframes teleportImplode {
  0% {
    width: 200vw;
    height: 200vw;
    opacity: 0.3;
  }
  100% {
    width: 0;
    height: 0;
    opacity: 0;
  }
}

@keyframes shockwaveExpand {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 300vw;
    height: 300vw;
    opacity: 0;
  }
}
`
```

## 🎨 Hover Effects Exclusivos

### Cyber Button Interactions
```css
/* Efectos hover solo en tema Cyber */
[data-theme="cyber"] .interactive-element {
  position: relative;
  overflow: hidden;
}

[data-theme="cyber"] .interactive-element::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(0, 255, 255, 0.4), 
    transparent
  );
  transition: left 0.5s ease;
  z-index: 1;
}

[data-theme="cyber"] .interactive-element:hover::before {
  left: 100%;
}

/* Glow effect en hover */
[data-theme="cyber"] .interactive-element:hover {
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.6),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
  transform: translateY(-2px);
}
```

### Cyber Card Animations
```css
[data-theme="cyber"] .card {
  position: relative;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  transition: all 0.3s ease;
}

[data-theme="cyber"] .card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: rgba(0, 255, 255, 0.8);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(0, 255, 255, 0.3);
}

/* Efecto de escaneo */
[data-theme="cyber"] .card::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 255, 0.1) 50%,
    transparent 100%
  );
  transition: top 0.6s ease;
}

[data-theme="cyber"] .card:hover::after {
  top: 100%;
}
```

## ⚙️ Performance y Optimizaciones

### GPU Acceleration
```css
/* Force GPU layers para animaciones cyber */
[data-theme="cyber"] .animated-element {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform, opacity, filter;
}
```

### Conditional Loading
```javascript
// Cargar animaciones cyber solo cuando es necesario
const loadCyberAnimations = () => {
  if (!document.querySelector('#cyber-animations-css')) {
    const style = document.createElement('style')
    style.id = 'cyber-animations-css'
    style.textContent = cyberAnimationsCSS
    document.head.appendChild(style)
  }
}

// Cleanup cuando cambia de tema
const unloadCyberAnimations = () => {
  const style = document.querySelector('#cyber-animations-css')
  if (style) {
    style.remove()
  }
  
  // Limpiar partículas activas
  document.querySelectorAll('.quantum-transition-particle, .reality-tear').forEach(el => {
    el.remove()
  })
}

// Watch theme changes
watch(isCyber, (newValue) => {
  if (newValue) {
    loadCyberAnimations()
  } else {
    unloadCyberAnimations()
  }
})
```

### Mobile Optimization
```javascript
// Reducir efectos en móvil para Cyber theme
const getCyberEffectIntensity = () => {
  const width = window.innerWidth
  const isLowEnd = width < 480
  const isMobile = width < 768
  
  return {
    particles: isLowEnd ? 8 : isMobile ? 15 : 30,
    tears: isLowEnd ? 2 : isMobile ? 3 : 5,
    duration: isLowEnd ? 0.4 : isMobile ? 0.6 : 0.8,
    enableShockwaves: !isLowEnd
  }
}
```

## 🎯 Integración con Vue Router

### Transition Hooks
```javascript
// App.vue - Router transitions con efectos cyber
const router = useRouter()

router.beforeEach((to, from, next) => {
  if (isCyber.value) {
    // Preparar efectos de salida
    document.body.classList.add('cyber-transition-out')
  }
  next()
})

router.afterEach((to, from) => {
  if (isCyber.value) {
    nextTick(() => {
      // Efectos de entrada
      document.body.classList.remove('cyber-transition-out')
      document.body.classList.add('cyber-transition-in')
      
      // Activar efectos
      createQuantumParticles(document.body)
      
      setTimeout(() => {
        document.body.classList.remove('cyber-transition-in')
      }, 1000)
    })
  }
})
```

### Route-specific Animations
```css
/* Animaciones específicas por ruta en Cyber theme */
[data-theme="cyber"] .route-dashboard-enter-active {
  animation: dashboardCyberEnter 0.8s ease-out;
}

[data-theme="cyber"] .route-finanzas-enter-active {
  animation: finanzasCyberEnter 0.8s ease-out;
}

@keyframes dashboardCyberEnter {
  0% {
    opacity: 0;
    transform: rotateY(-90deg) scale(0.8);
    filter: hue-rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) scale(1);
    filter: hue-rotate(360deg);
  }
}
```

## ✅ Características Exclusivas Implementadas

### ⚡ Efectos de Entrada
- [x] Cyber App Enter optimizado (0.8s, sin lag)
- [x] Expansión de ondas cuánticas
- [x] 30 partículas cuánticas en desktop, 15 en móvil
- [x] Filtros de color dinámicos (hue-rotate)

### 🌌 Transiciones entre Páginas
- [x] Efecto de teletransporte con círculos de energía
- [x] Reality tears en bordes de pantalla (5 distorsiones)
- [x] Ondas de choque concéntricas
- [x] Cleanup automático de elementos

### 🎨 Interacciones Exclusivas
- [x] Hover effects con barrido de luz
- [x] Card scanning animations
- [x] Glow effects en elementos interactivos
- [x] Theme toggle con animación cyber-glow

### ⚙️ Optimizaciones
- [x] GPU acceleration en todos los elementos animados
- [x] Conditional loading/unloading de CSS
- [x] Mobile-responsive particle counts
- [x] Performance monitoring y cleanup

---

**Resultado**: Sistema completo de animaciones exclusivas para Cyber theme que proporciona una experiencia futurística inmersiva sin comprometer el rendimiento. ¡Del futuro venimos! ⚡🚀