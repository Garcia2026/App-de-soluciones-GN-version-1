<template>
  <MainLayout>
    <template #header-actions>
      <button class="btn-gold">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Transacción
      </button>
    </template>
    
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="glass-card-premium welcome-card">
          <div class="welcome-info">
            <h2 class="welcome-title">¡Bienvenido, {{ usuario }}!</h2>
            <p class="welcome-text">
              Último acceso: {{ ultimoAcceso }}
            </p>
            <div class="datetime-info">
              <div class="date-info">
                <span class="info-label">Fecha</span>
                <span class="info-value">{{ currentDate }}</span>
              </div>
              <div class="time-info">
                <span class="info-label">Hora</span>
                <span class="info-value">{{ currentTime }}</span>
              </div>
            </div>
          </div>
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span class="status-text">Sistema Operativo</span>
          </div>
        </div>
      </div>

      <!-- KPI Cards Section -->
      <KPICards
        :urgent-count="urgentNotifications.length"
        :overdue-count="paymentNotifications.filter(n => n.type === 'pago_atrasado').length"
        :overdue-amount="calculateTotalAmount(paymentNotifications.filter(n => n.type === 'pago_atrasado'))"
        :upcoming-count="paymentNotifications.filter(n => n.type === 'pago_proximo').length"
        :upcoming-amount="calculateTotalAmount(paymentNotifications.filter(n => n.type === 'pago_proximo'))"
        :schedule-count="scheduleNotifications.length"
        :schedule-completed-count="0"
        @navigate="navigateTo"
      />

      <!-- Notifications Panel -->
      <NotificationsPanel
        :notifications="notifications"
        :loading="notificationsLoading"
        :urgent-notifications="urgentNotifications"
        :high-priority-notifications="highPriorityNotifications"
        @refresh="refreshNotifications"
      />

      <!-- Financial Overview Cards -->
      <div class="cards-grid">
        <!-- Don Eduardo Balance Card -->
        <div class="glass-card-premium flight-card balance-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo balance-logo">DE</div>
              <div class="flight-details">
                <h3>Don Eduardo</h3>
                <p class="flight-time">Balance Actual</p>
              </div>
            </div>
            <div class="price">
              <span class="amount balance-amount">Q{{ formatNumber(saldoDonEduardo) }}</span>
              <button class="btn-action" @click="navigateTo('/finanzas')">Gestionar</button>
            </div>
          </div>
          <div class="flight-progress">
            <div class="progress-bar-modern">
              <div class="progress-fill-modern balance-progress" :style="{ width: getBalancePercentage() + '%' }"></div>
            </div>
            <div class="progress-info">
              <span class="progress-label">Disponible</span>
              <span class="progress-value">{{ Math.round(getBalancePercentage()) }}%</span>
            </div>
          </div>
        </div>

        <!-- Monthly Payment Card -->
        <div class="glass-card-premium flight-card payment-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo payment-logo">GA</div>
              <div class="flight-details">
                <h3>Ganancia Mensual</h3>
                <p class="flight-time">{{ obtenerMesActual() }} 2025</p>
              </div>
            </div>
            <div class="price">
              <span class="amount payment-amount">Q{{ formatNumber(gananciaDelMes) }}</span>
              <button class="btn-action payment-btn" @click="navigateTo('/finanzas')">Pagar</button>
            </div>
          </div>
          <div class="flight-status">
            <span class="status-badge-modern" :class="{ 'status-paid': gananciaPagada, 'status-pending': !gananciaPagada }">
              {{ gananciaPagada ? '✓ Pagado' : '⏱ Pendiente' }}
            </span>
          </div>
        </div>

        <!-- Loan Payment Card -->
        <div class="glass-card-premium flight-card loan-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo loan-logo">PR</div>
              <div class="flight-details">
                <h3>Préstamo Principal</h3>
                <p class="flight-time">{{ cuotaActual }}/{{ totalCuotas }} Cuotas</p>
              </div>
            </div>
            <div class="price">
              <span class="amount loan-amount">Q{{ formatNumber(montoPrestamo) }}</span>
              <button class="btn-action loan-btn" @click="navigateTo('/finanzas')">Pagar</button>
            </div>
          </div>
          <div class="flight-progress">
            <div class="progress-bar-modern">
              <div class="progress-fill-modern loan-progress" :style="{ width: getLoanProgress() + '%' }"></div>
            </div>
            <div class="progress-info">
              <span class="progress-label">Completado</span>
              <span class="progress-value">{{ getLoanProgress() }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="stats-section">
        <div class="glass-card-premium stats-card">
          <div class="stats-header">
            <h3 class="stats-title">Resumen Financiero del Mes</h3>
            <div class="stats-period">{{ obtenerMesActual() }} 2025</div>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon ingresos">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">Q{{ formatNumber(totalIngresosMes) }}</div>
                <div class="stat-label">Ingresos</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon gastos">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">Q{{ formatNumber(totalGastosMes) }}</div>
                <div class="stat-label">Gastos</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon balance">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">Q{{ formatNumber(balanceDelMes) }}</div>
                <div class="stat-label">Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Sales Chart -->
        <div class="glass-card-premium chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Ventas por Mes - 2025</h3>
            <div class="chart-legend">
              <span class="legend-item stores">🏪 Tiendas</span>
              <span class="legend-item services">🌱 Servicios</span>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="salesChart" class="chart-canvas"></canvas>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="glass-card-premium chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Balance Mensual</h3>
            <div class="chart-period">Últimos 6 meses</div>
          </div>
          <div class="chart-container">
            <canvas ref="balanceChart" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="schedule-section">
        <div class="glass-card-premium schedule-card">
          <div class="schedule-header">
            <h3 class="schedule-title">Cronograma de Pagos</h3>
            <button class="btn-gold-small" @click="navigateTo('/finanzas')">Administrar</button>
          </div>
          <div class="schedule-timeline">
            <div v-for="pago in proximosPagos" :key="pago.id" class="timeline-item">
              <div class="timeline-dot" :class="pago.prioridad"></div>
              <div class="timeline-content">
                <div class="timeline-title">{{ pago.titulo }}</div>
                <div class="timeline-date">{{ formatearFechaPago(pago.fecha) }}</div>
                <div class="timeline-amount">Q{{ formatNumber(pago.monto) }}</div>
              </div>
              <div class="timeline-status" :class="pago.estado">
                {{ pago.estado === 'pendiente' ? '⏱' : '✓' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <div class="glass-card-premium">
          <div class="activity-header">
            <h3 class="activity-title">Actividad Reciente</h3>
            <button class="btn-gold-small" @click="navigateTo('/finanzas')">Ver Todo</button>
          </div>
          <div class="activity-list">
            <div v-for="actividad in actividadesRecientes" :key="actividad.id" class="activity-item">
              <div class="activity-icon" :class="actividad.tipo">
                <svg v-if="actividad.tipo === 'ingreso'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <div class="activity-content">
                <div class="activity-description">{{ actividad.descripcion }}</div>
                <div class="activity-date">{{ formatearFecha(actividad.fecha) }}</div>
              </div>
              <div class="activity-amount" :class="actividad.tipo">
                {{ actividad.tipo === 'ingreso' ? '+' : '-' }}Q{{ formatNumber(actividad.monto) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db, isFirebaseReady } from '@/firebase'
import { obtenerDocumentos } from '@/services/firebaseService'
import MainLayout from '@/components/MainLayout.vue'
import KPICards from '@/components/KPICards.vue'
import NotificationsPanel from '@/components/NotificationsPanel.vue'
import { useNotifications } from '@/composables/useNotifications'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const router = useRouter()

// Notifications system
const {
  notifications,
  loading: notificationsLoading,
  urgentNotifications,
  highPriorityNotifications,
  paymentNotifications,
  scheduleNotifications,
  fetchAllNotifications
} = useNotifications()

// Reactive data
const currentTime = ref('')
const currentDate = ref('')
const usuario = ref('GN Soluciones')
const ultimoAcceso = ref('')
// Datos reales de Firebase
const saldoDonEduardo = ref(0)
const gananciaDelMes = ref(2000)
const gananciaPagada = ref(false)
const montoPrestamo = ref(3700)
const cuotaActual = ref(0)
const totalCuotas = ref(36)
const totalIngresosMes = ref(0)
const totalGastosMes = ref(0)
const balanceDelMes = computed(() => totalIngresosMes.value - totalGastosMes.value)
const actividadesRecientes = ref([])
const movimientos = ref([])
const movimientosDonEduardo = ref([])
const cargando = ref(true)
const isFirebaseConnected = ref(false)

// Chart refs
const salesChart = ref(null)
const balanceChart = ref(null)
let salesChartInstance = null
let balanceChartInstance = null

// Schedule data - Dynamic based on loan progress
const proximosPagos = computed(() => {
  const pagos = []
  const ahora = new Date()
  
  // Próximo pago de préstamo (cada 30 días)
  const diasDesdeUltimoPago = (ahora.getDate() - 1) // Asumiendo pagos el día 1
  let proximoPagoFecha = new Date(ahora)
  if (diasDesdeUltimoPago > 0) {
    proximoPagoFecha.setMonth(proximoPagoFecha.getMonth() + 1)
    proximoPagoFecha.setDate(1)
  }
  
  pagos.push({
    id: 1,
    titulo: `Pago Préstamo Cuota ${cuotaActual.value + 1}/${totalCuotas.value}`,
    fecha: proximoPagoFecha,
    monto: montoPrestamo.value,
    estado: 'pendiente',
    prioridad: 'alta'
  })
  
  // Ganancia de Don Eduardo (cada mes, día 15)
  const proximaGananciaFecha = new Date(ahora)
  if (ahora.getDate() > 15) {
    proximaGananciaFecha.setMonth(proximaGananciaFecha.getMonth() + 1)
  }
  proximaGananciaFecha.setDate(15)
  
  pagos.push({
    id: 2,
    titulo: 'Ganancia Don Eduardo',
    fecha: proximaGananciaFecha,
    monto: gananciaDelMes.value,
    estado: gananciaPagada.value ? 'completado' : 'pendiente',
    prioridad: 'media'
  })
  
  // Servicios básicos (cada mes, día 20)
  const proximosServiciosFecha = new Date(ahora)
  if (ahora.getDate() > 20) {
    proximosServiciosFecha.setMonth(proximosServiciosFecha.getMonth() + 1)
  }
  proximosServiciosFecha.setDate(20)
  
  pagos.push({
    id: 3,
    titulo: 'Servicios Básicos',
    fecha: proximosServiciosFecha,
    monto: 450,
    estado: 'pendiente',
    prioridad: 'baja'
  })
  
  // Ordenar por fecha más cercana
  return pagos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

// Constantes - valores reales según Excel
const saldoInicialDonEduardo = ref(61035.55) // Saldo inicial real agosto 2025
const limiteCredito = 100000

// Time update interval
let timeInterval = null

onMounted(async () => {
  updateDateTime()
  updateLastAccess()

  // Cargar datos financieros reales
  await cargarDatosFinancieros()

  // Cargar notificaciones
  await fetchAllNotifications()

  // Cargar actividad reciente
  await loadRecentActivity()

  // Inicializar gráficas
  await nextTick()
  initCharts()

  // Update time every second
  timeInterval = setInterval(updateDateTime, 1000)


})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  
  // Destruir gráficas
  if (salesChartInstance) {
    salesChartInstance.destroy()
  }
  if (balanceChartInstance) {
    balanceChartInstance.destroy()
  }
})

// Methods
const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('es-GT', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const updateLastAccess = () => {
  const now = new Date()
  ultimoAcceso.value = now.toLocaleDateString('es-GT', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const obtenerMesActual = () => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return meses[new Date().getMonth()]
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const date = fecha.toDate ? fecha.toDate() : new Date(fecha)
  return date.toLocaleDateString('es-GT', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatearFechaPago = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-GT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const getBalancePercentage = () => {
  const maxBalance = 100000
  return Math.min((saldoDonEduardo.value / maxBalance) * 100, 100)
}

const getLoanProgress = () => {
  return Math.round((cuotaActual.value / totalCuotas.value) * 100)
}

const navigateTo = (route) => {
  router.push(route)
}

// Firebase ya importado correctamente desde @/firebase

// Cargar datos financieros reales
const cargarDatosFinancieros = async () => {
  cargando.value = true;
  try {
    if (!isFirebaseReady()) {
      console.warn('⚠️ Firebase no está inicializado');
      isFirebaseConnected.value = false;
      return;
    }

    isFirebaseConnected.value = true;

    // Cargar movimientos financieros
    const movimientosSnapshot = await getDocs(collection(db, 'movimientos_financieros'));
    movimientos.value = movimientosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate() || new Date(doc.data().fecha)
    }));

    // Cargar movimientos de Don Eduardo
    const donEduardoSnapshot = await getDocs(collection(db, 'don_eduardo_movimientos'));
    movimientosDonEduardo.value = donEduardoSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate() || new Date(doc.data().fecha)
    }));

    // Calcular saldo de Don Eduardo
    const movimientosTotal = movimientosDonEduardo.value.reduce((total, mov) => {
      const monto = Number(mov.monto) || 0;
      switch (mov.tipo) {
        case 'prestamo': return total + monto;
        case 'pago_recibido': return total - monto;
        case 'pago_eduardo': return total - monto;
        case 'intereses': return total - monto;
        default: return total;
      }
    }, 0);
    saldoDonEduardo.value = saldoInicialDonEduardo.value + movimientosTotal;

    // Calcular ingresos y gastos del mes actual
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    const movimientosDelMes = movimientos.value.filter(mov => {
      const fechaMov = new Date(mov.fecha);
      return fechaMov >= inicioMes && fechaMov <= finMes;
    });

    totalIngresosMes.value = movimientosDelMes
      .filter(mov => mov.tipo === 'ingreso')
      .reduce((total, mov) => total + (Number(mov.monto) || 0), 0);

    totalGastosMes.value = movimientosDelMes
      .filter(mov => mov.tipo === 'gasto')
      .reduce((total, mov) => total + (Number(mov.monto) || 0), 0);

    // Calcular pagos de préstamo realizados TOTAL (no solo del mes actual)
    const pagosEnFirebase = movimientos.value
      .filter(mov => mov.categoria === 'Pago de Préstamo')
      .length;
    
    // Pagos previos antes del sistema + pagos registrados en Firebase  
    const pagosPrevios = 10; // Pagos realizados antes de implementar el sistema
    cuotaActual.value = pagosPrevios + pagosEnFirebase;
    
    console.log(`📊 Dashboard - Cuotas: ${pagosPrevios} previos + ${pagosEnFirebase} Firebase = ${cuotaActual.value}/36`);

  } catch (error) {
    console.error('❌ Error cargando datos financieros en Dashboard:', error);
    console.error('Detalles:', {
      message: error.message,
      stack: error.stack,
      firebaseReady: isFirebaseReady(),
      db: !!db
    });
    isFirebaseConnected.value = false;
    
    // Valores por defecto para mostrar algo
    saldoDonEduardo.value = 0;
    totalIngresosMes.value = 0;
    totalGastosMes.value = 0;
    cuotaActual.value = 0;
  } finally {
    cargando.value = false;
  }
};

const loadRecentActivity = async () => {
  try {
    if (!isFirebaseReady()) {
      console.warn('⚠️ Firebase no está inicializado para actividades');
      return;
    }
    
    // Cargar últimos movimientos financieros como actividad reciente
    const movimientosRef = collection(db, 'movimientos_financieros')
    const q = query(movimientosRef, orderBy('fecha', 'desc'), limit(5))
    const snapshot = await getDocs(q)
    
    actividadesRecientes.value = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        descripcion: data.concepto || data.descripcion || `${data.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} - ${data.categoria || 'General'}`,
        fecha: data.fecha?.toDate() || new Date(data.fecha),
        monto: Math.abs(Number(data.monto) || 0),
        tipo: data.tipo === 'ingreso' ? 'ingreso' : 'gasto'
      }
    })
    
    console.log('✨ Actividades recientes cargadas:', actividadesRecientes.value.length)
    
  } catch (error) {
    console.error('❌ Error cargando actividad reciente desde Firebase:', error)
    // Mantener vacío si no hay datos, no mock data
    actividadesRecientes.value = []
  }
}

