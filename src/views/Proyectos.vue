<template>
  <MainLayout
    page-title="Gestión de Proyectos"
    :show-header="false"
  >
    <!-- iOS-style Background -->
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <!-- iOS-style Header -->
      <div class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div class="max-w-none mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Proyectos
              </h1>
              <p class="text-gray-600 text-sm mt-1">Gestiona tus proyectos de manera profesional</p>
            </div>
            <button
              @click="showNewProjectModal = true"
              :disabled="loading"
              class="ios-btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <PlusIcon v-else class="w-5 h-5" />
              <span>{{ loading ? 'Cargando...' : 'Nuevo Proyecto' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-none mx-auto px-6 py-8">
        <!-- iOS-style Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div class="ios-stats-card group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base font-medium text-gray-500 uppercase tracking-wide mb-3">Total</p>
                <p class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ stats.totalProjects }}
                </p>
                <p class="text-base text-gray-500">Proyectos</p>
              </div>
              <div class="ios-icon-container bg-blue-500">
                <DocumentTextIcon class="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div class="ios-stats-card group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Activos</p>
                <p class="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {{ stats.activeProjects }}
                </p>
                <p class="text-sm text-gray-500">En progreso</p>
              </div>
              <div class="ios-icon-container bg-green-500">
                <FireIcon class="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div class="ios-stats-card group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Ingresos</p>
                <p class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ formatCurrency(stats.totalRevenue) }}
                </p>
                <p class="text-sm text-gray-500">Totales</p>
              </div>
              <div class="ios-icon-container bg-blue-500">
                <ArrowTrendingUpIcon class="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div class="ios-stats-card group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Gastos</p>
                <p class="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors">
                  {{ formatCurrency(stats.totalExpenses) }}
                </p>
                <p class="text-sm text-gray-500">Totales</p>
              </div>
              <div class="ios-icon-container bg-red-500">
                <ChartBarIcon class="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div class="ios-stats-card group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Ganancia</p>
                <p :class="`text-xl font-bold transition-colors ${stats.totalProfit >= 0 ? 'text-gray-900 group-hover:text-green-600' : 'text-gray-900 group-hover:text-red-500'}`">
                  {{ formatCurrency(stats.totalProfit) }}
                </p>
                <p class="text-sm text-gray-500">Real</p>
              </div>
              <div :class="`ios-icon-container ${stats.totalProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`">
                <CurrencyDollarIcon class="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- iOS-style Filters -->
        <div class="ios-card mb-6">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-700">Filtrar por estado:</span>
            <select
              v-model="filterStatus"
              class="ios-select"
            >
              <option value="all">Todos los proyectos</option>
              <option value="activo">Activos</option>
              <option value="completado">Completados</option>
              <option value="pausado">Pausados</option>
            </select>
          </div>
        </div>

        <!-- iOS-style Empty State -->
        <div v-if="filteredProjects.length === 0" class="text-center py-20">
          <div class="ios-card max-w-md mx-auto">
            <div class="ios-icon-container bg-gray-100 w-20 h-20 mx-auto mb-6">
              <DocumentTextIcon class="h-10 w-10 text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ proyectos.length === 0 ? 'No hay proyectos' : 'No hay proyectos con este filtro' }}
            </h3>
            <p class="text-gray-600 mb-8">
              {{ proyectos.length === 0 ? 'Comienza creando tu primer proyecto para gestionar tus trabajos' : 'Prueba con un filtro diferente para ver más proyectos' }}
            </p>
            <button
              v-if="proyectos.length === 0"
              @click="showNewProjectModal = true"
              class="ios-btn-primary"
            >
              <PlusIcon class="w-5 h-5" />
              Crear Primer Proyecto
            </button>
          </div>
        </div>

        <!-- Projects as Full Page Sections -->
        <div v-else class="space-y-8">
          <ProjectCard
            v-for="proyecto in filteredProjects"
            :key="proyecto.id"
            :proyecto="proyecto"
            @add-expense="handleAddExpense"
            @edit-project="handleEditProject"
            @delete-project="handleDeleteProject"
            @edit-expense="handleEditExpense"
            @delete-expense="handleDeleteExpense"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo Proyecto -->
    <NewProjectModal
      v-if="showNewProjectModal"
      @close="showNewProjectModal = false"
      @save="handleCreateProject"
    />

    <!-- Modal de Gastos -->
    <ExpenseModal
      v-if="showExpenseModal"
      :project-name="selectedProject?.nombre || ''"
      :current-expenses="selectedProject?.gastos || []"
      :editing-expense="editingExpense"
      @close="closeExpenseModal"
      @save="handleSaveExpense"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PlusIcon,
  DocumentTextIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

