<template>
  <!-- iOS-style Modal Overlay -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="ios-modal-expense">
      <!-- iOS-style Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ props.editingExpense ? 'Editar Gasto' : 'Agregar Gasto' }}</h2>
          <p class="text-sm text-gray-600 mt-1">Proyecto: <span class="font-semibold">{{ projectName }}</span></p>
        </div>
        <button
          @click="$emit('close')"
          class="ios-close-btn"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- iOS-style Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Concepto -->
        <div class="ios-form-group">
          <label class="ios-label">
            💼 Concepto del Gasto *
          </label>
          <input
            v-model="formData.concepto"
            type="text"
            required
            :readonly="isComisionFinanciamiento"
            :class="['ios-input', { 'border-red-400 bg-red-50': errors.concepto, 'bg-blue-50 text-blue-700': isComisionFinanciamiento }]"
            placeholder="Ej: Compra de plantas ornamentales"
          />
          <p v-if="errors.concepto" class="text-red-500 text-sm mt-2">{{ errors.concepto }}</p>
        </div>

        <!-- Monto y Fecha en Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Monto -->
          <div class="ios-form-group">
            <label class="ios-label">
              💰 Monto *
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                v-model.number="formData.monto"
                type="number"
                step="0.01"
                min="0"
                required
                :readonly="isComisionFinanciamiento"
                :class="['ios-input pl-10', { 'border-red-400 bg-red-50': errors.monto, 'bg-blue-50 text-blue-700': isComisionFinanciamiento }]"
                placeholder="0.00"
              />
            </div>
            <p v-if="errors.monto" class="text-red-500 text-sm mt-2">{{ errors.monto }}</p>
            <p v-if="isComisionFinanciamiento" class="text-blue-600 text-sm mt-2">
              💡 Monto calculado automáticamente (10% del total de gastos: {{ formatCurrency(totalGastosActuales) }})
            </p>
          </div>

          <!-- Fecha -->
          <div class="ios-form-group">
            <label class="ios-label">
              📅 Fecha *
            </label>
            <input
              v-model="formData.fecha"
              type="date"
              required
              :class="['ios-input', { 'border-red-400 bg-red-50': errors.fecha }]"
            />
            <p v-if="errors.fecha" class="text-red-500 text-sm mt-2">{{ errors.fecha }}</p>
          </div>
        </div>

        <!-- Categoría -->
        <div class="ios-form-group">
          <label class="ios-label">
            📂 Categoría
          </label>

          <!-- Toggle entre select y input personalizado -->
          <div v-if="!showCustomCategory">
            <div class="flex gap-3">
              <select
                v-model="formData.categoria"
                class="ios-select flex-1"
              >
                <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                  {{ categoria }}
                </option>
              </select>
              <button
                type="button"
                @click="showCustomCategory = true"
                class="ios-add-category-btn"
                title="Agregar nueva categoría"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Input para categoría personalizada -->
          <div v-else class="space-y-3">
            <div class="flex gap-3">
              <input
                v-model="customCategoryName"
                type="text"
                class="ios-input flex-1"
                placeholder="Nombre de la nueva categoría..."
                @keyup.enter="addCustomCategory"
              />
              <button
                type="button"
                @click="addCustomCategory"
                class="ios-save-category-btn"
                :disabled="!customCategoryName.trim()"
              >
                ✓
              </button>
              <button
                type="button"
                @click="cancelCustomCategory"
                class="ios-cancel-category-btn"
              >
                ✕
              </button>
            </div>
            <p class="text-xs text-gray-500">Presiona Enter o ✓ para agregar la categoría</p>
          </div>
        </div>

        <!-- Comprobante -->
        <div class="ios-form-group">
          <label class="ios-label">
            📎 Comprobante (opcional)
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
              class="ios-upload-btn"
            >
              <DocumentArrowUpIcon class="w-5 h-5" />
              <span>Subir archivo</span>
            </button>
            <span v-if="formData.comprobante" class="text-sm text-green-600 font-medium">
              ✓ {{ formData.comprobante }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            Formatos: PDF, JPG, PNG (máx. 5MB)
          </p>
        </div>

        <!-- iOS-style Action Buttons -->
        <div class="flex gap-4 pt-8">
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
            {{ props.editingExpense ? '✏️ Actualizar Gasto' : '💾 Guardar Gasto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  XMarkIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  DocumentArrowUpIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  projectName: {
    type: String,
    required: true
  },
  currentExpenses: {
    type: Array,
    default: () => []
  },
  editingExpense: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Datos reactivos
const formData = reactive({
  concepto: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'Materiales',
  comprobante: ''
})

// Computed para calcular total de gastos actuales
const totalGastosActuales = computed(() => {
  return props.currentExpenses.reduce((sum, gasto) => sum + gasto.monto, 0)
})

// Computed para detectar si se seleccionó la categoría de comisión
const isComisionFinanciamiento = computed(() => {
  return formData.categoria === 'Comisión del 10% por financiamiento'
})

// Watch para auto-calcular el monto cuando se selecciona comisión
watch(isComisionFinanciamiento, (isComision) => {
  if (isComision) {
    formData.monto = totalGastosActuales.value * 0.10
    formData.concepto = 'Comisión por financiamiento (10% del total de gastos)'
  }
})

const errors = ref({})
const showCustomCategory = ref(false)
const customCategoryName = ref('')

const categorias = ref([
  'Materiales',
  'Mano de obra',
  'Transporte',
  'Herramientas',
  'Combustible',
  'Alimentación',
  'Hospedaje',
  'Otros gastos',
  'Subcontratación',
  'Permisos y licencias',
  'Comisión del 10% por financiamiento'
])

// Métodos
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
    // En una implementación real, aquí subirías el archivo a tu servidor/cloud
    // Por ahora solo guardamos el nombre del archivo
    formData.comprobante = file.name
  }
}