// Chart functions
const initCharts = () => {
  const monthlyData = processDataForCharts();
  createSalesChart(monthlyData);
  createBalanceChart(monthlyData);
}

const processDataForCharts = () => {
  const monthlyData = {};
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Initialize months
  for (let i = 0; i < 12; i++) {
    const monthName = monthNames[i];
    monthlyData[monthName] = { ingresos: 0, gastos: 0, balance: 0 };
  }

  movimientos.value.forEach(mov => {
    const fecha = mov.fecha?.toDate ? mov.fecha.toDate() : new Date(mov.fecha);
    const monthName = monthNames[fecha.getMonth()];

    if (monthlyData[monthName]) {
      if (mov.tipo === 'ingreso') {
        monthlyData[monthName].ingresos += Number(mov.monto) || 0;
      } else if (mov.tipo === 'gasto') {
        monthlyData[monthName].gastos += Number(mov.monto) || 0;
      }
    }
  });

  // Calculate balance
  for (const month in monthlyData) {
    monthlyData[month].balance = monthlyData[month].ingresos - monthlyData[month].gastos;
  }

  return monthlyData;
};

const createSalesChart = (monthlyData) => {
  if (salesChart.value) {
    const labels = Object.keys(monthlyData);
    const ingresosData = labels.map(m => monthlyData[m].ingresos);
    const gastosData = labels.map(m => monthlyData[m].gastos);

    const ctx = salesChart.value.getContext('2d')
    salesChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresosData,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: 'Gastos',
            data: gastosData,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#051F20',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#235347',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: Q${formatNumber(context.parsed.y)}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                weight: '600'
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            ticks: {
              color: '#6B7280',
              callback: function(value) {
                return 'Q' + (value/1000) + 'k'
              }
            }
          }
        }
      }
    })
  }
}

