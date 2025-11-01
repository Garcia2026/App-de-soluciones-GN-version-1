<template>
  <MainLayout>
    <template #header-actions>
      <button @click="cargarBitacora" class="btn-refresh" :disabled="loading">
        <RefreshCw :class="{ 'spinning': loading }" :size="18" />
        Actualizar
      </button>
    </template>

    <div class="bitacora-container">
      <!-- Header -->
      <div class="bitacora-header">
        <div class="header-content">
          <ScrollText :size="32" class="header-icon" />
          <div>
            <h1 class="page-title">Bitácora de Auditoría</h1>
            <p class="page-subtitle">Historial completo de actividades del sistema</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">
            <User :size="16" />
            Usuario
          </label>
          <select v-model="filtros.usuario" class="filter-select">
            <option value="">Todos los usuarios</option>
            <option v-for="usuario in usuarios" :key="usuario" :value="usuario">
              {{ usuario }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <Activity :size="16" />
            Acción
          </label>
          <select v-model="filtros.accion" class="filter-select">
            <option value="">Todas las acciones</option>
            <option value="login">Inicio de sesión</option>
            <option value="logout">Cierre de sesión</option>
            <option value="cambio_password">Cambio de contraseña</option>
            <option value="crear_gasto">Crear gasto</option>
            <option value="crear_ingreso">Crear ingreso</option>
            <option value="actualizar_gasto">Actualizar gasto</option>
            <option value="eliminar_gasto">Eliminar gasto</option>
            <option value="crear_tienda">Crear tienda</option>
            <option value="actualizar_tienda">Actualizar tienda</option>
            <option value="eliminar_tienda">Eliminar tienda</option>
            <option value="crear_cotizacion">Crear cotización</option>
            <option value="solicitud_recuperacion">Solicitud recuperación</option>
            <option value="recuperacion_password">Recuperación contraseña</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <Calendar :size="16" />
            Fecha
          </label>
          <input
            v-model="filtros.fecha"
            type="date"
            class="filter-input"
          />
        </div>

        <button @click="limpiarFiltros" class="btn-clear-filters">
          <X :size="16" />
          Limpiar
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon login">
            <LogIn :size="24" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Inicios de Sesión</p>
            <p class="stat-value">{{ stats.logins }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon action">
            <Activity :size="24" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Acciones Totales</p>
            <p class="stat-value">{{ stats.total }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Usuarios Activos</p>
            <p class="stat-value">{{ stats.usuariosActivos }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon today">
            <Clock :size="24" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Acciones Hoy</p>
            <p class="stat-value">{{ stats.hoy }}</p>
          </div>
        </div>
      </div>

      <!-- Tabla de Bitácora -->
      <div class="bitacora-table-container">
        <div v-if="loading" class="loading-state">
          <Loader class="spinner" :size="32" />
          <p>Cargando bitácora...</p>
        </div>

        <div v-else-if="registrosFiltrados.length === 0" class="empty-state">
          <FileSearch :size="48" />
          <p>No se encontraron registros</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="bitacora-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalles</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registro in registrosFiltrados" :key="registro.id">
                <td class="col-fecha">
                  <Calendar :size="14" class="icon-inline" />
                  {{ formatearFecha(registro.fecha) }}
                </td>
                <td class="col-usuario">
                  <User :size="14" class="icon-inline" />
                  {{ registro.usuarioNombre }}
                </td>
                <td class="col-accion">
                  <span :class="['badge-accion', getAccionClass(registro.accion)]">
                    {{ formatearAccion(registro.accion) }}
                  </span>
                </td>
                <td class="col-detalles">
                  {{ registro.detalles || '-' }}
                </td>
                <td class="col-actions">
                  <button
                    @click="verDetalles(registro)"
                    class="btn-icon"
                    title="Ver detalles"
                  >
                    <Eye :size="16" />
                  </button>
                  <!-- Nuevo botón de eliminar -->
                  <button
                    v-if="isAdmin && currentUser?.nombre === 'Byron'"
                    @click="eliminarRegistro(registro.id)"
                    class="btn-icon text-red-500 hover:bg-red-100"
                    title="Eliminar registro"
                  >
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="registrosFiltrados.length > 0" class="pagination">
        <button
          @click="paginaActual--"
          :disabled="paginaActual === 1"
          class="btn-pagination"
        >
          <ChevronLeft :size="16" />
          Anterior
        </button>
        <span class="pagination-info">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </span>
        <button
          @click="paginaActual++"
          :disabled="paginaActual === totalPaginas"
          class="btn-pagination"
        >
          Siguiente
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <Transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalles del Registro</h3>
            <button @click="cerrarModal" class="btn-close">
              <X :size="20" />
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <strong>Usuario:</strong>
              <span>{{ registroSeleccionado?.usuarioNombre }}</span>
            </div>
            <div class="detail-row">
              <strong>Acción:</strong>
              <span>{{ formatearAccion(registroSeleccionado?.accion) }}</span>
            </div>
            <div class="detail-row">
              <strong>Fecha y Hora:</strong>
              <span>{{ formatearFechaCompleta(registroSeleccionado?.fecha) }}</span>
            </div>
            <div class="detail-row">
              <strong>Detalles:</strong>
              <span>{{ registroSeleccionado?.detalles || '-' }}</span>
            </div>
            <div v-if="registroSeleccionado?.datos && Object.keys(registroSeleccionado.datos).length > 0" class="detail-row">
              <strong>Datos Adicionales:</strong>
              <pre class="json-data">{{ JSON.stringify(registroSeleccionado.datos, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { db } from '@/firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import MainLayout from '@/components/MainLayout.vue'
import { useToast } from 'vue-toastification'
import {
  ScrollText, User, Activity, Calendar, X, LogIn, Users, Clock, FileSearch,
  Eye, ChevronLeft, ChevronRight, RefreshCw, Loader, Trash2
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { currentUser, isAdmin } = useAuth()

const loading = ref(true)
const registros = ref([])
const usuarios = ref([])
const mostrarModal = ref(false)
const registroSeleccionado = ref(null)
const paginaActual = ref(1)
const registrosPorPagina = 50

const filtros = ref({
  usuario: '',
  accion: '',
  fecha: ''
})

const stats = computed(() => {
  const logins = registros.value.filter(r => r.accion === 'login').length
  const hoy = registros.value.filter(r => {
    const fecha = r.fecha?.toDate?.() || new Date(r.timestamp)
    return fecha.toDateString() === new Date().toDateString()
  }).length
  const usuariosSet = new Set(registros.value.map(r => r.usuarioId))

  return {
    total: registros.value.length,
    logins,
    hoy,
    usuariosActivos: usuariosSet.size
  }
})

const registrosFiltrados = computed(() => {
  let resultado = [...registros.value]

  if (filtros.value.usuario) {
    resultado = resultado.filter(r => r.usuarioNombre === filtros.value.usuario)
  }

  if (filtros.value.accion) {
    resultado = resultado.filter(r => r.accion === filtros.value.accion)
  }

  if (filtros.value.fecha) {
    resultado = resultado.filter(r => {
      const fecha = r.fecha?.toDate?.() || new Date(r.timestamp)
      const fechaStr = fecha.toISOString().split('T')[0]
      return fechaStr === filtros.value.fecha
    })
  }

  // Paginación
  const inicio = (paginaActual.value - 1) * registrosPorPagina
  const fin = inicio + registrosPorPagina
  return resultado.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  let total = registros.value
  if (filtros.value.usuario || filtros.value.accion || filtros.value.fecha) {
    total = registros.value.filter(r => {
      let match = true
      if (filtros.value.usuario) match = match && r.usuarioNombre === filtros.value.usuario
      if (filtros.value.accion) match = match && r.accion === filtros.value.accion
      if (filtros.value.fecha) {
        const fecha = r.fecha?.toDate?.() || new Date(r.timestamp)
        const fechaStr = fecha.toISOString().split('T')[0]
        match = match && fechaStr === filtros.value.fecha
      }
      return match
    })
  }
  return Math.ceil(total.length / registrosPorPagina) || 1
})

const cargarBitacora = async () => {
  loading.value = true
  try {
    const q = query(collection(db, 'bitacora'), orderBy('fecha', 'desc'))
    const snapshot = await getDocs(q)

    registros.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Extraer usuarios únicos
    const usuariosSet = new Set(registros.value.map(r => r.usuarioNombre))
    usuarios.value = Array.from(usuariosSet).sort()

    toast.success(`${registros.value.length} registros cargados`)
  } catch (error) {
    console.error('Error cargando bitácora:', error)
    toast.error('Error al cargar la bitácora')
  } finally {
    loading.value = false
  }
}

const eliminarRegistro = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este registro de la bitácora? Esta acción es irreversible.')) {
    return
  }

  try {
    await deleteDoc(doc(db, 'bitacora', id))
    toast.success('Registro eliminado correctamente.')
    await cargarBitacora() // Recargar la bitácora para actualizar la vista
  } catch (error) {
    console.error('Error eliminando registro:', error)
    toast.error('Error al eliminar el registro.')
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  const date = fecha?.toDate?.() || new Date(fecha)
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '-'
  const date = fecha?.toDate?.() || new Date(fecha)
  return date.toLocaleString('es-GT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatearAccion = (accion) => {
  const acciones = {
    'login': 'Inicio de Sesión',
    'logout': 'Cierre de Sesión',
    'cambio_password': 'Cambio de Contraseña',
    'crear_gasto': 'Crear Gasto',
    'crear_ingreso': 'Crear Ingreso',
    'actualizar_gasto': 'Actualizar Gasto',
    'eliminar_gasto': 'Eliminar Gasto',
    'crear_tienda': 'Crear Tienda',
    'actualizar_tienda': 'Actualizar Tienda',
    'eliminar_tienda': 'Eliminar Tienda',
    'crear_cotizacion': 'Crear Cotización',
    'solicitud_recuperacion': 'Solicitud Recuperación',
    'recuperacion_password': 'Recuperación Contraseña'
  }
  return acciones[accion] || accion
}

const getAccionClass = (accion) => {
  if (accion === 'login') return 'login'
  if (accion === 'logout') return 'logout'
  if (accion.includes('crear')) return 'crear'
  if (accion.includes('eliminar')) return 'eliminar'
  if (accion.includes('actualizar')) return 'actualizar'
  return 'default'
}

const verDetalles = (registro) => {
  registroSeleccionado.value = registro
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const limpiarFiltros = () => {
  filtros.value = {
    usuario: '',
    accion: '',
    fecha: ''
  }
  paginaActual.value = 1
}

onMounted(async () => {
  // Verificar que es administrador
  if (!currentUser.value) { // Solo requiere autenticación, no admin para ver
    toast.error('No tienes permisos para acceder a esta sección')
    router.push('/dashboard')
    return
  }

  await cargarBitacora()
})
</script>

<style scoped>
.bitacora-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.bitacora-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  color: #d4af37;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #051f20;
  margin: 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* Filtros */
.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #051f20;
}

.filter-select,
.filter-input {
  padding: 0.625rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #d4af37;
}

.btn-clear-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #051f20;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
}

.btn-clear-filters:hover {
  background: white;
  border-color: #d4af37;
  color: #d4af37;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #051f20;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  border-color: #d4af37;
  color: #d4af37;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
}

.stat-icon.login {
  background: #dbeafe;
  color: #1e40af;
}

.stat-icon.action {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.users {
  background: #ddd6fe;
  color: #7c3aed;
}

.stat-icon.today {
  background: #d1fae5;
  color: #059669;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #051f20;
  margin: 0;
}

/* Tabla */
.bitacora-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner {
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.table-wrapper {
  overflow-x: auto;
}

.bitacora-table {
  width: 100%;
  border-collapse: collapse;
}

.bitacora-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.bitacora-table th {
  text-align: left;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #051f20;
}

.bitacora-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
}

.bitacora-table tbody tr:hover {
  background: #f9fafb;
}

.icon-inline {
  vertical-align: middle;
  margin-right: 0.5rem;
  color: #d4af37;
}

.badge-accion {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-accion.login {
  background: #dbeafe;
  color: #1e40af;
}

.badge-accion.logout {
  background: #fee2e2;
  color: #991b1b;
}

.badge-accion.crear {
  background: #d1fae5;
  color: #059669;
}

.badge-accion.eliminar {
  background: #fee2e2;
  color: #dc2626;
}

.badge-accion.actualizar {
  background: #fef3c7;
  color: #d97706;
}

.badge-accion.default {
  background: #f3f4f6;
  color: #374151;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;
  color: #051f20;
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #051f20;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  border-color: #d4af37;
  color: #d4af37;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  font-weight: 600;
  color: #051f20;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #051f20;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #051f20;
}

.modal-body {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row strong {
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-row span {
  font-size: 1rem;
  color: #051f20;
}

.json-data {
  background: #1f2937;
  color: #10b981;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  overflow-x: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .bitacora-container {
    padding: 1rem;
  }

  .filters-section {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .bitacora-table {
    font-size: 0.75rem;
  }

  .bitacora-table th,
  .bitacora-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
