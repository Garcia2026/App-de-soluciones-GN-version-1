<template>
  <div class="glass-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="glass-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- 🎨 Modal Header -->
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gn-primary-600 to-blue-600 bg-clip-text text-transparent">
              Agregar Gasto
            </h2>
            <p class="text-gray-800/70 text-sm mt-1">
              Proyecto: <span class="font-semibold text-gray-800">{{ projectName }}</span>
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="glass-light p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 group"
          >
            <XMarkIcon class="w-5 h-5 text-gray-800/70 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>

      <!-- 🌊 Form Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Expense Concept -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            <DocumentTextIcon class="w-4 h-4 inline mr-2" />
            Concepto del Gasto *
          </label>
          <input
            v-model="formData.concepto"
            type="text"
            required
            :class="['glass-input text-gray-800 placeholder-gn-accent-500', { 'border-red-500': errors.concepto }]"
            placeholder="Ej: Compra de plantas ornamentales premium"
          />
          <p v-if="errors.concepto" class="text-red-500 text-sm mt-2 font-medium">{{ errors.concepto }}</p>
        </div>

        <!-- Amount -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            <CurrencyDollarIcon class="w-4 h-4 inline mr-2" />
            Monto *
          </label>
          <div class="relative">
            <input
              v-model.number="formData.monto"
              type="number"
              step="0.01"
              min="0"
              required
              :class="['glass-input text-gray-800 placeholder-gn-accent-500 pl-12', { 'border-red-500': errors.monto }]"
              placeholder="0.00"
            />
            <CurrencyDollarIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800/70" />
          </div>
          <p v-if="errors.monto" class="text-red-500 text-sm mt-2 font-medium">{{ errors.monto }}</p>
        </div>

        <!-- Date and Category Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Date -->
          <div class="liquid-hover">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              <CalendarDaysIcon class="w-4 h-4 inline mr-2" />
              Fecha *
            </label>
            <input
              v-model="formData.fecha"
              type="date"
              required
              :class="['glass-input text-gray-800', { 'border-red-500': errors.fecha }]"
            />
            <p v-if="errors.fecha" class="text-red-500 text-sm mt-2 font-medium">{{ errors.fecha }}</p>
          </div>

          <!-- Category -->
          <div class="liquid-hover">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              <TagIcon class="w-4 h-4 inline mr-2" />
              Categoría
            </label>
            <select
              v-model="formData.categoria"
              class="glass-select text-gray-800"
            >
              <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                {{ categoria }}
              </option>
            </select>
          </div>
        </div>

        <!-- Receipt Upload -->
        <div class="liquid-hover">
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            <DocumentArrowUpIcon class="w-4 h-4 inline mr-2" />
            Comprobante (opcional)
          </label>
          <div class="flex items-center space-x-4">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileUpload"
              accept=".pdf,.jpg,.jpeg,.png"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="glass-btn-secondary flex items-center space-x-2 px-4 py-3"
            >
              <DocumentArrowUpIcon class="w-5 h-5" />
              <span>Subir archivo</span>
            </button>
            <span v-if="formData.comprobante" class="text-sm text-green-600 font-medium flex items-center">
              <CheckCircleIcon class="w-4 h-4 mr-1" />
              {{ formData.comprobante }}
            </span>
          </div>
          <p class="text-xs text-gn-accent-500 mt-2">
            Formatos: PDF, JPG, PNG (máx. 5MB)
          </p>
        </div>

        <!-- Amount Preview -->
        <div v-if="formData.monto > 0" class="glass-light p-4 rounded-xl liquid-shimmer">
          <div class="flex items-center justify-between">
            <span class="text-gray-800/70 font-medium">Gasto a registrar:</span>
            <span class="font-bold text-xl text-red-600">{{ formatCurrency(formData.monto) }}</span>
          </div>
        </div>

        <!-- 🎮 Action Buttons -->
        <div class="flex space-x-4 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1 py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3 px-4 font-semibold rounded-lg transition-colors duration-300"
          >
            <PlusIcon class="w-4 h-4 mr-2 inline" />
            Guardar Gasto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  XMarkIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  projectName: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Reactive Data
const formData = reactive({
  concepto: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'Materiales',
  comprobante: ''
})

const errors = ref({})

const categorias = [
  'Materiales',
  'Mano de obra',
  'Transporte',
  'Herramientas',
  'Combustible',
  'Alimentación',
  'Hospedaje',
  'Otros gastos',
  'Subcontratación',
  'Permisos y licencias'
]

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount)
}

const validateForm = () => {
  const newErrors = {}

  if (!formData.concepto.trim()) {
    newErrors.concepto = 'El concepto es requerido'
  }

  if (formData.monto <= 0) {
    newErrors.monto = 'El monto debe ser mayor a 0'
  }

  if (!formData.fecha) {
    newErrors.fecha = 'La fecha es requerida'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  const gasto = {
    concepto: formData.concepto.trim(),
    monto: formData.monto,
    fecha: new Date(formData.fecha),
    categoria: formData.categoria,
    comprobante: formData.comprobante || undefined
  }

  emit('save', gasto)

  // Reset form
  Object.assign(formData, {
    concepto: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Materiales',
    comprobante: ''
  })
  errors.value = {}
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 5MB.')
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Use PDF, JPG o PNG.')
      return
    }

    // En una implementación real, aquí subirías el archivo a tu servidor/cloud
    // Por ahora solo guardamos el nombre del archivo
    formData.comprobante = file.name
  }
}
</script>

<style scoped>
/* Enhanced form styling */
.glass-input:focus {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.glass-select:focus {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

/* Error state styling */
.border-red-500 {
  border-color: rgba(239, 68, 68, 0.5) !important;
}

.border-red-500:focus {
  box-shadow:
    0 0 0 3px rgba(239, 68, 68, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(239, 68, 68, 0.5) !important;
}
</style>