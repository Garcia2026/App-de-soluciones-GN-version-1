<template>
  <MainLayout>

    <!-- Navegación de Pestañas -->
    <div class="glass-card-premium rounded-xl mb-6">
      <div class="flex border-b border-gray-300 overflow-x-auto">
        <button
          v-for="pestana in pestanas"
          :key="pestana.id"
          @click="cambiarPestana(pestana.id)"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-b-2 relative whitespace-nowrap"
          :class="{
            'text-emerald-700 border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100': pestanaActiva === pestana.id,
            'text-gray-600 border-transparent hover:text-emerald-600 hover:border-emerald-300 hover:bg-gradient-to-r hover:from-white hover:to-emerald-50/30': pestanaActiva !== pestana.id
          }"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="pestana.icono" />
          </svg>
          <span class="hidden sm:inline">{{ pestana.nombre }}</span>
          <span class="sm:hidden">{{ pestana.nombre.split(' ')[0] }}</span>
        </button>
      </div>
    </div>

    <!-- Contenido de Pestaña: Cobros -->
    <div v-if="pestanaActiva === 'cobros'">

    <!-- Dashboard Financiero -->
    <div v-if="!cargando" class="mb-8">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-2 lg:mb-0">Dashboard Financiero</h3>
        <div class="text-sm text-gray-700">
          Total en Sistema: <span class="font-bold text-emerald-600">Q{{ resumenCobros.totalGeneral.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="kpi-card-premium kpi-pending">
          <div class="kpi-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="kpi-content">
            <h4 class="kpi-title">Pendiente</h4>
            <p class="kpi-amount">Q{{ resumenCobros.totalPendiente.toFixed(2) }}</p>
            <p class="kpi-subtitle">{{ resumenCobros.conteoPendiente }} cobros</p>
          </div>
        </div>
        <div class="kpi-card-premium kpi-billed">
          <div class="kpi-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="kpi-content">
            <h4 class="kpi-title">Facturado</h4>
            <p class="kpi-amount">Q{{ resumenCobros.totalFacturado.toFixed(2) }}</p>
            <p class="kpi-subtitle">{{ resumenCobros.conteoFacturado }} cobros</p>
          </div>
        </div>
        <div class="kpi-card-premium kpi-overdue">
          <div class="kpi-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="kpi-content">
            <h4 class="kpi-title">Vencido</h4>
            <p class="kpi-amount">Q{{ resumenCobros.totalVencido.toFixed(2) }}</p>
            <p class="kpi-subtitle">{{ resumenCobros.conteoVencido }} cobros</p>
          </div>
        </div>
        <div class="kpi-card-premium kpi-paid">
          <div class="kpi-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="kpi-content">
            <h4 class="kpi-title">Cobrado</h4>
            <p class="kpi-amount">Q{{ resumenCobros.totalPagado.toFixed(2) }}</p>
            <p class="kpi-subtitle">{{ resumenCobros.conteoPagado }} cobros</p>
          </div>
        </div>
      </div>

      <!-- Métricas de Eficiencia -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="metric-card-premium metric-success">
          <div class="metric-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="metric-content">
            <h5 class="metric-title">Tasa de Cobro</h5>
            <div class="metric-value">{{ resumenCobros.tasaCobro }}%</div>
            <div class="metric-subtitle">(Cobrado/Total)</div>
          </div>
        </div>
        <div class="metric-card-premium metric-danger">
          <div class="metric-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
            </svg>
          </div>
          <div class="metric-content">
            <h5 class="metric-title">Morosidad</h5>
            <div class="metric-value">{{ resumenCobros.tasaMorosidad }}%</div>
            <div class="metric-subtitle">(Vencido/Total)</div>
          </div>
        </div>
        <div class="metric-card-premium metric-warning">
          <div class="metric-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="metric-content">
            <h5 class="metric-title">Por Facturar</h5>
            <div class="metric-value">{{ resumenCobros.tasaPendiente }}%</div>
            <div class="metric-subtitle">(Pendiente/Total)</div>
          </div>
        </div>
      </div>
    </div>


    <div class="sync-section-premium">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-3">
          <button @click="sincronizarTiendasComoCobros"
                   class="btn-primary tech-btn relative overflow-hidden w-full sm:w-auto"
                   :disabled="sincronizando"
                   title="Sincronización manual - Los cobros se sincronizan automáticamente">
            <span class="z-10 relative flex items-center justify-center">
              <svg v-if="sincronizando" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
              <svg v-else class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 00-15.357-2m15.357 2H15"></path></svg>
              {{ sincronizando ? 'Sincronizando...' : 'Resincronizar Ahora' }}
            </span>
             <span class="tech-btn-bg absolute inset-0"></span>
           </button>
           <p class="text-xs text-gray-600 mt-1">
             ℹ️ Los cobros se sincronizan automáticamente al guardar tiendas
           </p>

          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg></div>
            <input v-model="busqueda" type="text" placeholder="Buscar cliente, marca, ods..." class="input-primary pl-10 pr-10 w-full" />
            <button v-if="busqueda" @click="busqueda = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-700"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
          </div>
        </div>
        <div class="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-3">
            <div class="relative flex-grow min-w-[150px]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg></div>
              <select v-model="filtroEstado" class="input-primary select-input pl-10 pr-8 w-full">
                  <option value="" class="option-dark text-gray-700">Todos los Estados</option>
                  <option value="Pendiente" class="option-dark">Pendiente</option>
                  <option value="Facturado" class="option-dark">Facturado</option>
                  <option value="Vencido" class="option-dark">Vencido</option>
                  <option value="Pagado" class="option-dark">Pagado</option>
              </select>
              <button v-if="filtroEstado" @click="filtroEstado = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-700"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
           </div>

           <div class="relative flex-grow min-w-[200px]">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg></div>
             <select v-model="filtroMes" class="input-primary select-input pl-10 pr-8 w-full">
               <option value="" class="option-dark text-gray-700">Todos los meses</option>
               <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes" class="option-dark">{{ formatearMes(mes) }}</option>
             </select>
             <button v-if="filtroMes" @click="filtroMes = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-700"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
           </div>
        </div>
      </div>
    </div>


    <div class="manual-section-premium">
      <details class="group">
          <summary class="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 border-b border-emerald-500/20 px-6 py-4 cursor-pointer list-none flex justify-between items-center transition-all duration-300 rounded-t-2xl">
              <h3 class="text-lg font-semibold text-white flex items-center drop-shadow-lg">
                  <svg class="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Agregar Cobro Manual (No vinculado a Tienda)
              </h3>
              <svg class="w-5 h-5 text-white group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </summary>
          <form @submit.prevent="guardarCobroManual" class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div class="relative"> <label class="label-form">Cliente</label> <input v-model="nuevoManual.cliente" type="text" placeholder="Nombre del Cliente" class="input-primary" required /> </div>
                  <div class="relative"> <label class="label-form">Monto (Q)</label> <input v-model.number="nuevoManual.monto" type="number" placeholder="0.00" step="0.01" class="input-primary" required /> </div>
                  <div class="relative"> <label class="label-form">Fecha Venta</label> <input v-model="nuevoManual.fecha" type="date" class="input-primary date-input" required /> </div>
                  <div class="relative"> <label class="label-form">Días Crédito</label> <input v-model.number="nuevoManual.diasCredito" type="number" placeholder="0" class="input-primary" required /> </div>
              </div>
              <div class="flex justify-end">
                  <button type="submit" class="btn-primary tech-btn relative overflow-hidden" :disabled="cargando">
                      <span class="z-10 relative flex items-center justify-center">
                          <svg v-if="!cargando" class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg v-if="cargando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {{ cargando ? 'Guardando...' : 'Guardar Cobro Manual' }}
                      </span>
                       <span class="tech-btn-bg absolute inset-0"></span>
                  </button>
              </div>
          </form>
      </details>
    </div>


    <div class="flex justify-between items-center mb-3">
       <div class="text-sm text-gray-700">
         <span class="font-medium text-gray-800">{{ cobrosFiltrados.length }}</span> {{ cobrosFiltrados.length === 1 ? 'cobro encontrado' : 'cobros encontrados' }}
         <span v-if="busqueda || filtroMes || filtroEstado"> (filtrado)</span>
       </div>
       </div>

    <!-- MOBILE CARDS VERSION (visible only on mobile <768px) -->
    <div class="mobile-cards-container md:hidden">
      <div v-if="cargando && !sincronizando" class="loading-overlay">
        <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="ml-2 text-gray-800">Cargando Cobros...</span>
      </div>

      <!-- Cobros Cards -->
      <div v-if="!cargando || sincronizando" class="space-y-3">
        <div v-for="(cobro, index) in cobrosFiltrados" :key="cobro.id || index"
             class="cobro-card-mobile"
             :class="{'border-red-400 bg-red-50': calcularEstadoCobro(cobro) === 'Vencido',
                      'border-emerald-400 bg-emerald-50': cobro.estadoCobro === 'Pagado'}">

          <!-- Header: Cliente + Monto -->
          <div class="cobro-card-header">
            <div class="flex-1">
              <h4 class="cobro-card-cliente">{{ cobro.cliente }}</h4>
              <p v-if="cobro.ods" class="cobro-card-ods">ODS: {{ cobro.ods }}</p>
              <span v-if="cobro.marca" class="cobro-card-marca">{{ cobro.marca }}</span>
            </div>
            <div class="cobro-card-monto">Q{{ (cobro.monto || 0).toFixed(2) }}</div>
          </div>

          <!-- Info Grid -->
          <div class="cobro-card-grid">
            <div class="cobro-info-item">
              <span class="cobro-info-label">Vence:</span>
              <span class="cobro-info-value">{{ formatearFecha(calcularFechaVencimiento(cobro.fecha, cobro.diasCredito)) }}</span>
            </div>
            <div class="cobro-info-item">
              <span class="cobro-info-label">Días Crédito:</span>
              <span class="cobro-info-value">{{ cobro.diasCredito ?? 0 }}</span>
            </div>
            <div class="cobro-info-item">
              <span class="cobro-info-label">Fecha Venta:</span>
              <span class="cobro-info-value">{{ formatearFecha(cobro.fecha) }}</span>
            </div>
          </div>

          <!-- Estados -->
          <div class="cobro-card-badges">
            <span class="badge-premium" :class="getCobroStatusColor(calcularEstadoCobro(cobro))">
              <svg v-if="calcularEstadoCobro(cobro) === 'Pagado'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ calcularEstadoCobro(cobro) }}
            </span>
            <span v-if="cobro.estadoProcesoTienda" class="badge-premium" :class="getProcessStatusColor(cobro.estadoProcesoTienda)">
              <svg v-if="cobro.estadoProcesoTienda === 'Pagado' || cobro.estadoProcesoTienda === 'Completado'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ cobro.estadoProcesoTienda }}
            </span>
          </div>

          <!-- Acciones -->
          <div class="cobro-card-actions">
            <button @click="verDetalles(cobro)" class="btn-mobile btn-mobile-primary">
              <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              Ver Detalles
            </button>
            <button v-if="calcularEstadoCobro(cobro) === 'Pendiente'"
                    @click="abrirModalFacturacion(cobro)"
                    class="btn-mobile btn-mobile-secondary">
              <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 2 0 01-2 2z"></path></svg>
              Facturar
            </button>
          </div>
        </div>

        <!-- Empty State Mobile -->
        <div v-if="cobrosFiltrados.length === 0 && !cargando" class="empty-state-mobile">
          <svg class="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-gray-700 text-lg font-medium">No se encontraron cobros</p>
          <p class="text-gray-600 text-sm mt-1">{{ busqueda || filtroMes || filtroEstado ? 'Prueba con otros criterios de búsqueda o filtro' : 'Aún no hay cobros registrados o sincronizados' }}</p>
        </div>
      </div>
    </div>

    <!-- DESKTOP TABLE VERSION (hidden on mobile) -->
    <div class="table-section-premium hidden md:block">
       <div v-if="cargando && !sincronizando" class="loading-overlay">
         <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
         <span class="ml-2 text-gray-800">Cargando Cobros...</span>
       </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900/70 backdrop-blur-sm">
            <tr>
              <th class="th-table">Cliente</th>
              <th class="th-table hidden md:table-cell">Marca</th>
              <th class="th-table">Monto</th>
              <th class="th-table hidden lg:table-cell">Fecha Venta</th>
              <th class="th-table hidden lg:table-cell">Días Crédito</th>
              <th class="th-table">Vence</th>
              <th class="th-table">Estado Cobro</th>
              <th class="th-table hidden md:table-cell">Estado Proceso (Tienda)</th>
              <th class="th-table">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700/50">
            <tr v-for="(cobro, index) in cobrosFiltrados" :key="cobro.id || index"
                class="hover:bg-gray-700/40 transition-colors duration-150"
                :class="{'bg-red-900/20': calcularEstadoCobro(cobro) === 'Vencido',
                         'bg-emerald-900/10': cobro.estadoCobro === 'Pagado'}">
              <td class="td-table">
                 <div class="font-medium text-gray-800 hover:text-emerald-600 transition-colors">{{ cobro.cliente }}</div>
                 <div v-if="cobro.ods" class="text-xs text-gray-600">ODS: {{ cobro.ods }}</div>
              </td>
              <td class="td-table hidden md:table-cell"> <span class="badge-gray">{{ cobro.marca || '-' }}</span> </td>
              <td class="td-table font-semibold">Q{{ (cobro.monto || 0).toFixed(2) }}</td>
              <td class="td-table hidden lg:table-cell">{{ formatearFecha(cobro.fecha) }}</td>
              <td class="td-table hidden lg:table-cell text-center">{{ cobro.diasCredito ?? 0 }}</td>
              <td class="td-table">{{ formatearFecha(calcularFechaVencimiento(cobro.fecha, cobro.diasCredito)) }}</td>
              <td class="td-table">
                 <span class="badge-premium" :class="getCobroStatusColor(calcularEstadoCobro(cobro))">
                   <svg v-if="calcularEstadoCobro(cobro) === 'Pagado'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                   </svg>
                   {{ calcularEstadoCobro(cobro) }}
                 </span>
              </td>
              <td class="td-table hidden md:table-cell">
                 <span v-if="cobro.estadoProcesoTienda" class="badge-premium" :class="getProcessStatusColor(cobro.estadoProcesoTienda)">
                   <svg v-if="cobro.estadoProcesoTienda === 'Pagado' || cobro.estadoProcesoTienda === 'Completado'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                   </svg>
                   {{ cobro.estadoProcesoTienda }}
                 </span>
                 <span v-else>-</span>
              </td>
              <td class="td-table">
                 <div class="flex space-x-1">
                   <button @click="verDetalles(cobro)" class="btn-icon text-cyan-600 hover:text-cyan-300" title="Ver Detalles">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                   </button>
                   <button v-if="calcularEstadoCobro(cobro) === 'Pendiente'" 
                           @click="abrirModalFacturacion(cobro)" 
                           class="btn-icon text-purple-600 hover:text-purple-300" 
                           title="Marcar como Facturado">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                   </button>
                   </div>
              </td>
            </tr>
             <tr v-if="cobrosFiltrados.length === 0 && !cargando">
               <td colspan="9" class="px-4 py-8 text-center">
                 <div class="flex flex-col items-center justify-center space-y-3">
                     <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <p class="text-gray-700 text-lg">No se encontraron cobros</p>
                     <p class="text-gray-700 text-sm">{{ busqueda || filtroMes || filtroEstado ? 'Prueba con otros criterios de búsqueda o filtro' : 'Aún no hay cobros registrados o sincronizados' }}</p>
                 </div>
               </td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>

        <Transition name="modal">
      <div v-if="mostrarDetalles" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700/50 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </div>
              Detalles del Cobro
            </h3>
            <button @click="mostrarDetalles = false" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div v-if="cobroSeleccionado" class="p-6 space-y-4">
            <div class="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p class="text-lg text-white font-bold">{{ cobroSeleccionado.cliente }}</p>
              <p class="text-sm text-slate-400">{{ cobroSeleccionado.marca || '-' }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div class="detail-item-dark"><span class="detail-label-dark">Monto:</span> <span class="detail-value-dark font-semibold text-emerald-400">Q{{ (cobroSeleccionado.monto || 0).toFixed(2) }}</span></div>
              <div class="detail-item-dark"><span class="detail-label-dark">ODS:</span> <span class="detail-value-dark">{{ cobroSeleccionado.ods || '-' }}</span></div>
              <div class="detail-item-dark"><span class="detail-label-dark">Fecha Venta:</span> <span class="detail-value-dark">{{ formatearFecha(cobroSeleccionado.fecha) }}</span></div>
              <div class="detail-item-dark"><span class="detail-label-dark">Tipo Pago:</span> <span class="detail-value-dark">{{ cobroSeleccionado.tipoPago || '-' }}</span></div>
              <div class="detail-item-dark"><span class="detail-label-dark">Días Crédito:</span> <span class="detail-value-dark">{{ cobroSeleccionado.diasCredito ?? 0 }}</span></div>
              <div class="detail-item-dark"><span class="detail-label-dark">Vence:</span> <span class="detail-value-dark font-semibold text-orange-400">{{ formatearFecha(calcularFechaVencimiento(cobroSeleccionado.fecha, cobroSeleccionado.diasCredito)) }}</span></div>
            </div>
            <div class="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
              <div class="detail-item-dark"><span class="detail-label-dark">Estado Cobro:</span> <span class="badge-premium ml-2" :class="getCobroStatusColor(calcularEstadoCobro(cobroSeleccionado))">{{ calcularEstadoCobro(cobroSeleccionado) }}</span></div>
              <div v-if="cobroSeleccionado.estadoProcesoTienda" class="detail-item-dark"><span class="detail-label-dark">Estado Proceso:</span> <span class="badge-premium ml-2" :class="getProcessStatusColor(cobroSeleccionado.estadoProcesoTienda)">{{ cobroSeleccionado.estadoProcesoTienda }}</span></div>
            </div>
            <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
              <button v-if="calcularEstadoCobro(cobroSeleccionado) !== 'Pagado'" @click="marcarComoPagado(cobroSeleccionado)" class="btn-primary tech-btn relative overflow-hidden" :disabled="cargando">
                <span class="z-10 relative flex items-center">Marcar como Pagado</span>
                <span class="tech-btn-bg absolute inset-0"></span>
              </button>
              <button @click="mostrarDetalles = false" class="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

      <!-- Modal de Facturación -->
      <Transition name="modal">
        <div v-if="mostrarModalFacturacion" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 animate-slideUp">
            <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                Facturar Servicio
              </h3>
              <button @click="cerrarModalFacturacion" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form @submit.prevent="procesarFacturacion" class="p-6 flex flex-col gap-6">
              <div class="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p class="text-sm text-slate-300 mb-1">Cliente: <strong class="text-white">{{ cobroSeleccionado?.cliente }}</strong></p>
                <p class="text-sm text-slate-300">Monto: <strong class="text-emerald-400">Q{{ (cobroSeleccionado?.monto || 0).toFixed(2) }}</strong></p>
              </div>
              
              <div class="md-field">
                <label class="md-label" for="fact-fecha">Fecha Compromiso de Pago *</label>
                <input id="fact-fecha" v-model="cronogramaPago.fechaCompromiso" type="date" class="md-input" :min="new Date().toISOString().split('T')[0]" required />
              </div>
              
              <div class="md-field">
                <label class="md-label" for="fact-obs">Observaciones (opcional)</label>
                <textarea id="fact-obs" v-model="cronogramaPago.observaciones" class="md-input resize-none" rows="3" placeholder="Notas sobre el cronograma de pago..."></textarea>
              </div>
              
              <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
                <button type="button" @click="cerrarModalFacturacion" class="btn-secondary">Cancelar</button>
                <button type="submit" class="btn-primary tech-btn relative overflow-hidden" :disabled="cargando">
                  <span class="z-10 relative flex items-center justify-center gap-2">
                    <svg v-if="cargando" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {{ cargando ? 'Procesando...' : 'Confirmar Factura' }}
                  </span>
                  <span class="tech-btn-bg absolute inset-0"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

    </div>
    <!-- Fin Pestaña: Cobros -->

    <!-- Contenido de Pestaña: Cronogramas de Pago -->
    <div v-if="pestanaActiva === 'cronogramas'">
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-emerald-600 mb-2">📋 Cronogramas de Pago</h3>
        <p class="text-gray-600">Gestiona los cronogramas de facturación grupal y registra pagos</p>
      </div>

      <!-- Filtros para cronogramas -->
      <div class="sync-section-premium mb-6">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input v-model="busquedaCronograma" type="text" placeholder="Buscar por folio, cliente..." class="input-primary pl-10 pr-4 w-full" />
          </div>

          <div class="relative flex-grow min-w-[180px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <select v-model="filtroEstadoCronograma" class="input-primary select-input pl-10 pr-8 w-full">
              <option value="">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado Parcial">Pagado Parcial</option>
              <option value="Pagado">Pagado</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de Cronogramas -->
      <div class="table-section-premium">
        <div v-if="cargandoCronogramas" class="loading-overlay">
          <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2 text-gray-800">Cargando Cronogramas...</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-900/70 backdrop-blur-sm">
              <tr>
                <th class="th-table">Folio</th>
                <th class="th-table">Fecha Creación</th>
                <th class="th-table">Tiendas</th>
                <th class="th-table">Monto Total</th>
                <th class="th-table">Monto Pagado</th>
                <th class="th-table">Restante</th>
                <th class="th-table">Fecha Compromiso</th>
                <th class="th-table">Estado</th>
                <th class="th-table">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/50">
              <tr v-for="cronograma in cronogramasFiltrados" :key="cronograma.id"
                  class="hover:bg-gray-700/40 transition-colors duration-150"
                  :class="{'bg-emerald-900/10': cronograma.estado === 'Pagado', 'bg-red-900/20': cronograma.estado === 'Vencido'}">
                <td class="td-table">
                  <div class="font-bold text-emerald-600">{{ cronograma.folio }}</div>
                  <div v-if="cronograma.numeroFactura" class="text-xs text-gray-600">Fact: {{ cronograma.numeroFactura }}</div>
                </td>
                <td class="td-table">{{ formatearFecha(cronograma.fechaCreacion, true) }}</td>
                <td class="td-table text-center">
                  <span class="badge-gray">{{ cronograma.totalTiendas || 0 }}</span>
                </td>
                <td class="td-table font-semibold">Q{{ (cronograma.montoTotal || 0).toFixed(2) }}</td>
                <td class="td-table font-semibold text-emerald-600">Q{{ (cronograma.montoPagado || 0).toFixed(2) }}</td>
                <td class="td-table font-semibold" :class="cronograma.montoRestante > 0 ? 'text-orange-600' : 'text-gray-500'">
                  Q{{ (cronograma.montoRestante || cronograma.montoTotal || 0).toFixed(2) }}
                </td>
                <td class="td-table">{{ formatearFecha(cronograma.fechaCompromisoPago) }}</td>
                <td class="td-table">
                  <span class="badge-premium" :class="getEstadoCronogramaColor(cronograma.estado)">
                    {{ cronograma.estado || 'Pendiente' }}
                  </span>
                </td>
                <td class="td-table">
                  <div class="flex space-x-1">
                    <button @click="verDetallesCronograma(cronograma)" class="btn-icon text-cyan-600 hover:text-cyan-300" title="Ver Detalles">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button v-if="cronograma.estado !== 'Pagado'"
                            @click="abrirModalRegistrarPago(cronograma)"
                            class="btn-icon text-emerald-600 hover:text-emerald-300"
                            title="Registrar Pago">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="cronogramasFiltrados.length === 0 && !cargandoCronogramas">
                <td colspan="9" class="px-4 py-8 text-center">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="text-gray-700 text-lg">No hay cronogramas de pago registrados</p>
                    <p class="text-gray-700 text-sm">Los cronogramas se crean automáticamente al facturar tiendas grupalmente</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Fin Pestaña: Cronogramas -->

    <!-- Modal: Registrar Pago -->
    <Transition name="modal">
      <div v-if="mostrarModalPago" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              Registrar Pago
            </h3>
            <button @click="mostrarModalPago = false" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="procesarRegistroPago" class="p-6 flex flex-col gap-6">
            <div v-if="cronogramaSeleccionado" class="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p class="text-sm text-slate-300 mb-2">Cronograma: <strong class="text-white">{{ cronogramaSeleccionado.folio }}</strong></p>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div><span class="text-slate-400">Total:</span><p class="font-semibold text-white">Q{{ (cronogramaSeleccionado.montoTotal || 0).toFixed(2) }}</p></div>
                <div><span class="text-slate-400">Pagado:</span><p class="font-semibold text-emerald-400">Q{{ (cronogramaSeleccionado.montoPagado || 0).toFixed(2) }}</p></div>
                <div><span class="text-slate-400">Restante:</span><p class="font-semibold text-orange-400">Q{{ ((cronogramaSeleccionado.montoRestante || cronogramaSeleccionado.montoTotal) || 0).toFixed(2) }}</p></div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="md-field sm:col-span-2">
                <label class="md-label" for="pago-monto">Monto a Pagar (Q) *</label>
                <input id="pago-monto" v-model.number="registroPago.monto" type="number" step="0.01" min="0.01" :max="cronogramaSeleccionado?.montoRestante || cronogramaSeleccionado?.montoTotal" class="md-input md-input-amount" required placeholder="0.00" />
              </div>
              <div class="md-field">
                <label class="md-label" for="pago-metodo">Método de Pago</label>
                <select id="pago-metodo" v-model="registroPago.metodoPago" class="md-input">
                  <option>Transferencia</option> <option>Efectivo</option> <option>Cheque</option> <option>Tarjeta</option> <option>Depósito</option>
                </select>
              </div>
              <div class="md-field">
                <label class="md-label" for="pago-fecha">Fecha de Pago</label>
                <input id="pago-fecha" v-model="registroPago.fechaPago" type="date" class="md-input" />
              </div>
              <div class="md-field sm:col-span-2">
                <label class="md-label" for="pago-ref">No. Referencia / Comprobante</label>
                <input id="pago-ref" v-model="registroPago.referencia" type="text" class="md-input" placeholder="Ej: TRX-123456, Cheque #789" />
              </div>
              <div class="md-field sm:col-span-2">
                <label class="md-label" for="pago-obs">Observaciones</label>
                <textarea id="pago-obs" v-model="registroPago.observaciones" class="md-input resize-none" rows="3" placeholder="Notas adicionales sobre el pago..."></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
              <button type="button" @click="mostrarModalPago = false" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary tech-btn relative overflow-hidden" :disabled="cargando">
                <span class="z-10 relative flex items-center justify-center gap-2">
                  <svg v-if="cargando" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ cargando ? 'Registrando...' : 'Registrar Pago' }}
                </span>
                <span class="tech-btn-bg absolute inset-0"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { obtenerDocumentos, agregarDocumento, actualizarDocumento, eliminarDocumento } from '@/services/firebaseService';
