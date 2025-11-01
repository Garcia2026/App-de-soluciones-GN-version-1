<template>
  <MainLayout
    page-title="Gestión de Proyectos"
    :show-header="false"
  >
    <!-- 🌊 Liquid Glass Background -->
    <div class="min-h-screen relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-gn-primary-50 via-gn-accent-100 to-gn-primary-100"></div>
      <div class="absolute inset-0 opacity-20 bg-gradient-to-tr from-gn-primary-200/30 via-transparent to-gn-accent-200/30"></div>

      <!-- Content -->
      <div class="relative z-10 p-6 max-w-7xl mx-auto">

        <!-- 🎨 Liquid Header -->
        <div class="liquid-card mb-8 p-8 liquid-shimmer">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-gn-primary-600 to-gn-primary-400 bg-clip-text text-transparent mb-2">
                Gestión de Proyectos
              </h1>
              <p class="text-gn-accent-600 text-lg">Administra proyectos, calcula impuestos y controla gastos con elegancia</p>
            </div>
            <button
              @click="showNewProjectModal = true"
              class="glass-btn-primary liquid-hover px-8 py-4 text-lg font-semibold"
            >
              <PlusIcon class="w-6 h-6 mr-2 inline" />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        <!-- 📊 Liquid Glass Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div class="glass-stats liquid-hover liquid-glow group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gn-accent-600 font-medium">Total Proyectos</p>
                <p class="text-3xl font-bold text-gn-primary-900 group-hover:text-gn-primary-600 transition-colors">
                  {{ stats.totalProjects }}
                </p>
              </div>
              <div class="p-3 rounded-xl glass-light">
                <DocumentTextIcon class="h-8 w-8 text-gn-primary-600" />
              </div>
            </div>
          </div>

          <div class="glass-stats liquid-hover liquid-glow group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gn-accent-600 font-medium">Proyectos Activos</p>
                <p class="text-3xl font-bold text-green-600 group-hover:text-green-500 transition-colors">
                  {{ stats.activeProjects }}
                </p>
              </div>
              <div class="p-3 rounded-xl glass-light">
                <FireIcon class="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div class="glass-stats liquid-hover liquid-glow group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gn-accent-600 font-medium">Ingresos Totales</p>
                <p class="text-2xl font-bold text-blue-600 group-hover:text-blue-500 transition-colors">
                  {{ formatCurrency(stats.totalRevenue) }}
                </p>
              </div>
              <div class="p-3 rounded-xl glass-light">
                <ArrowTrendingUpIcon class="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div class="glass-stats liquid-hover liquid-glow group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gn-accent-600 font-medium">Gastos Totales</p>
                <p class="text-2xl font-bold text-red-600 group-hover:text-red-500 transition-colors">
                  {{ formatCurrency(stats.totalExpenses) }}
                </p>
              </div>
              <div class="p-3 rounded-xl glass-light">
                <ChartBarIcon class="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div class="glass-stats liquid-hover liquid-glow group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gn-accent-600 font-medium">Ganancia Real</p>
                <p :class="`text-2xl font-bold transition-colors ${stats.totalProfit >= 0 ? 'text-green-600 group-hover:text-green-500' : 'text-red-600 group-hover:text-red-500'}`">
                  {{ formatCurrency(stats.totalProfit) }}
                </p>
              </div>
              <div class="p-3 rounded-xl glass-light">
                <CurrencyDollarIcon class="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- 🎛️ Liquid Glass Filters -->
        <div class="liquid-card p-6 mb-8">
          <div class="flex items-center space-x-4">
            <span class="text-gn-primary-900 font-medium">Filtrar por estado:</span>
            <select
              v-model="filterStatus"
              class="glass-select text-gn-primary-900"
            >
              <option value="all">Todos los proyectos</option>
              <option value="activo">Activos</option>
              <option value="completado">Completados</option>
              <option value="pausado">Pausados</option>
            </select>
          </div>
        </div>

        <!-- 📋 Projects Grid -->
        <div v-if="filteredProjects.length === 0" class="text-center py-20">
          <div class="liquid-card p-12 max-w-md mx-auto">
            <div class="p-6 rounded-full glass-light w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <DocumentTextIcon class="h-12 w-12 text-gn-accent-400" />
            </div>
            <h3 class="text-2xl font-bold text-gn-primary-900 mb-4">
              {{ proyectos.length === 0 ? 'No hay proyectos' : 'No hay proyectos con este filtro' }}
            </h3>
            <p class="text-gn-accent-600 mb-8 text-lg">
              {{ proyectos.length === 0 ? 'Comienza creando tu primer proyecto' : 'Prueba con un filtro diferente' }}
            </p>
            <button
              v-if="proyectos.length === 0"
              @click="showNewProjectModal = true"
              class="glass-btn-primary px-8 py-4 text-lg"
            >
              Crear Primer Proyecto
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LiquidProjectCard
            v-for="proyecto in filteredProjects"
            :key="proyecto.id"
            :proyecto="proyecto"
            @add-expense="handleAddExpense"
            @edit-project="handleEditProject"
            @delete-project="handleDeleteProject"
          />
        </div>
      </div>
    </div>

    <!-- 🌊 Liquid Glass Modals -->
    <LiquidProjectModal
      v-if="showNewProjectModal"
      @close="showNewProjectModal = false"
      @save="handleCreateProject"
    />

    <LiquidExpenseModal
      v-if="showExpenseModal"
      :project-name="selectedProject?.nombre || ''"
      @close="closeExpenseModal"
      @save="handleSaveExpense"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PlusIcon,
  DocumentTextIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

