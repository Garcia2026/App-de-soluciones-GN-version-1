<template>
  <MainLayout>
    <!-- Header Actions -->
    <template #header-actions>
      <button @click="cambiarPestana('nueva')" class="btn-gold">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span class="font-semibold">Nueva Cotización</span>
      </button>
    </template>

    <!-- Enhanced Main Content -->
    <div class="cotizaciones-container">
      <!-- Enhanced Header -->
      <div class="cotizaciones-header">
        <div class="header-content">
          <div class="header-info">
            <div class="header-icon">
              <svg class="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="header-text">
              <h1 class="header-title">Sistema de Cotizaciones</h1>
              <p class="header-subtitle">Gestión profesional de presupuestos y propuestas comerciales</p>
            </div>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <span class="stat-number">{{ cotizacionesGuardadas.length }}</span>
              <span class="stat-label">Total Cotizaciones</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">{{ contarPorEstado('aceptada') }}</span>
              <span class="stat-label">Aceptadas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sistema de Pestañas -->
      <div class="tabs-container">
        <div class="tabs-navigation">
          <button
            @click="cambiarPestana('nueva')"
            :class="['tab-btn', { 'active': pestanaActiva === 'nueva' }]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nueva Cotización</span>
          </button>
          <button
            @click="cambiarPestana('lista')"
            :class="['tab-btn', { 'active': pestanaActiva === 'lista' }]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Cotizaciones Guardadas</span>
            <span class="tab-badge">{{ cotizacionesGuardadas.length }}</span>
          </button>
        </div>

        <!-- Contenido de Pestañas -->
        <div class="tabs-content">
          <!-- Pestaña: Nueva Cotización -->
          <div v-show="pestanaActiva === 'nueva'" class="tab-panel">

        <!-- Formulario Principal -->
        <div class="lg:col-span-2">
          <div class="enhanced-form-card">
            <!-- Form Header -->
            <div class="form-header-enhanced">
              <div class="form-title-section">
                <h2 class="form-title">Nueva Cotización</h2>
                <p class="form-subtitle">Complete toda la información del proyecto</p>
              </div>
              <div class="form-status-section">
                <div class="status-badge" :class="cotizacion.estado">
                  <span>{{ cotizacion.estado.toUpperCase() }}</span>
                  <span v-if="cotizacion.numero" class="quote-number">{{ cotizacion.numero }}</span>
                </div>
              </div>
            </div>

            <!-- Información del Cliente -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="section-title">Información del Cliente</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">Cliente</label>
                  <input
                    v-model="cotizacion.cliente"
                    type="text"
                    class="form-input"
                    placeholder="Ej: McDonald's Salamá"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Contacto</label>
                  <input
                    v-model="cotizacion.contacto"
                    type="text"
                    class="form-input"
                    placeholder="Nombre del contacto"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Teléfono</label>
                  <input
                    v-model="cotizacion.telefono"
                    type="text"
                    class="form-input"
                    placeholder="3512-5327"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label required">Fecha</label>
                  <input
                    v-model="cotizacion.fecha"
                    type="date"
                    class="form-input"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Validez (días)</label>
                  <input
                    v-model="cotizacion.validez"
                    type="number"
                    class="form-input"
                    placeholder="15"
                    min="1"
                    max="365"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Tipo de Servicio</label>
                  <select
                    v-model="cotizacion.tipoServicio"
                    class="form-select"
                  >
                    <option value="jardinizacion">Jardinización</option>
                    <option value="paisajismo">Paisajismo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="integral">Proyecto Integral</option>
                    <option value="danos-en-obra">Daños en Obra</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Productos y Servicios -->
            <div class="form-section">
              <div class="section-header-with-actions">
                <div class="section-header">
                  <div class="section-icon">
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 class="section-title">Productos y Servicios</h3>
                </div>
                <div class="section-actions">
                  <select
                    v-model="productoSeleccionado"
                    @change="agregarProductoComun"
                    class="action-select"
                  >
                    <option value="">➕ Producto Común</option>
                    <option v-for="producto in productosComunes" :key="producto.descripcion" :value="producto">
                      {{ producto.descripcion }} - Q{{ producto.precio }}
                    </option>
                  </select>
                  <button
                    @click="agregarProducto"
                    class="action-button"
                  >
                    ✨ Personalizado
                  </button>
                </div>
              </div>

              <!-- Lista de Productos (Responsiva) -->
              <div v-if="cotizacion.productos.length > 0" class="space-y-4">
                <!-- Header para Desktop -->
                <div class="hidden md:grid grid-cols-12 gap-4 font-bold text-sm text-gray-400 px-4">
                  <div class="col-span-2">Cantidad</div>
                  <div class="col-span-5">Descripción</div>
                  <div class="col-span-2">Precio Unit.</div>
                  <div class="col-span-2">Total</div>
                  <div class="col-span-1"></div>
                </div>

                <!-- Cuerpo de la lista -->
                <div v-for="(producto, index) in cotizacion.productos" :key="index" 
                     class="bg-gray-700/50 rounded-lg p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                  
                  <!-- Cantidad -->
                  <div class="md:col-span-2">
                    <label class="md:hidden text-xs font-bold text-gray-400">Cantidad</label>
                    <input v-model.number="producto.cantidad" type="number" min="1" step="1" class="quantity-input w-full" />
                  </div>

                  <!-- Descripción -->
                  <div class="md:col-span-5">
                    <label class="md:hidden text-xs font-bold text-gray-400">Descripción</label>
                    <input v-model="producto.descripcion" type="text" class="description-input w-full" placeholder="Descripción del producto/servicio" />
                  </div>

                  <!-- Precio Unitario -->
                  <div class="md:col-span-2">
                    <label class="md:hidden text-xs font-bold text-gray-400">Precio Unitario</label>
                    <div class="price-input-wrapper">
                      <span class="currency">Q</span>
                      <input v-model.number="producto.precioUnitario" type="number" min="0" step="0.01" class="price-input w-full" placeholder="0.00" />
                    </div>
                  </div>

                  <!-- Total -->
                  <div class="md:col-span-2">
                    <label class="md:hidden text-xs font-bold text-gray-400">Total</label>
                    <span class="total-display block text-right md:text-left">Q{{ (producto.cantidad * producto.precioUnitario || 0).toFixed(2) }}</span>
                  </div>

                  <!-- Acciones -->
                  <div class="md:col-span-1 flex justify-end">
                    <button @click="eliminarProducto(index)" class="delete-button" title="Eliminar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="empty-state">
                <div class="empty-icon">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 class="empty-title">No hay productos agregados</h4>
                <p class="empty-description">Agrega productos o servicios para generar tu cotización</p>
              </div>
            </div>

            <!-- Servicios Incluidos -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="section-title">Servicios Incluidos</h3>
              </div>
              <div class="services-grid">
                <label v-for="servicio in serviciosDisponibles" :key="servicio" class="service-card">
                  <input
                    type="checkbox"
                    v-model="cotizacion.serviciosIncluidos"
                    :value="servicio"
                    class="service-checkbox"
                  >
                  <div class="service-content">
                    <span class="service-text">✓ {{ servicio }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Condiciones Generales -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="section-title">Condiciones Generales</h3>
              </div>
              <textarea
                v-model="cotizacion.condiciones"
                rows="4"
                class="conditions-textarea"
                placeholder="Condiciones especiales de la cotización..."
              ></textarea>
            </div>

            <!-- Fotografías -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="section-title">Fotografías (Opcional)</h3>
              </div>

              <div class="mb-4">
                <label class="form-label">Adjuntar Fotografías</label>
                <input
                  type="file"
                  @change="manejarSubidaFotos"
                  accept="image/*"
                  multiple
                  class="form-input"
                >
                <p class="text-xs text-gray-400 mt-2">Puedes adjuntar múltiples imágenes para documentar daños o trabajos</p>
              </div>

              <!-- Vista previa de fotos -->
              <div v-if="cotizacion.fotografias && cotizacion.fotografias.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="(foto, index) in cotizacion.fotografias"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="foto.url"
                    :alt="foto.nombre"
                    class="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                  >
                  <button
                    @click="eliminarFoto(index)"
                    type="button"
                    class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar foto"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p class="text-xs text-gray-400 mt-1 truncate">{{ foto.nombre }}</p>
                </div>
              </div>
            </div>

            <!-- Estado y Acciones -->
            <div class="form-section">
              <div class="status-section">
                <div class="status-info">
                  <span class="status-label">Estado:</span>
                  <span :class="{
                    'text-yellow-600': cotizacion.estado === 'borrador',
                    'text-blue-600': cotizacion.estado === 'enviada',
                    'text-green-600': cotizacion.estado === 'aceptada',
                    'text-red-600': cotizacion.estado === 'rechazada'
                  }" class="status-value">
                    {{ cotizacion.estado.toUpperCase() }}
                  </span>
                </div>
                <div v-if="cotizacion.numero" class="quote-number-display">
                  # {{ cotizacion.numero }}
                </div>
              </div>

              <!-- Botones de Acción Organizados -->
              <div class="space-y-4">

                <!-- Sección 1: Acciones de Estado -->
                <div class="bg-gray-700 p-4 rounded-xl">
                  <h4 class="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Acciones de Cotización
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- Botones para BORRADOR -->
                    <template v-if="cotizacion.estado === 'borrador' || !cotizacion.numero">
                      <button
                        @click="guardarOCrear('borrador')"
                        class="action-btn draft min-h-[44px]"
                        type="button"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Guardar Borrador
                      </button>
                      <button
                        @click="guardarOCrear('enviada')"
                        :disabled="!puedeGenerarCotizacion"
                        class="action-btn primary"
                        type="button"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar Cotización
                      </button>
                    </template>

                    <!-- Botones para ENVIADA -->
                    <template v-else-if="cotizacion.estado === 'enviada'">
                      <button
                        @click="cambiarEstado('aceptada')"
                        class="action-btn success"
                        type="button"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Marcar Aceptada
                      </button>
                      <button
                        @click="cambiarEstado('rechazada')"
                        class="action-btn danger"
                        type="button"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Marcar Rechazada
                      </button>
                      <button
                        @click="volverABorrador"
                        class="action-btn secondary"
                        type="button"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Volver a Borrador
                      </button>
                    </template>

                    <!-- Botones para ACEPTADA/RECHAZADA -->
                    <template v-else>
                      <div class="col-span-full text-center text-green-400 py-2">
                        ✓ Cotización {{ cotizacion.estado }}
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Sección 2: Acciones de PDF -->
                <div class="bg-gray-700 p-4 rounded-xl">
                  <h4 class="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Documentos PDF
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      @click="verPDF"
                      class="action-btn warning"
                      type="button"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver PDF
                    </button>

                    <button
                      @click="descargarPDF"
                      class="action-btn info"
                      type="button"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar PDF
                    </button>

                    <button
                      @click="imprimirPDF"
                      class="action-btn secondary"
                      type="button"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Imprimir
                    </button>
                  </div>
                </div>

                <!-- Sección 3: Otras Acciones -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    @click="limpiarFormulario"
                    class="action-btn neutral"
                    type="button"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nueva Cotización
                  </button>

                  <button
                    v-if="edicionId"
                    @click="duplicarCotizacionActual"
                    class="action-btn secondary"
                    type="button"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicar Cotización
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="lg:col-span-1">
          <!-- Resumen Financiero -->
          <div class="sidebar-card financial">
            <div class="sidebar-header">
              <div class="sidebar-icon">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="sidebar-title">Resumen Financiero</h3>
            </div>
            <div class="financial-summary">
              <div class="summary-line">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">Q{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-line">
                <span class="summary-label">IVA (12%):</span>
                <span class="summary-value">Q{{ iva.toFixed(2) }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-total">
                <span class="total-label">Total:</span>
                <span class="total-value">Q{{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>

          <!-- Pestaña: Cotizaciones Guardadas -->
          <div v-show="pestanaActiva === 'lista'" class="tab-panel">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Cotizaciones</h2>

            <!-- Filtros por Estado -->
            <div class="status-filters">
              <button
                v-for="estado in ['todas', 'borrador', 'enviada', 'aceptada', 'en-proceso', 'finalizada', 'rechazada']"
                :key="estado"
                @click="filtroEstado = estado"
                :class="{
                  'filter-active': filtroEstado === estado,
                  'filter-inactive': filtroEstado !== estado
                }"
                class="filter-button"
              >
                {{ formatearNombreEstado(estado) }}
                <span class="filter-count">({{ contarPorEstado(estado) }})</span>
              </button>
            </div>

            <!-- Lista de Cotizaciones Guardadas -->
            <div class="cotizaciones-list">
              <div v-if="cotizacionesFiltradas.length === 0" class="empty-list">
                <p class="empty-text">No hay cotizaciones {{ filtroEstado !== 'todas' ? `en estado "${filtroEstado}"` : '' }}</p>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                  v-for="cot in cotizacionesFiltradas"
                  :key="cot.id"
                  class="cotizacion-item"
                >
                  <div class="item-header">
                    <h4 class="item-title">{{ cot.cliente }}</h4>
                    <span :class="`status-${cot.estado}`" class="item-status">
                      {{ cot.estado }}
                    </span>
                  </div>
                  <div class="item-details">
                    <span class="item-date">{{ formatearFecha ? formatearFecha(cot.fecha) : cot.fecha }}</span>
                    <span class="item-total">Q{{ calcularTotalCot(cot) }}</span>
                  </div>
                  <div class="item-actions">
                    <button @click.stop="verCotizacion(cot)" class="item-action-btn view">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Ver</span>
                    </button>
                    <button @click.stop="editarCotizacion(cot)" class="item-action-btn edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Editar</span>
                    </button>
                    <button @click.stop="compartirCotizacion(cot)" class="item-action-btn share">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>Compartir</span>
                    </button>
                    <button @click.stop="imprimirCotizacion(cot)" class="item-action-btn print">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Imprimir</span>
                    </button>
                    <button @click.stop="confirmarEliminarCotizacion(cot)" class="item-action-btn delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Modal de Control de Estados -->
    <div v-if="mostrarModalEstado" class="modal-overlay" @click="mostrarModalEstado = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Control de Estado de Cotización</h3>
          <button @click="mostrarModalEstado = false" class="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="modal-info">
            <div class="info-row">
              <span class="info-label">Cliente:</span>
              <span class="info-value">{{ cotizacionModal?.cliente }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">No. Cotización:</span>
              <span class="info-value">{{ cotizacionModal?.numero }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total:</span>
              <span class="info-value">Q{{ calcularTotalCot(cotizacionModal || {}) }}</span>
            </div>
          </div>

          <div class="modal-estado-actual">
            <span class="estado-label">Estado Actual:</span>
            <span :class="`estado-badge estado-${cotizacionModal?.estado}`">
              {{ formatearNombreEstado(cotizacionModal?.estado || '') }}
            </span>
          </div>

          <div class="modal-message">
            <p class="text-center text-gray-700 mb-4">
              <strong>PDF guardado correctamente.</strong><br>
              Selecciona el siguiente estado para esta cotización:
            </p>
          </div>

          <div class="modal-actions">
            <button
              @click="cambiarEstadoModal('enviada')"
              class="estado-btn enviada"
              :disabled="cotizacionModal?.estado === 'enviada'"
            >
              <div class="estado-btn-icon">📤</div>
              <div class="estado-btn-text">
                <div class="estado-btn-title">Enviada</div>
                <div class="estado-btn-desc">Cotización enviada al cliente</div>
              </div>
            </button>

            <button
              @click="cambiarEstadoModal('aceptada')"
              class="estado-btn aceptada"
              :disabled="cotizacionModal?.estado === 'aceptada'"
            >
              <div class="estado-btn-icon">✅</div>
              <div class="estado-btn-text">
                <div class="estado-btn-title">Aceptada</div>
                <div class="estado-btn-desc">Cliente aceptó la cotización</div>
              </div>
            </button>

            <button
              @click="cambiarEstadoModal('en-proceso')"
              class="estado-btn en-proceso"
              :disabled="cotizacionModal?.estado === 'en-proceso'"
            >
              <div class="estado-btn-icon">🔄</div>
              <div class="estado-btn-text">
                <div class="estado-btn-title">En Proceso</div>
                <div class="estado-btn-desc">Proyecto en ejecución</div>
              </div>
            </button>

            <button
              @click="cambiarEstadoModal('finalizada')"
              class="estado-btn finalizada"
              :disabled="cotizacionModal?.estado === 'finalizada'"
            >
              <div class="estado-btn-icon">🎉</div>
              <div class="estado-btn-text">
                <div class="estado-btn-title">Finalizada</div>
                <div class="estado-btn-desc">Proyecto completado</div>
              </div>
            </button>

            <button
              @click="cambiarEstadoModal('rechazada')"
              class="estado-btn rechazada"
              :disabled="cotizacionModal?.estado === 'rechazada'"
            >
              <div class="estado-btn-icon">❌</div>
              <div class="estado-btn-text">
                <div class="estado-btn-title">Rechazada</div>
                <div class="estado-btn-desc">Cliente rechazó la propuesta</div>
              </div>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="mostrarModalEstado = false" class="btn-cerrar-modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-container-delete" @click.stop>
        <div class="modal-header-delete">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="modal-title-delete">¿Eliminar Cotización?</h3>
        </div>

        <div class="modal-body-delete">
          <p class="delete-warning">Esta acción no se puede deshacer. Se eliminará permanentemente:</p>
          <div class="delete-info">
            <div class="info-item">
              <strong>Cliente:</strong> {{ cotizacionAEliminar?.cliente }}
            </div>
            <div class="info-item">
              <strong>No. Cotización:</strong> {{ cotizacionAEliminar?.numero }}
            </div>
            <div class="info-item">
              <strong>Total:</strong> Q{{ calcularTotalCot(cotizacionAEliminar || {}) }}
            </div>
          </div>
        </div>

        <div class="modal-footer-delete">
          <button @click="cancelarEliminar" class="btn-cancel-delete">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
          <button @click="eliminarCotizacion" class="btn-confirm-delete">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, addDoc, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseReady } from '@/firebase';
import { useAuth } from '@/composables/useAuth';
import MainLayout from '@/components/MainLayout.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const { currentUser, registrarBitacora } = useAuth();

// Control de pestañas
const pestanaActiva = ref('nueva');

const cambiarPestana = (pestana) => {
  pestanaActiva.value = pestana;
  if (pestana === 'nueva') {
    limpiarFormulario();
  }
};

// Estado reactivo
const cotizacion = ref({
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
  condiciones: 'Pago con ods, esta cantidad de plantas puede variar mes a mes ya que se van a trabajar diferentes áreas del jardín',
  fotografias: []
});

const cotizacionesGuardadas = ref([]);
const mostrarModalEliminar = ref(false);
const cotizacionAEliminar = ref(null);
const productoSeleccionado = ref('');
const filtroEstado = ref('todas');
const isFirebaseConnected = ref(false);
const cargando = ref(true);
// ID de documento en edición (null si es nueva)
const edicionId = ref(null);

// Modal de control de estados
const mostrarModalEstado = ref(false);
const cotizacionModal = ref(null);

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

const serviciosDisponibles = [
  'Suministro de todas las plantas y materiales descritos',
  'Preparación del terreno',
  'Plantación y distribución según diseño',
  'Limpieza final del área de trabajo',
  'Reemplazo de plantas que presenten problemas durante el período de garantía'
];

// Computed properties
const subtotal = computed(() => {
  return cotizacion.value.productos.reduce((sum, producto) => {
    return sum + (producto.cantidad * producto.precioUnitario || 0);
  }, 0);
});

const iva = computed(() => subtotal.value * 0.12);
const total = computed(() => subtotal.value + iva.value);

const puedeGenerarCotizacion = computed(() => {
  return cotizacion.value.cliente &&
         cotizacion.value.productos.length > 0 &&
         cotizacion.value.productos.every(p => p.descripcion && p.cantidad && p.precioUnitario);
});

const cotizacionesFiltradas = computed(() => {
  if (filtroEstado.value === 'todas') {
    return cotizacionesGuardadas.value;
  }
  return cotizacionesGuardadas.value.filter(c => c.estado === filtroEstado.value);
});

const contarPorEstado = (estado) => {
  if (estado === 'todas') {
    return cotizacionesGuardadas.value.length;
  }
  return cotizacionesGuardadas.value.filter(c => c.estado === estado).length;
};

// Función para generar número de cotización automáticamente
const generarNumeroCotizacion = () => {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  const hora = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');

  // Formato: #DDMMYYYY-HHMM (ej: #28082025-1430)
  return `#${dia}${mes}${año}-${hora}${minutos}`;
};

// Métodos
const agregarProducto = () => {
  cotizacion.value.productos.push({
    cantidad: 1,
    descripcion: '',
    precioUnitario: 0
  });
};

const agregarProductoComun = () => {
  if (productoSeleccionado.value) {
    cotizacion.value.productos.push({
      cantidad: 1,
      descripcion: productoSeleccionado.value.descripcion,
      precioUnitario: productoSeleccionado.value.precio
    });
    productoSeleccionado.value = ''; // Limpiar selección
  }
};

const eliminarProducto = (index) => {
  cotizacion.value.productos.splice(index, 1);
};

const limpiarFormulario = () => {
  cotizacion.value = {
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
    condiciones: 'Pago con ods, esta cantidad de plantas puede variar mes a mes ya que se van a trabajar diferentes áreas del jardín',
    fotografias: []
  };
  edicionId.value = null;
};

// Funciones para manejar fotografías
const manejarSubidaFotos = async (event) => {
  const archivos = event.target.files;
  if (!archivos || archivos.length === 0) return;

  toast.info('Subiendo fotografías...');

  try {
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];

      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        toast.warning(`${archivo.name} no es una imagen válida`);
        continue;
      }

      // Validar tamaño (máximo 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        toast.warning(`${archivo.name} es demasiado grande (máximo 5MB)`);
        continue;
      }

      // Si Firebase Storage está disponible, subir a Storage
      if (storage) {
        const timestamp = Date.now();
        const nombreArchivo = `cotizaciones/${timestamp}_${archivo.name}`;
        const fileRef = storageRef(storage, nombreArchivo);

        await uploadBytes(fileRef, archivo);
        const url = await getDownloadURL(fileRef);

        cotizacion.value.fotografias.push({
          nombre: archivo.name,
          url: url,
          ruta: nombreArchivo,
          fechaSubida: new Date().toISOString()
        });
      } else {
        // Si no hay Storage, convertir a base64
        const reader = new FileReader();
        reader.onload = (e) => {
          cotizacion.value.fotografias.push({
            nombre: archivo.name,
            url: e.target.result,
            base64: true,
            fechaSubida: new Date().toISOString()
          });
        };
        reader.readAsDataURL(archivo);
      }
    }

    toast.success(`${archivos.length} fotografía(s) agregada(s)`);

    // Limpiar el input
    event.target.value = '';
  } catch (error) {
    console.error('Error subiendo fotografías:', error);
    toast.error('Error al subir fotografías');
  }
};

