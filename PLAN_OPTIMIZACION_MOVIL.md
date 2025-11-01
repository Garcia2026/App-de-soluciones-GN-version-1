# PLAN DE OPTIMIZACIÓN MÓVIL - GN Jardinería
**Fecha:** 24 de Octubre 2025
**Versión:** 1.0

---

## FASE 1: PROBLEMAS CRÍTICOS (ALTA PRIORIDAD) ⚡

### 1.1 Touch Targets - Garantizar 44x44px mínimo (1 hora)

**Archivos a modificar:**
- `src/views/Tiendas.vue` (líneas 291-296)
- `src/views/Cobros.vue` (múltiples botones)
- `src/views/Dashboard.vue` (botones de acción)
- `src/styles/mobile.css` (agregar regla global)

**Cambios específicos:**

```css
/* Agregar en mobile.css */
@media (max-width: 768px) {
  button:not(.skip-mobile-min),
  .btn,
  .btn-action,
  a.button {
    min-height: 44px !important;
    min-width: 44px !important;
    touch-action: manipulation;
  }
}

@media (max-width: 640px) {
  button:not(.skip-mobile-min),
  .btn {
    min-height: 48px !important;
    min-width: 48px !important;
  }
}
```

**En Tiendas.vue - Actualizar botones editar/eliminar:**
```html
<!-- Reemplazar líneas 291-296 -->
<button @click="abrirModal(tienda)"
        class="action-btn-mobile btn-edit"
        title="Editar tienda"
        aria-label="Editar tienda">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
</button>
<button @click="confirmarEliminar(tienda)"
        class="action-btn-mobile btn-delete"
        title="Eliminar tienda"
        aria-label="Eliminar tienda">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
</button>
```

**CSS para botones de acción móvil:**
```css
/* Agregar en Tiendas.vue <style> */
@media (max-width: 768px) {
  .action-btn-mobile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px !important;
    min-height: 44px !important;
    padding: 10px !important;
    border-radius: 8px;
    transition: all 0.2s;
    touch-action: manipulation;
  }

  .btn-edit {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .btn-delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  .action-btn-mobile svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 640px) {
  .action-btn-mobile {
    min-width: 48px !important;
    min-height: 48px !important;
  }
}
```

---

### 1.2 Gráficos con altura responsive (1-2 horas)

**Archivos a modificar:**
- `src/views/Dashboard.vue` (líneas 174-177, 596-670, 1274-1277)
- `src/views/Finanzas.vue` (todos los Chart.js)

**En Dashboard.vue - Actualizar .chart-container:**
```css
/* Buscar líneas 1274-1277 y reemplazar con: */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

@media (max-width: 1024px) {
  .chart-container {
    height: 280px !important;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px !important;
  }
}

@media (max-width: 640px) {
  .chart-container {
    height: 220px !important;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 200px !important;
  }
}

@media (max-width: 375px) {
  .chart-container {
    height: 180px !important;
  }
}
```

**En Finanzas.vue - Agregar wrapper para gráficos:**
```html
<!-- Envolver cada gráfico con: -->
<div class="chart-wrapper-responsive">
  <div class="chart-container-mobile">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</div>
```

```css
/* Agregar CSS: */
.chart-wrapper-responsive {
  width: 100%;
  overflow: hidden;
}

.chart-container-mobile {
  position: relative;
  width: 100%;
  height: 400px;
}

@media (max-width: 1024px) {
  .chart-container-mobile {
    height: 320px;
  }
}

@media (max-width: 768px) {
  .chart-container-mobile {
    height: 280px;
  }
}

@media (max-width: 640px) {
  .chart-container-mobile {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .chart-container-mobile {
    height: 200px;
  }
}
```

---

### 1.3 Tablas - Crear versión móvil card-based (2-3 horas)

**Archivos a modificar:**
- `src/views/Tiendas.vue` (líneas 324-468)
- `src/views/Cobros.vue` (líneas 225-296)

