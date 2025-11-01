<template>
  <div 
    v-show="isVisible"
    class="fixed inset-0 z-[9999] flex items-center justify-center splash-container"
    :class="{ 'fade-out': !isVisible }"
  >
    <!-- Background ULTRA-futurista -->
    <div class="absolute inset-0 cyber-bg overflow-hidden">
      <!-- Matrix Code Rain -->
      <div class="matrix-container">
        <div 
          v-for="i in 30" 
          :key="`matrix-${i}`"
          class="matrix-column"
          :style="getMatrixStyle(i)"
        >
          <div 
            v-for="j in 20" 
            :key="`code-${i}-${j}`"
            class="matrix-char"
            :style="{ animationDelay: (j * 0.1) + 's' }"
          >
            {{ getRandomChar() }}
          </div>
        </div>
      </div>
      
      <!-- Portal interdimensional -->
      <div class="portal-container">
        <div class="portal-ring portal-ring-1"></div>
        <div class="portal-ring portal-ring-2"></div>
        <div class="portal-ring portal-ring-3"></div>
        <div class="portal-core"></div>
      </div>
      
      <!-- ADN digital flotante -->
      <div class="dna-container">
        <div class="dna-strand dna-strand-1">
          <div v-for="i in 20" :key="`dna1-${i}`" class="dna-base" :style="{ animationDelay: (i * 0.2) + 's' }"></div>
        </div>
        <div class="dna-strand dna-strand-2">
          <div v-for="i in 20" :key="`dna2-${i}`" class="dna-base" :style="{ animationDelay: (i * 0.2 + 0.1) + 's' }"></div>
        </div>
      </div>
      
      <!-- Ondas cuánticas -->
      <div class="quantum-waves">
        <div class="quantum-wave wave-1"></div>
        <div class="quantum-wave wave-2"></div>
        <div class="quantum-wave wave-3"></div>
        <div class="quantum-wave wave-4"></div>
      </div>
      
      <!-- Partículas de alta tecnología -->
      <div class="tech-particles">
        <div 
          v-for="i in 100" 
          :key="`tech-${i}`"
          class="tech-particle"
          :style="getTechParticleStyle(i)"
        ></div>
      </div>
      
      <!-- Grid hexagonal -->
      <div class="hex-grid"></div>
      
      <!-- Rayos láser -->
      <div class="laser-beams">
        <div class="laser-beam beam-1"></div>
        <div class="laser-beam beam-2"></div>
        <div class="laser-beam beam-3"></div>
        <div class="laser-beam beam-4"></div>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="relative z-10 text-center px-6">
      <!-- HOLOGRAMA 3D ÉPICO -->
      <div class="mb-8 logo-container">
        <!-- Scanner ocular -->
        <div class="eye-scanner">
          <div class="scanner-eye"></div>
          <div class="scanner-beam"></div>
        </div>
        
        <div class="hologram-projector perspective-3d">
          <!-- Proyector base -->
          <div class="projector-base">
            <div class="projector-light"></div>
          </div>
          
          <!-- Logo holográfico 3D -->
          <div class="logo-hologram">
            <div class="hologram-layer layer-1">
              <span class="hologram-text gradient-rainbow">GN</span>
            </div>
            <div class="hologram-layer layer-2">
              <span class="hologram-text gradient-iridescent">GN</span>
            </div>
            <div class="hologram-layer layer-3">
              <span class="hologram-text gradient-cosmic">GN</span>
            </div>
          </div>
          
          <!-- Partículas de datos -->
          <div class="data-particles">
            <div v-for="i in 50" :key="`data-${i}`" class="data-particle" :style="getDataParticleStyle(i)"></div>
          </div>
          
          <!-- Campo de fuerza -->
          <div class="force-field">
            <div class="field-layer field-1"></div>
            <div class="field-layer field-2"></div>
            <div class="field-layer field-3"></div>
          </div>
        </div>
        
        <!-- Anillos orbitales cuánticos -->
        <div class="quantum-rings">
          <div class="quantum-ring ring-1">
            <div class="ring-particle particle-1"></div>
            <div class="ring-particle particle-2"></div>
            <div class="ring-particle particle-3"></div>
          </div>
          <div class="quantum-ring ring-2">
            <div class="ring-particle particle-1"></div>
            <div class="ring-particle particle-2"></div>
            <div class="ring-particle particle-3"></div>
          </div>
          <div class="quantum-ring ring-3">
            <div class="ring-particle particle-1"></div>
            <div class="ring-particle particle-2"></div>
            <div class="ring-particle particle-3"></div>
          </div>
        </div>
        
        <!-- Efectos de teletransporte -->
        <div class="teleport-effects">
          <div class="teleport-ring ring-1"></div>
          <div class="teleport-ring ring-2"></div>
          <div class="teleport-ring ring-3"></div>
          <div class="teleport-beam"></div>
        </div>
      </div>
      
      <!-- TEXTO ULTRA FUTURISTA -->
      <div class="text-container">
        <!-- Título principal con efectos épicos -->
        <div class="title-wrapper">
          <h1 class="cyber-title">
            <span class="glitch-text" data-text="SISTEMAS GN">SISTEMAS GN</span>
          </h1>
          <div class="title-effects">
            <div class="title-glow"></div>
            <div class="title-scan"></div>
          </div>
        </div>
        
        <!-- Subtítulo con terminal effect -->
        <div class="terminal-container">
          <div class="terminal-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <div class="terminal-body">
            <span class="terminal-prompt">root@gn-systems:~$</span>
            <span class="typing-text">{{ loadingText }}</span>
            <span class="cursor">█</span>
          </div>
        </div>
        
        <!-- Códigos binarios flotantes -->
        <div class="binary-stream">
          <div v-for="i in 10" :key="`binary-${i}`" class="binary-code" :style="getBinaryStyle(i)">
            {{ getBinaryCode() }}
          </div>
        </div>
        
        <!-- Ondas de sonido visuales -->
        <div class="sound-waves">
          <div class="sound-wave wave-1"></div>
          <div class="sound-wave wave-2"></div>
          <div class="sound-wave wave-3"></div>
          <div class="sound-wave wave-4"></div>
          <div class="sound-wave wave-5"></div>
        </div>
      </div>
      
      <!-- BARRA DE PROGRESO ULTRA ÉPICA -->
      <div class="progress-container">
        <!-- Medidor de energía -->
        <div class="energy-meter">
          <div class="meter-frame">
            <div class="meter-bars">
              <div v-for="i in 20" :key="`bar-${i}`" class="meter-bar" :class="{ active: i <= Math.floor(progress / 5) }"></div>
            </div>
            <div class="meter-spark" :style="{ left: progress + '%' }"></div>
          </div>
          <div class="meter-label">QUANTUM CORE ACTIVATION</div>
        </div>
        
        <!-- Círculo de progreso holográfico -->
        <div class="holographic-progress">
          <svg class="progress-ring" width="120" height="120">
            <circle
              class="progress-ring-background"
              cx="60"
              cy="60"
              r="54"
            />
            <circle
              class="progress-ring-progress"
              cx="60"
              cy="60"
              r="54"
              :stroke-dasharray="`${2 * Math.PI * 54}`"
              :stroke-dashoffset="`${2 * Math.PI * 54 * (1 - progress / 100)}`"
            />
          </svg>
          <div class="progress-center">
            <div class="progress-percentage">{{ progress }}%</div>
            <div class="progress-status">{{ getStatusText(progress) }}</div>
          </div>
        </div>
        
        <!-- Flujo de datos -->
        <div class="data-flow">
          <div v-for="i in 15" :key="`flow-${i}`" class="data-packet" :style="getDataFlowStyle(i)"></div>
        </div>
        
        <!-- Radar scanner -->
        <div class="radar-scanner">
          <div class="radar-grid">
            <div class="radar-circle circle-1"></div>
            <div class="radar-circle circle-2"></div>
            <div class="radar-circle circle-3"></div>
            <div class="radar-line line-1"></div>
            <div class="radar-line line-2"></div>
          </div>
          <div class="radar-sweep"></div>
          <div class="radar-blip blip-1"></div>
          <div class="radar-blip blip-2"></div>
          <div class="radar-blip blip-3"></div>
        </div>
        
        <!-- Sistema de coordenadas -->
        <div class="coordinate-system">
          <div class="coord-text">COORDINATES: [{{ Math.floor(progress * 2.5) }}, {{ Math.floor(progress * 1.8) }}, {{ Math.floor(progress * 3.2) }}]</div>
          <div class="coord-text">VECTOR: {{ Math.floor(progress * 0.01 * 360) }}°</div>
          <div class="coord-text">QUANTUM STATE: {{ progress > 50 ? 'STABLE' : 'INITIALIZING' }}</div>
        </div>
      </div>
    </div>
    
    <!-- Overlay de desvanecimiento -->
    <div 
      class="absolute inset-0 bg-gray-900 transition-opacity duration-1000"
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const isVisible = ref(true)
const progress = ref(0)
const loadingStep = ref(0)