import MainLayout from '@/components/MainLayout.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import NewProjectModal from '@/components/NewProjectModal.vue'
import ExpenseModal from '@/components/ExpenseModal.vue'
import ProyectosService from '@/services/proyectosService.js'

// Datos reactivos
const proyectos = ref([])
const showNewProjectModal = ref(false)
const showExpenseModal = ref(false)
const selectedProject = ref(null)
const editingExpense = ref(null)
const filterStatus = ref('all')
const loading = ref(true)
const error = ref(null)

// Variable para el listener de tiempo real
let unsubscribeListener = null

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

const handleCreateProject = async (newProject) => {
  try {
    loading.value = true
    console.log('🚀 Creando nuevo proyecto...', newProject.nombre)

    await ProyectosService.crearProyecto({
      ...newProject,
      gastos: []
    })

    showNewProjectModal.value = false
    console.log('✅ Proyecto creado exitosamente')
  } catch (err) {
    console.error('❌ Error al crear proyecto:', err)
    error.value = `Error al crear proyecto: ${err.message}`
    alert(`Error al crear proyecto: ${err.message}`)
  } finally {
    loading.value = false
  }
}

const handleAddExpense = (proyecto) => {
  selectedProject.value = proyecto
  showExpenseModal.value = true
}

const handleSaveExpense = async (gasto) => {
  try {
    loading.value = true

    if (editingExpense.value) {
      // Modo edición: actualizar gasto existente
      console.log('✏️ Actualizando gasto existente...', editingExpense.value.id)
      await ProyectosService.actualizarGasto(selectedProject.value.id, editingExpense.value.id, gasto)
    } else {
      // Modo creación: agregar nuevo gasto
      console.log('💰 Agregando nuevo gasto...', gasto.concepto)
      await ProyectosService.agregarGasto(selectedProject.value.id, gasto)
    }

    closeExpenseModal()
    console.log('✅ Gasto guardado exitosamente')
  } catch (err) {
    console.error('❌ Error al guardar gasto:', err)
    error.value = `Error al guardar gasto: ${err.message}`
    alert(`Error al guardar gasto: ${err.message}`)
  } finally {
    loading.value = false
  }
}

const closeExpenseModal = () => {
  showExpenseModal.value = false
  selectedProject.value = null
  editingExpense.value = null
}

const handleEditProject = (proyecto) => {
  // Aquí se implementaría la edición del proyecto
  console.log('Editar proyecto:', proyecto)
}

const handleDeleteProject = async (projectId) => {
  if (confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) {
    try {
      loading.value = true
      console.log('🗑️ Eliminando proyecto...', projectId)

      await ProyectosService.eliminarProyecto(projectId)
      console.log('✅ Proyecto eliminado exitosamente')
    } catch (err) {
      console.error('❌ Error al eliminar proyecto:', err)
      error.value = `Error al eliminar proyecto: ${err.message}`
      alert(`Error al eliminar proyecto: ${err.message}`)
    } finally {
      loading.value = false
    }
  }
}

const handleEditExpense = (gasto) => {
  // Encontrar el proyecto que contiene este gasto
  const proyecto = proyectos.value.find(p =>
    p.gastos.some(g => g.id === gasto.id)
  )

  if (proyecto) {
    selectedProject.value = proyecto
    editingExpense.value = gasto
    showExpenseModal.value = true
  }
}