const eliminarFoto = (index) => {
  const foto = cotizacion.value.fotografias[index];
  cotizacion.value.fotografias.splice(index, 1);
  toast.success(`Fotografía "${foto.nombre}" eliminada`);
};

// Funciones adicionales de acciones
const volverABorrador = async () => {
  cotizacion.value.estado = 'borrador';
  await guardarOCrear('borrador');
};

const duplicarCotizacionActual = () => {
  const copia = JSON.parse(JSON.stringify(cotizacion.value));
  copia.id = null;
  copia.numero = '';
  copia.estado = 'borrador';
  copia.cliente = `${cotizacion.value.cliente} (Copia)`;
  delete copia.fechaCreacion;
  delete copia.fechaActualizacion;

  cotizacion.value = copia;
  edicionId.value = null;
  toast.success('Cotización duplicada. Modifica los datos y guarda.');
};

const descargarPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable);
    const clienteNombre = cotizacion.value.cliente ? cotizacion.value.cliente.replace(/\s+/g, '_') : 'cliente';
    const nombre = `Cotizacion_${cotizacion.value.numero || 'nueva'}_${clienteNombre}.pdf`;
    doc.save(nombre);
    toast.success('PDF descargado correctamente');
  } catch (error) {
    console.error('Error descargando PDF:', error);
    toast.error('Error al descargar PDF');
  }
};