**TIENDAS.VUE - Ya tiene versión móvil (líneas 324-468), solo optimizar:**
```css
/* Agregar/mejorar en Tiendas.vue */
@media (max-width: 640px) {
  .glass-card-premium {
    padding: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }

  /* Mejorar legibilidad del header */
  .glass-card-premium h3 {
    font-size: 0.95rem !important;
    line-height: 1.3 !important;
  }

  /* Mejorar tamaño de precio */
  .glass-card-premium .text-xl {
    font-size: 1.125rem !important;
  }
}

@media (max-width: 480px) {
  .glass-card-premium {
    padding: 0.625rem !important;
  }
}
```

**COBROS.VUE - Crear versión móvil (CRÍTICO):**

Insertar después de la línea 224 (antes de la tabla desktop):
```html
<!-- Vista Mobile para Cobros -->
<div class="lg:hidden space-y-3">
  <!-- Loading State -->
  <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
    <div class="loader-ring mb-4">
      <div></div><div></div><div></div><div></div>
    </div>
    <p class="text-gray-400">Cargando cobros...</p>
  </div>

  <!-- Empty State -->
  <div v-else-if="cobrosFiltrados.length === 0" class="flex flex-col items-center justify-center py-12">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p class="text-gray-400 text-center">No se encontraron cobros</p>
  </div>

  <!-- Cards List -->
  <div v-else v-for="(cobro, index) in cobrosFiltrados" :key="cobro.id || index"
       class="cobro-card-mobile">

    <!-- Header -->
    <div class="cobro-card-header">
      <div class="flex-1">
        <h3 class="cobro-cliente">{{ cobro.cliente }}</h3>
        <p class="cobro-ods" v-if="cobro.ods">ODS: {{ cobro.ods }}</p>
      </div>
      <div class="cobro-monto">Q{{ (cobro.monto || 0).toFixed(2) }}</div>
    </div>

    <!-- Body -->
    <div class="cobro-card-body">
      <div class="cobro-info-row">
        <span class="label">Marca:</span>
        <span class="value">{{ cobro.marca || 'N/A' }}</span>
      </div>
      <div class="cobro-info-row">
        <span class="label">Vence:</span>
        <span class="value" :class="getVencimientoClass(cobro)">
          {{ formatearFecha(calcularFechaVencimiento(cobro.fecha, cobro.diasCredito)) }}
        </span>
      </div>
      <div class="cobro-info-row">
        <span class="label">Estado:</span>
        <span class="badge" :class="getCobroStatusClass(calcularEstadoCobro(cobro))">
          {{ calcularEstadoCobro(cobro) }}
        </span>
      </div>
      <div v-if="cobro.estadoProcesoTienda" class="cobro-info-row">
        <span class="label">Proceso:</span>
        <span class="badge badge-proceso" :class="getProcessStatusClass(cobro.estadoProcesoTienda)">
          {{ cobro.estadoProcesoTienda }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="cobro-card-actions">
      <button @click="verDetallesCobro(cobro)" class="btn-secondary-mobile">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Ver
      </button>
      <button v-if="calcularEstadoCobro(cobro) === 'Pendiente'"
              @click="abrirModalFacturacion(cobro)"
              class="btn-primary-mobile">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Facturar
      </button>
      <button v-else-if="calcularEstadoCobro(cobro) === 'Facturado'"
              @click="registrarPago(cobro)"
              class="btn-success-mobile">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Pagar
      </button>
    </div>
  </div>
</div>
```

