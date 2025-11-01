<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 text-gray-200">

    <div class="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-emerald-500/20 rounded-lg shadow-lg shadow-emerald-500/10 mb-8 py-4 px-6 transform transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20">
      <h2 class="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 glow-emerald mb-2 text-center">Registro de Tiendas</h2>
      <p class="text-emerald-100/70 text-center text-sm md:text-base">Gestiona y controla tus tiendas y servicios</p>
    </div>

    <div v-if="resumenPorMarca.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold text-emerald-300 mb-4">Resumen por Marca</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(marcaResumen, index) in resumenPorMarca" :key="index"
             class="glass-card border-l-4 transition-all duration-300 hover:shadow-md"
             :class="[`border-${getBrandColor(marcaResumen.nombre)}-500`, `hover:shadow-${getBrandColor(marcaResumen.nombre)}-500/10`]">
          <h4 class="font-bold text-lg text-gray-100 mb-1">{{ marcaResumen.nombre }}</h4>
          <p class="text-sm text-gray-400">Tiendas: <span class="font-medium text-gray-200">{{ marcaResumen.conteo }}</span></p>
          <p class="text-sm text-gray-400">Ingresos Totales: <span class="font-medium text-gray-200">Q{{ (marcaResumen.ingresos || 0).toFixed(2) }}</span></p>
        </div>
      </div>
    </div>

    <div class="glass-container rounded-xl shadow-xl border border-gray-700/30 mb-10 overflow-hidden">
      <div class="bg-gray-900/60 border-b border-emerald-500/15 px-6 py-4">
        <h3 class="text-lg font-semibold text-emerald-400">
          {{ modoEdicion ? 'Editar Tienda' : 'Nueva Tienda' }}
        </h3>
      </div>

      <form @submit.prevent="modoEdicion ? actualizarTienda() : guardarTienda()" class="p-6">
        <div class="md:col-span-3 mb-6" v-if="modoEdicion">
            <div class="bg-yellow-900/30 border-l-4 border-amber-500 p-4 rounded"> <div class="flex"> <div class="flex-shrink-0"><svg class="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></div> <div class="ml-3"><p class="text-amber-300 font-medium">Estás editando la tienda <span class="font-bold text-amber-200">{{ tiendaSeleccionada.nombre }}</span></p></div> </div> </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div class="md:col-span-3 form-section">
            <h4 class="form-section-title">
                <svg class="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Información de la Tienda
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="relative"> <label class="label-form">Nombre de la tienda</label> <input v-model="nueva.nombre" type="text" placeholder="Nombre de tienda" class="input-primary" required /> </div>
              <div class="relative"> <label class="label-form">Marca</label> <select v-model="nueva.marca" class="input-primary select-input" required> <option disabled value="" class="text-gray-500 option-dark">Seleccionar Marca</option> <option v-for="(marca, i) in marcas" :key="i" class="option-dark">{{ marca }}</option> </select> </div>
              <div class="relative"> <label class="label-form">Técnico</label> <input v-model="nueva.tecnico" type="text" placeholder="Técnico" class="input-primary" /> </div>
              <div class="relative"> <label class="label-form">No. ODS</label> <input v-model="nueva.ods" type="text" placeholder="No. ODS" class="input-primary" /> </div>

              <div class="relative">
                <label class="label-form">Categoría</label>
                <select v-model="nueva.categoria" class="input-primary select-input" required>
                  <option disabled value="" class="text-gray-500 option-dark">-- Selecciona una categoría --</option>
                  <option v-for="(cat, index) in categoriasDisponibles" :key="index" :value="cat" class="option-dark">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div class="relative"> <label class="label-form">Mes de Servicio</label> <input v-model="nueva.mesServicio" type="month" class="input-primary month-input" required /> </div>
              <div class="relative md:col-span-3"> <label class="label-form">Descripción del Servicio</label> <textarea v-model="nueva.descripcion" placeholder="Detalles del servicio a realizar..." class="input-primary" rows="2"></textarea> </div>
            </div>
          </div>

          <div class="md:col-span-3 form-section mt-2">
              <h4 class="form-section-title">
                  <svg class="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Programación y Estado de Visitas
              </h4>
              <div class="bg-gray-700/20 rounded-lg p-4 border border-cyan-500/10">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div class="relative">
                      <label class="label-form">Número de visitas</label>
                      <select v-model.number="nueva.numVisitas" class="input-primary select-input" required> <option :value="1" class="option-dark">1 visita</option>
                          <option :value="2" class="option-dark">2 visitas</option>
                      </select>
                  </div>

                  <div class="relative">
                      <label class="label-form">Primera visita</label>
                      <input v-model="nueva.fechaPrimeraVisita" type="date" class="input-primary date-input" :class="{'border-red-500 !bg-red-900/20 focus:!ring-red-500': !validarPrimeraVisita() && nueva.fechaPrimeraVisita}" />
                      <span v-if="!validarPrimeraVisita() && nueva.fechaPrimeraVisita" class="error-message">1ros 15 días</span>
                  </div>

                  <div class="relative" :class="{ 'opacity-50': !nueva.fechaPrimeraVisita }">
                      <label class="label-form">Estado Visita 1</label>
                      <select v-model="nueva.estadoPrimeraVisita" class="input-primary select-input" :disabled="!nueva.fechaPrimeraVisita">
                          <option value="Programada" class="option-dark">Programada</option>
                          <option value="Realizada" class="option-dark">Realizada</option>
                          <option value="Cancelada" class="option-dark">Cancelada</option>
                      </select>
                  </div>

                  <template v-if="nueva.numVisitas == 2">
                      <div class="relative md:col-start-2">
                          <label class="label-form">Segunda visita</label>
                          <input v-model="nueva.fechaSegundaVisita" type="date" class="input-primary date-input" :class="{'border-red-500 !bg-red-900/20 focus:!ring-red-500': !validarSegundaVisita() && nueva.fechaSegundaVisita}" />
                          <span v-if="!validarSegundaVisita() && nueva.fechaSegundaVisita" class="error-message">Después del día 15</span>
                      </div>
                      <div class="relative" :class="{ 'opacity-50': !nueva.fechaSegundaVisita }">
                          <label class="label-form">Estado Visita 2</label>
                          <select v-model="nueva.estadoSegundaVisita" class="input-primary select-input" :disabled="!nueva.fechaSegundaVisita">
                              <option value="Programada" class="option-dark">Programada</option>
                              <option value="Realizada" class="option-dark">Realizada</option>
                              <option value="Cancelada" class="option-dark">Cancelada</option>
                          </select>
                      </div>
                  </template>
                </div>
              </div>
          </div>

          <div class="md:col-span-3 form-section mt-2">
            <h4 class="form-section-title">
                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Proceso Administrativo
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="relative"> <label class="label-form">Costo (Q)</label> <input v-model.number="nueva.costo" type="number" placeholder="0.00" step="0.01" class="input-primary" required /> </div>
              <div class="relative"> <label class="label-form">Tipo de pago</label> <select v-model="nueva.tipoPago" class="input-primary select-input" required> <option value="Contado" class="option-dark">Contado</option> <option value="Crédito" class="option-dark">Crédito</option> </select> </div>
              <div class="relative"> <label class="label-form">Días de crédito</label> <input v-model.number="nueva.diasCredito" type="number" placeholder="0" class="input-primary" :disabled="nueva.tipoPago !== 'Crédito'" /> </div>
              <div class="relative">
                <label class="label-form">Estado del Proceso</label>
                <select v-model="nueva.estadoProceso" class="input-primary select-input" required>
                  <option value="Pendiente" class="option-dark">Pendiente</option>
                  <option value="En proceso de ODS" class="option-dark">En proceso de ODS</option>
                  <option value="En COVA" class="option-dark">En COVA</option>
                  <option value="Facturado" class="option-dark">Facturado</option>
                  <option value="Pagado" class="option-dark">Pagado</option>
                </select>
              </div>
            </div>
          </div>

          <div class="md:col-span-3 mt-6 pt-4 border-t border-gray-700/50">
              <div class="flex flex-col sm:flex-row gap-3">
                  <button type="submit" class="btn-primary flex-1 tech-btn relative overflow-hidden" :disabled="!formularioValido || cargando">
                      <span class="z-10 relative flex items-center justify-center">
                          <svg v-if="!cargando" class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path v-if="modoEdicion" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg v-if="cargando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Tienda' : 'Guardar Tienda') }}
                      </span>
                      <span class="tech-btn-bg absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-emerald-400/0 opacity-0 transition-opacity duration-300"></span>
                  </button>
                  <button v-if="modoEdicion" @click.prevent="cancelarEdicion()" type="button" class="btn-secondary flex-1">
                      <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Cancelar
                  </button>
              </div>
          </div>

          <div v-if="!formularioValido && formEnviado" class="md:col-span-3 alert-danger mt-4">
              <div class="flex">
                  <div class="flex-shrink-0"><svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></div>
                  <div class="ml-3">
                      <h3 class="font-medium text-red-300">Por favor corrige los siguientes errores:</h3>
                      <ul class="mt-2 list-disc list-inside text-sm text-red-400">
                          <li v-if="!nueva.nombre">Nombre requerido</li>
                          <li v-if="!nueva.marca">Marca requerida</li>
                          <li v-if="!nueva.categoria">Categoría requerida</li> <li v-if="!nueva.costo || nueva.costo <= 0">Costo requerido y debe ser mayor a 0</li>
                          <li v-if="nueva.fechaPrimeraVisita && !validarPrimeraVisita()">Fecha 1ra visita inválida (primeros 15 días)</li>
                          <li v-if="nueva.fechaSegundaVisita && !validarSegundaVisita()">Fecha 2da visita inválida (después del día 15)</li>
                          <li v-if="!nueva.mesServicio">Mes servicio requerido</li>
                          <li v-if="!nueva.tipoPago">Tipo de pago requerido</li>
                          <li v-if="!nueva.estadoProceso">Estado del proceso requerido</li>
                          </ul>
                  </div>
              </div>
          </div>
        </div>
      </form>
    </div>

    <div class="glass-container rounded-xl shadow-lg border border-gray-700/30 p-4 mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-3">
                <div class="relative flex-grow min-w-[200px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg></div>
                    <input v-model="busqueda" type="text" placeholder="Buscar tienda..." class="input-primary pl-10 pr-10 w-full" />
                    <button v-if="busqueda" @click="busqueda = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
                </div>
                <div class="relative flex-grow min-w-[200px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg></div>
                    <select v-model="filtroMes" class="input-primary select-input pl-10 pr-8 w-full">
                        <option value="" class="option-dark text-gray-500">Todos los meses</option>
                        <option v-for="(mes, index) in mesesDisponibles" :key="index" :value="mes" class="option-dark">{{ formatearMes(mes) }}</option>
                    </select>
                    <button v-if="filtroMes" @click="filtroMes = ''" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg></button>
                </div>
                <button @click="abrirModalCalendario" title="Ver calendario de visitas del mes seleccionado" class="btn-secondary px-3 py-2 flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="ml-1 hidden sm:inline">Calendario</span>
                </button>
            </div>
            <div class="w-full md:w-auto md:flex md:justify-center mt-3 md:mt-0">
                <button @click="abrirModalMarcas" class="btn-secondary w-full md:w-auto">
                    <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    Administrar Marcas
                </button>
            </div>
        </div>
    </div>

    <div class="flex justify-between items-center mb-3">
        <div class="text-sm text-gray-400">
            <span class="font-medium text-gray-200">{{ tiendasFiltradas.length }}</span> {{ tiendasFiltradas.length === 1 ? 'tienda encontrada' : 'tiendas encontradas' }}
            <span v-if="busqueda || filtroMes">
                {{ busqueda ? `con búsqueda "${busqueda}"` : '' }}
                {{ busqueda && filtroMes ? ' y ' : '' }}
                {{ filtroMes ? `en ${formatearMes(filtroMes)}` : '' }}
            </span>
        </div>
        <button @click="exportarDatos" class="btn-link">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Exportar
        </button>
    </div>

    <div class="glass-container rounded-xl shadow-lg border border-gray-700/30 overflow-hidden mb-10 relative">
      <div v-if="cargando" class="loading-overlay">
        <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="ml-2 text-gray-200">Cargando...</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900/70 backdrop-blur-sm">
            <tr>
              <th class="th-table">Tienda</th>
              <th class="th-table">Marca</th>
              <th class="th-table">ODS</th>
              <th class="th-table hidden md:table-cell">Mes Servicio</th>
              <th class="th-table hidden lg:table-cell">Costo</th>
              <th class="th-table hidden lg:table-cell">Tipo Pago</th>
              <th class="th-table hidden lg:table-cell">Días Cred.</th>
              <th class="th-table hidden md:table-cell">Estado Proc.</th>
              <th class="th-table hidden md:table-cell">Est. V1</th>
              <th class="th-table hidden md:table-cell">Est. V2</th>
              <th class="th-table">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700/50">
            <tr v-for="(tienda, i) in tiendasFiltradas" :key="tienda.id || i" class="hover:bg-gray-700/40 transition-colors duration-150">
              <td class="td-table"> <div class="font-medium text-gray-100 hover:text-emerald-300 transition-colors">{{ tienda.nombre }}</div> </td>
              <td class="td-table"> <span class="badge-gray">{{ tienda.marca }}</span> </td>
              <td class="td-table"> {{ tienda.ods || '-' }} </td>
              <td class="td-table hidden md:table-cell"> {{ formatearMes(tienda.mesServicio) }} </td>
              <td class="td-table hidden lg:table-cell"> Q{{ (tienda.costo || 0).toFixed(2) }} </td>
              <td class="td-table hidden lg:table-cell"> <span class="badge" :class="{'text-emerald-400': tienda.tipoPago === 'Contado', 'text-cyan-400': tienda.tipoPago === 'Crédito'}">{{ tienda.tipoPago }}</span> </td>
              <td class="td-table hidden lg:table-cell"> {{ tienda.tipoPago === 'Crédito' ? (tienda.diasCredito || 0) : '-' }} </td>
              <td class="td-table hidden md:table-cell"> <span class="badge" :class="getProcessStatusColor(tienda.estadoProceso)">{{ tienda.estadoProceso }}</span> </td>
              <td class="td-table hidden md:table-cell text-center"> <span :class="getVisitStatusColor(tienda.estadoPrimeraVisita)" class="status-dot" :title="tienda.estadoPrimeraVisita || 'N/A'"></span> </td>
              <td class="td-table hidden md:table-cell text-center"> <span v-if="tienda.numVisitas == 2" :class="getVisitStatusColor(tienda.estadoSegundaVisita)" class="status-dot" :title="tienda.estadoSegundaVisita || 'N/A'"></span> <span v-else>-</span> </td>
              <td class="td-table">
                <div class="flex space-x-1">
                    <button @click="editarTienda(tienda)" class="btn-icon text-amber-400 hover:text-amber-300"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Editar</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                    <button @click="confirmarEliminar(tienda)" class="btn-icon text-red-500 hover:text-red-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Eliminar</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    <button @click="verDetalles(tienda)" class="btn-icon text-cyan-400 hover:text-cyan-300"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><title>Ver Detalles</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr v-if="tiendasFiltradas.length === 0 && !cargando">
              <td colspan="11" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center space-y-3"><svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-gray-500 text-lg">No se encontraron tiendas</p><p class="text-gray-600 text-sm">{{ busqueda || filtroMes ? 'Prueba con otros criterios de búsqueda o filtro' : 'Aún no has añadido ninguna tienda' }}</p></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
        <div v-if="mostrarModalMarcas">
          <div class="modal-backdrop">
            <div class="modal-content max-w-md">
              <div class="modal-header"><h3 class="modal-title">Administrar Marcas</h3><button @click="cerrarModalMarcas" class="modal-close-btn" title="Cerrar">&times;</button></div>
              <div class="p-6"><p class="text-sm text-gray-400 mb-4">Añade o elimina marcas.</p><div class="flex gap-2 mb-4"><input v-model="nuevaMarca" @keyup.enter="agregarMarca" type="text" placeholder="Nueva marca" class="input-primary flex-1" /><button @click="agregarMarca" class="btn-primary tech-btn relative overflow-hidden"><span class="z-10 relative">Agregar</span><span class="tech-btn-bg absolute inset-0"></span></button></div><div class="modal-list-container"><ul class="divide-y divide-gray-700"><li v-for="(marca, i) in marcas" :key="i" class="modal-list-item"><span class="text-gray-200">{{ marca }}</span><button @click="eliminarMarca(i)" class="btn-icon text-gray-500 hover:text-red-500 hover:bg-gray-700/50" title="Eliminar marca"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></li><li v-if="marcas.length === 0" class="py-8 text-center text-gray-500"><svg class="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>No hay marcas definidas</li></ul></div></div>
              <div class="modal-footer"><button @click="cerrarModalMarcas" class="btn-primary tech-btn relative overflow-hidden"><span class="z-10 relative">Guardar Cambios y Cerrar</span><span class="tech-btn-bg absolute inset-0"></span></button></div>
            </div>
          </div>
        </div>
      </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarConfirmacion">
          <div class="modal-backdrop">
            <div class="modal-content max-w-md">
                <div class="modal-header"><h3 class="modal-title">Confirmar eliminación</h3><button @click="mostrarConfirmacion = false" class="modal-close-btn" title="Cerrar">&times;</button></div>
                <div class="p-6"><div class="alert-danger mb-4"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></div><div class="ml-3"><p class="text-sm font-medium text-red-300">¡Acción irreversible! Se eliminarán también los mantenimientos asociados.</p></div></div></div><p class="text-gray-300">¿Estás seguro que deseas eliminar la tienda <strong class="text-gray-100">{{ tiendaSeleccionada?.nombre || 'seleccionada' }}</strong>?</p></div>
                <div class="modal-footer gap-3"><button @click="mostrarConfirmacion = false" class="btn-secondary">Cancelar</button><button @click="eliminarTienda" class="btn-danger">Sí, eliminar permanentemente</button></div>
            </div>
          </div>
        </div>
      </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarDetalles" class="modal-backdrop">
          <div class="modal-content max-w-4xl max-h-[90vh] overflow-y-auto"
                :class="[`border-t-8 border-${getBrandColor(tiendaSeleccionada?.marca)}-500`]">
              <div class="modal-header"><h3 class="modal-title">{{ tiendaSeleccionada?.nombre || 'Detalles' }}</h3><button @click="mostrarDetalles = false" class="modal-close-btn" title="Cerrar">&times;</button></div>
              <div class="p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><div class="detail-card border-emerald-500"><h4 class="detail-card-title text-emerald-400"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>Información básica</h4><dl class="detail-dl"><dt>Marca:</dt><dd>{{ tiendaSeleccionada.marca || '-' }}</dd><dt>Técnico:</dt><dd>{{ tiendaSeleccionada.tecnico || '-' }}</dd><dt>ODS:</dt><dd>{{ tiendaSeleccionada.ods || '-' }}</dd><dt>Categoría:</dt><dd>{{ tiendaSeleccionada.categoria || '-' }}</dd><dt>Mes Servicio:</dt><dd>{{ formatearMes(tiendaSeleccionada.mesServicio) || '-' }}</dd><dt class="col-span-2">Descripción:</dt><dd class="col-span-2 whitespace-pre-wrap detail-description">{{ tiendaSeleccionada.descripcion || '-' }}</dd><dt>Creado:</dt><dd>{{ tiendaSeleccionada.fechaCreacion ? formatearFecha(tiendaSeleccionada.fechaCreacion, true) : '-' }}</dd></dl></div><div class="detail-card border-cyan-500"><h4 class="detail-card-title text-cyan-400"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Visitas programadas</h4><dl class="detail-dl"><dt>Visitas:</dt><dd>{{ tiendaSeleccionada.numVisitas || 1 }}</dd><dt>1ra Visita:</dt><dd>{{ tiendaSeleccionada.fechaPrimeraVisita ? formatearFecha(tiendaSeleccionada.fechaPrimeraVisita) : 'N/P' }}</dd><dt>Estado V1:</dt><dd><span class="badge" :class="getVisitStatusColor(tiendaSeleccionada.estadoPrimeraVisita, true)">{{ tiendaSeleccionada.estadoPrimeraVisita || 'N/A' }}</span></dd><template v-if="tiendaSeleccionada.numVisitas == 2"><dt>2da Visita:</dt><dd>{{ tiendaSeleccionada.fechaSegundaVisita ? formatearFecha(tiendaSeleccionada.fechaSegundaVisita) : 'N/P' }}</dd><dt>Estado V2:</dt><dd><span class="badge" :class="getVisitStatusColor(tiendaSeleccionada.estadoSegundaVisita, true)">{{ tiendaSeleccionada.estadoSegundaVisita || 'N/A' }}</span></dd></template></dl></div><div class="detail-card border-purple-500 md:col-span-2"><h4 class="detail-card-title text-purple-400"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Proceso Administrativo</h4><dl class="detail-dl md:grid-cols-4"><dt>Costo:</dt><dd class="font-semibold">Q{{ (tiendaSeleccionada.costo || 0).toFixed(2) }}</dd><dt>Tipo Pago:</dt><dd><span class="badge" :class="{'text-emerald-400': tiendaSeleccionada.tipoPago === 'Contado', 'text-cyan-400': tiendaSeleccionada.tipoPago === 'Crédito'}">{{ tiendaSeleccionada.tipoPago || '-' }}</span></dd><dt>Días Créd.:</dt><dd>{{ tiendaSeleccionada.tipoPago === 'Crédito' ? (tiendaSeleccionada.diasCredito || 0) : '-' }}</dd><dt>Estado Proc.:</dt><dd><span class="badge" :class="getProcessStatusColor(tiendaSeleccionada.estadoProceso)">{{ tiendaSeleccionada.estadoProceso || '-' }}</span></dd></dl></div></div><div class="modal-footer justify-between"><button @click="editarTiendaDesdeDetalles(tiendaSeleccionada)" class="btn-warning"> <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Editar Tienda </button><button @click="mostrarDetalles = false" class="btn-secondary">Cerrar</button></div></div>
          </div>
        </div>
      </Transition>

    <Transition name="modal-fade">
        <div v-if="mostrarModalCalendario" class="modal-backdrop">
            <div class="modal-content max-w-5xl max-h-[90vh]"> <div class="modal-header">
                    <h3 class="modal-title">Calendario de Visitas - {{ nombreMesCalendario }}</h3>
                    <button @click="mostrarModalCalendario = false" class="modal-close-btn" title="Cerrar">&times;</button>
                </div>
                <div class="p-4 md:p-6 overflow-y-auto">
                    <div v-if="diasDelMesCalendario.length > 0">
                        <div class="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <div>Dom</div> <div>Lun</div> <div>Mar</div> <div>Mié</div> <div>Jue</div> <div>Vie</div> <div>Sáb</div>
                        </div>
                        <div class="grid grid-cols-7 gap-1.5">
                            <div v-for="(dia, index) in diasDelMesCalendario" :key="index"
                                 class="calendar-day" :class="{
                                    'placeholder': dia.esPlaceholder,
                                    'today': dia.esHoy && !dia.esPlaceholder
                                 }">
                                <span class="day-number" :class="{'text-emerald-300 font-bold': dia.esHoy}">
                                    {{ dia.numero }}
                                </span>
                                <div v-if="!dia.esPlaceholder && dia.visitas && dia.visitas.length > 0" class="day-visits">
                                    <div v-for="(visita, vIndex) in dia.visitas.slice(0, 3)" :key="vIndex" class="visit-entry"
                                         :class="getVisitStatusBgColor(visita.estado, visita.tipo)"
                                         :title="`${visita.nombre} (${visita.tipo === 'primera' ? '1ra' : '2da'} - ${visita.estado})`"
                                         @click="verDetallesDesdeCalendario(visita.tiendaId)">
                                        <span class="truncate">{{ visita.nombre }}</span>
                                    </div>
                                    <div v-if="dia.visitas.length > 3" class="visit-more">
                                        + {{ dia.visitas.length - 3 }} más
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="calendar-legend">
                            <span><span class="legend-dot bg-cyan-600"></span>1ra Prog.</span>
                            <span><span class="legend-dot bg-cyan-400"></span>1ra Realiz.</span>
                            <span><span class="legend-dot bg-teal-600"></span>2da Prog.</span>
                            <span><span class="legend-dot bg-teal-400"></span>2da Realiz.</span>
                            <span><span class="legend-dot bg-red-500"></span>Cancelada</span>
                            <span><span class="legend-dot today-dot"></span>Hoy</span>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500 py-10">
                        Selecciona un mes con tiendas registradas para ver el calendario.
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="mostrarModalCalendario = false" class="btn-secondary">Cerrar</button>
                </div>
            </div>
        </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp, Timestamp, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase' // Asegúrate que la ruta sea correcta