const createBalanceChart = (monthlyData) => {
  if (balanceChart.value) {
    const labels = Object.keys(monthlyData).slice(-6); // Last 6 months
    const balanceData = labels.map(m => monthlyData[m].balance);

    const ctx = balanceChart.value.getContext('2d')
    balanceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Balance Mensual',
          data: balanceData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#051F20',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#235347',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `Balance: Q${formatNumber(context.parsed.y)}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                weight: '600'
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            ticks: {
              color: '#6B7280',
              callback: function(value) {
                return 'Q' + (value/1000) + 'k'
              }
            }
          }
        }
      }
    })
  }
}

const updateCharts = () => {
  // Actualizar datos en tiempo real si es necesario
  try {
    if (salesChartInstance && salesChartInstance.canvas && salesChartInstance.canvas.ownerDocument) {
      salesChartInstance.update()
    }
    if (balanceChartInstance && balanceChartInstance.canvas && balanceChartInstance.canvas.ownerDocument) {
      balanceChartInstance.update()
    }
  } catch (error) {
    console.warn('Error actualizando gráficos:', error.message)
  }
}

// Notifications methods
const refreshNotifications = async () => {
  await fetchAllNotifications()
}

const calculateTotalAmount = (notifs) => {
  return notifs.reduce((total, n) => total + (n.amount || 0), 0)
}
</script>

