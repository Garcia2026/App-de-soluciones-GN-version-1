<template>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-[0.08]" aria-hidden="true"></div>
    <div class="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-[0.08]" aria-hidden="true"></div>
    <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-[0.08]" aria-hidden="true"></div>
  </div>

  <div class="relative z-10 px-4 py-8 max-w-7xl mx-auto text-gray-200">
    <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 glow-emerald text-center mb-8 animate-[fade-in-down_0.6s_ease-out]">
      Control de Gastos y Análisis Financiero
    </h2>

    <div class="glass-container rounded-2xl shadow-lg border border-gray-700/30 p-5 mb-8 animate-[fade-in_0.6s_ease-out]">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select v-model="selectedMonth" @change="filterByDate" class="input-primary select-input w-full sm:w-48">
            <option value="" class="option-dark text-gray-500">Todo el Año</option>
            <option v-for="month in months" :key="month.value" :value="month.value" class="option-dark">
              {{ month.name }}
            </option>
          </select>
          <select v-model="selectedYear" @change="filterByDate" class="input-primary select-input w-full sm:w-32">
            <option v-for="year in years" :key="year" :value="year" class="option-dark">{{ year }}</option>
          </select>
        </div>
        <div class="flex flex-wrap justify-end gap-3 w-full md:w-auto">
          <button @click="showAddCapitalModal = true; resetCapitalForm()" class="btn-secondary tech-btn relative overflow-hidden flex-shrink-0">
             <span class="z-10 relative flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Capital
            </span>
             <span class="tech-btn-bg absolute inset-0"></span>
          </button>
           <button @click="showAddPrestamoModal = true; resetPrestamoForm()" class="btn-secondary tech-btn relative overflow-hidden flex-shrink-0">
             <span class="z-10 relative flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Préstamo
            </span>
             <span class="tech-btn-bg absolute inset-0"></span>
          </button>
          <button @click="showAddExpenseModal = true; resetForm()" class="btn-primary flex-shrink-0 tech-btn relative overflow-hidden">
            <span class="z-10 relative flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Registrar Gasto
            </span>
            <span class="tech-btn-bg absolute inset-0"></span>
          </button>
          <button @click="exportToExcel" class="btn-secondary flex-shrink-0 opacity-70 cursor-not-allowed" disabled title="Pronto estará disponible la exportación.">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar (Pronto)
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de Error -->
    <div v-if="errorMessage" class="bg-red-900/40 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg shadow-md shadow-red-900/20 mb-6 flex items-center justify-between">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMessage }}
      </div>
      <button @click="errorMessage = ''" class="text-red-400 hover:text-red-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      <div class="summary-card border-emerald-500 animate-[fade-in_0.6s_ease-out]">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="summary-title">Ingresos (Pagados)</h3>
            <p class="summary-amount text-emerald-400">{{ formatearDinero(ingresosPeriodoTotal) }}</p>
          </div>
          <div class="summary-icon-bg bg-emerald-900/30">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
         <p class="summary-comparison" v-if="selectedMonth !== '' && mesesAnterioresData.ingresos !== null">
            <span :class="ingresosDiferencia >= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-medium">
              {{ ingresosDiferencia === Infinity ? '>1000' : (ingresosDiferencia >= 0 ? '+' : '') + ingresosDiferencia }}%
            </span> vs mes anterior
          </p>
      </div>
      <div class="summary-card border-cyan-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.05s">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="summary-title">Ingresos Proyectados</h3>
            <p class="summary-amount text-cyan-400">{{ formatearDinero(ingresosProyectadosPeriodoTotal) }}</p>
          </div>
          <div class="summary-icon-bg bg-cyan-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M3 10h18M7 15h1m4 0h1m5-11l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
         <p class="summary-comparison" v-if="selectedMonth !== '' && mesesAnterioresData.ingresosProyectados !== null">
            <span :class="ingresosProyectadosDiferencia >= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-medium">
              {{ ingresosProyectadosDiferencia === Infinity ? '>1000' : (ingresosProyectadosDiferencia >= 0 ? '+' : '') + ingresosProyectadosDiferencia }}%
            </span> vs mes anterior
          </p>
      </div>
      <div class="summary-card border-red-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.1s">
         <div class="flex justify-between items-start">
          <div>
            <h3 class="summary-title">Gastos</h3>
            <p class="summary-amount text-red-400">{{ formatearDinero(gastosPeriodoTotal) }}</p>
          </div>
          <div class="summary-icon-bg bg-red-900/30">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
        </div>
         <p class="summary-comparison" v-if="selectedMonth !== '' && mesesAnterioresData.gastos !== null">
            <span :class="gastosDiferencia <= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-medium">
              {{ gastosDiferencia === Infinity ? '>1000' : (gastosDiferencia >= 0 ? '+' : '') + gastosDiferencia }}%
            </span> vs mes anterior
          </p>
      </div>
      <div class="summary-card border-blue-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.2s">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="summary-title">Ganancia Neta</h3>
            <p class="summary-amount" :class="gananciaNeta >= 0 ? 'text-blue-400' : 'text-red-400'">
              {{ formatearDinero(gananciaNeta) }}
            </p>
          </div>
          <div class="summary-icon-bg bg-blue-900/30">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
        </div>
         <p class="summary-comparison" v-if="selectedMonth !== '' && mesesAnterioresData.gananciaNeta !== null">
            <span :class="gananciaNetaDiferencia >= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-medium">
              {{ gananciaNetaDiferencia === Infinity || gananciaNetaDiferencia === -Infinity ? 'Cambio Grande' : (gananciaNetaDiferencia >= 0 ? '+' : '') + gananciaNetaDiferencia }}%
            </span> vs mes anterior
          </p>
      </div>
      <div class="summary-card border-purple-500 animate-[fade-in_0.6s_ease-out]" style="animation-delay: 0.3s">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="summary-title">Margen Op.</h3>
            <p class="summary-amount" :class="margenGanancia >= 25 ? 'text-purple-400' : margenGanancia >=0 ? 'text-yellow-400' : 'text-red-400'">
              {{ margenGanancia.toFixed(1) }}%
            </p>
          </div>
          <div class="summary-icon-bg bg-purple-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </div>
        <div class="mt-3 w-full bg-gray-700 rounded-full h-2.5">
           <div class="h-2.5 rounded-full transition-all duration-500 ease-out"
               :class="margenGanancia >= 40 ? 'bg-emerald-500' : margenGanancia >= 20 ? 'bg-blue-500' : margenGanancia >=0 ? 'bg-purple-500' : 'bg-red-500'"
               :style="{ width: `${Math.min(Math.max(0, margenGanancia), 100)}%` }">
           </div>
        </div>
        <p v-if="margenGanancia < 0" class="text-xs text-red-500 mt-1">Pérdida operativa en el periodo.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="chart-container animate-[fade-in-up_0.6s_ease-out]">
          <h3 class="chart-title">{{ mainChartTitle }}</h3>
          <div class="chart-wrapper">
            <template v-if="cargando"> <div class="loading-placeholder">Cargando gráfico...</div> </template>
            <template v-else-if="mainFinancialChartData.datasets.length > 0 && mainFinancialChartData.labels.length > 0">
              <component :is="mainChartComponent" :data="mainFinancialChartData" :options="mainFinancialChartOptions" :key="mainChartType" />
            </template>
            <template v-else> <div class="no-data-placeholder">No hay datos suficientes para el gráfico.</div> </template>
          </div>
        </div>
      <div class="chart-container animate-[fade-in-up_0.6s_ease-out]" style="animation-delay: 0.1s">
        <h3 class="chart-title">Distribución de Gastos por Categoría</h3>
          <div class="chart-wrapper">
            <template v-if="cargando"> <div class="loading-placeholder">Cargando gráfico...</div> </template>
            <template v-else-if="doughnutChartData.datasets.length > 0 && doughnutChartData.datasets[0]?.data.some(val => val > 0)">
                <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
            </template>
            <template v-else> <div class="no-data-placeholder">No hay gastos para graficar.</div> </template>
          </div>
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, shallowRef, nextTick, onErrorCaptured } from 'vue'; // shallowRef para el componente de gráfico
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js'; // Filler para el relleno de área
import { Doughnut, Bar, Line } from 'vue-chartjs'; // Importar Line

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// --- Estado Reactivo ---
const gastos = ref([]);
const ingresos = ref([]);
const tiendasData = ref([]);
const movimientosExtras = ref([]);
const cargando = ref(true);
const errorCargando = ref(null);
const errorMessage = ref('');
const savingGasto = ref(false);
const selectedMonth = ref('');
const selectedYear = ref(new Date().getFullYear());
const searchQuery = ref('');
const searchCategory = ref('');
const selectedCategory = ref(null);

