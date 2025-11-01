<template>
  <div class="liquid-card liquid-hover liquid-bounce group">
    <div class="p-8">
      <!-- 🎯 Project Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h3 class="text-2xl font-bold text-gn-primary-900 mb-2 group-hover:text-gn-primary-600 transition-colors">
            {{ proyecto.nombre }}
          </h3>
          <div class="flex items-center space-x-3">
            <span :class="statusBadgeClass">
              {{ proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1) }}
            </span>
            <span class="text-sm text-gn-accent-600">
              Creado {{ formatDate(proyecto.fechaCreacion) }}
            </span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="$emit('edit-project', proyecto)"
            class="glass-light p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-300 group/btn"
          >
            <PencilIcon class="w-5 h-5 text-gn-accent-600 group-hover/btn:text-blue-600 transition-colors" />
          </button>
          <button
            @click="$emit('delete-project', proyecto.id)"
            class="glass-light p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 group/btn"
          >
            <TrashIcon class="w-5 h-5 text-gn-accent-600 group-hover/btn:text-red-600 transition-colors" />
          </button>
        </div>
      </div>

      <!-- 📊 Financial Overview Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="glass-light p-4 rounded-xl text-center liquid-hover liquid-bounce">
          <p class="text-xs text-gn-accent-600 font-medium mb-1">A Facturar</p>
          <p class="text-lg font-bold text-gn-primary-900">{{ formatCurrency(proyecto.montoFacturar) }}</p>
        </div>
        <div class="glass-light p-4 rounded-xl text-center liquid-hover liquid-bounce">
          <p class="text-xs text-gn-accent-600 font-medium mb-1">Ganancia Neta</p>
          <p class="text-lg font-bold text-green-600">{{ formatCurrency(proyecto.gananciaNeta) }}</p>
        </div>
        <div class="glass-light p-4 rounded-xl text-center liquid-hover liquid-bounce">
          <p class="text-xs text-gn-accent-600 font-medium mb-1">Gastos</p>
          <p class="text-lg font-bold text-red-600">{{ formatCurrency(totalGastos) }}</p>
        </div>
        <div class="glass-light p-4 rounded-xl text-center liquid-hover liquid-bounce">
          <p class="text-xs text-gn-accent-600 font-medium mb-1">Ganancia Real</p>
          <p :class="`text-lg font-bold ${gananciaReal >= 0 ? 'text-green-600' : 'text-red-600'}`">
            {{ formatCurrency(gananciaReal) }}
          </p>
        </div>
      </div>

      <!-- 🎯 Profit Margin Indicator -->
      <div class="glass-light p-4 rounded-xl mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gn-accent-600">Margen de Ganancia</span>
          <span :class="`text-sm font-bold ${margenGanancia >= 0 ? 'text-green-600' : 'text-red-600'}`">
            {{ margenGanancia.toFixed(1) }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            :class="`h-2 rounded-full transition-all duration-1000 ${margenGanancia >= 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`"
            :style="{ width: `${Math.min(Math.abs(margenGanancia), 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- 🎮 Action Buttons -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="$emit('add-expense', proyecto)"
          class="glass-btn-accent flex items-center space-x-2 px-6 py-3"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Agregar Gasto</span>
        </button>

        <button
          @click="isExpanded = !isExpanded"
          class="glass-light px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/20 transition-all duration-300"
        >
          <span class="text-gn-accent-700 font-medium">{{ isExpanded ? 'Menos' : 'Más' }} detalles</span>
          <ChevronUpIcon v-if="isExpanded" class="w-4 h-4 text-gn-accent-700" />
          <ChevronDownIcon v-else class="w-4 h-4 text-gn-accent-700" />
        </button>
      </div>

      <!-- 📋 Expanded Details -->
      <div v-if="isExpanded" class="space-y-6">
        <div class="h-px bg-gradient-to-r from-transparent via-gn-accent-300 to-transparent"></div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Project Information -->
          <div class="glass-light p-6 rounded-xl">
            <h4 class="font-bold text-gn-primary-900 mb-4 flex items-center">
              <DocumentTextIcon class="w-5 h-5 mr-2 text-gn-primary-600" />
              Información del Proyecto
            </h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gn-accent-600">IVA (12%):</span>
                <span class="font-semibold text-blue-600">{{ formatCurrency(proyecto.iva) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gn-accent-600">ISR (7%):</span>
                <span class="font-semibold text-orange-600">{{ formatCurrency(proyecto.isr) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gn-accent-600">Tiempo de crédito:</span>
                <span class="font-semibold text-gn-primary-700">{{ proyecto.tiempoCredito }} días</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gn-accent-600">Anticipos:</span>
                <span class="font-semibold text-purple-600">{{ formatCurrency(proyecto.anticipos) }}</span>
              </div>
            </div>
          </div>

          <!-- Expenses Chart -->
          <div v-if="proyecto.gastos.length > 0" class="glass-light p-6 rounded-xl">
            <h4 class="font-bold text-gn-primary-900 mb-4 flex items-center">
              <ChartPieIcon class="w-5 h-5 mr-2 text-gn-primary-600" />
              Distribución de Gastos
            </h4>
            <div class="h-48 relative">
              <Pie
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </div>
        </div>

        <!-- Expenses List -->
        <div v-if="proyecto.gastos.length > 0" class="glass-light p-6 rounded-xl">
          <h4 class="font-bold text-gn-primary-900 mb-4 flex items-center">
            <CurrencyDollarIcon class="w-5 h-5 mr-2 text-gn-primary-600" />
            Gastos del Proyecto
          </h4>
          <div class="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
            <div
              v-for="gasto in proyecto.gastos"
              :key="gasto.id"
              class="glass p-4 rounded-lg hover:bg-white/10 transition-all duration-300 liquid-hover liquid-bounce"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-semibold text-gn-primary-900">{{ gasto.concepto }}</p>
                  <div class="flex items-center space-x-2 text-sm text-gn-accent-600 mt-1">
                    <span class="px-2 py-1 bg-gn-accent-200 rounded-md text-xs font-medium">
                      {{ gasto.categoria }}
                    </span>
                    <span>•</span>
                    <span>{{ formatDate(gasto.fecha) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-red-600 text-lg">{{ formatCurrency(gasto.monto) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Notes -->
        <div v-if="proyecto.notas" class="glass-light p-6 rounded-xl">
          <h4 class="font-bold text-gn-primary-900 mb-3 flex items-center">
            <DocumentTextIcon class="w-5 h-5 mr-2 text-gn-primary-600" />
            Notas del Proyecto
          </h4>
          <p class="text-gn-accent-700 leading-relaxed">{{ proyecto.notas }}</p>
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
  ChevronDownIcon,
  DocumentTextIcon,
  ChartPieIcon,
  CurrencyDollarIcon
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

const margenGanancia = computed(() => {
  return props.proyecto.gananciaNeta > 0
    ? (gananciaReal.value / props.proyecto.gananciaNeta) * 100
    : 0
})

const statusBadgeClass = computed(() => {
  const baseClass = 'px-3 py-1 rounded-full text-xs font-medium glass-light '
  switch (props.proyecto.estado) {
    case 'activo':
      return baseClass + 'text-green-700 border border-green-200'
    case 'completado':
      return baseClass + 'text-blue-700 border border-blue-200'
    case 'pausado':
      return baseClass + 'text-yellow-700 border border-yellow-200'
    default:
      return baseClass + 'text-gray-700 border border-gray-200'
  }
})

const chartData = computed(() => {
  if (props.proyecto.gastos.length === 0) return null

  return {
    labels: props.proyecto.gastos.map(g => g.concepto),
    datasets: [{
      data: props.proyecto.gastos.map(g => g.monto),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',   // red
        'rgba(249, 115, 22, 0.8)',  // orange
        'rgba(234, 179, 8, 0.8)',   // yellow
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(59, 130, 246, 0.8)',  // blue
        'rgba(139, 92, 246, 0.8)',  // purple
        'rgba(236, 72, 153, 0.8)',  // pink
        'rgba(107, 114, 128, 0.8)'  // gray
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
          boxWidth: 12,
          font: { size: 10 },
          padding: 8,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = formatCurrency(context.raw)
            return `${context.label}: ${value}`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    }
  }
})

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Custom scrollbar for expense list */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}
</style>