import MainLayout from '@/components/MainLayout.vue'
import LiquidProjectCard from '@/components/LiquidProjectCard.vue'
import LiquidProjectModal from '@/components/LiquidProjectModal.vue'
import LiquidExpenseModal from '@/components/LiquidExpenseModal.vue'

// Datos reactivos
const proyectos = ref([])
const showNewProjectModal = ref(false)
const showExpenseModal = ref(false)
const selectedProject = ref(null)
const filterStatus = ref('all')

// Computed
const filteredProjects = computed(() => {
  return proyectos.value.filter(proyecto =>
    filterStatus.value === 'all' || proyecto.estado === filterStatus.value
  )
})

const stats = computed(() => {
  const totalProjects = proyectos.value.length
  const activeProjects = proyectos.value.filter(p => p.estado === 'activo').length
  const totalRevenue = proyectos.value.reduce((sum, p) => sum + p.montoFacturar, 0)
  const totalExpenses = proyectos.value.reduce((sum, p) =>
    sum + p.gastos.reduce((gastoSum, g) => gastoSum + g.monto, 0), 0
  )
  const totalProfit = proyectos.value.reduce((sum, p) =>
    sum + (p.gananciaNeta - p.gastos.reduce((gastoSum, g) => gastoSum + g.monto, 0)), 0
  )

  return {
    totalProjects,
    activeProjects,
    totalRevenue,
    totalExpenses,
    totalProfit
  }
})

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const handleCreateProject = (newProject) => {
  const proyecto = {
    ...newProject,
    id: `project_${Date.now()}`,
    gastos: [],
    fechaCreacion: new Date()
  }
  proyectos.value.unshift(proyecto)
  showNewProjectModal.value = false
}

const handleAddExpense = (proyecto) => {
  selectedProject.value = proyecto
  showExpenseModal.value = true
}

const handleSaveExpense = (gasto) => {
  const newGasto = {
    ...gasto,
    id: `expense_${Date.now()}`
  }

  const projectIndex = proyectos.value.findIndex(p => p.id === selectedProject.value.id)
  if (projectIndex !== -1) {
    proyectos.value[projectIndex].gastos.push(newGasto)
  }

  closeExpenseModal()
}

const closeExpenseModal = () => {
  showExpenseModal.value = false
  selectedProject.value = null
}

const handleEditProject = (proyecto) => {
  console.log('Editar proyecto:', proyecto)
}

const handleDeleteProject = (projectId) => {
  if (confirm('¿Estás seguro de eliminar este proyecto?')) {
    const index = proyectos.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      proyectos.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
/* Gradient background animation */
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-animated {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}
</style>