import { Timestamp } from 'firebase/firestore';
import MainLayout from '@/components/MainLayout.vue';
import { useToast } from 'vue-toastification'; // Asumiendo que tienes vue-toastification instalado y configurado

// --- Refs ---
const cobros = ref([]);
const nuevoManual = ref({ cliente: '', monto: null, fecha: '', diasCredito: 30 });
const busqueda = ref('');
const filtroEstado = ref('');
const filtroMes = ref('');
const mesesDisponibles = ref([]);
const sincronizando = ref(false);
const cargando = ref(false); // General loading state
const mostrarDetalles = ref(false);
const cobroSeleccionado = ref(null);
const mostrarModalFacturacion = ref(false);
const cronogramaPago = ref({ fechaCompromiso: '', observaciones: '' });
const toast = useToast();

// --- Pestañas ---
const pestanaActiva = ref('cobros');
const pestanas = ref([
  {
    id: 'cobros',
    nombre: 'Cobros',
    icono: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 'cronogramas',
    nombre: 'Cronogramas de Pago',
    icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
]);

// --- Cronogramas ---
const cronogramas = ref([]);
const busquedaCronograma = ref('');
const filtroEstadoCronograma = ref('');
const cargandoCronogramas = ref(false);
const cronogramaSeleccionado = ref(null);
const mostrarDetallesCronogramaModal = ref(false);
const mostrarModalPago = ref(false);
const registroPago = ref({
  monto: null,
  metodoPago: 'Transferencia',
  referencia: '',
  fechaPago: new Date().toISOString().split('T')[0],
  observaciones: ''
});

// --- Computed Properties ---
const cobrosFiltrados = computed(() => {
  let resultado = cobros.value;

  // Filter by Search Term
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase().trim();
    if (termino) {
      resultado = resultado.filter(cobro =>
        cobro.cliente?.toLowerCase().includes(termino) ||
        cobro.marca?.toLowerCase().includes(termino) ||
        cobro.ods?.toLowerCase().includes(termino) ||
        cobro.estadoProcesoTienda?.toLowerCase().includes(termino)
      );
    }
  }

  // Filter by Billing Status
  if (filtroEstado.value) {
      resultado = resultado.filter(cobro => calcularEstadoCobro(cobro) === filtroEstado.value);
  }

  // Filter by Month (using cobro.fecha which should correspond to tienda.mesServicio)
   if (filtroMes.value) {
       resultado = resultado.filter(cobro => cobro.fecha?.startsWith(filtroMes.value));
   }


  // Sort (Example: newest first based on creation/update date)
  resultado.sort((a, b) => {
      const dateA = a.fechaActualizacion || a.fechaCreacion;
      const dateB = b.fechaActualizacion || b.fechaCreacion;
      const timeA = dateA instanceof Timestamp ? dateA.toMillis() : 0;
      const timeB = dateB instanceof Timestamp ? dateB.toMillis() : 0;
      return timeB - timeA; // Descending order
  });

  return resultado;
});

