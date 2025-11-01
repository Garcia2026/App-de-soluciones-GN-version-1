<template>
  <!-- iOS-style Modal Overlay -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="ios-modal">
      <!-- iOS-style Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Nuevo Proyecto</h2>
          <p class="text-sm text-gray-600 mt-1">Crea un proyecto para gestionar ingresos y gastos</p>
        </div>
        <button
          @click="$emit('close')"
          class="ios-close-btn"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- iOS-style Form -->
      <form @submit.prevent="handleSubmit" class="space-y-16">
        <!-- Nombre del Proyecto -->
        <div class="ios-form-group">
          <label class="ios-label">
            Nombre del Proyecto *
          </label>
          <input
            v-model="formData.nombre"
            type="text"
            required
            class="ios-input"
            placeholder="Ej: Instalación de jardín residencial"
          />
        </div>

        <!-- Monto Total a Facturar (CON IVA) -->
        <div class="ios-form-group-large">
          <label class="ios-label-large">
            Monto Total a Facturar (con IVA incluido) *
          </label>
          <p class="text-sm text-gray-600 mb-6">Ingresa el monto total que le cobrarás al cliente</p>
          <div class="relative">
            <span class="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-xl">$</span>
            <input
              v-model.number="formData.montoTotal"
              type="number"
              step="0.01"
              min="0"
              required
              class="ios-input-large pl-12 text-xl font-bold"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Grid de inputs adicionales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div class="ios-form-group">
            <label class="ios-label">
              Tiempo de Crédito (días)
            </label>
            <p class="text-xs text-gray-600 mb-3">Días para pago después de facturar</p>
            <input
              v-model.number="formData.tiempoCredito"
              type="number"
              min="0"
              class="ios-input"
              placeholder="30"
            />
          </div>

          <div class="ios-form-group">
            <label class="ios-label">
              Anticipos Recibidos
            </label>
            <p class="text-xs text-gray-600 mb-3">Dinero que ya recibiste por adelantado</p>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                v-model.number="formData.anticipos"
                type="number"
                step="0.01"
                min="0"
                class="ios-input pl-10"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Notas -->
        <div class="ios-form-group">
          <label class="ios-label">
            Notas adicionales
          </label>
          <p class="text-sm text-gray-600 mb-4">Detalles importantes sobre el proyecto</p>
          <textarea
            v-model="formData.notas"
            class="ios-textarea"
            rows="5"
            placeholder="Ej: Incluye materiales, mano de obra, diseño personalizado..."
          ></textarea>
        </div>

        <!-- iOS-style Calculations Preview -->
        <div v-if="formData.montoTotal > 0" class="ios-calculations-card">
          <h3 class="text-lg font-bold text-gray-900 mb-4">💰 Desglose Financiero</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="ios-calc-item">
              <span class="text-gray-600 text-sm font-medium">Total al Cliente</span>
              <span class="text-lg font-bold text-blue-600">{{ formatCurrency(formData.montoTotal) }}</span>
            </div>
            <div class="ios-calc-item">
              <span class="text-gray-600 text-sm font-medium">Monto sin IVA</span>
              <span class="text-lg font-bold text-gray-900">{{ formatCurrency(calculos.montoSinIva) }}</span>
            </div>
            <div class="ios-calc-item">
              <span class="text-gray-600 text-sm font-medium">IVA (12%)</span>
              <span class="text-lg font-bold text-orange-600">{{ formatCurrency(calculos.iva) }}</span>
            </div>
            <div class="ios-calc-item">
              <span class="text-gray-600 text-sm font-medium">ISR (7% s/subtotal)</span>
              <span class="text-lg font-bold text-red-600">{{ formatCurrency(calculos.isr) }}</span>
            </div>
          </div>
          <div class="ios-calc-total">
            <span class="text-gray-600 font-medium">💚 Tu Ganancia Neta</span>
            <span class="text-2xl font-bold text-green-600">{{ formatCurrency(calculos.gananciaNeta) }}</span>
          </div>
        </div>

        <!-- iOS-style Action Buttons -->
        <div class="flex gap-4 pt-10">
          <button
            type="button"
            @click="$emit('close')"
            class="ios-btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="ios-btn-primary flex-1"
          >
            Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits(['close', 'save'])

// Datos reactivos
const formData = ref({
  nombre: '',
  montoTotal: 0, // Cambio: ahora es el monto total con IVA incluido
  tiempoCredito: 30,
  anticipos: 0,
  notas: ''
})