const loadingTexts = [
  'INITIALIZING QUANTUM CORE...',
  'SCANNING NEURAL NETWORKS...',
  'CALIBRATING HOLOGRAPHIC MATRIX...',
  'SYNCHRONIZING TEMPORAL FLUX...',
  'LOADING CYBERNETIC PROTOCOLS...',
  'ACTIVATING AI CONSCIOUSNESS...',
  'ESTABLISHING DIMENSIONAL LINK...',
  'QUANTUM SYSTEMS ONLINE'
]

const loadingText = computed(() => loadingTexts[loadingStep.value] || 'CARGANDO SISTEMAS GN')

const emit = defineEmits(['loaded'])

// Generar caracteres Matrix
const getRandomChar = () => {
  const chars = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?'
  return chars[Math.floor(Math.random() * chars.length)]
}

// Generar código binario
const getBinaryCode = () => {
  let binary = ''
  for (let i = 0; i < 8; i++) {
    binary += Math.floor(Math.random() * 2)
  }
  return binary
}

// Estilos para Matrix
const getMatrixStyle = (index) => {
  return {
    left: (index * 3.33) + '%',
    animationDelay: Math.random() * 2 + 's',
    animationDuration: Math.random() * 3 + 2 + 's'
  }
}

// Estilos para partículas tech
const getTechParticleStyle = (index) => {
  const size = Math.random() * 2 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const animationDelay = Math.random() * 5
  const animationDuration = Math.random() * 4 + 3
  
  return {
    left: left + '%',
    top: top + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: animationDelay + 's',
    animationDuration: animationDuration + 's'
  }
}

