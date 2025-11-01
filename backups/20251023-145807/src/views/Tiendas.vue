<template>
  <MainLayout>
    <!-- Header Actions -->
    <template #header-actions>
      <button @click="abrirModal()" class="btn-gold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Tienda
      </button>
    </template>

    <div class="tiendas-container">
      <!-- NavegaciÃ³n de PestaÃ±as -->
    <div class="glass-card-premium rounded-xl mb-6">
      <div class="flex border-b border-gray-300 overflow-x-auto">
        <button
          v-for="pestana in pestanas"
          :key="pestana.id"
          @click="cambiarPestana(pestana.id)"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-b-2 relative whitespace-nowrap"
          :class="{
            'text-[#051F20] border-[#D4AF37] bg-gradient-to-r from-[#DAFDE2] to-[#8CB69B]': pestanaActiva === pestana.id,
            'text-gray-600 border-transparent hover:text-[#235347] hover:border-[#8CB69B] hover:bg-gradient-to-r hover:from-white hover:to-[#f8fffe]': pestanaActiva !== pestana.id
          }"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="pestana.icono" />
          </svg>
          <span class="hidden sm:inline">{{ pestana.nombre }}</span>
          <span class="sm:hidden">{{ pestana.nombre.split(' ')[0] }}</span>
          
          <!-- Indicador de notificaciÃ³n para cronograma -->
          <span v-if="pestana.id === 'cronograma' && visitasProximas.length > 0"
                class="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#051F20] text-xs px-1.5 sm:px-2 py-0.5 rounded-full ml-1 sm:ml-2 font-bold shadow-md">
            {{ visitasProximas.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Contenido de la PestaÃ±a GestiÃ³n -->
    <div v-if="pestanaActiva === 'gestion'">
      <!-- Resumen por Marca (del original) -->
    <div v-if="resumenPorMarca.length > 0" class="mb-8">
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Resumen por Marca
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(marcaResumen, index) in resumenPorMarca" :key="index"
             class="glass-card-premium border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-105 p-4 rounded-xl bg-gradient-to-br from-white to-[#f8fffe]"
             :class="[`border-${getBrandColor(marcaResumen.nombre)}-500`, `hover:shadow-${getBrandColor(marcaResumen.nombre)}-500/30`]">
          <h4 class="font-bold text-lg text-[#051F20] mb-2">{{ marcaResumen.nombre }}</h4>
          <p class="text-sm text-gray-600">Tiendas: <span class="font-bold text-[#235347]">{{ marcaResumen.conteo }}</span></p>
          <p class="text-sm text-gray-600">Ingresos: <span class="font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">Q{{ (marcaResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <div class="glass-card-premium backdrop-blur-lg shadow-lg rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#235347]/20 bg-gradient-to-br from-white to-[#f8fffe]">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative md:col-span-2">
           <label for="search" class="sr-only">Buscar</label>
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-[#235347]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
             </svg>
           </div>
           <input v-model="busqueda" type="text" id="search" placeholder="Buscar por nombre, marca, estado..." class="pl-10 pr-4 py-3 w-full rounded-xl bg-white backdrop-blur-sm border-2 border-[#8CB69B]/40 text-[#051F20] focus:ring-2 focus:ring-[#235347] focus:border-[#235347] transition-all duration-300 shadow-md hover:shadow-lg text-sm placeholder-gray-500 font-medium" />
        </div>
        <div class="relative">
           <label for="month-filter" class="sr-only">Filtrar por mes</label>
           <select v-model="filtroMes" id="month-filter" class="pr-8 py-3 w-full rounded-xl bg-white backdrop-blur-sm border-2 border-[#8CB69B]/40 text-[#051F20] focus:ring-2 focus:ring-[#235347] focus:border-[#235347] transition-all duration-300 shadow-md hover:shadow-lg text-sm appearance-none pl-3 font-medium">
             <option value="">Todos los Meses</option>
             <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes">
               {{ formatearMes(mes) }}
             </option>
           </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-[#235347]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
       <div class="text-sm mt-3 text-right flex items-center justify-end gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="font-bold text-[#051F20] text-base">{{ tiendasFiltradas.length }}</span>
            <span class="text-gray-600 font-medium">{{ tiendasFiltradas.length === 1 ? 'tienda encontrada' : 'tiendas encontradas' }}</span>
        </div>
    </div>

    <!-- Vista Desktop - Tabla -->
    <div class="hidden lg:block glass-card-premium backdrop-blur-lg shadow-md rounded-xl overflow-hidden border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="glass-info-card">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Marca</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Mes Servicio</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Costo</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Estado Serv.</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Estado Cobro</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Visitas</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Pago</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-gray-50 backdrop-blur-sm divide-y divide-gray-300">
            <tr v-if="isLoading">
                <td colspan="9" class="px-4 py-10 text-center text-gray-400">
                  <div class="flex flex-col items-center justify-center">
                    <div class="loader-ring">
                      <div></div><div></div><div></div><div></div>
                    </div>
                    <p class="mt-3">Cargando tiendas...</p>
                  </div>
                </td>
            </tr>
            <tr v-else-if="tiendasFiltradas.length === 0">
                <td colspan="9" class="px-4 py-10 text-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron tiendas con los filtros actuales.</p>
                </td>
            </tr>
            <transition-group name="fade-table">
              <tr v-for="tienda in tiendasPaginadas" :key="tienda.id" class="hover:bg-[#051F20]/10 transition-colors duration-200">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ tienda.nombre }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ tienda.marca }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatearMes(tienda.mesServicio) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-[#235347] font-medium text-right">Q{{ formatearDinero(tienda.costo) }}</td>
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
                  <div class="flex flex-col gap-1">
                    <div class="text-xs text-gray-400">
                      {{ tienda.cantidadVisitas || 1 }} {{ (tienda.cantidadVisitas || 1) === 1 ? 'visita' : 'visitas' }}
                    </div>
                    <div v-if="tienda.visitas && tienda.visitas.length > 0" class="flex flex-wrap gap-1 justify-center">
                      <span v-for="(visita, index) in tienda.visitas.slice(0, 3)" :key="index"
                            class="w-2 h-2 rounded-full transition-all duration-300" 
                            :class="{
                              'bg-gray-500': visita.estado === 'Pendiente',
                              'bg-orange-500': visita.estado === 'En proceso', 
                              'bg-green-500': visita.estado === 'Realizada'
                            }"
                            :title="`Visita ${visita.numero}: ${visita.estado}`">
                      </span>
                      <span v-if="tienda.visitas.length > 3" class="text-xs text-gray-400 ml-1">+{{ tienda.visitas.length - 3 }}</span>
                    </div>
                    <div v-else class="w-2 h-2 rounded-full bg-gray-500 mx-auto" title="1 visita: Pendiente"></div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300" :class="getTipoPagoClass(tienda.tipoPago)">
                    {{ tienda.tipoPago || 'N/A' }}
                    <span v-if="tienda.tipoPago === 'CrÃ©dito'"> ({{ tienda.diasCredito || 0 }}d)</span>
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="abrirModal(tienda)" class="text-white bg-gradient-to-r from-[#235347] to-[#8CB69B] hover:from-[#051F20] hover:to-[#235347] p-2 rounded-lg transition-all duration-300 inline-flex shadow-md hover:shadow-lg hover:scale-105" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button @click="confirmarEliminar(tienda)" class="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-2 rounded-lg transition-all duration-300 inline-flex shadow-md hover:shadow-lg hover:scale-105" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </transition-group>
          </tbody>
          <tfoot class="glass-info-card border-t-2 border-[#D4AF37]/30">
            <tr>
              <td colspan="3" class="px-4 py-3 text-right text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                Totales Filtrados:
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-[#235347]">
                <span class="bg-[#051F20]/15 text-[#235347] px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-[#235347]/30">
                  Q{{ formatearDinero(totalCostoFiltrado) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-[#235347]">
                <span class="bg-[#051F20]/15 text-[#235347] px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-[#235347]/30">
                  {{ tiendasFiltradas.length }} Tienda(s)
                </span>
              </td>
              <td colspan="4" class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Vista Mobile/Tablet - Cards -->
    <div class="lg:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="loader-ring mb-4">
          <div></div><div></div><div></div><div></div>
        </div>
        <p class="text-gray-400">Cargando tiendas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="tiendasFiltradas.length === 0" class="flex flex-col items-center justify-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-400 text-center">No se encontraron tiendas con los filtros actuales.</p>
      </div>

      <!-- Cards List -->
      <transition-group name="fade-cards" v-else>
        <div v-for="tienda in tiendasPaginadas" :key="tienda.id" 
             class="glass-card-premium backdrop-blur-lg rounded-xl p-4 border border-[#235347]/20 shadow-md hover:shadow-lg hover:shadow-[#235347]/10 transition-all duration-300 hover:border-[#235347]/40">
          
          <!-- Header Card -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ tienda.nombre }}</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[#235347] font-medium">{{ tienda.marca }}</span>
                <span class="text-gray-400">â€¢</span>
                <span class="text-gray-600">{{ formatearMes(tienda.mesServicio) }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-[#235347] mb-1">Q{{ formatearDinero(tienda.costo) }}</div>
              <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTipoPagoClass(tienda.tipoPago)">
                {{ tienda.tipoPago || 'N/A' }}
                <span v-if="tienda.tipoPago === 'CrÃ©dito'" class="ml-1">({{ tienda.diasCredito || 0 }}d)</span>
              </span>
            </div>
          </div>

          <!-- Status Row -->
          <div class="flex items-center justify-between mb-3 py-2 border-t border-gray-700/50">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Estado Servicio:</span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="getEstadoServicioClass(tienda.estado)">
                  {{ tienda.estado || 'N/A' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Estado Cobro:</span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="getEstadoCobroClass(tienda.estadoCobro)">
                  {{ tienda.estadoCobro || 'N/A' }}
                </span>
              </div>
            </div>

            <!-- Visitas Indicator -->
            <div class="flex flex-col items-end gap-1">
              <div class="text-xs text-gray-400">
                {{ tienda.cantidadVisitas || 1 }} {{ (tienda.cantidadVisitas || 1) === 1 ? 'visita' : 'visitas' }}
              </div>
              <div v-if="tienda.visitas && tienda.visitas.length > 0" class="flex flex-wrap gap-1">
                <span v-for="(visita, index) in tienda.visitas.slice(0, 4)" :key="index"
                      class="w-2.5 h-2.5 rounded-full" 
                      :class="{
                        'bg-gray-500': visita.estado === 'Pendiente',
                        'bg-blue-500': visita.estado === 'En proceso', 
                        'bg-green-500': visita.estado === 'Realizada'
                      }"
                      :title="`Visita ${visita.numero}: ${visita.estado}`">
                </span>
                <span v-if="tienda.visitas.length > 4" class="text-xs text-gray-400">+{{ tienda.visitas.length - 4 }}</span>
              </div>
              <div v-else class="w-2.5 h-2.5 rounded-full bg-gray-500" title="1 visita: Pendiente"></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
            <button @click="abrirModal(tienda)" 
                    class="flex items-center gap-1 px-3 py-2 text-[#235347] hover:text-white bg-[#051F20]/15 hover:bg-[#235347] rounded-lg transition-all duration-300 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="confirmarEliminar(tienda)" 
                    class="flex items-center gap-1 px-3 py-2 text-red-400 hover:text-white bg-red-900/30 hover:bg-red-600 rounded-lg transition-all duration-300 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </transition-group>

      <!-- Resumen Mobile -->
      <div v-if="!isLoading && tiendasFiltradas.length > 0" class="glass-card-premium backdrop-blur-lg rounded-xl p-4 border border-[#235347]/20 mt-4">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-400">Total Filtrado:</span>
          <div class="text-right">
            <div class="text-lg font-bold text-[#235347]">Q{{ formatearDinero(totalCostoFiltrado) }}</div>
            <div class="text-xs text-gray-400">{{ tiendasFiltradas.length }} tienda(s)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PaginaciÃ³n -->
    <div v-if="totalPaginas > 1" class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-4 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- InformaciÃ³n de rango -->
        <div class="text-sm text-gray-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>
            Mostrando <span class="font-medium text-[#235347]">{{ rangoItems.inicio }}</span> a 
            <span class="font-medium text-[#235347]">{{ rangoItems.fin }}</span> de 
            <span class="font-medium text-[#235347]">{{ rangoItems.total }}</span> resultados
          </span>
        </div>

        <!-- Controles de paginaciÃ³n -->
        <div class="flex items-center gap-2">
          <!-- BotÃ³n anterior -->
          <button 
            @click="paginaAnterior" 
            :disabled="paginaActual === 1"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
            :class="paginaActual === 1 
              ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
              : 'bg-[#051F20]/15 text-[#8CB69B] hover:bg-[#235347] hover:text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <!-- NÃºmeros de pÃ¡gina -->
          <div class="flex items-center gap-1">
            <template v-for="pagina in totalPaginas" :key="pagina">
              <button 
                v-if="pagina === 1 || pagina === totalPaginas || (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)"
                @click="irAPagina(pagina)"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                :class="pagina === paginaActual 
                  ? 'bg-[#235347] text-white shadow-md' 
                  : 'bg-gray-800/40 text-gray-600 hover:bg-[#051F20]/15 hover:text-[#8CB69B]'
              >
                {{ pagina }}
              </button>
              <span v-else-if="pagina === paginaActual - 2 || pagina === paginaActual + 2" class="px-2 text-gray-500">...</span>
            </template>
          </div>

          <!-- BotÃ³n siguiente -->
          <button 
            @click="paginaSiguiente" 
            :disabled="paginaActual === totalPaginas"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
            :class="paginaActual === totalPaginas 
              ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
              : 'bg-[#051F20]/15 text-[#8CB69B] hover:bg-[#235347] hover:text-white'"
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Selector de items por pÃ¡gina -->
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span>Mostrar:</span>
          <select v-model="itemsPorPagina" @change="paginaActual = 1" class="bg-white border-gray-300 border border-[#235347]/30 text-gray-800 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-[#235347]">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>por pÃ¡gina</span>
        </div>
      </div>
    </div>

    <!-- GrÃ¡fico con tema oscuro -->
    <div class="mt-8 glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 text-center flex justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <p>Cargando datos del grÃ¡fico...</p>
            </div>
            <div v-else class="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No hay datos suficientes para mostrar el grÃ¡fico con los filtros actuales.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    </div> <!-- Fin de PestaÃ±a GestiÃ³n -->

    <!-- Contenido de la PestaÃ±a Cronograma -->
    <div v-if="pestanaActiva === 'cronograma'" class="space-y-6">
      
      <!-- EstadÃ­sticas del Cronograma -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-400">Pendientes</div>
              <div class="text-2xl font-bold text-gray-600">{{ visitasPorEstado.Pendiente }}</div>
            </div>
          </div>
        </div>
        
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-orange-400">En Proceso</div>
              <div class="text-2xl font-bold text-orange-300">{{ visitasPorEstado['En proceso'] }}</div>
            </div>
          </div>
        </div>
        
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-green-400">Realizadas</div>
              <div class="text-2xl font-bold text-green-300">{{ visitasPorEstado.Realizada }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de PrÃ³ximas Visitas -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
              <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Visitas de {{ nombreMesVisualizando }} ({{ visitasProximas.length }})
            </h3>

            <!-- Controles de navegaciÃ³n de mes -->
            <div class="flex items-center gap-2">
              <button
                @click="mesAnterior"
                class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
                title="Mes anterior"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                @click="volverMesActual"
                class="px-3 py-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300 text-sm font-medium"
                title="Volver al mes actual"
              >
                Hoy
              </button>

              <button
                @click="mesSiguiente"
                class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
                title="Mes siguiente"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="divide-y divide-gray-300">
          <div v-if="visitasProximas.length === 0" class="px-6 py-8 text-center text-gray-400">
            <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No hay visitas prÃ³ximas programadas</p>
          </div>
          
          <div v-for="(visita, index) in visitasProximas.slice(0, 10)" :key="`${visita.tienda.id}-${visita.numero}-${visita.fecha}`" 
               class="px-6 py-4 hover:bg-[#051F20]/10 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Estado de la visita con dropdown -->
                <div class="flex-shrink-0 relative group">
                  <div class="relative">
                    <!-- Estado actual (clickeable) -->
                    <button 
                      @click.stop="toggleEstadoDropdown(`${visita.tienda.id}-${visita.numero}-${visita.fecha}`)"
                      class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-1 hover:scale-105 interactive-element" 
                      :class="getEstadoVisitaClass(visita.estado)"
                      :title="'Cambiar estado: ' + visita.estado"
                    >
                      <span>{{ visita.estado }}</span>
                      <svg class="w-3 h-3 transition-transform duration-200" 
                           :class="{ 'rotate-180': estadoDropdownAbierto === `${visita.tienda.id}-${visita.numero}-${visita.fecha}` }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    <!-- Dropdown de estados -->
                    <div v-if="estadoDropdownAbierto === `${visita.tienda.id}-${visita.numero}-${visita.fecha}`" 
                         @click.stop
                         class="absolute top-full left-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-xl z-50 min-w-[140px] py-1">
                      <button 
                        v-for="estado in estadosDisponibles" 
                        :key="estado"
                        @click.stop="cambiarEstadoVisitaRapido(visita, estado)"
                        class="w-full px-3 py-2 text-xs font-medium text-left hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-2"
                        :class="{
                          'text-gray-400': estado === 'Pendiente',
                          'text-orange-400': estado === 'En proceso', 
                          'text-green-400': estado === 'Realizada',
                          'bg-gray-700/30': estado === visita.estado
                        }"
                      >
                        <div class="w-2 h-2 rounded-full" :class="{
                          'bg-gray-400': estado === 'Pendiente',
                          'bg-orange-400': estado === 'En proceso',
                          'bg-green-400': estado === 'Realizada'
                        }"></div>
                        {{ estado }}
                        <span v-if="estado === visita.estado" class="ml-auto text-[#235347]">âœ“</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- InformaciÃ³n de la visita -->
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-medium text-gray-800">{{ visita.tienda.nombre }}</h4>
                     <span class="text-xs text-[#235347]">{{ visita.tienda.marca }}</span>
                  </div>
                  <div class="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>Visita #{{ visita.numero }}</span>
                    <span v-if="visita.tienda.tecnico">TÃ©cnico: {{ visita.tienda.tecnico }}</span>
                    <span>{{ visita.tienda.categoria }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Fecha y countdown -->
              <div class="text-right">
                <div class="text-sm font-medium text-gray-800">{{ formatearFechaCorta(visita.fecha) }}</div>
                <div class="text-xs" :class="{
                  'text-red-400': diasDesdeHoy(visita.fecha) < 0,
                  'text-yellow-400': diasDesdeHoy(visita.fecha) >= 0 && diasDesdeHoy(visita.fecha) <= 3,
                  'text-gray-400': diasDesdeHoy(visita.fecha) > 3
                }">
                  <span v-if="diasDesdeHoy(visita.fecha) < 0">
                    Atrasada {{ Math.abs(diasDesdeHoy(visita.fecha)) }} dÃ­a(s)
                  </span>
                  <span v-else-if="diasDesdeHoy(visita.fecha) === 0">
                    Hoy
                  </span>
                  <span v-else-if="diasDesdeHoy(visita.fecha) === 1">
                    MaÃ±ana
                  </span>
                  <span v-else>
                    En {{ diasDesdeHoy(visita.fecha) }} dÃ­as
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="visitasProximas.length > 10" class="px-6 py-3 bg-gray-800/30 text-center">
          <span class="text-sm text-gray-400">Y {{ visitasProximas.length - 10 }} visitas mÃ¡s...</span>
        </div>
      </div>

      <!-- Calendario Simple de Visitas -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendario - {{ nombreMesVisualizando }}
          </h3>

          <!-- Controles de navegaciÃ³n de mes -->
          <div class="flex items-center gap-2">
            <button
              @click="mesAnterior"
              class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
              title="Mes anterior"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              @click="volverMesActual"
              class="px-3 py-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300 text-sm font-medium"
              title="Volver al mes actual"
            >
              Hoy
            </button>

            <button
              @click="mesSiguiente"
              class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
              title="Mes siguiente"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="dia in ['Dom', 'Lun', 'Mar', 'MiÃ©', 'Jue', 'Vie', 'SÃ¡b']" :key="dia" 
               class="text-center text-xs font-medium text-gray-400 py-2">
            {{ dia }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div v-for="fecha in calendarioProximo30Dias" :key="fecha.fecha"
               class="calendar-day-cell aspect-square p-2 rounded-lg transition-all duration-200 relative cursor-pointer hover:scale-105 flex flex-col items-center justify-center group"
               :class="{
                 'bg-gray-800/40': !fecha.esHoy && !fecha.tieneVisitas && fecha.esMesActual,
                 'bg-gray-800/20': !fecha.esHoy && !fecha.tieneVisitas && !fecha.esMesActual,
                  'bg-[#051F20]/15 border-2 border-[#235347]/50': fecha.esHoy,
                 'bg-cyan-900/30 border-2 border-cyan-500/40': fecha.tieneVisitas && !fecha.esHoy && fecha.esMesActual,
                 'bg-cyan-900/20 border border-cyan-500/20': fecha.tieneVisitas && !fecha.esHoy && !fecha.esMesActual
               }"
               >
            <!-- NÃºmero del dÃ­a -->
            <div class="text-xs font-semibold" :class="{
              'text-[#235347]': fecha.esHoy,
              'text-gray-800': fecha.tieneVisitas && !fecha.esHoy && fecha.esMesActual,
              'text-gray-400': fecha.tieneVisitas && !fecha.esHoy && !fecha.esMesActual,
              'text-gray-500': !fecha.tieneVisitas && fecha.esMesActual,
              'text-gray-600': !fecha.tieneVisitas && !fecha.esMesActual
            }">
              {{ fecha.dia }}
            </div>

            <!-- Contador de visitas -->
            <div v-if="fecha.tieneVisitas" class="mt-1">
              <div class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" :class="{
                'bg-[#235347]/20 text-[#235347]': fecha.esHoy,
                'bg-cyan-500/30 text-cyan-300': !fecha.esHoy
              }">
                {{ fecha.visitas.length }}
              </div>
            </div>

            <!-- Indicadores de estado (puntos pequeÃ±os) -->
            <div v-if="fecha.tieneVisitas" class="mt-1 flex gap-0.5">
              <div v-for="(visita, idx) in fecha.visitas.slice(0, 4)" :key="idx"
                   class="w-1 h-1 rounded-full"
                   :class="{
                     'bg-gray-400': visita.estado === 'Pendiente',
                     'bg-orange-400': visita.estado === 'En proceso',
                     'bg-green-400': visita.estado === 'Realizada'
                   }">
              </div>
            </div>

            <!-- Tooltip con detalles de visitas (aparece al hover) -->
            <div v-if="fecha.tieneVisitas" class="calendar-tooltip">
              <div class="tooltip-header">
                <div class="text-sm font-bold text-[#D4AF37]">
                  {{ formatearFechaCorta(fecha.fecha) }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ fecha.visitas.length }} {{ fecha.visitas.length === 1 ? 'visita' : 'visitas' }}
                </div>
              </div>

              <div class="tooltip-content">
                <div v-for="(visita, idx) in fecha.visitas" :key="idx" class="tooltip-visita">
                  <div class="flex items-center gap-2">
                    <div class="tooltip-visita-numero">{{ visita.numero }}</div>
                    <div class="flex-1">
                      <div class="tooltip-visita-nombre">{{ visita.tienda.nombre }}</div>
                      <div class="tooltip-visita-marca">{{ visita.tienda.marca }}</div>
                    </div>
                    <div class="tooltip-visita-estado" :class="{
                      'status-pendiente': visita.estado === 'Pendiente',
                      'status-proceso': visita.estado === 'En proceso',
                      'status-realizada': visita.estado === 'Realizada'
                    }">
                      {{ visita.estado }}
                    </div>
                  </div>
                  <div v-if="visita.tienda.tecnico" class="tooltip-visita-tecnico">
                    ðŸ‘· {{ visita.tienda.tecnico }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-center gap-6 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>Pendiente</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-orange-400"></div>
            <span>En proceso</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Realizada</span>
          </div>
        </div>
      </div>
      
    </div> <!-- Fin de PestaÃ±a Cronograma -->

    <!-- Contenido de la PestaÃ±a Rendimiento -->
    <div v-if="pestanaActiva === 'rendimiento'" class="space-y-6">
      
      <!-- KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <!-- Cumplimiento General -->
         <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Cumplimiento</div>
              <div class="text-3xl font-bold text-[#235347] mb-1">{{ metricasRendimiento.porcentajeCumplimiento }}%</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-[#235347]/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 w-full bg-gray-800/50 rounded-full h-2">
            <div class="bg-[#235347] h-2 rounded-full transition-all duration-500" :style="{width: metricasRendimiento.porcentajeCumplimiento + '%'}"></div>
          </div>
        </div>
        
        <!-- Servicios del Mes -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Servicios</div>
              <div class="text-3xl font-bold text-purple-400 mb-1">{{ metricasRendimiento.serviciosMesActual }}</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Visitas Realizadas -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Completadas</div>
              <div class="text-3xl font-bold text-green-400 mb-1">{{ metricasRendimiento.visitasRealizadas }}</div>
              <div class="text-xs text-gray-500">de {{ metricasRendimiento.totalVisitas }} visitas</div>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Ingresos del Mes -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-yellow-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Ingresos</div>
              <div class="text-2xl font-bold text-yellow-400 mb-1">Q{{ formatearDinero(metricasRendimiento.ingresosMesActual) }}</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- GrÃ¡ficas de Tendencias -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <!-- GrÃ¡fica de Cumplimiento vs Servicios -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
          <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tendencia de Cumplimiento (6 meses)
          </h3>
          <div class="h-64">
            <Line 
              v-if="tendenciaMensual.length > 0"
              :data="chartDataCumplimiento" 
              :options="chartOptionsRendimiento"
              chart-id="cumplimiento-chart"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p>Datos insuficientes para mostrar tendencias</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- GrÃ¡fica de Ingresos Mensuales -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
          <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            EvoluciÃ³n de Ingresos (6 meses)
          </h3>
          <div class="h-64">
            <Bar 
              v-if="tendenciaMensual.length > 0"
              :data="chartDataIngresos" 
              :options="chartOptionsIngresos"
              chart-id="ingresos-chart"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <p>Datos insuficientes para mostrar ingresos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rendimiento por TÃ©cnico -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Rendimiento por TÃ©cnico (Mes Actual)
          </h3>
        </div>
        
        <div class="p-6">
          <div v-if="Object.keys(metricasRendimiento.serviciosPorTecnico).length === 0" class="text-center py-8 text-gray-400">
            <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No hay datos de tÃ©cnicos para este mes</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(tecnico, nombre) in metricasRendimiento.serviciosPorTecnico" :key="nombre"
                 class="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 border border-[#235347]/10 transition-all duration-300 hover:border-[#235347]/30">
              
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                  <div class="w-8 h-8 bg-[#235347] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ nombre.charAt(0).toUpperCase() }}
                  </div>
                  {{ nombre }}
                </h4>
                <div class="text-right">
                  <div class="text-xs text-gray-400">Eficiencia</div>
                  <div class="text-sm font-bold text-[#235347]">
                    {{ tecnico.totalVisitas > 0 ? Math.round((tecnico.visitasRealizadas / tecnico.totalVisitas) * 100) : 0 }}%
                  </div>
                </div>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Servicios:</span>
                  <span class="text-gray-800 font-medium">{{ tecnico.servicios }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Visitas realizadas:</span>
                  <span class="text-green-400 font-medium">{{ tecnico.visitasRealizadas }}/{{ tecnico.totalVisitas }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Ingresos generados:</span>
                  <span class="text-yellow-400 font-medium">Q{{ formatearDinero(tecnico.ingresos) }}</span>
                </div>
              </div>
              
              <!-- Barra de progreso -->
              <div class="mt-3">
                <div class="w-full bg-gray-800/50 rounded-full h-2">
                  <div class="bg-[#235347] h-2 rounded-full transition-all duration-500" 
                       :style="{width: (tecnico.totalVisitas > 0 ? (tecnico.visitasRealizadas / tecnico.totalVisitas) * 100 : 0) + '%'}">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de AnÃ¡lisis Mensual -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            AnÃ¡lisis de Tendencias (Ãšltimos 6 Meses)
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="glass-info-card">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">PerÃ­odo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Servicios</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Visitas Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Completadas</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Cumplimiento</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Ingresos</th>
              </tr>
            </thead>
            <tbody class="bg-gray-50 backdrop-blur-sm divide-y divide-gray-300">
              <tr v-if="tendenciaMensual.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg class="w-10 w-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>No hay datos suficientes para el anÃ¡lisis de tendencias</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(mes, index) in tendenciaMensual" :key="index" class="hover:bg-[#051F20]/10 transition-colors duration-200">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ mes.mes }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ mes.servicios }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ mes.totalVisitas }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-green-400">{{ mes.visitasRealizadas }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300"
                        :class="{
                          'bg-green-900/40 text-green-300 border border-green-600/50': mes.cumplimiento >= 80,
                          'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50': mes.cumplimiento >= 60 && mes.cumplimiento < 80,
                          'bg-red-900/40 text-red-300 border border-red-600/50': mes.cumplimiento < 60
                        }">
                    {{ mes.cumplimiento }}%
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-yellow-400 font-medium">Q{{ formatearDinero(mes.ingresos) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div> <!-- Fin de PestaÃ±a Rendimiento -->

    <!-- Modal moderno mejorado -->
    <transition name="modal-fade">
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-wrapper">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                <span class="modal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                {{ modoEdicion ? 'Editar Tienda' : 'Nueva Tienda' }}
              </h3>
              <button @click="cerrarModal" class="modal-close-btn">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

          <!-- Formulario completo -->
          <form @submit.prevent="guardarTienda" class="modal-form">
            <!-- InformaciÃ³n bÃ¡sica -->
            <div class="form-section">
              <h4 class="form-section-title">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                InformaciÃ³n de la Tienda
              </h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre Tienda/Cliente <span class="required">*</span></label>
                  <input v-model="nuevaTienda.nombre" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Marca <span class="required">*</span></label>
                  <select v-model="nuevaTienda.marca" class="form-input" required>
                    <option disabled value="">Seleccionar Marca</option>
                    <option v-for="(marca, i) in marcas" :key="i" :value="marca">{{ marca }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">TÃ©cnico</label>
                  <input v-model="nuevaTienda.tecnico" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">No. ODS</label>
                  <input v-model="nuevaTienda.ods" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">CategorÃ­a <span class="required">*</span></label>
                  <select v-model="nuevaTienda.categoria" class="form-input" required>
                    <option disabled value="">Seleccionar CategorÃ­a</option>
                    <option v-for="(cat, index) in categoriasDisponibles" :key="index" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Costo (Q) <span class="required">*</span></label>
                  <input v-model.number="nuevaTienda.costo" type="number" step="0.01" min="0" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Mes de Servicio <span class="required">*</span></label>
                  <select v-model="nuevaTienda.mesServicio" class="form-input" required>
                    <option disabled value="">Seleccionar Mes</option>
                    <option v-for="opcion in opcionesMeses" :key="opcion.valor" :value="opcion.valor">
                      {{ opcion.texto }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Estado del Servicio <span class="required">*</span></label>
                  <select v-model="nuevaTienda.estado" class="form-input" required>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tipo de Pago <span class="required">*</span></label>
                  <select v-model="nuevaTienda.tipoPago" class="form-input" required>
                    <option value="Contado">Contado</option>
                    <option value="CrÃ©dito">CrÃ©dito</option>
                  </select>
                </div>
                <div v-if="nuevaTienda.tipoPago === 'CrÃ©dito'" class="form-group">
                  <label class="form-label">DÃ­as de CrÃ©dito</label>
                  <input v-model.number="nuevaTienda.diasCredito" type="number" min="0" class="form-input" />
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">DescripciÃ³n del Servicio</label>
                  <textarea v-model="nuevaTienda.descripcion" rows="2" class="form-input" placeholder="Detalles del servicio a realizar..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Cantidad de Visitas <span class="required">*</span></label>
                  <select v-model.number="nuevaTienda.cantidadVisitas" class="form-input" required>
                    <option :value="1">1 Visita</option>
                    <option :value="2">2 Visitas</option>
                    <option :value="3">3 Visitas</option>
                    <option :value="4">4 Visitas</option>
                    <option :value="5">5 Visitas</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SecciÃ³n de Cronograma de Visitas -->
            <div v-if="nuevaTienda.cantidadVisitas > 0" class="form-section">
              <h4 class="form-section-title">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Cronograma de Visitas ({{ nuevaTienda.cantidadVisitas }} {{ nuevaTienda.cantidadVisitas === 1 ? 'visita' : 'visitas' }})
              </h4>

              <div class="visitas-grid">
                <div v-for="(visita, index) in nuevaTienda.visitas" :key="index" class="visita-card">
                  <div class="visita-header">
                    <h5 class="visita-title">
                      <span class="visita-number">{{ visita.numero }}</span>
                      Visita {{ visita.numero }}
                    </h5>
                    <span class="visita-status" :class="getEstadoVisitaClass(visita.estado)">
                      {{ visita.estado }}
                    </span>
                  </div>

                  <div class="visita-fields">
                    <div class="form-group">
                      <label class="form-label-sm">Fecha Programada <span class="required">*</span></label>
                      <div class="date-input-wrapper">
                        <input
                          v-model="visita.fecha"
                          type="date"
                          class="form-input-sm date-picker-input"
                          placeholder="Selecciona una fecha"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">Estado de la Visita</label>
                      <select v-model="visita.estado" class="form-input-sm">
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Realizada">Realizada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen de estados -->
              <div class="visitas-summary">
                <div class="summary-item">
                  <div class="summary-dot bg-gray"></div>
                  <span>Pendientes: {{ nuevaTienda.visitas?.filter(v => v.estado === 'Pendiente').length || 0 }}</span>
                </div>
                <div class="summary-item">
                  <div class="summary-dot bg-orange"></div>
                  <span>En proceso: {{ nuevaTienda.visitas?.filter(v => v.estado === 'En proceso').length || 0 }}</span>
                </div>
                <div class="summary-item">
                  <div class="summary-dot bg-green"></div>
                  <span>Realizadas: {{ nuevaTienda.visitas?.filter(v => v.estado === 'Realizada').length || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-modal-cancel">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-modal-submit"
                :disabled="!nuevaTienda.nombre || !nuevaTienda.marca"
              >
                {{ modoEdicion ? 'Actualizar Tienda' : 'Guardar Tienda' }}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal ConfirmaciÃ³n -->
    <transition name="modal-fade">
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-red-500/30 p-6 w-full max-w-md transform scale-100 transition-all duration-300">
          <h3 class="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.876a1 1 0 00.883-1.493L13.07 5.494a1 1 0 00-1.768 0L4.54 16.507A1 1 0 005.422 18z" />
            </svg>
            Confirmar eliminaciÃ³n
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            Â¿EstÃ¡s seguro de que deseas eliminar la tienda
            <strong class="text-[#235347]">{{ tiendaSeleccionada?.nombre }}</strong>?
            <span class="font-medium text-red-400 block mt-2">Esta acciÃ³n no se puede deshacer.</span>
          </p>
          <div class="flex justify-end gap-3">
            <button @click="mostrarConfirmacion = false; tiendaSeleccionada = null;" class="bg-white text-[#235347] border border-[#235347]/30 hover:bg-[#051F20]/10 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow">
              Cancelar
            </button>
            <button @click="eliminarTiendaConfirmado" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-red-300/40 transition-all duration-300 flex items-center gap-2 transform hover:scale-[1.02]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              SÃ­, eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>
    </div> <!-- End tiendas-container -->
  </MainLayout>
</template>

<script setup>
import { obtenerDocumentos, agregarDocumento, actualizarDocumento, eliminarDocumento } from '@/services/firebaseService';
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp, Timestamp, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '@/composables/useAuth'
import MainLayout from '@/components/MainLayout.vue'

// Chart.js imports
import { Doughnut, Line, Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Filler 
} from 'chart.js'

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Filler
)

// Composables
const { currentUser, registrarBitacora } = useAuth()

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

// Variables para el cambio rÃ¡pido de estado
const estadoDropdownAbierto = ref(null)
const estadosDisponibles = ['Pendiente', 'En proceso', 'Realizada']

// Variable para controlar el mes visualizado en cronograma
const mesVisualizadoCronograma = ref(new Date())

// Control de pestaÃ±as
const pestanaActiva = ref('gestion')
const pestanas = [
  { id: 'gestion', nombre: 'GestiÃ³n de Tiendas', icono: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'cronograma', nombre: 'Cronograma', icono: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'rendimiento', nombre: 'Rendimiento', icono: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
]

// Datos del original
const resumenPorMarca = ref([])
const categoriasDisponibles = ref([
  'Mant. Preventivo',
  'Venta de plantas', 
  'JardinizaciÃ³n',
  'ReparaciÃ³n sistema riego',
  'Proyecto nuevo'
])

// Objeto para formulario hÃ­brido
const tiendaVacia = () => ({
  nombre: '',
  marca: '',
  tecnico: '',
  costo: 500,
  estado: 'Pendiente',
  estadoCobro: 'Pendiente',
  tipoPago: 'CrÃ©dito',
  diasCredito: 30,
  mesServicio: '',
  ods: '',
  categoria: '',
  descripcion: '',
  numeroFactura: '',
  fechaFacturacion: '',
  cantidadVisitas: 1,
  visitas: [
    {
      numero: 1,
      fecha: '',
      estado: 'Pendiente'
    }
  ]
})

const nuevaTienda = ref(tiendaVacia())

// Variables para debounce y paginaciÃ³n
const debounceTimeout = ref(null)
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Descripciones automÃ¡ticas por categorÃ­a
const descripcionesPorCategoria = {
  'Mant. Preventivo': 'Mantenimiento preventivo de plantas y Ã¡reas verdes, incluye poda, fertilizaciÃ³n y control de plagas.',
  'Venta de plantas': 'Suministro e instalaciÃ³n de plantas ornamentales y decorativas segÃºn especificaciones del cliente.',
  'JardinizaciÃ³n': 'DiseÃ±o, creaciÃ³n y construcciÃ³n de nuevas Ã¡reas verdes y jardines paisajÃ­sticos.',
  'ReparaciÃ³n sistema riego': 'DiagnÃ³stico, reparaciÃ³n y mantenimiento del sistema de riego automatizado.',
  'Proyecto nuevo': 'Desarrollo integral de proyecto de jardinerÃ­a desde diseÃ±o hasta implementaciÃ³n completa.'
}

// Opciones de meses para el selector
const opcionesMeses = ref([])

// Propiedades calculadas
const totalCostoFiltrado = computed(() => {
  return tiendasFiltradas.value.reduce((sum, tienda) => {
    return sum + (Number(tienda.costo) || 0);
  }, 0);
});

// PaginaciÃ³n
const totalPaginas = computed(() => {
  return Math.ceil(tiendasFiltradas.value.length / itemsPorPagina.value);
});

const tiendasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;
  return tiendasFiltradas.value.slice(inicio, fin);
});

const rangoItems = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value + 1;
  const fin = Math.min(paginaActual.value * itemsPorPagina.value, tiendasFiltradas.value.length);
  return { inicio, fin, total: tiendasFiltradas.value.length };
});

// Propiedades computadas para el cronograma
const todasLasVisitas = computed(() => {
  const visitas = [];
  tiendas.value.forEach(tienda => {
    if (tienda.visitas && Array.isArray(tienda.visitas)) {
      tienda.visitas.forEach(visita => {
        visitas.push({
          ...visita,
          tienda: {
            id: tienda.id,
            nombre: tienda.nombre,
            marca: tienda.marca,
            tecnico: tienda.tecnico,
            categoria: tienda.categoria
          }
        });
      });
    }
  });
  return visitas.sort((a, b) => {
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return new Date(a.fecha) - new Date(b.fecha);
  });
});

const visitasProximas = computed(() => {
  const mesBase = new Date(mesVisualizadoCronograma.value);
  const inicioMes = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1);
  const finMes = new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 0);

  return todasLasVisitas.value.filter(visita => {
    if (!visita.fecha) return false;
    const fechaVisita = new Date(visita.fecha);
    return fechaVisita >= inicioMes && fechaVisita <= finMes;
  }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const visitasPorEstado = computed(() => {
  const estadisticas = {
    'Pendiente': 0,
    'En proceso': 0,
    'Realizada': 0
  };
  
  todasLasVisitas.value.forEach(visita => {
    if (estadisticas.hasOwnProperty(visita.estado)) {
      estadisticas[visita.estado]++;
    }
  });
  
  return estadisticas;
});

const calendarioProximo30Dias = computed(() => {
  const hoy = new Date();
  const mesBase = new Date(mesVisualizadoCronograma.value);
  const calendario = [];

  // Obtener el primer dÃ­a del mes visualizado
  const primerDiaMes = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1);

  // Retroceder al domingo anterior o el mismo dÃ­a si ya es domingo
  const primerDia = new Date(primerDiaMes);
  primerDia.setDate(primerDiaMes.getDate() - primerDiaMes.getDay());

  // FunciÃ³n para formatear fecha local (evita problemas de timezone)
  const formatearFechaLocal = (fecha) => {
    const aÃ±o = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${aÃ±o}-${mes}-${dia}`;
  };

  // Generar 35 dÃ­as (5 semanas) para tener un calendario completo
  for (let i = 0; i < 35; i++) {
    const fecha = new Date(primerDia);
    fecha.setDate(primerDia.getDate() + i);

    const fechaStr = formatearFechaLocal(fecha);
    const esHoy = fechaStr === formatearFechaLocal(hoy);

    // Buscar visitas para esta fecha
    const visitasDelDia = todasLasVisitas.value.filter(visita =>
      visita.fecha === fechaStr
    );

    calendario.push({
      fecha: fechaStr,
      dia: fecha.getDate(),
      esHoy,
      tieneVisitas: visitasDelDia.length > 0,
      visitas: visitasDelDia,
      esMesActual: fecha.getMonth() === mesBase.getMonth()
    });
  }

  return calendario;
});

// Propiedades computadas para mÃ©tricas de rendimiento
const metricasRendimiento = computed(() => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  
  // Servicios del mes actual
  const serviciosMesActual = tiendas.value.filter(tienda => {
    if (!tienda.mesServicio) return false;
    const [aÃ±o, mes] = tienda.mesServicio.split('-');
    const fechaServicio = new Date(parseInt(aÃ±o), parseInt(mes) - 1);
    return fechaServicio >= inicioMes && fechaServicio <= finMes;
  });
  
  // Visitas del mes actual
  const visitasMesActual = [];
  serviciosMesActual.forEach(tienda => {
    if (tienda.visitas) {
      tienda.visitas.forEach(visita => {
        if (visita.fecha) {
          const fechaVisita = new Date(visita.fecha);
          if (fechaVisita >= inicioMes && fechaVisita <= finMes) {
            visitasMesActual.push({...visita, tienda});
          }
        }
      });
    }
  });
  
  const visitasRealizadas = visitasMesActual.filter(v => v.estado === 'Realizada').length;
  const visitasPendientes = visitasMesActual.filter(v => v.estado === 'Pendiente').length;
  const visitasEnProceso = visitasMesActual.filter(v => v.estado === 'En proceso').length;
  const totalVisitas = visitasMesActual.length;
  
  const porcentajeCumplimiento = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
  
  // Ingresos del mes
  const ingresosMesActual = serviciosMesActual.reduce((total, tienda) => total + (tienda.costo || 0), 0);
  
  // Servicios por tÃ©cnico
  const serviciosPorTecnico = {};
  serviciosMesActual.forEach(tienda => {
    const tecnico = tienda.tecnico || 'Sin asignar';
    if (!serviciosPorTecnico[tecnico]) {
      serviciosPorTecnico[tecnico] = {
        servicios: 0,
        visitasRealizadas: 0,
        totalVisitas: 0,
        ingresos: 0
      };
    }
    serviciosPorTecnico[tecnico].servicios++;
    serviciosPorTecnico[tecnico].ingresos += tienda.costo || 0;
    
    if (tienda.visitas) {
      tienda.visitas.forEach(visita => {
        if (visita.fecha) {
          const fechaVisita = new Date(visita.fecha);
          if (fechaVisita >= inicioMes && fechaVisita <= finMes) {
            serviciosPorTecnico[tecnico].totalVisitas++;
            if (visita.estado === 'Realizada') {
              serviciosPorTecnico[tecnico].visitasRealizadas++;
            }
          }
        }
      });
    }
  });
  
  return {
    serviciosMesActual: serviciosMesActual.length,
    visitasRealizadas,
    visitasPendientes,
    visitasEnProceso,
    totalVisitas,
    porcentajeCumplimiento: Math.round(porcentajeCumplimiento),
    ingresosMesActual,
    serviciosPorTecnico
  };
});

// Datos para grÃ¡ficas de tendencias mensuales
const tendenciaMensual = computed(() => {
  const meses = [];
  const hoy = new Date();
  
  // Obtener datos de los Ãºltimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const aÃ±o = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const mesStr = `${aÃ±o}-${String(mes).padStart(2, '0')}`;
    
    const serviciosDelMes = tiendas.value.filter(tienda => tienda.mesServicio === mesStr);
    const visitasDelMes = [];
    
    serviciosDelMes.forEach(tienda => {
      if (tienda.visitas) {
        tienda.visitas.forEach(visita => {
          if (visita.fecha) {
            const fechaVisita = new Date(visita.fecha);
            if (fechaVisita.getFullYear() === aÃ±o && fechaVisita.getMonth() === mes - 1) {
              visitasDelMes.push(visita);
            }
          }
        });
      }
    });
    
    const visitasRealizadas = visitasDelMes.filter(v => v.estado === 'Realizada').length;
    const totalVisitas = visitasDelMes.length;
    const porcentaje = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
    const ingresos = serviciosDelMes.reduce((total, tienda) => total + (tienda.costo || 0), 0);
    
    meses.push({
      mes: fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      servicios: serviciosDelMes.length,
      visitasRealizadas,
      totalVisitas,
      cumplimiento: Math.round(porcentaje),
      ingresos
    });
  }
  
  return meses;
});

// Datos para grÃ¡fica de Chart.js - Cumplimiento mensual
const chartDataCumplimiento = computed(() => {
  return {
    labels: tendenciaMensual.value.map(m => m.mes),
    datasets: [
      {
        label: 'Cumplimiento (%)',
        data: tendenciaMensual.value.map(m => m.cumplimiento),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Servicios',
        data: tendenciaMensual.value.map(m => m.servicios),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
});

// Datos para grÃ¡fica de ingresos
const chartDataIngresos = computed(() => {
  return {
    labels: tendenciaMensual.value.map(m => m.mes),
    datasets: [
      {
        label: 'Ingresos (Q)',
        data: tendenciaMensual.value.map(m => m.ingresos),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 1)'
      }
    ]
  };
});

// GrÃ¡fico adaptado al tema oscuro
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

// Opciones del grÃ¡fico adaptadas al tema oscuro
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
      text: 'DistribuciÃ³n por Estado de Servicio',
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

// Opciones para grÃ¡ficas de rendimiento
const chartOptionsRendimiento = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          size: 11,
          family: "'Inter', 'Helvetica', 'Arial', sans-serif"
        },
        color: '#d1d5db'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#10b981',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value) {
          return value + '%';
        }
      },
      min: 0,
      max: 100
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
});

const chartOptionsIngresos = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#10b981',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: function(context) {
          return 'Q' + context.parsed.y.toLocaleString('es-GT', { minimumFractionDigits: 2 });
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value) {
          return 'Q' + value.toLocaleString('es-GT');
        }
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
        case 'En proceso': return 'bg-orange-900/40 text-orange-300 border border-orange-600/50 shadow-sm';
        case 'Finalizado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

const getEstadoCobroClass = (estadoCobro) => {
     switch (estadoCobro) {
        case 'Pendiente': return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
        case 'ImpresiÃ³n ODS': return 'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50 shadow-sm';
        case 'Proceso ODC': return 'bg-cyan-900/40 text-cyan-300 border border-cyan-600/50 shadow-sm';
        case 'FacturaciÃ³n': return 'bg-purple-900/40 text-purple-300 border border-purple-600/50 shadow-sm';
        case 'Pagado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

const getTipoPagoClass = (tipoPago) => {
    switch (tipoPago) {
        case 'Contado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        case 'CrÃ©dito': return 'bg-indigo-900/40 text-indigo-300 border border-indigo-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

// Accesibilidad y contraste mejorado: badges con alta legibilidad
<template>
  <MainLayout>
    <!-- Header Actions -->
    <template #header-actions>
      <button @click="abrirModal()" class="btn-gold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Tienda
      </button>
    </template>

    <div class="tiendas-container">
      <!-- NavegaciÃ³n de PestaÃ±as -->
    <div class="glass-card-premium rounded-xl mb-6">
      <div class="flex border-b border-gray-300 overflow-x-auto">
        <button
          v-for="pestana in pestanas"
          :key="pestana.id"
          @click="cambiarPestana(pestana.id)"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-b-2 relative whitespace-nowrap"
          :class="{
            'text-[#051F20] border-[#D4AF37] bg-gradient-to-r from-[#DAFDE2] to-[#8CB69B]': pestanaActiva === pestana.id,
            'text-gray-600 border-transparent hover:text-[#235347] hover:border-[#8CB69B] hover:bg-gradient-to-r hover:from-white hover:to-[#f8fffe]': pestanaActiva !== pestana.id
          }"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="pestana.icono" />
          </svg>
          <span class="hidden sm:inline">{{ pestana.nombre }}</span>
          <span class="sm:hidden">{{ pestana.nombre.split(' ')[0] }}</span>
          
          <!-- Indicador de notificaciÃ³n para cronograma -->
          <span v-if="pestana.id === 'cronograma' && visitasProximas.length > 0"
                class="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#051F20] text-xs px-1.5 sm:px-2 py-0.5 rounded-full ml-1 sm:ml-2 font-bold shadow-md">
            {{ visitasProximas.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Contenido de la PestaÃ±a GestiÃ³n -->
    <div v-if="pestanaActiva === 'gestion'">
      <!-- Resumen por Marca (del original) -->
    <div v-if="resumenPorMarca.length > 0" class="mb-8">
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Resumen por Marca
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(marcaResumen, index) in resumenPorMarca" :key="index"
             class="glass-card-premium border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-105 p-4 rounded-xl bg-gradient-to-br from-white to-[#f8fffe]"
             :class="[`border-${getBrandColor(marcaResumen.nombre)}-500`, `hover:shadow-${getBrandColor(marcaResumen.nombre)}-500/30`]">
          <h4 class="font-bold text-lg text-[#051F20] mb-2">{{ marcaResumen.nombre }}</h4>
          <p class="text-sm text-gray-600">Tiendas: <span class="font-bold text-[#235347]">{{ marcaResumen.conteo }}</span></p>
          <p class="text-sm text-gray-600">Ingresos: <span class="font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">Q{{ (marcaResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <div class="glass-card-premium backdrop-blur-lg shadow-lg rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#235347]/20 bg-gradient-to-br from-white to-[#f8fffe]">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative md:col-span-2">
           <label for="search" class="sr-only">Buscar</label>
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-[#235347]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
             </svg>
           </div>
           <input v-model="busqueda" type="text" id="search" placeholder="Buscar por nombre, marca, estado..." class="pl-10 pr-4 py-3 w-full rounded-xl bg-white backdrop-blur-sm border-2 border-[#8CB69B]/40 text-[#051F20] focus:ring-2 focus:ring-[#235347] focus:border-[#235347] transition-all duration-300 shadow-md hover:shadow-lg text-sm placeholder-gray-500 font-medium" />
        </div>
        <div class="relative">
           <label for="month-filter" class="sr-only">Filtrar por mes</label>
           <select v-model="filtroMes" id="month-filter" class="pr-8 py-3 w-full rounded-xl bg-white backdrop-blur-sm border-2 border-[#8CB69B]/40 text-[#051F20] focus:ring-2 focus:ring-[#235347] focus:border-[#235347] transition-all duration-300 shadow-md hover:shadow-lg text-sm appearance-none pl-3 font-medium">
             <option value="">Todos los Meses</option>
             <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes">
               {{ formatearMes(mes) }}
             </option>
           </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-[#235347]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
      </div>
       <div class="text-sm mt-3 text-right flex items-center justify-end gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="font-bold text-[#051F20] text-base">{{ tiendasFiltradas.length }}</span>
            <span class="text-gray-600 font-medium">{{ tiendasFiltradas.length === 1 ? 'tienda encontrada' : 'tiendas encontradas' }}</span>
        </div>
    </div>

    <!-- Vista Desktop - Tabla -->
    <div class="hidden lg:block glass-card-premium backdrop-blur-lg shadow-md rounded-xl overflow-hidden border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="glass-info-card">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Marca</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Mes Servicio</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Costo</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Estado Serv.</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Estado Cobro</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Visitas</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Pago</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-gray-50 backdrop-blur-sm divide-y divide-gray-300">
            <tr v-if="isLoading">
                <td colspan="9" class="px-4 py-10 text-center text-gray-400">
                  <div class="flex flex-col items-center justify-center">
                    <div class="loader-ring">
                      <div></div><div></div><div></div><div></div>
                    </div>
                    <p class="mt-3">Cargando tiendas...</p>
                  </div>
                </td>
            </tr>
            <tr v-else-if="tiendasFiltradas.length === 0">
                <td colspan="9" class="px-4 py-10 text-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron tiendas con los filtros actuales.</p>
                </td>
            </tr>
            <transition-group name="fade-table">
              <tr v-for="tienda in tiendasPaginadas" :key="tienda.id" class="hover:bg-[#051F20]/10 transition-colors duration-200">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ tienda.nombre }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ tienda.marca }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatearMes(tienda.mesServicio) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-[#235347] font-medium text-right">Q{{ formatearDinero(tienda.costo) }}</td>
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
                  <div class="flex flex-col gap-1">
                    <div class="text-xs text-gray-400">
                      {{ tienda.cantidadVisitas || 1 }} {{ (tienda.cantidadVisitas || 1) === 1 ? 'visita' : 'visitas' }}
                    </div>
                    <div v-if="tienda.visitas && tienda.visitas.length > 0" class="flex flex-wrap gap-1 justify-center">
                      <span v-for="(visita, index) in tienda.visitas.slice(0, 3)" :key="index"
                            class="w-2 h-2 rounded-full transition-all duration-300" 
                            :class="{
                              'bg-gray-500': visita.estado === 'Pendiente',
                              'bg-orange-500': visita.estado === 'En proceso', 
                              'bg-green-500': visita.estado === 'Realizada'
                            }"
                            :title="`Visita ${visita.numero}: ${visita.estado}`">
                      </span>
                      <span v-if="tienda.visitas.length > 3" class="text-xs text-gray-400 ml-1">+{{ tienda.visitas.length - 3 }}</span>
                    </div>
                    <div v-else class="w-2 h-2 rounded-full bg-gray-500 mx-auto" title="1 visita: Pendiente"></div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300" :class="getTipoPagoClass(tienda.tipoPago)">
                    {{ tienda.tipoPago || 'N/A' }}
                    <span v-if="tienda.tipoPago === 'CrÃ©dito'"> ({{ tienda.diasCredito || 0 }}d)</span>
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="abrirModal(tienda)" class="text-white bg-gradient-to-r from-[#235347] to-[#8CB69B] hover:from-[#051F20] hover:to-[#235347] p-2 rounded-lg transition-all duration-300 inline-flex shadow-md hover:shadow-lg hover:scale-105" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button @click="confirmarEliminar(tienda)" class="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-2 rounded-lg transition-all duration-300 inline-flex shadow-md hover:shadow-lg hover:scale-105" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </transition-group>
          </tbody>
          <tfoot class="glass-info-card border-t-2 border-[#D4AF37]/30">
            <tr>
              <td colspan="3" class="px-4 py-3 text-right text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                Totales Filtrados:
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-[#235347]">
                <span class="bg-[#051F20]/15 text-[#235347] px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-[#235347]/30">
                  Q{{ formatearDinero(totalCostoFiltrado) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-[#235347]">
                <span class="bg-[#051F20]/15 text-[#235347] px-3 py-1 rounded-lg transition-all duration-300 hover:shadow-md border border-[#235347]/30">
                  {{ tiendasFiltradas.length }} Tienda(s)
                </span>
              </td>
              <td colspan="4" class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Vista Mobile/Tablet - Cards -->
    <div class="lg:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="loader-ring mb-4">
          <div></div><div></div><div></div><div></div>
        </div>
        <p class="text-gray-400">Cargando tiendas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="tiendasFiltradas.length === 0" class="flex flex-col items-center justify-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-400 text-center">No se encontraron tiendas con los filtros actuales.</p>
      </div>

      <!-- Cards List -->
      <transition-group name="fade-cards" v-else>
        <div v-for="tienda in tiendasPaginadas" :key="tienda.id" 
             class="glass-card-premium backdrop-blur-lg rounded-xl p-4 border border-[#235347]/20 shadow-md hover:shadow-lg hover:shadow-[#235347]/10 transition-all duration-300 hover:border-[#235347]/40">
          
          <!-- Header Card -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ tienda.nombre }}</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[#235347] font-medium">{{ tienda.marca }}</span>
                <span class="text-gray-400">â€¢</span>
                <span class="text-gray-600">{{ formatearMes(tienda.mesServicio) }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-[#235347] mb-1">Q{{ formatearDinero(tienda.costo) }}</div>
              <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTipoPagoClass(tienda.tipoPago)">
                {{ tienda.tipoPago || 'N/A' }}
                <span v-if="tienda.tipoPago === 'CrÃ©dito'" class="ml-1">({{ tienda.diasCredito || 0 }}d)</span>
              </span>
            </div>
          </div>

          <!-- Status Row -->
          <div class="flex items-center justify-between mb-3 py-2 border-t border-gray-700/50">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Estado Servicio:</span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="getEstadoServicioClass(tienda.estado)">
                  {{ tienda.estado || 'N/A' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Estado Cobro:</span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="getEstadoCobroClass(tienda.estadoCobro)">
                  {{ tienda.estadoCobro || 'N/A' }}
                </span>
              </div>
            </div>

            <!-- Visitas Indicator -->
            <div class="flex flex-col items-end gap-1">
              <div class="text-xs text-gray-400">
                {{ tienda.cantidadVisitas || 1 }} {{ (tienda.cantidadVisitas || 1) === 1 ? 'visita' : 'visitas' }}
              </div>
              <div v-if="tienda.visitas && tienda.visitas.length > 0" class="flex flex-wrap gap-1">
                <span v-for="(visita, index) in tienda.visitas.slice(0, 4)" :key="index"
                      class="w-2.5 h-2.5 rounded-full" 
                      :class="{
                        'bg-gray-500': visita.estado === 'Pendiente',
                        'bg-blue-500': visita.estado === 'En proceso', 
                        'bg-green-500': visita.estado === 'Realizada'
                      }"
                      :title="`Visita ${visita.numero}: ${visita.estado}`">
                </span>
                <span v-if="tienda.visitas.length > 4" class="text-xs text-gray-400">+{{ tienda.visitas.length - 4 }}</span>
              </div>
              <div v-else class="w-2.5 h-2.5 rounded-full bg-gray-500" title="1 visita: Pendiente"></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
            <button @click="abrirModal(tienda)" 
                    class="flex items-center gap-1 px-3 py-2 text-[#235347] hover:text-white bg-[#051F20]/15 hover:bg-[#235347] rounded-lg transition-all duration-300 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="confirmarEliminar(tienda)" 
                    class="flex items-center gap-1 px-3 py-2 text-red-400 hover:text-white bg-red-900/30 hover:bg-red-600 rounded-lg transition-all duration-300 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </transition-group>

      <!-- Resumen Mobile -->
      <div v-if="!isLoading && tiendasFiltradas.length > 0" class="glass-card-premium backdrop-blur-lg rounded-xl p-4 border border-[#235347]/20 mt-4">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-400">Total Filtrado:</span>
          <div class="text-right">
            <div class="text-lg font-bold text-[#235347]">Q{{ formatearDinero(totalCostoFiltrado) }}</div>
            <div class="text-xs text-gray-400">{{ tiendasFiltradas.length }} tienda(s)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PaginaciÃ³n -->
    <div v-if="totalPaginas > 1" class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-4 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- InformaciÃ³n de rango -->
        <div class="text-sm text-gray-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>
            Mostrando <span class="font-medium text-[#235347]">{{ rangoItems.inicio }}</span> a 
            <span class="font-medium text-[#235347]">{{ rangoItems.fin }}</span> de 
            <span class="font-medium text-[#235347]">{{ rangoItems.total }}</span> resultados
          </span>
        </div>

        <!-- Controles de paginaciÃ³n -->
        <div class="flex items-center gap-2">
          <!-- BotÃ³n anterior -->
          <button 
            @click="paginaAnterior" 
            :disabled="paginaActual === 1"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
            :class="paginaActual === 1 
              ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
              : 'bg-[#051F20]/15 text-[#8CB69B] hover:bg-[#235347] hover:text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <!-- NÃºmeros de pÃ¡gina -->
          <div class="flex items-center gap-1">
            <template v-for="pagina in totalPaginas" :key="pagina">
              <button 
                v-if="pagina === 1 || pagina === totalPaginas || (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)"
                @click="irAPagina(pagina)"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                :class="pagina === paginaActual 
                  ? 'bg-[#235347] text-white shadow-md' 
                  : 'bg-gray-800/40 text-gray-600 hover:bg-[#051F20]/15 hover:text-[#8CB69B]'
              >
                {{ pagina }}
              </button>
              <span v-else-if="pagina === paginaActual - 2 || pagina === paginaActual + 2" class="px-2 text-gray-500">...</span>
            </template>
          </div>

          <!-- BotÃ³n siguiente -->
          <button 
            @click="paginaSiguiente" 
            :disabled="paginaActual === totalPaginas"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
            :class="paginaActual === totalPaginas 
              ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
              : 'bg-[#051F20]/15 text-[#8CB69B] hover:bg-[#235347] hover:text-white'"
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Selector de items por pÃ¡gina -->
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span>Mostrar:</span>
          <select v-model="itemsPorPagina" @change="paginaActual = 1" class="bg-white border-gray-300 border border-[#235347]/30 text-gray-800 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-[#235347]">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>por pÃ¡gina</span>
        </div>
      </div>
    </div>

    <!-- GrÃ¡fico con tema oscuro -->
    <div class="mt-8 glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
      <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 text-center flex justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#235347]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <p>Cargando datos del grÃ¡fico...</p>
            </div>
            <div v-else class="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No hay datos suficientes para mostrar el grÃ¡fico con los filtros actuales.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    </div> <!-- Fin de PestaÃ±a GestiÃ³n -->

    <!-- Contenido de la PestaÃ±a Cronograma -->
    <div v-if="pestanaActiva === 'cronograma'" class="space-y-6">
      
      <!-- EstadÃ­sticas del Cronograma -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-400">Pendientes</div>
              <div class="text-2xl font-bold text-gray-600">{{ visitasPorEstado.Pendiente }}</div>
            </div>
          </div>
        </div>
        
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-orange-400">En Proceso</div>
              <div class="text-2xl font-bold text-orange-300">{{ visitasPorEstado['En proceso'] }}</div>
            </div>
          </div>
        </div>
        
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-green-400">Realizadas</div>
              <div class="text-2xl font-bold text-green-300">{{ visitasPorEstado.Realizada }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de PrÃ³ximas Visitas -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
              <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Visitas de {{ nombreMesVisualizando }} ({{ visitasProximas.length }})
            </h3>

            <!-- Controles de navegaciÃ³n de mes -->
            <div class="flex items-center gap-2">
              <button
                @click="mesAnterior"
                class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
                title="Mes anterior"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                @click="volverMesActual"
                class="px-3 py-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300 text-sm font-medium"
                title="Volver al mes actual"
              >
                Hoy
              </button>

              <button
                @click="mesSiguiente"
                class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
                title="Mes siguiente"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="divide-y divide-gray-300">
          <div v-if="visitasProximas.length === 0" class="px-6 py-8 text-center text-gray-400">
            <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No hay visitas prÃ³ximas programadas</p>
          </div>
          
          <div v-for="(visita, index) in visitasProximas.slice(0, 10)" :key="`${visita.tienda.id}-${visita.numero}-${visita.fecha}`" 
               class="px-6 py-4 hover:bg-[#051F20]/10 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Estado de la visita con dropdown -->
                <div class="flex-shrink-0 relative group">
                  <div class="relative">
                    <!-- Estado actual (clickeable) -->
                    <button 
                      @click.stop="toggleEstadoDropdown(`${visita.tienda.id}-${visita.numero}-${visita.fecha}`)"
                      class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-1 hover:scale-105 interactive-element" 
                      :class="getEstadoVisitaClass(visita.estado)"
                      :title="'Cambiar estado: ' + visita.estado"
                    >
                      <span>{{ visita.estado }}</span>
                      <svg class="w-3 h-3 transition-transform duration-200" 
                           :class="{ 'rotate-180': estadoDropdownAbierto === `${visita.tienda.id}-${visita.numero}-${visita.fecha}` }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    <!-- Dropdown de estados -->
                    <div v-if="estadoDropdownAbierto === `${visita.tienda.id}-${visita.numero}-${visita.fecha}`" 
                         @click.stop
                         class="absolute top-full left-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-xl z-50 min-w-[140px] py-1">
                      <button 
                        v-for="estado in estadosDisponibles" 
                        :key="estado"
                        @click.stop="cambiarEstadoVisitaRapido(visita, estado)"
                        class="w-full px-3 py-2 text-xs font-medium text-left hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-2"
                        :class="{
                          'text-gray-400': estado === 'Pendiente',
                          'text-orange-400': estado === 'En proceso', 
                          'text-green-400': estado === 'Realizada',
                          'bg-gray-700/30': estado === visita.estado
                        }"
                      >
                        <div class="w-2 h-2 rounded-full" :class="{
                          'bg-gray-400': estado === 'Pendiente',
                          'bg-orange-400': estado === 'En proceso',
                          'bg-green-400': estado === 'Realizada'
                        }"></div>
                        {{ estado }}
                        <span v-if="estado === visita.estado" class="ml-auto text-[#235347]">âœ“</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- InformaciÃ³n de la visita -->
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-medium text-gray-800">{{ visita.tienda.nombre }}</h4>
                     <span class="text-xs text-[#235347]">{{ visita.tienda.marca }}</span>
                  </div>
                  <div class="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>Visita #{{ visita.numero }}</span>
                    <span v-if="visita.tienda.tecnico">TÃ©cnico: {{ visita.tienda.tecnico }}</span>
                    <span>{{ visita.tienda.categoria }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Fecha y countdown -->
              <div class="text-right">
                <div class="text-sm font-medium text-gray-800">{{ formatearFechaCorta(visita.fecha) }}</div>
                <div class="text-xs" :class="{
                  'text-red-400': diasDesdeHoy(visita.fecha) < 0,
                  'text-yellow-400': diasDesdeHoy(visita.fecha) >= 0 && diasDesdeHoy(visita.fecha) <= 3,
                  'text-gray-400': diasDesdeHoy(visita.fecha) > 3
                }">
                  <span v-if="diasDesdeHoy(visita.fecha) < 0">
                    Atrasada {{ Math.abs(diasDesdeHoy(visita.fecha)) }} dÃ­a(s)
                  </span>
                  <span v-else-if="diasDesdeHoy(visita.fecha) === 0">
                    Hoy
                  </span>
                  <span v-else-if="diasDesdeHoy(visita.fecha) === 1">
                    MaÃ±ana
                  </span>
                  <span v-else>
                    En {{ diasDesdeHoy(visita.fecha) }} dÃ­as
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="visitasProximas.length > 10" class="px-6 py-3 bg-gray-800/30 text-center">
          <span class="text-sm text-gray-400">Y {{ visitasProximas.length - 10 }} visitas mÃ¡s...</span>
        </div>
      </div>

      <!-- Calendario Simple de Visitas -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendario - {{ nombreMesVisualizando }}
          </h3>

          <!-- Controles de navegaciÃ³n de mes -->
          <div class="flex items-center gap-2">
            <button
              @click="mesAnterior"
              class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
              title="Mes anterior"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              @click="volverMesActual"
              class="px-3 py-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300 text-sm font-medium"
              title="Volver al mes actual"
            >
              Hoy
            </button>

            <button
              @click="mesSiguiente"
              class="p-2 rounded-lg bg-[#051F20]/15 hover:bg-[#235347] text-[#235347] hover:text-white transition-all duration-300"
              title="Mes siguiente"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="dia in ['Dom', 'Lun', 'Mar', 'MiÃ©', 'Jue', 'Vie', 'SÃ¡b']" :key="dia" 
               class="text-center text-xs font-medium text-gray-400 py-2">
            {{ dia }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div v-for="fecha in calendarioProximo30Dias" :key="fecha.fecha"
               class="calendar-day-cell aspect-square p-2 rounded-lg transition-all duration-200 relative cursor-pointer hover:scale-105 flex flex-col items-center justify-center group"
               :class="{
                 'bg-gray-800/40': !fecha.esHoy && !fecha.tieneVisitas && fecha.esMesActual,
                 'bg-gray-800/20': !fecha.esHoy && !fecha.tieneVisitas && !fecha.esMesActual,
                  'bg-[#051F20]/15 border-2 border-[#235347]/50': fecha.esHoy,
                 'bg-cyan-900/30 border-2 border-cyan-500/40': fecha.tieneVisitas && !fecha.esHoy && fecha.esMesActual,
                 'bg-cyan-900/20 border border-cyan-500/20': fecha.tieneVisitas && !fecha.esHoy && !fecha.esMesActual
               }"
               >
            <!-- NÃºmero del dÃ­a -->
            <div class="text-xs font-semibold" :class="{
              'text-[#235347]': fecha.esHoy,
              'text-gray-800': fecha.tieneVisitas && !fecha.esHoy && fecha.esMesActual,
              'text-gray-400': fecha.tieneVisitas && !fecha.esHoy && !fecha.esMesActual,
              'text-gray-500': !fecha.tieneVisitas && fecha.esMesActual,
              'text-gray-600': !fecha.tieneVisitas && !fecha.esMesActual
            }">
              {{ fecha.dia }}
            </div>

            <!-- Contador de visitas -->
            <div v-if="fecha.tieneVisitas" class="mt-1">
              <div class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" :class="{
                'bg-[#235347]/20 text-[#235347]': fecha.esHoy,
                'bg-cyan-500/30 text-cyan-300': !fecha.esHoy
              }">
                {{ fecha.visitas.length }}
              </div>
            </div>

            <!-- Indicadores de estado (puntos pequeÃ±os) -->
            <div v-if="fecha.tieneVisitas" class="mt-1 flex gap-0.5">
              <div v-for="(visita, idx) in fecha.visitas.slice(0, 4)" :key="idx"
                   class="w-1 h-1 rounded-full"
                   :class="{
                     'bg-gray-400': visita.estado === 'Pendiente',
                     'bg-orange-400': visita.estado === 'En proceso',
                     'bg-green-400': visita.estado === 'Realizada'
                   }">
              </div>
            </div>

            <!-- Tooltip con detalles de visitas (aparece al hover) -->
            <div v-if="fecha.tieneVisitas" class="calendar-tooltip">
              <div class="tooltip-header">
                <div class="text-sm font-bold text-[#D4AF37]">
                  {{ formatearFechaCorta(fecha.fecha) }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ fecha.visitas.length }} {{ fecha.visitas.length === 1 ? 'visita' : 'visitas' }}
                </div>
              </div>

              <div class="tooltip-content">
                <div v-for="(visita, idx) in fecha.visitas" :key="idx" class="tooltip-visita">
                  <div class="flex items-center gap-2">
                    <div class="tooltip-visita-numero">{{ visita.numero }}</div>
                    <div class="flex-1">
                      <div class="tooltip-visita-nombre">{{ visita.tienda.nombre }}</div>
                      <div class="tooltip-visita-marca">{{ visita.tienda.marca }}</div>
                    </div>
                    <div class="tooltip-visita-estado" :class="{
                      'status-pendiente': visita.estado === 'Pendiente',
                      'status-proceso': visita.estado === 'En proceso',
                      'status-realizada': visita.estado === 'Realizada'
                    }">
                      {{ visita.estado }}
                    </div>
                  </div>
                  <div v-if="visita.tienda.tecnico" class="tooltip-visita-tecnico">
                    ðŸ‘· {{ visita.tienda.tecnico }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-center gap-6 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>Pendiente</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-orange-400"></div>
            <span>En proceso</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Realizada</span>
          </div>
        </div>
      </div>
      
    </div> <!-- Fin de PestaÃ±a Cronograma -->

    <!-- Contenido de la PestaÃ±a Rendimiento -->
    <div v-if="pestanaActiva === 'rendimiento'" class="space-y-6">
      
      <!-- KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <!-- Cumplimiento General -->
         <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Cumplimiento</div>
              <div class="text-3xl font-bold text-[#235347] mb-1">{{ metricasRendimiento.porcentajeCumplimiento }}%</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-[#235347]/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 w-full bg-gray-800/50 rounded-full h-2">
            <div class="bg-[#235347] h-2 rounded-full transition-all duration-500" :style="{width: metricasRendimiento.porcentajeCumplimiento + '%'}"></div>
          </div>
        </div>
        
        <!-- Servicios del Mes -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Servicios</div>
              <div class="text-3xl font-bold text-purple-400 mb-1">{{ metricasRendimiento.serviciosMesActual }}</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Visitas Realizadas -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Completadas</div>
              <div class="text-3xl font-bold text-green-400 mb-1">{{ metricasRendimiento.visitasRealizadas }}</div>
              <div class="text-xs text-gray-500">de {{ metricasRendimiento.totalVisitas }} visitas</div>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Ingresos del Mes -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl p-6 border border-yellow-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-400 mb-1">Ingresos</div>
              <div class="text-2xl font-bold text-yellow-400 mb-1">Q{{ formatearDinero(metricasRendimiento.ingresosMesActual) }}</div>
              <div class="text-xs text-gray-500">Este mes</div>
            </div>
            <div class="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- GrÃ¡ficas de Tendencias -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <!-- GrÃ¡fica de Cumplimiento vs Servicios -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
          <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tendencia de Cumplimiento (6 meses)
          </h3>
          <div class="h-64">
            <Line 
              v-if="tendenciaMensual.length > 0"
              :data="chartDataCumplimiento" 
              :options="chartOptionsRendimiento"
              chart-id="cumplimiento-chart"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p>Datos insuficientes para mostrar tendencias</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- GrÃ¡fica de Ingresos Mensuales -->
        <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10 p-6">
          <h3 class="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            EvoluciÃ³n de Ingresos (6 meses)
          </h3>
          <div class="h-64">
            <Bar 
              v-if="tendenciaMensual.length > 0"
              :data="chartDataIngresos" 
              :options="chartOptionsIngresos"
              chart-id="ingresos-chart"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <p>Datos insuficientes para mostrar ingresos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rendimiento por TÃ©cnico -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Rendimiento por TÃ©cnico (Mes Actual)
          </h3>
        </div>
        
        <div class="p-6">
          <div v-if="Object.keys(metricasRendimiento.serviciosPorTecnico).length === 0" class="text-center py-8 text-gray-400">
            <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No hay datos de tÃ©cnicos para este mes</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(tecnico, nombre) in metricasRendimiento.serviciosPorTecnico" :key="nombre"
                 class="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 border border-[#235347]/10 transition-all duration-300 hover:border-[#235347]/30">
              
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                  <div class="w-8 h-8 bg-[#235347] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ nombre.charAt(0).toUpperCase() }}
                  </div>
                  {{ nombre }}
                </h4>
                <div class="text-right">
                  <div class="text-xs text-gray-400">Eficiencia</div>
                  <div class="text-sm font-bold text-[#235347]">
                    {{ tecnico.totalVisitas > 0 ? Math.round((tecnico.visitasRealizadas / tecnico.totalVisitas) * 100) : 0 }}%
                  </div>
                </div>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Servicios:</span>
                  <span class="text-gray-800 font-medium">{{ tecnico.servicios }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Visitas realizadas:</span>
                  <span class="text-green-400 font-medium">{{ tecnico.visitasRealizadas }}/{{ tecnico.totalVisitas }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Ingresos generados:</span>
                  <span class="text-yellow-400 font-medium">Q{{ formatearDinero(tecnico.ingresos) }}</span>
                </div>
              </div>
              
              <!-- Barra de progreso -->
              <div class="mt-3">
                <div class="w-full bg-gray-800/50 rounded-full h-2">
                  <div class="bg-[#235347] h-2 rounded-full transition-all duration-500" 
                       :style="{width: (tecnico.totalVisitas > 0 ? (tecnico.visitasRealizadas / tecnico.totalVisitas) * 100 : 0) + '%'}">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de AnÃ¡lisis Mensual -->
      <div class="glass-card-premium backdrop-blur-lg shadow-md rounded-xl border border-[#235347]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#235347]/10">
        <div class="px-6 py-4 border-b border-[#235347]/20">
          <h3 class="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
            <svg class="w-5 h-5 text-[#235347]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            AnÃ¡lisis de Tendencias (Ãšltimos 6 Meses)
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="glass-info-card">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">PerÃ­odo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Servicios</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Visitas Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Completadas</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Cumplimiento</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Ingresos</th>
              </tr>
            </thead>
            <tbody class="bg-gray-50 backdrop-blur-sm divide-y divide-gray-300">
              <tr v-if="tendenciaMensual.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg class="w-10 w-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>No hay datos suficientes para el anÃ¡lisis de tendencias</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(mes, index) in tendenciaMensual" :key="index" class="hover:bg-[#051F20]/10 transition-colors duration-200">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ mes.mes }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ mes.servicios }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ mes.totalVisitas }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-green-400">{{ mes.visitasRealizadas }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300"
                        :class="{
                          'bg-green-900/40 text-green-300 border border-green-600/50': mes.cumplimiento >= 80,
                          'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50': mes.cumplimiento >= 60 && mes.cumplimiento < 80,
                          'bg-red-900/40 text-red-300 border border-red-600/50': mes.cumplimiento < 60
                        }">
                    {{ mes.cumplimiento }}%
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-yellow-400 font-medium">Q{{ formatearDinero(mes.ingresos) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div> <!-- Fin de PestaÃ±a Rendimiento -->

    <!-- Modal moderno mejorado -->
    <transition name="modal-fade">
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-wrapper">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                <span class="modal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                {{ modoEdicion ? 'Editar Tienda' : 'Nueva Tienda' }}
              </h3>
              <button @click="cerrarModal" class="modal-close-btn">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

          <!-- Formulario completo -->
          <form @submit.prevent="guardarTienda" class="modal-form">
            <!-- InformaciÃ³n bÃ¡sica -->
            <div class="form-section">
              <h4 class="form-section-title">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                InformaciÃ³n de la Tienda
              </h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre Tienda/Cliente <span class="required">*</span></label>
                  <input v-model="nuevaTienda.nombre" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Marca <span class="required">*</span></label>
                  <select v-model="nuevaTienda.marca" class="form-input" required>
                    <option disabled value="">Seleccionar Marca</option>
                    <option v-for="(marca, i) in marcas" :key="i" :value="marca">{{ marca }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">TÃ©cnico</label>
                  <input v-model="nuevaTienda.tecnico" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">No. ODS</label>
                  <input v-model="nuevaTienda.ods" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">CategorÃ­a <span class="required">*</span></label>
                  <select v-model="nuevaTienda.categoria" class="form-input" required>
                    <option disabled value="">Seleccionar CategorÃ­a</option>
                    <option v-for="(cat, index) in categoriasDisponibles" :key="index" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Costo (Q) <span class="required">*</span></label>
                  <input v-model.number="nuevaTienda.costo" type="number" step="0.01" min="0" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Mes de Servicio <span class="required">*</span></label>
                  <select v-model="nuevaTienda.mesServicio" class="form-input" required>
                    <option disabled value="">Seleccionar Mes</option>
                    <option v-for="opcion in opcionesMeses" :key="opcion.valor" :value="opcion.valor">
                      {{ opcion.texto }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Estado del Servicio <span class="required">*</span></label>
                  <select v-model="nuevaTienda.estado" class="form-input" required>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tipo de Pago <span class="required">*</span></label>
                  <select v-model="nuevaTienda.tipoPago" class="form-input" required>
                    <option value="Contado">Contado</option>
                    <option value="CrÃ©dito">CrÃ©dito</option>
                  </select>
                </div>
                <div v-if="nuevaTienda.tipoPago === 'CrÃ©dito'" class="form-group">
                  <label class="form-label">DÃ­as de CrÃ©dito</label>
                  <input v-model.number="nuevaTienda.diasCredito" type="number" min="0" class="form-input" />
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">DescripciÃ³n del Servicio</label>
                  <textarea v-model="nuevaTienda.descripcion" rows="2" class="form-input" placeholder="Detalles del servicio a realizar..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Cantidad de Visitas <span class="required">*</span></label>
                  <select v-model.number="nuevaTienda.cantidadVisitas" class="form-input" required>
                    <option :value="1">1 Visita</option>
                    <option :value="2">2 Visitas</option>
                    <option :value="3">3 Visitas</option>
                    <option :value="4">4 Visitas</option>
                    <option :value="5">5 Visitas</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SecciÃ³n de Cronograma de Visitas -->
            <div v-if="nuevaTienda.cantidadVisitas > 0" class="form-section">
              <h4 class="form-section-title">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Cronograma de Visitas ({{ nuevaTienda.cantidadVisitas }} {{ nuevaTienda.cantidadVisitas === 1 ? 'visita' : 'visitas' }})
              </h4>

              <div class="visitas-grid">
                <div v-for="(visita, index) in nuevaTienda.visitas" :key="index" class="visita-card">
                  <div class="visita-header">
                    <h5 class="visita-title">
                      <span class="visita-number">{{ visita.numero }}</span>
                      Visita {{ visita.numero }}
                    </h5>
                    <span class="visita-status" :class="getEstadoVisitaClass(visita.estado)">
                      {{ visita.estado }}
                    </span>
                  </div>

                  <div class="visita-fields">
                    <div class="form-group">
                      <label class="form-label-sm">Fecha Programada <span class="required">*</span></label>
                      <div class="date-input-wrapper">
                        <input
                          v-model="visita.fecha"
                          type="date"
                          class="form-input-sm date-picker-input"
                          placeholder="Selecciona una fecha"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">Estado de la Visita</label>
                      <select v-model="visita.estado" class="form-input-sm">
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Realizada">Realizada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen de estados -->
              <div class="visitas-summary">
                <div class="summary-item">
                  <div class="summary-dot bg-gray"></div>
                  <span>Pendientes: {{ nuevaTienda.visitas?.filter(v => v.estado === 'Pendiente').length || 0 }}</span>
                </div>
                <div class="summary-item">
                  <div class="summary-dot bg-orange"></div>
                  <span>En proceso: {{ nuevaTienda.visitas?.filter(v => v.estado === 'En proceso').length || 0 }}</span>
                </div>
                <div class="summary-item">
                  <div class="summary-dot bg-green"></div>
                  <span>Realizadas: {{ nuevaTienda.visitas?.filter(v => v.estado === 'Realizada').length || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-modal-cancel">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-modal-submit"
                :disabled="!nuevaTienda.nombre || !nuevaTienda.marca"
              >
                {{ modoEdicion ? 'Actualizar Tienda' : 'Guardar Tienda' }}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal ConfirmaciÃ³n -->
    <transition name="modal-fade">
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-red-500/30 p-6 w-full max-w-md transform scale-100 transition-all duration-300">
          <h3 class="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.876a1 1 0 00.883-1.493L13.07 5.494a1 1 0 00-1.768 0L4.54 16.507A1 1 0 005.422 18z" />
            </svg>
            Confirmar eliminaciÃ³n
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            Â¿EstÃ¡s seguro de que deseas eliminar la tienda
            <strong class="text-[#235347]">{{ tiendaSeleccionada?.nombre }}</strong>?
            <span class="font-medium text-red-400 block mt-2">Esta acciÃ³n no se puede deshacer.</span>
          </p>
          <div class="flex justify-end gap-3">
            <button @click="mostrarConfirmacion = false; tiendaSeleccionada = null;" class="bg-white text-[#235347] border border-[#235347]/30 hover:bg-[#051F20]/10 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow">
              Cancelar
            </button>
            <button @click="eliminarTiendaConfirmado" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-red-300/40 transition-all duration-300 flex items-center gap-2 transform hover:scale-[1.02]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              SÃ­, eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>
    </div> <!-- End tiendas-container -->
  </MainLayout>
</template>

<script setup>
import { obtenerDocumentos, agregarDocumento, actualizarDocumento, eliminarDocumento } from '@/services/firebaseService';
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp, Timestamp, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '@/composables/useAuth'
import MainLayout from '@/components/MainLayout.vue'

// Chart.js imports
import { Doughnut, Line, Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Filler 
} from 'chart.js'

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Filler
)

// Composables
const { currentUser, registrarBitacora } = useAuth()

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

// Variables para el cambio rÃ¡pido de estado
const estadoDropdownAbierto = ref(null)
const estadosDisponibles = ['Pendiente', 'En proceso', 'Realizada']

// Variable para controlar el mes visualizado en cronograma
const mesVisualizadoCronograma = ref(new Date())

// Control de pestaÃ±as
const pestanaActiva = ref('gestion')
const pestanas = [
  { id: 'gestion', nombre: 'GestiÃ³n de Tiendas', icono: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'cronograma', nombre: 'Cronograma', icono: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'rendimiento', nombre: 'Rendimiento', icono: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
]

// Datos del original
const resumenPorMarca = ref([])
const categoriasDisponibles = ref([
  'Mant. Preventivo',
  'Venta de plantas', 
  'JardinizaciÃ³n',
  'ReparaciÃ³n sistema riego',
  'Proyecto nuevo'
])

// Objeto para formulario hÃ­brido
const tiendaVacia = () => ({
  nombre: '',
  marca: '',
  tecnico: '',
  costo: 500,
  estado: 'Pendiente',
  estadoCobro: 'Pendiente',
  tipoPago: 'CrÃ©dito',
  diasCredito: 30,
  mesServicio: '',
  ods: '',
  categoria: '',
  descripcion: '',
  numeroFactura: '',
  fechaFacturacion: '',
  cantidadVisitas: 1,
  visitas: [
    {
      numero: 1,
      fecha: '',
      estado: 'Pendiente'
    }
  ]
})

const nuevaTienda = ref(tiendaVacia())

// Variables para debounce y paginaciÃ³n
const debounceTimeout = ref(null)
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Descripciones automÃ¡ticas por categorÃ­a
const descripcionesPorCategoria = {
  'Mant. Preventivo': 'Mantenimiento preventivo de plantas y Ã¡reas verdes, incluye poda, fertilizaciÃ³n y control de plagas.',
  'Venta de plantas': 'Suministro e instalaciÃ³n de plantas ornamentales y decorativas segÃºn especificaciones del cliente.',
  'JardinizaciÃ³n': 'DiseÃ±o, creaciÃ³n y construcciÃ³n de nuevas Ã¡reas verdes y jardines paisajÃ­sticos.',
  'ReparaciÃ³n sistema riego': 'DiagnÃ³stico, reparaciÃ³n y mantenimiento del sistema de riego automatizado.',
  'Proyecto nuevo': 'Desarrollo integral de proyecto de jardinerÃ­a desde diseÃ±o hasta implementaciÃ³n completa.'
}

// Opciones de meses para el selector
const opcionesMeses = ref([])

// Propiedades calculadas
const totalCostoFiltrado = computed(() => {
  return tiendasFiltradas.value.reduce((sum, tienda) => {
    return sum + (Number(tienda.costo) || 0);
  }, 0);
});

// PaginaciÃ³n
const totalPaginas = computed(() => {
  return Math.ceil(tiendasFiltradas.value.length / itemsPorPagina.value);
});

const tiendasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;
  return tiendasFiltradas.value.slice(inicio, fin);
});

const rangoItems = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value + 1;
  const fin = Math.min(paginaActual.value * itemsPorPagina.value, tiendasFiltradas.value.length);
  return { inicio, fin, total: tiendasFiltradas.value.length };
});

// Propiedades computadas para el cronograma
const todasLasVisitas = computed(() => {
  const visitas = [];
  tiendas.value.forEach(tienda => {
    if (tienda.visitas && Array.isArray(tienda.visitas)) {
      tienda.visitas.forEach(visita => {
        visitas.push({
          ...visita,
          tienda: {
            id: tienda.id,
            nombre: tienda.nombre,
            marca: tienda.marca,
            tecnico: tienda.tecnico,
            categoria: tienda.categoria
          }
        });
      });
    }
  });
  return visitas.sort((a, b) => {
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return new Date(a.fecha) - new Date(b.fecha);
  });
});

const visitasProximas = computed(() => {
  const mesBase = new Date(mesVisualizadoCronograma.value);
  const inicioMes = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1);
  const finMes = new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 0);

  return todasLasVisitas.value.filter(visita => {
    if (!visita.fecha) return false;
    const fechaVisita = new Date(visita.fecha);
    return fechaVisita >= inicioMes && fechaVisita <= finMes;
  }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const visitasPorEstado = computed(() => {
  const estadisticas = {
    'Pendiente': 0,
    'En proceso': 0,
    'Realizada': 0
  };
  
  todasLasVisitas.value.forEach(visita => {
    if (estadisticas.hasOwnProperty(visita.estado)) {
      estadisticas[visita.estado]++;
    }
  });
  
  return estadisticas;
});

const calendarioProximo30Dias = computed(() => {
  const hoy = new Date();
  const mesBase = new Date(mesVisualizadoCronograma.value);
  const calendario = [];

  // Obtener el primer dÃ­a del mes visualizado
  const primerDiaMes = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1);

  // Retroceder al domingo anterior o el mismo dÃ­a si ya es domingo
  const primerDia = new Date(primerDiaMes);
  primerDia.setDate(primerDiaMes.getDate() - primerDiaMes.getDay());

  // FunciÃ³n para formatear fecha local (evita problemas de timezone)
  const formatearFechaLocal = (fecha) => {
    const aÃ±o = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${aÃ±o}-${mes}-${dia}`;
  };

  // Generar 35 dÃ­as (5 semanas) para tener un calendario completo
  for (let i = 0; i < 35; i++) {
    const fecha = new Date(primerDia);
    fecha.setDate(primerDia.getDate() + i);

    const fechaStr = formatearFechaLocal(fecha);
    const esHoy = fechaStr === formatearFechaLocal(hoy);

    // Buscar visitas para esta fecha
    const visitasDelDia = todasLasVisitas.value.filter(visita =>
      visita.fecha === fechaStr
    );

    calendario.push({
      fecha: fechaStr,
      dia: fecha.getDate(),
      esHoy,
      tieneVisitas: visitasDelDia.length > 0,
      visitas: visitasDelDia,
      esMesActual: fecha.getMonth() === mesBase.getMonth()
    });
  }

  return calendario;
});

// Propiedades computadas para mÃ©tricas de rendimiento
const metricasRendimiento = computed(() => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  
  // Servicios del mes actual
  const serviciosMesActual = tiendas.value.filter(tienda => {
    if (!tienda.mesServicio) return false;
    const [aÃ±o, mes] = tienda.mesServicio.split('-');
    const fechaServicio = new Date(parseInt(aÃ±o), parseInt(mes) - 1);
    return fechaServicio >= inicioMes && fechaServicio <= finMes;
  });
  
  // Visitas del mes actual
  const visitasMesActual = [];
  serviciosMesActual.forEach(tienda => {
    if (tienda.visitas) {
      tienda.visitas.forEach(visita => {
        if (visita.fecha) {
          const fechaVisita = new Date(visita.fecha);
          if (fechaVisita >= inicioMes && fechaVisita <= finMes) {
            visitasMesActual.push({...visita, tienda});
          }
        }
      });
    }
  });
  
  const visitasRealizadas = visitasMesActual.filter(v => v.estado === 'Realizada').length;
  const visitasPendientes = visitasMesActual.filter(v => v.estado === 'Pendiente').length;
  const visitasEnProceso = visitasMesActual.filter(v => v.estado === 'En proceso').length;
  const totalVisitas = visitasMesActual.length;
  
  const porcentajeCumplimiento = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
  
  // Ingresos del mes
  const ingresosMesActual = serviciosMesActual.reduce((total, tienda) => total + (tienda.costo || 0), 0);
  
  // Servicios por tÃ©cnico
  const serviciosPorTecnico = {};
  serviciosMesActual.forEach(tienda => {
    const tecnico = tienda.tecnico || 'Sin asignar';
    if (!serviciosPorTecnico[tecnico]) {
      serviciosPorTecnico[tecnico] = {
        servicios: 0,
        visitasRealizadas: 0,
        totalVisitas: 0,
        ingresos: 0
      };
    }
    serviciosPorTecnico[tecnico].servicios++;
    serviciosPorTecnico[tecnico].ingresos += tienda.costo || 0;
    
    if (tienda.visitas) {
      tienda.visitas.forEach(visita => {
        if (visita.fecha) {
          const fechaVisita = new Date(visita.fecha);
          if (fechaVisita >= inicioMes && fechaVisita <= finMes) {
            serviciosPorTecnico[tecnico].totalVisitas++;
            if (visita.estado === 'Realizada') {
              serviciosPorTecnico[tecnico].visitasRealizadas++;
            }
          }
        }
      });
    }
  });
  
  return {
    serviciosMesActual: serviciosMesActual.length,
    visitasRealizadas,
    visitasPendientes,
    visitasEnProceso,
    totalVisitas,
    porcentajeCumplimiento: Math.round(porcentajeCumplimiento),
    ingresosMesActual,
    serviciosPorTecnico
  };
});

// Datos para grÃ¡ficas de tendencias mensuales
const tendenciaMensual = computed(() => {
  const meses = [];
  const hoy = new Date();
  
  // Obtener datos de los Ãºltimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const aÃ±o = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const mesStr = `${aÃ±o}-${String(mes).padStart(2, '0')}`;
    
    const serviciosDelMes = tiendas.value.filter(tienda => tienda.mesServicio === mesStr);
    const visitasDelMes = [];
    
    serviciosDelMes.forEach(tienda => {
      if (tienda.visitas) {
        tienda.visitas.forEach(visita => {
          if (visita.fecha) {
            const fechaVisita = new Date(visita.fecha);
            if (fechaVisita.getFullYear() === aÃ±o && fechaVisita.getMonth() === mes - 1) {
              visitasDelMes.push(visita);
            }
          }
        });
      }
    });
    
    const visitasRealizadas = visitasDelMes.filter(v => v.estado === 'Realizada').length;
    const totalVisitas = visitasDelMes.length;
    const porcentaje = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
    const ingresos = serviciosDelMes.reduce((total, tienda) => total + (tienda.costo || 0), 0);
    
    meses.push({
      mes: fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      servicios: serviciosDelMes.length,
      visitasRealizadas,
      totalVisitas,
      cumplimiento: Math.round(porcentaje),
      ingresos
    });
  }
  
  return meses;
});

// Datos para grÃ¡fica de Chart.js - Cumplimiento mensual
const chartDataCumplimiento = computed(() => {
  return {
    labels: tendenciaMensual.value.map(m => m.mes),
    datasets: [
      {
        label: 'Cumplimiento (%)',
        data: tendenciaMensual.value.map(m => m.cumplimiento),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Servicios',
        data: tendenciaMensual.value.map(m => m.servicios),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
});

// Datos para grÃ¡fica de ingresos
const chartDataIngresos = computed(() => {
  return {
    labels: tendenciaMensual.value.map(m => m.mes),
    datasets: [
      {
        label: 'Ingresos (Q)',
        data: tendenciaMensual.value.map(m => m.ingresos),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 1)'
      }
    ]
  };
});

// GrÃ¡fico adaptado al tema oscuro
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

// Opciones del grÃ¡fico adaptadas al tema oscuro
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
      text: 'DistribuciÃ³n por Estado de Servicio',
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

// Opciones para grÃ¡ficas de rendimiento
const chartOptionsRendimiento = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          size: 11,
          family: "'Inter', 'Helvetica', 'Arial', sans-serif"
        },
        color: '#d1d5db'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#10b981',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value) {
          return value + '%';
        }
      },
      min: 0,
      max: 100
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
});

const chartOptionsIngresos = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#10b981',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: function(context) {
          return 'Q' + context.parsed.y.toLocaleString('es-GT', { minimumFractionDigits: 2 });
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      grid: {
        color: 'rgba(16, 185, 129, 0.1)'
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value) {
          return 'Q' + value.toLocaleString('es-GT');
        }
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
        case 'En proceso': return 'bg-orange-900/40 text-orange-300 border border-orange-600/50 shadow-sm';
        case 'Finalizado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

const getEstadoCobroClass = (estadoCobro) => {
     switch (estadoCobro) {
        case 'Pendiente': return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
        case 'ImpresiÃ³n ODS': return 'bg-yellow-900/40 text-yellow-300 border border-yellow-600/50 shadow-sm';
        case 'Proceso ODC': return 'bg-cyan-900/40 text-cyan-300 border border-cyan-600/50 shadow-sm';
        case 'FacturaciÃ³n': return 'bg-purple-900/40 text-purple-300 border border-purple-600/50 shadow-sm';
        case 'Pagado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

const getTipoPagoClass = (tipoPago) => {
    switch (tipoPago) {
        case 'Contado': return 'bg-green-900/40 text-green-300 border border-green-600/50 shadow-sm';
        case 'CrÃ©dito': return 'bg-indigo-900/40 text-indigo-300 border border-indigo-600/50 shadow-sm';
        default: return 'bg-gray-800/40 text-gray-600 border border-gray-600/50 shadow-sm';
    }
};

// Accesibilidad y contraste mejorado: badges con alta legibilidad
const getEstadoCobroClassV2 = (estadoCobro) => {
  switch (estadoCobro) {
    case 'Pendiente':
      return 'bg-[#051F20]/15 text-[#235347] border border-[#235347]/30';
    case 'Impresión ODS':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Proceso ODC':
      return 'bg-cyan-600 text-white';
    case 'Facturación':
      return 'bg-purple-600 text-white';
    case 'Pagado':
      return 'bg-green-600 text-white';
    default:
      return 'bg-[#051F20]/10 text-[#235347] border border-[#235347]/20';
  }
};

const getTipoPagoClassV2 = (tipoPago) => {
  switch (tipoPago) {
    case 'Contado':
      return 'bg-green-600 text-white';
    case 'Crédito':
      return 'bg-indigo-600 text-white';
    default:
      return 'bg-[#051F20]/10 text-[#235347] border border-[#235347]/20';
  }
};

// FunciÃ³n del original para colores de marca
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
  if (!db) {
    console.log('âš ï¸ Firebase no disponible, usando marcas por defecto');
    marcas.value = ["McDonald's", "Pizza Hut", "Kentucky", "Starbucks", "Dunkin Donuts", "Edificio Naguchi", "Pandas"].sort();
    return;
  }
  
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
  console.log('ðŸª Iniciando carga de tiendas...');
  
  if (!db) {
    console.log('âš ï¸ Firebase no disponible, saltando carga de tiendas');
    isLoading.value = false;
    return;
  }
  
  try {
    console.log('ðŸ“¡ Consultando colecciÃ³n de tiendas...');
    const q = query(collection(db, 'tiendas'), orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    
    console.log('ðŸ“Š Documentos encontrados:', snapshot.size);
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

    console.log('âœ… Tiendas cargadas exitosamente desde Firebase:', {
      total: tiendasTemp.length,
      meses: mesesDisponibles.value.length,
      marcas: Object.keys(marcasConteo).length
    });
    
    aplicarFiltros();

  } catch (error) {
    console.error("âŒ Error al cargar tiendas:", error);
    console.error("Detalles del error:", {
      message: error.message,
      stack: error.stack,
      db: !!db
    });
    alert("Error al cargar las tiendas. Revisa la consola para mÃ¡s detalles.");
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
  paginaActual.value = 1; // Reset a primera pÃ¡gina cuando se filtran los datos
};

const aplicarFiltrosConDebounce = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
  debounceTimeout.value = setTimeout(() => {
    aplicarFiltros();
  }, 300);
};

// Watcher para filtros con debounce en bÃºsqueda y directo en mes
watch(busqueda, aplicarFiltrosConDebounce);
watch(filtroMes, aplicarFiltros);

// Watcher para auto-llenar descripciÃ³n cuando cambia la categorÃ­a
watch(() => nuevaTienda.value.categoria, (nuevaCategoria) => {
  if (nuevaCategoria && descripcionesPorCategoria[nuevaCategoria]) {
    // Solo auto-llenar si la descripciÃ³n estÃ¡ vacÃ­a o es la descripciÃ³n por defecto de otra categorÃ­a
    const descripcionActual = nuevaTienda.value.descripcion?.trim() || '';
    const esDescripcionPorDefecto = Object.values(descripcionesPorCategoria).includes(descripcionActual);
    
    if (!descripcionActual || esDescripcionPorDefecto) {
      nuevaTienda.value.descripcion = descripcionesPorCategoria[nuevaCategoria];
    }
  }
});

// Watcher para manejar cambios en la cantidad de visitas
watch(() => nuevaTienda.value.cantidadVisitas, (nuevaCantidad, valorAnterior) => {
  if (nuevaCantidad !== valorAnterior && nuevaCantidad > 0) {
    actualizarVisitas(nuevaCantidad);
  }
}, { flush: 'post' });

// FunciÃ³n para actualizar el array de visitas segÃºn la cantidad
const actualizarVisitas = (cantidad) => {
  try {
    const cantidadNum = Number(cantidad);
    if (cantidadNum < 1 || cantidadNum > 5) return; // Validar rango
    
    const visitasActuales = nuevaTienda.value.visitas || [];
    
    if (cantidadNum > visitasActuales.length) {
      // Agregar nuevas visitas manteniendo las existentes
      const nuevasVisitas = [...visitasActuales];
      for (let i = visitasActuales.length; i < cantidadNum; i++) {
        nuevasVisitas.push({
          numero: i + 1,
          fecha: '',
          estado: 'Pendiente'
        });
      }
      nuevaTienda.value.visitas = nuevasVisitas;
    } else if (cantidadNum < visitasActuales.length) {
      // Reducir visitas manteniendo las primeras
      nuevaTienda.value.visitas = visitasActuales.slice(0, cantidadNum);
    }
    
    // Asegurar que los nÃºmeros de visita sean correctos
    nuevaTienda.value.visitas.forEach((visita, index) => {
      visita.numero = index + 1;
    });
  } catch (error) {
    console.error('Error actualizando visitas:', error);
    // En caso de error, mantener el estado actual
  }
};

// FunciÃ³n para cambiar el estado de una visita
const cambiarEstadoVisita = (indiceVisita, nuevoEstado) => {
  if (nuevaTienda.value.visitas && nuevaTienda.value.visitas[indiceVisita]) {
    nuevaTienda.value.visitas[indiceVisita].estado = nuevoEstado;
  }
};

// FunciÃ³n para obtener el color de estado de visita
const getEstadoVisitaClass = (estado) => {
  switch (estado) {
    case 'Pendiente':
      return 'bg-[#051F20]/15 text-[#235347] border border-[#235347]/30';
    case 'En proceso':
      return 'bg-orange-600 text-white';
    case 'Realizada':
      return 'bg-green-600 text-white';
    default:
      return 'bg-[#051F20]/10 text-[#235347] border border-[#235347]/20';
  }
};

// Generar opciones de meses (Ãºltimos 12 meses + prÃ³ximos 6)
const generarOpcionesMeses = () => {
  const opciones = [];
  const hoy = new Date();
  
  // Agregar 6 meses hacia atrÃ¡s
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const valor = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const texto = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    opciones.push({ valor, texto });
  }
  
  // Agregar prÃ³ximos 6 meses
  for (let i = 1; i <= 6; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const valor = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const texto = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    opciones.push({ valor, texto });
  }
  
  opcionesMeses.value = opciones;
};

// Funciones de paginaciÃ³n
const irAPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina;
  }
};

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
};

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++;
  }
};

// Funciones para pestaÃ±as
const cambiarPestana = (pestanaId) => {
  pestanaActiva.value = pestanaId;
};

// FunciÃ³n para formatear fecha en espaÃ±ol
const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  try {
    // Parsear la fecha como local para evitar problemas de timezone
    const [aÃ±o, mes, dia] = fecha.split('-').map(Number);
    const fechaObj = new Date(aÃ±o, mes - 1, dia);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return fecha;
  }
};

// FunciÃ³n para formatear fecha corta
const formatearFechaCorta = (fecha) => {
  if (!fecha) return 'Sin fecha';
  try {
    // Parsear la fecha como local para evitar problemas de timezone
    const [aÃ±o, mes, dia] = fecha.split('-').map(Number);
    const fechaObj = new Date(aÃ±o, mes - 1, dia);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fecha;
  }
};

// FunciÃ³n para obtener dÃ­as desde/hasta una fecha
const diasDesdeHoy = (fecha) => {
  if (!fecha) return null;
  
  // Crear fechas sin tiempo para evitar problemas de timezone
  const hoy = new Date();
  const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  
  // Parsear la fecha de visita como local
  const [aÃ±o, mes, dia] = fecha.split('-').map(Number);
  const fechaVisitaLocal = new Date(aÃ±o, mes - 1, dia);
  
  const diferencia = Math.ceil((fechaVisitaLocal - hoyLocal) / (1000 * 60 * 60 * 24));
  return diferencia;
};

// Funciones para cambio rÃ¡pido de estado
const toggleEstadoDropdown = (visitaKey) => {
  estadoDropdownAbierto.value = estadoDropdownAbierto.value === visitaKey ? null : visitaKey;
};

const cambiarEstadoVisitaRapido = async (visita, nuevoEstado) => {
  try {
    // Encontrar la tienda que contiene esta visita
    const tienda = tiendas.value.find(t => t.id === visita.tienda.id);
    if (!tienda) {
      console.error('Tienda no encontrada');
      return;
    }

    // Encontrar la visita especÃ­fica y actualizar su estado
    const visitaIndex = tienda.visitas.findIndex(v => 
      v.numero === visita.numero && v.fecha === visita.fecha
    );
    
    if (visitaIndex === -1) {
      console.error('Visita no encontrada');
      return;
    }

    // Actualizar el estado localmente
    tienda.visitas[visitaIndex].estado = nuevoEstado;
    
    // Actualizar en Firebase
    const tiendaRef = doc(db, 'tiendas', tienda.id);
    await updateDoc(tiendaRef, {
      visitas: tienda.visitas,
      fechaActualizacion: serverTimestamp()
    });

    // Cerrar dropdown
    estadoDropdownAbierto.value = null;
    
    // Mostrar notificaciÃ³n de Ã©xito
    console.log(`Estado cambiado a: ${nuevoEstado}`);
    
    // Actualizar las listas computadas
    await cargarTiendas();
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    // AquÃ­ podrÃ­as agregar una notificaciÃ³n toast de error
  }
};

// Cerrar dropdown al hacer click fuera
const cerrarDropdownEstado = () => {
  estadoDropdownAbierto.value = null;
};

// Funciones del modal
const abrirModal = (tienda = null) => {
  if (tienda) {
    modoEdicion.value = true;
    tiendaSeleccionada.value = tienda;
    
    // Inicializar con estructura base
    const datosLimpios = tiendaVacia();
    
    // Copiar campos bÃ¡sicos sin sobreescribir la estructura de visitas
    datosLimpios.nombre = tienda.nombre || '';
    datosLimpios.marca = tienda.marca || '';
    datosLimpios.tecnico = tienda.tecnico || '';
    datosLimpios.costo = tienda.costo || 500;
    datosLimpios.estado = tienda.estado || 'Pendiente';
    datosLimpios.estadoCobro = tienda.estadoCobro || 'Pendiente';
    datosLimpios.tipoPago = tienda.tipoPago || 'CrÃ©dito';
    datosLimpios.diasCredito = tienda.diasCredito || 30;
    datosLimpios.mesServicio = tienda.mesServicio || '';
    datosLimpios.ods = tienda.ods || '';
    datosLimpios.categoria = tienda.categoria || '';
    datosLimpios.descripcion = tienda.descripcion || '';
    datosLimpios.numeroFactura = tienda.numeroFactura || '';
    // Manejar fechaFacturacion con soporte para mock y real Timestamp
    if (tienda.fechaFacturacion && typeof tienda.fechaFacturacion === 'object') {
      if (tienda.fechaFacturacion.toDate) {
        datosLimpios.fechaFacturacion = tienda.fechaFacturacion.toDate().toISOString().split('T')[0];
      } else if (tienda.fechaFacturacion.seconds) {
        datosLimpios.fechaFacturacion = new Date(tienda.fechaFacturacion.seconds * 1000).toISOString().split('T')[0];
      } else {
        datosLimpios.fechaFacturacion = tienda.fechaFacturacion || '';
      }
    } else {
      datosLimpios.fechaFacturacion = tienda.fechaFacturacion || '';
    }
    
    // Manejar visitas con validaciÃ³n robusta
    try {
      if (tienda.visitas && Array.isArray(tienda.visitas) && tienda.visitas.length > 0) {
        // Validar que las visitas tengan la estructura correcta
        const visitasValidas = tienda.visitas.filter(visita => 
          visita && typeof visita === 'object'
        );
        
        if (visitasValidas.length > 0) {
          datosLimpios.cantidadVisitas = visitasValidas.length;
          datosLimpios.visitas = visitasValidas.map((visita, index) => ({
            numero: visita.numero || (index + 1),
            fecha: visita.fecha || '',
            estado: visita.estado || 'Pendiente'
          }));
        } else {
          // Las visitas existen pero no son vÃ¡lidas, crear una por defecto
          datosLimpios.cantidadVisitas = 1;
          datosLimpios.visitas = [{
            numero: 1,
            fecha: '',
            estado: 'Pendiente'
          }];
        }
      } else if (tienda.cantidadVisitas && tienda.cantidadVisitas > 0) {
        // Manejar caso donde existe cantidadVisitas pero no el array de visitas
        const cantidad = Math.min(tienda.cantidadVisitas, 5); // MÃ¡ximo 5 visitas
        datosLimpios.cantidadVisitas = cantidad;
        datosLimpios.visitas = Array.from({ length: cantidad }, (_, index) => ({
          numero: index + 1,
          fecha: '',
          estado: 'Pendiente'
        }));
      } else {
        // No hay informaciÃ³n de visitas, crear una por defecto
        datosLimpios.cantidadVisitas = 1;
        datosLimpios.visitas = [{
          numero: 1,
          fecha: '',
          estado: 'Pendiente'
        }];
      }
    } catch (error) {
      console.error('Error procesando visitas de tienda:', error);
      // En caso de error, establecer valores por defecto
      datosLimpios.cantidadVisitas = 1;
      datosLimpios.visitas = [{
        numero: 1,
        fecha: '',
        estado: 'Pendiente'
      }];
    }
    
    nuevaTienda.value = datosLimpios;
  } else {
    // Modo crear nueva tienda
    modoEdicion.value = false;
    tiendaSeleccionada.value = null;
    nuevaTienda.value = tiendaVacia();
    // Establecer el mes actual como valor por defecto
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    nuevaTienda.value.mesServicio = mesActual;
  }
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

// Funciones de navegaciÃ³n de mes para cronograma
const mesAnterior = () => {
  const nuevaFecha = new Date(mesVisualizadoCronograma.value);
  nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
  mesVisualizadoCronograma.value = nuevaFecha;
};

const mesSiguiente = () => {
  const nuevaFecha = new Date(mesVisualizadoCronograma.value);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
  mesVisualizadoCronograma.value = nuevaFecha;
};

const volverMesActual = () => {
  mesVisualizadoCronograma.value = new Date();
};

const nombreMesVisualizando = computed(() => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fecha = new Date(mesVisualizadoCronograma.value);
  return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
});

const guardarTienda = async () => {
  try {
    const form = nuevaTienda.value;
    
    // Validaciones bÃ¡sicas
    if (!form.nombre || !form.nombre.trim()) {
      alert('El nombre de la tienda es requerido.');
      return;
    }
    
    if (!form.marca) {
      alert('La marca es requerida.');
      return;
    }
    
    if (!form.categoria) {
      alert('La categorÃ­a es requerida.');
      return;
    }
    
    if (!form.mesServicio) {
      alert('El mes de servicio es requerido.');
      return;
    }
    
    // Validar visitas
    const visitas = form.visitas || [];
    const visitasInvalidas = visitas.filter(visita => 
      (visita.estado === 'En proceso' || visita.estado === 'Realizada') && !visita.fecha
    );
    
    if (visitasInvalidas.length > 0) {
      alert('Por favor, asigna fechas a todas las visitas que estÃ¡n en proceso o realizadas.');
      return;
    }
    
    // Limpiar y validar visitas antes de guardar
    const visitasLimpias = visitas.map((visita, index) => ({
      numero: index + 1,
      fecha: visita.fecha || '',
      estado: visita.estado || 'Pendiente'
    }));
    
    const datosAGuardar = {
      nombre: form.nombre.trim(),
      marca: form.marca,
      tecnico: form.tecnico?.trim() || null,
      costo: Number(form.costo) || 0,
      estado: form.estado || 'Pendiente',
      estadoCobro: form.estadoCobro || 'Pendiente',
      tipoPago: form.tipoPago || 'CrÃ©dito',
      diasCredito: form.tipoPago === 'CrÃ©dito' ? (Number(form.diasCredito) || 0) : null,
      mesServicio: form.mesServicio,
      ods: form.ods?.trim() || null,
      categoria: form.categoria,
      descripcion: form.descripcion?.trim() || null,
      cantidadVisitas: Number(form.cantidadVisitas) || 1,
      visitas: visitasLimpias
    };

    // Guardar en Firebase
    if (modoEdicion.value && tiendaSeleccionada.value?.id) {
      const tiendaRef = doc(db, 'tiendas', tiendaSeleccionada.value.id);
      await updateDoc(tiendaRef, datosAGuardar);

      // Registrar en bitÃ¡cora
      if (currentUser.value) {
        await registrarBitacora(
          currentUser.value.id,
          currentUser.value.nombre,
          'actualizar_tienda',
          `Tienda actualizada: ${form.nombre} - ${form.marca}`,
          { tienda: form.nombre, marca: form.marca, estado: form.estado }
        );
      }

      alert("Tienda actualizada con Ã©xito.");
    } else {
      const tiendaConFecha = {
        ...datosAGuardar,
        fechaCreacion: serverTimestamp()
      };
      await addDoc(collection(db, 'tiendas'), tiendaConFecha);

      // Registrar en bitÃ¡cora
      if (currentUser.value) {
        await registrarBitacora(
          currentUser.value.id,
          currentUser.value.nombre,
          'crear_tienda',
          `Nueva tienda: ${form.nombre} - ${form.marca}`,
          { tienda: form.nombre, marca: form.marca, categoria: form.categoria }
        );
      }

      alert("Tienda creada con Ã©xito.");
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
    const tiendaInfo = `${tiendaSeleccionada.value.nombre} - ${tiendaSeleccionada.value.marca}`;
    const tiendaRef = doc(db, 'tiendas', tiendaSeleccionada.value.id);
    await deleteDoc(tiendaRef);

    // Registrar en bitÃ¡cora
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'eliminar_tienda',
        `Tienda eliminada: ${tiendaInfo}`,
        { tienda: tiendaSeleccionada.value.nombre, marca: tiendaSeleccionada.value.marca }
      );
    }

    alert("Tienda eliminada con Ã©xito.");
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
  console.log("ðŸª Tiendas.vue Montado - Iniciando carga de datos...");
  console.log("Estado de db:", !!db);
  
  try {
    generarOpcionesMeses();
    console.log("ðŸ·ï¸ Cargando marcas...");
    await cargarMarcas();
    console.log("ðŸª Cargando tiendas...");
    await cargarTiendas();
    console.log("âœ… Carga inicial completada");
  } catch (error) {
    console.error("âŒ Error en la carga inicial:", error);
  }

  // Agregar event listener para cerrar dropdown al hacer click fuera
  document.addEventListener('click', (event) => {
    const dropdown = event.target.closest('.relative.group');
    if (!dropdown) {
      estadoDropdownAbierto.value = null;
    }
  });
});

