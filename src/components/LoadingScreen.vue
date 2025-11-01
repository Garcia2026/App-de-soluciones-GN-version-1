<template>
  <transition name="loader-fade">
    <div v-if="isVisible" class="loader-backdrop">
      <div class="loader-card">
        <div class="loader-logo">GN</div>
        <p class="loader-title">Sistema GN</p>
        <p class="loader-status">{{ statusText }}</p>
        <div class="loader-progress">
          <span class="loader-progress-bar" :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['loaded'])

const isVisible = ref(true)
const progress = ref(0)
const statusText = ref('Inicializando servicios...')

let animationFrameId = 0
const timers = new Set()

const prefersReducedMotion = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

const STATUS_STEPS = [
  { threshold: 0.3, text: 'Sincronizando datos...' },
  { threshold: 0.6, text: 'Cargando modulos...' },
  { threshold: 0.85, text: 'Aplicando configuracion...' }
]

const clearTimers = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  timers.forEach((id) => clearTimeout(id))
  timers.clear()
}

const finalizeLoader = () => {
  isVisible.value = false
  const timeout = setTimeout(() => emit('loaded'), prefersReducedMotion ? 80 : 180)
  timers.add(timeout)
}

onMounted(() => {
  const start = performance.now()
  const duration = prefersReducedMotion ? 600 : 1100
  let statusIndex = 0

  const step = (timestamp) => {
    const elapsed = timestamp - start
    const ratio = Math.min(elapsed / duration, 1)

    progress.value = Math.round(ratio * 100)

    if (statusIndex < STATUS_STEPS.length && ratio >= STATUS_STEPS[statusIndex].threshold) {
      statusText.value = STATUS_STEPS[statusIndex].text
      statusIndex += 1
    }

    if (ratio < 1) {
      animationFrameId = requestAnimationFrame(step)
    } else {
      finalizeLoader()
    }
  }

  animationFrameId = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<style scoped>
.loader-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at top, #02241b 0%, #010f0c 55%, #000807 100%);
  color: #f8fafc;
  padding: 1.5rem;
}

.loader-card {
  width: min(360px, 90vw);
  border-radius: 20px;
  padding: 2.25rem 2rem;
  background: rgba(3, 30, 24, 0.78);
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow:
    0 24px 48px rgba(1, 15, 12, 0.55),
    0 12px 24px rgba(16, 185, 129, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  text-align: center;
  backdrop-filter: blur(18px);
}

.loader-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 0.15em;
  color: #f8fafc;
  background: linear-gradient(135deg, #0f5132 0%, #1a9a6a 100%);
  box-shadow:
    0 10px 20px rgba(16, 185, 129, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.loader-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loader-status {
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.85);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.loader-progress {
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(15, 81, 50, 0.55);
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.loader-progress-bar {
  position: absolute;
  inset: 0;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #0ea873 0%, #0cd97b 100%);
  box-shadow: 0 0 16px rgba(12, 217, 123, 0.45);
  transition: width 0.18s ease-out;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .loader-card {
    padding: 1.8rem 1.5rem;
    border-radius: 18px;
  }

  .loader-logo {
    width: 56px;
    height: 56px;
    font-size: 1.3rem;
  }

  .loader-title {
    font-size: 1.2rem;
  }

  .loader-status {
    font-size: 0.9rem;
  }
}
</style>