**CSS para cards móviles de Cobros:**
```css
/* Agregar en Cobros.vue <style> */
@media (max-width: 1024px) {
  .table-section-premium {
    display: none;
  }
}

.cobro-card-mobile {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.cobro-card-mobile:active {
  transform: scale(0.98);
}

.cobro-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.cobro-cliente {
  font-weight: 700;
  color: #051f20;
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
}

.cobro-ods {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.cobro-monto {
  font-weight: 800;
  color: #16a34a;
  font-size: 1.25rem;
  white-space: nowrap;
}

.cobro-card-body {
  margin-bottom: 1rem;
}

.cobro-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  border-bottom: 1px solid #f9fafb;
}

.cobro-info-row:last-child {
  border-bottom: none;
}

.cobro-info-row .label {
  font-weight: 600;
  color: #6b7280;
}

.cobro-info-row .value {
  color: #051f20;
  font-weight: 500;
  text-align: right;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
}

.badge-proceso {
  font-size: 0.7rem;
}

.cobro-card-actions {
  display: flex;
  gap: 0.5rem;
}

.cobro-card-actions button {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  touch-action: manipulation;
}

.btn-secondary-mobile {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary-mobile:active {
  background: #d1d5db;
}

.btn-primary-mobile {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-primary-mobile:active {
  opacity: 0.9;
}

.btn-success-mobile {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-success-mobile:active {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .cobro-card-mobile {
    padding: 0.875rem;
  }

  .cobro-card-actions button {
    min-height: 48px;
    font-size: 0.8125rem;
  }

  .cobro-card-actions button svg {
    width: 18px;
    height: 18px;
  }
}
```

---

## FASE 2: PROBLEMAS MEDIOS (MEDIA PRIORIDAD) 🟡

### 2.1 Padding excesivo en cards - Dashboard (30 min)

**Archivo:** `src/views/Dashboard.vue`

```css
/* Buscar .flight-card y agregar: */
@media (max-width: 768px) {
  .flight-card {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .flight-card {
    padding: 0.875rem !important;
  }
}

@media (max-width: 375px) {
  .flight-card {
    padding: 0.75rem !important;
  }
}
```

### 2.2 KPI Cards - Ajustar tamaños (30 min)

**Archivos:** `src/views/Cobros.vue`, `src/views/Finanzas.vue`

```css
@media (max-width: 768px) {
  .kpi-card-premium {
    padding: 1rem !important;
  }

  .kpi-title {
    font-size: 0.875rem !important;
  }

  .kpi-amount {
    font-size: 1.25rem !important;
  }

  .kpi-subtitle {
    font-size: 0.8rem !important;
  }
}

@media (max-width: 480px) {
  .kpi-icon {
    width: 36px !important;
    height: 36px !important;
  }

  .kpi-amount {
    font-size: 1.125rem !important;
  }
}
```

### 2.3 Formulario Cotizaciones - Inputs más grandes (1 hora)

**Archivo:** `src/views/Cotizaciones.vue`

```css
@media (max-width: 768px) {
  .form-input,
  .form-select,
  .form-textarea {
    min-height: 44px !important;
    font-size: 16px !important; /* Prevenir zoom iOS */
    padding: 0.75rem 1rem !important;
  }

  .form-label {
    font-size: 0.875rem !important;
    margin-bottom: 0.375rem !important;
  }
}

@media (max-width: 480px) {
  .form-group {
    margin-bottom: 1rem !important;
  }

  .form-input,
  .form-select {
    border-radius: 8px !important;
  }
}
```

### 2.4 Tabs con indicador de scroll (30 min)

**Archivo:** `src/views/Tiendas.vue`

```css
/* Agregar scrollbar visible en tabs */
.flex.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.flex.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.flex.overflow-x-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.flex.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
```

---

## FASE 3: PROBLEMAS BAJOS (BAJA PRIORIDAD) 🟢

### 3.1 Texto muy pequeño (30 min)

**Múltiples archivos:**

```css
/* Agregar regla global en mobile.css */
@media (max-width: 640px) {
  .text-xs {
    font-size: 0.8125rem !important; /* 13px en lugar de 12px */
  }

  .text-sm {
    font-size: 0.875rem !important; /* Mantener 14px */
  }
}
```

### 3.2 Variables CSS para 375px (30 min)

**Archivo:** `src/styles/mobile.css`