</script>


<style scoped>
/* === PREMIUM TIENDAS STYLES === */
.tiendas-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: #ffffff;
  min-height: 100vh;
}

/* Premium Glass Card Effect */
.glass-card-premium {
  background: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow:
    0 4px 24px rgba(5, 31, 32, 0.06),
    0 1px 4px rgba(212, 175, 55, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card-premium:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 40px rgba(5, 31, 32, 0.1),
    0 4px 12px rgba(212, 175, 55, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  border-color: rgba(212, 175, 55, 0.3);
}

/* Premium Tab Navigation */
.tab-navigation {
  background: linear-gradient(135deg, #051f20 0%, #0d4344 100%);
  border-radius: 16px 16px 0 0;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(5, 31, 32, 0.15);
}

.tab-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #f4c542, #d4af37, #f4c542, transparent);
  opacity: 0.8;
}

.tab-button {
  position: relative;
  padding: 1rem 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  font-size: 0.95rem;
}

.tab-button::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #f4c542, #d4af37, #f4c542);
  transform: translateX(-50%);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(244, 197, 66, 0.5);
}

.tab-button:hover {
  color: #ffffff;
  background: rgba(244, 197, 66, 0.12);
}

.tab-button-active {
  color: #f4c542;
  background: rgba(244, 197, 66, 0.18);
  box-shadow: inset 0 2px 8px rgba(244, 197, 66, 0.25);
}

.tab-button-active::before {
  width: 80%;
}

/* Premium Stats Cards */
.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem;
  border: 2px solid rgba(244, 197, 66, 0.15);
  box-shadow: 0 4px 20px rgba(5, 31, 32, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f4c542, #d4af37, #f4c542);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow:
    0 12px 40px rgba(5, 31, 32, 0.15),
    0 0 0 2px rgba(244, 197, 66, 0.3);
  border-color: rgba(244, 197, 66, 0.4);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f4c542 0%, #d4af37 100%);
  box-shadow: 0 6px 20px rgba(244, 197, 66, 0.4);
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: rotate(-8deg) scale(1.12);
  box-shadow: 0 8px 28px rgba(244, 197, 66, 0.5);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #051f20 0%, #0d4344 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.stat-label {
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (min-width: 769px) {
  .tiendas-container {
    padding: 2rem;
  }
}

/* === IMPROVED RESPONSIVE === */
@media (max-width: 768px) {
  .tiendas-container {
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
  
  .glass-card-premium, .professional-card {
    padding: 1.25rem !important;
    min-height: auto;
    margin-bottom: 1rem !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .grid {
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
  
  .btn, .btn-gold, .tech-btn {
    min-height: 44px !important;
    padding: 0.75rem 1rem !important;
    font-size: 0.85rem !important;
  }
  
  /* Tab navigation responsivo */
  .flex.border-b.border-gray-300 {
    overflow-x: auto !important;
    scrollbar-width: thin;
  }
  
  .flex.border-b.border-gray-300::-webkit-scrollbar {
    height: 4px;
  }
  
  .flex.border-b.border-gray-300::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.3);
    border-radius: 2px;
  }
}

@media (max-width: 480px) {
  .tiendas-container {
    padding: 0.5rem !important;
  }
  
  .glass-card-premium,
  .professional-card {
    padding: 1rem !important;
    margin-bottom: 0.75rem;
  }
  
  .stat-value {
    font-size: 1.125rem !important;
  }
  
  .stat-icon {
    width: 40px !important;
    height: 40px !important;
  }
  
  /* PestaÃ±as mÃ¡s compactas en mÃ³vil */
  .flex.border-b.border-gray-300 button {
    min-width: auto !important;
    padding: 0.5rem 0.75rem !important;
    font-size: 0.75rem !important;
  }
}

/* === BETTER TOUCH TARGETS === */
@media (hover: none) and (pointer: coarse) {
  .btn, .btn-gold, .tech-btn, .btn-secondary {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 0.75rem 1.25rem !important;
  }
  
  .mobile-menu-btn {
    min-height: 48px !important;
    min-width: 48px !important;
  }
  
  /* Remove hover effects on touch devices */
  .glass-card-premium:hover,
  .professional-card:hover,
  .stat-item:hover {
    transform: none !important;
  }
  
  /* Improve tab touch targets */
  .flex.border-b.border-gray-300 button {
    min-height: 48px !important;
  }
}

/* === MODAL STYLES === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  overflow-y: auto;
  padding: 1rem;
}

.modal-wrapper {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.modal-content {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.modal-icon {
  background: #d4af37;
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-form {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #051f20;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-section-title svg {
  color: #d4af37;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #051f20;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-label-sm {
  font-size: 0.85rem;
  font-weight: 600;
  color: #051f20;
  margin-bottom: 0.4rem;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

.form-input,
.form-input-sm,
select.form-input,
select.form-input-sm,
textarea.form-input,
textarea.form-input-sm,
input[type="date"].form-input,
input[type="date"].form-input-sm,
input[type="number"].form-input,
input[type="number"].form-input-sm,
input[type="text"].form-input,
input[type="text"].form-input-sm {
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: white !important;
  color: #051f20 !important;
  pointer-events: auto !important;
  cursor: text !important;
}

.form-input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.form-input-sm {
  padding: 0.625rem 0.875rem;
  font-size: 0.9rem;
  border-radius: 8px;
}

.form-input:focus,
.form-input-sm:focus,
select.form-input:focus,
select.form-input-sm:focus,
input[type="date"].form-input:focus,
input[type="date"].form-input-sm:focus {
  outline: none !important;
  border-color: #d4af37 !important;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
}

.form-input::placeholder,
.form-input-sm::placeholder {
  color: #9ca3af;
}

/* Asegurar que los inputs de fecha sean interactivos */
input[type="date"].form-input,
input[type="date"].form-input-sm,
.date-picker-input {
  cursor: pointer !important;
  position: relative;
}

/* Estilo mejorado para el Ã­cono del calendario */
input[type="date"].form-input::-webkit-calendar-picker-indicator,
input[type="date"].form-input-sm::-webkit-calendar-picker-indicator,
.date-picker-input::-webkit-calendar-picker-indicator {
  cursor: pointer !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-left: 0.5rem;
  filter: brightness(0) saturate(100%) invert(58%) sepia(83%) saturate(401%) hue-rotate(11deg) brightness(94%) contrast(90%);
}

input[type="date"].form-input::-webkit-calendar-picker-indicator:hover,
input[type="date"].form-input-sm::-webkit-calendar-picker-indicator:hover,
.date-picker-input::-webkit-calendar-picker-indicator:hover {
  transform: scale(1.1);
}

/* Hacer el calendario mÃ¡s visible */
input[type="date"].form-input::-webkit-datetime-edit,
input[type="date"].form-input-sm::-webkit-datetime-edit,
.date-picker-input::-webkit-datetime-edit {
  padding: 0;
  color: #051f20 !important;
  font-size: inherit;
}

input[type="date"].form-input::-webkit-datetime-edit-text,
input[type="date"].form-input-sm::-webkit-datetime-edit-text,
.date-picker-input::-webkit-datetime-edit-text {
  color: #051f20;
  padding: 0 0.25rem;
}

input[type="date"].form-input::-webkit-datetime-edit-month-field,
input[type="date"].form-input::-webkit-datetime-edit-day-field,
input[type="date"].form-input::-webkit-datetime-edit-year-field,
input[type="date"].form-input-sm::-webkit-datetime-edit-month-field,
input[type="date"].form-input-sm::-webkit-datetime-edit-day-field,
input[type="date"].form-input-sm::-webkit-datetime-edit-year-field,
.date-picker-input::-webkit-datetime-edit-month-field,
.date-picker-input::-webkit-datetime-edit-day-field,
.date-picker-input::-webkit-datetime-edit-year-field {
  color: #051f20 !important;
  padding: 0 0.125rem;
  font-weight: 500;
}

select.form-input,
select.form-input-sm {
  cursor: pointer !important;
}

/* Date Input Wrapper */
.date-input-wrapper {
  position: relative;
  width: 100%;
}

.date-input-wrapper input[type="date"] {
  width: 100%;
  padding-right: 2.5rem !important;
}

/* Visitas Section */
.visitas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.visita-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.visita-card:hover {
  border-color: #d4af37;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
  z-index: 2;
}

.visita-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.visita-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #051f20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.visita-number {
  background: #d4af37;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-weight: 700;
}

.visita-status {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
}

.visita-fields {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.visitas-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.summary-dot.bg-gray {
  background: #6b7280;
}

.summary-dot.bg-orange {
  background: #f97316;
}

.summary-dot.bg-green {
  background: #10b981;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f3f4f6;
  background: #fafafa;
  flex-shrink: 0;
}

.btn-modal-cancel {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modal-cancel:hover {
  background: #f9fafb;
  border-color: #d4af37;
  color: #d4af37;
}

.btn-modal-submit {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #d4af37 0%, #c4a137 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-modal-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}

/* === CALENDAR TOOLTIP STYLES === */
.calendar-day-cell {
  position: relative;
}

.calendar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: 0;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.calendar-day-cell:hover .calendar-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-12px);
  pointer-events: auto;
}

/* Flecha del tooltip */
.calendar-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #d4af37;
}

.tooltip-header {
  background: rgba(212, 175, 55, 0.1);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px 10px 0 0;
  text-align: center;
}

.tooltip-content {
  padding: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.tooltip-visita {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.2s ease;
}

.tooltip-visita:last-child {
  margin-bottom: 0;
}

.tooltip-visita:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(212, 175, 55, 0.4);
  transform: translateX(2px);
}

.tooltip-visita-numero {
  width: 24px;
  height: 24px;
  background: #d4af37;
  color: #051f20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.tooltip-visita-nombre {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.tooltip-visita-marca {
  font-size: 0.75rem;
  color: #d4af37;
  margin-top: 0.125rem;
}

.tooltip-visita-estado {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.tooltip-visita-estado.status-pendiente {
  background: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.tooltip-visita-estado.status-proceso {
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
  border: 1px solid rgba(251, 146, 60, 0.3);
}

.tooltip-visita-estado.status-realizada {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.tooltip-visita-tecnico {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 0.75rem;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Scrollbar personalizado para el tooltip */
.tooltip-content::-webkit-scrollbar {
  width: 4px;
}

.tooltip-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.tooltip-content::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 2px;
}

.tooltip-content::-webkit-scrollbar-thumb:hover {
  background: #e4bf47;
}

/* Responsive Modal */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-wrapper {
    padding: 0;
    align-items: flex-start;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-form {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .visitas-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
    padding: 1.25rem 1.5rem;
  }

  .btn-modal-cancel,
  .btn-modal-submit {
    width: 100%;
  }
}

/* === PREMIUM BUTTONS === */
.btn-gold,
.btn-primary-premium {
  position: relative;
  padding: 0.875rem 1.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
  background: linear-gradient(135deg, #f4c542 0%, #d4af37 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 6px 20px rgba(244, 197, 66, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.btn-gold::before,
.btn-primary-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.btn-gold:hover,
.btn-primary-premium:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(135deg, #ffd54f 0%, #f4c542 100%);
  box-shadow:
    0 10px 30px rgba(244, 197, 66, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.btn-gold:hover::before,
.btn-primary-premium:hover::before {
  left: 100%;
}

.btn-gold:active,
.btn-primary-premium:active {
  transform: translateY(-1px) scale(1.01);
}

/* Premium Secondary Button */
.btn-secondary-premium {
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #051f20;
  background: white;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(5, 31, 32, 0.08);
}

.btn-secondary-premium:hover {
  border-color: #d4af37;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.1) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
}

/* === PREMIUM TABLES === */
.premium-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.premium-table thead tr {
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
}

.premium-table thead th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #d4af37;
}

.premium-table thead th:first-child {
  border-radius: 12px 0 0 0;
}

.premium-table thead th:last-child {
  border-radius: 0 12px 0 0;
}

.premium-table tbody tr {
  background: white;
  transition: all 0.3s ease;
}

.premium-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.03) 0%, rgba(212, 175, 55, 0.05) 100%);
  transform: scale(1.005);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.1);
}

.premium-table tbody td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(5, 31, 32, 0.08);
  font-size: 0.9rem;
  color: #051f20;
}

.premium-table tbody tr:last-child td:first-child {
  border-radius: 0 0 0 12px;
}

.premium-table tbody tr:last-child td:last-child {
  border-radius: 0 0 12px 0;
}

/* === PREMIUM BADGES === */
.badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.badge-premium.badge-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.2) 100%);
  color: #059669;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-premium.badge-warning {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0.2) 100%);
  color: #ea580c;
  border: 1px solid rgba(251, 146, 60, 0.3);
}

.badge-premium.badge-danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.2) 100%);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-premium.badge-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.2) 100%);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-premium:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* === PREMIUM SEARCH & FILTERS === */
.search-input-premium {
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid rgba(5, 31, 32, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: inset 0 2px 4px rgba(5, 31, 32, 0.05);
}

.search-input-premium:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow:
    inset 0 2px 4px rgba(5, 31, 32, 0.05),
    0 0 0 3px rgba(212, 175, 55, 0.1);
}

.search-icon-premium {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

/* === PREMIUM SECTION HEADERS === */
.section-header-premium {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(5, 31, 32, 0.03) 0%, rgba(10, 51, 52, 0.05) 100%);
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px 16px 0 0;
}

.section-title-premium {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-icon-premium {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d4af37 0%, #c4a137 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* === ANIMATIONS === */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(to right, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%);
  background-size: 1000px 100%;
}

@keyframes pulse-gold {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(212, 175, 55, 0);
  }
}

.pulse-gold {
  animation: pulse-gold 2s infinite;
}
</style>
