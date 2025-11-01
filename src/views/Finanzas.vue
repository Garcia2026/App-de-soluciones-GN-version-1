<template>
  <MainLayout>
    <template #header-actions>
      <!-- Botón optimizado para móvil -->
      <button class="btn-gold mobile-optimized-btn" @click="mostrarFormularioTransaccion">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="hidden sm:inline ml-2">Nueva Transacción</span>
        <span class="sm:hidden ml-1">+</span>
      </button>
    </template>
    
    <div class="finanzas-container">
      <!-- Welcome Section - Enhanced Hero -->
      <div class="welcome-section">
        <div class="hero-banner bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden">
          <div class="hero-content relative z-10">
            <div class="hero-bg-pattern absolute inset-0 opacity-5"></div>
            <div class="flex items-center justify-between mb-6">
              <div class="hero-title-section">
                <div class="flex items-center mb-3">
                  <div class="hero-icon bg-gradient-to-r from-emerald-400 to-cyan-400 p-3 rounded-2xl mr-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 class="hero-title text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Centro Financiero GN
                    </h1>
                    <p class="hero-subtitle text-gray-500 text-sm font-medium">
                      Dashboard Ejecutivo • {{ formatearFecha(new Date()) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="status-badge" :class="isFirebaseConnected ? 'status-online' : 'status-offline'">
                  <div class="status-dot"></div>
                  <span class="text-xs font-medium">{{ isFirebaseConnected ? 'En Línea' : 'Conectando...' }}</span>
                </div>
              </div>
            </div>
            <p class="hero-description text-base md:text-lg leading-relaxed text-gray-300 mb-8">
              Panel de control integral para finanzas empresariales, gestión de créditos y análisis de flujo de caja en tiempo real
            </p>
            
            <!-- Enhanced KPI Cards -->
            <div class="kpi-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <!-- Total Movimientos -->
              <div class="kpi-card group hover:scale-105 transition-all duration-300">
                <div class="kpi-header">
                  <div class="kpi-icon-wrapper bg-gradient-to-br from-blue-500 to-indigo-600">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div class="kpi-trend positive">📊</div>
                </div>
                <div class="kpi-content">
                  <h3 class="kpi-label">Total de Movimientos</h3>
                  <p class="kpi-value text-blue-400" v-if="!cargando">{{ transacciones?.length || 0 }}</p>
                  <p class="kpi-value text-gray-500" v-else>---</p>
                  <p class="kpi-description">Transacciones registradas</p>
                  <div class="kpi-progress-bar">
                    <div class="progress-fill bg-blue-500" :style="{ width: '75%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Flujo Neto -->
              <div class="kpi-card group hover:scale-105 transition-all duration-300" :class="(flujoNeto || 0) >= 0 ? 'positive-flow' : 'negative-flow'">
                <div class="kpi-header">
                  <div class="kpi-icon-wrapper" :class="(flujoNeto || 0) >= 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-rose-600'">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="kpi-trend" :class="(flujoNeto || 0) >= 0 ? 'positive' : 'negative'">
                    {{ (flujoNeto || 0) >= 0 ? '📈' : '📉' }}
                  </div>
                </div>
                <div class="kpi-content">
                  <h3 class="kpi-label">Flujo de Efectivo</h3>
                  <p class="kpi-value" :class="(flujoNeto || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'" v-if="!cargando">
                    {{ formatearDinero(Math.abs(flujoNeto || 0)) }}
                  </p>
                  <p class="kpi-value text-gray-500" v-else>---</p>
                  <p class="kpi-description" :class="(flujoNeto || 0) >= 0 ? 'text-emerald-300' : 'text-red-600'" v-if="!cargando">
                    {{ (flujoNeto || 0) >= 0 ? 'Resultado positivo' : 'Requiere atención' }}
                  </p>
                  <p class="kpi-description text-gray-500" v-else>Calculando flujo...</p>
                  <div class="kpi-progress-bar">
                    <div class="progress-fill" :class="(flujoNeto || 0) >= 0 ? 'bg-emerald-500' : 'bg-red-500'" :style="{ width: '100%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Progreso Préstamo -->
              <div class="kpi-card group hover:scale-105 transition-all duration-300">
                <div class="kpi-header">
                  <div class="kpi-icon-wrapper bg-gradient-to-br from-orange-500 to-amber-600">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="kpi-trend positive">⚡</div>
                </div>
                <div class="kpi-content">
                  <h3 class="kpi-label">Progreso del Préstamo</h3>
                  <p class="kpi-value text-orange-400" v-if="!cargando">
                    {{ (((pagosPrestamo || 0) / 36) * 100).toFixed(0) }}%
                  </p>
                  <p class="kpi-value text-gray-500" v-else>---%</p>
                  <p class="kpi-description text-orange-300" v-if="!cargando">
                    {{ pagosPrestamo || 0 }} de 36 cuotas pagadas
                  </p>
                  <p class="kpi-description text-gray-500" v-else>Cargando datos...</p>
                  <div class="kpi-progress-bar">
                    <div class="progress-fill bg-orange-500" :style="{ width: (((pagosPrestamo || 0) / 36) * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isFirebaseConnected" class="status-indicator warning">
            <div class="status-dot warning"></div>
            <span class="status-text">Conectando...</span>
          </div>
          <div v-else class="status-indicator success">
            <div class="status-dot success"></div>
            <span class="status-text">Sistema Operativo</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Quick Actions -->
      <div class="quick-actions-section mb-8">
        <div class="section-header mb-6">
          <h2 class="section-title text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Acciones Rápidas
          </h2>
          <p class="section-description text-gray-500 text-sm">
            Accesos directos a funciones principales del sistema financiero
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button @click="mostrarModalDonEduardo = true"
                  class="action-card bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 group">
            <div class="action-icon-wrapper">
              <CreditCard :size="28" class="action-icon group-hover:scale-110 transition-transform" />
            </div>
            <span class="action-label">Don Eduardo</span>
            <span class="action-description">Créditos y préstamos</span>
          </button>

          <button @click="mostrarFormularioTransaccion"
                  class="action-card bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 group">
            <div class="action-icon-wrapper">
              <Plus :size="28" class="action-icon group-hover:scale-110 transition-transform" />
            </div>
            <span class="action-label">Nueva Transacción</span>
            <span class="action-description">Registrar movimiento</span>
          </button>

          <button @click="abrirModalGananciaMensual"
                  class="action-card bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 group">
            <div class="action-icon-wrapper">
              <Calculator :size="28" class="action-icon group-hover:scale-110 transition-transform" />
            </div>
            <span class="action-label">Pago Préstamo</span>
            <span class="action-description">{{ formatearDinero(montoPagoPrestamo) }}</span>
          </button>

          <button @click="exportarDatos"
                  class="action-card bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 group">
            <div class="action-icon-wrapper">
              <FileText :size="28" class="action-icon group-hover:scale-110 transition-transform" />
            </div>
            <span class="action-label">Exportar</span>
            <span class="action-description">Generar reporte</span>
          </button>
        </div>
      </div>

      <!-- Enhanced Dashboard Principal -->
      <div class="dashboard-section mb-8">
        <div class="premium-section-header mb-8">
          <div class="flex items-center gap-4 mb-3">
            <div class="section-icon-large">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="section-title-premium">Dashboard Financiero</h2>
              <div class="flex items-center gap-3 mt-2">
                <div class="live-indicator">
                  <span class="live-dot"></span>
                  <span class="live-text">En Vivo</span>
                </div>
                <span class="section-subtitle-premium">
                  Monitoreo de operaciones • Actualización automática
                </span>
              </div>
            </div>
          </div>

        <!-- Crédito Revolvente Premium Section -->
        <div class="credit-revolvente-section">
          <!-- Header Premium -->
          <div class="credit-header-premium">
            <div class="flex items-center gap-4">
              <div class="credit-icon-premium">
                <CreditCard :size="28" class="text-white" />
              </div>
              <div class="flex-1">
                <h3 class="credit-title-premium">Crédito Revolvente</h3>
                <p class="credit-subtitle-premium">Don Eduardo • Línea de Crédito Empresarial</p>
              </div>
            </div>
            <button @click="mostrarModalDonEduardo = true" class="credit-action-btn">
              <Plus :size="20" />
              <span>Nuevo Movimiento</span>
            </button>
          </div>

          <!-- Métricas Premium -->
          <div class="credit-metrics-premium">
            <!-- Saldo Actual -->
            <div class="metric-card-premium debt">
              <div class="metric-icon-wrapper debt">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span class="metric-badge debt">{{ saldoDonEduardo >= 0 ? 'Deuda' : 'Crédito' }}</span>
              <div class="metric-content-premium">
                <span class="metric-label-premium">Saldo Actual</span>
                <span class="metric-value-premium" :class="saldoDonEduardo >= 0 ? 'debt-value' : 'credit-value'">
                  {{ formatearDinero(Math.abs(saldoDonEduardo)) }}
                </span>
                <span class="metric-description-premium">
                  {{ saldoDonEduardo >= 0 ? 'Deuda pendiente' : 'A nuestro favor' }}
                </span>
              </div>
            </div>

            <!-- Pago Mensual -->
            <div class="metric-card-premium payment">
              <div class="metric-icon-wrapper payment">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="metric-badge payment">Requerido</span>
              <div class="metric-content-premium">
                <span class="metric-label-premium">Pago Mensual</span>
                <span class="metric-value-premium payment-value">
                  {{ formatearDinero(gananciaMensualDonEduardo) }}
                </span>
                <span class="metric-description-premium">
                  Ganancia Don Eduardo
                </span>
                <button @click="abrirModalGananciaMensual" class="metric-quick-btn">
                  Pagar Ahora
                </button>
              </div>
            </div>

            <!-- Disponible -->
            <div class="metric-card-premium available">
              <div class="metric-icon-wrapper available">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span class="metric-badge available">Crédito Libre</span>
              <div class="metric-content-premium">
                <span class="metric-label-premium">Disponible</span>
                <span class="metric-value-premium available-value">
                  {{ formatearDinero(Math.max(0, limiteCredito - saldoDonEduardo)) }}
                </span>
                <span class="metric-description-premium">
                  Para usar
                </span>
              </div>
            </div>
          </div>

          <!-- Últimos Movimientos -->
          <div class="glass-info-card rounded-lg p-4 mt-6">
            <h5 class="font-semibold text-purple-600 mb-3">Últimos Movimientos</h5>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <div v-for="movimiento in ultimosMovimientosDonEduardo" :key="movimiento.id"
                   class="flex justify-between items-center py-2 border-b border-gray-300 last:border-b-0">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ movimiento.descripcion }}</p>
                  <p class="text-xs text-gray-600">{{ formatearFecha(movimiento.fecha) }}</p>
                </div>
                <p class="font-semibold" :class="movimiento.monto >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ movimiento.monto >= 0 ? '+' : '' }}{{ formatearDinero(movimiento.monto) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Préstamo Q3,700 -->
      <div class="glass-card-premium p-4 md:p-6">
        <h3 class="text-heading-4 text-warning mb-4 flex items-center justify-center sm:justify-between">
          <div class="flex items-center">
            <Calculator :size="20" class="mr-2" />
            <span class="hidden sm:inline">Préstamo Principal</span>
            <span class="sm:hidden">Préstamo</span>
          </div>
          <span class="text-body-small bg-orange-900/30 px-2 py-1 rounded-full text-orange-400">
            {{ ((pagosPrestamo / 36) * 100).toFixed(0) }}%
          </span>
        </h3>
        
        <div class="space-y-3 md:space-y-4">
          <!-- Información principal del préstamo - Móvil optimizado -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="text-center glass-info-card rounded-lg p-4">
              <p class="text-xl md:text-2xl font-bold text-orange-400">{{ formatearDinero(montoPagoPrestamo) }}</p>
              <p class="text-body-small text-orange-700">Pago mensual</p>
            </div>
            <div class="text-center glass-info-card rounded-lg p-4">
              <p class="text-xl md:text-2xl font-bold text-cyan-400">{{ formatearDinero(montoTotalPrestamo) }}</p>
              <p class="text-body-small text-cyan-700">Total préstamo</p>
            </div>
          </div>

          <!-- Progreso detallado - Móvil optimizado -->
          <div class="glass-info-card rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <span class="text-body-small text-white">Progreso</span>
              <span class="text-body-small font-semibold text-orange-300 bg-orange-900/30 px-2 py-1 rounded-full">
                {{ pagosPrestamo }}/36
              </span>
            </div>
            
            <!-- Barra de progreso mejorada -->
            <div class="w-full bg-orange-900/20 rounded-full h-3 mb-4 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-700 relative" 
                   :style="{ width: `${(pagosPrestamo / 36) * 100}%` }">
                <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            
            <!-- Grid responsive para móvil -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="flex justify-between sm:flex-col sm:items-center bg-orange-900/20 rounded-lg p-2">
                <span class="text-body-small text-orange-700">Restantes</span>
                <span class="text-orange-300 font-semibold">{{ 36 - pagosPrestamo }}</span>
              </div>
              <div class="flex justify-between sm:flex-col sm:items-center bg-emerald-900/20 rounded-lg p-2">
                <span class="text-body-small text-emerald-700">Pagado</span>
                <span class="text-emerald-600 font-semibold text-sm">{{ formatearDinero(pagosPrestamo * montoPagoPrestamo) }}</span>
              </div>
              <div class="flex justify-between sm:flex-col sm:items-center bg-red-900/20 rounded-lg p-2">
                <span class="text-body-small text-red-700">Faltante</span>
                <span class="text-red-400 font-semibold text-sm">{{ formatearDinero((36 - pagosPrestamo) * montoPagoPrestamo) }}</span>
              </div>
            </div>
          </div>

          <!-- Botón de acción móvil-first -->
          <button @click="registrarPagoPrestamo" 
                  :disabled="pagosPrestamo >= 36"
                  class="w-full btn-theme-primary tech-btn relative overflow-hidden min-h-[48px] text-body font-semibold"
                  :class="{'opacity-50 cursor-not-allowed': pagosPrestamo >= 36}">
            <span class="z-10 relative flex items-center justify-center gap-2">
              <DollarSign :size="20" />
              <span class="hidden sm:inline">
                {{ pagosPrestamo >= 36 ? 'Préstamo Completado' : `Registrar Pago ${pagosPrestamo + 1}/36` }}
              </span>
              <span class="sm:hidden">
                {{ pagosPrestamo >= 36 ? 'Completado' : `Pago ${pagosPrestamo + 1}` }}
              </span>
            </span>
            <span class="tech-btn-bg absolute inset-0"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Resumen Financiero Detallado -->
    <div class="financial-summary-section mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gn-primary-200 flex items-center">
          <TrendingUp :size="24" class="mr-2" />
          Análisis Financiero
        </h3>
        <div class="text-xs text-emerald-700 glass-info-card px-3 py-1 rounded-full">
          Último actualizado: {{ formatearFecha(new Date()) }}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="glass-card-premium border-l-4 border-emerald-500">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-lg text-emerald-800">Ingresos Cobrados</h4>
            <div class="p-2 bg-emerald-500/20 rounded-lg">
              <TrendingUp :size="16" class="text-emerald-600" />
            </div>
          </div>
          <p class="text-2xl font-bold text-emerald-600 mb-2">{{ formatearDinero(ingresosCobrados) }}</p>
          <div class="flex justify-between items-center">
            <p class="text-sm text-emerald-700">Del período actual</p>
            <div class="text-xs bg-emerald-900/30 text-emerald-600 px-2 py-1 rounded">
              +{{ ((ingresosCobrados / (ingresosCobrados + ingresosPorCobrar)) * 100).toFixed(0) }}% efectividad
            </div>
          </div>
        </div>

        <div class="glass-card-premium border-l-4 border-purple-500">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-lg text-purple-800">Por Cobrar</h4>
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <Clock :size="16" class="text-purple-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-400 mb-2">{{ formatearDinero(ingresosPorCobrar) }}</p>
          <div class="flex justify-between items-center">
            <p class="text-sm text-purple-700">Facturado + Vencido</p>
            <div class="text-xs bg-purple-900/30 text-purple-600 px-2 py-1 rounded">
              {{ ((ingresosPorCobrar / (ingresosCobrados + ingresosPorCobrar)) * 100).toFixed(0) }}% pendiente
            </div>
          </div>
        </div>

        <div class="glass-card-premium border-l-4 border-red-500">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-lg text-red-800">Gastos Totales</h4>
            <div class="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown :size="16" class="text-red-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-red-400 mb-2">{{ formatearDinero(gastosTotales) }}</p>
          <div class="flex justify-between items-center">
            <p class="text-sm text-red-700">Incluye préstamos</p>
            <div class="text-xs bg-red-900/30 text-red-600 px-2 py-1 rounded">
              {{ gastosTotales > ingresosCobrados ? 'Alerta' : 'Normal' }}
            </div>
          </div>
        </div>

        <div class="glass-card-premium border-l-4 border-cyan-500">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-lg text-cyan-800">Flujo Neto</h4>
            <div class="p-2 rounded-lg" :class="flujoNeto >= 0 ? 'bg-cyan-500/20' : 'bg-red-500/20'">
              <component :is="flujoNeto >= 0 ? 'TrendingUp' : 'TrendingDown'" :size="16" :class="flujoNeto >= 0 ? 'text-cyan-400' : 'text-red-400'" />
            </div>
          </div>
          <p class="text-2xl font-bold mb-2" :class="flujoNeto >= 0 ? 'text-cyan-400' : 'text-red-400'">
            {{ formatearDinero(Math.abs(flujoNeto)) }}
          </p>
          <div class="flex justify-between items-center">
            <p class="text-sm text-cyan-700">Este período</p>
            <div class="text-xs px-2 py-1 rounded" 
                 :class="flujoNeto >= 0 ? 'bg-cyan-900/30 text-cyan-600' : 'bg-red-900/30 text-red-600'">
              {{ flujoNeto >= 0 ? 'Positivo' : 'Negativo' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights -->
      <div class="performance-insights glass-card-premium rounded-2xl p-6">
        <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 :size="20" class="mr-2" />
          Indicadores de Performance
        </h4>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="performance-metric">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-white">Ratio Cobros</span>
              <span class="text-xs text-emerald-600">{{ ((ingresosCobrados / (ingresosCobrados + ingresosPorCobrar)) * 100).toFixed(0) }}%</span>
            </div>
            <div class="w-full bg-emerald-900/30 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full" 
                   :style="{ width: ((ingresosCobrados / (ingresosCobrados + ingresosPorCobrar)) * 100) + '%' }"></div>
            </div>
          </div>

          <div class="performance-metric">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-white">Eficiencia</span>
              <span class="text-xs text-cyan-400">{{ flujoNeto >= 0 ? ((flujoNeto / ingresosCobrados) * 100).toFixed(0) : '0' }}%</span>
            </div>
            <div class="w-full bg-emerald-900/30 rounded-full h-2">
              <div class="bg-cyan-400 h-2 rounded-full" 
                   :style="{ width: (flujoNeto >= 0 ? ((flujoNeto / ingresosCobrados) * 100) : 0) + '%' }"></div>
            </div>
          </div>

          <div class="performance-metric">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-white">Control Gastos</span>
              <span class="text-xs" :class="gastosTotales <= (ingresosCobrados * 0.7) ? 'text-emerald-600' : 'text-red-400'">
                {{ ((gastosTotales / ingresosCobrados) * 100).toFixed(0) }}%
              </span>
            </div>
            <div class="w-full bg-emerald-900/30 rounded-full h-2">
              <div class="h-2 rounded-full" 
                   :class="gastosTotales <= (ingresosCobrados * 0.7) ? 'bg-emerald-500' : 'bg-red-400'"
                   :style="{ width: Math.min(((gastosTotales / ingresosCobrados) * 100), 100) + '%' }"></div>
            </div>
          </div>

          <div class="performance-metric">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-white">Liquidez</span>
              <span class="text-xs text-purple-400">{{ ((Math.max(0, limiteCredito - saldoDonEduardo) / 1000)).toFixed(0) }}K</span>
            </div>
            <div class="w-full bg-emerald-900/30 rounded-full h-2">
              <div class="bg-purple-400 h-2 rounded-full" 
                   :style="{ width: Math.min(((Math.max(0, limiteCredito - saldoDonEduardo) / limiteCredito) * 100), 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <!-- Gráfica Don Eduardo -->
      <div class="glass-card-premium rounded-2xl p-4 md:p-6">
        <h3 class="text-base md:text-lg font-semibold text-purple-600 mb-3 md:mb-4 flex items-center">
          <TrendingUp :size="18" class="mr-2 md:mr-2" />
          <span class="hidden sm:inline">Evolución Don Eduardo</span>
          <span class="sm:hidden">Don Eduardo</span>
        </h3>
        <div class="h-48 md:h-64">
          <Line v-if="chartDonEduardoData" :data="chartDonEduardoData" :options="chartOptions" />
        </div>
      </div>

      <!-- Gráfica Préstamo -->
      <div class="glass-card-premium rounded-2xl p-4 md:p-6">
        <h3 class="text-base md:text-lg font-semibold text-orange-600 mb-3 md:mb-4 flex items-center">
          <PieChart :size="18" class="mr-2" />
          <span class="hidden sm:inline">Progreso del Préstamo</span>
          <span class="sm:hidden">Préstamo</span>
        </h3>
        <div class="h-48 md:h-64 flex items-center justify-center">
          <Doughnut v-if="chartPrestamoData" :data="chartPrestamoData" :options="doughnutOptions" />
        </div>
      </div>

      <!-- Gráfica Top Gastos -->
      <div class="glass-card-premium rounded-2xl p-4 md:p-6">
        <h3 class="text-base md:text-lg font-semibold text-emerald-600 mb-3 md:mb-4 flex items-center">
          <BarChart3 :size="18" class="mr-2" />
          <span class="hidden sm:inline">Top Gastos por Categoría</span>
          <span class="sm:hidden">Top Gastos</span>
        </h3>
        <div class="h-48 md:h-64">
          <Bar v-if="chartGastosData" :data="chartGastosData" :options="barOptions" />
        </div>
      </div>
    </div>

    <!-- Registro de Movimientos Premium -->
    <div class="movements-card-premium">
      <div class="movements-header">
        <div class="flex items-center gap-4 mb-4">
          <div class="movements-icon">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="movements-title">Registro de Movimientos</h3>
            <div class="flex items-center gap-4 mt-2 flex-wrap">
              <div class="live-badge">
                <span class="live-pulse"></span>
                <span>Sincronización Activa</span>
              </div>
              <span class="movements-subtitle">{{ movimientosRecientes.length }} transacciones registradas</span>
            </div>
          </div>
        </div>
        <div class="movements-actions">
          <button @click="abrirModalMovimiento('ingreso')" class="movement-btn-income">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Ingreso</span>
          </button>
          <button @click="abrirModalMovimiento('gasto')" class="movement-btn-expense">
            <TrendingUp :size="20" class="rotate-180" />
            <span>Gasto</span>
          </button>
        </div>
      </div>

      <!-- Tabla de Movimientos Premium -->
      <div class="movements-table-container">
        <table class="movements-table">
          <thead class="movements-thead">
            <tr>
              <th class="movements-th">Fecha</th>
              <th class="movements-th">Descripción</th>
              <th class="movements-th hidden sm:table-cell">Categoría</th>
              <th class="movements-th">Monto</th>
              <th class="movements-th hidden lg:table-cell">Tipo</th>
              <th class="movements-th text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="movements-tbody">
            <tr v-for="movimiento in movimientosRecientes" :key="movimiento.id"
                class="movements-row">
              <td class="px-2 md:px-4 py-4 text-xs md:text-sm text-gray-700">
                <div class="font-medium">{{ formatearFecha(movimiento.fecha) }}</div>
              </td>
              <td class="px-2 md:px-4 py-4 text-xs md:text-sm text-gray-800">
                <div class="flex items-center min-w-0">
                  <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3" :class="movimiento.tipo === 'ingreso' ? 'bg-emerald-100' : 'bg-red-100'">
                    <span class="text-base">{{ getCategoriaIcono(movimiento.categoria) }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold truncate max-w-[140px] md:max-w-xs">{{ movimiento.descripcion }}</div>
                    <div class="sm:hidden text-xs text-gray-500 truncate">{{ movimiento.categoria }}</div>
                  </div>
                </div>
              </td>
              <td class="px-2 md:px-4 py-3 hidden sm:table-cell">
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full"
                      :class="getCategoriaColor(movimiento.categoria)">
                  {{ movimiento.categoria }}
                </span>
              </td>
              <td class="px-2 md:px-4 py-4 text-sm font-bold text-right">
                <div :class="movimiento.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-500'">
                  {{ movimiento.tipo === 'ingreso' ? '+' : '-' }}{{ formatearDinero(Math.abs(movimiento.monto)) }}
                </div>
              </td>
              <td class="px-2 md:px-4 py-3 hidden lg:table-cell">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full"
                      :class="movimiento.tipo === 'ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                  <component :is="movimiento.tipo === 'ingreso' ? TrendingUp : TrendingDown" :size="14" />
                  {{ movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
                </span>
              </td>
              <td class="px-2 md:px-4 py-3">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="verDetalles(movimiento)" class="p-2 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors" title="Ver detalles">
                    <Eye :size="16" />
                  </button>
                  <button @click="editarMovimiento(movimiento)" class="p-2 rounded-full text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 transition-colors" title="Editar">
                    <Edit3 :size="16" />
                  </button>
                  <button @click="confirmarEliminar(movimiento)" class="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors" title="Eliminar">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Don Eduardo -->
    <Transition name="modal">
      <div v-if="mostrarModalDonEduardo" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <CreditCard :size="16" class="text-white" />
              </div>
              Movimiento Don Eduardo
            </h3>
            <button @click="cerrarModalDonEduardo" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="registrarMovimientoDonEduardo" class="p-6 flex flex-col gap-6">
            <div class="md-field">
              <label class="md-label" for="edu-tipo">Tipo de Movimiento</label>
              <select id="edu-tipo" v-model="formDonEduardo.tipo" class="md-input" required>
                <option value="" disabled>Seleccionar tipo...</option>
                <option value="prestamo">💰 Dinero prestado por Don Eduardo (+deuda)</option>
                <option value="pago_recibido">📥 Pago recibido y enviado a Don Eduardo (-deuda)</option>
                <option value="pago_eduardo">💸 Pago directo a Don Eduardo (-deuda)</option>
                <option value="abono_capital">🎯 Abono a Capital (-deuda)</option>
                <option value="ganancia_gasto">💰 Pago ganancia mensual Q2,000 (registrar como gasto)</option>
              </select>
            </div>

            <div class="md-field">
              <label class="md-label" for="edu-monto">Monto</label>
              <input id="edu-monto" v-model.number="formDonEduardo.monto" type="number" step="0.01" class="md-input md-input-amount" placeholder="0.00" required />
            </div>

            <div class="md-field">
              <label class="md-label" for="edu-descripcion">Descripción</label>
              <input id="edu-descripcion" v-model="formDonEduardo.descripcion" class="md-input" placeholder="Detalle del movimiento..." required />
            </div>
            
            <div class="md-field">
              <label class="md-label" for="edu-fecha">Fecha</label>
              <input id="edu-fecha" v-model="formDonEduardo.fecha" type="date" class="md-input" required />
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
              <button type="button" @click="cerrarModalDonEduardo" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary tech-btn relative overflow-hidden" :disabled="guardando">
                <span class="z-10 relative flex items-center justify-center gap-2">{{ guardando ? 'Guardando...' : 'Registrar' }}</span>
                <span class="tech-btn-bg absolute inset-0"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Movimientos Generales -->
    <Transition name="modal">
      <div v-if="mostrarModalMovimiento" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                <Plus :size="16" class="text-white" />
              </div>
              {{ tipoMovimientoActual === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Gasto' }}
            </h3>
            <button @click="cerrarModalMovimiento" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="registrarMovimiento" class="p-6 flex flex-col gap-6">
  
  <!-- SECCIÓN: MONTO (Prioridad) -->
  <div class="md-field">
    <label class="md-label" for="mov-monto">Monto</label>
    <input id="mov-monto" v-model.number="formMovimiento.monto" type="number" step="0.01" class="md-input md-input-amount" placeholder="0.00" required />
  </div>

  <!-- SECCIÓN: DETALLES -->
  <div class="flex flex-col gap-4">
    <div class="md-field">
      <label class="md-label" for="mov-descripcion">Descripción</label>
      <input id="mov-descripcion" v-model="formMovimiento.descripcion" class="md-input" placeholder="Ej: Compra de herramientas" required />
    </div>
    <div class="md-field">
      <label class="md-label" for="mov-categoria">Categoría</label>
      <select id="mov-categoria" v-model="formMovimiento.categoria" class="md-input" required>
        <option value="" disabled class="text-slate-500">Seleccionar categoría...</option>
        <option v-for="categoria in categoriasPorTipo" :key="categoria.nombre" :value="categoria.nombre" class="bg-slate-800 text-white">
          {{ categoria.icono }} {{ categoria.nombre }}
        </option>
      </select>
      <button type="button" @click="abrirModalNuevaCategoria(tipoMovimientoActual)" class="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center transition-colors">
        <Plus :size="12" class="mr-1" />
        Agregar nueva categoría
      </button>
    </div>
    <div class="md-field">
        <label class="md-label" for="mov-fecha">Fecha</label>
        <input id="mov-fecha" v-model="formMovimiento.fecha" type="date" class="md-input" required />
     </div>
  </div>

  <!-- SECCIÓN: INTEGRACIONES -->
  <div class="space-y-4">
    <h4 class="text-sm font-semibold text-slate-400">Integraciones (Opcional)</h4>
    <label v-if="tipoMovimientoActual === 'gasto'" class="flex items-center cursor-pointer p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-colors">
      <input v-model="formMovimiento.agregarADonEduardo" type="checkbox" class="sr-only peer" />
      <div class="relative w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      <div class="ml-3">
        <span class="text-sm font-medium text-white">💳 Financiar con Don Eduardo</span>
        <p class="text-xs text-slate-400">Este gasto se sumará a la deuda</p>
      </div>
    </label>
    <label v-if="tipoMovimientoActual === 'ingreso'" class="flex items-center cursor-pointer p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
      <input v-model="formMovimiento.enviarADonEduardo" type="checkbox" class="sr-only peer" />
      <div class="relative w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
      <div class="ml-3">
        <span class="text-sm font-medium text-white">📤 Abonar a Don Eduardo</span>
        <p class="text-xs text-slate-400">Este ingreso reducirá la deuda</p>
      </div>
    </label>
  </div>
  
  <!-- SECCIÓN: BOTONES -->
  <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
    <button type="button" @click="cerrarModalMovimiento" class="btn-secondary">Cancelar</button>
    <button type="submit" class="btn-primary tech-btn relative overflow-hidden" :disabled="guardando">
      <span class="z-10 relative flex items-center justify-center gap-2">
        <svg v-if="guardando" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ guardando ? 'Guardando...' : 'Registrar' }}
      </span>
      <span class="tech-btn-bg absolute inset-0"></span>
    </button>
  </div>
</form>
        </div>
      </div>
    </Transition>

    <!-- Modal Editar Movimiento -->
    <Transition name="modal">
      <div v-if="mostrarModalEditar" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-emerald-900/95 to-cyan-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-emerald-700/50 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-emerald-700/50">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              Editar {{ tipoMovimientoActual === 'ingreso' ? 'Ingreso' : 'Gasto' }}
            </h3>
            <button @click="cerrarModalEditar" class="p-2 hover:bg-emerald-600/50 rounded-xl transition-colors text-emerald-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="actualizarMovimiento" class="p-6">
            <div class="mb-4">
              <label class="label-form">Descripción</label>
              <input v-model="formMovimiento.descripcion" 
                     class="input-primary" 
                     placeholder="Detalle del movimiento..." required />
            </div>
            
            <div class="mb-4">
              <label class="label-form">Categoría</label>
              <select v-model="formMovimiento.categoria" class="input-primary select-input" required>
                <option value="">Seleccionar categoría...</option>
                <option v-for="categoria in categoriasPorTipo" :key="categoria.nombre" :value="categoria.nombre">
                  {{ categoria.icono }} {{ categoria.nombre }}
                </option>
              </select>
              <button type="button" 
                      @click="abrirModalNuevaCategoria(tipoMovimientoActual)" 
                      class="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center transition-colors">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Agregar nueva categoría
              </button>
            </div>
            
            <div class="mb-4">
              <label class="label-form">Monto</label>
              <input v-model.number="formMovimiento.monto" 
                     type="number" step="0.01" 
                     class="input-primary" 
                     placeholder="0.00" required />
            </div>
            
            <div class="mb-6">
              <label class="label-form">Fecha</label>
              <input v-model="formMovimiento.fecha" 
                     type="date" 
                     class="input-primary date-input" required />
            </div>
            
            <!-- Opciones para gastos e ingresos en edición -->
            <div v-if="tipoMovimientoActual === 'gasto'" class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input v-model="formMovimiento.agregarADonEduardo" 
                       type="checkbox" 
                       class="sr-only" />
                <div class="relative">
                  <div class="block bg-purple-700 w-14 h-8 rounded-full"></div>
                  <div :class="['absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition', 
                               formMovimiento.agregarADonEduardo ? 'transform translate-x-full bg-emerald-500' : '']"></div>
                </div>
                <div class="ml-3 text-white">
                  <span class="text-sm font-medium">💳 Agregar al saldo de Don Eduardo</span>
                  <p class="text-xs text-purple-300">Este gasto será financiado por Don Eduardo</p>
                </div>
              </label>
            </div>

            <!-- Opciones para ingresos en edición -->
            <div v-if="tipoMovimientoActual === 'ingreso'" class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input v-model="formMovimiento.enviarADonEduardo" 
                       type="checkbox" 
                       class="sr-only" />
                <div class="relative">
                  <div class="block bg-blue-700 w-14 h-8 rounded-full"></div>
                  <div :class="['absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition', 
                               formMovimiento.enviarADonEduardo ? 'transform translate-x-full bg-emerald-500' : '']"></div>
                </div>
                <div class="ml-3 text-white">
                  <span class="text-sm font-medium">📤 Enviar a Don Eduardo</span>
                  <p class="text-xs text-blue-300">Este ingreso se aplicará para reducir la deuda con Don Eduardo</p>
                </div>
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-emerald-700/50">
              <button type="button" @click="cerrarModalEditar" 
                      class="px-6 py-3 text-white bg-red-600/80 hover:bg-red-700/80 border border-red-600/50 rounded-xl font-medium transition-all duration-200 hover:scale-105">
                Cancelar
              </button>
              <button type="submit" 
                      class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:hover:scale-100 flex items-center" 
                      :disabled="guardando">
                <svg v-if="guardando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ guardando ? 'Actualizando...' : 'Actualizar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Detalles Movimiento -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalDetalles" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-slate-500/20">
          <div class="flex items-center justify-between p-6 border-b border-slate-500/20 bg-slate-900/10">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              Detalles del Movimiento
            </h3>
            <button @click="cerrarModalDetalles" class="text-gray-500 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div v-if="movimientoSeleccionado" class="p-6">
            <!-- Header con icono y tipo -->
            <div class="flex items-center justify-center mb-6">
              <div class="text-6xl mr-4">{{ getCategoriaIcono(movimientoSeleccionado.categoria) }}</div>
              <div class="text-center">
                <h4 class="text-2xl font-bold text-white mb-1">{{ movimientoSeleccionado.descripcion }}</h4>
                <span class="px-3 py-1 text-sm rounded-full" 
                      :class="movimientoSeleccionado.tipo === 'ingreso' ? 'bg-emerald-900/30 text-emerald-600' : 'bg-red-900/30 text-red-400'">
                  {{ movimientoSeleccionado.tipo === 'ingreso' ? '📈 Ingreso' : '📉 Gasto' }}
                </span>
              </div>
            </div>

            <!-- Información detallada -->
            <div class="space-y-4">
              <div class="glass-info-card rounded-lg p-4">
                <h5 class="text-sm font-medium text-emerald-600 mb-2">💰 Monto</h5>
                <p class="text-3xl font-bold" 
                   :class="movimientoSeleccionado.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-400'">
                  {{ movimientoSeleccionado.tipo === 'ingreso' ? '+' : '-' }}{{ formatearDinero(Math.abs(movimientoSeleccionado.monto)) }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="glass-info-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-cyan-600 mb-2">📅 Fecha</h5>
                  <p class="text-lg font-semibold text-white">{{ formatearFecha(movimientoSeleccionado.fecha) }}</p>
                </div>

                <div class="glass-info-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-purple-600 mb-2">🏷️ Categoría</h5>
                  <span class="px-2 py-1 text-sm rounded-full" :class="getCategoriaColor(movimientoSeleccionado.categoria)">
                    {{ movimientoSeleccionado.categoria }}
                  </span>
                </div>
              </div>

              <div v-if="movimientoSeleccionado.fechaCreacion" class="glass-info-card rounded-lg p-4">
                <h5 class="text-sm font-medium text-orange-600 mb-2">🕒 Información adicional</h5>
                <p class="text-sm text-white">
                  Creado: {{ formatearFecha(movimientoSeleccionado.fechaCreacion) }}
                </p>
                <p v-if="movimientoSeleccionado.fechaModificacion" class="text-sm text-white">
                  Modificado: {{ formatearFecha(movimientoSeleccionado.fechaModificacion) }}
                </p>
              </div>
            </div>
            
            <div class="flex justify-end mt-6">
              <button @click="cerrarModalDetalles" class="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Confirmar Eliminación -->
    <Transition name="modal">
      <div v-if="mostrarModalEliminar" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div class="bg-gradient-to-br from-red-900/95 to-orange-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20 animate-slideUp">
          <div class="flex items-center justify-between p-6 border-b border-red-500/20 bg-red-900/10">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              Confirmar Eliminación
            </h3>
            <button @click="cerrarModalEliminar" class="p-2 hover:bg-red-700/20 rounded-xl transition-colors text-red-600 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div v-if="movimientoSeleccionado" class="p-6">
            <!-- Información del movimiento a eliminar -->
            <div class="text-center mb-6">
              <div class="text-6xl mb-4">🗑️</div>
              <h4 class="text-lg font-semibold text-white mb-2">
                ¿Estás seguro de que quieres eliminar este movimiento?
              </h4>
              <p class="text-sm text-red-600">Esta acción no se puede deshacer</p>
            </div>

            <!-- Detalles del movimiento -->
            <div class="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div class="flex items-center mb-3">
                <span class="text-2xl mr-3">{{ getCategoriaIcono(movimientoSeleccionado.categoria) }}</span>
                <div>
                  <p class="font-semibold text-white">{{ movimientoSeleccionado.descripcion }}</p>
                  <p class="text-sm text-red-600">{{ movimientoSeleccionado.categoria }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-red-600">Monto:</span>
                  <span class="ml-2 font-semibold" 
                        :class="movimientoSeleccionado.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-400'">
                    {{ movimientoSeleccionado.tipo === 'ingreso' ? '+' : '-' }}{{ formatearDinero(Math.abs(movimientoSeleccionado.monto)) }}
                  </span>
                </div>
                <div>
                  <span class="text-red-600">Fecha:</span>
                  <span class="ml-2 text-white">{{ formatearFecha(movimientoSeleccionado.fecha) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-red-700/30">
              <button @click="cerrarModalEliminar" 
                      class="px-6 py-3 text-white bg-red-600/80 hover:bg-red-700/80 border border-red-600/50 rounded-xl font-medium transition-all duration-200 hover:scale-105">
                Cancelar
              </button>
              <button @click="eliminarMovimiento" 
                      class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 hover:shadow-red-500/40 disabled:opacity-50 disabled:hover:scale-100 flex items-center"
                      :disabled="guardando">
                <svg v-if="guardando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                {{ guardando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Confirmación de Pago -->
    <Transition name="modal">
      <div v-if="mostrarModalConfirmacionPago" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="glass-card-premium rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-emerald-600 mb-4 text-center flex items-center justify-center">
            <DollarSign :size="24" class="mr-2" />
            Confirmación de Pago
          </h3>
          
          <div class="bg-emerald-900/50 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-white mb-2">
              {{ pagoConfirmacion.tipo === 'prestamo' ? 'Pago de Préstamo' : 'Ganancia Mensual' }}
            </h4>
            <p class="text-xl font-bold text-emerald-600">{{ formatearDinero(pagoConfirmacion.monto) }}</p>
            
            <!-- Campo de fecha -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-white mb-2">
                Fecha del pago:
              </label>
              <input v-model="pagoConfirmacion.fecha" 
                     type="date" 
                     class="w-full px-3 py-2 bg-white/90 border border-emerald-600 rounded-lg text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>

          <div class="mb-6">
            <p class="text-white mb-4">¿Quién realizó este pago?</p>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer p-3 rounded-lg border transition-colors"
                     :class="!pagoConfirmacion.pagadoPorDonEduardo ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-600/50 hover:border-emerald-500/70'">
                <input v-model="pagoConfirmacion.pagadoPorDonEduardo" 
                       :value="false" type="radio" class="mr-3 text-emerald-600">
                <div>
                  <span class="font-medium text-white">Nosotros (la empresa)</span>
                  <p class="text-sm text-emerald-300">Se registra solo como gasto</p>
                </div>
              </label>
              
              <label class="flex items-center cursor-pointer p-3 rounded-lg border transition-colors"
                     :class="pagoConfirmacion.pagadoPorDonEduardo ? 'border-orange-500 bg-orange-900/20' : 'border-orange-600/50 hover:border-orange-500/70'">
                <input v-model="pagoConfirmacion.pagadoPorDonEduardo" 
                       :value="true" type="radio" class="mr-3 text-orange-500">
                <div>
                  <span class="font-medium text-white">Don Eduardo</span>
                  <p class="text-sm text-orange-300">Se registra como gasto + se suma a la deuda</p>
                </div>
              </label>
            </div>
          </div>

          <div class="flex space-x-3">
            <button @click="mostrarModalConfirmacionPago = false" class="btn-secondary flex-1">
              Cancelar
            </button>
            <button @click="confirmarPagoPrestamo" 
                    class="btn-theme-primary flex-1" 
                    :disabled="guardando">
              {{ guardando ? 'Registrando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Confirmación Ganancia Mensual -->
    <Transition name="modal">
      <div v-if="mostrarModalGananciaMensual" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="glass-card-premium rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-emerald-600 mb-4 text-center flex items-center justify-center">
            💰 Ganancia Mensual
          </h3>
          
          <div class="bg-emerald-900/50 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-white mb-2">
              Pago Ganancia - {{ new Date(pagoConfirmacion.fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}
            </h4>
            <p class="text-xl font-bold text-emerald-600">{{ formatearDinero(pagoConfirmacion.monto) }}</p>
            <p class="text-sm text-emerald-300 mt-1">Don Eduardo</p>
            
            <!-- Campo de fecha -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-white mb-2">
                Fecha del pago:
              </label>
              <input v-model="pagoConfirmacion.fecha" 
                     type="date" 
                     class="w-full px-3 py-2 bg-white/90 border border-emerald-600 rounded-lg text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>

          <div class="mb-6">
            <p class="text-white mb-4">¿Quién realizó este pago?</p>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer p-3 rounded-lg border transition-colors"
                     :class="!pagoConfirmacion.pagadoPorDonEduardo ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-600/50 hover:border-emerald-500/70'">
                <input v-model="pagoConfirmacion.pagadoPorDonEduardo" 
                       :value="false" type="radio" class="mr-3 text-emerald-600">
                <div>
                  <span class="font-medium text-white">Nosotros (la empresa)</span>
                  <p class="text-sm text-emerald-300">Se registra solo como gasto</p>
                </div>
              </label>
              
              <label class="flex items-center cursor-pointer p-3 rounded-lg border transition-colors"
                     :class="pagoConfirmacion.pagadoPorDonEduardo ? 'border-orange-500 bg-orange-900/20' : 'border-orange-600/50 hover:border-orange-500/70'">
                <input v-model="pagoConfirmacion.pagadoPorDonEduardo" 
                       :value="true" type="radio" class="mr-3 text-orange-500">
                <div>
                  <span class="font-medium text-white">Don Eduardo</span>
                  <p class="text-sm text-orange-300">Se registra como gasto + se suma a la deuda</p>
                </div>
              </label>
            </div>
          </div>

          <div class="flex space-x-3">
            <button @click="cerrarModalGananciaMensual" class="btn-secondary flex-1">
              Cancelar
            </button>
            <button @click="confirmarGananciaMensual" 
                    class="btn-theme-primary flex-1" 
                    :disabled="guardando">
              {{ guardando ? 'Registrando...' : 'Confirmar Pago' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Nueva Categoría -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalNuevaCategoria" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-purple-900/95 to-indigo-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/20">
          <div class="flex items-center justify-between p-6 border-b border-purple-500/20 bg-purple-900/10">
            <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              Nueva Categoría
            </h3>
            <button @click="cerrarModalNuevaCategoria" class="text-gray-500 hover:text-white transition-colors p-2 hover:bg-purple-700/50 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="agregarNuevaCategoria" class="p-6">
            <div class="mb-4">
              <label class="label-form">Tipo de Categoría</label>
              <select v-model="formNuevaCategoria.tipo" class="input-primary select-input" required>
                <option value="gasto">💸 Gasto</option>
                <option value="ingreso">💰 Ingreso</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="label-form">Nombre de la Categoría</label>
              <input v-model="formNuevaCategoria.nombre" 
                     class="input-primary" 
                     placeholder="Ej: Combustible Generador" 
                     required />
            </div>
            
            <div class="mb-6">
              <label class="label-form">Icono (Emoji)</label>
              <div class="relative">
                <input v-model="formNuevaCategoria.icono" 
                       class="input-primary" 
                       placeholder="📁" 
                       maxlength="2"
                       required />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
                  {{ formNuevaCategoria.icono }}
                </div>
              </div>
              <p class="text-xs text-purple-300 mt-1">Usa un emoji que represente la categoría</p>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="cerrarModalNuevaCategoria" 
                      class="px-6 py-3 text-white bg-red-600/80 hover:bg-red-700/80 border border-red-600/50 rounded-xl font-medium transition-all duration-200 hover:scale-105">
                Cancelar
              </button>
              <button type="submit" 
                      class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 hover:shadow-purple-500/40 disabled:opacity-50 disabled:hover:scale-100 flex items-center" 
                      :disabled="guardando">
                <svg v-if="guardando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ guardando ? 'Agregando...' : 'Agregar Categoría' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { obtenerDocumentos, agregarDocumento, actualizarDocumento, eliminarDocumento } from '@/services/firebaseService';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/composables/useAuth';
import MainLayout from '@/components/MainLayout.vue';
import { useToast } from 'vue-toastification';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { 
  CreditCard, 
  Calculator, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  BarChart3,
  Eye,
  Edit3,
  Trash2,
  DollarSign,
  Clock,
  FileText
} from 'lucide-vue-next';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const toast = useToast();
const { currentUser, registrarBitacora } = useAuth();

// --- Estado Reactivo ---
const cargando = ref(true);
const guardando = ref(false);
const isFirebaseConnected = ref(false);

// Modales
const mostrarModalDonEduardo = ref(false);
const mostrarModalMovimiento = ref(false);
const mostrarModalEditar = ref(false);
const mostrarModalDetalles = ref(false);
const mostrarModalEliminar = ref(false);
const mostrarModalConfirmacionPago = ref(false);
const mostrarModalGananciaMensual = ref(false);
const mostrarModalNuevaCategoria = ref(false);
const tipoMovimientoActual = ref('');
const movimientoSeleccionado = ref(null);

// Variables para nueva categoría
const formNuevaCategoria = ref({
  nombre: '',
  icono: '📁',
  tipo: 'gasto' // 'gasto' o 'ingreso'
});

// Variables para confirmación de pagos
const pagoConfirmacion = ref({
  tipo: '', // 'prestamo' o 'ganancia'
  monto: 0,
  pagadoPorDonEduardo: false,
  fecha: new Date().toISOString().split('T')[0] // Fecha en formato YYYY-MM-DD
});

// Don Eduardo
const saldoInicialDonEduardo = ref(61035.55); // Saldo inicial agosto 2025 - según Excel
const movimientosDonEduardo = ref([]);
const limiteCredito = ref(100000);

// Préstamo principal
const pagosPrevios = 10; // TODO: Mover a configuración de BD
const pagosPrestamo = computed(() => {
  const pagosEnSistema = transacciones.value.filter(t => t.categoria === 'Pago de Préstamo').length;
  return pagosPrevios + pagosEnSistema;
});
const montoPagoPrestamo = ref(3700);

// Ganancias mensuales Don Eduardo
const gananciaMensualDonEduardo = ref(2000); // Q2,000 mensuales
const gananciasRegistradas = ref([]); // Registro de ganancias pagadas
const mesActual = ref(new Date().getMonth() + 1);
const añoActual = ref(new Date().getFullYear());

// Datos generales
const transacciones = ref([]);

// Formularios
const formDonEduardo = ref({
  tipo: '',
  monto: '',
  descripcion: '',
  fecha: new Date().toISOString().split('T')[0]
});

const formMovimiento = ref({
  descripcion: '',
  categoria: '',
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
  agregarADonEduardo: false,
  enviarADonEduardo: false
});

// --- Computed Properties ---
const saldoDonEduardo = computed(() => {
  const movimientos = movimientosDonEduardo.value.reduce((total, mov) => {
    const monto = Number(mov.monto) || 0;
    switch (mov.tipo) {
      case 'prestamo': return total + monto;      // Dinero que te presta (+) - aumenta deuda
      case 'pago_recibido': return total - monto; // Pagos que recibes y le envías (-) - reduce deuda
      case 'pago_eduardo': return total - monto;  // Pagos directos a él (-) - reduce deuda  
      case 'intereses': return total - monto;     // Sus intereses (-) - reduce deuda
      default: return total;
    }
  }, 0);
  
  return saldoInicialDonEduardo.value + movimientos;
});

const ultimosMovimientosDonEduardo = computed(() => {
  return [...movimientosDonEduardo.value]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)
    .map(mov => ({
      ...mov,
      // Mostrar + para préstamos (aumenta deuda) y - para pagos (reduce deuda)
      monto: mov.tipo === 'prestamo' ? Math.abs(mov.monto) : -Math.abs(mov.monto)
    }));
});

const ingresosCobrados = computed(() => {
  return transacciones.value
    .filter(t => t.tipo === 'ingreso')
    .reduce((total, t) => total + (Number(t.monto) || 0), 0);
});

const ingresosPorCobrar = computed(() => {
  // Esta lógica dependerá de cómo se gestionen los cobros en el futuro.
  // Por ahora, se puede mantener o adaptar si los cobros se integran en transacciones.
  return 0; // Placeholder
});

const gastosTotales = computed(() => {
  return transacciones.value
    .filter(t => t.tipo === 'gasto')
    .reduce((total, t) => total + (Number(t.monto) || 0), 0);
});

const flujoNeto = computed(() => {
  return ingresosCobrados.value - gastosTotales.value;
});

const montoTotalPrestamo = computed(() => {
  return 36 * montoPagoPrestamo.value;
});

const movimientosRecientes = computed(() => {
  const todosMovimientos = [
    ...transacciones.value,
    ...movimientosDonEduardo.value.map(mov => ({
      ...mov,
      id: mov.id, // Asegurarse de que el id esté presente
      categoria: 'Crédito Don Eduardo',
      tipo: mov.tipo === 'prestamo' ? 'ingreso' : 'gasto'
    }))
  ];
  
  return todosMovimientos
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 10);
});

// Categorías por defecto 
const categoriasDefecto = {
  ingresos: [
    { nombre: 'Servicios Pagados', icono: '💰' },
    { nombre: 'Ventas Adicionales', icono: '🛍️' },
    { nombre: 'Cobros Pendientes', icono: '📊' },
    { nombre: 'Otros Ingresos', icono: '💵' }
  ],
  gastos: [
    { nombre: 'Combustible Moto', icono: '🏍️' },
    { nombre: 'Combustible Carro', icono: '🚗' },
    { nombre: 'Combustible Máquinas', icono: '🚜' },
    { nombre: 'Contador', icono: '📊' },
    { nombre: 'Quincenas', icono: '💼' },
    { nombre: 'Materiales', icono: '🛠️' },
    { nombre: 'Préstamos', icono: '🏦' },
    { nombre: 'Pago de Préstamo', icono: '💳' },
    { nombre: 'Ganancia Don Eduardo', icono: '💰' },
    { nombre: 'Inversiones', icono: '📈' },
    { nombre: 'Alimentación', icono: '🍽️' },
    { nombre: 'Transporte', icono: '🚛' },
    { nombre: 'Servicios', icono: '⚡' },
    { nombre: 'Mantenimiento', icono: '🔧' },
    { nombre: 'Otros Gastos', icono: '💸' }
  ]
};

// Categorías reactivas (incluye defecto + personalizadas)
const categoriasPersonalizadas = ref({ ingresos: [], gastos: [] });
const categoriasConIconos = computed(() => ({
  ingresos: [...categoriasDefecto.ingresos, ...categoriasPersonalizadas.value.ingresos],
  gastos: [...categoriasDefecto.gastos, ...categoriasPersonalizadas.value.gastos]
}));

const categoriasPorTipo = computed(() => {
  if (tipoMovimientoActual.value === 'ingreso') {
    return categoriasConIconos.value.ingresos;
  } else {
    return categoriasConIconos.value.gastos;
  }
});

// --- Datos para las gráficas ---
const chartDonEduardoData = computed(() => {
  if (!movimientosDonEduardo.value.length) return null;
  
  // Calcular saldo acumulado
  let saldoAcumulado = saldoInicialDonEduardo.value;
  const movimientosOrdenados = [...movimientosDonEduardo.value]
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
  const labels = [];
  const saldos = [];
  
  // Punto inicial
  labels.push('Inicio Agosto');
  saldos.push(saldoAcumulado);
  
  movimientosOrdenados.forEach(mov => {
    const monto = Number(mov.monto) || 0;
    switch (mov.tipo) {
      case 'prestamo': saldoAcumulado += monto; break;
      case 'pago_recibido': saldoAcumulado -= monto; break;
      case 'pago_eduardo': saldoAcumulado -= monto; break;
      case 'intereses': saldoAcumulado -= monto; break;
    }
    labels.push(formatearFecha(mov.fecha));
    saldos.push(saldoAcumulado);
  });

  return {
    labels,
    datasets: [{
      label: 'Saldo Don Eduardo',
      data: saldos,
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
});

const chartPrestamoData = computed(() => ({
  labels: ['Pagado', 'Restante'],
  datasets: [{
    data: [pagosPrestamo.value, 36 - pagosPrestamo.value],
    backgroundColor: [
      'rgba(249, 115, 22, 0.8)',
      'rgba(75, 85, 99, 0.6)'
    ],
    borderColor: [
      'rgba(249, 115, 22, 1)',
      'rgba(75, 85, 99, 1)'
    ],
    borderWidth: 2
  }]
}));

const chartGastosData = computed(() => {
  const gastosAgrupados = {};
  
  // Agrupar gastos por categoría
  transacciones.value.forEach(mov => {
    if (mov.tipo === 'gasto') {
      const categoria = mov.categoria || 'Otros';
      gastosAgrupados[categoria] = (gastosAgrupados[categoria] || 0) + (Number(mov.monto) || 0);
    }
  });

  // Ordenar por monto y tomar top 8
  const topGastos = Object.entries(gastosAgrupados)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const labels = topGastos.map(([categoria]) => categoria);
  const data = topGastos.map(([, monto]) => monto);

  return {
    labels,
    datasets: [{
      label: 'Gastos por Categoría',
      data,
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 2
    }]
  };
});

// Opciones de las gráficas
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgba(229, 231, 235, 0.8)'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'rgba(156, 163, 175, 0.8)',
        maxTicksLimit: 6
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)'
      }
    },
    y: {
      ticks: {
        color: 'rgba(156, 163, 175, 0.8)',
        callback: function(value) {
          return 'Q' + new Intl.NumberFormat('es-GT').format(value);
        }
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)'
      }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'rgba(156, 163, 175, 0.8)',
        maxRotation: 45
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)'
      }
    },
    y: {
      ticks: {
        color: 'rgba(156, 163, 175, 0.8)',
        callback: function(value) {
          return 'Q' + new Intl.NumberFormat('es-GT').format(value);
        }
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)'
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgba(229, 231, 235, 0.8)',
        padding: 20
      }
    }
  }
};

// --- Métodos ---
const formatearDinero = (cantidad) => {
  if (!cantidad && cantidad !== 0) return 'Q0.00';
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2
  }).format(Number(cantidad) || 0);
};

const formatearFecha = (fechaInput) => {
  if (!fechaInput) return '';
  try {
    let fecha;
    
    // Verificar si es un Timestamp (tiene método toDate)
    if (fechaInput && typeof fechaInput.toDate === 'function') {
      fecha = fechaInput.toDate();
    }
    // Verificar si ya es una instancia de Date válida
    else if (fechaInput && fechaInput.getTime && !isNaN(fechaInput.getTime())) {
      fecha = fechaInput;
    }
    // Intentar crear fecha desde string
    else {
      fecha = new Date(fechaInput);
    }
    
    // Verificar que la fecha es válida
    if (!fecha || isNaN(fecha.getTime())) {
      return 'N/A';
    }
    
    return fecha.toLocaleDateString('es-GT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error('Error formateando fecha:', error, 'Input:', fechaInput);
    return 'N/A';
  }
};

const getCategoriaColor = (categoria) => {
  const colores = {
    'Combustible Moto': 'bg-yellow-900/30 text-yellow-400',
    'Combustible Carro': 'bg-orange-900/30 text-orange-400', 
    'Combustible Máquinas': 'bg-amber-900/30 text-amber-400',
    'Combustible': 'bg-yellow-900/30 text-yellow-400', // Para compatibilidad
    'Contador': 'bg-blue-900/30 text-blue-400',
    'Quincenas': 'bg-green-900/30 text-green-400',
    'Materiales': 'bg-stone-900/30 text-stone-400',
    'Préstamos': 'bg-red-900/30 text-red-400',
    'Pago de Préstamo': 'bg-rose-900/30 text-rose-400',
    'Ganancia Don Eduardo': 'bg-emerald-900/30 text-emerald-400',
    'Crédito Don Eduardo': 'bg-purple-900/30 text-purple-200',
    'Alimentación': 'bg-pink-900/30 text-pink-400',
    'Transporte': 'bg-cyan-900/30 text-cyan-400',
    'Servicios': 'bg-indigo-900/30 text-indigo-400',
    'Mantenimiento': 'bg-teal-900/30 text-teal-400',
    'Inversiones': 'bg-violet-900/30 text-violet-400',
    'default': 'bg-slate-900/30 text-slate-400'
  };
  return colores[categoria] || colores['default'];
};

const getCategoriaIcono = (categoria) => {
  // Buscar en ambas listas de categorías
  const todasCategorias = [...categoriasConIconos.value.ingresos, ...categoriasConIconos.value.gastos];
  const categoriaEncontrada = todasCategorias.find(cat => cat.nombre === categoria);
  return categoriaEncontrada ? categoriaEncontrada.icono : '📁';
};

// Modales
const abrirModalMovimiento = (tipo) => {
  tipoMovimientoActual.value = tipo;
  formMovimiento.value = {
    descripcion: '',
    categoria: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    agregarADonEduardo: false,
    enviarADonEduardo: false
  };
  mostrarModalMovimiento.value = true;
};

const cerrarModalMovimiento = () => {
  mostrarModalMovimiento.value = false;
  tipoMovimientoActual.value = '';
};

const cerrarModalDonEduardo = () => {
  mostrarModalDonEduardo.value = false;
  formDonEduardo.value = {
    tipo: '',
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  };
};

const verDetalles = (movimiento) => {
  movimientoSeleccionado.value = movimiento;
  mostrarModalDetalles.value = true;
};

const editarMovimiento = (movimiento) => {
  console.log('Editando movimiento:', movimiento);
  movimientoSeleccionado.value = movimiento;
  tipoMovimientoActual.value = movimiento.tipo;
  formMovimiento.value = {
    descripcion: movimiento.descripcion,
    categoria: movimiento.categoria,
    monto: Math.abs(movimiento.monto),
    fecha: movimiento.fecha?.toDate ? 
           movimiento.fecha.toDate().toISOString().split('T')[0] : 
           (movimiento.fecha instanceof Date ? 
            movimiento.fecha.toISOString().split('T')[0] : 
            new Date(movimiento.fecha).toISOString().split('T')[0]),
    agregarADonEduardo: false,
    enviarADonEduardo: false
  };
  mostrarModalEditar.value = true;
};

const cerrarModalEditar = () => {
  mostrarModalEditar.value = false;
  movimientoSeleccionado.value = null;
  formMovimiento.value = {
    descripcion: '',
    categoria: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    agregarADonEduardo: false,
    enviarADonEduardo: false
  };
};

const cerrarModalDetalles = () => {
  mostrarModalDetalles.value = false;
  movimientoSeleccionado.value = null;
};

const confirmarEliminar = (movimiento) => {
  movimientoSeleccionado.value = movimiento;
  mostrarModalEliminar.value = true;
};

const cerrarModalEliminar = () => {
  mostrarModalEliminar.value = false;
  movimientoSeleccionado.value = null;
};

// Funciones para ganancia mensual
const abrirModalGananciaMensual = () => {
  pagoConfirmacion.value = {
    tipo: 'ganancia',
    monto: gananciaMensualDonEduardo.value,
    pagadoPorDonEduardo: false,
    fecha: new Date().toISOString().split('T')[0]
  };
  mostrarModalGananciaMensual.value = true;
};

const cerrarModalGananciaMensual = () => {
  mostrarModalGananciaMensual.value = false;
};

// Función para mostrar selector de tipo de transacción
const mostrarFormularioTransaccion = () => {
  // Por ahora abrimos directamente el modal de movimiento
  // Puedes expandir esto para mostrar un selector de tipo primero
  abrirModalMovimiento('gasto');
};

const confirmarGananciaMensual = async () => {
  if (!isFirebaseConnected.value) {
    toast.error('Firebase no está conectado. No se puede registrar el pago.');
    return;
  }
  
  guardando.value = true;
  try {
    // Verificar si ya se pagó este mes
    const mesAño = `${mesActual.value}-${añoActual.value}`;
    const yaRegistrado = gananciasRegistradas.value.find(g => g.mesAño === mesAño);
    
    if (yaRegistrado) {
      toast.warning('La ganancia de este mes ya fue registrada');
      mostrarModalGananciaMensual.value = false;
      guardando.value = false;
      return;
    }

    const fechaSeleccionada = new Date(pagoConfirmacion.value.fecha);
    const movimientoData = {
      descripcion: `Ganancia mensual Don Eduardo - ${fechaSeleccionada.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
      categoria: 'Ganancia Don Eduardo',
      tipo: 'gasto',
      monto: gananciaMensualDonEduardo.value,
      fecha: fechaSeleccionada,
      fechaCreacion: serverTimestamp(),
      mesAño: mesAño,
      pagadoPorDonEduardo: pagoConfirmacion.value.pagadoPorDonEduardo
    };
    
    await addDoc(collection(db, 'movimientos_financieros'), movimientoData);

    // Registrar en el seguimiento de ganancias
    const gananciaRegistro = {
      mesAño: mesAño,
      monto: gananciaMensualDonEduardo.value,
      fecha: fechaSeleccionada,
      fechaCreacion: serverTimestamp(),
      pagadoPorDonEduardo: pagoConfirmacion.value.pagadoPorDonEduardo
    };
    await addDoc(collection(db, 'ganancias_don_eduardo'), gananciaRegistro);

    // Si Don Eduardo pagó, registrar como préstamo adicional (suma a la deuda)
    if (pagoConfirmacion.value.pagadoPorDonEduardo) {
      const prestamoData = {
        tipo: 'prestamo',
        monto: gananciaMensualDonEduardo.value,
        descripcion: `Ganancia mensual ${fechaSeleccionada.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} (pagada por Don Eduardo)`,
        fecha: fechaSeleccionada,
        fechaCreacion: serverTimestamp(),
        proveedor: 'Don Eduardo'
      };
      await addDoc(collection(db, 'don_eduardo_movimientos'), prestamoData);
    }

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'registrar_ganancia_mensual',
        `Ganancia mensual Don Eduardo - Q${gananciaMensualDonEduardo.value} - ${pagoConfirmacion.value.pagadoPorDonEduardo ? 'Pagado por Don Eduardo' : 'Pagado en efectivo'}`,
        { monto: gananciaMensualDonEduardo.value, mesAño, pagadoPorDonEduardo: pagoConfirmacion.value.pagadoPorDonEduardo }
      );
    }

    mostrarModalGananciaMensual.value = false;
    toast.success(`✅ Ganancia mensual registrada correctamente`);
    await cargarDatos();
  } catch (error) {
    console.error('Error registrando ganancia mensual:', error);
    toast.error('Error al registrar la ganancia mensual');
  } finally {
    guardando.value = false;
  }
};

const eliminarMovimiento = async () => {
  guardando.value = true;
  try {
    const movimientoInfo = `${movimientoSeleccionado.value.descripcion} - Q${movimientoSeleccionado.value.monto}`;

    // Determinar la colección correcta
    let coleccion = 'transacciones';
    if (movimientoSeleccionado.value.categoria === 'Crédito Don Eduardo') {
      coleccion = 'don_eduardo_movimientos';
    }

    await deleteDoc(doc(db, coleccion, movimientoSeleccionado.value.id));

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'eliminar_transaccion',
        `Transacción eliminada: ${movimientoInfo}`,
        { movimiento: movimientoSeleccionado.value }
      );
    }

    toast.success('Movimiento eliminado correctamente');
    cerrarModalEliminar();
    await cargarDatos();
  } catch (error) {
    console.error('Error eliminando movimiento:', error);
    toast.error('Error al eliminar el movimiento');
  } finally {
    guardando.value = false;
  }
};

const registrarMovimiento = async () => {
  if (!isFirebaseConnected.value) {
    toast.error('Firebase no está conectado. No se puede registrar el movimiento.');
    return;
  }
  
  guardando.value = true;
  try {
    const transaccionData = {
      descripcion: formMovimiento.value.descripcion,
      categoria: formMovimiento.value.categoria,
      tipo: tipoMovimientoActual.value,
      monto: Number(formMovimiento.value.monto),
      fecha: new Date(formMovimiento.value.fecha),
      fechaCreacion: serverTimestamp(),
      fuente: 'general' // Fuente para distinguir de otros orígenes
    };
    
    await addDoc(collection(db, 'transacciones'), transaccionData);
    
    // Lógica para Don Eduardo
    if (tipoMovimientoActual.value === 'gasto' && formMovimiento.value.agregarADonEduardo) {
      await addDoc(collection(db, 'don_eduardo_movimientos'), {
        tipo: 'prestamo',
        monto: Number(formMovimiento.value.monto),
        descripcion: `${formMovimiento.value.descripcion} (Financiado)`,
        fecha: new Date(formMovimiento.value.fecha),
        fechaCreacion: serverTimestamp(),
        proveedor: 'Don Eduardo'
      });
      toast.success('Gasto registrado y sumado a la deuda de Don Eduardo');
    } else if (tipoMovimientoActual.value === 'ingreso' && formMovimiento.value.enviarADonEduardo) {
      await addDoc(collection(db, 'don_eduardo_movimientos'), {
        tipo: 'pago_recibido',
        monto: Number(formMovimiento.value.monto),
        descripcion: `${formMovimiento.value.descripcion} (Abono a deuda)`,
        fecha: new Date(formMovimiento.value.fecha),
        fechaCreacion: serverTimestamp(),
        proveedor: 'Don Eduardo'
      });
      toast.success('Ingreso registrado y abonado a la deuda de Don Eduardo');
    } else {
      toast.success('Transacción registrada correctamente');
    }

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(currentUser.value.id, currentUser.value.nombre, 'crear_transaccion', 
        `${transaccionData.descripcion} - Q${transaccionData.monto}`,
        { ...transaccionData }
      );
    }

    cerrarModalMovimiento();
    await cargarDatos();
  } catch (error) {
    console.error('Error registrando transacción:', error);
    toast.error('Error al registrar la transacción.');
  } finally {
    guardando.value = false;
  }
};

const actualizarMovimiento = async () => {
  guardando.value = true;
  try {
    const transaccionData = {
      descripcion: formMovimiento.value.descripcion,
      categoria: formMovimiento.value.categoria,
      tipo: tipoMovimientoActual.value,
      monto: Number(formMovimiento.value.monto),
      fecha: new Date(formMovimiento.value.fecha),
      fechaModificacion: serverTimestamp()
    };
    
    await updateDoc(doc(db, 'transacciones', movimientoSeleccionado.value.id), transaccionData);
    
    toast.success('Transacción actualizada correctamente');

    // Aquí se podría añadir lógica para manejar cambios en la integración con Don Eduardo si fuera necesario

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(currentUser.value.id, currentUser.value.nombre, 'actualizar_transaccion', 
        `${transaccionData.descripcion} - Q${transaccionData.monto}`,
        { id: movimientoSeleccionado.value.id, ...transaccionData }
      );
    }

    cerrarModalEditar();
    await cargarDatos();
  } catch (error) {
    console.error('Error actualizando transacción:', error);
    toast.error('Error al actualizar la transacción.');
  } finally {
    guardando.value = false;
  }
};

const registrarMovimientoDonEduardo = async () => {
  if (!isFirebaseConnected.value) {
    toast.error('Firebase no está conectado.');
    return;
  }
  
  guardando.value = true;
  try {
    let monto = Number(formDonEduardo.value.monto);
    
    // Si es ganancia_gasto, registrarlo como una transacción de gasto normal
    if (formDonEduardo.value.tipo === 'ganancia_gasto') {
      await addDoc(collection(db, 'transacciones'), {
        descripcion: formDonEduardo.value.descripcion || 'Pago ganancia mensual Don Eduardo',
        categoria: 'Ganancia Don Eduardo',
        tipo: 'gasto',
        monto: monto,
        fecha: new Date(formDonEduardo.value.fecha),
        fechaCreacion: serverTimestamp(),
        fuente: 'don_eduardo'
      });
      toast.success('Pago de ganancia registrado como gasto');
    } else {
      // Registrar en la colección de Don Eduardo
      await addDoc(collection(db, 'don_eduardo_movimientos'), {
        tipo: formDonEduardo.value.tipo, // 'prestamo', 'pago_recibido', 'pago_eduardo', 'abono_capital'
        monto: monto,
        descripcion: formDonEduardo.value.descripcion,
        fecha: new Date(formDonEduardo.value.fecha),
        fechaCreacion: serverTimestamp(),
        proveedor: 'Don Eduardo'
      });
      toast.success('Movimiento con Don Eduardo registrado');
    }
    
    cerrarModalDonEduardo();
    await cargarDatos();
  } catch (error) {
    console.error('Error registrando movimiento Don Eduardo:', error);
    toast.error('Error al registrar el movimiento.');
  } finally {
    guardando.value = false;
  }
};

// Funciones para categorías personalizadas
const cargarCategoriasPersonalizadas = async () => {
  try {
    if (!isFirebaseConnected.value) return;
    
    const categoriasSnapshot = await obtenerDocumentos('categorias_personalizadas');
    const categoriasFirebase = categoriasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const ingresosCategorias = categoriasFirebase.filter(cat => cat.tipo === 'ingreso');
    const gastosCategorias = categoriasFirebase.filter(cat => cat.tipo === 'gasto');
    
    categoriasPersonalizadas.value = {
      ingresos: ingresosCategorias,
      gastos: gastosCategorias
    };
  } catch (error) {
    console.error('Error cargando categorías personalizadas:', error);
  }
};

const abrirModalNuevaCategoria = (tipo = 'gasto') => {
  formNuevaCategoria.value = {
    nombre: '',
    icono: '📁',
    tipo: tipo
  };
  mostrarModalNuevaCategoria.value = true;
};

const cerrarModalNuevaCategoria = () => {
  mostrarModalNuevaCategoria.value = false;
  formNuevaCategoria.value = {
    nombre: '',
    icono: '📁',
    tipo: 'gasto'
  };
};

const agregarNuevaCategoria = async () => {
  if (!isFirebaseConnected.value) {
    toast.error('Firebase no está conectado. No se puede agregar la categoría.');
    return;
  }
  
  guardando.value = true;
  try {
    const nuevaCategoria = {
      nombre: formNuevaCategoria.value.nombre.trim(),
      icono: formNuevaCategoria.value.icono,
      tipo: formNuevaCategoria.value.tipo,
      fechaCreacion: serverTimestamp()
    };
    
    await addDoc(collection(db, 'categorias_personalizadas'), nuevaCategoria);
    toast.success(`Categoría "${nuevaCategoria.nombre}" agregada exitosamente`);
    
    cerrarModalNuevaCategoria();
    await cargarCategoriasPersonalizadas();
  } catch (error) {
    console.error('Error agregando nueva categoría:', error);
    toast.error('Error al agregar la nueva categoría');
  } finally {
    guardando.value = false;
  }
};

const registrarPagoPrestamo = () => {
  if (pagosPrestamo.value >= 36) {
    toast.info('El préstamo ya está completamente pagado');
    return;
  }
  
  // Abrir modal de confirmación
  pagoConfirmacion.value = {
    tipo: 'prestamo',
    monto: montoPagoPrestamo.value,
    pagadoPorDonEduardo: false,
    fecha: new Date().toISOString().split('T')[0]
  };
  mostrarModalConfirmacionPago.value = true;
};

const confirmarPagoPrestamo = async () => {
  if (!isFirebaseConnected.value) {
    toast.error('Firebase no está conectado. No se puede registrar el pago.');
    return;
  }
  
  guardando.value = true;
  try {
    const proximoPagoNumero = pagosPrestamo.value + 1;
    const transaccionData = {
      descripcion: `Pago préstamo ${proximoPagoNumero}/36`,
      categoria: 'Pago de Préstamo',
      tipo: 'gasto',
      monto: montoPagoPrestamo.value,
      fecha: new Date(pagoConfirmacion.value.fecha),
      fechaCreacion: serverTimestamp(),
      fuente: pagoConfirmacion.value.pagadoPorDonEduardo ? 'don_eduardo' : 'general'
    };
    
    await addDoc(collection(db, 'transacciones'), transaccionData);

    // Si Don Eduardo pagó, registrar como préstamo adicional en su cuenta
    if (pagoConfirmacion.value.pagadoPorDonEduardo) {
      await addDoc(collection(db, 'don_eduardo_movimientos'), {
        tipo: 'prestamo',
        monto: montoPagoPrestamo.value,
        descripcion: `Pago préstamo ${proximoPagoNumero}/36 (financiado)`,
        fecha: new Date(pagoConfirmacion.value.fecha),
        fechaCreacion: serverTimestamp(),
        proveedor: 'Don Eduardo'
      });
    }

    mostrarModalConfirmacionPago.value = false;
    await cargarDatos(); // Recarga los datos, lo que actualizará el `computed` de `pagosPrestamo`
    
    toast.success(`Pago ${pagosPrestamo.value}/36 registrado correctamente`);

  } catch (error) {
    console.error('Error registrando pago préstamo:', error);
    toast.error('Error al registrar el pago del préstamo');
  } finally {
    guardando.value = false;
  }
};

// Carga de datos
const cargarDatos = async () => {
  cargando.value = true;
  try {
    // El nuevo modelo de datos unificado
    transacciones.value = await obtenerDocumentos('transacciones') || [];
    movimientosDonEduardo.value = await obtenerDocumentos('don_eduardo_movimientos') || [];
    gananciasRegistradas.value = await obtenerDocumentos('ganancias_don_eduardo') || [];
    
    // Cargar categorías personalizadas
    const categoriasSnapshot = await obtenerDocumentos('categorias_personalizadas') || [];
    categoriasPersonalizadas.value.ingresos = categoriasSnapshot.filter(cat => cat.tipo === 'ingreso');
    categoriasPersonalizadas.value.gastos = categoriasSnapshot.filter(cat => cat.tipo === 'gasto');

    isFirebaseConnected.value = true;
    toast.info('Datos financieros sincronizados');
  } catch (error) {
    console.error('Error cargando datos de Firebase:', error);
    toast.error('No se pudieron cargar los datos financieros.');
    // Datos vacíos como fallback
    transacciones.value = [];
    movimientosDonEduardo.value = [];
    gananciasRegistradas.value = [];
    isFirebaseConnected.value = false;
  } finally {
    cargando.value = false;
  }
};

// Inicialización con movimientos predefinidos
const inicializarMovimientosDonEduardo = async () => {
  if (!isFirebaseConnected.value) {
    console.log('Firebase no conectado, saltando inicialización de movimientos');
    return;
  }
  
  // Limpiar movimientos existentes para actualizar con datos correctos
  const existingSnapshot = await obtenerDocumentos('don_eduardo_movimientos');
  
  // Si hay datos, preguntar si queremos resetear (por ahora lo hacemos automáticamente)
  if (existingSnapshot.docs.length > 0) {
    console.log('Movimientos existentes encontrados, actualizando...');
    // Eliminar movimientos existentes (opcional - comentar si no quieres resetear)
    // for (const doc of existingSnapshot.docs) {
    //   await deleteDoc(doc.ref);
    // }
    return; // Comentar esta línea si quieres resetear los datos
  }
  
  // Movimientos iniciales basados en tu Excel (orden cronológico y montos corregidos)
  const movimientosIniciales = [
    { tipo: 'prestamo', monto: 3700, descripcion: 'Pago préstamo 11/36', fecha: new Date('2025-08-01'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 700, descripcion: 'Contador', fecha: new Date('2025-08-02'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 100, descripcion: 'Gasolina', fecha: new Date('2025-08-03'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'pago_recibido', monto: 27000, descripcion: 'Pago de MC', fecha: new Date('2025-08-04'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'pago_recibido', monto: 4300, descripcion: 'Pago Noguchi', fecha: new Date('2025-08-05'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 150, descripcion: 'Mochila de Brandon', fecha: new Date('2025-08-06'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 6000, descripcion: 'Préstamo de Bay 3 pagos a descontar', fecha: new Date('2025-08-07'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 2500, descripcion: 'Quincena de Julio, agosto', fecha: new Date('2025-08-08'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 2000, descripcion: 'Quincena de Brandon', fecha: new Date('2025-08-09'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 3100, descripcion: 'Quincena de carlos tax', fecha: new Date('2025-08-10'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 3500, descripcion: 'Quincena de bayron', fecha: new Date('2025-08-11'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'intereses', monto: 2000, descripcion: 'Pago Don Eduardo (ganancia mensual)', fecha: new Date('2025-08-12'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 1000, descripcion: 'Inversión Salama', fecha: new Date('2025-08-13'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 900, descripcion: 'Grama, duranas y fungicida, Santa Lucía reposición de visitas', fecha: new Date('2025-08-14'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' },
    { tipo: 'prestamo', monto: 500, descripcion: 'Árboles San Marcos', fecha: new Date('2025-08-15'), fechaCreacion: serverTimestamp(), proveedor: 'Don Eduardo' }
  ];
  
  // Guardar movimientos iniciales
  for (const movimiento of movimientosIniciales) {
    await addDoc(collection(db, 'don_eduardo_movimientos'), movimiento);
  }
  
  toast.success('Movimientos iniciales de Don Eduardo cargados');
};

// Función para exportar datos
const exportarDatos = () => {
  const datos = {
    resumen: {
      fecha: new Date().toISOString(),
      ingresosCobrados: ingresosCobrados.value,
      ingresosPorCobrar: ingresosPorCobrar.value,
      gastosTotales: gastosTotales.value,
      flujoNeto: flujoNeto.value,
      saldoDonEduardo: saldoDonEduardo.value,
      gananciaMensual: gananciaMensualDonEduardo.value,
      progressoPrestamo: ((pagosPrestamo.value / 36) * 100).toFixed(2) + '%'
    },
    transacciones: transacciones.value.map(m => ({
      fecha: m.fecha?.toDate?.() || m.fecha,
      descripcion: m.descripcion,
      monto: m.monto,
      tipo: m.tipo,
      categoria: m.categoria,
      proveedor: m.proveedor
    })),
    donEduardoMovimientos: movimientosDonEduardo.value.map(m => ({
      fecha: m.fecha?.toDate?.() || m.fecha,
      descripcion: m.descripcion,
      monto: m.monto,
      tipo: m.tipo
    }))
  };
  
  const jsonStr = JSON.stringify(datos, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finanzas_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.success('Reporte exportado exitosamente');
};

onMounted(async () => {
  await cargarDatos();
});
</script>

<style scoped>
/* ===== MATERIAL DESIGN 3 INSPIRED FORM STYLES ===== */
.md-field {
  @apply relative flex flex-col;
}

.md-label {
  @apply text-xs font-semibold text-slate-400 mb-1;
}

.md-input {
  @apply w-full bg-slate-800/50 rounded-t-lg p-3 border-b-2 border-slate-600;
  @apply text-white transition-colors duration-300;
}

.md-input:focus {
  @apply outline-none bg-slate-800/80 border-emerald-500;
}

.md-input::placeholder {
  @apply text-slate-500;
}

.md-input-amount {
  @apply text-3xl font-bold text-emerald-400 p-4;
}

.modal-backdrop {
  @apply fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4;
}

/* ===== PREMIUM FINANZAS DESIGN SYSTEM ===== */
.finanzas-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== PREMIUM HERO BANNER SECTION ===== */
.hero-banner {
  position: relative;
  padding: 3rem;
  margin-bottom: 2.5rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d3250 100%);
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(59, 130, 246, 0.15) inset,
    0 0 80px rgba(59, 130, 246, 0.08) inset;
  border: 1px solid rgba(59, 130, 246, 0.2);
  overflow: hidden;
}

.hero-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: floatGlow 8s ease-in-out infinite;
}

@keyframes floatGlow {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.5;
  }
  50% {
    transform: translate(-30px, 30px);
    opacity: 0.8;
  }
}

.hero-content {
  position: relative;
  z-index: 10;
}

.hero-bg-pattern {
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
  background-size: 20px 20px;
}

.hero-icon {
  border-radius: 18px;
  box-shadow:
    0 12px 35px rgba(16, 185, 129, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: pulseIcon 3s ease-in-out infinite;
}

@keyframes pulseIcon {
  0%, 100% {
    box-shadow:
      0 12px 35px rgba(16, 185, 129, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  50% {
    box-shadow:
      0 16px 45px rgba(16, 185, 129, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
}

.hero-title {
  letter-spacing: -0.03em;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(59, 130, 246, 0.2);
}

.hero-subtitle {
  font-weight: 500;
}

.hero-description {
  max-width: 600px;
  line-height: 1.7;
}

.status-badge {
  @apply flex items-center space-x-2 px-3 py-2 rounded-full backdrop-blur-sm;
}

.status-online {
  @apply bg-emerald-500/20 border border-emerald-400/30;
}

.status-offline {
  @apply bg-orange-500/20 border border-orange-400/30;
}

.status-dot {
  @apply w-2 h-2 rounded-full;
}

.status-online .status-dot {
  @apply bg-emerald-400;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
  animation: pulse-online 2s infinite;
}

.status-offline .status-dot {
  @apply bg-orange-400;
  animation: pulse-offline 2s infinite;
}

@keyframes pulse-online {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse-offline {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ===== PREMIUM KPI CARDS SYSTEM ===== */
.kpi-grid {
  gap: 2rem;
}

.kpi-card {
  @apply relative rounded-3xl p-7;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 40px rgba(59, 130, 246, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  @apply absolute inset-0 rounded-3xl opacity-0 transition-all duration-500;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
}

.kpi-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.kpi-card:hover::before {
  opacity: 1;
}

.kpi-card:hover::after {
  opacity: 1;
}

.kpi-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow:
    0 35px 70px -15px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 60px rgba(59, 130, 246, 0.15) inset;
  border-color: rgba(59, 130, 246, 0.4);
}

.kpi-header {
  @apply flex items-center justify-between mb-4;
}

.kpi-icon-wrapper {
  @apply w-14 h-14 rounded-xl flex items-center justify-center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.kpi-trend {
  @apply text-lg;
}

.kpi-trend.positive {
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
}

.kpi-trend.negative {
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
}

.kpi-content h3.kpi-label {
  @apply text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider;
}

.kpi-value {
  @apply text-3xl font-bold mb-2;
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  letter-spacing: -0.025em;
}

.kpi-description {
  @apply text-sm opacity-80 mb-4;
}

.kpi-progress-bar {
  @apply w-full h-2 bg-slate-700/50 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
  box-shadow: 0 0 10px currentColor;
}

/* Flow-specific styles */
.positive-flow {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border-color: rgba(16, 185, 129, 0.2);
}

.negative-flow {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.2);
}

/* ===== ENHANCED QUICK ACTIONS ===== */
.quick-actions-section {
  margin-bottom: 2rem;
}

.section-header {
  text-align: center;
}

.section-title {
  @apply mb-2;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-description {
  @apply mb-6;
  line-height: 1.6;
}

/* ===== PREMIUM SECTION HEADERS ===== */
.premium-section-header {
  @apply relative;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.3), transparent) 1;
}

.section-icon-large {
  @apply w-16 h-16 rounded-2xl flex items-center justify-center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow:
    0 12px 35px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    box-shadow:
      0 12px 35px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  50% {
    box-shadow:
      0 16px 45px rgba(59, 130, 246, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
}

.section-title-premium {
  @apply text-3xl font-extrabold;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.section-subtitle-premium {
  @apply text-sm text-slate-400 font-medium;
}

.live-indicator {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-full;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.live-dot {
  @apply w-2.5 h-2.5 rounded-full bg-emerald-400;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.live-text {
  @apply text-xs font-bold text-emerald-300 uppercase tracking-wider;
}

/* ===== PREMIUM MOVEMENTS CARD ===== */
.movements-card-premium {
  @apply rounded-3xl p-8 mb-8;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 40px rgba(59, 130, 246, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.movements-header {
  @apply mb-6 pb-6;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(59, 130, 246, 0.4), transparent) 1;
}

.movements-icon {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  box-shadow:
    0 10px 30px rgba(16, 185, 129, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.movements-title {
  @apply text-2xl font-extrabold;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.movements-subtitle {
  @apply text-sm text-slate-400 font-medium;
}

.live-badge {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-full;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.live-pulse {
  @apply w-2 h-2 rounded-full bg-blue-400;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
  animation: pulseDot 2s ease-in-out infinite;
}

.live-badge span {
  @apply text-xs font-bold text-blue-300 uppercase tracking-wider;
}

.movements-actions {
  @apply flex gap-3;
}

.movement-btn-income,
.movement-btn-expense {
  @apply flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold;
  @apply transition-all duration-300;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.movement-btn-income {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.movement-btn-expense {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.movement-btn-income::before,
.movement-btn-expense::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.movement-btn-income:hover::before,
.movement-btn-expense:hover::before {
  width: 300px;
  height: 300px;
}

.movement-btn-income:hover,
.movement-btn-expense:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* ===== CRÉDITO REVOLVENTE PREMIUM STYLES ===== */
.credit-revolvente-section {
  @apply mb-12;
}

.credit-header-premium {
  @apply flex items-center justify-between mb-8 pb-6;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, rgba(6, 182, 212, 0.5), rgba(14, 165, 233, 0.3), transparent) 1;
  position: relative;
}

.credit-header-premium::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, #06b6d4 0%, #0ea5e9 100%);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
  animation: shimmer 2s ease-in-out infinite;
}

.credit-icon-premium {
  @apply flex items-center justify-center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(6, 182, 212, 0.4),
    0 0 0 4px rgba(6, 182, 212, 0.1);
  animation: pulse-soft 2s ease-in-out infinite;
}

.credit-icon-premium svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.credit-title-premium {
  @apply text-3xl font-black;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.credit-subtitle-premium {
  @apply text-sm font-medium;
  color: #64748b;
  margin-top: 4px;
}

.credit-action-btn {
  @apply px-6 py-3 rounded-xl font-bold transition-all duration-300;
  background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
  color: white;
  box-shadow:
    0 4px 15px rgba(6, 182, 212, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  position: relative;
  overflow: hidden;
}

.credit-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.credit-action-btn:hover::before {
  left: 100%;
}

.credit-action-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(6, 182, 212, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

.credit-metrics-premium {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.metric-card-premium {
  @apply relative p-8 rounded-2xl transition-all duration-500;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(148, 163, 184, 0.1);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
}

.metric-card-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card-premium:hover::before {
  opacity: 1;
}

.metric-card-premium.debt::before {
  color: #ef4444;
}

.metric-card-premium.payment::before {
  color: #10b981;
}

.metric-card-premium.available::before {
  color: #06b6d4;
}

.metric-card-premium:hover {
  transform: translateY(-8px);
  border-color: rgba(148, 163, 184, 0.3);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.metric-icon-wrapper {
  @apply flex items-center justify-center mb-4;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.metric-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 24px;
  padding: 4px;
  background: linear-gradient(135deg, currentColor, transparent);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.3;
}

.metric-icon-wrapper.debt {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow:
    0 10px 30px rgba(239, 68, 68, 0.3),
    0 0 0 4px rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-icon-wrapper.payment {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow:
    0 10px 30px rgba(16, 185, 129, 0.3),
    0 0 0 4px rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.metric-icon-wrapper.available {
  background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
  box-shadow:
    0 10px 30px rgba(6, 182, 212, 0.3),
    0 0 0 4px rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.metric-card-premium:hover .metric-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.metric-icon-wrapper svg {
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.metric-badge {
  @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.metric-badge.debt {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.metric-badge.payment {
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.metric-badge.available {
  background: rgba(6, 182, 212, 0.15);
  color: #67e8f9;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.metric-content-premium {
  @apply space-y-3;
}

.metric-label-premium {
  @apply block text-sm font-semibold uppercase tracking-wider;
  color: #94a3b8;
  letter-spacing: 1px;
}

.metric-value-premium {
  @apply block text-4xl font-black mb-2;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 20px rgba(255, 255, 255, 0.1);
  letter-spacing: -1px;
  line-height: 1.2;
}

.metric-value-premium.debt-value {
  color: #fca5a5;
  background: linear-gradient(135deg, #fca5a5 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-value-premium.payment-value {
  color: #6ee7b7;
  background: linear-gradient(135deg, #6ee7b7 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-value-premium.available-value {
  color: #67e8f9;
  background: linear-gradient(135deg, #67e8f9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-description-premium {
  @apply text-sm font-medium leading-relaxed;
  color: #cbd5e1;
}

.metric-quick-btn {
  @apply mt-4 w-full py-3 rounded-lg font-bold transition-all duration-300;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border: 2px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  position: relative;
  overflow: hidden;
}

.metric-quick-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.metric-quick-btn:hover::before {
  width: 300px;
  height: 300px;
}

.metric-quick-btn:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow:
    0 8px 25px rgba(16, 185, 129, 0.2),
    0 0 0 1px rgba(16, 185, 129, 0.1) inset;
  transform: translateY(-2px);
}

/* ===== PREMIUM TABLE STYLES ===== */
.movements-table-container {
  @apply overflow-x-auto rounded-2xl;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.movements-table {
  @apply min-w-full;
}

.movements-thead {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.movements-th {
  @apply px-6 py-5 text-left text-xs font-extrabold text-white uppercase tracking-wider;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.movements-tbody {
  @apply divide-y divide-slate-200;
  background: white;
}

.movements-row {
  @apply transition-all duration-200;
  background: white;
}

.movements-row:hover {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  transform: translateX(4px);
  box-shadow: -4px 0 0 0 #10b981 inset;
}

.action-card {
  @apply relative p-7 rounded-3xl text-white font-bold text-center;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 15px 35px -10px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  @apply absolute inset-0 rounded-3xl opacity-0;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
  transition: all 0.4s ease;
}

.action-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:hover::after {
  width: 300px;
  height: 300px;
}

.action-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  border-color: rgba(255, 255, 255, 0.3);
}

.action-icon-wrapper {
  @apply mb-4 flex justify-center;
}

.action-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.action-label {
  @apply block text-lg font-bold mb-1;
}

.action-description {
  @apply block text-sm opacity-80;
}

/* ===== ENHANCED DASHBOARD CARDS ===== */
.dashboard-section {
  margin-bottom: 2rem;
}

.enhanced-card {
  @apply rounded-3xl p-8;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 40px rgba(59, 130, 246, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.enhanced-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.6s ease;
}

.enhanced-card:hover::before {
  left: 100%;
}

.enhanced-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 40px 80px -20px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 60px rgba(59, 130, 246, 0.1) inset;
  border-color: rgba(59, 130, 246, 0.3);
}

.enhanced-card-header {
  @apply flex items-center justify-between mb-6;
}

.card-title-section {
  @apply flex items-center;
}

.title-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center mr-4;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-title {
  @apply text-xl font-bold text-white mb-1;
  letter-spacing: -0.025em;
}

.card-subtitle {
  @apply text-sm text-gray-500 font-medium;
}

.enhanced-action-btn {
  @apply flex items-center px-6 py-3.5 rounded-xl font-bold;
  @apply text-white shadow-lg transition-all duration-300;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow:
    0 10px 30px rgba(79, 70, 229, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;
}

.enhanced-action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.enhanced-action-btn:hover::before {
  width: 300px;
  height: 300px;
}

.enhanced-action-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 15px 40px rgba(79, 70, 229, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* ===== CREDIT METRICS GRID ===== */
.credit-metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4 mb-6;
}

.metric-card {
  @apply rounded-2xl p-6;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 12px 28px -8px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 40px -10px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  border-color: rgba(59, 130, 246, 0.4);
}

.metric-header {
  @apply flex items-center justify-between mb-3;
}

.metric-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center mr-3;
}

.metric-label {
  @apply text-sm font-semibold text-gray-300 uppercase tracking-wider;
}

.metric-value {
  @apply text-2xl font-bold mb-2;
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  letter-spacing: -0.025em;
}

.metric-status {
  @apply text-sm font-medium mb-3;
}

.metric-progress {
  @apply w-full h-2 bg-slate-600/30 rounded-full overflow-hidden;
}

.progress-bar {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
  box-shadow: 0 0 10px currentColor;
}

/* Specific metric card styles */
.debt-status {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.2);
}

.credit-status {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border-color: rgba(16, 185, 129, 0.2);
}

.pay-button {
  @apply text-xs bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg;
  @apply border border-emerald-400/30 text-emerald-300 transition-all duration-200;
  @apply hover:border-emerald-400/50 hover:text-emerald-200;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Gráficos responsive - Override Tailwind classes */
.h-48,
.md\:h-64 {
  height: 300px !important;
}

@media (max-width: 1024px) {
  .h-48,
  .md\:h-64 {
    height: 280px !important;
  }
}

@media (max-width: 768px) {
  .h-48,
  .md\:h-64 {
    height: 250px !important;
  }
}

@media (max-width: 640px) {
  .h-48,
  .md\:h-64 {
    height: 220px !important;
  }
}

@media (max-width: 480px) {
  .h-48,
  .md\:h-64 {
    height: 200px !important;
  }
}

@media (max-width: 375px) {
  .h-48,
  .md\:h-64 {
    height: 180px !important;
  }

  .kpi-value {
    font-size: 1.125rem !important;
  }
}

@media (max-width: 767px) {
  .finanzas-container {
    padding: 1rem !important;
  }

  .hero-banner {
    padding: 1.5rem !important;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem !important;
  }

  .hero-description {
    font-size: 0.9rem !important;
    margin-bottom: 1.5rem !important;
  }

  .kpi-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }

  .kpi-card {
    padding: 1.25rem !important;
  }

  .kpi-value {
    font-size: 1.75rem !important;
  }

  .section-title {
    font-size: 1.25rem !important;
  }

  .action-card {
    padding: 1.25rem !important;
  }

  .enhanced-card {
    padding: 1.25rem !important;
  }

  .credit-metrics-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }

  .metric-card {
    padding: 1rem !important;
  }

  .metric-value {
    font-size: 1.5rem !important;
  }

  .enhanced-card-header {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 1rem;
  }

  .card-title-section {
    justify-content: center !important;
  }

  .enhanced-action-btn {
    width: 100% !important;
    justify-content: center !important;
  }
}

@media (min-width: 768px) {
  .finanzas-container {
    padding: 2rem;
  }

  .hero-banner {
    padding: 3rem;
  }

  .kpi-grid {
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .finanzas-container {
    padding: 2.5rem;
  }

  .hero-banner {
    padding: 3.5rem;
  }
}

/* ===== ENHANCED MOBILE OPTIMIZATIONS ===== */
@media (max-width: 640px) {
  .hero-icon {
    width: 3rem !important;
    height: 3rem !important;
    padding: 0.75rem !important;
  }

  .hero-icon svg {
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  .status-badge {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.75rem !important;
  }

  .kpi-icon-wrapper {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }

  .kpi-icon-wrapper svg {
    width: 1.25rem !important;
    height: 1.25rem !important;
  }

  .action-icon {
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  .title-icon {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }

  .title-icon svg {
    width: 1.25rem !important;
    height: 1.25rem !important;
  }

  .metric-icon {
    width: 2rem !important;
    height: 2rem !important;
    margin-right: 0.5rem !important;
  }

  .metric-icon svg {
    width: 1rem !important;
    height: 1rem !important;
  }

  .kpi-value {
    font-size: 1.5rem !important;
  }
}

/* ===== ACCESSIBILITY IMPROVEMENTS ===== */
@media (prefers-reduced-motion: reduce) {
  .kpi-card,
  .action-card,
  .enhanced-card,
  .metric-card,
  .enhanced-action-btn {
    transition: none !important;
  }

  .kpi-card:hover,
  .action-card:hover,
  .enhanced-card:hover,
  .metric-card:hover {
    transform: none !important;
  }

  .action-icon,
  .kpi-trend {
    animation: none !important;
  }
}

/* ===== HIGH CONTRAST MODE ===== */
@media (prefers-contrast: high) {
  .hero-banner,
  .kpi-card,
  .action-card,
  .enhanced-card,
  .metric-card {
    border-width: 2px !important;
    border-color: rgb(255, 255, 255) !important;
  }

  .hero-title,
  .section-title,
  .card-title,
  .kpi-value,
  .metric-value {
    color: rgb(255, 255, 255) !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
  }
}

/* MOBILE FIRST - SIMPLE STYLES */
@media (max-width: 768px) {
  .finanzas-container {
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
  
  .professional-card, .glass-card-premium, .glass-info-card {
    padding: 1.25rem !important;
    min-height: auto;
    margin-bottom: 1rem !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .stats-grid, .grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
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
  
  .table-container {
    overflow-x: auto !important;
  }
  
  .btn, .tech-btn, .btn-gold {
    min-height: 44px !important;
    padding: 0.75rem 1rem !important;
    font-size: 0.85rem !important;
  }
  
  .mobile-optimized-btn {
    padding: 0.6rem 1.2rem !important;
    font-size: 0.85rem !important;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .finanzas-container {
    padding: 0.5rem !important;
  }
  
  .welcome-card,
  .professional-card,
  .glass-card-premium,
  .glass-info-card {
    padding: 1rem !important;
    margin-bottom: 0.75rem;
  }
  
  .quick-actions-section .grid {
    grid-template-columns: 1fr !important;
  }
  
  .stat-value {
    font-size: 1.125rem !important;
  }
  
  .stat-icon {
    width: 40px !important;
    height: 40px !important;
  }

  .kpi-value {
    font-size: 1.25rem !important;
  }
}

/* === QUICK STATS CARDS === */
.quick-stat-card {
  @apply bg-white/5 backdrop-blur-sm rounded-xl p-4;
  @apply border border-white/10 shadow-lg;
  @apply flex items-center gap-3;
  @apply transition-all duration-300;
  @apply hover:bg-white/10 hover:border-white/20;
  @apply hover:shadow-xl hover:shadow-black/20;
  min-height: 85px;
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
  @apply shadow-lg flex-shrink-0;
}

.stat-content {
  @apply flex flex-col flex-1;
}

.stat-label {
  @apply text-xs font-medium text-gray-300 mb-1;
  @apply uppercase tracking-wider;
}

.stat-value {
  @apply text-xl font-bold mb-0.5;
  @apply sm:text-2xl;
}

.stat-desc {
  @apply text-xs font-medium;
}

/* Mobile optimizations for quick stats */
@media (max-width: 640px) {
  .quick-stat-card {
    @apply flex-col text-center gap-2 p-3;
    min-height: 95px;
  }
  
  .stat-icon {
    @apply w-10 h-10 mx-auto;
  }
  
  .stat-value {
    @apply text-lg;
  }
}

/* === BETTER TOUCH TARGETS === */
@media (hover: none) and (pointer: coarse) {
  .btn, .tech-btn, .btn-gold, .btn-secondary {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 0.75rem 1.25rem !important;
  }
  
  .mobile-menu-btn {
    min-height: 48px !important;
    min-width: 48px !important;
  }
  
  /* Remove hover effects on touch devices */
  .professional-card:hover,
  .glass-card-premium:hover,
  .stat-item:hover,
  .quick-stat-card:hover {
    transform: none !important;
  }
}
</style>