const resumenCobros = computed(() => {
    let totalPendiente = 0, conteoPendiente = 0;
    let totalFacturado = 0, conteoFacturado = 0;
    let totalVencido = 0, conteoVencido = 0;
    let totalPagado = 0, conteoPagado = 0;

    cobros.value.forEach(cobro => {
        const monto = Number(cobro.monto) || 0;
        const estado = calcularEstadoCobro(cobro);

        if (estado === 'Pagado') {
            totalPagado += monto;
            conteoPagado++;
        } else if (estado === 'Vencido') {
            totalVencido += monto;
            conteoVencido++;
        } else if (estado === 'Facturado') {
            totalFacturado += monto;
            conteoFacturado++;
        } else { // Pendiente
            totalPendiente += monto;
            conteoPendiente++;
        }
    });
    
    const totalGeneral = totalPendiente + totalFacturado + totalVencido + totalPagado;
    const tasaCobro = totalGeneral > 0 ? Math.round((totalPagado / totalGeneral) * 100) : 0;
    const tasaMorosidad = totalGeneral > 0 ? Math.round((totalVencido / totalGeneral) * 100) : 0;
    const tasaPendiente = totalGeneral > 0 ? Math.round(((totalPendiente + totalFacturado) / totalGeneral) * 100) : 0;
    
    return { 
        totalPendiente, conteoPendiente, 
        totalFacturado, conteoFacturado,
        totalVencido, conteoVencido, 
        totalPagado, conteoPagado,
        totalGeneral, tasaCobro, tasaMorosidad, tasaPendiente
    };
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  console.log("Control de Cobros Mejorado Montado");
  // Sincronizar automáticamente desde tiendas al cargar
  await sincronizarTiendasComoCobros();
  // Cargar cobros
  await cargarCobros();
});