const mesesAnterioresData = ref({
  ingresos: null,
  ingresosProyectados: null,
  gastos: null,
  gananciaNeta: null
});

const showAddExpenseModal = ref(false);
const editingGasto = ref(false);
const editingGastoId = ref(null);
const newGasto = ref({ fecha: new Date().toISOString().substr(0, 10), descripcion: '', categoria: '', monto: '' });

const showAddCapitalModal = ref(false);
const savingCapital = ref(false);
const newCapital = ref({ fecha: new Date().toISOString().substr(0, 10), monto: '', descripcion: '' });

const showAddPrestamoModal = ref(false);
const savingPrestamo = ref(false);
const newPrestamo = ref({ fecha: new Date().toISOString().substr(0, 10), monto: '', entidad: '', descripcion: '' });

// --- Nombres de Meses para Gráficos ---
const monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const months = monthNamesShort.map((name, index) => ({ name, value: String(index + 1).padStart(2, '0') }));
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);


// --- Paleta de Colores Neon/Vibrante Inspirada en la Infografía ---
const neonPalette = {
  greenBright: '#39FF14', // Verde Neón Brillante (Ingresos Pagados)
  cyanBright: '#00FFFF',   // Cyan Neón (Ingresos Proyectados)
  pinkBright: '#FF00FF',    // Magenta/Fucsia Neón (Gastos)
  blueElectric: '#007FFF', // Azul Eléctrico
  purpleElectric: '#7F00FF',// Púrpura Eléctrico
  orangeNeon: '#FFAC1C',  // Naranja Neón
  yellowNeon: '#FFF01F',   // Amarillo Neón
  defaultGray: '#9CA3AF'  // Gris para fallback
};

