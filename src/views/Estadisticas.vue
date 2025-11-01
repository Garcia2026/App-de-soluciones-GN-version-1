<template>
  <MainLayout>

    <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-lg shadow-emerald-500/20 mb-8 py-6 px-8 transform transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-2 text-center drop-shadow-lg">Estadísticas Generales</h2>
      <p class="text-white/90 text-center text-sm md:text-base font-medium">Visión consolidada de Operaciones y Finanzas</p>
    </div>

    <div class="glass-card-premium p-5 mb-8">
       <div class="flex flex-col md:flex-row justify-start items-center gap-4">
         <span class="text-gray-700 mr-2 flex-shrink-0">Periodo:</span>
         <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select v-model="selectedMonth" @change="cargarEstadisticas" class="input-primary select-input w-full sm:w-48">
               <option value="" class="option-dark text-gray-700">Todo el Año</option>
               <option v-for="month in months" :key="month.value" :value="month.value" class="option-dark">{{ month.name }}</option>
            </select>
            <select v-model="selectedYear" @change="cargarEstadisticas" class="input-primary select-input w-full sm:w-32">
              <option v-for="year in years" :key="year" :value="year" class="option-dark">{{ year }}</option>
            </select>
         </div>
         <div v-if="cargando" class="ml-auto flex items-center text-sm text-purple-600">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Calculando...
         </div>
       </div>
    </div>

    <div v-if="cargando" class="text-center py-10">
        <svg class="animate-spin h-8 w-8 text-purple-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p class="text-purple-600">Cargando estadísticas...</p>
    </div>

    <div v-if="!cargando && !errorCarga" class="space-y-8">

      <section>
        <h3 class="section-title border-emerald-500">
          <svg class="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Resumen Financiero del Periodo
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="kpi-card-premium kpi-paid">
            <div class="kpi-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="kpi-content">
              <h4 class="kpi-title">Ingresos (Pagado)</h4>
              <p class="kpi-amount">{{ formatearDinero(kpis.ingresosPagados) }}</p>
              <p class="kpi-subtitle">{{ kpis.conteoIngresos }} servicios pagados</p>
            </div>
          </div>
           <div class="kpi-card-premium kpi-billed">
             <div class="kpi-icon">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
             </div>
             <div class="kpi-content">
               <h4 class="kpi-title">Ingresos (Facturado)</h4>
               <p class="kpi-amount">{{ formatearDinero(kpis.ingresosFacturados) }}</p>
               <p class="kpi-subtitle">{{ kpis.conteoFacturados }} servicios facturados</p>
             </div>
           </div>
          <div class="kpi-card-premium kpi-overdue">
             <div class="kpi-icon">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
               </svg>
             </div>
             <div class="kpi-content">
               <h4 class="kpi-title">Gastos Totales</h4>
               <p class="kpi-amount">{{ formatearDinero(kpis.gastosTotales) }}</p>
               <p class="kpi-subtitle">{{ kpis.conteoGastos }} registros</p>
             </div>
          </div>
          <div class="kpi-card-premium" :class="kpis.gananciaNeta >= 0 ? 'kpi-paid' : 'kpi-overdue'">
            <div class="kpi-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="kpi-content">
              <h4 class="kpi-title">Ganancia Neta</h4>
              <p class="kpi-amount">{{ formatearDinero(kpis.gananciaNeta) }}</p>
              <p class="kpi-subtitle">{{ kpis.margenGanancia.toFixed(1) }}% Margen</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 class="section-title border-cyan-500">
           <svg class="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
           Resumen Operativo de Tiendas/Servicios
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="metric-card-premium metric-info">
             <div class="metric-icon">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
               </svg>
             </div>
             <div class="metric-content">
               <h4 class="metric-title">Servicios Registrados</h4>
               <div class="metric-value">{{ kpis.totalServiciosRegistrados }}</div>
               <div class="metric-subtitle">En el periodo</div>
             </div>
          </div>

          <div class="glass-card-premium md:col-span-2 lg:col-span-2">
              <h4 class="chart-title">Distribución por Estado del Proceso</h4>
              <div class="chart-wrapper h-60">
                 <template v-if="estadoProcesoData.datasets.length > 0 && estadoProcesoData.datasets[0]?.data.some(v => v > 0)">
                   <Doughnut :data="estadoProcesoData" :options="doughnutChartOptions" />
                 </template>
                 <template v-else> <div class="no-data-placeholder">No hay servicios registrados.</div> </template>
              </div>
           </div>
        </div>
      </section>

      <section>
        <h3 class="section-title border-amber-500">
           <svg class="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          Rendimiento por Marca/Cliente (Top 5)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass-card-premium">
            <h4 class="chart-title !mb-2">Top por Ingresos (Pagado)</h4>
            <ul v-if="topMarcasIngresos.length > 0" class="space-y-2">
              <li v-for="(marca, index) in topMarcasIngresos" :key="marca.nombre" class="flex justify-between items-center text-sm border-b border-gray-700/50 pb-1">
                <span class="text-gray-700"><span class="font-semibold text-gray-800 mr-2">{{ index + 1 }}.</span> {{ marca.nombre }}</span>
                <span class="font-semibold text-emerald-600">{{ formatearDinero(marca.ingresos) }}</span>
              </li>
            </ul>
            <p v-else class="text-gray-700 text-sm text-center py-4">No hay ingresos por marca.</p>
          </div>
          <div class="glass-card-premium">
            <h4 class="chart-title !mb-2">Top por No. de Servicios</h4>
             <ul v-if="topMarcasServicios.length > 0" class="space-y-2">
              <li v-for="(marca, index) in topMarcasServicios" :key="marca.nombre" class="flex justify-between items-center text-sm border-b border-gray-700/50 pb-1">
                 <span class="text-gray-700"><span class="font-semibold text-gray-800 mr-2">{{ index + 1 }}.</span> {{ marca.nombre }}</span>
                <span class="font-semibold text-cyan-600">{{ marca.conteo }} Servicios</span>
              </li>
            </ul>
             <p v-else class="text-gray-700 text-sm text-center py-4">No hay servicios por marca.</p>
          </div>
        </div>
      </section>

       <section>
        <h3 class="section-title border-red-500">
          <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> </svg>
          Principales Categorías de Gasto
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="glass-card-premium h-80">
              <h4 class="chart-title">Distribución de Gastos</h4>
              <div class="chart-wrapper">
                 <template v-if="gastosDoughnutData.datasets.length > 0 && gastosDoughnutData.datasets[0]?.data.some(v => v > 0)">
                   <Doughnut :data="gastosDoughnutData" :options="doughnutChartOptions" />
                 </template>
                 <template v-else> <div class="no-data-placeholder">No hay gastos registrados.</div> </template>
              </div>
           </div>
            <div class="glass-card-premium">
                <h4 class="chart-title !mb-2">Top 5 Categorías de Gasto</h4>
                 <ul v-if="topCategoriasGasto.length > 0" class="space-y-2">
                  <li v-for="(categoria, index) in topCategoriasGasto" :key="categoria.nombre" class="flex justify-between items-center text-sm border-b border-gray-700/50 pb-1">
                     <span class="text-gray-700 flex items-center gap-2">
                       <span class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: getCategoryHexColor(categoria.nombre) }"></span>
                       <span class="font-semibold text-gray-800 mr-1">{{ index + 1 }}.</span> {{ categoria.nombre }}
                     </span>
                    <span class="font-semibold text-red-600">{{ formatearDinero(categoria.total) }}</span>
                  </li>
                </ul>
                 <p v-else class="text-gray-700 text-sm text-center py-4">No hay gastos registrados.</p>
            </div>
        </div>
       </section>

    </div>

    <div v-if="errorCarga" class="alert-danger mt-6">
       <p>Error al cargar las estadísticas: {{ errorCarga }}</p>
    </div>

  </MainLayout>