// --- Methods ---
const cargarCobros = async () => {
  cargando.value = true;
  try {
      const cobrosData = await obtenerDocumentos('cobros');
      cobros.value = cobrosData.map(doc => ({
        ...doc,
        fecha: doc.fecha?.toDate ? doc.fecha.toDate() : new Date(doc.fecha || Date.now())
      }));
      cargando.value = false;
    } catch (error) {
      console.error('Error cargando cobros:', error);
      toast.error('Error al cargar cobros');
      cargando.value = false;
    }
  };

const guardarCobroManual = async () => {
    if (!nuevoManual.value.cliente || nuevoManual.value.monto === null || !nuevoManual.value.fecha) {
        toast.warning("Por favor completa Cliente, Monto y Fecha Venta.");
        return;
    }

    cargando.value = true;
    try {
        const cobroData = {
            ...nuevoManual.value,
            estadoCobro: 'Pendiente', // Initial status for manual entries
            fechaCreacion: new Date(),
            origen: 'Manual' // Mark as manual entry
        };
        await agregarDocumento('cobros', cobroData);
        toast.success("Cobro manual guardado con éxito!");
        nuevoManual.value = { cliente: '', monto: null, fecha: '', diasCredito: 30 }; // Reset form
        await cargarCobros(); // Recargar la lista
    } catch (error) {
        console.error("Error al guardar cobro manual:", error);
        toast.error("Error al guardar cobro manual.");
    } finally {
        cargando.value = false;
    }
};