const categoryColorPalette = { // Para el gráfico de dona y categorías de gastos
  'Servicios': neonPalette.blueElectric,
  'Comida': neonPalette.orangeNeon,
  'Transporte': neonPalette.yellowNeon,
  'Oficina': neonPalette.purpleElectric,
  'Salarios': '#2DD4BF', // Teal (ajustar si es necesario)
  'Marketing': neonPalette.pinkBright, // Reusamos para otra categoría
  'Pago Préstamos': neonPalette.defaultGray, // Un color más neutro para esto
  'DEFAULT': neonPalette.defaultGray
};
const colorKeysForDoughnut = Object.keys(categoryColorPalette).filter(k => k !== 'DEFAULT');

const hashCode = (str) => { /* ... (sin cambios) ... */ };
const getCategoryHexColor = (categoria, opacity = 1) => {
    const normalizedCategoria = (categoria || 'DEFAULT').trim();
    let baseHex = categoryColorPalette[normalizedCategoria] || categoryColorPalette['DEFAULT'];

    // Si no está en la paleta directa, usa un hash para asignar uno de los colores del gráfico de dona
    if (!categoryColorPalette[normalizedCategoria] && normalizedCategoria !== 'DEFAULT') {
        const index = Math.abs(hashCode(normalizedCategoria)) % colorKeysForDoughnut.length;
        baseHex = categoryColorPalette[colorKeysForDoughnut[index]] || neonPalette.defaultGray;
    }
    
    if (opacity < 1 && opacity >= 0) {
        const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
        return `${baseHex}${alphaHex}`;
    }
    return baseHex;
};
const getCategoryIconColorClass = (categoria) => { /* ... (se puede refinar si es necesario) ... */ return 'text-gray-400'; };


// --- Funciones de Formato ---
const formatearDinero = (cantidad) => {
  if (!cantidad && cantidad !== 0) return 'Q0.00';
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2
  }).format(Number(cantidad) || 0);
};

const formatearFecha = (fechaInput, incluirAno = true) => {
  if (!fechaInput) return '';
  const fecha = fechaInput instanceof Timestamp ? fechaInput.toDate() : new Date(fechaInput);
  const options = { 
    day: 'numeric', 
    month: 'short',
    ...(incluirAno && { year: 'numeric' })
  };
  return fecha.toLocaleDateString('es-ES', options);
};


// --- Lógica de Fechas y Filtros ---
const getMonthYearFilterRange = (yearVal, monthVal) => {
  const year = Number(yearVal);
  if (!monthVal || monthVal === '') {
    // Todo el año
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31, 23, 59, 59)
    };
  }
  // Mes específico
  const month = Number(monthVal) - 1; // JavaScript months are 0-indexed
  return {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0, 23, 59, 59)
  };
};

const getPreviousPeriodRange = () => {
  if (!selectedMonth.value || selectedMonth.value === '') {
    // Año anterior
    return getMonthYearFilterRange(selectedYear.value - 1, '');
  } else {
    // Mes anterior
    let prevMonth = Number(selectedMonth.value) - 1;
    let prevYear = selectedYear.value;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }
    return getMonthYearFilterRange(prevYear, prevMonth.toString().padStart(2, '0'));
  }
};

const filterByDateRange = (items, startDate, endDate, dateField = 'fecha', useMonthService = false) => {
  return items.filter(item => {
    let itemDate;
    
    if (useMonthService && item.mesServicio) {
      // Para tiendas, usar mesServicio (formato YYYY-MM)
      const [year, month] = item.mesServicio.split('-').map(Number);
      itemDate = new Date(year, month - 1, 1);
    } else {
      // Para gastos y otros, usar campo de fecha normal
      itemDate = item[dateField] instanceof Timestamp 
        ? item[dateField].toDate() 
        : new Date(item[dateField]);
    }
    
    return itemDate >= startDate && itemDate <= endDate;
  });
};


// --- Propiedades Calculadas para Totales y Métricas ---
const filteredGastos = computed(() => {
  const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
  return filterByDateRange(gastos.value, startDate, endDate);
});

const filteredIngresosPagados = computed(() => {
  const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
  return filterByDateRange(
    tiendasData.value.filter(t => t.estadoProceso === 'Pagado'),
    startDate, endDate, 'fecha', true
  );
});

const ingresosProyectadosPeriodoTotal = computed(() => {
  const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
  const proyectados = filterByDateRange(
    tiendasData.value.filter(t => t.estadoProceso !== 'Cancelado' && t.estadoProceso !== 'Pagado'),
    startDate, endDate, 'fecha', true
  );
  return proyectados.reduce((sum, item) => sum + (Number(item.costo) || 0), 0);
});