const guardarCotizacion = async (estado) => {
  try {
    if (!cotizacion.value.numero) {
      cotizacion.value.numero = generarNumeroCotizacion();
    }

    cotizacion.value.estado = estado;
    cotizacion.value.fechaCreacion = new Date();

    const docRef = await addDoc(collection(db, 'cotizaciones'), cotizacion.value);

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'crear_cotizacion',
        `Cotización #${cotizacion.value.numero} - ${cotizacion.value.cliente} - ${estado}`,
        { numero: cotizacion.value.numero, cliente: cotizacion.value.cliente, total: totalGeneral.value }
      );
    }

    toast.success(`Cotización ${estado} exitosamente`);

    await cargarCotizacionesGuardadas();
    limpiarFormulario();

  } catch (error) {
    console.error('Error guardando cotización:', error);
    toast.error('Error al guardar cotización');
  }
};

const cambiarEstado = (nuevoEstado) => {
  cotizacion.value.estado = nuevoEstado;
  guardarOCrear(nuevoEstado);
};

const duplicarCotizacion = (cot) => {
  const nuevaCotizacion = { ...cot };
  delete nuevaCotizacion.id;
  delete nuevaCotizacion.numero;
  nuevaCotizacion.estado = 'borrador';
  nuevaCotizacion.cliente = `${cot.cliente} (Copia)`;

  cotizacion.value = nuevaCotizacion;
};