</template>

<script setup>
import { obtenerDocumentos, agregarDocumento, actualizarDocumento, eliminarDocumento } from '@/services/firebaseService';
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { collection, getDocs, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import MainLayout from '@/components/MainLayout.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

// --- Estado Reactivo ---
const allTiendas = ref([]);
const allGastos = ref([]);
const cargando = ref(true);
const errorCarga = ref(null);
const selectedMonth = ref(''); // Mes actual por defecto o vacío para anual
const selectedYear = ref(new Date().getFullYear());

// --- Listas y Datos Calculados ---
const kpis = ref({
  ingresosPagados: 0,
  ingresosFacturados: 0, // Añadido
  conteoIngresos: 0,
  conteoFacturados: 0, // Añadido
  gastosTotales: 0,
  conteoGastos: 0,
  gananciaNeta: 0,
  margenGanancia: 0,
  totalServiciosRegistrados: 0,
});

const topMarcasIngresos = ref([]);
const topMarcasServicios = ref([]);
const topCategoriasGasto = ref([]);

// Datos para gráficos
const estadoProcesoData = ref({ labels: [], datasets: [] });
const gastosDoughnutData = ref({ labels: [], datasets: [] });

// --- Configuración y Helpers ---
const months = [
  { name: 'Enero', value: '01' }, { name: 'Febrero', value: '02' }, { name: 'Marzo', value: '03' },
  { name: 'Abril', value: '04' }, { name: 'Mayo', value: '05' }, { name: 'Junio', value: '06' },
  { name: 'Julio', value: '07' }, { name: 'Agosto', value: '08' }, { name: 'Septiembre', value: '09' },
  { name: 'Octubre', value: '10' }, { name: 'Noviembre', value: '11' }, { name: 'Diciembre', value: '12' }
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const formatearDinero = (cantidad) => {
  const numero = Number(cantidad) || 0;
  return numero.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Copiadas de Finanzas.vue (para consistencia de colores)
const categoryColorPalette = {
  blue: '#60A5FA', green: '#4ADE80', purple: '#A78BFA', yellow: '#FACC15',
  indigo: '#818CF8', pink: '#F472B6', red: '#F87171', teal: '#2DD4BF',
  orange: '#FB923C', cyan: '#22D3EE', lime: '#A3E635', gray: '#9CA3AF'
};
const colorNames = Object.keys(categoryColorPalette);
const hashCode = (str) => { /* ... (código de hash igual que en Finanzas) ... */
    if (!str) return 0; let hash = 0;
    for (let i = 0; i < str.length; i++) { const char = str.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash |= 0; }
    return hash;
};
const getCategoryHexColor = (categoria, opacity = 1) => { /* ... (código getCategoryHexColor igual que en Finanzas) ... */
   const categoriaNormalizada = (categoria || 'Sin Categoría').trim();
   const index = Math.abs(hashCode(categoriaNormalizada)) % colorNames.length;
   const colorName = colorNames[index] || 'gray';
   const hex = categoryColorPalette[colorName] || categoryColorPalette['gray'];
   if (opacity < 1 && opacity >= 0) {
       const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
       return `${hex}${alphaHex}`;
   }
   return hex;
};

// --- Filtros y Rangos de Fecha ---
const getMonthYearFilterRange = () => {
    const year = selectedYear.value;
    if (selectedMonth.value === '') { // Todo el año
        const start = new Date(year, 0, 1, 0, 0, 0, 0);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        return { start, end };
    }
    const monthIndex = parseInt(selectedMonth.value) - 1;
    const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999); // Último día del mes
    return { start, end };
};

const filterByDateRange = (items, startDate, endDate, dateField = 'fecha', useMonthService = false) => {
  // ... (Misma función que en Finanzas.vue, adaptada para usarla aquí) ...
   if (!items || !startDate || !endDate) return [];

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth(); // 0-indexed
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth(); // 0-indexed

    return items.filter(item => {
        if (useMonthService) {
            const mesServicio = item.mesServicio; // Asume formato YYYY-MM
            if (!mesServicio || typeof mesServicio !== 'string' || !mesServicio.includes('-')) return false;
            try {
                const [itemYear, itemMonth] = mesServicio.split('-').map(Number);
                const itemMonthIndex = itemMonth - 1; // Convertir a 0-indexed

                if (itemYear < startYear || itemYear > endYear) return false;
                if (itemYear === startYear && itemMonthIndex < startMonth) return false;
                if (itemYear === endYear && itemMonthIndex > endMonth) return false;
                return true;

            } catch (e) { console.warn(`Error parsing mesServicio ${mesServicio}`, e); return false; }
        } else {
            const itemDateValue = item[dateField];
            if (itemDateValue === undefined || itemDateValue === null) return false;
            try {
                let itemDate;
                if (itemDateValue instanceof Timestamp) { itemDate = itemDateValue.toDate(); }
                else if (itemDateValue instanceof Date && !isNaN(itemDateValue.getTime())) { itemDate = itemDateValue; }
                else if (typeof itemDateValue === 'string') { itemDate = new Date(itemDateValue.includes('T') ? itemDateValue : itemDateValue + 'T00:00:00'); }
                else if (typeof itemDateValue === 'number') { itemDate = new Date(itemDateValue); }
                else { return false; }
                return !isNaN(itemDate.getTime()) && itemDate >= startDate && itemDate <= endDate;
            } catch (error) { return false; }
        }
    });
};


// --- Carga y Procesamiento de Datos ---
const cargarDatosBase = async () => {
   cargando.value = true;
   errorCarga.value = null;
   
   if (!db) {
       console.log('⚠️ Firebase no disponible en Estadisticas, usando datos mock');
       // Generar datos mock básicos para estadísticas
       allTiendas.value = [];
       allGastos.value = [];
       cargando.value = false;
       return;
   }
   
   try {
       const tiendasPromise = getDocs(query(collection(db, 'tiendas'), orderBy('fechaCreacion', 'desc')));
       const gastosPromise = getDocs(query(collection(db, 'gastos'), orderBy('fecha', 'desc')));

       const [tiendasSnapshot, gastosSnapshot] = await Promise.all([tiendasPromise, gastosPromise]);

       allTiendas.value = tiendasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       allGastos.value = gastosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

       console.log(`Datos base cargados: ${allTiendas.value.length} tiendas, ${allGastos.value.length} gastos.`);
       // Después de cargar, calcular estadísticas para el periodo seleccionado
       calcularEstadisticas();

   } catch (error) {
       console.error("Error cargando datos base:", error);
       errorCarga.value = `No se pudieron cargar los datos iniciales: ${error.message}`;
       allTiendas.value = [];
       allGastos.value = [];
   } finally {
       cargando.value = false; // La carga inicial termina aquí, calcularEstadisticas pone su propio cargando
   }
};

const calcularEstadisticas = () => {
    if (!allTiendas.value || !allGastos.value) {
        console.warn("Intentando calcular estadísticas sin datos base.");
        return;
    }
    cargando.value = true; // Indicar que estamos recalculando
    console.log(`Calculando estadísticas para: Mes ${selectedMonth.value || 'Todos'}, Año ${selectedYear.value}`);

    const { start, end } = getMonthYearFilterRange();

    // 1. Filtrar datos por periodo
    const tiendasPeriodo = filterByDateRange(allTiendas.value, start, end, 'mesServicio', true);
    const gastosPeriodo = filterByDateRange(allGastos.value, start, end, 'fecha', false);

    // 2. Calcular KPIs Financieros
    let ingresosPagados = 0;
    let ingresosFacturados = 0;
    let conteoIngresos = 0;
    let conteoFacturados = 0;
    tiendasPeriodo.forEach(tienda => {
        const costo = Number(tienda.costo) || 0;
        if (tienda.estadoProceso === 'Pagado') {
            ingresosPagados += costo;
            conteoIngresos++;
        }
         if (tienda.estadoProceso === 'Facturado') {
            ingresosFacturados += costo;
            conteoFacturados++;
        }
    });

    const gastosTotales = gastosPeriodo.reduce((sum, gasto) => sum + (Number(gasto.monto) || 0), 0);
    const gananciaNeta = ingresosPagados - gastosTotales;
    const margenGanancia = ingresosPagados === 0 ? (gastosTotales > 0 ? -100 : 0) : (gananciaNeta / ingresosPagados) * 100;

    // 3. Calcular KPIs Operativos
    const totalServiciosRegistrados = tiendasPeriodo.length;

    // 4. Datos para Gráfico Estado Proceso
    const estadosMap = {};
    tiendasPeriodo.forEach(tienda => {
        const estado = tienda.estadoProceso || 'Indefinido';
        estadosMap[estado] = (estadosMap[estado] || 0) + 1;
    });
    const estadosLabels = Object.keys(estadosMap);
    const estadosData = Object.values(estadosMap);
    // Asignar colores consistentes si es posible (ej. basado en nombre del estado)
    const estadosBackgroundColors = estadosLabels.map(label => {
         // Lógica simple de color por estado
        if (label === 'Pagado') return categoryColorPalette.green;
        if (label === 'Facturado') return categoryColorPalette.yellow;
        if (label === 'En proceso de ODS') return categoryColorPalette.blue;
        if (label === 'En COVA') return categoryColorPalette.cyan;
        if (label === 'Pendiente') return categoryColorPalette.gray;
        return getCategoryHexColor(label); // Fallback general
    });

    estadoProcesoData.value = {
        labels: estadosLabels,
        datasets: [{
            data: estadosData,
            backgroundColor: estadosBackgroundColors,
            hoverOffset: 4,
            borderColor: '#374151'
        }]
    };

    // 5. Calcular Rendimiento por Marca
    const marcasMap = {};
    tiendasPeriodo.forEach(tienda => {
        const marca = (tienda.marca || 'Sin Marca/Cliente').trim();
        const costo = Number(tienda.costo) || 0;
        if (!marcasMap[marca]) {
            marcasMap[marca] = { nombre: marca, conteo: 0, ingresos: 0 };
        }
        marcasMap[marca].conteo++;
        if (tienda.estadoProceso === 'Pagado') {
            marcasMap[marca].ingresos += costo;
        }
    });
    const marcasArray = Object.values(marcasMap);
    topMarcasIngresos.value = [...marcasArray].sort((a, b) => b.ingresos - a.ingresos).slice(0, 5);
    topMarcasServicios.value = [...marcasArray].sort((a, b) => b.conteo - a.conteo).slice(0, 5);

    // 6. Análisis de Gastos
    const categoriasGastoMap = {};
    gastosPeriodo.forEach(gasto => {
         const categoria = (gasto.categoria || 'Sin Categoría').trim();
         const monto = Number(gasto.monto) || 0;
         if (!categoriasGastoMap[categoria]) {
             categoriasGastoMap[categoria] = { nombre: categoria, total: 0, count: 0 };
         }
         categoriasGastoMap[categoria].total += monto;
         categoriasGastoMap[categoria].count++;
    });
    const categoriasGastoArray = Object.values(categoriasGastoMap);
    topCategoriasGasto.value = [...categoriasGastoArray].sort((a,b) => b.total - a.total).slice(0, 5);

    // Datos para gráfico de dona de gastos
    const gastosLabels = categoriasGastoArray.map(cat => cat.nombre);
    const gastosData = categoriasGastoArray.map(cat => cat.total);
    const gastosBackgroundColors = gastosLabels.map(label => getCategoryHexColor(label));
    gastosDoughnutData.value = {
        labels: gastosLabels,
        datasets: [{
            data: gastosData,
            backgroundColor: gastosBackgroundColors,
            hoverOffset: 4,
            borderColor: '#374151'
        }]
    };


    // 7. Actualizar KPIs
    kpis.value = {
        ingresosPagados,
        ingresosFacturados,
        conteoIngresos,
        conteoFacturados,
        gastosTotales,
        conteoGastos: gastosPeriodo.length,
        gananciaNeta,
        margenGanancia,
        totalServiciosRegistrados,
    };

    cargando.value = false; // Termina el cálculo
     console.log("Estadísticas calculadas:", kpis.value);
};

// --- Opciones de Gráficos (Reutilizadas de Finanzas donde aplique) ---
const doughnutChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    title: { display: false },
    tooltip: { /* ... (opciones de tooltip de Finanzas) ... */
       backgroundColor: 'rgba(0, 0, 0, 0.7)', titleColor: '#E5E7EB', bodyColor: '#D1D5DB',
        callbacks: {
            label: (context) => `${context.label || ''}: ${formatearDinero(context.parsed)}`,
            afterLabel: (context) => {
                // Calcular porcentaje para el tooltip
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = total === 0 ? 0 : ((context.parsed / total) * 100);
                return `(${Math.round(percentage * 10) / 10}%)`;
            }
        }
    },
    legend: { display: true, position: 'right', labels: { color: '#9CA3AF', boxWidth: 15 } }
  }
});