const capitalInyectadoPeriodoTotal = computed(() => {
  const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
  const capital = filterByDateRange(
    movimientosExtras.value.filter(m => m.tipo === 'capital'),
    startDate, endDate
  );
  return capital.reduce((sum, item) => sum + (Number(item.monto) || 0), 0);
});

const prestamosRecibidosPeriodoTotal = computed(() => {
  const { startDate, endDate } = getMonthYearFilterRange(selectedYear.value, selectedMonth.value);
  const prestamos = filterByDateRange(
    movimientosExtras.value.filter(m => m.tipo === 'prestamo'),
    startDate, endDate
  );
  return prestamos.reduce((sum, item) => sum + (Number(item.monto) || 0), 0);
});

const gastosPeriodoTotal = computed(() => {
  return filteredGastos.value.reduce((sum, gasto) => sum + (Number(gasto.monto) || 0), 0);
});

const ingresosPeriodoTotal = computed(() => {
  return filteredIngresosPagados.value.reduce((sum, item) => sum + (Number(item.costo) || 0), 0);
});

const gananciaNeta = computed(() => {
  return ingresosPeriodoTotal.value - gastosPeriodoTotal.value;
});

const margenGanancia = computed(() => {
  if (ingresosPeriodoTotal.value === 0) return 0;
  return (gananciaNeta.value / ingresosPeriodoTotal.value) * 100;
});
const ingresosDiferencia = computed(() => {
  if (!mesesAnterioresData.value.ingresos) return 0;
  const actual = ingresosPeriodoTotal.value;
  const anterior = mesesAnterioresData.value.ingresos;
  if (anterior === 0) return actual > 0 ? 1000 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
});

const gastosDiferencia = computed(() => {
  if (!mesesAnterioresData.value.gastos) return 0;
  const actual = gastosPeriodoTotal.value;
  const anterior = mesesAnterioresData.value.gastos;
  if (anterior === 0) return actual > 0 ? 1000 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
});

const gananciaNetaDiferencia = computed(() => {
  if (!mesesAnterioresData.value.gananciaNeta) return 0;
  const actual = gananciaNeta.value;
  const anterior = mesesAnterioresData.value.gananciaNeta;
  if (anterior === 0) return actual > 0 ? 1000 : (actual < 0 ? -1000 : 0);
  return Math.round(((actual - anterior) / anterior) * 100);
});

const ingresosProyectadosDiferencia = computed(() => {
  if (!mesesAnterioresData.value.ingresosProyectados) return 0;
  const actual = ingresosProyectadosPeriodoTotal.value;
  const anterior = mesesAnterioresData.value.ingresosProyectados;
  if (anterior === 0) return actual > 0 ? 1000 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
});

const categoriasSummary = computed(() => {
  const categoryMap = new Map();
  filteredGastos.value.forEach(gasto => {
    const categoria = gasto.categoria || 'Sin Categoría';
    if (!categoryMap.has(categoria)) {
      categoryMap.set(categoria, 0);
    }
    categoryMap.set(categoria, categoryMap.get(categoria) + (Number(gasto.monto) || 0));
  });
  
  return Array.from(categoryMap.entries())
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);
});

const categoriasFiltradas = computed(() => categoriasSummary.value);

const getPercentageOfTotal = (categoryTotal) => {
  if (gastosPeriodoTotal.value === 0) return 0;
  return ((categoryTotal / gastosPeriodoTotal.value) * 100).toFixed(1);
};

const categoryGastos = computed(() => filteredGastos.value);
const categoryTotal = computed(() => gastosPeriodoTotal.value);
const categoryAverage = computed(() => {
  if (filteredGastos.value.length === 0) return 0;
  return gastosPeriodoTotal.value / filteredGastos.value.length;
});

const lastCategoryExpense = computed(() => {
  const sorted = [...filteredGastos.value].sort((a, b) => {
    const dateA = a.fecha instanceof Timestamp ? a.fecha.toDate() : new Date(a.fecha);
    const dateB = b.fecha instanceof Timestamp ? b.fecha.toDate() : new Date(b.fecha);
    return dateB - dateA;
  });
  return sorted[0] || null;
});

const categoriasDisponibles = computed(() => {
  const cats = new Set(['Servicios', 'Comida', 'Transporte', 'Oficina', 'Salarios', 'Marketing']);
  gastos.value.forEach(g => g.categoria && cats.add(g.categoria));
  return Array.from(cats).sort();
});


// --- Lógica para el Gráfico Financiero Principal (Barra o Línea) ---
const mainChartType = computed(() => selectedMonth.value === '' ? 'line' : 'bar');
const mainChartComponent = shallowRef(Bar); // Se actualizará en watch
const mainChartTitle = computed(() => selectedMonth.value === '' ? `Evolución Anual ${selectedYear.value}` : `Resumen ${months.find(m=>m.value === selectedMonth.value)?.name || ''} ${selectedYear.value}`);