const sincronizarTiendasComoCobros = async () => {
  sincronizando.value = true;
  toast.info("Iniciando sincronización con tiendas...");
  try {
    const [tiendasSnapshot, cobrosSnapshot] = await Promise.all([
      obtenerDocumentos('tiendas'),
      obtenerDocumentos('cobros')
    ]);

    const cobrosExistentes = new Map();
    cobrosSnapshot.forEach(cobro => {
      if (cobro.tiendaId) {
        cobrosExistentes.set(cobro.tiendaId, cobro);
      }
    });

    const batchPromises = [];
    let creados = 0;
    let actualizados = 0;

    for (const tienda of tiendasSnapshot) {
      const tiendaId = tienda.id;

      // Determine initial billing status based on store process status
      let estadoCobroInicial = tienda.estadoCobro || 'Pendiente';

      const datosCobro = {
        cliente: tienda.nombre || 'Sin nombre',
        monto: Number(tienda.costo) || 0,
        fecha: tienda.mesServicio ? `${tienda.mesServicio}-01` : new Date().toISOString().split('T')[0],
        diasCredito: Number(tienda.diasCredito) || 0,
        ods: tienda.ods || null,
        tipoPago: tienda.tipoPago || 'Contado',
        marca: tienda.marca || null,
        categoria: tienda.categoria || null,
        estadoProcesoTienda: tienda.estadoProceso || 'Pendiente',
        tiendaId: tiendaId,
        origen: 'Tienda',
        estadoCobro: cobrosExistentes.has(tiendaId)
                     ? cobrosExistentes.get(tiendaId).estadoCobro
                     : estadoCobroInicial,
        fechaActualizacion: new Date()
      };

      if (cobrosExistentes.has(tiendaId)) {
        const cobroId = cobrosExistentes.get(tiendaId).id;
        batchPromises.push(actualizarDocumento('cobros', cobroId, datosCobro));
        actualizados++;
      } else {
        if(datosCobro.monto > 0) {
            datosCobro.fechaCreacion = new Date();
            batchPromises.push(agregarDocumento('cobros', datosCobro));
            creados++;
        }
      }
    }

    await Promise.all(batchPromises);
    await cargarCobros(); // Recargar después de sincronizar
    toast.success(`Sincronización completada: ${creados} cobros creados, ${actualizados} actualizados.`);

  } catch (error) {
    console.error("Error en sincronización:", error);
    toast.error("Ocurrió un error durante la sincronización.");
  } finally {
    sincronizando.value = false;
  }
};