// Métodos para categorías personalizadas
const addCustomCategory = () => {
  const newCategory = customCategoryName.value.trim()
  if (newCategory && !categorias.value.includes(newCategory)) {
    categorias.value.push(newCategory)
    formData.categoria = newCategory
    customCategoryName.value = ''
    showCustomCategory.value = false
  }
}

const cancelCustomCategory = () => {
  customCategoryName.value = ''
  showCustomCategory.value = false
}

// Método para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

// Inicializar formulario con datos del gasto a editar
onMounted(() => {
  if (props.editingExpense) {
    Object.assign(formData, {
      concepto: props.editingExpense.concepto,
      monto: props.editingExpense.monto,
      fecha: props.editingExpense.fecha instanceof Date
        ? props.editingExpense.fecha.toISOString().split('T')[0]
        : props.editingExpense.fecha,
      categoria: props.editingExpense.categoria,
      comprobante: props.editingExpense.comprobante || ''
    })
  }
})
</script>

<style scoped>
/* iOS Corporate Expense Modal Styles */

.ios-modal-expense {
  @apply bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 max-w-lg w-full max-h-[90vh] overflow-y-auto px-8 py-10;
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
  @apply space-y-3;
}

.ios-label {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

.ios-input {
  @apply w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px;
}

.ios-input:hover {
  @apply bg-gray-50 border-gray-300;
}

.ios-select {
  @apply w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 font-medium;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white;
  @apply appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-select:hover {
  @apply bg-gray-50 border-gray-300;
}

/* iOS-style Upload Button */
.ios-upload-btn {
  @apply flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl border border-gray-200;
  @apply hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 cursor-pointer;
}

.ios-upload-btn:hover {
  transform: translateY(-1px);
}

.ios-upload-btn:active {
  transform: translateY(0) scale(0.98);
}

/* iOS-style Category Buttons */
.ios-add-category-btn {
  @apply p-3 bg-blue-100 text-blue-600 rounded-xl border border-blue-200;
  @apply hover:bg-blue-200 hover:text-blue-700 transition-all duration-300;
}

.ios-add-category-btn:hover {
  transform: scale(1.05);
}

.ios-add-category-btn:active {
  transform: scale(0.95);
}

.ios-save-category-btn {
  @apply p-3 bg-green-100 text-green-600 rounded-xl border border-green-200 font-bold;
  @apply hover:bg-green-200 hover:text-green-700 transition-all duration-300;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none;
}

.ios-save-category-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.ios-save-category-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ios-cancel-category-btn {
  @apply p-3 bg-red-100 text-red-600 rounded-xl border border-red-200 font-bold;
  @apply hover:bg-red-200 hover:text-red-700 transition-all duration-300;
}

.ios-cancel-category-btn:hover {
  transform: scale(1.05);
}

.ios-cancel-category-btn:active {
  transform: scale(0.95);
}

/* iOS-style Buttons */
.ios-btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg;
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
  .ios-modal-expense {
    @apply rounded-2xl px-6 py-8 mx-2;
  }

  .ios-input, .ios-select {
    @apply rounded-lg py-3;
  }

  .ios-btn-primary, .ios-btn-secondary {
    @apply rounded-xl py-3 text-sm;
  }

  .ios-upload-btn {
    @apply rounded-lg px-3 py-2 text-sm;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-modal-expense {
    @apply bg-gray-900/95 border-gray-700/30;
  }

  .ios-input, .ios-select {
    @apply bg-gray-800/50 border-gray-700/30 text-white placeholder-gray-400;
  }

  .ios-input:focus, .ios-select:focus {
    @apply bg-gray-800/80 border-gray-600;
  }

  .ios-upload-btn {
    @apply bg-gray-800/50 border-gray-700/30 text-gray-300;
  }

  .ios-upload-btn:hover {
    @apply bg-gray-800/80 text-white;
  }
}
</style>