// --- Referencias Reactivas ---
const tiendas = ref([])
const marcas = ref([])
const nuevaMarca = ref('')
const busqueda = ref('')
const filtroMes = ref('')
const mesesDisponibles = ref([])
const modoEdicion = ref(false)
const tiendaSeleccionada = ref(null)
const mostrarModalMarcas = ref(false)
const mostrarConfirmacion = ref(false)
const mostrarDetalles = ref(false)
const formEnviado = ref(false)
const cargando = ref(false)
const mostrarModalCalendario = ref(false)
const diasDelMesCalendario = ref([])
const nombreMesCalendario = ref('')

// --- LISTA DE CATEGORÍAS AÑADIDA ---
const categoriasDisponibles = ref([
  'Mant. Preventivo',
  'Venta de plantas',
  'Jardinizacion',
  'Reparacion de sistema riego',
  'Proyecto nuevo'
  // Puedes añadir más si necesitas
]);

// --- Objeto Tienda Vacia (con categoria inicializada) ---
const tiendaVacia = {
    nombre: '', marca: '', tecnico: '', ods: '',
    categoria: '', // Inicializado vacío para el select
    descripcion: '', mesServicio: '', numVisitas: 1,
    fechaPrimeraVisita: '', estadoPrimeraVisita: 'Programada',
    fechaSegundaVisita: '', estadoSegundaVisita: 'Programada', costo: null,
    tipoPago: 'Contado',
    diasCredito: 0,
    estadoProceso: 'Pendiente', fechaCreacion: null
}
const nueva = ref({ ...tiendaVacia })

