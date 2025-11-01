# 🎨 Tema Premium - Material Design 3

## ✨ Descripción General

El **Tema Premium** es un tema exclusivo basado en **Material Design 3** (Material You) que incorpora:

- 🌿 **Paleta de colores**: Tonos claros verdes y azules
- 🔲 **Contornos redondeados**: Bordes suaves siguiendo los tokens de Material Design 3
- 🎯 **Animaciones sutiles**: Transiciones con curvas de Bézier optimizadas
- 📱 **Responsive**: Adaptación completa a dispositivos móviles y desktop

## 🎨 Paleta de Colores

### Colores Primarios
- **Primary**: `#66bb6a` (Verde Material Design 3)
- **Primary Light**: `#a5d6a7` (Verde claro)  
- **Primary Dark**: `#43a047` (Verde oscuro)

### Colores Secundarios
- **Secondary**: `#64b5f6` (Azul Material Design 3)
- **Secondary Light**: `#90caf9` (Azul claro)
- **Secondary Dark**: `#42a5f5` (Azul oscuro)

### Colores de Superficie
- **Surface**: `#f8fafc` (Superficie principal)
- **Surface Variant**: `#f2f5f7` (Superficie variante)
- **Surface Container**: `#eef2f6` (Contenedor superficie)

### Colores de Contorno
- **Outline**: `#bdc8d2` (Contorno principal)
- **Outline Variant**: `#e0e6eb` (Contorno variante)

## 🔧 Configuración Técnica

### Activación del Tema
```javascript
import { useTheme } from '@/composables/useTheme'

const { setTheme, isPremium } = useTheme()

// Activar tema premium
setTheme('premium')
```

### Variables CSS Disponibles
```css
/* Colores principales */
--primary-color: 102, 187, 106
--secondary-color: 100, 181, 246
--surface-color: 248, 250, 252
--outline-color: 189, 200, 210

/* Colores de texto */
--on-primary: 255, 255, 255
--on-surface: 28, 35, 42
--on-surface-variant: 67, 79, 89
```

## 🎯 Tokens de Diseño

### Border Radius (Contornos Redondeados)
```css
/* Tokens semánticos */
--border-radius-button: 1.25rem    /* 20px - Botones */
--border-radius-card: 1rem         /* 16px - Cards */
--border-radius-input: 0.75rem     /* 12px - Inputs */
--border-radius-dialog: 1.75rem    /* 28px - Modales */

/* Tokens por tamaño de contenedor */
--border-radius-container-xs: 0.5rem   /* 8px */
--border-radius-container-sm: 0.75rem  /* 12px */
--border-radius-container-md: 1rem     /* 16px */
--border-radius-container-lg: 1.5rem   /* 24px */
```

### Elevaciones Material Design 3
```css
--md-elevation-1: 0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)
--md-elevation-2: 0px 1px 2px rgba(0, 0, 0, 0.05), 0px 2px 6px rgba(0, 0, 0, 0.1)
--md-elevation-3: 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.08)
```

## 🧩 Componentes Estilizados

### Botones
```html
<!-- Botón primario -->
<button class="btn-primary">Primary Button</button>

<!-- Botón secundario -->
<button class="btn-secondary">Secondary Button</button>

<!-- Botón outlined -->
<button class="btn-outlined">Outlined Button</button>

<!-- Botón text -->
<button class="btn-text">Text Button</button>

<!-- FAB (Floating Action Button) -->
<button class="fab">
  <PlusIcon />
</button>

<!-- FAB Extended -->
<button class="fab-extended">
  <Icon />
  <span>Texto</span>
</button>
```

### Cards
```html
<!-- Card regular -->
<div class="card">Contenido</div>

<!-- Card elevada -->
<div class="card-elevated">Contenido</div>

<!-- Card compacta -->
<div class="card-compact">Contenido</div>

<!-- Card espaciosa -->
<div class="card-spacious">Contenido</div>
```

### Inputs y Formularios
```html
<!-- Input regular -->
<input type="text" class="input-field" placeholder="Texto">

<!-- Input outlined -->
<input type="text" class="input-outlined" placeholder="Texto">

<!-- Select -->
<select class="input-field">
  <option>Opción 1</option>
</select>

<!-- Textarea -->
<textarea class="input-field" placeholder="Descripción"></textarea>

<!-- Input con error -->
<input type="email" class="input-field error" placeholder="Email">
```