const mainFinancialChartData = computed(() => {
    if (cargando.value) return { labels: [], datasets: [] };

    if (mainChartType.value === 'line') { // Vista Anual (Gráfico de Línea)
        const labels = monthNamesShort; // Ene, Feb, Mar...
        const monthlyData = {
            ingresosPagados: Array(12).fill(0),
            ingresosProyectados: Array(12).fill(0),
            gastos: Array(12).fill(0),
        };

        // Procesar Tiendas (Pagadas y Proyectadas) por mes
        tiendasData.value.forEach(tienda => {
            if (!tienda.mesServicio || !tienda.mesServicio.startsWith(selectedYear.value.toString())) return;
            const [year, month] = tienda.mesServicio.split('-').map(Number);
            const monthIndex = month - 1;

            if (year === selectedYear.value && monthIndex >= 0 && monthIndex < 12) {
                if (tienda.estadoProceso === 'Pagado') {
                    monthlyData.ingresosPagados[monthIndex] += (Number(tienda.costo) || 0);
                } else if (tienda.estadoProceso !== 'Cancelado') {
                    monthlyData.ingresosProyectados[monthIndex] += (Number(tienda.costo) || 0);
                }
            }
        });

        // Procesar Gastos por mes
        gastos.value.forEach(gasto => {
            if (!gasto.fecha) return;
            const fechaGasto = gasto.fecha instanceof Timestamp ? gasto.fecha.toDate() : new Date(gasto.fecha);
            if (fechaGasto.getFullYear() === selectedYear.value) {
                const monthIndex = fechaGasto.getMonth();
                monthlyData.gastos[monthIndex] += (Number(gasto.monto) || 0);
            }
        });
        
        // Crear gradientes para el relleno de las áreas del gráfico de línea
        let ingresosPagadosGradient = null;
        let ingresosProyectadosGradient = null;
        let gastosGradient = null;

        // Esto necesita ejecutarse después de que el canvas esté disponible, idealmente en el 'onMounted' del gráfico.
        // Por ahora, definimos colores sólidos y lo podemos mejorar luego si es necesario pasar el ctx.
        // Para Chart.js v3+, los gradientes se crean con ctx.createLinearGradient.
        // Lo simplificaremos aquí con colores RGBA para el área.

        return {
            labels,
            datasets: [
                {
                    label: 'Ingresos (Pagados)',
                    data: monthlyData.ingresosPagados,
                    borderColor: neonPalette.greenBright,
                    backgroundColor: (context) => { // Para gradiente
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, ChartJS.helpers.color(neonPalette.greenBright).alpha(0.1).rgbString());
                        gradient.addColorStop(1, ChartJS.helpers.color(neonPalette.greenBright).alpha(0.6).rgbString());
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4, // Líneas suavizadas
                    pointRadius: 3,
                    pointBackgroundColor: neonPalette.greenBright,
                },
                {
                    label: 'Ingresos (Proyectados)',
                    data: monthlyData.ingresosProyectados,
                    borderColor: neonPalette.cyanBright,
                     backgroundColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, ChartJS.helpers.color(neonPalette.cyanBright).alpha(0.1).rgbString());
                        gradient.addColorStop(1, ChartJS.helpers.color(neonPalette.cyanBright).alpha(0.5).rgbString());
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: neonPalette.cyanBright,
                },
                {
                    label: 'Gastos',
                    data: monthlyData.gastos,
                    borderColor: neonPalette.pinkBright,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, ChartJS.helpers.color(neonPalette.pinkBright).alpha(0.1).rgbString());
                        gradient.addColorStop(1, ChartJS.helpers.color(neonPalette.pinkBright).alpha(0.5).rgbString());
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: neonPalette.pinkBright,
                }
            ]
        };

    } else { // Vista Mensual (Gráfico de Barras)
        const datasets = [
            {
                label: 'Ingresos (Pagados)',
                backgroundColor: neonPalette.greenBright,
                borderColor: ChartJS.helpers.color(neonPalette.greenBright).darken(0.2).rgbString(),
                borderWidth:1,
                data: [ingresosPeriodoTotal.value], // Usamos el total del mes
                borderRadius: 4,
                stack: 'ingresosStack'
            },
            {
                label: 'Ingresos (Proyectados)',
                backgroundColor: neonPalette.cyanBright,
                borderColor: ChartJS.helpers.color(neonPalette.cyanBright).darken(0.2).rgbString(),
                borderWidth:1,
                data: [ingresosProyectadosPeriodoTotal.value],
                borderRadius: 4,
                stack: 'ingresosStack'
            },
            {
                label: 'Gastos',
                backgroundColor: neonPalette.pinkBright,
                borderColor: ChartJS.helpers.color(neonPalette.pinkBright).darken(0.2).rgbString(),
                borderWidth:1,
                data: [gastosPeriodoTotal.value],
                borderRadius: 4,
            }
        ];
        return { labels: ['Resumen del Mes'], datasets };
    }
});