```css
/* Agregar al final del archivo */
@media (max-width: 375px) {
  :root {
    --mobile-page-padding: 0.75rem;
    --mobile-card-padding: 0.9rem;
    --mobile-card-gap: 0.7rem;
    --mobile-card-radius: 12px;
    --mobile-font-base: 13.5px;
  }

  .mobile-header {
    padding-block: 0.75rem;
  }

  .mobile-page-title {
    font-size: 1rem;
  }

  button:not(.skip-mobile-min),
  .btn {
    min-height: 44px !important;
  }
}
```

### 3.3 Pull-to-refresh más visible (30 min)

**Archivo:** `src/components/MainLayout.vue`

```css
.pull-refresh-indicator {
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom,
    rgba(16, 185, 129, 0.15) 0%,
    rgba(16, 185, 129, 0.05) 100%);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

@supports (padding: env(safe-area-inset-top)) {
  .pull-refresh-indicator {
    top: calc(-80px - env(safe-area-inset-top));
  }
}
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### ORDEN RECOMENDADO:

**Día 1 (4-5 horas):**
- [ ] 1.1 Touch Targets (1h) ⚡
- [ ] 1.2 Gráficos altura responsive (2h) 📊
- [ ] 2.1 Padding cards Dashboard (30min)
- [ ] 2.2 KPI Cards (30min)

**Día 2 (3-4 horas):**
- [ ] 1.3 Tablas móvil - Cobros.vue (2-3h) 📱
- [ ] 2.3 Formulario Cotizaciones (1h)

**Día 3 (1-2 horas):**
- [ ] 2.4 Tabs scroll indicator (30min)
- [ ] 3.1 Texto pequeño (30min)
- [ ] 3.2 Variables CSS 375px (30min)
- [ ] 3.3 Pull-to-refresh (30min)

**Total estimado:** 8-11 horas

---

## TESTING DESPUÉS DE CADA CAMBIO

### Dispositivos a testear:
- iPhone SE (375x667) - Más crítico
- iPhone 12 Pro (390x844)
- Samsung Galaxy S20 (360x800)
- iPad (768x1024)

### Herramientas:
1. Chrome DevTools Device Mode
2. Firefox Responsive Design Mode
3. Lighthouse Mobile Audit
4. BrowserStack (opcional)

### Checklist de testing:
- [ ] Touch targets mínimo 44x44px
- [ ] No scroll horizontal no deseado
- [ ] Texto legible (mínimo 14px)
- [ ] Gráficos visibles completamente
- [ ] Botones funcionan al primer toque
- [ ] Inputs no causan zoom en iOS (font-size ≥ 16px)
- [ ] Cards no se comprimen

---

## COMANDOS ÚTILES

```bash
# Development
npm run dev

# Build para producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting

# Limpiar cache
npm run clean

# Analizar bundle size
npm run build -- --analyze
```

---

## NOTAS IMPORTANTES

1. **Siempre testear en dispositivo real** - El emulador no detecta todos los problemas
2. **Font-size mínimo 16px en inputs** - Previene zoom automático en iOS
3. **Touch targets mínimo 44x44px** - Estándar de accesibilidad WCAG
4. **Usar `touch-action: manipulation`** - Elimina delay de 300ms en móvil
5. **Backup antes de cambios** - `git commit` antes de cada fase

---

## ARCHIVOS MODIFICADOS

### FASE 1 (Críticos):
- `src/styles/mobile.css`
- `src/views/Dashboard.vue`
- `src/views/Finanzas.vue`
- `src/views/Tiendas.vue`
- `src/views/Cobros.vue`

### FASE 2 (Medios):
- `src/views/Cotizaciones.vue`
- `src/views/Dashboard.vue`
- `src/views/Cobros.vue`
- `src/views/Finanzas.vue`

### FASE 3 (Bajos):
- `src/styles/mobile.css`
- `src/components/MainLayout.vue`

---

**ÚLTIMA ACTUALIZACIÓN:** 24/10/2025
**ESTADO:** Listo para implementación
**TIEMPO TOTAL ESTIMADO:** 8-11 horas