// --- Ciclo de Vida y Observadores ---
let isComponentMounted = false;

onMounted(async () => {
  isComponentMounted = true;
  // Asegurar que el DOM esté listo antes de cargar datos
  await nextTick();
  if (isComponentMounted) {
    await cargarDatosBase();
  }
});

onUnmounted(() => {
  isComponentMounted = false;
  // Limpiar estados para evitar memory leaks
  cargando.value = false;
  errorCarga.value = false;
});

// Recalcular cuando cambian los filtros
watch([selectedMonth, selectedYear], async () => {
    if (!cargando.value && isComponentMounted) { 
       await nextTick(); // Asegurar que el DOM esté actualizado
       calcularEstadisticas();
    }
});

</script>

<style scoped>
/* --- Estilos Premium Glass para Estadísticas --- */
.input-primary { @apply w-full px-3 py-2 rounded-lg border border-gray-600/70 bg-gray-900/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500 transition-all duration-150 text-sm shadow-inner shadow-black/30; }
.select-input { @apply appearance-none bg-no-repeat bg-right pr-8; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-size: 1.5em 1.5em; }
.input-primary:focus.select-input { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a78bfa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); }
.option-dark { @apply bg-gray-800 text-gray-800; }
.alert-danger { @apply bg-red-900/40 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg shadow-md shadow-red-900/20; }