// --- Colores de Marca ---
const brandColors = {
    "McDonald's": 'amber', "Pizza Hut": 'red', "Kentucky": 'red', "Starbucks": 'green',
    "Dunkin Donuts": 'pink', "Edificio Naguchi": 'gray', "Pandas": 'gray', 'DEFAULT': 'emerald'
};
const getBrandColor = (brandName) => {
    const normalizedBrand = brandName?.trim() || 'DEFAULT';
    const foundKey = Object.keys(brandColors).find(key => key !== 'DEFAULT' && normalizedBrand.toLowerCase().includes(key.toLowerCase()) );
    return brandColors[foundKey] || brandColors['DEFAULT'];
};

// --- Computed Properties (Cálculos derivados del estado) ---

const resumenPorMarca = computed(() => {
  const marcasResumen = {};
  tiendas.value.forEach(tienda => {
    const marca = (tienda.marca || 'Sin Marca/Cliente').trim();
    const costo = Number(tienda.costo) || 0;
    if (!marcasResumen[marca]) {
      marcasResumen[marca] = { nombre: marca, conteo: 0, ingresos: 0 };
    }
    marcasResumen[marca].conteo++;
    marcasResumen[marca].ingresos += costo;
  });
  return Object.values(marcasResumen).sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const tiendasFiltradas = computed(() => {
    let resultado = tiendas.value;
    if (busqueda.value) { const termino = busqueda.value.toLowerCase().trim(); if (termino) { resultado = resultado.filter(tienda => Object.values(tienda).some(val => String(val).toLowerCase().includes(termino))) } }
    if (filtroMes.value) { resultado = resultado.filter(tienda => tienda.mesServicio === filtroMes.value) }
    resultado.sort((a, b) => { const fechaA = a.fechaCreacion instanceof Timestamp ? a.fechaCreacion.toMillis() : 0; const fechaB = b.fechaCreacion instanceof Timestamp ? b.fechaCreacion.toMillis() : 0; return fechaB - fechaA; });
    return resultado
});

// --- VALIDACIÓN DE FORMULARIO ACTUALIZADA ---
const formularioValido = computed(() => {
    // Añadida validación para nueva.categoria
    if (!nueva.value.nombre || !nueva.value.marca || !nueva.value.categoria || !nueva.value.mesServicio || nueva.value.costo === null || nueva.value.costo <= 0 || !nueva.value.tipoPago || !nueva.value.estadoProceso) {
        return false
    }
    // Se removió la segunda condición !nueva.value.categoria ya que estaba incluida en la primera línea.
    if (nueva.value.fechaPrimeraVisita && !validarPrimeraVisita()) return false
    if (nueva.value.numVisitas == 2 && nueva.value.fechaSegundaVisita && !validarSegundaVisita()) return false
    return true
});


// --- Funciones de Utilidad ---
const validarPrimeraVisita = () => { if (!nueva.value.fechaPrimeraVisita) return true; try { const fecha = new Date(nueva.value.fechaPrimeraVisita + 'T00:00:00'); const dia = fecha.getDate(); return dia >= 1 && dia <= 15; } catch (e) { return false; } }
const validarSegundaVisita = () => { if (!nueva.value.fechaSegundaVisita) return true; try { const fecha = new Date(nueva.value.fechaSegundaVisita + 'T00:00:00'); const dia = fecha.getDate(); return dia > 15 && dia <= 31; } catch(e) { return false; } }
const formatearFecha = (fechaInput, incluirAno = false) => { if (!fechaInput) return ''; try { let fecha; if (fechaInput instanceof Timestamp) { fecha = fechaInput.toDate() } else if (fechaInput instanceof Date && !isNaN(fechaInput.getTime())) { fecha = fechaInput; } else if (typeof fechaInput === 'string' && fechaInput.includes('-')) { fecha = new Date(fechaInput + 'T00:00:00'); } else { return 'Fecha inválida'; } if (isNaN(fecha.getTime())) { return 'Fecha inválida'; } const opciones = incluirAno ? { day: '2-digit', month: '2-digit', year: 'numeric' } : { day: '2-digit', month: '2-digit' }; return fecha.toLocaleDateString('es-GT', opciones) } catch (e) { return 'Fecha inválida'; } }
const formatearMes = (mesStr) => { if (!mesStr || !mesStr.includes('-')) return ''; try { const [ano, mes] = mesStr.split('-'); const fecha = new Date(Number(ano), Number(mes) - 1, 1); if (isNaN(fecha.getTime())) { return mesStr; } let mesFormateado = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' }); return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1); } catch (e) { return mesStr; } }

// --- Funciones CRUD y otras ---
const cargarTiendas = async () => { cargando.value = true; tiendas.value = []; try { const snapshot = await getDocs(collection(db, 'tiendas')); const tiendasTemp = []; snapshot.forEach(doc => { tiendasTemp.push({ id: doc.id, ...doc.data() }) }); tiendas.value = tiendasTemp; actualizarMesesDisponibles(); } catch (error) { console.error("Error cargando tiendas:", error); } finally { cargando.value = false; } }
const actualizarMesesDisponibles = () => { const meses = new Set(); tiendas.value.forEach(tienda => { if (tienda.mesServicio) { meses.add(tienda.mesServicio) } }); mesesDisponibles.value = Array.from(meses).sort().reverse(); }
const cargarMarcas = async () => { cargando.value = true; try { const marcasDocRef = doc(db, 'configuracion', 'marcas'); const marcasDoc = await getDoc(marcasDocRef); if (marcasDoc.exists() && marcasDoc.data().lista) { marcas.value = marcasDoc.data().lista; } else { marcas.value = ["McDonald's", "Pizza Hut", "Kentucky", "Starbucks", "Dunkin Donuts", "Edificio Naguchi", "Pandas", "Cliente Varios", "Proyecto Interno"]; } marcas.value.sort((a, b) => a.localeCompare(b)); } catch (error) { console.error("Error cargando marcas:", error); } finally { cargando.value = false; } }
const guardarTienda = async () => { formEnviado.value = true; if (!formularioValido.value) return; cargando.value = true; try { const tiendaData = { ...nueva.value, fechaCreacion: serverTimestamp() }; delete tiendaData.id; Object.keys(tiendaData).forEach(key => { if (tiendaData[key] === '') tiendaData[key] = null; }); if (!tiendaData.fechaPrimeraVisita) tiendaData.estadoPrimeraVisita = null; if (!tiendaData.fechaSegundaVisita) tiendaData.estadoSegundaVisita = null; if (tiendaData.numVisitas != 2) { tiendaData.fechaSegundaVisita = null; tiendaData.estadoSegundaVisita = null; } if (tiendaData.tipoPago !== 'Crédito') tiendaData.diasCredito = 0; const docRef = await addDoc(collection(db, 'tiendas'), tiendaData); const mantenimiento = { tienda: tiendaData.nombre, tecnico: tiendaData.tecnico, fecha: tiendaData.mesServicio + "-01", numVisitas: tiendaData.numVisitas, fechaPrimeraVisita: tiendaData.fechaPrimeraVisita, estadoPrimeraVisita: tiendaData.estadoPrimeraVisita, fechaSegundaVisita: tiendaData.fechaSegundaVisita, estadoSegundaVisita: tiendaData.estadoSegundaVisita, fechaCreacion: serverTimestamp(), tiendaId: docRef.id }; await addDoc(collection(db, 'mantenimientos'), mantenimiento); await cargarTiendas(); nueva.value = { ...tiendaVacia }; formEnviado.value = false; } catch (error) { console.error("Error guardando tienda:", error); } finally { cargando.value = false; } }

// --- EDITAR TIENDA ACTUALIZADO ---
const editarTienda = (tienda) => {
    tiendaSeleccionada.value = { ...tienda };
    nueva.value = {
        id: tienda.id,
        nombre: tienda.nombre || tiendaVacia.nombre,
        marca: tienda.marca || tiendaVacia.marca,
        tecnico: tienda.tecnico || tiendaVacia.tecnico,
        ods: tienda.ods || tiendaVacia.ods,
        categoria: tienda.categoria || '', // Asegura que sea '' si no existe
        descripcion: tienda.descripcion || tiendaVacia.descripcion,
        mesServicio: tienda.mesServicio || tiendaVacia.mesServicio,
        numVisitas: tienda.numVisitas ?? tiendaVacia.numVisitas,
        fechaPrimeraVisita: tienda.fechaPrimeraVisita || tiendaVacia.fechaPrimeraVisita,
        estadoPrimeraVisita: tienda.estadoPrimeraVisita || tiendaVacia.estadoPrimeraVisita,
        fechaSegundaVisita: tienda.fechaSegundaVisita || tiendaVacia.fechaSegundaVisita,
        estadoSegundaVisita: tienda.estadoSegundaVisita || tiendaVacia.estadoSegundaVisita,
        costo: tienda.costo ?? tiendaVacia.costo,
        tipoPago: tienda.tipoPago || tiendaVacia.tipoPago,
        diasCredito: tienda.diasCredito ?? tiendaVacia.diasCredito,
        estadoProceso: tienda.estadoProceso || tiendaVacia.estadoProceso,
        fechaCreacion: tienda.fechaCreacion // Mantenemos la fecha original si existe
    };
    modoEdicion.value = true;
    mostrarDetalles.value = false;
    formEnviado.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const verDetalles = (tienda) => { tiendaSeleccionada.value = { ...tienda }; mostrarDetalles.value = true; }
const editarTiendaDesdeDetalles = (tienda) => { mostrarDetalles.value = false; editarTienda(tienda); }
const actualizarTienda = async () => { formEnviado.value = true; if (!formularioValido.value || !nueva.value.id) return; cargando.value = true; const tiendaId = nueva.value.id; try { const tiendaActualizada = { ...nueva.value }; delete tiendaActualizada.id; delete tiendaActualizada.fechaCreacion; Object.keys(tiendaActualizada).forEach(key => { if (tiendaActualizada[key] === '') tiendaActualizada[key] = null; }); if (!tiendaActualizada.fechaPrimeraVisita) tiendaActualizada.estadoPrimeraVisita = null; if (!tiendaActualizada.fechaSegundaVisita) tiendaActualizada.estadoSegundaVisita = null; if (tiendaActualizada.numVisitas != 2) { tiendaActualizada.fechaSegundaVisita = null; tiendaActualizada.estadoSegundaVisita = null; } if (tiendaActualizada.tipoPago !== 'Crédito') tiendaActualizada.diasCredito = 0; await updateDoc(doc(db, 'tiendas', tiendaId), tiendaActualizada); const qMantenimiento = query(collection(db, 'mantenimientos'), where("tiendaId", "==", tiendaId)); const mantenimientosSnapshot = await getDocs(qMantenimiento); for (const docSnapshot of mantenimientosSnapshot.docs) { await updateDoc(doc(db, 'mantenimientos', docSnapshot.id), { tienda: tiendaActualizada.nombre, tecnico: tiendaActualizada.tecnico, numVisitas: tiendaActualizada.numVisitas, fechaPrimeraVisita: tiendaActualizada.fechaPrimeraVisita, estadoPrimeraVisita: tiendaActualizada.estadoPrimeraVisita, fechaSegundaVisita: tiendaActualizada.fechaSegundaVisita, estadoSegundaVisita: tiendaActualizada.estadoSegundaVisita, }); } await cargarTiendas(); cancelarEdicion(); } catch (error) { console.error("Error actualizando tienda:", error); } finally { cargando.value = false; } }
const cancelarEdicion = () => { modoEdicion.value = false; tiendaSeleccionada.value = null; nueva.value = { ...tiendaVacia }; formEnviado.value = false; }
const confirmarEliminar = (tienda) => { tiendaSeleccionada.value = tienda; mostrarConfirmacion.value = true; }
const eliminarTienda = async () => { if (!tiendaSeleccionada.value?.id) return; cargando.value = true; mostrarConfirmacion.value = false; const tiendaId = tiendaSeleccionada.value.id; const tiendaNombre = tiendaSeleccionada.value.nombre; try { const qMantenimiento = query(collection(db, 'mantenimientos'), where("tiendaId", "==", tiendaId)); const mantenimientosSnapshot = await getDocs(qMantenimiento); const deletePromises = []; mantenimientosSnapshot.forEach((docSnapshot) => { deletePromises.push(deleteDoc(doc(db, 'mantenimientos', docSnapshot.id))); }); await Promise.all(deletePromises); await deleteDoc(doc(db, 'tiendas', tiendaId)); await cargarTiendas(); } catch (error) { console.error(`Error eliminando tienda ${tiendaNombre}:`, error); } finally { cargando.value = false; tiendaSeleccionada.value = null; } }
const abrirModalMarcas = () => { mostrarModalMarcas.value = true };
const cerrarModalMarcas = async () => { mostrarModalMarcas.value = false; cargando.value = true; try { const marcasOrdenadas = [...marcas.value].sort((a, b) => a.localeCompare(b)); await setDoc(doc(db, 'configuracion', 'marcas'), { lista: marcasOrdenadas }, { merge: true }); marcas.value = marcasOrdenadas; } catch (error) { console.error("Error guardando marcas:", error); } finally { cargando.value = false; } };
const agregarMarca = () => { const marcaTrimmed = nuevaMarca.value.trim(); if (!marcaTrimmed) return; const existe = marcas.value.some(m => m.toLowerCase() === marcaTrimmed.toLowerCase()); if (!existe) { marcas.value.push(marcaTrimmed); marcas.value.sort((a, b) => a.localeCompare(b)); nuevaMarca.value = ''; } };
const eliminarMarca = (index) => { marcas.value.splice(index, 1); };
const exportarDatos = () => { console.log("Exportando datos..."); alert("Funcionalidad de exportación aún no implementada."); };
const abrirModalCalendario = () => { const mesSeleccionado = filtroMes.value; if (!mesSeleccionado) { const hoy = new Date(); const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`; generarDatosCalendario(mesActual); } else { generarDatosCalendario(mesSeleccionado); } mostrarModalCalendario.value = true; }
const generarDatosCalendario = (mesCompleto) => { if (!mesCompleto || !/^\d{4}-\d{2}$/.test(mesCompleto)) { diasDelMesCalendario.value = []; nombreMesCalendario.value = "Mes inválido"; return; } try { const [year, month] = mesCompleto.split('-').map(Number); const monthIndex = month - 1; const fechaTitulo = new Date(year, monthIndex, 1); nombreMesCalendario.value = fechaTitulo.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()); const primerDiaDelMes = new Date(year, monthIndex, 1); const ultimoDiaDelMes = new Date(year, monthIndex + 1, 0); const numDiasMes = ultimoDiaDelMes.getDate(); const diaSemanaPrimerDia = primerDiaDelMes.getDay(); const diasArray = []; const hoy = new Date(); const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`; const diasPrevios = diaSemanaPrimerDia; const ultimoDiaMesAnterior = new Date(year, monthIndex, 0).getDate(); for (let i = diasPrevios - 1; i >= 0; i--) { diasArray.push({ numero: ultimoDiaMesAnterior - i, esPlaceholder: true, visitas: [] }); } const visitasPorDia = {}; tiendas.value.forEach(tienda => { if (tienda.mesServicio === mesCompleto) { if (tienda.fechaPrimeraVisita) { const fechaStr = tienda.fechaPrimeraVisita; if (!visitasPorDia[fechaStr]) visitasPorDia[fechaStr] = []; visitasPorDia[fechaStr].push({ nombre: tienda.nombre, tipo: 'primera', estado: tienda.estadoPrimeraVisita || 'Programada', tiendaId: tienda.id }); } if (tienda.numVisitas == 2 && tienda.fechaSegundaVisita) { const fechaStr = tienda.fechaSegundaVisita; if (!visitasPorDia[fechaStr]) visitasPorDia[fechaStr] = []; visitasPorDia[fechaStr].push({ nombre: tienda.nombre, tipo: 'segunda', estado: tienda.estadoSegundaVisita || 'Programada', tiendaId: tienda.id }); } } }); for (let dia = 1; dia <= numDiasMes; dia++) { const fechaCompletaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`; diasArray.push({ numero: dia, esPlaceholder: false, esHoy: fechaCompletaStr === hoyStr, fechaCompleta: fechaCompletaStr, visitas: visitasPorDia[fechaCompletaStr] || [] }); } const celdasRestantes = (7 - (diasArray.length % 7)) % 7; for (let i = 1; i <= celdasRestantes; i++) { diasArray.push({ numero: i, esPlaceholder: true, visitas: [] }); } while (diasArray.length < 35) { const nextPlaceholderNum = diasArray.filter(d => d.esPlaceholder && d.numero > 0).length + 1; diasArray.push({ numero: nextPlaceholderNum, esPlaceholder: true, visitas: [] }); } if (diasArray.length === 35 && (diaSemanaPrimerDia > 4 && numDiasMes > 29 || diaSemanaPrimerDia > 5 && numDiasMes > 28)) { for (let i = 1; i <= 7; i++) { const nextPlaceholderNum = diasArray.filter(d => d.esPlaceholder && d.numero > 0).length + 1; diasArray.push({ numero: nextPlaceholderNum, esPlaceholder: true, visitas: [] }); } } diasDelMesCalendario.value = diasArray; } catch (error) { console.error("Error generando calendario:", error); diasDelMesCalendario.value = []; nombreMesCalendario.value = "Error"; } }
const verDetallesDesdeCalendario = (tiendaId) => { const tienda = tiendas.value.find(t => t.id === tiendaId); if (tienda) { mostrarModalCalendario.value = false; verDetalles(tienda); } else { console.warn("Tienda no encontrada:", tiendaId); } }

// --- Helpers Visuales (Colores/Badges) ---
const getProcessStatusColor = (status) => { switch (status) { case 'En proceso de ODS': return 'text-yellow-400'; case 'En COVA': return 'text-cyan-400'; case 'Facturado': return 'text-green-400'; case 'Pagado': return 'text-emerald-400'; case 'Pendiente': default: return 'text-gray-400'; } }
const getVisitStatusColor = (status, isBadge = false) => { const baseClasses = isBadge ? 'badge ' : 'status-dot '; switch (status) { case 'Realizada': return baseClasses + (isBadge ? 'text-emerald-400' : 'bg-emerald-500'); case 'Cancelada': return baseClasses + (isBadge ? 'text-red-400' : 'bg-red-500'); case 'Programada': default: return baseClasses + (isBadge ? 'text-cyan-400' : 'bg-cyan-500'); } }
const getVisitStatusBgColor = (status, tipoVisita) => { switch (status) { case 'Realizada': return tipoVisita === 'primera' ? 'bg-cyan-400/80 hover:bg-cyan-300/80' : 'bg-teal-400/80 hover:bg-teal-300/80'; case 'Cancelada': return 'bg-red-500/80 hover:bg-red-400/80'; case 'Programada': default: return tipoVisita === 'primera' ? 'bg-cyan-600/80 hover:bg-cyan-500/80' : 'bg-teal-600/80 hover:bg-teal-500/80'; } }

// --- Hook onMounted ---
onMounted(async () => {
    console.log("Tiendas (con Categoria Select) montado.");
    await cargarMarcas();
    await cargarTiendas();
})

</script>

<style scoped>
/* --- Estilos Base con Efecto Glass y Refinamientos --- */

/* Contenedor Glass Genérico */
.glass-container {
  @apply bg-gray-800/70 backdrop-blur-lg; /* Ajusta transparencia y blur aquí */
}
.glass-card {
    @apply bg-gray-800/60 backdrop-blur-md rounded-lg shadow p-4; /* Para tarjetas de resumen */
}

/* Inputs y Textarea */
.input-primary {
  @apply w-full px-3 py-2 rounded-lg border border-gray-600/70 bg-gray-900/40 text-gray-200 placeholder-gray-500 /* Fondo más oscuro/transparente */
         focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500
         transition-all duration-150 text-sm shadow-inner shadow-black/30 /* Sombra interior más notable */
         disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed;
}
/* Estilo específico para selects para mejorar apariencia */
.select-input {
  @apply appearance-none bg-no-repeat bg-right pr-8;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Flecha gris más clara */
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}
.input-primary:focus.select-input {
   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2334d399' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); /* Flecha esmeralda en focus */
}
/* Estilo para las opciones del select */
.option-dark {
  @apply bg-gray-800 text-gray-200;
}

/* Estilos inputs fecha/mes */
.input-primary.date-input::-webkit-calendar-picker-indicator,
.input-primary.month-input::-webkit-calendar-picker-indicator {
    filter: invert(0.9) brightness(1.2); /* Icono más brillante */
    cursor: pointer;
}
.label-form { @apply block text-sm font-medium text-gray-400 mb-1.5; }
.error-message { @apply text-xs text-red-400 mt-1 absolute left-0 -bottom-5 whitespace-nowrap; }

/* Secciones del formulario */
.form-section { @apply md:col-span-3; }
.form-section-title { @apply text-lg font-semibold text-gray-300 mb-3 flex items-center border-b border-gray-700/50 pb-2; } /* Corregido text-md -> text-lg */

/* Botones (Sin cambios relevantes en esta versión) */
.btn-primary { @apply px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-secondary { @apply px-4 py-2 bg-gray-600/70 hover:bg-gray-500/70 border border-gray-500/50 text-gray-200 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center; }
.btn-warning { @apply px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 transition duration-150 ease-in-out flex items-center justify-center; }
.btn-danger { @apply px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition duration-150 ease-in-out flex items-center justify-center; }
.btn-link { @apply text-sm text-emerald-400 hover:text-emerald-300 hover:underline focus:outline-none focus:underline flex items-center; }
.btn-icon { @apply p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-emerald-400 transition duration-150 ease-in-out; }

/* Alerta refinada */
.alert-danger { @apply bg-red-900/40 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg shadow-md shadow-red-900/20; }
/* Overlay sin cambios */
.loading-overlay { @apply absolute inset-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl; }

/* Tabla refinada */
.th-table { @apply px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700; }
.td-table { @apply px-4 py-3 whitespace-nowrap text-sm text-gray-300; }
.badge { @apply px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap; } /* Ajuste ligero px */
.badge-gray { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600;}
.status-dot { @apply inline-block w-3 h-3 rounded-full align-middle shadow-sm; }

/* --- Estilos Modales con Glass --- */
.modal-backdrop { @apply fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out; }
.modal-content { @apply bg-gray-800/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-2xl shadow-black/40 w-full transform transition-all duration-300 ease-out mx-auto; }
.modal-header { @apply flex justify-between items-center p-4 border-b border-gray-700/50; }
.modal-title { @apply text-xl font-bold text-emerald-400 glow-emerald; }
.modal-close-btn { @apply text-gray-500 hover:text-emerald-400 text-3xl leading-none font-semibold p-1 -m-1 transition focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded-full; }
.modal-footer { @apply p-4 border-t border-gray-700/50 flex justify-end; }
.modal-list-container { @apply bg-gray-900/60 rounded-lg border border-gray-700/40 max-h-60 overflow-y-auto p-2 shadow-inner; }
.modal-list-item { @apply flex justify-between items-center py-2 px-3 hover:bg-gray-700/70 rounded-md transition-colors duration-150; }

/* --- Estilos Detalle Modal con Glass --- */
.detail-card { @apply bg-gray-900/60 backdrop-blur-md rounded-lg shadow-lg shadow-black/25 p-4 border-t-4 border-opacity-70; }
.detail-card-title { @apply text-lg font-semibold mb-3 flex items-center border-b pb-2 border-gray-700/60; }
.detail-dl { @apply grid grid-cols-2 gap-x-4 gap-y-3 text-sm; }
.detail-dl dt { @apply text-gray-500 font-medium; }
.detail-dl dd { @apply text-gray-200; }
.detail-description { @apply bg-gray-800/70 p-2 rounded border border-gray-700/50 text-xs text-gray-300; }


/* --- Estilos Calendario Mejorado --- */
.calendar-day {
  @apply border border-gray-700/60 rounded-md p-1.5 min-h-[110px] flex flex-col text-xs transition-colors duration-150 relative;
  @apply bg-gray-800/50;
}
.calendar-day.placeholder {
  @apply bg-gray-800/20 text-gray-700 opacity-70;
}
.calendar-day.today {
  /* CORRECCIÓN AQUÍ: Eliminado '!' antes de bg-emerald-900/30 */
  @apply bg-emerald-900/30 border-emerald-500/50;
}
.day-number {
  @apply font-semibold mb-1 text-right mr-1 text-gray-400;
}
.day-visits {
  @apply mt-1 space-y-1 overflow-hidden flex-grow;
}
.visit-entry {
  @apply p-1 rounded text-white text-[10px] leading-tight truncate cursor-pointer transition-all duration-150 ease-in-out flex items-center gap-1 shadow-sm;
}
.visit-more {
  @apply text-center text-gray-500 text-[9px] mt-1 font-medium;
}
.calendar-legend {
  @apply mt-4 flex justify-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 items-center;
}
.legend-dot {
  @apply inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle shadow-sm;
}
.today-dot {
    @apply ring-1 ring-offset-1 ring-offset-gray-800 ring-emerald-400;
}


/* --- Transiciones Modal --- */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content { transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02); }
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content { transform: scale(0.95) translateY(-10px); opacity: 0; }


/* --- Estilo Botón Tech --- */
.tech-btn:hover .tech-btn-bg { opacity: 0.2; }
.tech-btn-bg { background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%); }

/* --- Glow effect --- */
.glow-emerald {
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.5), 0 0 16px rgba(16, 185, 129, 0.4);
}

/* --- Clases dinámicas para evitar purga (Tailwind) --- */
/* Es importante mantener estas clases si Tailwind purga CSS no utilizado, para asegurar que los colores dinámicos funcionen */
.border-amber-500 {} .border-red-500 {} .border-green-500 {} .border-pink-500 {} .border-gray-500 {} .border-blue-500 {} .border-black {} .border-indigo-500 {} .border-purple-500 {} .border-cyan-500 {} .border-emerald-500 {}
.hover\:shadow-amber-500\/10 {} .hover\:shadow-red-500\/10 {} .hover\:shadow-green-500\/10 {} .hover\:shadow-pink-500\/10 {} .hover\:shadow-gray-500\/10 {} .hover\:shadow-blue-500\/10 {} .hover\:shadow-black\/10 {} .hover\:shadow-indigo-500\/10 {} .hover\:shadow-purple-500\/10 {} .hover\:shadow-cyan-500\/10 {} .hover\:shadow-emerald-500\/10 {}
.text-yellow-400 {} .text-cyan-400 {} .text-green-400 {} .text-emerald-400 {} .text-gray-400 {} .text-red-400 {}
.bg-emerald-500 {} .bg-red-500 {} .bg-cyan-500 {}
.bg-cyan-400\/80 {} .bg-teal-400\/80 {} .bg-red-500\/80 {} .bg-cyan-600\/80 {} .bg-teal-600\/80 {}
.hover\:bg-cyan-300\/80 {} .hover\:bg-teal-300\/80 {} .hover\:bg-red-400\/80 {} .hover\:bg-cyan-500\/80 {} .hover\:bg-teal-500\/80 {}
.border-red-500 {} .focus\:\!ring-red-500 {} .\!bg-red-900\/20 {}
.border-t-8 {}
.border-emerald-500\/50 {} .bg-emerald-900\/30 {} .text-emerald-300 {}

</style>