### Navegación
```html
<!-- Nav items -->
<div class="nav-item">
  <Icon />
  <span>Texto</span>
</div>

<div class="nav-item active">
  <Icon />
  <span>Activo</span>
</div>

<!-- Container de navegación -->
<nav class="nav-container">
  <!-- Items de navegación -->
</nav>
```

### Chips y Badges
```html
<!-- Chip regular -->
<span class="chip">
  <Icon />
  Texto
</span>

<!-- Chip seleccionado -->
<span class="chip selected">
  <Icon />
  Seleccionado
</span>

<!-- Badge -->
<span class="badge">3</span>

<!-- Badge secundario -->
<span class="badge-secondary">12</span>
```

## 🎪 Showcase y Demostración

Para ver todos los componentes en acción, visita la página de demostración:

```
http://localhost:5173/theme-showcase
```

La página incluye:
- ✅ Todos los tipos de botones
- ✅ Variaciones de cards
- ✅ Inputs y formularios completos
- ✅ Elementos de navegación
- ✅ Chips y badges
- ✅ Paleta de colores completa
- ✅ Toggle entre temas para comparar

## 🔄 Integración con el Sistema de Temas

### Detección del Tema Activo
```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { isPremium, currentTheme } = useTheme()
</script>

<template>
  <div v-if="isPremium">
    <!-- Contenido específico del tema premium -->
  </div>
</template>
```

### Clases Condicionales
```vue
<template>
  <div :class="{'premium-specific': isPremium}">
    Contenido
  </div>
</template>
```

## 🎭 Animaciones y Transiciones

### Curva de Bézier Optimizada
```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
```

### Animaciones Incluidas
- **Hover Effects**: Elevación sutil en botones y cards
- **Focus States**: Rings y borders animados en inputs
- **State Layers**: Efectos de overlay en interacciones
- **Scale Animations**: Feedback táctil en botones

## 📱 Responsive Design

### Adaptaciones Móviles
- Bordes menos redondeados en pantallas pequeñas
- Tamaños de botones optimizados para táctil (min 44px)
- Espaciado reducido en cards
- Typography escalada apropiadamente

### Breakpoints
```css
/* Móvil */
@media (max-width: 768px) {
  /* Adaptaciones específicas */
}
```

## 🚀 Optimizaciones de Performance

### CSS Custom Properties
- Uso de variables CSS para cambios dinámicos
- Valores precalculados para animaciones
- Minimal repainting y reflow

### Transiciones Suaves
- Hardware acceleration cuando es posible
- Uso de `transform` en lugar de cambios de layout
- Debouncing en efectos hover

## 🔧 Personalización Avanzada

### Sobrescribir Colores
```css
[data-theme="premium"] {
  --primary-color: tu-color-personalizado;
}
```

### Agregar Nuevos Componentes
```css
[data-theme="premium"] .mi-componente {
  background: rgb(var(--surface-container));
  border: 1px solid rgb(var(--outline-variant));
  border-radius: 1rem;
  /* Más estilos siguiendo el patrón */
}
```

## 🎯 Best Practices

1. **Consistencia**: Usa siempre los tokens de diseño definidos
2. **Accesibilidad**: Mantén contraste suficiente en todos los elementos
3. **Performance**: Evita animaciones innecesarias en elementos complejos
4. **Responsividad**: Prueba en diferentes dispositivos
5. **Semántica**: Usa las clases correctas según el tipo de contenido

---

## 🏆 Resultado Final

El tema Premium ofrece una experiencia visual moderna, consistente y accesible, siguiendo las mejores prácticas de Material Design 3 con una identidad única basada en verdes y azules claros.

**Características destacadas:**
- ✨ Diseño cohesivo en todos los componentes
- 🎨 Paleta de colores armoniosa
- 🔄 Animaciones fluidas y profesionales
- 📱 Totalmente responsive
- ⚡ Optimizado para rendimiento
- ♿ Accesible por diseño

Para cualquier personalización adicional o nuevos componentes, seguir los patrones establecidos en este sistema de diseño.