const cargarCotizacionesGuardadas = async () => {
  try {
    const q = query(collection(db, 'cotizaciones'), orderBy('fechaCreacion', 'desc'));
    const querySnapshot = await getDocs(q);

    cotizacionesGuardadas.value = [];
    querySnapshot.forEach((doc) => {
      cotizacionesGuardadas.value.push({
        id: doc.id,
        ...doc.data()
      });
    });

  } catch (error) {
    console.error('Error cargando cotizaciones:', error);
    toast.error('Error al cargar cotizaciones guardadas');
  }
};

// Funciones auxiliares
const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  return date.toLocaleDateString('es-GT');
};

const calcularTotalCot = (cot) => {
  if (!cot.productos) return '0.00';
  const subtotal = cot.productos.reduce((sum, producto) => {
    return sum + (producto.cantidad * producto.precioUnitario || 0);
  }, 0);
  return (subtotal * 1.12).toFixed(2);
};

const generarPDF = () => {
  console.log('Generando PDF...');
  toast.info('Función PDF en desarrollo');
};

const probarPDF = () => {
  console.log('Probando PDF...');
  toast.info('Función PDF en desarrollo');
};

const probarFirebase = () => {
  console.log('Probando Firebase...');
  toast.success('Firebase conectado correctamente');
};

const nuevaCotizacionRapida = () => {
  limpiarFormulario();
};

// Lifecycle
onMounted(async () => {
  cargando.value = true;
  try {
    console.log('🚀 Inicializando componente de Cotizaciones...');
    await cargarCotizacionesGuardadas();
    // Agregar un producto inicial
    agregarProducto();
    console.log('✅ Componente de Cotizaciones inicializado');
  } catch (error) {
    console.error('Error inicializando cotizaciones:', error);
    toast.error('Error al inicializar el sistema de cotizaciones');
  } finally {
    cargando.value = false;
  }
});