// Estilos para partículas de datos
const getDataParticleStyle = (index) => {
  const angle = (index / 50) * 360
  const radius = 80 + Math.random() * 40
  return {
    transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
    animationDelay: (index * 0.1) + 's'
  }
}

// Estilos para código binario
const getBinaryStyle = (index) => {
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    animationDuration: Math.random() * 2 + 3 + 's'
  }
}

// Estilos para flujo de datos
const getDataFlowStyle = (index) => {
  return {
    left: (index * 6.66) + '%',
    animationDelay: Math.random() * 2 + 's',
    animationDuration: Math.random() * 2 + 1.5 + 's'
  }
}

// Texto de estado
const getStatusText = (progress) => {
  if (progress < 20) return 'INIT'
  if (progress < 40) return 'SCAN'
  if (progress < 60) return 'CALIB'
  if (progress < 80) return 'SYNC'
  if (progress < 100) return 'READY'
  return 'ONLINE'
}

onMounted(() => {
  let currentProgress = 0
  let currentStep = 0
  
  const progressInterval = setInterval(() => {
    currentProgress += Math.random() * 15 + 5
    
    if (currentProgress >= 100) {
      currentProgress = 100
      progress.value = 100
      loadingStep.value = 4 // "SISTEMAS LISTOS"
      
      setTimeout(() => {
        isVisible.value = false
        setTimeout(() => {
          emit('loaded')
        }, 1000) // Esperar la animación de fade out
      }, 500)
      
      clearInterval(progressInterval)
    } else {
      progress.value = Math.min(currentProgress, 100)
      
      // Cambiar texto basado en progreso
      if (currentProgress >= 20 && currentStep === 0) {
        currentStep = 1
        loadingStep.value = 1
      } else if (currentProgress >= 40 && currentStep === 1) {
        currentStep = 2
        loadingStep.value = 2
      } else if (currentProgress >= 70 && currentStep === 2) {
        currentStep = 3
        loadingStep.value = 3
      }
    }
  }, 100)
})
</script>