<style scoped>
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  space-y: 2rem;
}

/* === WELCOME SECTION === */
.welcome-section {
  margin-bottom: 3rem;
}

.welcome-card {
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
}

.welcome-info {
  flex: 1;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #051F20 0%, #235347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.welcome-text {
  color: rgba(5, 31, 32, 0.6);
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.datetime-info {
  display: flex;
  gap: 2rem;
}

.date-info, .time-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #051F20;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
  animation: pulse-glow 2s infinite;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 24px rgba(34, 197, 94, 0.6);
  }
}

/* === FLIGHT BOOKING STYLE CARDS === */
.cards-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}

.flight-card {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.flight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(5, 31, 32, 0.12);
}

.flight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.airline-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.airline-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.balance-logo {
  background: linear-gradient(135deg, #051F20 0%, #0B2B26 100%);
  color: white;
  border: 2px solid rgba(5, 31, 32, 0.1);
}

.payment-logo {
  background: linear-gradient(135deg, #235347 0%, #8CB69B 100%);
  color: white;
  border: 2px solid rgba(35, 83, 71, 0.1);
}

.loan-logo {
  background: linear-gradient(135deg, #163832 0%, #235347 100%);
  color: white;
  border: 2px solid rgba(22, 56, 50, 0.1);
}

.flight-details h3 {
  font-weight: 600;
  color: #051F20;
  margin: 0;
  font-size: 1.125rem;
}

.flight-time {
  color: #6B7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.price {
  text-align: right;
}

.amount {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.balance-amount {
  background: linear-gradient(135deg, #051F20 0%, #0B2B26 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.payment-amount {
  background: linear-gradient(135deg, #235347 0%, #8CB69B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loan-amount {
  background: linear-gradient(135deg, #163832 0%, #235347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-action {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-action {
  background: linear-gradient(135deg, #051F20 0%, #0B2B26 100%);
  color: white;
}

.payment-btn {
  background: linear-gradient(135deg, #235347 0%, #8CB69B 100%);
  color: white;
}

.loan-btn {
  background: linear-gradient(135deg, #163832 0%, #235347 100%);
  color: white;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* === MODERN PROGRESS BARS === */
.flight-progress {
  margin-top: 1.5rem;
}

.progress-bar-modern {
  width: 100%;
  height: 8px;
  background: rgba(5, 31, 32, 0.08);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  position: relative;
}

.progress-fill-modern {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill-modern::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

.balance-progress {
  background: linear-gradient(90deg, #051F20 0%, #235347 100%);
}

.loan-progress {
  background: linear-gradient(90deg, #163832 0%, #8CB69B 100%);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 0.875rem;
  color: rgba(5, 31, 32, 0.6);
  font-weight: 500;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #051F20;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === MODERN STATUS BADGES === */
.flight-status {
  margin-top: 1.5rem;
}

.status-badge-modern {
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-paid {
  background: linear-gradient(135deg, #DAFDE2 0%, #8CB69B 100%);
  color: #051F20;
  border: 1px solid rgba(35, 83, 71, 0.3);
}

.status-pending {
  background: linear-gradient(135deg, #E8F5F0 0%, #D1E7DD 100%);
  color: #163832;
  border: 1px solid rgba(22, 56, 50, 0.3);
}

/* === STATS SECTION === */
.stats-section {
  margin-bottom: 3rem;
}

.stats-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stats-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #051F20 0%, #235347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
}

.stats-period {
  font-size: 0.875rem;
  color: rgba(5, 31, 32, 0.6);
  font-weight: 600;
  background: rgba(212, 175, 55, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(5, 31, 32, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 31, 32, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon.ingresos {
  background: linear-gradient(135deg, #DAFDE2 0%, #8CB69B 100%);
  color: #051F20;
  border: 1px solid rgba(35, 83, 71, 0.2);
}

.stat-icon.gastos {
  background: linear-gradient(135deg, #E8F5F0 0%, #D1E7DD 100%);
  color: #163832;
  border: 1px solid rgba(22, 56, 50, 0.2);
}

.stat-icon.balance {
  background: linear-gradient(135deg, #235347 0%, #8CB69B 100%);
  color: white;
  border: 1px solid rgba(35, 83, 71, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #051F20;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.stat-label {
  color: rgba(5, 31, 32, 0.6);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* === CHARTS SECTION === */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-card {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6B7280;
}

.chart-period {
  font-size: 0.875rem;
  color: rgba(5, 31, 32, 0.6);
  font-weight: 600;
  background: rgba(212, 175, 55, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

/* === SCHEDULE SECTION === */
.schedule-section {
  margin-bottom: 3rem;
}

.schedule-card {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.schedule-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #051F20 0%, #235347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
}

.schedule-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(5, 31, 32, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 31, 32, 0.08);
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
}

.timeline-dot.alta {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  animation: pulse-red 2s infinite;
}

.timeline-dot.media {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  animation: pulse-yellow 2s infinite;
}

.timeline-dot.baja {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  animation: pulse-green 2s infinite;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  color: #051F20;
  margin-bottom: 0.5rem;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.5rem;
}

.timeline-amount {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.timeline-status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.timeline-status.pendiente {
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.timeline-status.completado {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 2px solid rgba(34, 197, 94, 0.3);
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 16px rgba(220, 38, 38, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 24px rgba(220, 38, 38, 0.6);
  }
}

@keyframes pulse-yellow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 16px rgba(217, 119, 6, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 24px rgba(217, 119, 6, 0.6);
  }
}

@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 16px rgba(22, 163, 74, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 24px rgba(22, 163, 74, 0.6);
  }
}

/* === ACTIVITY SECTION === */
.activity-section {
  margin-bottom: 2rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin: 0;
}

.activity-list {
  space-y: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon.ingreso {
  background: #dcfce7;
  color: #166534;
}

.activity-icon.gasto {
  background: #fee2e2;
  color: #dc2626;
}

.activity-content {
  flex: 1;
}

.activity-description {
  font-weight: 500;
  color: #051F20;
  margin-bottom: 0.25rem;
}

.activity-date {
  font-size: 0.875rem;
  color: #6B7280;
}

.activity-amount {
  font-weight: 600;
}

.activity-amount.ingreso {
  color: #166534;
}

.activity-amount.gasto {
  color: #dc2626;
}

/* === IMPROVED RESPONSIVE === */

/* Tablet Landscape - Gráficos más compactos */
@media (max-width: 1024px) {
  .chart-container {
    height: 280px !important;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 0.75rem !important;
    max-width: 100% !important;
  }

  .welcome-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem !important;
    margin-bottom: 1rem;
  }
  
  .welcome-title {
    font-size: 1.375rem !important;
    line-height: 1.2;
  }
  
  .welcome-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .datetime-info {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .info-value {
    font-size: 0.8rem !important;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .flight-card {
    padding: 1.25rem !important;
    min-height: auto;
  }
  
  .flight-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .airline-info {
    order: 1;
  }
  
  .price {
    order: 2;
    text-align: left !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .amount {
    font-size: 1.5rem !important;
    margin-bottom: 0;
  }
  
  .btn-action {
    padding: 0.6rem 1.2rem !important;
    font-size: 0.85rem !important;
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.25rem !important;
    min-height: auto;
  }
  
  .stat-icon {
    width: 44px !important;
    height: 44px !important;
  }
  
  .stat-value {
    font-size: 1.375rem !important;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-card {
    padding: 1.25rem !important;
  }
  
  .chart-container {
    height: 250px !important;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .chart-title {
    font-size: 1.125rem !important;
  }
  
  .chart-legend {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .legend-item {
    font-size: 0.85rem !important;
  }
  
  .schedule-card {
    padding: 1.25rem !important;
  }
  
  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.25rem !important;
    position: relative;
  }
  
  .timeline-content {
    width: 100%;
    padding-right: 2.5rem;
  }
  
  .timeline-status {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 0;
  }
  
  .activity-content {
    width: 100%;
  }
  
  .activity-amount {
    align-self: flex-end;
    font-size: 1rem !important;
    font-weight: 700;
  }
}

/* === SMALL MOBILE - Gráficos más compactos === */
@media (max-width: 640px) {
  .chart-container {
    height: 220px !important;
  }
}

/* === EXTRA SMALL MOBILE === */
@media (max-width: 480px) {
  .dashboard-content {
    padding: 0.5rem !important;
  }
  
  .welcome-card,
  .flight-card,
  .stats-card,
  .chart-card,
  .schedule-card {
    padding: 1rem !important;
    margin-bottom: 0.75rem;
  }
  
  .amount {
    font-size: 1.25rem !important;
  }
  
  .stat-value {
    font-size: 1.125rem !important;
  }

  .chart-container {
    height: 200px !important;
  }

  .airline-logo,
  .stat-icon {
    width: 40px !important;
    height: 40px !important;
  }
}

/* === VERY SMALL DEVICES (iPhone SE, etc) === */
@media (max-width: 375px) {
  .chart-container {
    height: 180px !important;
  }
}

/* === BETTER TOUCH TARGETS === */
@media (hover: none) and (pointer: coarse) {
  .btn-action,
  .btn-gold-small {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 0.75rem 1.25rem !important;
  }
  
  .mobile-menu-btn {
    min-height: 48px !important;
    min-width: 48px !important;
  }
  
  /* Remove hover effects on touch devices */
  .flight-card:hover,
  .stat-item:hover,
  .timeline-item:hover {
    transform: none !important;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>