const mainFinancialChartOptions = computed(() => {
    const isLineChart = mainChartType.value === 'line';
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: !isLineChart, // Apilar solo para barras
                grid: { color: 'rgba(107, 114, 128, 0.1)' }, // Más sutil
                ticks: { color: '#9CA3AF' }
            },
            y: {
                stacked: !isLineChart, // Apilar solo para barras
                beginAtZero: true,
                title: { display: true, text: 'Monto (GTQ)', color: '#9CA3AF' },
                ticks: { callback: (value) => formatearDinero(value), color: '#9CA3AF' },
                grid: { color: 'rgba(107, 114, 128, 0.2)' } // Más sutil
            }
        },
        plugins: {
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.85)', // gray-900 con opacidad
                titleColor: '#E5E7EB', // gray-200
                bodyColor: '#D1D5DB', // gray-300
                borderColor: 'rgba(52, 211, 153, 0.5)', // emerald-400/50
                borderWidth: 1,
                padding: 10,
                callbacks: { label: (context) => `${context.dataset.label || ''}: ${formatearDinero(context.parsed.y)}` }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: '#9CA3AF', usePointStyle: isLineChart, pointStyle: 'rectRounded' }
            },
            filler: { // Para que el 'fill:true' funcione correctamente
                propagate: true
            }
        },
        interaction: { // Mejorar interacción con tooltip
            mode: 'index',
            intersect: false,
        },
        elements: { // Estilo de puntos para gráfico de línea
            point: {
                radius: isLineChart ? 3 : 0,
                hoverRadius: isLineChart ? 5 : 0,
            }
        }
    };
});


// --- Gráfico de Dona de Gastos (sin cambios en la lógica de datos, solo colores) ---
const doughnutChartData = computed(() => {
    if (categoriasSummary.value.length === 0 || gastosPeriodoTotal.value === 0) {
        return { labels: [], datasets: [] };
    }
    const labels = categoriasSummary.value.map(cat => cat.nombre);
    const data = categoriasSummary.value.map(cat => cat.total);
    const backgroundColors = categoriasSummary.value.map(cat => getCategoryHexColor(cat.nombre)); // Usar la nueva función

    const datasets = [{
        label: 'Monto',
        backgroundColor: backgroundColors,
        data: data,
        hoverOffset: 8,
        borderColor: '#1F2937', // gray-800 (fondo del chart container)
        borderWidth: 2, // Borde más grueso para mejor separación
    }];
    return { labels, datasets };
});

const doughnutChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: { display: false },
        tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.85)', titleColor: '#E5E7EB', bodyColor: '#D1D5DB',
            borderColor: 'rgba(52, 211, 153, 0.5)', borderWidth: 1, padding: 10,
            callbacks: {
                label: (context) => `${context.label || ''}: ${formatearDinero(context.parsed)}`,
                afterLabel: (context) => {
                    const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                    const percentage = total === 0 ? 0 : ((context.parsed / total) * 100);
                    return `(${parseFloat(percentage.toFixed(1))}%)`;
                }
            }
        },
        legend: {
            display: true,
            position: 'right',
            labels: { color: '#9CA3AF', boxWidth: 12, padding: 15 }
        }
    }
});


// --- Lógica CRUD y Acciones UI ---
const resetForm = () => {
  newGasto.value = { 
    fecha: new Date().toISOString().substr(0, 10), 
    descripcion: '', 
    categoria: '', 
    monto: '' 
  };
  editingGasto.value = false;
  editingGastoId.value = null;
};

const editGasto = (gasto) => {
  newGasto.value = { ...gasto };
  editingGasto.value = true;
  editingGastoId.value = gasto.id;
  showAddExpenseModal.value = true;
};

const saveGasto = async () => {
  savingGasto.value = true;
  try {
    const gastoData = {
      ...newGasto.value,
      monto: Number(newGasto.value.monto),
      fecha: new Date(newGasto.value.fecha)
    };

    if (editingGasto.value) {
      await updateDoc(doc(db, 'gastos', editingGastoId.value), gastoData);
    } else {
      await addDoc(collection(db, 'gastos'), gastoData);
    }
    
    showAddExpenseModal.value = false;
    resetForm();
    await cargarDatos();
  } catch (error) {
    console.error('Error guardando gasto:', error);
  } finally {
    savingGasto.value = false;
  }
};

const deleteGasto = async (id) => {
  if (confirm('¿Estás seguro de eliminar este gasto?')) {
    try {
      await deleteDoc(doc(db, 'gastos', id));
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando gasto:', error);
    }
  }
};

const resetCapitalForm = () => {
  newCapital.value = { 
    fecha: new Date().toISOString().substr(0, 10), 
    monto: '', 
    descripcion: '' 
  };
};

const saveCapital = async () => {
  savingCapital.value = true;
  try {
    await addDoc(collection(db, 'movimientos_extras'), {
      ...newCapital.value,
      tipo: 'capital',
      monto: Number(newCapital.value.monto),
      fecha: new Date(newCapital.value.fecha)
    });
    
    showAddCapitalModal.value = false;
    resetCapitalForm();
    await cargarDatos();
  } catch (error) {
    console.error('Error guardando capital:', error);
  } finally {
    savingCapital.value = false;
  }
};