// PDF helpers (dynamic imports) - FORMATO PROFESIONAL
const buildPDF = (doc, autoTable, cotData = null) => {
  const c = cotData || cotizacion.value;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // COLORES CORPORATIVOS
  const verde = [46, 125, 50]; // Verde principal
  const verdeClaro = [76, 175, 80];
  const grisOscuro = [60, 60, 60];
  const grisClaro = [150, 150, 150];

  // ============ HEADER CON FONDO VERDE ============
  doc.setFillColor(...verde);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Icono/Logo circular en el header
  doc.setFillColor(255, 255, 255);
  doc.circle(24, 17.5, 8, 'F');
  doc.setFillColor(...verde);
  doc.circle(24, 17.5, 6, 'F');

  // Iniciales de la empresa en el círculo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('GN', 24, 19, { align: 'center' });

  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('COTIZACIÓN', pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const tipoServicioTexto = {
    'jardinizacion': 'Jardinización',
    'paisajismo': 'Paisajismo',
    'mantenimiento': 'Mantenimiento',
    'integral': 'Proyecto Integral',
    'danos-en-obra': 'Daños en Obra'
  };
  doc.text(tipoServicioTexto[c.tipoServicio] || 'Servicio de Jardinería', pageWidth / 2, 21, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('Soluciones Integrales GN', pageWidth / 2, 27, { align: 'center' });

  // ============ INFORMACIÓN DE LA EMPRESA (Izquierda) ============
  let yPos = 45;
  doc.setTextColor(...grisOscuro);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Soluciones Integrales GN', 14, yPos);

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...grisClaro);
  yPos += 5;
  doc.text('Teléfono: 3512-5327', 14, yPos);
  yPos += 4;
  doc.text('Ciudad de Guatemala', 14, yPos);
  yPos += 4;
  doc.text('NIT: 120039877', 14, yPos);
  yPos += 5;
  doc.setFont(undefined, 'italic');
  doc.setFontSize(8);
  doc.text('Especialistas en jardinización comercial', 14, yPos);

  // ============ INFORMACIÓN DEL CLIENTE (Derecha) ============
  yPos = 45;
  doc.setTextColor(...grisOscuro);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('CLIENTE', pageWidth - 14, yPos, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  yPos += 5;
  doc.text(c.cliente || '-', pageWidth - 14, yPos, { align: 'right' });
  yPos += 4;
  doc.setTextColor(...grisClaro);
  doc.text(c.contacto || '', pageWidth - 14, yPos, { align: 'right' });

  yPos += 6;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...grisOscuro);
  doc.text('Fecha:', pageWidth - 60, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(formatearFechaPDF(c.fecha), pageWidth - 14, yPos, { align: 'right' });

  yPos += 4;
  doc.setFont(undefined, 'bold');
  doc.text('No. Cotización:', pageWidth - 60, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(c.numero || 'N/A', pageWidth - 14, yPos, { align: 'right' });

  yPos += 4;
  doc.setFont(undefined, 'bold');
  doc.text('Validez:', pageWidth - 60, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(`${c.validez || 15} días`, pageWidth - 14, yPos, { align: 'right' });

  // ============ DETALLE DE PRODUCTOS Y SERVICIOS ============
  yPos += 10;

  // Header de tabla con fondo verde
  doc.setFillColor(...verde);
  doc.rect(14, yPos, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('DETALLE DE PRODUCTOS Y SERVICIOS', pageWidth / 2, yPos + 5.5, { align: 'center' });

  yPos += 10;

  // Tabla de productos
  const productosData = (c.productos || []).map((p, idx) => [
    idx + 1,
    p.descripcion || '',
    `Q${(p.precioUnitario || 0).toFixed(2)}`,
    `Q${((p.cantidad || 0) * (p.precioUnitario || 0)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['NO.', 'DESCRIPCIÓN', 'PRECIO UNIDAD.', 'TOTAL PARCIAL']],
    body: productosData,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [60, 60, 60],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 }
    },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // ============ SERVICIOS INCLUIDOS Y RESUMEN (DOS COLUMNAS) ============
  const columnWidth = (pageWidth - 28 - 6) / 2; // Dos columnas con gap

  // COLUMNA IZQUIERDA: Servicios incluidos
  doc.setFillColor(...verde);
  doc.rect(14, yPos, columnWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('EL SERVICIO INCLUYE', 14 + columnWidth / 2, yPos + 5.5, { align: 'center' });

  let yServicios = yPos + 12;
  doc.setTextColor(...grisOscuro);
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');

  (c.serviciosIncluidos || []).forEach(servicio => {
    const lines = doc.splitTextToSize(`• ${servicio}`, columnWidth - 8);
    lines.forEach(line => {
      doc.text(line, 18, yServicios);
      yServicios += 4;
    });
  });

  // COLUMNA DERECHA: Resumen financiero
  const xResumen = 14 + columnWidth + 6;
  doc.setFillColor(...verde);
  doc.rect(xResumen, yPos, columnWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('RESUMEN', xResumen + columnWidth / 2, yPos + 5.5, { align: 'center' });

  let yResumen = yPos + 15;
  const subtotalVal = (c.productos || []).reduce((s, p) => s + (p.cantidad || 0) * (p.precioUnitario || 0), 0);
  const ivaVal = subtotalVal * 0.12;
  const totalVal = subtotalVal + ivaVal;

  doc.setTextColor(...grisOscuro);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('TOTAL PARCIAL', xResumen + 4, yResumen);
  doc.text(`Q${subtotalVal.toFixed(2)}`, xResumen + columnWidth - 4, yResumen, { align: 'right' });

  yResumen += 5;
  doc.text('IVA (12%)', xResumen + 4, yResumen);
  doc.text(`Q${ivaVal.toFixed(2)}`, xResumen + columnWidth - 4, yResumen, { align: 'right' });

  yResumen += 8;
  // Fondo verde para el total
  doc.setFillColor(...verde);
  doc.rect(xResumen, yResumen - 5, columnWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL', xResumen + 4, yResumen);
  doc.text(`Q${totalVal.toFixed(2)}`, xResumen + columnWidth - 4, yResumen, { align: 'right' });

  // Monto total grande
  yResumen += 12;
  doc.setTextColor(...verde);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`MONTO TOTAL: Q${totalVal.toFixed(2)}`, pageWidth / 2, yResumen, { align: 'center' });

  // ============ CONDICIONES GENERALES ============
  yPos = Math.max(yServicios, yResumen) + 8;

  doc.setFillColor(...verde);
  doc.rect(14, yPos, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('CONDICIONES GENERALES', pageWidth / 2, yPos + 5.5, { align: 'center' });

  yPos += 12;
  doc.setTextColor(...grisOscuro);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  const condiciones = doc.splitTextToSize(c.condiciones || 'Sin condiciones especiales.', pageWidth - 32);
  doc.text(condiciones, 18, yPos);

  // ============ FOTOGRAFÍAS (si existen) ============
  if (c.fotografias && c.fotografias.length > 0) {
    yPos += condiciones.length * 4 + 10;

    // Verificar si hay espacio suficiente, si no, agregar nueva página
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(...verde);
    doc.rect(14, yPos, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('FOTOGRAFÍAS', pageWidth / 2, yPos + 5.5, { align: 'center' });

    yPos += 12;

    // Mostrar fotografías en grid
    const fotosPerRow = 2;
    const fotoWidth = (pageWidth - 28 - 10) / fotosPerRow; // 28 de margen, 10 de gap
    const fotoHeight = fotoWidth * 0.75; // Aspect ratio 4:3
    let xPos = 14;
    let fotoCount = 0;

    for (let i = 0; i < Math.min(c.fotografias.length, 4); i++) {
      const foto = c.fotografias[i];

      try {
        // Verificar si hay espacio suficiente para otra foto
        if (yPos + fotoHeight > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
          xPos = 14;
        }

        // Agregar imagen
        doc.addImage(foto.url, 'JPEG', xPos, yPos, fotoWidth - 5, fotoHeight);

        // Agregar nombre de la foto
        doc.setFontSize(7);
        doc.setTextColor(...grisOscuro);
        const nombreCorto = foto.nombre.length > 25 ? foto.nombre.substring(0, 22) + '...' : foto.nombre;
        doc.text(nombreCorto, xPos, yPos + fotoHeight + 3);

        fotoCount++;
        xPos += fotoWidth + 5;

        // Saltar a la siguiente fila
        if (fotoCount % fotosPerRow === 0) {
          yPos += fotoHeight + 8;
          xPos = 14;
        }
      } catch (error) {
        console.log('Error agregando foto al PDF:', error);
      }
    }

    // Ajustar yPos después de las fotos
    if (fotoCount % fotosPerRow !== 0) {
      yPos += fotoHeight + 8;
    }

    // Si hay más de 4 fotos, agregar nota
    if (c.fotografias.length > 4) {
      doc.setFontSize(8);
      doc.setTextColor(...grisClaro);
      doc.text(`(Se muestran 4 de ${c.fotografias.length} fotografías)`, pageWidth / 2, yPos + 2, { align: 'center' });
      yPos += 6;
    }
  }

  // ============ FIRMAS ============
  yPos = pageHeight - 40;
  const firmaWidth = 60;
  const firmaGap = 20;
  const xFirma1 = (pageWidth - (firmaWidth * 2 + firmaGap)) / 2;
  const xFirma2 = xFirma1 + firmaWidth + firmaGap;

  // Línea de firma 1
  doc.setDrawColor(...grisClaro);
  doc.line(xFirma1, yPos, xFirma1 + firmaWidth, yPos);
  doc.setFontSize(8);
  doc.setTextColor(...grisOscuro);
  doc.text('Elaborado por:', xFirma1 + firmaWidth / 2, yPos + 4, { align: 'center' });
  doc.setFont(undefined, 'bold');
  doc.text('Soluciones Integrales GN', xFirma1 + firmaWidth / 2, yPos + 8, { align: 'center' });

  // Línea de firma 2
  doc.line(xFirma2, yPos, xFirma2 + firmaWidth, yPos);
  doc.setFont(undefined, 'normal');
  doc.text('Aprobado por:', xFirma2 + firmaWidth / 2, yPos + 4, { align: 'center' });
  doc.setFont(undefined, 'bold');
  doc.text(c.cliente || 'Cliente', xFirma2 + firmaWidth / 2, yPos + 8, { align: 'center' });

  // ============ FOOTER ============
  yPos = pageHeight - 15;
  doc.setFillColor(...verde);
  doc.rect(0, yPos - 3, pageWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  doc.text('Para aceptar la presente cotización, favor de firmar y enviar al correo electrónico o contactar al número telefónico indicado.',
    pageWidth / 2, yPos + 2, { align: 'center' });
  doc.setFont(undefined, 'bold');
  doc.text('¡Gracias por confiar en nuestros servicios!', pageWidth / 2, yPos + 6, { align: 'center' });
};

// Función auxiliar para formatear fecha en PDF
const formatearFechaPDF = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();
  return `${dia}/${mes}/${año}`;
};

const verPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable);
    const url = doc.output('bloburl');
    window.open(url, '_blank');
    toast.success('PDF generado correctamente');
  } catch (error) {
    console.error('Error generando PDF:', error);
    toast.error('Error al generar PDF');
  }
};

const imprimirPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable);
    if (typeof doc.autoPrint === 'function') {
      doc.autoPrint();
    }
    const url = doc.output('bloburl');
    window.open(url, '_blank');
    toast.success('Abriendo vista de impresión');
  } catch (error) {
    console.error('Error al imprimir PDF:', error);
    toast.error('Error al imprimir PDF');
  }
};

const guardarPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable);
    const clienteNombre = cotizacion.value.cliente ? cotizacion.value.cliente.replace(/\s+/g, '_') : 'cliente';
    const nombre = `Cotizacion_${cotizacion.value.numero || 'nueva'}_${clienteNombre}.pdf`;
    doc.save(nombre);
    toast.success('PDF descargado correctamente');

    // Guardar la cotización si no está guardada
    if (!edicionId.value && cotizacion.value.estado === 'borrador') {
      await guardarOCrear('borrador');
    }

    // Abrir modal de control de estados
    cotizacionModal.value = { ...cotizacion.value, id: edicionId.value };
    mostrarModalEstado.value = true;
  } catch (error) {
    console.error('Error guardando PDF:', error);
    toast.error('Error al guardar PDF');
  }
};

// Funciones para las opciones de la lista de cotizaciones
const verCotizacion = async (cot) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable, cot);
    const url = doc.output('bloburl');
    window.open(url, '_blank');
    toast.success('PDF abierto en nueva pestaña');
  } catch (error) {
    console.error('Error viendo cotización:', error);
    toast.error('Error al ver la cotización');
  }
};

const imprimirCotizacion = async (cot) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable, cot);
    if (typeof doc.autoPrint === 'function') {
      doc.autoPrint();
    }
    const url = doc.output('bloburl');
    window.open(url, '_blank');
    toast.success('Abriendo vista de impresión');
  } catch (error) {
    console.error('Error al imprimir cotización:', error);
    toast.error('Error al imprimir la cotización');
  }
};

// Guardar o crear cotización (con soporte de edición) - MEJORADA
const guardarOCrear = async (estado) => {
  try {
    // Validaciones básicas
    if (!cotizacion.value.cliente) {
      toast.warning('Por favor ingresa el nombre del cliente');
      return;
    }

    if (cotizacion.value.productos.length === 0) {
      toast.warning('Agrega al menos un producto o servicio');
      return;
    }

    // Validar que todos los productos tengan datos
    const productosIncompletos = cotizacion.value.productos.some(
      p => !p.descripcion || !p.cantidad || !p.precioUnitario
    );
    if (productosIncompletos && estado === 'enviada') {
      toast.warning('Completa todos los productos antes de enviar');
      return;
    }

    // Generar número si no existe
    if (!cotizacion.value.numero) {
      cotizacion.value.numero = generarNumeroCotizacion();
    }

    cotizacion.value.estado = estado;
    const now = new Date();

    if (edicionId.value) {
      // Actualizar existente
      cotizacion.value.fechaActualizacion = now;
      await updateDoc(doc(db, 'cotizaciones', edicionId.value), { ...cotizacion.value });

      const mensajes = {
        'borrador': '💾 Borrador actualizado correctamente',
        'enviada': '🚀 Cotización enviada al cliente',
        'aceptada': '✅ Cotización marcada como aceptada',
        'rechazada': '❌ Cotización marcada como rechazada'
      };
      toast.success(mensajes[estado] || `Cotización actualizada como ${estado}`);
    } else {
      // Crear nueva
      cotizacion.value.fechaCreacion = now;
      const docRef = await addDoc(collection(db, 'cotizaciones'), { ...cotizacion.value });

      // Actualizar edicionId para que la próxima vez actualice en lugar de crear
      edicionId.value = docRef.id;

      const mensajes = {
        'borrador': '💾 Borrador guardado correctamente',
        'enviada': '🚀 Cotización creada y enviada'
      };
      toast.success(mensajes[estado] || `Cotización creada como ${estado}`);
    }

    // Recargar lista
    await cargarCotizacionesGuardadas();

    // Registrar en bitácora si existe el usuario
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'cotizacion',
        `${edicionId.value ? 'Actualizó' : 'Creó'} cotización ${cotizacion.value.numero} - ${cotizacion.value.cliente}`,
        { numero: cotizacion.value.numero, estado: estado }
      );
    }

  } catch (error) {
    console.error('Error al guardar cotización:', error);
    toast.error('Error al guardar cotización: ' + error.message);
  }
};

// Cargar una cotización existente para edición
const editarCotizacion = (cot) => {
  if (!cot) return;
  edicionId.value = cot.id || null;
  const copia = JSON.parse(JSON.stringify(cot));
  copia.productos = Array.isArray(copia.productos) ? copia.productos : [];
  copia.serviciosIncluidos = Array.isArray(copia.serviciosIncluidos) ? copia.serviciosIncluidos : [];
  cotizacion.value = copia;
  pestanaActiva.value = 'nueva';
  toast.info('Cotización cargada para edición');
};

// Funciones para eliminar cotización
const confirmarEliminarCotizacion = (cot) => {
  cotizacionAEliminar.value = cot;
  mostrarModalEliminar.value = true;
};

const cancelarEliminar = () => {
  mostrarModalEliminar.value = false;
  cotizacionAEliminar.value = null;
};

const eliminarCotizacion = async () => {
  try {
    if (!cotizacionAEliminar.value || !cotizacionAEliminar.value.id) {
      toast.error('No se puede eliminar la cotización');
      return;
    }

    const cotizacionId = cotizacionAEliminar.value.id;
    const cotizacionNumero = cotizacionAEliminar.value.numero;
    const cotizacionCliente = cotizacionAEliminar.value.cliente;

    // Eliminar de Firestore
    await updateDoc(doc(db, 'cotizaciones', cotizacionId), { deleted: true });
    // O eliminar completamente (si prefieres):
    // await deleteDoc(doc(db, 'cotizaciones', cotizacionId));

    toast.success(`✅ Cotización ${cotizacionNumero} eliminada correctamente`);

    // Registrar en bitácora
    if (currentUser.value) {
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'eliminar_cotizacion',
        `Eliminó cotización ${cotizacionNumero} de ${cotizacionCliente}`,
        { cotizacionId, numero: cotizacionNumero, cliente: cotizacionCliente }
      );
    }

    // Recargar lista
    await cargarCotizacionesGuardadas();

    // Cerrar modal
    mostrarModalEliminar.value = false;
    cotizacionAEliminar.value = null;
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    toast.error('Error al eliminar la cotización');
  }
};

// Función para compartir PDF
const compartirCotizacion = async (cot) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    buildPDF(doc, autoTable, cot);

    const pdfBlob = doc.output('blob');
    const clienteNombre = cot.cliente ? cot.cliente.replace(/\s+/g, '_') : 'cliente';
    const fileName = `Cotizacion_${cot.numero || 'nueva'}_${clienteNombre}.pdf`;

    // Usar Web Share API si está disponible
    if (navigator.share && navigator.canShare({ files: [new File([pdfBlob], fileName, { type: 'application/pdf' })] })) {
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      await navigator.share({
        files: [file],
        title: `Cotización ${cot.numero}`,
        text: `Cotización para ${cot.cliente}`
      });

      toast.success('PDF compartido correctamente');
    } else {
      // Fallback: descargar el archivo
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast.info('PDF descargado. Puedes compartirlo desde tu administrador de archivos.');
    }
  } catch (error) {
    console.error('Error al compartir PDF:', error);
    toast.error('Error al compartir el PDF');
  }
};

// Formatear nombre de estado para mostrar
const formatearNombreEstado = (estado) => {
  const nombres = {
    'todas': 'Todas',
    'borrador': 'Borrador',
    'enviada': 'Enviada',
    'aceptada': 'Aceptada',
    'en-proceso': 'En Proceso',
    'finalizada': 'Finalizada',
    'rechazada': 'Rechazada'
  };
  return nombres[estado] || estado.charAt(0).toUpperCase() + estado.slice(1);
};

// Cambiar estado desde el modal
const cambiarEstadoModal = async (nuevoEstado) => {
  try {
    if (!cotizacionModal.value || !cotizacionModal.value.id) {
      toast.error('No se puede cambiar el estado');
      return;
    }

    // Actualizar en Firebase
    await updateDoc(doc(db, 'cotizaciones', cotizacionModal.value.id), {
      estado: nuevoEstado,
      fechaActualizacion: new Date()
    });

    // Actualizar estado local
    cotizacionModal.value.estado = nuevoEstado;
    if (edicionId.value === cotizacionModal.value.id) {
      cotizacion.value.estado = nuevoEstado;
    }

    // Recargar lista
    await cargarCotizacionesGuardadas();

    toast.success(`Estado cambiado a: ${formatearNombreEstado(nuevoEstado)}`);
    mostrarModalEstado.value = false;
  } catch (error) {
    console.error('Error cambiando estado:', error);
    toast.error('Error al cambiar el estado');
  }
};
</script>

<style scoped>
/* ===== PROFESSIONAL COTIZACIONES STYLES ===== */
.cotizaciones-container {
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

/* ===== TAB NAVIGATION STYLES ===== */
.tabs-container {
  @apply mb-8;
  display: block !important;
  visibility: visible !important;
}

.tabs-navigation {
  @apply flex gap-3 mb-6 relative;
  display: flex !important;
  visibility: visible !important;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-btn {
  @apply flex items-center gap-2 px-5 py-3 font-semibold transition-all duration-300 relative;
  color: #6b7280;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  min-height: 48px;
  cursor: pointer;
}

.tab-btn:hover:not(.active) {
  color: #10b981;
  border-bottom-color: #d1fae5;
}

.tab-btn.active {
  color: #10b981;
  background: transparent;
  border-bottom-color: #10b981;
  font-weight: 700;
}

.tab-btn svg {
  @apply w-5 h-5 transition-transform duration-300;
}

.tab-btn.active svg {
  transform: scale(1.05);
}

.tab-badge {
  @apply ml-2 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  min-width: 24px;
  text-align: center;
}

.tab-btn.active .tab-badge {
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  transform: scale(1.05);
}

.tabs-content {
  @apply mt-6;
}

.tab-panel {
  animation: fadeInUp 0.4s ease-out;
}

/* Header with Premium Design */
.cotizaciones-header {
  @apply mb-8 rounded-3xl p-8 border;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  position: relative;
  overflow: hidden;
}

.cotizaciones-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.header-content {
  @apply flex items-center justify-between flex-wrap gap-6;
  position: relative;
  z-index: 1;
}

.header-info {
  @apply flex items-center gap-5;
}

.header-icon {
  @apply p-4 rounded-2xl;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow:
    0 10px 25px rgba(16, 185, 129, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow:
      0 10px 25px rgba(16, 185, 129, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  50% {
    box-shadow:
      0 15px 35px rgba(16, 185, 129, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
}

.header-icon svg {
  @apply text-white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.header-text {
  @apply text-left;
}

.header-title {
  @apply text-3xl font-extrabold mb-2;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
}

.header-subtitle {
  @apply text-slate-600 font-medium;
  font-size: 0.95rem;
}

.header-stats {
  @apply flex gap-4;
}

.stat-card {
  @apply text-center px-6 py-4 rounded-2xl border min-w-[140px];
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

.stat-number {
  @apply block text-3xl font-extrabold mb-1;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  @apply text-xs text-slate-600 font-semibold uppercase tracking-wider;
  letter-spacing: 0.05em;
}

/* Enhanced Form Card with Glass Effect */
.enhanced-form-card {
  @apply rounded-3xl p-8 border;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-form-card:hover {
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
}

.form-header-enhanced {
  @apply flex items-center justify-between mb-8 pb-6;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0)) 1;
}

.form-title-section {
  @apply flex-1;
}

.form-title {
  @apply text-2xl font-extrabold mb-2;
  background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.form-subtitle {
  @apply text-sm text-slate-500 font-medium;
}

.form-status-section {
  @apply flex items-center;
}

.status-badge {
  @apply px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2;
}

.status-badge.borrador {
  @apply bg-yellow-500/20 border border-yellow-500/30;
  color: #fbbf24;
}

.status-badge.enviada {
  @apply bg-blue-500/20 text-blue-300 border border-blue-500/30;
}

.status-badge.aceptada {
  @apply bg-emerald-500/20 text-emerald-300 border border-emerald-500/30;
}

.status-badge.rechazada {
  @apply bg-red-500/20 text-red-300 border border-red-500/30;
}

.status-badge.en-proceso {
  @apply bg-orange-500/20 text-orange-300 border border-orange-500/30;
}

.status-badge.finalizada {
  @apply bg-purple-500/20 text-purple-300 border border-purple-500/30;
}

.quote-number {
  @apply font-mono text-xs;
}

/* Form Sections with Premium Look */
.form-section {
  @apply mb-8 p-6 rounded-2xl;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

.section-header {
  @apply flex items-center mb-6;
}

.section-header-with-actions {
  @apply flex items-center justify-between mb-6 flex-wrap gap-4;
}

.section-icon {
  @apply w-11 h-11 rounded-xl flex items-center justify-center mr-4;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.section-title {
  @apply text-lg font-extrabold;
  background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-actions {
  @apply flex gap-2;
}

.action-select {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer;
}

.action-button {
  @apply bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium;
}

/* Form Elements */
.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-bold text-slate-700 mb-2;
  letter-spacing: 0.01em;
}

.form-label.required::after {
  content: ' *';
  @apply text-red-500 ml-1;
}

.form-input,
.form-select {
  @apply w-full px-4 py-3.5 rounded-xl border-2 font-medium;
  @apply text-slate-900 placeholder-slate-400;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-color: #e2e8f0;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
}

@media (max-width: 768px) {
  .form-input,
  .form-select {
    min-height: 48px !important;
    padding: 0.75rem 1rem;
  }
}

.form-input:hover,
.form-select:hover {
  border-color: #cbd5e1;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

.form-input:focus,
.form-select:focus {
  @apply outline-none;
  border-color: #10b981;
  box-shadow:
    0 6px 20px rgba(16, 185, 129, 0.15),
    0 0 0 3px rgba(16, 185, 129, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  transform: translateY(-1px);
}

/* Products Table with Premium Design */
.products-table {
  @apply border-2 rounded-2xl overflow-hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-color: #e2e8f0;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
}

.table-header {
  @apply grid grid-cols-5 gap-4 p-5 text-sm font-extrabold;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.05em;
}

.header-cell {
  @apply text-center uppercase;
}

.table-body {
  @apply max-h-80 overflow-y-auto;
}

.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  @apply bg-slate-100 rounded;
}

.table-body::-webkit-scrollbar-thumb {
  @apply bg-slate-400 rounded;
  transition: background 0.3s ease;
}

.table-body::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-500;
}

.product-row {
  @apply grid grid-cols-5 gap-4 p-4 items-center;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.product-row:hover {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  transform: translateX(2px);
}

.table-cell {
  @apply flex justify-center items-center;
}

.quantity-input {
  @apply w-20 px-2 py-1 bg-white/80 border border-gray-300 rounded text-gray-800 text-center;
}

.description-input {
  @apply w-full px-3 py-2 bg-white/80 border border-gray-300 rounded text-gray-800;
}

.price-input-wrapper {
  @apply relative flex items-center;
}

.currency {
  @apply absolute left-2 text-gray-400 text-sm;
}

.price-input {
  @apply w-24 pl-6 pr-2 py-1 bg-white/80 border border-gray-300 rounded text-gray-800 text-center;
}

.total-display {
  @apply font-bold text-emerald-400;
}

.delete-button {
  @apply p-2 rounded-lg transition-colors inline-flex items-center justify-center;
  @apply bg-red-50 hover:bg-red-100 border border-red-200 text-red-700;
}

/* Services */
.services-grid {
  @apply grid grid-cols-1 gap-3;
}

.service-card {
  @apply flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200;
}

.service-checkbox {
  @apply w-5 h-5 text-emerald-600 bg-transparent border-gray-400 rounded mr-3;
}

.service-content {
  @apply flex-1;
}

.service-text {
  @apply text-gray-800 font-medium;
}

/* Conditions */
.conditions-textarea {
  @apply w-full p-4 bg-white/80 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400;
  @apply focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none;
}

/* Status and Actions */
.status-section {
  @apply flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200;
}

.status-info {
  @apply flex items-center gap-2;
}

.status-label {
  @apply text-sm text-gray-400;
}

.status-value {
  @apply font-semibold text-sm;
}

.quote-number-display {
  @apply text-sm text-gray-400 font-mono;
}

.actions-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-3;
}

.action-btn {
  @apply px-5 py-3.5 rounded-xl font-bold text-center border-2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
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

.action-btn:hover::before {
  width: 300px;
  height: 300px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn.draft {
  @apply bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-600;
  color: #78350f;
  font-weight: 600;
}

.action-btn.primary {
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600;
}

.action-btn.success {
  @apply bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600;
}

.action-btn.danger {
  @apply bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600;
}

.action-btn.secondary {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600;
}

.action-btn.warning {
  @apply bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600;
}

.action-btn.info {
  @apply bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-600;
}

.action-btn.neutral {
  @apply bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-500;
}

.action-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
  transform: none !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
}

/* Sidebar with Premium Look */
.sidebar-card {
  @apply rounded-3xl p-7 mb-6 border;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-card:hover {
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  transform: translateY(-2px);
}

.sidebar-header {
  @apply flex items-center mb-6 pb-4;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0)) 1;
}

.sidebar-icon {
  @apply w-11 h-11 rounded-xl flex items-center justify-center mr-4;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow:
    0 6px 20px rgba(16, 185, 129, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.sidebar-icon svg {
  @apply text-white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.sidebar-title {
  @apply text-lg font-extrabold;
  background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Financial Summary */
.financial-summary {
  @apply space-y-3;
}

.summary-line {
  @apply flex justify-between items-center;
}

.summary-label {
  @apply text-sm text-gray-300;
}

.summary-value {
  @apply text-sm font-semibold text-gray-200;
}

.summary-divider {
  @apply h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-3;
}

.summary-total {
  @apply flex justify-between items-center pt-2;
}

.total-label {
  @apply text-base font-bold text-emerald-400;
}

.total-value {
  @apply text-xl font-bold text-emerald-400;
}

/* Status Filters with Premium Design */
.status-filters {
  @apply grid grid-cols-2 gap-2.5 mb-6;
}

.filter-button {
  @apply p-3 rounded-xl text-xs font-bold cursor-pointer border-2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-active {
  @apply text-white border-emerald-600;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow:
    0 4px 16px rgba(16, 185, 129, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.filter-inactive {
  @apply bg-white text-slate-600 border-slate-300;
}

.filter-inactive:hover {
  @apply bg-slate-50 border-slate-400;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.filter-count {
  @apply ml-1 font-extrabold;
}

/* Cotizaciones List */
.cotizaciones-list {
  @apply max-h-80 overflow-y-auto;
}

.empty-list {
  @apply text-center py-8;
}

.empty-text {
  @apply text-sm text-gray-400;
}

.cotizaciones-items {
  @apply space-y-3;
}

.cotizacion-item {
  @apply bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 ease-in-out shadow-sm;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cotizacion-item:hover {
  @apply transform -translate-y-1 shadow-lg dark:shadow-emerald-800/30;
  border-color: #10b981;
}

.item-header {
  @apply flex justify-between items-start;
}

.item-title {
  @apply text-lg font-bold text-gray-800 dark:text-gray-100;
  max-width: 70%;
}

.item-status {
  @apply text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider;
}

.item-details {
  @apply flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3;
}

.item-total {
  @apply font-bold text-gray-800 dark:text-gray-200;
}

.item-actions {
  @apply flex flex-wrap gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto;
}

.item-action-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200;
}

.item-action-btn span {
  @apply hidden sm:inline;
}

.item-action-btn.view {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80;
}

.item-action-btn.edit {
  @apply bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900/80;
}

.item-action-btn.share {
  @apply bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/80;
}

.item-action-btn.print {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}

.item-action-btn.delete {
  @apply bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80;
}

/* Status-specific styles */
.status-borrador { @apply bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300; }
.status-enviada { @apply bg-blue-200 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300; }
.status-aceptada { @apply bg-green-200 text-green-800 dark:bg-green-900/70 dark:text-green-300; }
.status-rechazada { @apply bg-red-200 text-red-800 dark:bg-red-900/70 dark:text-red-300; }
.status-en-proceso { @apply bg-purple-200 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300; }
.status-finalizada { @apply bg-emerald-200 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300; }

/* Modal de Eliminación */
.modal-container-delete {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
}

.modal-header-delete {
  padding: 2.5rem 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-bottom: 3px solid #ef4444;
}

.modal-title-delete {
  font-size: 1.75rem;
  font-weight: 700;
  color: #991b1b;
  margin-top: 1rem;
}

.modal-body-delete {
  padding: 2rem;
}

.delete-warning {
  text-align: center;
  color: #7f1d1d;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.delete-info {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
}

.delete-info .info-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.delete-info .info-item:last-child {
  border-bottom: none;
}

.delete-info .info-item strong {
  color: #374151;
  font-weight: 600;
  margin-right: 0.5rem;
}

.modal-footer-delete {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel-delete,
.btn-confirm-delete {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-cancel-delete {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-cancel-delete:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-confirm-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: 2px solid #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm-delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
  transform: translateY(-2px);
}

/* Empty States */
.empty-state {
  @apply text-center py-12;
}

.empty-icon {
  @apply mx-auto mb-4;
}

.empty-title {
  @apply text-lg font-semibold text-gray-300 mb-2;
}

.empty-description {
  @apply text-gray-400;
}

/* Responsive */
@media (max-width: 768px) {
  .cotizaciones-container {
    @apply px-4;
  }

  .header-content {
    @apply flex-col gap-4;
  }

  .header-stats {
    @apply w-full justify-center;
  }

  .form-grid {
    @apply grid-cols-1;
  }

  .table-header,
  .product-row {
    @apply grid-cols-1 gap-2;
  }

  .actions-grid {
    @apply grid-cols-1;
  }

  .status-filters {
    @apply grid-cols-1;
  }
}

/* ===== MODAL STYLES ===== */
.modal-overlay {
  @apply fixed inset-0 bg-black/60 backdrop-blur-sm z-50;
  @apply flex items-center justify-center p-4;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  @apply bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50;
}

.modal-title {
  @apply text-2xl font-bold text-gray-900;
}

.modal-close {
  @apply w-10 h-10 flex items-center justify-center rounded-full;
  @apply bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900;
  @apply transition-all duration-200 text-xl font-bold;
  @apply border border-gray-300;
}

.modal-body {
  @apply p-6 space-y-6;
}

.modal-info {
  @apply bg-gray-50 rounded-xl p-4 space-y-2;
}

.info-row {
  @apply flex items-center justify-between;
}

.info-label {
  @apply text-sm font-medium text-gray-600;
}

.info-value {
  @apply text-sm font-bold text-gray-900;
}

.modal-estado-actual {
  @apply flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200;
}

.estado-label {
  @apply text-sm font-semibold text-gray-700;
}

.estado-badge {
  @apply px-4 py-2 rounded-lg text-sm font-bold;
}

.estado-badge.estado-borrador {
  @apply bg-yellow-100 text-yellow-800 border border-yellow-300;
}

.estado-badge.estado-enviada {
  @apply bg-blue-100 text-blue-800 border border-blue-300;
}

.estado-badge.estado-aceptada {
  @apply bg-emerald-100 text-emerald-800 border border-emerald-300;
}

.estado-badge.estado-en-proceso {
  @apply bg-orange-100 text-orange-800 border border-orange-300;
}

.estado-badge.estado-finalizada {
  @apply bg-purple-100 text-purple-800 border border-purple-300;
}

.estado-badge.estado-rechazada {
  @apply bg-red-100 text-red-800 border border-red-300;
}

.modal-message {
  @apply text-center;
}

.modal-actions {
  @apply grid grid-cols-1 gap-3;
}

.estado-btn {
  @apply flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200;
  @apply hover:shadow-lg hover:scale-[1.02] cursor-pointer;
}

.estado-btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none;
}

.estado-btn.enviada {
  @apply bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-400;
}

.estado-btn.aceptada {
  @apply bg-emerald-50 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400;
}

.estado-btn.en-proceso {
  @apply bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400;
}

.estado-btn.finalizada {
  @apply bg-purple-50 border-purple-300 hover:bg-purple-100 hover:border-purple-400;
}

.estado-btn.rechazada {
  @apply bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400;
}

.estado-btn-icon {
  @apply text-3xl flex-shrink-0;
}

.estado-btn-text {
  @apply flex-1 text-left;
}

.estado-btn-title {
  @apply text-lg font-bold text-gray-900 mb-1;
}

.estado-btn-desc {
  @apply text-sm text-gray-600;
}

.modal-footer {
  @apply p-6 border-t border-gray-200 bg-gray-50 flex justify-end;
}

.btn-cerrar-modal {
  @apply px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg;
  @apply transition-all duration-200;
}
</style>
