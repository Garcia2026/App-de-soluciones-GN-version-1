<template>
  <Teleport to="body">
    <div
      v-if="showInstallPrompt"
      class="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm pointer-events-auto"
        @click="closeInstallPrompt"
      ></div>
      
      <!-- Install Banner -->
      <div
        class="relative bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl shadow-2xl max-w-sm w-full pointer-events-auto transform transition-all duration-500 ease-out"
        :class="showInstallPrompt ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
      >
        <!-- Close Button -->
        <button
          @click="closeInstallPrompt"
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="p-6">
          <!-- Icon and Title -->
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-white" viewBox="0 0 512 512" fill="currentColor">
                <circle cx="256" cy="256" r="240"/>
                <path d="M180 180 L180 332 L280 332 L280 280 L230 280 L230 240 L300 240 L300 180 Z" fill="#10b981"/>
                <path d="M320 180 L320 332 L360 332 L360 240 L400 332 L440 332 L440 180 L400 180 L400 272 L360 180 Z" fill="#10b981"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold">¡Instala GN Soluciones!</h3>
              <p class="text-emerald-100 text-sm">Acceso rápido desde tu pantalla de inicio</p>
            </div>
          </div>

          <!-- Features -->
          <div class="space-y-2 mb-6">
            <div class="flex items-center space-x-2 text-sm">
              <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Funciona sin conexión</span>
            </div>
            <div class="flex items-center space-x-2 text-sm">
              <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Actualizaciones automáticas</span>
            </div>
            <div class="flex items-center space-x-2 text-sm">
              <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Acceso instantáneo</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              @click="installPWA"
              class="flex-1 bg-white text-emerald-600 font-semibold py-3 px-4 rounded-xl hover:bg-emerald-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Instalar</span>
            </button>
            
            <button
              @click="closeInstallPrompt"
              class="px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors duration-200"
            >
              Después
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { usePWA } from '@/composables/usePWA';

const { showInstallPrompt, installPWA, closeInstallPrompt } = usePWA();
</script>