/* --- Estilos Específicos del Componente --- */
.glow-purple {
  text-shadow: 0 0 8px rgba(168, 85, 247, 0.5), 0 0 16px rgba(168, 85, 247, 0.4); /* Ajustado a morado */
}

.section-title {
  @apply text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-700/60 flex items-center;
}

/* Estilos Premium para Tarjetas KPI */
.summary-title { @apply text-sm font-medium text-gray-600 mb-1; }
.summary-amount { @apply text-3xl font-bold leading-tight; }
.summary-icon-bg { @apply p-3 rounded-lg shadow-inner flex items-center justify-center self-start mb-2; }
.summary-comparison { @apply text-xs text-gray-600 mt-auto pt-1; }

/* Estilos Premium para Gráficos */
.chart-title { @apply text-base font-semibold text-gray-700 mb-3; }
.chart-wrapper { @apply relative h-64 md:h-72 w-full flex items-center justify-center; }
.no-data-placeholder { @apply text-gray-600 text-center text-sm p-4; }

/* Clases dinámicas para Tailwind */
.border-emerald-500 {} .border-red-500 {} .border-blue-500 {} .border-purple-500 {} .border-cyan-500 {} .border-amber-500 {} .border-yellow-500 {}
.bg-emerald-900\/30 {} .bg-red-900\/30 {} .bg-blue-900\/30 {} .bg-purple-900\/30 {} .bg-cyan-900\/30 {} .bg-amber-900\/30 {} .bg-yellow-900\/30 {}
.text-emerald-600 {} .text-red-600 {} .text-blue-600 {} .text-purple-600 {} .text-cyan-600 {} .text-amber-600 {} .text-yellow-600 {}