<style scoped>
/* ========================================== */
/* SPLASH SCREEN ULTRA-FUTURISTA NIVEL DIOS */
/* ========================================== */

.splash-container {
  background: radial-gradient(ellipse at center, #000011 0%, #000000 70%);
  overflow: hidden;
  position: relative;
}

/* MATRIX CODE RAIN */
.matrix-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.matrix-column {
  position: absolute;
  top: -100px;
  width: 20px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #00ff41;
  animation: matrixFall linear infinite;
  text-shadow: 0 0 5px #00ff41;
}

.matrix-char {
  display: block;
  line-height: 1.2;
  animation: matrixFlicker 0.5s ease-in-out infinite alternate;
}

@keyframes matrixFall {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}

@keyframes matrixFlicker {
  0% { opacity: 1; color: #00ff41; }
  50% { opacity: 0.3; color: #008f11; }
  100% { opacity: 1; color: #00ff41; }
}

/* PORTAL INTERDIMENSIONAL */
.portal-container {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 150px;
  height: 150px;
  z-index: 2;
}

.portal-ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  animation: portalSpin linear infinite;
}

.portal-ring-1 {
  width: 150px;
  height: 150px;
  border-color: #ff0080;
  animation-duration: 3s;
  box-shadow: 0 0 20px #ff0080;
}

.portal-ring-2 {
  width: 100px;
  height: 100px;
  top: 25px;
  left: 25px;
  border-color: #00ffff;
  animation-duration: 2s;
  animation-direction: reverse;
  box-shadow: 0 0 15px #00ffff;
}

.portal-ring-3 {
  width: 50px;
  height: 50px;
  top: 50px;
  left: 50px;
  border-color: #ffff00;
  animation-duration: 1s;
  box-shadow: 0 0 10px #ffff00;
}

.portal-core {
  position: absolute;
  top: 65px;
  left: 65px;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #ffffff 0%, #ff0080 100%);
  border-radius: 50%;
  animation: portalPulse 1s ease-in-out infinite alternate;
}

@keyframes portalSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes portalPulse {
  0% { transform: scale(1); box-shadow: 0 0 10px #ffffff; }
  100% { transform: scale(1.5); box-shadow: 0 0 30px #ff0080; }
}

/* ADN DIGITAL */
.dna-container {
  position: absolute;
  top: 20%;
  left: 5%;
  width: 100px;
  height: 300px;
  z-index: 2;
}

.dna-strand {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, #00ff41, #0080ff);
  animation: dnaRotate 4s linear infinite;
}

.dna-strand-1 {
  left: 20px;
  transform-origin: 50% 50%;
}

.dna-strand-2 {
  right: 20px;
  animation-direction: reverse;
  transform-origin: 50% 50%;
}

.dna-base {
  position: absolute;
  width: 40px;
  height: 2px;
  background: #ff0080;
  animation: dnaGlow 2s ease-in-out infinite alternate;
}

@keyframes dnaRotate {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes dnaGlow {
  0% { box-shadow: 0 0 5px #ff0080; }
  100% { box-shadow: 0 0 20px #ff0080; }
}

/* ONDAS CUÁNTICAS */
.quantum-waves {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.quantum-wave {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  animation: quantumExpand 3s ease-out infinite;
}

.wave-1 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  margin: -100px 0 0 -100px;
  border-color: rgba(0, 255, 255, 0.3);
  animation-delay: 0s;
}

.wave-2 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -200px;
  border-color: rgba(255, 0, 128, 0.2);
  animation-delay: 1s;
}

.wave-3 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  margin: -300px 0 0 -300px;
  border-color: rgba(0, 255, 65, 0.1);
  animation-delay: 2s;
}

.wave-4 {
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  margin: -400px 0 0 -400px;
  border-color: rgba(255, 255, 0, 0.1);
  animation-delay: 2.5s;
}

@keyframes quantumExpand {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* PARTÍCULAS TECH */
.tech-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.tech-particle {
  position: absolute;
  background: #00ffff;
  border-radius: 50%;
  animation: techFloat ease-in-out infinite;
  box-shadow: 0 0 10px #00ffff;
}

@keyframes techFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.5;
  }
}

/* GRID HEXAGONAL */
.hex-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 0, 128, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: hexMove 10s linear infinite;
}

@keyframes hexMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* RAYOS LÁSER */
.laser-beams {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.laser-beam {
  position: absolute;
  width: 2px;
  height: 100vh;
  background: linear-gradient(to bottom, transparent, #ff0080, transparent);
  animation: laserMove 2s ease-in-out infinite;
}

.beam-1 { left: 20%; animation-delay: 0s; }
.beam-2 { left: 40%; animation-delay: 0.5s; }
.beam-3 { left: 60%; animation-delay: 1s; }
.beam-4 { left: 80%; animation-delay: 1.5s; }

@keyframes laserMove {
  0%, 100% { 
    opacity: 0; 
    transform: translateY(-100vh);
  }
  50% { 
    opacity: 1; 
    transform: translateY(100vh);
  }
}

/* BACKGROUND CYBER */
.cyber-bg {
  background: radial-gradient(ellipse at center, #000033 0%, #000000 70%);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 0, 128, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: bgMove 20s linear infinite;
}

@keyframes bgMove {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 50px 50px, -50px -50px; }
}

/* HOLOGRAMA SIMPLIFICADO */
.hologram-projector {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.projector-base {
  width: 40px;
  height: 20px;
  background: linear-gradient(135deg, #333, #666);
  border-radius: 20px;
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.projector-light {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #00ffff, transparent);
  border-radius: 50%;
  animation: projectorPulse 1s ease-in-out infinite alternate;
}

@keyframes projectorPulse {
  0% { transform: translateX(-50%) scale(1); }
  100% { transform: translateX(-50%) scale(1.5); }
}

.logo-hologram {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: logoFloat 3s ease-in-out infinite;
}

.hologram-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hologram-text {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(45deg, #00ffff, #ff0080, #ffff00, #00ffff);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.8));
  animation: hologramShimmer 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-10px) rotateY(180deg); }
}

@keyframes hologramShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* SCANNER OCULAR */
.eye-scanner {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  z-index: 5;
}

.scanner-eye {
  width: 60px;
  height: 30px;
  background: radial-gradient(ellipse, #ff0000 0%, #660000 70%, transparent 100%);
  border-radius: 50px;
  animation: eyeGlow 2s ease-in-out infinite alternate;
  box-shadow: 0 0 20px #ff0000;
}

.scanner-beam {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, #ff0000, transparent);
  animation: scanBeam 3s ease-in-out infinite;
}

@keyframes eyeGlow {
  0% { box-shadow: 0 0 20px #ff0000; }
  100% { box-shadow: 0 0 40px #ff0000; }
}

@keyframes scanBeam {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* TEXTO CYBER */
.cyber-title {
  position: relative;
  display: inline-block;
  margin: 0;
}

.glitch-text {
  font-size: 2.5rem;
  font-weight: 900;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  display: inline-block;
  animation: glitchPrimary 3s ease-in-out infinite;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 40px #00ffff;
}

@keyframes glitchPrimary {
  0%, 90%, 100% { transform: translateX(0); }
  92% { transform: translateX(-2px); }
  94% { transform: translateX(2px); }
  96% { transform: translateX(-1px); }
}

/* TERMINAL */
.terminal-container {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff41;
  border-radius: 10px;
  padding: 1rem;
  margin: 2rem 0;
  font-family: 'Courier New', monospace;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

.terminal-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: dotBlink 2s ease-in-out infinite;
}

.terminal-dot.red { background: #ff0000; }
.terminal-dot.yellow { background: #ffff00; animation-delay: 0.3s; }
.terminal-dot.green { background: #00ff00; animation-delay: 0.6s; }

@keyframes dotBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.terminal-body {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00ff41;
  font-size: 0.9rem;
}

.terminal-prompt {
  color: #ff0080;
  font-weight: bold;
}

.cursor {
  color: #00ff41;
  animation: cursorBlink 1s ease-in-out infinite;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* PROGRESO HOLOGRÁFICO */
.holographic-progress {
  position: relative;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
  animation: ringRotate 3s linear infinite;
}

.progress-ring-background {
  fill: none;
  stroke: rgba(0, 255, 255, 0.1);
  stroke-width: 3;
}

.progress-ring-progress {
  fill: none;
  stroke: #00ffff;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
  animation: progressGlow 2s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 5px #00ffff);
}

.progress-center {
  position: absolute;
  text-align: center;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
}

.progress-status {
  font-size: 0.7rem;
  color: #ff0080;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  margin-top: 0.2rem;
}

@keyframes ringRotate {
  0% { filter: hue-rotate(0deg) drop-shadow(0 0 5px #00ffff); }
  100% { filter: hue-rotate(360deg) drop-shadow(0 0 5px #00ffff); }
}

@keyframes progressGlow {
  0% { stroke: #00ffff; }
  100% { stroke: #ff0080; }
}

.fade-out {
  animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}

/* Partículas flotantes */
.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(var(--primary-color), 0.6);
  border-radius: 50%;
  animation: particleFloat infinite ease-in-out;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotateZ(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) rotateZ(360deg);
    opacity: 0;
  }
}

/* Rayos de energía */
.energy-rays {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.energy-ray {
  position: absolute;
  width: 2px;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(var(--primary-color), 0.8) 50%,
    transparent 100%
  );
  animation: energyRayMove 4s ease-in-out infinite;
}

.ray-1 {
  left: 20%;
  animation-delay: 0s;
}

.ray-2 {
  left: 50%;
  animation-delay: 1.5s;
}

.ray-3 {
  left: 80%;
  animation-delay: 3s;
}

@keyframes energyRayMove {
  0%, 100% { 
    opacity: 0; 
    transform: translateY(100vh);
  }
  50% { 
    opacity: 1; 
    transform: translateY(-100vh);
  }
}

/* Grid cibernético */
.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(var(--primary-color), 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-color), 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Logo principal */
.logo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-wrapper {
  position: relative;
  animation: logoFloat 3s ease-in-out infinite;
}

.logo-main {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transform-style: preserve-3d;
}

.logo-text {
  font-size: 3rem;
  font-weight: 900;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: textShimmer 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { 
    transform: translateY(0) rotateX(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotateX(5deg); 
  }
}

@keyframes textShimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
}

/* Anillos de energía */
.energy-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.energy-ring {
  position: absolute;
  border: 2px solid rgba(var(--primary-color), 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: energyRingPulse 2s ease-in-out infinite;
}

.ring-1 {
  width: 140px;
  height: 140px;
  animation-delay: 0s;
}

.ring-2 {
  width: 180px;
  height: 180px;
  animation-delay: 0.7s;
}

.ring-3 {
  width: 220px;
  height: 220px;
  animation-delay: 1.4s;
}

@keyframes energyRingPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* Texto principal */
.text-container {
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 
      0 0 20px rgba(var(--primary-color), 0.5),
      0 0 40px rgba(var(--primary-color), 0.3);
  }
  50% {
    text-shadow: 
      0 0 30px rgba(var(--primary-color), 0.8),
      0 0 60px rgba(var(--primary-color), 0.5);
  }
}

.subtitle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Dots de carga */
.loading-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(var(--primary-color), 0.8);
  animation: dotPulse 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Barra de progreso */
.progress-container {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  position: relative;
}

.progress-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: progressShine 1.5s ease-in-out infinite;
}

@keyframes progressShine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-glow {
  position: absolute;
  top: -2px;
  width: 8px;
  height: 8px;
  background: rgba(var(--primary-color), 0.8);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(var(--primary-color), 0.8);
  transition: left 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

/* Scanner line */
.scanner-line {
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--primary-color), 0.8) 50%,
    transparent 100%
  );
  animation: scannerMove 3s ease-in-out infinite;
}

@keyframes scannerMove {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* Responsive */
@media (max-width: 640px) {
  .main-title {
    font-size: 2rem;
  }
  
  .logo-main {
    width: 100px;
    height: 100px;
  }
  
  .logo-text {
    font-size: 2.5rem;
  }
}
</style>