const marcarComoPagado = async (cobro) => {
    if (!cobro || !cobro.id) {
        toast.error("No se pudo identificar el cobro a actualizar.");
        return;
    }
    if (calcularEstadoCobro(cobro) === 'Pagado') {
        toast.info("Este cobro ya está marcado como pagado.");
        return;
    }

    cargando.value = true;
    try {
        await actualizarDocumento('cobros', cobro.id, {
            estadoCobro: 'Pagado',
            fechaActualizacion: new Date()
        });
        toast.success(`Cobro de ${cobro.cliente} marcado como Pagado.`);
        mostrarDetalles.value = false;
        await cargarCobros(); // Recargar después de actualizar
    } catch (error) {
        console.error("Error al marcar como pagado:", error);
        toast.error("Error al actualizar el estado del cobro.");
    } finally {
        cargando.value = false;
    }
};


const calcularFechaVencimiento = (fechaStr, diasCredito) => {
  if (!fechaStr) return null; // Return null instead of empty string
  try {
      // Handle potential Timestamp object or date string
      let fechaBase;
      if (fechaStr instanceof Timestamp) {
          fechaBase = fechaStr.toDate();
      } else if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
          // Ensure correct parsing of YYYY-MM-DD by adding time component
          fechaBase = new Date(fechaStr + 'T00:00:00');
      } else {
          return null; // Invalid format
      }

      if (isNaN(fechaBase.getTime())) return null; // Invalid date parsed

      // Clone the date to avoid modifying the original if it's an object
      const vencimiento = new Date(fechaBase.valueOf());
      vencimiento.setDate(vencimiento.getDate() + (Number(diasCredito) || 0));
      return vencimiento; // Return Date object
  } catch (e) {
      console.error("Error calculating due date:", e);
      return null;
  }
};

const calcularEstadoCobro = (cobro) => {
  if (cobro.estadoCobro === 'Pagado') return 'Pagado'; // If already paid, it stays paid
  if (cobro.estadoCobro === 'Facturado') return 'Facturado'; // New state: Facturado

  // Auto-update to Facturado if all visits are completed
  if (cobro.estadoProcesoTienda === 'Completado' && cobro.estadoCobro === 'Pendiente') {
    return 'Facturado';
  }

  const fechaVencimiento = calcularFechaVencimiento(cobro.fecha, cobro.diasCredito);
  if (!fechaVencimiento) return 'Pendiente'; // Default if no valid due date

  const hoy = new Date();
  // Reset time part for accurate date comparison
  hoy.setHours(0, 0, 0, 0);
  fechaVencimiento.setHours(0, 0, 0, 0);

  return hoy > fechaVencimiento ? 'Vencido' : 'Pendiente';
};

const formatearFecha = (fechaInput, incluirAno = false) => {
    if (!fechaInput) return 'N/A';
    try {
        let fecha;
        if (fechaInput instanceof Timestamp) {
            fecha = fechaInput.toDate();
        } else if (fechaInput instanceof Date && !isNaN(fechaInput.getTime())) {
            fecha = fechaInput; // Already a valid Date object
        } else if (typeof fechaInput === 'string' && fechaInput.includes('-')) {
            // Try parsing string (e.g., YYYY-MM-DD)
            fecha = new Date(fechaInput + 'T00:00:00'); // Add time to avoid timezone issues
        } else {
            return 'Inválida'; // Unrecognized format
        }

        if (isNaN(fecha.getTime())) {
            return 'Inválida'; // Invalid date parsed
        }

        const opciones = { day: '2-digit', month: '2-digit' };
        if (incluirAno) {
            opciones.year = 'numeric';
        }
        return fecha.toLocaleDateString('es-GT', opciones);
    } catch (e) {
        console.error("Error formatting date:", e, "Input:", fechaInput);
        return 'Error';
    }
};

const formatearMes = (mesStr) => {
    if (!mesStr || !/^\d{4}-\d{2}$/.test(mesStr)) return mesStr || 'N/A'; // Handle invalid format or null
    try {
        const [ano, mes] = mesStr.split('-');
        const fecha = new Date(Number(ano), Number(mes) - 1, 1);
        if (isNaN(fecha.getTime())) return mesStr; // Invalid date
        let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
        return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
    } catch (e) {
        return mesStr; // Return original on error
    }
};

const calcularDiasRestantes = (fechaCompromiso) => {
  if (!fechaCompromiso) return 0;
  try {
    const fecha = new Date(fechaCompromiso + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);
    
    const diferencia = fecha.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  } catch (e) {
    return 0;
  }
};

const verDetalles = (cobro) => {
  cobroSeleccionado.value = cobro;
  mostrarDetalles.value = true;
};

const abrirModalFacturacion = (cobro) => {
  cobroSeleccionado.value = cobro;
  cronogramaPago.value = { fechaCompromiso: '', observaciones: '' };
  mostrarModalFacturacion.value = true;
};

const cerrarModalFacturacion = () => {
  mostrarModalFacturacion.value = false;
  cobroSeleccionado.value = null;
  cronogramaPago.value = { fechaCompromiso: '', observaciones: '' };
};

const procesarFacturacion = async () => {
  if (!cobroSeleccionado.value || !cronogramaPago.value.fechaCompromiso) {
    toast.warning('Selecciona una fecha de compromiso de pago.');
    return;
  }

  cargando.value = true;
  try {
    await actualizarDocumento('cobros', cobroSeleccionado.value.id, {
      estadoCobro: 'Facturado',
      fechaCompromisoPago: cronogramaPago.value.fechaCompromiso,
      observacionesPago: cronogramaPago.value.observaciones || '',
      fechaFacturacion: new Date(),
      fechaActualizacion: new Date()
    });

    toast.success(`Servicio facturado. Compromiso de pago: ${formatearFecha(cronogramaPago.value.fechaCompromiso)}`);
    cerrarModalFacturacion();
    await cargarCobros(); // Recargar después de actualizar
  } catch (error) {
    console.error('Error al procesar facturación:', error);
    toast.error('Error al procesar la facturación.');
  } finally {
    cargando.value = false;
  }
};

// --- Visual Helpers ---
const brandColors = {
    "McDonald's": 'amber', "Pizza Hut": 'red', "Kentucky": 'red', "Starbucks": 'green',
    "Dunkin Donuts": 'pink', "Edificio Naguchi": 'gray', "Pandas": 'gray', 'DEFAULT': 'emerald'
    // Add more mappings as needed
};

const getBrandColor = (brandName) => {
    const normalizedBrand = brandName?.trim() || 'DEFAULT';
    // Find the first key (case-insensitive) that is included in the brand name
    const foundKey = Object.keys(brandColors).find(key =>
        key !== 'DEFAULT' && normalizedBrand.toLowerCase().includes(key.toLowerCase())
    );
    return brandColors[foundKey] || brandColors['DEFAULT'];
};

const getProcessStatusColor = (status) => {
    switch (status) {
        case 'En proceso de ODS': return 'premium-badge-process';
        case 'En COVA': return 'premium-badge-cova';
        case 'Facturado': return 'premium-badge-billed';
        case 'Pagado': return 'premium-badge-paid';
        case 'Completado': return 'premium-badge-paid';
        case 'Pendiente': default: return 'premium-badge-pending';
    }
};