const resetPrestamoForm = () => {
  newPrestamo.value = { 
    fecha: new Date().toISOString().substr(0, 10), 
    monto: '', 
    entidad: '', 
    descripcion: '' 
  };
};

const savePrestamo = async () => {
  savingPrestamo.value = true;
  try {
    await addDoc(collection(db, 'movimientos_extras'), {
      ...newPrestamo.value,
      tipo: 'prestamo',
      monto: Number(newPrestamo.value.monto),
      fecha: new Date(newPrestamo.value.fecha)
    });
    
    showAddPrestamoModal.value = false;
    resetPrestamoForm();
    await cargarDatos();
  } catch (error) {
    console.error('Error guardando préstamo:', error);
  } finally {
    savingPrestamo.value = false;
  }
};

const filterByDate = async () => { 
  await cargarDatosPeriodoAnterior();
};

const showCategoryDetails = (categoryName) => {
  selectedCategory.value = categoryName;
};

const exportToExcel = () => {
  alert('Función de exportación en desarrollo');
};


// --- Carga de Datos ---
const cargarDatos = async () => {
  if (!isComponentMounted) return;
  
  cargando.value = true;
  errorCargando.value = null;
  errorMessage.value = '';
  
  try {
    // Cargar gastos
    const gastosSnapshot = await obtenerDocumentos('gastos');
    gastos.value = gastosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Cargar tiendas
    const tiendasSnapshot = await obtenerDocumentos('tiendas');
    tiendasData.value = tiendasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Cargar movimientos extras (capital y préstamos)
    const movimientosSnapshot = await obtenerDocumentos('movimientos_extras');
    movimientosExtras.value = movimientosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Cargar datos del período anterior para comparación
    if (isComponentMounted) {
      await cargarDatosPeriodoAnterior();
    }
    
  } catch (error) {
    console.error('Error cargando datos:', error);
    errorCargando.value = error;
    errorMessage.value = 'Error al cargar los datos financieros. Reintentando...';
    
    // Reintentar una vez después de 2 segundos
    setTimeout(async () => {
      if (isComponentMounted) {
        await cargarDatos();
      }
    }, 2000);
  } finally {
    if (isComponentMounted) {
      cargando.value = false;
    }
  }
};

const cargarDatosPeriodoAnterior = async () => {
  try {
    const { startDate, endDate } = getPreviousPeriodRange();
    
    // Calcular totales del período anterior
    const ingresosPrevios = filterByDateRange(
      tiendasData.value.filter(t => t.estadoProceso === 'Pagado'),
      startDate, endDate, 'fecha', true
    ).reduce((sum, item) => sum + (Number(item.costo) || 0), 0);

    const ingresosProyectadosPrevios = filterByDateRange(
      tiendasData.value.filter(t => t.estadoProceso !== 'Cancelado' && t.estadoProceso !== 'Pagado'),
      startDate, endDate, 'fecha', true
    ).reduce((sum, item) => sum + (Number(item.costo) || 0), 0);

    const gastosPrevios = filterByDateRange(
      gastos.value, startDate, endDate
    ).reduce((sum, gasto) => sum + (Number(gasto.monto) || 0), 0);

    mesesAnterioresData.value = {
      ingresos: ingresosPrevios,
      ingresosProyectados: ingresosProyectadosPrevios,
      gastos: gastosPrevios,
      gananciaNeta: ingresosPrevios - gastosPrevios
    };
    
  } catch (error) {
    console.error('Error cargando datos del período anterior:', error);
    mesesAnterioresData.value = {
      ingresos: null,
      ingresosProyectados: null,
      gastos: null,
      gananciaNeta: null
    };
  }
};


// --- Ciclo de Vida y Observadores ---
// --- Ciclo de Vida Mejorado ---
let isComponentMounted = false;

onMounted(async () => {
  isComponentMounted = true;
  await nextTick(); // Asegurar que el DOM esté listo
  if (isComponentMounted) {
    await cargarDatos();
    // Actualizar el componente del gráfico después de que los datos iniciales se cargan
    mainChartComponent.value = mainChartType.value === 'line' ? Line : Bar;
  }
});

onUnmounted(() => {
  isComponentMounted = false;
  // Limpiar estados
  cargando.value = false;
  errorCargando.value = null;
  errorMessage.value = '';
  // Limpiar datos para evitar memory leaks
  gastos.value = [];
  tiendasData.value = [];
  movimientosExtras.value = [];
});

// Capturar errores específicos de este componente
onErrorCaptured((error, instance, info) => {
  console.error('Error en ExpensesTracker:', error, info);
  errorMessage.value = `Error en Finanzas: ${error.message}`;
  cargando.value = false;
  return false; // Evitar propagación
});

