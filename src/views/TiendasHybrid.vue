<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 text-gray-200 space-y-6 pb-10">
    <!-- Header con glassmorphism oscuro -->
    <div class="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-emerald-500/20 rounded-xl shadow-lg shadow-emerald-500/10 py-4 px-6 transform transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 sticky top-0 z-10">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 glow-emerald mb-2 flex items-center gap-3">
            <span class="bg-emerald-600 text-white p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            Gestión de Tiendas
          </h2>
          <p class="text-emerald-100/70 text-sm md:text-base">Gestiona y controla tus tiendas y servicios</p>
        </div>
        <button @click="abrirModal()" class="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-emerald-300/40 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm font-medium group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Tienda
        </button>
      </div>
    </div>

    <!-- Resumen por Marca (del original) -->
    <div v-if="resumenPorMarca.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-emerald-300 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Resumen por Marca
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(marcaResumen, index) in resumenPorMarca" :key="index"
             class="glass-card border-l-4 transition-all duration-300 hover:shadow-md hover:scale-105"
             :class="[`border-${getBrandColor(marcaResumen.nombre)}-500`, `hover:shadow-${getBrandColor(marcaResumen.nombre)}-500/20`]">
          <h4 class="font-bold text-lg text-gray-100 mb-1">{{ marcaResumen.nombre }}</h4>
          <p class="text-sm text-gray-400">Tiendas: <span class="font-medium text-emerald-300">{{ marcaResumen.conteo }}</span></p>
          <p class="text-sm text-gray-400">Ingresos: <span class="font-medium text-emerald-300">Q{{ (marcaResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados (de la versión nueva, adaptado a tema oscuro) -->
    <div class="bg-gray-900/60 backdrop-blur-lg shadow-md rounded-xl p-6 border border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative md:col-span-2">
           <label for="search" class="sr-only">Buscar</label>
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
             </svg>
           </div>
           <input v-model="busqueda" @input="aplicarFiltros" type="text" id="search" placeholder="Buscar por nombre, marca, estado..." class="pl-10 pr-4 py-3 w-full rounded-xl bg-gray-800/60 backdrop-blur-sm border border-emerald-500/30 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow text-sm placeholder-gray-400" />
        </div>
        <div class="relative">
           <label for="month-filter" class="sr-only">Filtrar por mes</label>
           <select v-model="filtroMes" @change="aplicarFiltros" id="month-filter" class="pr-8 py-3 w-full rounded-xl bg-gray-800/60 backdrop-blur-sm border border-emerald-500/30 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow text-sm appearance-none pl-3">
             <option value="">Todos los Meses</option>
             <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes">
               {{ formatearMes(mes) }}
             </option>
           </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
       <div class="text-sm text-emerald-300/80 mt-3 text-right flex items-center justify-end gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="font-medium text-emerald-400">{{ tiendasFiltradas.length }}</span>
            {{ tiendasFiltradas.length === 1 ? 'tienda encontrada' : 'tiendas encontradas' }}
        </div>
    </div>

    <!-- Tabla moderna con tema oscuro -->
    <div class="bg-gray-900/60 backdrop-blur-lg shadow-md rounded-xl overflow-hidden border border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800/80">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Marca</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Mes Servicio</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Costo</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Estado Serv.</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Estado Cobro</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Pago</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-gray-900/20 backdrop-blur-sm divide-y divide-gray-700">
            <tr v-if="isLoading">
                <td colspan="8" class="px-4 py-10 text-center text-gray-400">
                  <div class="flex flex-col items-center justify-center">
                    <div class="loader-ring">
                      <div></div><div></div><div></div><div></div>
                    </div>
                    <p class="mt-3">Cargando tiendas...</p>
                  </div>
                </td>
            </tr>
            <tr v-else-if="tiendasFiltradas.length === 0">
                <td colspan="8" class="px-4 py-10 text-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron tiendas con los filtros actuales.</p>
                </td>
            </tr>
            <transition-group name="fade-table">
              <tr v-for="tienda in tiendasFiltradas" :key="tienda.id" class="hover:bg-emerald-900/20 transition-colors duration-200">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">{{ tienda.nombre }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{{ tienda.marca }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{{ formatearMes(tienda.mesServicio) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-emerald-400 font-medium text-right">Q{{ formatearDinero(tienda.costo) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                   <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300" :class="getEstadoServicioClass(tienda.estado)">
                     {{ tienda.estado || 'N/A' }}
                   </span>
                </td>
                 <td class="px-4 py-3 whitespace-nowrap text-center">
                   <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300" :class="getEstadoCobroClass(tienda.estadoCobro)">
                     {{ tienda.estadoCobro || 'N/A' }}
                   </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300" :class="getTipoPagoClass(tienda.tipoPago)">
                    {{ tienda.tipoPago || 'N/A' }}
                    <span v-if="tienda.tipoPago === 'Crédito'"> ({{ tienda.diasCredito || 0 }}d)</span>
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center gap-1">
                    <button @click="abrirModal(tienda)" class="text-emerald-400 hover:text-white bg-emerald-900/30 hover:bg-emerald-600 p-1.5 rounded-lg transition-all duration-300 inline-flex" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button @click="confirmarEliminar(tienda)" class="text-red-400 hover:text-white bg-red-900/30 hover:bg-red-600 p-1.5 rounded-lg transition-all duration-300 inline-flex" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </transition-group>
          </tbody>
          <tfoot class="bg-gray-800/80 border-t-2 border-emerald-500/30">
            <tr>
              <td colspan="3" class="px-4 py-3 text-right text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                Totales Filtrados:
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-emerald-400">
                <span class="bg-emerald-900/30 text-emerald-300 px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-emerald-500/30">
                  Q{{ formatearDinero(totalCostoFiltrado) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-emerald-400">
                <span class="bg-emerald-900/30 text-emerald-300 px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-emerald-500/30">
                  {{ tiendasFiltradas.length }} Tienda(s)
                </span>
              </td>
              <td colspan="3" class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Gráfico con tema oscuro -->
    <div class="mt-8 bg-gray-900/60 backdrop-blur-lg shadow-md rounded-xl p-6 border border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <h3 class="text-lg font-semibold text-emerald-300 mb-4 text-center flex justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        Resumen Visual (Datos Filtrados)
      </h3>
      <div class="h-72 md:h-80 w-full max-w-md mx-auto">
        <transition name="fade" mode="out-in">
          <Doughnut
            v-if="!isLoading && tiendasFiltradas.length > 0 && chartDataEstadoServicio.datasets[0].data.some(d => d > 0)"
            :data="chartDataEstadoServicio"
            :options="chartOptions"
            chart-id="estado-servicio-chart"
          />
          <div v-else class="flex items-center justify-center h-full text-center text-gray-400">
            <div v-if="isLoading" class="flex flex-col items-center">
              <div class="loader-dots mb-2">
                <div></div><div></div><div></div>
              </div>
              <p>Cargando datos del gráfico...</p>
            </div>
            <div v-else class="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No hay datos suficientes para mostrar el gráfico con los filtros actuales.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modal moderno con tema oscuro -->
    <transition name="modal-fade">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-emerald-500/30 p-6 w-full max-w-4xl transform scale-100 transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6 pb-3 border-b border-emerald-500/20">
            <h3 class="text-xl font-semibold text-emerald-300 flex items-center gap-2">
              <span class="bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              {{ modoEdicion ? 'Editar Tienda' : 'Nueva Tienda' }}
            </h3>
            <button @click="cerrarModal" class="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-800 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Formulario completo del original adaptado -->
          <form @submit.prevent="guardarTienda">
            <!-- Información básica -->
            <div class="form-section mb-6">
              <h4 class="form-section-title text-emerald-300 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Información de la Tienda
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="label-form text-gray-300">Nombre Tienda/Cliente <span class="text-red-400">*</span></label>
                  <input v-model="nuevaTienda.nombre" type="text" class="input-modal-dark" required />
                </div>
                <div>
                  <label class="label-form text-gray-300">Marca <span class="text-red-400">*</span></label>
                  <select v-model="nuevaTienda.marca" class="input-modal-dark" required>
                    <option disabled value="">Seleccionar Marca</option>
                    <option v-for="(marca, i) in marcas" :key="i" :value="marca">{{ marca }}</option>
                  </select>
                </div>
                <div>
                  <label class="label-form text-gray-300">Técnico</label>
                  <input v-model="nuevaTienda.tecnico" type="text" class="input-modal-dark" />
                </div>
                <div>
                  <label class="label-form text-gray-300">No. ODS</label>
                  <input v-model="nuevaTienda.ods" type="text" class="input-modal-dark" />
                </div>
                <div>
                  <label class="label-form text-gray-300">Categoría <span class="text-red-400">*</span></label>
                  <select v-model="nuevaTienda.categoria" class="input-modal-dark" required>
                    <option disabled value="">Seleccionar Categoría</option>
                    <option v-for="(cat, index) in categoriasDisponibles" :key="index" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div>
                  <label class="label-form text-gray-300">Costo (Q) <span class="text-red-400">*</span></label>
                  <input v-model.number="nuevaTienda.costo" type="number" step="0.01" min="0" class="input-modal-dark" required />
                </div>
                <div>
                  <label class="label-form text-gray-300">Mes de Servicio <span class="text-red-400">*</span></label>
                  <input v-model="nuevaTienda.mesServicio" type="month" class="input-modal-dark" required />
                </div>
                <div>
                  <label class="label-form text-gray-300">Estado del Servicio <span class="text-red-400">*</span></label>
                  <select v-model="nuevaTienda.estado" class="input-modal-dark" required>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div>
                  <label class="label-form text-gray-300">Tipo de Pago <span class="text-red-400">*</span></label>
                  <select v-model="nuevaTienda.tipoPago" class="input-modal-dark" required>
                    <option value="Contado">Contado</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                </div>
                <div v-if="nuevaTienda.tipoPago === 'Crédito'">
                  <label class="label-form text-gray-300">Días de Crédito</label>
                  <input v-model.number="nuevaTienda.diasCredito" type="number" min="0" class="input-modal-dark" />
                </div>
                <div class="md:col-span-3">
                  <label class="label-form text-gray-300">Descripción del Servicio</label>
                  <textarea v-model="nuevaTienda.descripcion" rows="2" class="input-modal-dark" placeholder="Detalles del servicio a realizar..."></textarea>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4 border-t border-emerald-500/20">
              <button type="button" @click="cerrarModal" class="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow">
                Cancelar
              </button>
              <button
                type="submit"
                class="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-emerald-300/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                :disabled="!nuevaTienda.nombre || !nuevaTienda.marca"
              >
                {{ modoEdicion ? 'Actualizar Tienda' : 'Guardar Tienda' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Confirmación -->
    <transition name="modal-fade">
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-red-500/30 p-6 w-full max-w-md transform scale-100 transition-all duration-300">
          <h3 class="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.876a1 1 0 00.883-1.493L13.07 5.494a1 1 0 00-1.768 0L4.54 16.507A1 1 0 005.422 18z" />
            </svg>
            Confirmar eliminación
          </h3>
          <p class="text-sm text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar la tienda
            <strong class="text-emerald-400">{{ tiendaSeleccionada?.nombre }}</strong>?
            <span class="font-medium text-red-400 block mt-2">Esta acción no se puede deshacer.</span>
          </p>
          <div class="flex justify-end gap-3">
            <button @click="mostrarConfirmacion = false; tiendaSeleccionada = null;" class="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow">
              Cancelar
            </button>
            <button @click="eliminarTiendaConfirmado" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-red-300/40 transition-all duration-300 flex items-center gap-2 transform hover:scale-[1.02]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp, Timestamp, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/firebase'

// Chart.js imports
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// Estado reactivo - combinando ambas versiones
const tiendas = ref([])
const tiendasFiltradas = ref([])
const marcas = ref([])
const busqueda = ref('')
const filtroMes = ref('')
const mesesDisponibles = ref([])
const modoEdicion = ref(false)
const tiendaSeleccionada = ref(null)
const mostrarModal = ref(false)
const mostrarConfirmacion = ref(false)
const isLoading = ref(true)

// Datos del original
const resumenPorMarca = ref([])
const categoriasDisponibles = ref([
  'Mant. Preventivo',
  'Venta de plantas', 
  'Jardinización',
  'Reparación sistema riego',
  'Proyecto nuevo'
])

// Objeto para formulario híbrido
const tiendaVacia = () => ({
  nombre: '',
  marca: '',
  tecnico: '',
  costo: 500,
  estado: 'Pendiente',
  estadoCobro: 'Pendiente',
  tipoPago: 'Crédito',
  diasCredito: 30,
  mesServicio: '',
  ods: '',
  categoria: '',
  descripcion: '',
  numeroFactura: '',
  fechaFacturacion: '',
})

const nuevaTienda = ref(tiendaVacia())

// Propiedades calculadas
const totalCostoFiltrado = computed(() => {
  return tiendasFiltradas.value.reduce((sum, tienda) => {
    return sum + (Number(tienda.costo) || 0);
  }, 0);
});

// Gráfico adaptado al tema oscuro
const chartDataEstadoServicio = computed(() => {
  const counts = {
    Pendiente: 0,
    'En proceso': 0,
    Finalizado: 0,
    Otros: 0
  };
  
  const colores = {
    Pendiente: 'rgb(245, 158, 11)',  // Amber
    'En proceso': 'rgb(59, 130, 246)', // Blue  
    Finalizado: 'rgb(34, 197, 94)',  // Green
    Otros: 'rgb(156, 163, 175)' // Gray
  };

  tiendasFiltradas.value.forEach(tienda => {
    const estado = tienda.estado || 'Otros';
    if (counts.hasOwnProperty(estado)) {
       counts[estado]++;
    } else {
       counts.Otros++;
    }
  });

  const labels = Object.keys(counts).filter(key => counts[key] > 0);
  const data = labels.map(label => counts[label]);
  const backgroundColors = labels.map(label => colores[label]);

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: data,
        hoverOffset: 4,
        borderWidth: 2,
        borderColor: '#1f2937' // Dark border
      }
    ]
  };
});

// Opciones del gráfico adaptadas al tema oscuro
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart'
  },
  plugins: {
    legend: {
      position: 'right',
      labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
            family: "'Inter', 'Helvetica', 'Arial', sans-serif"
          },
          color: '#d1d5db' // Light gray for dark theme
      }
    },
    title: {
      display: true,
      text: 'Distribución por Estado de Servicio',
      padding: { top: 5, bottom: 15 },
      font: { size: 14, weight: 'bold' },
      color: '#10b981' // Emerald color
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            label += `${context.parsed} (${percentage}%)`;
          }
          return label;
        }
      },
      backgroundColor: 'rgba(31, 41, 55, 0.95)', // Dark background
      titleColor: '#10b981', // Emerald
      bodyColor: '#f3f4f6', // Light gray
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10,
      boxPadding: 5,
      usePointStyle: true,
      bodyFont: {
        family: "'Inter', 'Helvetica', 'Arial', sans-serif"
      }
    }
  }
});