const getCobroStatusColor = (status) => {
    switch (status) {
        case 'Pagado': return 'premium-badge-paid';
        case 'Facturado': return 'premium-badge-billed';
        case 'Vencido': return 'premium-badge-overdue';
        case 'Pendiente': default: return 'premium-badge-pending';
    }
};

// --- Funciones de Pestañas ---
const cambiarPestana = async (pestanaId) => {
  pestanaActiva.value = pestanaId;

  // Si cambia a cronogramas, cargar datos
  if (pestanaId === 'cronogramas' && cronogramas.value.length === 0) {
    await cargarCronogramas();
  }
};

// --- Funciones de Cronogramas ---
const cargarCronogramas = async () => {
  cargandoCronogramas.value = true;
  try {
    const cronogramasData = await obtenerDocumentos('cronogramasPago');
    cronogramas.value = cronogramasData.map(doc => ({
      ...doc,
      fechaCreacion: doc.fechaCreacion?.toDate ? doc.fechaCreacion.toDate() : new Date(doc.fechaCreacion || Date.now()),
      fechaCompromisoPago: doc.fechaCompromisoPago
    }));
    console.log('✅ Cronogramas cargados:', cronogramas.value.length);
  } catch (error) {
    console.error('Error cargando cronogramas:', error);
    toast.error('Error al cargar cronogramas de pago');
  } finally {
    cargandoCronogramas.value = false;
  }
};

const cronogramasFiltrados = computed(() => {
  let resultado = cronogramas.value;

  // Filtrar por búsqueda
  if (busquedaCronograma.value) {
    const termino = busquedaCronograma.value.toLowerCase().trim();
    resultado = resultado.filter(c =>
      c.folio?.toLowerCase().includes(termino) ||
      c.numeroFactura?.toLowerCase().includes(termino) ||
      c.tiendas?.some(t => t.nombre?.toLowerCase().includes(termino))
    );
  }

  // Filtrar por estado
  if (filtroEstadoCronograma.value) {
    resultado = resultado.filter(c => c.estado === filtroEstadoCronograma.value);
  }

  // Ordenar por fecha de creación (más reciente primero)
  resultado.sort((a, b) => {
    const dateA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
    const dateB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
    return dateB - dateA;
  });

  return resultado;
});

const getEstadoCronogramaColor = (estado) => {
  switch (estado) {
    case 'Pagado': return 'premium-badge-paid';
    case 'Pagado Parcial': return 'premium-badge-billed';
    case 'Vencido': return 'premium-badge-overdue';
    case 'Pendiente': default: return 'premium-badge-pending';
  }
};

const verDetallesCronograma = (cronograma) => {
  cronogramaSeleccionado.value = cronograma;
  mostrarDetallesCronogramaModal.value = true;
};

const abrirModalRegistrarPago = (cronograma) => {
  cronogramaSeleccionado.value = cronograma;
  registroPago.value = {
    monto: cronograma.montoRestante || cronograma.montoTotal,
    metodoPago: 'Transferencia',
    referencia: '',
    fechaPago: new Date().toISOString().split('T')[0],
    observaciones: ''
  };
  mostrarModalPago.value = true;
};

const procesarRegistroPago = async () => {
  if (!cronogramaSeleccionado.value || !registroPago.value.monto) {
    toast.warning('Ingresa el monto del pago');
    return;
  }

  cargando.value = true;
  try {
    const cronograma = cronogramaSeleccionado.value;
    const montoPagado = (cronograma.montoPagado || 0) + Number(registroPago.value.monto);
    const montoRestante = (cronograma.montoTotal || 0) - montoPagado;

    // Determinar nuevo estado
    let nuevoEstado = 'Pendiente';
    if (montoRestante <= 0) {
      nuevoEstado = 'Pagado';
    } else if (montoPagado > 0) {
      nuevoEstado = 'Pagado Parcial';
    }

    // Agregar pago al historial
    const nuevoPago = {
      fecha: new Date(registroPago.value.fechaPago),
      monto: Number(registroPago.value.monto),
      metodoPago: registroPago.value.metodoPago,
      referencia: registroPago.value.referencia || '',
      observaciones: registroPago.value.observaciones || '',
      registradoPor: 'usuario@email.com' // Obtener del auth
    };

    const pagosActualizados = [...(cronograma.pagos || []), nuevoPago];

    // Actualizar cronograma
    await actualizarDocumento('cronogramasPago', cronograma.id, {
      montoPagado: montoPagado,
      montoRestante: montoRestante,
      estado: nuevoEstado,
      pagos: pagosActualizados,
      fechaUltimoPago: new Date(registroPago.value.fechaPago)
    });

    // Si está completamente pagado, actualizar los cobros vinculados
    if (nuevoEstado === 'Pagado') {
      const cobrosVinculados = await obtenerDocumentos('cobros');
      const cobrosDelCronograma = cobrosVinculados.filter(c =>
        c.cronogramaPagoId === cronograma.id
      );

      for (const cobro of cobrosDelCronograma) {
        await actualizarDocumento('cobros', cobro.id, {
          estadoCobro: 'Pagado',
          fechaActualizacion: new Date()
        });
      }

      // También actualizar tiendas
      for (const tienda of cronograma.tiendas || []) {
        await actualizarDocumento('tiendas', tienda.id, {
          estadoCobro: 'Pagado',
          fechaActualizacion: new Date()
        });
      }
    }

    toast.success(`Pago registrado exitosamente. ${nuevoEstado === 'Pagado' ? 'Cronograma completado!' : 'Restante: Q' + montoRestante.toFixed(2)}`);

    // Recargar datos
    await cargarCronogramas();
    await cargarCobros();

    // Cerrar modal
    mostrarModalPago.value = false;
    registroPago.value = {
      monto: null,
      metodoPago: 'Transferencia',
      referencia: '',
      fechaPago: new Date().toISOString().split('T')[0],
      observaciones: ''
    };

  } catch (error) {
    console.error('Error al registrar pago:', error);
    toast.error('Error al registrar el pago');
  } finally {
    cargando.value = false;
  }
};

</script>

<style scoped>
/* Import styles from Tiendas or define similar ones */
/* (Copied relevant styles from Tiendas.vue and adjusted where needed) */

