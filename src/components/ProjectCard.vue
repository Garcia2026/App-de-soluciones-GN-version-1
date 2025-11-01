<template>
  <div class="ios-project-card">
    <div class="p-12 lg:p-16">
      <!-- iOS-style Header - Centered -->
      <div class="text-center mb-10">
        <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">{{ proyecto.nombre }}</h3>
        <div class="flex items-center justify-center gap-4 mb-6">
          <span :class="iosStatusBadgeClass">
            {{ proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1) }}
          </span>
          <span class="text-sm text-gray-500 font-medium">
            Proyecto #{{ proyecto.id.slice(-6).toUpperCase() }}
          </span>
        </div>
        <div class="flex items-center justify-center space-x-3">
          <button
            @click="$emit('edit-project', proyecto)"
            class="ios-action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            @click="$emit('delete-project', proyecto.id)"
            class="ios-action-btn bg-red-50 text-red-600 hover:bg-red-100"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- iOS-style Metrics Grid - Full Width -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="ios-metric-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base font-medium text-gray-500 uppercase tracking-wide mb-3">A Facturar</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ formatCurrency(proyecto.montoFacturar) }}</p>
            </div>
            <div class="ios-metric-icon bg-blue-500">
              <span class="text-white text-xs font-bold">₪</span>
            </div>
          </div>
        </div>

        <div class="ios-metric-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base font-medium text-gray-500 uppercase tracking-wide mb-3">Ganancia Neta</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{{ formatCurrency(proyecto.gananciaNeta) }}</p>
            </div>
            <div class="ios-metric-icon bg-green-500">
              <span class="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>

        <div class="ios-metric-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base font-medium text-gray-500 uppercase tracking-wide mb-3">Gastos</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">{{ formatCurrency(totalGastos) }}</p>
            </div>
            <div class="ios-metric-icon bg-red-500">
              <span class="text-white text-xs font-bold">⊗</span>
            </div>
          </div>
        </div>

        <div class="ios-metric-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ganancia Real</p>
              <p :class="`text-lg font-bold ${gananciaReal >= 0 ? 'text-green-600' : 'text-red-600'}`">
                {{ formatCurrency(gananciaReal) }}
              </p>
            </div>
            <div :class="`ios-metric-icon ${gananciaReal >= 0 ? 'bg-green-500' : 'bg-red-500'}`">
              <span class="text-white text-xs font-bold">{{ gananciaReal >= 0 ? '↗' : '↘' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- iOS-style Action Buttons -->
      <div class="flex items-center gap-3">
        <button
          @click="$emit('add-expense', proyecto)"
          class="ios-action-button bg-green-600 text-white flex-1"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Agregar Gasto</span>
        </button>

        <button
          @click="isExpanded = !isExpanded"
          class="ios-detail-button"
        >
          <span class="text-xs font-medium">{{ isExpanded ? 'Menos' : 'Más' }}</span>
          <ChevronUpIcon v-if="isExpanded" class="w-4 h-4" />
          <ChevronDownIcon v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Detalles expandibles -->
      <div v-if="isExpanded" class="mt-8 pt-8 border-t border-gray-200/50">
        <!-- Información Financiera Detallada -->
        <div class="mb-8">
          <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            💰 Desglose Financiero Completo
          </h4>

          <!-- Grid de información financiera -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-sm font-medium text-gray-600">Monto Total</span>
              </div>
              <p class="text-lg font-bold text-blue-600">{{ formatCurrency(proyecto.montoTotal || proyecto.montoFacturar * 1.12) }}</p>
            </div>

            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full bg-gray-500"></div>
                <span class="text-sm font-medium text-gray-600">Sin IVA</span>
              </div>
              <p class="text-lg font-bold text-gray-700">{{ formatCurrency(proyecto.montoFacturar) }}</p>
            </div>

            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                <span class="text-sm font-medium text-gray-600">IVA (12%)</span>
              </div>
              <p class="text-lg font-bold text-orange-600">{{ formatCurrency(proyecto.iva) }}</p>
            </div>

            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm font-medium text-gray-600">ISR (7%)</span>
              </div>
              <p class="text-lg font-bold text-red-600">{{ formatCurrency(proyecto.isr) }}</p>
            </div>

            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                <span class="text-sm font-medium text-gray-600">Anticipos</span>
              </div>
              <p class="text-lg font-bold text-purple-600">{{ formatCurrency(proyecto.anticipos) }}</p>
            </div>

            <div class="ios-detail-card">
              <div class="flex items-center gap-3 mb-2">
                <div :class="`w-3 h-3 rounded-full ${margenGanancia >= 0 ? 'bg-green-500' : 'bg-red-500'}`"></div>
                <span class="text-sm font-medium text-gray-600">Margen</span>
              </div>
              <p :class="`text-lg font-bold ${margenGanancia >= 0 ? 'text-green-600' : 'text-red-600'}`">
                {{ margenGanancia.toFixed(1) }}%
              </p>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="ios-detail-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-blue-700">Tiempo de Crédito</span>
                <p class="text-xl font-bold text-blue-800">{{ proyecto.tiempoCredito }} días</p>
              </div>
              <div class="text-3xl">⏰</div>
            </div>
          </div>
        </div>

        <!-- Gráficas y Distribución -->
        <div v-if="proyecto.gastos && proyecto.gastos.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Gráfica de gastos más grande -->
          <div class="ios-detail-card">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📊 Distribución de Gastos
            </h4>
            <div class="h-64">
              <Pie
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </div>

          <!-- Resumen estadístico -->
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📈 Resumen del Proyecto
            </h4>

            <div class="ios-detail-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-medium text-green-700">Ganancia Final</span>
                  <p class="text-2xl font-bold text-green-800">{{ formatCurrency(gananciaReal) }}</p>
                </div>
                <div class="text-3xl">💚</div>
              </div>
            </div>
          </div>

          <!-- Reparto de Ganancias -->
          <div v-if="gananciaReal > 0" class="mt-8">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              🤝 Reparto de Ganancias
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <div class="ios-detail-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-blue-700">Don Eduardo (30%)</span>
                    <p class="text-xl font-bold text-blue-800">{{ formatCurrency(repartoGanancias.donEduardo) }}</p>
                  </div>
                  <div class="text-2xl">👨‍💼</div>
                </div>
              </div>

              <div class="ios-detail-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-purple-700">Soluciones Integrales (70%)</span>
                    <p class="text-xl font-bold text-purple-800">{{ formatCurrency(repartoGanancias.solucionesIntegrales) }}</p>
                  </div>
                  <div class="text-2xl">🏢</div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">

            <div class="ios-detail-card bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-medium text-red-700">Total Gastado</span>
                  <p class="text-2xl font-bold text-red-800">{{ formatCurrency(totalGastos) }}</p>
                  <span class="text-xs text-red-600">{{ proyecto.gastos.length }} gasto(s)</span>
                </div>
                <div class="text-3xl">💸</div>
              </div>
            </div>

            <div class="ios-detail-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-medium text-blue-700">Eficiencia</span>
                  <p class="text-2xl font-bold text-blue-800">{{ ((gananciaReal / proyecto.montoFacturar) * 100).toFixed(1) }}%</p>
                  <span class="text-xs text-blue-600">Ganancia vs. Facturado</span>
                </div>
                <div class="text-3xl">⚡</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de gastos mejorada -->
        <div v-if="proyecto.gastos && proyecto.gastos.length > 0">
          <h4 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Detalle de Gastos ({{ proyecto.gastos.length }})
          </h4>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="(gasto, index) in proyecto.gastos"
              :key="gasto.id || index"
              class="ios-expense-item flex flex-col sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="flex-1 mb-4 sm:mb-0">
                <div class="flex items-start gap-3">
                  <span class="ios-expense-number mt-1">{{ index + 1 }}</span>
                  <div>
                    <p class="font-semibold text-gray-900">{{ gasto.concepto }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="ios-category-badge">{{ gasto.categoria }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(gasto.fecha) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 border-t border-gray-200/50 pt-4 sm:border-t-0 sm:pt-0">
                <div class="text-right">
                  <p class="text-lg font-bold text-red-600">{{ formatCurrency(gasto.monto) }}</p>
                  <p class="text-xs text-gray-500">
                    {{ ((gasto.monto / totalGastos) * 100).toFixed(1) }}% del total
                  </p>
                </div>
                <div class="flex sm:flex-col gap-2">
                  <button
                    @click="$emit('edit-expense', gasto)"
                    class="ios-expense-btn bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Editar gasto"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="$emit('delete-expense', gasto.id)"
                    class="ios-expense-btn bg-red-100 text-red-600 hover:bg-red-200"
                    title="Eliminar gasto"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de gastos por categoría -->
          <div v-if="gastosPorCategoria.length > 1" class="mt-6">
            <h5 class="text-md font-semibold text-gray-900 mb-4">💼 Gastos por Categoría</h5>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              <div
                v-for="categoria in gastosPorCategoria"
                :key="categoria.nombre"
                class="ios-category-summary"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">{{ categoria.nombre }}</span>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">{{ formatCurrency(categoria.total) }}</p>
                    <p class="text-xs text-gray-500">{{ categoria.porcentaje }}%</p>
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    class="bg-red-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: categoria.porcentaje + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado cuando no hay gastos -->
        <div v-else class="text-center py-8">
          <div class="ios-detail-card bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <div class="flex flex-col items-center">
              <div class="text-4xl mb-3">📝</div>
              <h5 class="text-lg font-semibold text-gray-700 mb-2">Sin gastos registrados</h5>
              <p class="text-sm text-gray-500">Agrega gastos para ver el análisis completo del proyecto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

// Props
const props = defineProps({
  proyecto: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['add-expense', 'edit-project', 'delete-project'])

// Datos reactivos
const isExpanded = ref(false)

// Computed
const totalGastos = computed(() => {
  return props.proyecto.gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
})

const gananciaReal = computed(() => {
  return props.proyecto.gananciaNeta - totalGastos.value
})

// Computed para reparto de ganancias
const repartoGanancias = computed(() => {
  const gananciaTotal = gananciaReal.value
  const donEduardo = gananciaTotal * 0.30
  const solucionesIntegrales = gananciaTotal * 0.70

  return {
    total: gananciaTotal,
    donEduardo,
    solucionesIntegrales
  }
})

const margenGanancia = computed(() => {
  return props.proyecto.gananciaNeta > 0
    ? (gananciaReal.value / props.proyecto.gananciaNeta) * 100
    : 0
})

const iosStatusBadgeClass = computed(() => {
  const baseClass = 'px-3 py-1.5 rounded-full text-xs font-semibold '
  switch (props.proyecto.estado) {
    case 'activo':
      return baseClass + 'bg-green-100 text-green-700 border border-green-200'
    case 'completado':
      return baseClass + 'bg-blue-100 text-blue-700 border border-blue-200'
    case 'pausado':
      return baseClass + 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    default:
      return baseClass + 'bg-gray-100 text-gray-700 border border-gray-200'
  }
})

const chartData = computed(() => {
  return {
    labels: props.proyecto.gastos.map(g => g.concepto),
    datasets: [{
      data: props.proyecto.gastos.map(g => g.monto),
      backgroundColor: [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
      ],
      borderWidth: 0
    }]
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 16,
          font: { size: 12 },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = formatCurrency(context.raw)
            const percentage = ((context.raw / totalGastos.value) * 100).toFixed(1)
            return `${context.label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }
})

const gastosPorCategoria = computed(() => {
  if (!props.proyecto.gastos || props.proyecto.gastos.length === 0) return []

  const categorias = {}

  props.proyecto.gastos.forEach(gasto => {
    const categoria = gasto.categoria || 'Otros'
    if (!categorias[categoria]) {
      categorias[categoria] = 0
    }
    categorias[categoria] += gasto.monto
  })

  return Object.keys(categorias)
    .map(categoria => ({
      nombre: categoria,
      total: categorias[categoria],
      porcentaje: ((categorias[categoria] / totalGastos.value) * 100).toFixed(1)
    }))
    .sort((a, b) => b.total - a.total)
})

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX')
}
</script>

<style scoped>
/* iOS Corporate ProjectCard Styles */

.ios-project-card {
  @apply bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 overflow-hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ios-card-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  min-height: 100vh;
}

.ios-project-card:hover {
  @apply shadow-xl border-gray-200/50 bg-white/90;
  transform: translateY(-4px) scale(1.02);
}

/* iOS-style Action Buttons */
.ios-action-btn {
  @apply p-2 rounded-xl transition-all duration-300;
}

.ios-action-btn:hover {
  transform: scale(1.1);
}

.ios-action-btn:active {
  transform: scale(0.95);
}

/* iOS-style Metric Cards */
.ios-metric-card {
  @apply bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-metric-card:hover {
  @apply bg-gray-50 border-gray-200 shadow-sm;
  transform: translateY(-2px);
}

/* iOS-style Metric Icons */
.ios-metric-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center shadow-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-metric-card:hover .ios-metric-icon {
  transform: scale(1.1) rotate(5deg);
}

/* iOS-style Action Button */
.ios-action-button {
  @apply inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-action-button:hover {
  @apply shadow-xl;
  transform: translateY(-2px) scale(1.05);
}

.ios-action-button:active {
  transform: translateY(0) scale(0.98);
}

/* iOS-style Detail Button */
.ios-detail-button {
  @apply flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-detail-button:hover {
  @apply bg-gray-200 text-gray-900;
  transform: translateY(-1px);
}

/* Improved expense items */
.expense-item {
  @apply flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expense-item:hover {
  @apply bg-gray-50 border-gray-200 shadow-sm;
  transform: translateY(-1px);
}

/* iOS-style Expense Buttons */
.ios-expense-btn {
  @apply p-2 rounded-lg border border-current transition-all duration-300;
}

.ios-expense-btn:hover {
  transform: scale(1.1);
}

.ios-expense-btn:active {
  transform: scale(0.95);
}

/* iOS-style animations */
@keyframes ios-card-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced expandable section */
.ios-project-card .border-t {
  @apply border-gray-200/50;
}

/* iOS-style Detail Cards */
.ios-detail-card {
  @apply bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 shadow-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-detail-card:hover {
  @apply bg-white/90 border-gray-200/50 shadow-md;
  transform: translateY(-1px);
}

/* iOS-style Expense Items */
.ios-expense-item {
  @apply bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-expense-item:hover {
  @apply bg-white/80 border-gray-200/50 shadow-sm;
  transform: translateY(-1px);
}

.ios-expense-number {
  @apply w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0;
}

.ios-category-badge {
  @apply px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md;
}

.ios-category-summary {
  @apply bg-gray-50/80 rounded-lg p-3 border border-gray-200/30;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-category-summary:hover {
  @apply bg-gray-50 border-gray-200/50;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .ios-project-card {
    @apply rounded-xl;
  }

  .ios-metric-card {
    @apply rounded-lg p-3;
  }

  .ios-action-button, .ios-detail-button {
    @apply rounded-lg px-3 py-2 text-sm;
  }

  .ios-metric-icon {
    @apply w-6 h-6 rounded-lg;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-project-card {
    @apply bg-gray-900/80 border-gray-700/30;
  }

  .ios-project-card:hover {
    @apply bg-gray-900/90 border-gray-700/50;
  }

  .ios-metric-card {
    @apply bg-gray-800/50 border-gray-700/30;
  }

  .ios-metric-card:hover {
    @apply bg-gray-800/80 border-gray-700/50;
  }

  .expense-item {
    @apply bg-gray-800/50 border-gray-700/30;
  }

  .expense-item:hover {
    @apply bg-gray-800/80 border-gray-700/50;
  }
}
</style>