// Funciones utilitarias
const formatearDinero = (cantidad) => {
  const numero = Number(cantidad);
  return isNaN(numero) ? '0.00' : numero.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatearMes = (mesStr) => {
  if (!mesStr || !mesStr.includes('-')) return '';
  try {
    const [ano, mes] = mesStr.split('-');
    const mesNum = parseInt(mes, 10);
    if (mesNum < 1 || mesNum > 12 || isNaN(mesNum) || isNaN(parseInt(ano, 10))) return mesStr;
    const fecha = new Date(Number(ano), mesNum - 1, 1);
    return new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(fecha);
  } catch (e) {
      console.error("Error formateando mes:", mesStr, e);
      return mesStr;
  }
};

// Funciones para clases de badges (adaptadas al tema oscuro)
const getEstadoServicioClass = (estado) => {
    switch (estado) {
        case 'Pendiente': return 'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50 shadow-sm';
        case 'En proceso': return 'bg-blue-900/40 text-blue-300 border border-blue-600/50 shadow-sm';
        case 'Finalizado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-300 border border-gray-600/50 shadow-sm';
    }
};

const getEstadoCobroClass = (estadoCobro) => {
     switch (estadoCobro) {
        case 'Pendiente': return 'bg-gray-800/40 text-gray-300 border border-gray-600/50 shadow-sm';
        case 'Impresión ODS': return 'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50 shadow-sm';
        case 'Proceso ODC': return 'bg-blue-900/40 text-blue-300 border border-blue-600/50 shadow-sm';
        case 'Facturación': return 'bg-purple-900/40 text-purple-300 border border-purple-600/50 shadow-sm';
        case 'Pagado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-300 border border-gray-600/50 shadow-sm';
    }
};

const getTipoPagoClass = (tipoPago) => {
    switch (tipoPago) {
        case 'Contado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        case 'Crédito': return 'bg-blue-900/40 text-blue-300 border border-blue-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-300 border border-gray-600/50 shadow-sm';
    }
};

// Función del original para colores de marca
const getBrandColor = (marca) => {
  const colorMap = {
    "McDonald's": 'red',
    "Pizza Hut": 'orange', 
    "Kentucky": 'red',
    "Starbucks": 'green',
    "Dunkin Donuts": 'pink',
    "Edificio Naguchi": 'blue',
    "Pandas": 'purple'
  }
  return colorMap[marca] || 'gray'
}

// Funciones de datos
const cargarMarcas = async () => {
  try {
    const marcasDoc = await getDoc(doc(db, 'configuracion', 'marcas'))
    if (marcasDoc.exists() && marcasDoc.data().lista) {
      marcas.value = marcasDoc.data().lista.sort()
    } else {
      const marcasDefault = ["McDonald's", "Pizza Hut", "Kentucky", "Starbucks", "Dunkin Donuts", "Edificio Naguchi", "Pandas"]
      marcas.value = marcasDefault.sort()
    }
  } catch (error) {
    console.error("Error al cargar marcas:", error)
    marcas.value = ["McDonald's", "Pizza Hut", "Kentucky", "Starbucks", "Dunkin Donuts", "Edificio Naguchi", "Pandas"].sort()
  }
}

const cargarTiendas = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'tiendas'), orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    const tiendasTemp = [];
    const meses = new Set();
    const marcasConteo = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      tiendasTemp.push({ id: doc.id, ...data });
      
      if (data.mesServicio && typeof data.mesServicio === 'string' && data.mesServicio.includes('-')) {
        meses.add(data.mesServicio);
      }

      // Calcular resumen por marca
      const marca = data.marca || 'Sin marca';
      if (!marcasConteo[marca]) {
        marcasConteo[marca] = { nombre: marca, conteo: 0, ingresos: 0 };
      }
      marcasConteo[marca].conteo++;
      marcasConteo[marca].ingresos += Number(data.costo) || 0;
    });

    tiendas.value = tiendasTemp;
    mesesDisponibles.value = Array.from(meses).sort((a, b) => b.localeCompare(a));
    resumenPorMarca.value = Object.values(marcasConteo).sort((a, b) => b.ingresos - a.ingresos);

    aplicarFiltros();

  } catch (error) {
    console.error("Error al cargar tiendas:", error);
    alert("Error al cargar las tiendas.");
  } finally {
    isLoading.value = false;
  }
};