/* --- Base & Glass --- */
.glass-container { @apply bg-gray-800/70 backdrop-blur-lg; }
.glass-card-premium { @apply bg-gray-800/60 backdrop-blur-md rounded-lg shadow p-4; }
.input-primary { @apply w-full px-3 py-2 rounded-lg border border-gray-600/70 bg-gray-900/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition-all duration-150 text-sm shadow-inner shadow-black/30 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed; }
.select-input { @apply appearance-none bg-no-repeat bg-right pr-8; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-size: 1.5em 1.5em; }
.input-primary:focus.select-input { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2334d399' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); }
.option-dark { @apply bg-gray-800 text-gray-800; }
.input-primary.date-input::-webkit-calendar-picker-indicator { filter: invert(0.9) brightness(1.2); cursor: pointer; }
.label-form { @apply block text-sm font-medium text-gray-700 mb-1.5; }

/* --- Buttons --- */
.btn-primary { @apply px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-secondary { @apply px-4 py-2 bg-gray-600/70 hover:bg-gray-500/70 border border-gray-500/50 text-gray-800 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-icon { @apply p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-emerald-400 transition duration-150 ease-in-out; }
.tech-btn:hover .tech-btn-bg { opacity: 0.2; }
.tech-btn-bg { background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%); }

/* --- Table --- */
.th-table { @apply px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700; }
.td-table { @apply px-4 py-3 whitespace-nowrap text-sm text-gray-700; }
.badge { @apply px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap; }

/* === BADGES PREMIUM CON TOQUE FINO === */
.badge-premium {
  @apply px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.premium-badge-pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.premium-badge-billed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.premium-badge-overdue {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #ef4444;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.premium-badge-paid {
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  color: white;
  border: 1px solid #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.premium-badge-paid:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.premium-badge-process {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.premium-badge-cova {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* === Hover Effects para Badges Premium === */
.badge-premium:not(.premium-badge-paid):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.badge-gray { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-700 border border-gray-600;}

/* === KPI CARDS PREMIUM CON TOQUE FINO === */
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

.metric-success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.metric-danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
}

.metric-warning {
  background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
}

.metric-icon {
  @apply p-3 rounded-lg flex items-center justify-center flex-shrink-0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-success .metric-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.metric-danger .metric-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.metric-warning .metric-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.metric-content {
  flex: 1;
}

.metric-title {
  @apply text-sm font-semibold mb-1;
}

.metric-success .metric-title { color: #065f46; }
.metric-danger .metric-title { color: #991b1b; }
.metric-warning .metric-title { color: #6d28d9; }

.metric-value {
  @apply text-xl font-bold mb-0.5;
}

.metric-success .metric-value { color: #065f46; }
.metric-danger .metric-value { color: #991b1b; }
.metric-warning .metric-value { color: #6d28d9; }

.metric-subtitle {
  @apply text-xs font-medium opacity-75;
}

.metric-success .metric-subtitle { color: #047857; }
.metric-danger .metric-subtitle { color: #b91c1c; }
.metric-warning .metric-subtitle { color: #7c2d12; }

.metric-card-premium:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-success:hover { box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2); }
.metric-danger:hover { box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2); }
.metric-warning:hover { box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2); }

/* === SECTION CONTAINERS PREMIUM === */
.sync-section-premium {
  @apply p-6 mb-6 rounded-2xl shadow-lg;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
  transition: all 0.3s ease;
}

.sync-section-premium:hover {
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.15);
  transform: translateY(-1px);
}

.manual-section-premium {
  @apply mb-10 rounded-2xl shadow-lg overflow-hidden;
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;
}

.manual-section-premium:hover {
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.15);
}

.table-section-premium {
  @apply rounded-2xl shadow-lg overflow-hidden mb-10 relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border: 1px solid rgba(156, 163, 175, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-section-premium:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* --- Modals --- */
.modal-backdrop { @apply fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out; }
.modal-content { @apply bg-gray-800/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-2xl shadow-black/40 w-full transform transition-all duration-300 ease-out mx-auto; }
.modal-header { @apply flex justify-between items-center p-4 border-b border-gray-700/50; }
.modal-title { @apply text-xl font-bold text-emerald-600 glow-emerald; }
.modal-close-btn { @apply text-gray-600 hover:text-emerald-600 text-3xl leading-none font-semibold p-1 -m-1 transition focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded-full; }
.modal-footer { @apply p-4 border-t border-gray-700/50 flex; } /* Removed justify-end for flex options */
.detail-item { @apply border-b border-gray-700/50 pb-2 mb-2; }
.detail-label { @apply text-sm text-gray-700 font-medium block; }
.detail-value { @apply text-base text-gray-800; }

/* --- Transitions --- */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content { transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02); }
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content { transform: scale(0.95) translateY(-10px); opacity: 0; }

/* --- Glow effect --- */
.glow-emerald { text-shadow: 0 0 8px rgba(16, 185, 129, 0.5), 0 0 16px rgba(16, 185, 129, 0.4); }

/* --- Loading Overlay --- */
.loading-overlay { @apply absolute inset-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl; }

/* --- Clases Premium para Badges --- */
.premium-badge-pending {} .premium-badge-billed {} .premium-badge-overdue {} .premium-badge-paid {}
.premium-badge-process {} .premium-badge-cova {}

/* --- Dynamic Classes Placeholder (Important for Tailwind Purge) --- */
.border-amber-500 {} .border-red-500 {} .border-green-500 {} .border-pink-500 {} .border-gray-500 {} .border-blue-500 {} .border-black {} .border-indigo-500 {} .border-purple-500 {} .border-cyan-500 {} .border-emerald-500 {}
.text-yellow-400 {} .text-cyan-600 {} .text-blue-400 {} .text-emerald-600 {} .text-gray-600 {} .text-red-400 {} .text-purple-600 {}
.border-yellow-400\/30 {} .border-cyan-400\/30 {} .border-blue-400\/30 {} .border-emerald-400\/30 {} .border-gray-400\/30 {} .border-red-400\/30 {} .border-purple-400\/30 {} .border-purple-500 {}
.bg-yellow-900\/20 {} .bg-cyan-900\/20 {} .bg-blue-900\/20 {} .bg-emerald-900\/20 {} .bg-gray-900\/20 {} .bg-red-900\/20 {} .bg-purple-900\/20 {}
.bg-red-900\/20 {} .bg-emerald-900\/10 {} /* For table row background */
.border-t-8 {}

/* === MOBILE CARDS STYLES === */
.mobile-cards-container {
  @apply space-y-3 px-0;
}

.cobro-card-mobile {
  @apply rounded-2xl p-4 border-2 border-gray-300 bg-white shadow-lg transition-all duration-200;
}

.cobro-card-header {
  @apply flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-200;
}

.cobro-card-cliente {
  @apply text-base font-bold text-gray-800 leading-tight;
}

.cobro-card-ods {
  @apply text-xs text-gray-600 mt-1;
}

.cobro-card-marca {
  @apply inline-block px-2 py-0.5 mt-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md;
}

.cobro-card-monto {
  @apply text-xl font-bold text-emerald-600 whitespace-nowrap;
}

.cobro-card-grid {
  @apply grid grid-cols-1 gap-2 mb-3 pb-3 border-b border-gray-200;
}

.cobro-info-item {
  @apply flex justify-between items-center;
}

.cobro-info-label {
  @apply text-sm font-medium text-gray-600;
}

.cobro-info-value {
  @apply text-sm font-semibold text-gray-800;
}

.cobro-card-badges {
  @apply flex flex-wrap gap-2 mb-3;
}

.cobro-card-actions {
  @apply flex flex-col gap-2;
}

.btn-mobile {
  @apply w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200;
  min-height: 48px;
}

.btn-mobile-primary {
  @apply bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md;
}

.btn-mobile-primary:hover {
  @apply from-cyan-600 to-cyan-700 shadow-lg transform scale-[1.02];
}

.btn-mobile-secondary {
  @apply bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md;
}

.btn-mobile-secondary:hover {
  @apply from-purple-600 to-purple-700 shadow-lg transform scale-[1.02];
}

.empty-state-mobile {
  @apply flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-2xl;
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .cobro-card-mobile {
    @apply p-3;
  }

  .cobro-card-cliente {
    @apply text-sm;
  }

  .cobro-card-monto {
    @apply text-lg;
  }

  .btn-mobile {
    @apply text-xs py-2.5;
  }
}

</style>