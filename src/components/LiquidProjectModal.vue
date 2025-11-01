<template>
  <div class="glass-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="glass-modal max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 🎨 Modal Header -->
      <div class="p-8 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-800">
              Nuevo Proyecto
            </h2>
            <p class="text-gray-800/80 mt-2">Crea un proyecto con cálculos automáticos de impuestos</p>
          </div>
          <button
            @click="$emit('close')"
            class="glass-light p-3 rounded-xl hover:bg-red-500/20 transition-all duration-300 group"
          >
            <XMarkIcon class="w-6 h-6 text-green-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>

      <!-- 🌊 Form Content -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        <!-- Project Name -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            Nombre del Proyecto *
          </label>
          <input
            v-model="formData.nombre"
            type="text"
            required
            class="glass-input text-gray-800 placeholder-gn-accent-500"
            placeholder="Ej: Instalación de jardín residencial premium"
          />
        </div>

        <!-- Amount to Invoice -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            Monto a Facturar (sin IVA) *
          </label>
          <div class="relative">
            <input
              v-model.number="formData.montoFacturar"
              type="number"
              step="0.01"
              min="0"
              required
              class="glass-input text-gray-800 placeholder-gn-accent-500 pl-12"
              placeholder="0.00"
            />
            <CurrencyDollarIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
          </div>
        </div>

        <!-- Credit Time and Advances Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="liquid-hover">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              <CalendarDaysIcon class="w-4 h-4 inline mr-2" />
              Tiempo de Crédito (días)
            </label>
            <input
              v-model.number="formData.tiempoCredito"
              type="number"
              min="0"
              class="glass-input text-gray-800"
            />
          </div>

          <div class="liquid-hover">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              <CurrencyDollarIcon class="w-4 h-4 inline mr-2" />
              Anticipos
            </label>
            <div class="relative">
              <input
                v-model.number="formData.anticipos"
                type="number"
                step="0.01"
                min="0"
                class="glass-input text-gray-800 placeholder-gn-accent-500 pl-12"
                placeholder="0.00"
              />
              <CurrencyDollarIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Project Notes -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            <DocumentTextIcon class="w-4 h-4 inline mr-2" />
            Notas adicionales
          </label>
          <textarea
            v-model="formData.notas"
            class="glass-input text-gray-800 placeholder-gn-accent-500 resize-none"
            rows="4"
            placeholder="Detalles adicionales del proyecto, materiales especiales, consideraciones importantes..."
          ></textarea>
        </div>

        <!-- 🧮 Automatic Calculations Display -->
        <div v-if="formData.value.montoFacturar > 0" class="bg-white/80 p-8 rounded-2xl border border-gray-200">
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <CalculatorIcon class="w-6 h-6 mr-3 text-gn-primary-600" />
            Cálculos Automáticos
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
                <span class="text-green-600 font-medium">Monto sin IVA:</span>
                <span class="font-bold text-lg text-gray-800">{{ formatCurrency(formData.value.montoFacturar) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
                <span class="text-green-600 font-medium">IVA (12%):</span>
                <span class="font-bold text-lg text-blue-600">{{ formatCurrency(calculos.value.iva) }}</span>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
                <span class="text-green-600 font-medium">ISR (7%):</span>
                <span class="font-bold text-lg text-orange-600">{{ formatCurrency(calculos.value.isr) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
                <span class="text-green-600 font-medium">Ganancia Neta:</span>
                <span class="font-bold text-lg text-green-600">{{ formatCurrency(calculos.value.gananciaNeta) }}</span>
              </div>
            </div>
          </div>

          <!-- Total to Invoice - Featured -->
          <div class="mt-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <div class="flex justify-between items-center">
              <span class="text-gray-800 font-bold text-xl">Total a Facturar:</span>
              <span class="font-black text-3xl text-green-600">
                {{ formatCurrency(calculos.value.montoTotal) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 🎮 Action Buttons -->
        <div class="flex space-x-4 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1 py-4 px-6 rounded-lg transition-colors duration-300 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex-1 py-4 px-6 text-lg font-bold rounded-lg transition-colors duration-300"
            :disabled="!formData.value.nombre || formData.value.montoFacturar <= 0"
          >
            <PlusIcon class="w-5 h-5 mr-2 inline" />
            Crear Proyecto
            <span v-if="!formData.value.nombre || formData.value.montoFacturar <= 0" class="text-xs block mt-1">
              {{ !formData.value.nombre ? 'Ingresa un nombre' : 'Ingresa un monto' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CalculatorIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits(['close', 'save'])

// Reactive Data
const formData = ref({
  nombre: '',
  montoFacturar: 0,
  tiempoCredito: 30,
  anticipos: 0,
  notas: ''
})

// Computed Properties
const calculos = computed(() => {
  const iva = formData.value.montoFacturar * 0.12
  const isr = formData.value.montoFacturar * 0.07
  const gananciaNeta = formData.value.montoFacturar - iva - isr

  return {
    iva,
    isr,
    gananciaNeta,
    montoTotal: formData.value.montoFacturar + iva
  }
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount)
}

const handleSubmit = () => {
  if (!formData.value.nombre || formData.value.montoFacturar <= 0) return

  const proyecto = {
    nombre: formData.value.nombre,
    montoFacturar: formData.value.montoFacturar,
    iva: calculos.value.iva,
    isr: calculos.value.isr,
    gananciaNeta: calculos.value.gananciaNeta,
    tiempoCredito: formData.value.tiempoCredito,
    anticipos: formData.value.anticipos,
    estado: 'activo',
    notas: formData.value.notas
  }

  emit('save', proyecto)

  // Reset form
  formData.value = {
    nombre: '',
    montoFacturar: 0,
    tiempoCredito: 30,
    anticipos: 0,
    notas: ''
  }
}
</script>

<style scoped>
/* Enhanced focus states for glass inputs */
.glass-input:focus {
  box-shadow:
    0 0 0 3px rgba(34, 197, 94, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

/* Disabled button state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

button:disabled:hover {
  transform: none !important;
}
</style>