const aplicarFiltros = () => {
  let resultado = tiendas.value;
  const termino = busqueda.value?.toLowerCase().trim();
  const mes = filtroMes.value;

  if (termino) {
    resultado = resultado.filter(tienda =>
      tienda.nombre?.toLowerCase().includes(termino) ||
      tienda.marca?.toLowerCase().includes(termino) ||
      tienda.estado?.toLowerCase().includes(termino) ||
      tienda.estadoCobro?.toLowerCase().includes(termino) ||
      tienda.ods?.toLowerCase().includes(termino)
    );
  }

  if (mes) {
    resultado = resultado.filter(tienda => tienda.mesServicio === mes);
  }

  tiendasFiltradas.value = resultado;
};

watch([busqueda, filtroMes], aplicarFiltros);

// Funciones del modal
const abrirModal = (tienda = null) => {
  if (tienda) {
    modoEdicion.value = true;
    tiendaSeleccionada.value = tienda;
    nuevaTienda.value = {
      ...tiendaVacia(),
      ...tienda,
      fechaFacturacion: tienda.fechaFacturacion instanceof Timestamp
                         ? tienda.fechaFacturacion.toDate().toISOString().split('T')[0]
                         : (tienda.fechaFacturacion || ''),
    };
  } else {
    modoEdicion.value = false;
    tiendaSeleccionada.value = null;
    nuevaTienda.value = tiendaVacia();
    const hoy = new Date();
    nuevaTienda.value.mesServicio = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  }
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const guardarTienda = async () => {
  // Función básica - se puede expandir con la lógica completa del original
  const form = nuevaTienda.value;
  const datosAGuardar = {
    nombre: form.nombre.trim(),
    marca: form.marca,
    tecnico: form.tecnico?.trim() || null,
    costo: Number(form.costo),
    estado: form.estado,
    estadoCobro: form.estadoCobro || 'Pendiente',
    tipoPago: form.tipoPago,
    diasCredito: form.tipoPago === 'Crédito' ? (Number(form.diasCredito) || 0) : null,
    mesServicio: form.mesServicio,
    ods: form.ods?.trim() || null,
    categoria: form.categoria,
    descripcion: form.descripcion?.trim() || null,
  };

  try {
    if (modoEdicion.value && tiendaSeleccionada.value?.id) {
      const tiendaRef = doc(db, 'tiendas', tiendaSeleccionada.value.id);
      await updateDoc(tiendaRef, datosAGuardar);
      alert("Tienda actualizada con éxito.");
    } else {
      const tiendaConFecha = {
        ...datosAGuardar,
        fechaCreacion: serverTimestamp()
      };
      await addDoc(collection(db, 'tiendas'), tiendaConFecha);
      alert("Tienda creada con éxito.");
    }
    
    cerrarModal();
    await cargarTiendas();
  } catch (error) {
    console.error("Error guardando tienda:", error);
    alert(`Error al guardar: ${error.message}`);
  }
};

const confirmarEliminar = (tienda) => {
  tiendaSeleccionada.value = tienda;
  mostrarConfirmacion.value = true;
};

const eliminarTiendaConfirmado = async () => {
  if (!tiendaSeleccionada.value?.id) return;

  try {
    const tiendaRef = doc(db, 'tiendas', tiendaSeleccionada.value.id);
    await deleteDoc(tiendaRef);
    alert("Tienda eliminada con éxito.");
    mostrarConfirmacion.value = false;
    tiendaSeleccionada.value = null;
    await cargarTiendas();
  } catch (error) {
    console.error("Error eliminando tienda:", error);
    alert(`Error al eliminar: ${error.message}`);
  }
};

// Ciclo de vida
onMounted(async () => {
  console.log("TiendasHybrid.vue Montado");
  await cargarMarcas();
  await cargarTiendas();
});

</script>

<style scoped>
/* Estilos híbridos combinando ambas versiones */
.glass-card {
  @apply bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 shadow-lg p-4 rounded-lg;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

.form-section {
  @apply bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20;
}

.form-section-title {
  @apply text-lg font-semibold text-emerald-300 mb-4 flex items-center;
}

.label-form {
  @apply block text-sm font-medium text-gray-300 mb-1;
}

.input-modal-dark {
  @apply w-full px-3 py-2 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-emerald-500/30 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow text-sm placeholder-gray-400;
}

select.input-modal-dark {
  @apply h-[38px] appearance-none bg-no-repeat;
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%2310b981" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3E%3C/svg%3E');
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Animaciones */
.fade-table-enter-active, .fade-table-leave-active {
  transition: all 0.3s ease;
}
.fade-table-enter-from, .fade-table-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Loaders adaptados al tema oscuro */
.loader-ring {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
}
.loader-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 4px;
  border: 4px solid #10b981;
  border-radius: 50%;
  animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #10b981 transparent transparent transparent;
}
.loader-ring div:nth-child(1) { animation-delay: -0.45s; }
.loader-ring div:nth-child(2) { animation-delay: -0.3s; }
.loader-ring div:nth-child(3) { animation-delay: -0.15s; }

@keyframes loader-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-dots {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 10px;
}
.loader-dots div {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.loader-dots div:nth-child(1) {
  left: 0;
  animation: loader-dots1 0.6s infinite;
}
.loader-dots div:nth-child(2) {
  left: 16px;
  animation: loader-dots2 0.6s infinite;
}
.loader-dots div:nth-child(3) {
  left: 32px;
  animation: loader-dots3 0.6s infinite;
}

@keyframes loader-dots1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
@keyframes loader-dots2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(16px, 0); }
}
@keyframes loader-dots3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

/* Efectos glow del original */
.glow-emerald {
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
}
</style>