const handleDeleteExpense = async (gastoId) => {
  if (confirm('¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.')) {
    try {
      loading.value = true

      // Encontrar el proyecto que contiene este gasto
      const proyecto = proyectos.value.find(p =>
        p.gastos.some(g => g.id === gastoId)
      )

      if (proyecto) {
        console.log('🗑️ Eliminando gasto...', gastoId, 'del proyecto:', proyecto.id)
        await ProyectosService.eliminarGasto(proyecto.id, gastoId)
        console.log('✅ Gasto eliminado exitosamente')
      }
    } catch (err) {
      console.error('❌ Error al eliminar gasto:', err)
      error.value = `Error al eliminar gasto: ${err.message}`
      alert(`Error al eliminar gasto: ${err.message}`)
    } finally {
      loading.value = false
    }
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    console.log('🚀 Iniciando carga de proyectos desde Firebase...')
    loading.value = true

    // Configurar listener en tiempo real
    unsubscribeListener = ProyectosService.onProyectosChange((proyectosActualizados) => {
      proyectos.value = proyectosActualizados
      loading.value = false
      console.log(`🔄 Proyectos actualizados: ${proyectosActualizados.length}`)
    })

    console.log('✅ Listener de proyectos configurado')
  } catch (err) {
    console.error('❌ Error al cargar proyectos:', err)
    error.value = `Error al cargar proyectos: ${err.message}`
    loading.value = false

    // Fallback: intentar carga estática
    try {
      const proyectosCargados = await ProyectosService.obtenerProyectos()
      proyectos.value = proyectosCargados
      console.log('✅ Proyectos cargados (fallback estático)')
    } catch (fallbackErr) {
      console.error('❌ Error en fallback:', fallbackErr)
      alert('Error al conectar con Firebase. Verifique su conexión a internet.')
    }
  }
})

onUnmounted(() => {
  if (unsubscribeListener) {
    console.log('🔇 Desconectando listener de proyectos...')
    unsubscribeListener()
  }
})
</script>

<style scoped>
/* iOS Corporate Design System */

/* iOS-style Cards */
.ios-card {
  @apply bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/30 p-6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-card:hover {
  @apply shadow-lg border-gray-200/50 bg-white/80;
  transform: translateY(-2px);
}

/* iOS-style Stats Cards */
.ios-stats-card {
  @apply bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/30 p-6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 160px;
}

.ios-stats-card:hover {
  @apply shadow-lg border-gray-200/50 bg-white/80;
  transform: translateY(-3px) scale(1.02);
}

/* iOS-style Icon Container */
.ios-icon-container {
  @apply rounded-2xl p-3 shadow-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .ios-icon-container {
  transform: scale(1.1) rotate(5deg);
}

/* iOS-style Buttons */
.ios-btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ios-btn-primary:hover {
  @apply bg-blue-700 shadow-xl;
  transform: translateY(-2px) scale(1.05);
}

.ios-btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* iOS-style Select */
.ios-select {
  @apply px-4 py-2 bg-white/60 border border-gray-200 rounded-xl text-gray-700 font-medium;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400;
  @apply backdrop-blur-xl transition-all duration-300;
}

.ios-select:hover {
  @apply bg-white/80 border-gray-300;
}

/* iOS-style Animations */
@keyframes ios-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ios-card, .ios-stats-card {
  animation: ios-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stagger animation for cards */
.ios-stats-card:nth-child(1) { animation-delay: 0.1s; }
.ios-stats-card:nth-child(2) { animation-delay: 0.2s; }
.ios-stats-card:nth-child(3) { animation-delay: 0.3s; }
.ios-stats-card:nth-child(4) { animation-delay: 0.4s; }
.ios-stats-card:nth-child(5) { animation-delay: 0.5s; }

/* Mobile optimizations */
@media (max-width: 768px) {
  .ios-card, .ios-stats-card {
    @apply rounded-xl;
  }

  .ios-btn-primary {
    @apply rounded-xl px-4 py-2 text-sm;
  }

  .ios-icon-container {
    @apply rounded-xl;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-card {
    @apply bg-gray-900/70 border-gray-700/30;
  }

  .ios-card:hover {
    @apply bg-gray-900/80 border-gray-700/50;
  }

  .ios-stats-card {
    @apply bg-gray-900/60 border-gray-700/30;
  }

  .ios-stats-card:hover {
    @apply bg-gray-900/80 border-gray-700/50;
  }
}
</style>