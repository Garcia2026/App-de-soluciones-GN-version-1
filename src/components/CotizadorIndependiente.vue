<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navigation Header -->
    <nav class="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 shadow-lg sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div>
            <h1 class="text-2xl font-bold">Sistema de Cotizaciones</h1>
            <p class="text-emerald-200 text-sm">Jardinización & Paisajismo</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="exportarDatos" class="bg-emerald-800 hover:bg-emerald-900 px-3 py-2 rounded-lg text-white text-sm transition-colors">
            Exportar
          </button>
          <router-link to="/dashboard" class="bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-400 text-sm font-medium">Borradores</p>
              <p class="text-2xl font-bold text-white">{{ contarPorEstado('borrador') }}</p>
            </div>
            <div class="bg-yellow-500/20 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-400 text-sm font-medium">Enviadas</p>
              <p class="text-2xl font-bold text-white">{{ contarPorEstado('enviada') }}</p>
            </div>
            <div class="bg-blue-500/20 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-400 text-sm font-medium">Aceptadas</p>
              <p class="text-2xl font-bold text-white">{{ contarPorEstado('aceptada') }}</p>
            </div>
            <div class="bg-green-500/20 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-400 text-sm font-medium">Total Valor</p>
              <p class="text-2xl font-bold text-white">Q{{ totalValorCotizaciones.toFixed(2) }}</p>
            </div>
            <div class="bg-emerald-500/20 p-3 rounded-lg">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- Formulario Principal -->
        <div class="xl:col-span-3">
          <div class="bg-gray-800 rounded-xl shadow-lg p-6">
            <!-- Tabs de Estado -->
            <div class="flex space-x-1 mb-6 bg-gray-700 p-1 rounded-lg">
              <button 
                v-for="estado in ['borrador', 'enviada', 'aceptada', 'rechazada']"
                :key="estado"
                @click="cambiarVista(estado)"
                :class="{
                  'bg-emerald-600 text-white': vistaActual === estado,
                  'text-gray-400 hover:text-white': vistaActual !== estado
                }"
                class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize"
              >
                {{ estado }} ({{ contarPorEstado(estado) }})
              </button>
            </div>

            <!-- Vista Lista -->
            <div v-if="vistaActual !== 'nueva'" class="space-y-4">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-white capitalize">Cotizaciones {{ vistaActual }}s</h2>
                <button 
                  @click="nuevaCotizacion"
                  class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Nueva Cotización
                </button>
              </div>

              <!-- Lista de Cotizaciones -->
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <div 
                  v-for="cot in cotizacionesPorEstado[vistaActual]" 
                  :key="cot.id"
                  class="bg-gray-700 p-4 rounded-lg border-l-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  :class="{
                    'border-yellow-500': cot.estado === 'borrador',
                    'border-blue-500': cot.estado === 'enviada',
                    'border-green-500': cot.estado === 'aceptada',
                    'border-red-500': cot.estado === 'rechazada'
                  }"
                  @click="editarCotizacion(cot)"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-semibold text-white">{{ cot.cliente }}</h3>
                      <p class="text-sm text-gray-400">{{ cot.contacto }}</p>
                      <p class="text-xs text-gray-500"># {{ cot.numero }}</p>
                    </div>
                    <div class="text-right">
                      <span :class="{
                        'text-yellow-400': cot.estado === 'borrador',
                        'text-blue-400': cot.estado === 'enviada',
                        'text-green-400': cot.estado === 'aceptada',
                        'text-red-400': cot.estado === 'rechazada'
                      }" class="text-xs font-semibold uppercase">
                        {{ cot.estado }}
                      </span>
                      <p class="text-emerald-400 font-bold">Q{{ (cot.total || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-400">
                    <span>{{ formatearFecha(cot.fecha) }}</span>
                    <span>{{ cot.productos?.length || 0 }} productos</span>
                  </div>
                </div>

                <div v-if="cotizacionesPorEstado[vistaActual].length === 0" class="text-center py-8 text-gray-400">
                  <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p>No hay cotizaciones {{ vistaActual }}s</p>
                  <button 
                    @click="nuevaCotizacion"
                    class="mt-2 text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Crear primera cotización
                  </button>
                </div>
              </div>
            </div>

            <!-- Vista Formulario -->
            <div v-else>
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-white">
                  {{ cotizacionActual.id ? 'Editar Cotización' : 'Nueva Cotización' }}
                </h2>
                <button 
                  @click="volverALista"
                  class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Volver a Lista
                </button>
              </div>

              <!-- Formulario de Cotización -->
              <form @submit.prevent="guardarCotizacion" class="space-y-6">
                <!-- Información Básica -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Cliente *</label>
                    <input 
                      v-model="cotizacionActual.cliente" 
                      type="text" 
                      required
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ej: McDonald's Salamá"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Contacto</label>
                    <input 
                      v-model="cotizacionActual.contacto" 
                      type="text" 
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="Alan García"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                    <input 
                      v-model="cotizacionActual.telefono" 
                      type="text" 
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="3512-5327"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Fecha *</label>
                    <input 
                      v-model="cotizacionActual.fecha" 
                      type="date" 
                      required
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Validez (días)</label>
                    <input 
                      v-model="cotizacionActual.validez" 
                      type="number" 
                      min="1" 
                      max="365"
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="15"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Servicio</label>
                    <select
                      v-model="cotizacionActual.tipoServicio"
                      class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="jardinizacion">Jardinización</option>
                      <option value="paisajismo">Paisajismo</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="integral">Proyecto Integral</option>
                      <option value="danos-en-obra">Daños en Obra</option>
                    </select>
                  </div>
                </div>

                <!-- Estado y Número -->
                <div class="bg-gray-700 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-sm text-gray-300">Estado:</span>
                      <span :class="{
                        'text-yellow-400': cotizacionActual.estado === 'borrador',
                        'text-blue-400': cotizacionActual.estado === 'enviada',
                        'text-green-400': cotizacionActual.estado === 'aceptada',
                        'text-red-400': cotizacionActual.estado === 'rechazada'
                      }" class="ml-2 font-semibold uppercase">
                        {{ cotizacionActual.estado }}
                      </span>
                    </div>
                    <div v-if="cotizacionActual.numero" class="text-sm text-gray-400">
                      # {{ cotizacionActual.numero }}
                    </div>
                  </div>
                </div>

                <!-- Productos y Servicios -->
                <div>
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-emerald-400">Productos y Servicios</h3>
                    <div class="flex gap-2">
                      <select 
                        v-model="productoSeleccionado" 
                        @change="agregarProductoComun" 
                        class="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                      >
                        <option value="">+ Producto Común</option>
                        <option v-for="producto in productosComunes" :key="producto.descripcion" :value="producto">
                          {{ producto.descripcion }} - Q{{ producto.precio }}
                        </option>
                      </select>
                      <button 
                        type="button"
                        @click="agregarProductoVacio"
                        class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                      >
                        + Personalizado
                      </button>
                    </div>
                  </div>
                  
                  <!-- Lista de Productos -->
                  <div class="space-y-3">
                    <div 
                      v-for="(producto, index) in cotizacionActual.productos" 
                      :key="index" 
                      class="grid grid-cols-12 gap-2 items-center bg-gray-700 p-3 rounded-lg"
                    >
                      <div class="col-span-1">
                        <input 
                          v-model="producto.cantidad" 
                          type="number" 
                          min="1"
                          class="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          placeholder="1"
                        >
                      </div>
                      <div class="col-span-6">
                        <input 
                          v-model="producto.descripcion" 
                          type="text" 
                          class="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          placeholder="Descripción del producto/servicio"
                        >
                      </div>
                      <div class="col-span-2">
                        <input 
                          v-model="producto.precioUnitario" 
                          type="number" 
                          step="0.01"
                          min="0"
                          class="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          placeholder="0.00"
                        >
                      </div>
                      <div class="col-span-2">
                        <span class="text-emerald-400 font-semibold text-sm">Q{{ ((producto.cantidad || 0) * (producto.precioUnitario || 0)).toFixed(2) }}</span>
                      </div>
                      <div class="col-span-1 text-right">
                        <button 
                          type="button"
                          @click="eliminarProducto(index)" 
                          class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="cotizacionActual.productos.length === 0" class="text-center py-4 text-gray-400">
                    No hay productos agregados
                  </div>
                </div>

                <!-- Servicios Incluidos -->
                <div>
                  <h3 class="text-lg font-semibold text-emerald-400 mb-3">Servicios Incluidos</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label v-for="servicio in serviciosDisponibles" :key="servicio" class="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        v-model="cotizacionActual.serviciosIncluidos" 
                        :value="servicio"
                        class="text-emerald-500 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                      >
                      <span class="text-gray-300 text-sm">{{ servicio }}</span>
                    </label>
                  </div>
                </div>

                <!-- Condiciones -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Condiciones Generales</label>
                  <textarea 
                    v-model="cotizacionActual.condiciones" 
                    rows="3"
                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Condiciones especiales..."
                  ></textarea>
                </div>

                <!-- Botones de Acción -->
                <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                  <!-- Botones dinámicos según estado -->
                  <template v-if="cotizacionActual.estado === 'borrador' || !cotizacionActual.id">
                    <button 
                      type="submit"
                      class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      Guardar Borrador
                    </button>
                    <button 
                      type="button"
                      @click="enviarCotizacion"
                      :disabled="!puedeEnviar"
                      class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Enviar Cotización
                    </button>
                  </template>

                  <template v-else-if="cotizacionActual.estado === 'enviada'">
                    <button 
                      type="button"
                      @click="marcarAceptada"
                      class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Marcar Aceptada
                    </button>
                    <button 
                      type="button"
                      @click="marcarRechazada"
                      class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Marcar Rechazada
                    </button>
                  </template>

                  <template v-else>
                    <button 
                      type="button"
                      @click="generarPDF"
                      class="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Generar PDF
                    </button>
                  </template>

                  <button 
                    type="button"
                    @click="duplicarCotizacion"
                    v-if="cotizacionActual.id"
                    class="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Duplicar
                  </button>

                  <button 
                    type="button"
                    @click="limpiarFormulario"
                    class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-medium transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Panel Lateral - Resumen -->
        <div class="xl:col-span-1" v-if="vistaActual === 'nueva'">
          <div class="bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <h3 class="text-lg font-semibold text-emerald-400 mb-4">Resumen</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">Productos:</span>
                <span class="text-white">{{ cotizacionActual.productos?.length || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Subtotal:</span>
                <span class="text-white font-semibold">Q{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">IVA (12%):</span>
                <span class="text-white font-semibold">Q{{ iva.toFixed(2) }}</span>
              </div>
              <hr class="border-gray-600">
              <div class="flex justify-between text-lg">
                <span class="text-emerald-400 font-semibold">Total:</span>
                <span class="text-emerald-400 font-bold">Q{{ total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Servicios Seleccionados -->
            <div v-if="cotizacionActual.serviciosIncluidos?.length > 0" class="mt-6">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">Servicios Incluidos:</h4>
              <ul class="text-xs text-gray-400 space-y-1">
                <li v-for="servicio in cotizacionActual.serviciosIncluidos" :key="servicio">
                  • {{ servicio }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Estado reactivo
const vistaActual = ref('borrador');
const cotizaciones = ref([]);
const productoSeleccionado = ref('');

// Cotización actual para edición
const cotizacionActual = ref({
  id: null,
  numero: '',
  cliente: '',
  contacto: '',
  telefono: '',
  fecha: new Date().toISOString().split('T')[0],
  validez: 15,
  tipoServicio: 'jardinizacion',
  estado: 'borrador',
  productos: [],
  serviciosIncluidos: [],
  condiciones: 'Pago con ods, esta cantidad de plantas puede variar mes a mes ya que se van a trabajar diferentes áreas del jardín'
});

// Productos comunes
const productosComunes = [
  { descripcion: 'Duranta amarillas doradas', precio: 10.00 },
  { descripcion: 'Forno', precio: 20.00 },
  { descripcion: 'Palmera Phoenix', precio: 150.00 },
  { descripcion: 'Grama San Agustín (m²)', precio: 25.00 },
  { descripcion: 'Tierra negra (saco)', precio: 35.00 },
  { descripcion: 'Abono orgánico (saco)', precio: 45.00 },
  { descripcion: 'Sistema de riego por goteo', precio: 180.00 },
  { descripcion: 'Mano de obra jardinización', precio: 150.00 },
  { descripcion: 'Preparación de terreno (m²)', precio: 15.00 },
  { descripcion: 'Plantación y distribución', precio: 100.00 }
];

// Servicios disponibles
const serviciosDisponibles = [
  'Suministro de todas las plantas y materiales descritos',
  'Preparación del terreno',
  'Plantación y distribución según diseño',
  'Limpieza final del área de trabajo',
  'Reemplazo de plantas que presenten problemas durante el período de garantía'
];

// Computed properties
const cotizacionesPorEstado = computed(() => {
  const grupos = {
    borrador: [],
    enviada: [],
    aceptada: [],
    rechazada: []
  };
  
  cotizaciones.value.forEach(cot => {
    if (grupos[cot.estado]) {
      grupos[cot.estado].push(cot);
    }
  });
  
  return grupos;
});

const contarPorEstado = (estado) => {
  return cotizaciones.value.filter(c => c.estado === estado).length;
};

const totalValorCotizaciones = computed(() => {
  return cotizaciones.value
    .filter(c => c.estado === 'aceptada')
    .reduce((sum, c) => sum + (c.total || 0), 0);
});

const subtotal = computed(() => {
  return (cotizacionActual.value.productos || []).reduce((sum, producto) => {
    return sum + ((producto.cantidad || 0) * (producto.precioUnitario || 0));
  }, 0);
});

const iva = computed(() => subtotal.value * 0.12);
const total = computed(() => subtotal.value + iva.value);

const puedeEnviar = computed(() => {
  return cotizacionActual.value.cliente && 
         (cotizacionActual.value.productos || []).length > 0 &&
         (cotizacionActual.value.productos || []).every(p => p.descripcion && p.cantidad && p.precioUnitario);
});

// Métodos
const cambiarVista = (vista) => {
  vistaActual.value = vista;
};

const nuevaCotizacion = () => {
  limpiarFormulario();
  vistaActual.value = 'nueva';
};

const volverALista = () => {
  vistaActual.value = 'borrador';
};

const editarCotizacion = (cotizacion) => {
  cotizacionActual.value = { ...cotizacion };
  vistaActual.value = 'nueva';
};

const agregarProductoVacio = () => {
  cotizacionActual.value.productos.push({
    cantidad: 1,
    descripcion: '',
    precioUnitario: 0
  });
};

const agregarProductoComun = () => {
  if (productoSeleccionado.value) {
    cotizacionActual.value.productos.push({
      cantidad: 1,
      descripcion: productoSeleccionado.value.descripcion,
      precioUnitario: productoSeleccionado.value.precio
    });
    productoSeleccionado.value = '';
  }
};

const eliminarProducto = (index) => {
  cotizacionActual.value.productos.splice(index, 1);
};

const generarNumero = () => {
  return `COT-${Date.now()}`;
};

const guardarCotizacion = () => {
  if (!cotizacionActual.value.cliente) {
    alert('El cliente es requerido');
    return;
  }

  // Asegurar que tenga número
  if (!cotizacionActual.value.numero) {
    cotizacionActual.value.numero = generarNumero();
  }

  // Calcular totales
  cotizacionActual.value.subtotal = subtotal.value;
  cotizacionActual.value.iva = iva.value;
  cotizacionActual.value.total = total.value;
  cotizacionActual.value.fechaActualizacion = new Date().toISOString();

  if (cotizacionActual.value.id) {
    // Actualizar existente
    const index = cotizaciones.value.findIndex(c => c.id === cotizacionActual.value.id);
    if (index !== -1) {
      cotizaciones.value[index] = { ...cotizacionActual.value };
    }
  } else {
    // Crear nueva
    cotizacionActual.value.id = Date.now();
    cotizacionActual.value.fechaCreacion = new Date().toISOString();
    cotizaciones.value.push({ ...cotizacionActual.value });
  }

  guardarEnLocalStorage();
  alert(`Cotización guardada como ${cotizacionActual.value.estado.toUpperCase()}`);
  volverALista();
};

const enviarCotizacion = () => {
  cotizacionActual.value.estado = 'enviada';
  guardarCotizacion();
};

const marcarAceptada = () => {
  cotizacionActual.value.estado = 'aceptada';
  guardarCotizacion();
};

const marcarRechazada = () => {
  cotizacionActual.value.estado = 'rechazada';
  guardarCotizacion();
};

const duplicarCotizacion = () => {
  const nueva = {
    ...cotizacionActual.value,
    id: null,
    numero: '',
    cliente: cotizacionActual.value.cliente + ' (Copia)',
    estado: 'borrador'
  };
  cotizacionActual.value = nueva;
};

const limpiarFormulario = () => {
  cotizacionActual.value = {
    id: null,
    numero: '',
    cliente: '',
    contacto: '',
    telefono: '',
    fecha: new Date().toISOString().split('T')[0],
    validez: 15,
    tipoServicio: 'jardinizacion',
    estado: 'borrador',
    productos: [],
    serviciosIncluidos: [],
    condiciones: 'Pago con ods, esta cantidad de plantas puede variar mes a mes ya que se van a trabajar diferentes áreas del jardín'
  };
};

const generarPDF = () => {
  alert('Funcionalidad de PDF en desarrollo');
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-GT');
};

// LocalStorage
const guardarEnLocalStorage = () => {
  localStorage.setItem('cotizaciones-gn', JSON.stringify(cotizaciones.value));
};

const cargarDeLocalStorage = () => {
  const data = localStorage.getItem('cotizaciones-gn');
  if (data) {
    try {
      cotizaciones.value = JSON.parse(data);
    } catch (e) {
      console.error('Error cargando cotizaciones:', e);
    }
  }
};

const exportarDatos = () => {
  const data = JSON.stringify(cotizaciones.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cotizaciones-gn-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Lifecycle
onMounted(() => {
  cargarDeLocalStorage();
});
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>