watch([selectedMonth, selectedYear], async () => {
    if (isComponentMounted && !cargando.value) {
        await nextTick();
        await cargarDatos(); // Recargar todos los datos para el nuevo período principal
        // El watcher para mainChartType se encargará de actualizar el componente del gráfico
    }
});

watch(mainChartType, (newType) => {
    mainChartComponent.value = newType === 'line' ? Line : Bar;
});

</script>

<style scoped>
/* --- Estilos Glass y Dark Theme (puedes refinar estos según la infografía) --- */
.glass-container { @apply bg-gray-800/70 backdrop-blur-lg border border-gray-700/30; } /* Consolidado borde */
.glass-card { @apply bg-gray-800/60 backdrop-blur-md rounded-lg shadow-lg p-4; }

/* Inputs y Selects con colores más vibrantes en focus (inspirado en neón) */
.input-primary { @apply w-full px-3 py-2 rounded-lg border border-gray-600/70 bg-gray-900/40 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-150 text-sm shadow-inner shadow-black/30 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed; }
.select-input { @apply appearance-none bg-no-repeat bg-right pr-8; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-size: 1.5em 1.5em; } /* Flecha gris más oscura */
.input-primary:focus.select-input { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2334D399' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); } /* Flecha esmeralda en focus */
.option-dark { @apply bg-gray-800 text-gray-200; }
.input-primary.date-input::-webkit-calendar-picker-indicator { filter: invert(0.8) brightness(1.1) sepia(0.5) saturate(5) hue-rotate(100deg); cursor: pointer; } /* Tinte esmeralda */
.label-form { @apply block text-sm font-medium text-gray-400 mb-1.5; }

/* Botones - manteniendo consistencia pero abiertos a refactorización de color */
.btn-primary { @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; } /* Cambiado color de texto a blanco */
.btn-secondary { @apply bg-gray-700 text-gray-300 font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-600 border border-gray-600 hover:border-gray-500 transition-colors duration-200 text-sm shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed; } /* Simplificado */

/* Tarjetas Resumen - colores de borde más vibrantes */
.summary-card { @apply glass-card border-t-4 shadow-lg; /* Sombra más pronunciada */ }
.summary-card.border-emerald-500 { border-top-color: var(--neon-green-bright); }
.summary-card.border-cyan-500 { border-top-color: var(--neon-cyan-bright); }
.summary-card.border-red-500 { border-top-color: var(--neon-pink-bright); }
.summary-card.border-blue-500 { border-top-color: var(--neon-blue-electric); }
.summary-card.border-purple-500 { border-top-color: var(--neon-purple-electric); }
.summary-card.border-yellow-500 { border-top-color: var(--neon-yellow-neon); }
.summary-card.border-indigo-500 { border-top-color: '#818CF8'; }


.summary-title { @apply text-sm font-medium text-gray-400 mb-1; }
.summary-amount { @apply text-3xl font-bold; }
.summary-icon-bg { @apply p-3 rounded-lg shadow-inner flex items-center justify-center border border-gray-700/50; } /* Borde sutil */
.summary-comparison { @apply text-xs text-gray-500 mt-2; } /* Menos margen */

/* Contenedores Gráficos */
.chart-container { @apply glass-container rounded-2xl shadow-xl p-4 md:p-6; } /* Padding responsivo */
.chart-title { @apply text-lg font-semibold text-gray-200 mb-4; } /* Color de texto más claro */
.chart-wrapper { @apply h-80 sm:h-96 w-full flex items-center justify-center; } /* Altura responsiva */
.loading-placeholder { @apply animate-pulse bg-gray-700/30 w-full h-full rounded-md flex items-center justify-center text-gray-500 text-sm; }
.no-data-placeholder { @apply text-gray-500 text-center text-sm p-4 flex items-center justify-center h-full; }

/* Lista Categorías y Gastos (colores de acento de la paleta neón) */
.category-list-item { @apply cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-700/60 rounded-lg p-3 border border-transparent; }
.category-list-item.active { /* Un color de acento neón para activo */
  @apply bg-emerald-700/20 border-emerald-500/40 ring-1 ring-emerald-500/50;
}
.expense-list-item { @apply bg-gray-900/50 rounded-md shadow p-3 border border-gray-700/50 hover:border-gray-600/70 transition-colors; }
.expense-category-badge { @apply text-xs px-1.5 py-0.5 rounded-full border; } /* Estilo base, colores se aplican con :style */


/* Modales (puedes aplicar colores neón a los títulos o botones de acción) */
.modal-title { @apply text-xl font-bold text-emerald-400 glow-emerald; }

/* Definir variables CSS para la paleta neón para fácil uso en :style o clases de borde */
:root {
  --neon-green-bright: #39FF14;
  --neon-cyan-bright: #00FFFF;
  --neon-pink-bright: #FF00FF;
  --neon-blue-electric: #007FFF;
  --neon-purple-electric: #7F00FF;
  --neon-yellow-neon: #FFF01F;
}

/* Scrollbar (sin cambios, ya está estilizado) */
/* Animaciones y Glow (sin cambios) */
/* Tech Button (sin cambios) */
</style>