// Computed - Cálculo correcto del IVA
const calculos = computed(() => {
  const montoTotal = formData.value.montoTotal || 0

  // Fórmula correcta: MontoSinIVA = MontoTotal ÷ 1.12
  const montoSinIva = montoTotal / 1.12
  // IVA = MontoSinIVA × 0.12 (no MontoTotal - MontoSinIVA)
  const iva = montoSinIva * 0.12

  // ISR se calcula sobre el monto sin IVA
  const isr = montoSinIva * 0.07

  // Ganancia neta = monto sin IVA - ISR
  const gananciaNeta = montoSinIva - isr

  return {
    montoSinIva,
    iva,
    isr,
    gananciaNeta
  }
})

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const handleSubmit = () => {
  if (!formData.value.nombre || formData.value.montoTotal <= 0) return

  const proyecto = {
    nombre: formData.value.nombre,
    montoFacturar: calculos.value.montoSinIva, // Guardamos el monto sin IVA para compatibilidad
    montoTotal: formData.value.montoTotal, // Nuevo campo para el monto total
    iva: calculos.value.iva,
    isr: calculos.value.isr,
    gananciaNeta: calculos.value.gananciaNeta,
    tiempoCredito: formData.value.tiempoCredito,
    anticipos: formData.value.anticipos,
    estado: 'activo',
    notas: formData.value.notas,
    gastos: [] // <-- AÑADIR ESTA LÍNEA
  }

  emit('save', proyecto)

  // Reset form
  formData.value = {
    nombre: '',
    montoTotal: 0,
    tiempoCredito: 30,
    anticipos: 0,
    notas: ''
  }
}
</script>

<style scoped>
/* iOS Corporate Modal Styles */

.ios-modal {
  @apply bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto px-10 py-12;
  animation: ios-modal-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes ios-modal-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* iOS-style Close Button */
.ios-close-btn {
  @apply p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-close-btn:hover {
  transform: scale(1.1);
}

.ios-close-btn:active {
  transform: scale(0.95);
}

/* iOS-style Form Elements */
.ios-form-group {
  @apply space-y-4;
}

.ios-form-group-large {
  @apply space-y-6;
}

.ios-label {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

.ios-label-large {
  @apply block text-base font-bold text-gray-800 mb-3;
}

.ios-input {
  @apply w-full px-5 py-5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px; /* Prevent zoom on iOS */
}

.ios-input:hover {
  @apply bg-gray-50 border-gray-300;
}

.ios-input-large {
  @apply w-full px-6 py-6 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500;
  @apply focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
}

.ios-input-large:hover {
  @apply bg-gray-50 border-gray-300;
}

.ios-textarea {
  @apply w-full px-5 py-5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 resize-none;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px; /* Prevent zoom on iOS */
}

.ios-textarea:hover {
  @apply bg-gray-50 border-gray-300;
}

/* iOS-style Calculations Card */
.ios-calculations-card {
  @apply bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50;
  animation: ios-calculations-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes ios-calculations-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ios-calc-item {
  @apply flex flex-col space-y-1 p-3 bg-white/60 rounded-xl border border-gray-100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-calc-item:hover {
  @apply bg-white/80 border-gray-200 shadow-sm;
  transform: translateY(-2px);
}

.ios-calc-total {
  @apply flex items-center justify-between p-4 mt-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200;
}

/* iOS-style Buttons */
.ios-btn-primary {
  @apply inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-btn-primary:hover {
  @apply bg-blue-700 shadow-xl;
  transform: translateY(-2px) scale(1.02);
}

.ios-btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.ios-btn-secondary {
  @apply inline-flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl border border-gray-200;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-btn-secondary:hover {
  @apply bg-gray-200 text-gray-900 border-gray-300 shadow-md;
  transform: translateY(-1px);
}

.ios-btn-secondary:active {
  transform: translateY(0) scale(0.98);
}

/* Responsive Design */
@media (max-width: 768px) {
  .ios-modal {
    @apply rounded-2xl p-6 mx-2;
  }

  .ios-input, .ios-textarea {
    @apply rounded-lg py-3;
  }

  .ios-btn-primary, .ios-btn-secondary {
    @apply rounded-xl py-3 text-sm;
  }

  .ios-calculations-card {
    @apply rounded-xl p-4;
  }

  .ios-calc-item {
    @apply rounded-lg p-2;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-modal {
    @apply bg-gray-900/95 border-gray-700/30;
  }

  .ios-input, .ios-textarea {
    @apply bg-gray-800/50 border-gray-700/30 text-white placeholder-gray-400;
  }

  .ios-input:focus, .ios-textarea:focus {
    @apply bg-gray-800/80 border-gray-600;
  }

  .ios-calculations-card {
    @apply bg-gray-800/50 border-gray-700/30;
  }

  .ios-calc-item {
    @apply bg-gray-700/50 border-gray-600/30;
  }

  .ios-calc-total {
    @apply bg-gray-700/50 border-gray-600/30;
  }
}
</style>