/* === KPI CARDS PREMIUM (copiado de Cobros) === */
.kpi-card-premium {
  @apply p-6 rounded-2xl shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.kpi-pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.15);
}

.kpi-billed {
  background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
}

.kpi-overdue {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
}

.kpi-paid {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.15);
}

.kpi-icon {
  @apply p-4 rounded-2xl flex items-center justify-center flex-shrink-0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.kpi-pending .kpi-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.kpi-billed .kpi-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.kpi-overdue .kpi-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.kpi-paid .kpi-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.kpi-content {
  flex: 1;
}

.kpi-title {
  @apply text-sm font-semibold mb-1;
}

.kpi-pending .kpi-title { color: #92400e; }
.kpi-billed .kpi-title { color: #6d28d9; }
.kpi-overdue .kpi-title { color: #991b1b; }
.kpi-paid .kpi-title { color: #065f46; }

.kpi-amount {
  @apply text-2xl font-bold mb-1;
}

.kpi-pending .kpi-amount { color: #92400e; }
.kpi-billed .kpi-amount { color: #6d28d9; }
.kpi-overdue .kpi-amount { color: #991b1b; }
.kpi-paid .kpi-amount { color: #065f46; }

.kpi-subtitle {
  @apply text-sm font-medium opacity-80;
}

.kpi-pending .kpi-subtitle { color: #a16207; }
.kpi-billed .kpi-subtitle { color: #7c2d12; }
.kpi-overdue .kpi-subtitle { color: #b91c1c; }
.kpi-paid .kpi-subtitle { color: #047857; }

.kpi-card-premium:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.kpi-pending:hover { box-shadow: 0 16px 48px rgba(245, 158, 11, 0.25); }
.kpi-billed:hover { box-shadow: 0 16px 48px rgba(139, 92, 246, 0.25); }
.kpi-overdue:hover { box-shadow: 0 16px 48px rgba(239, 68, 68, 0.25); }
.kpi-paid:hover { box-shadow: 0 16px 48px rgba(16, 185, 129, 0.25); }

/* === METRIC CARDS PREMIUM === */
.metric-card-premium {
  @apply p-4 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-info {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.metric-icon {
  @apply p-3 rounded-lg flex items-center justify-center flex-shrink-0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-info .metric-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.metric-content {
  flex: 1;
}

.metric-title {
  @apply text-sm font-semibold mb-1;
}

.metric-info .metric-title { color: #1e40af; }

.metric-value {
  @apply text-xl font-bold mb-0.5;
}

.metric-info .metric-value { color: #1e40af; }

.metric-subtitle {
  @apply text-xs font-medium opacity-75;
}

.metric-info .metric-subtitle { color: #2563eb; }

.metric-card-premium:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-info:hover { box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2); }

</style>