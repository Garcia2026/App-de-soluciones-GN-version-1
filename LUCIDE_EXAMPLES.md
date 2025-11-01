# 🍎 LUCIDE ICONS - ESTILO iOS MODERNO

## ✨ ICONOS YA INSTALADOS Y LISTOS

### 🔄 ThemeToggle (Ya implementado)
```vue
<Sun :size="20" />  <!-- Sol estilo iOS -->
<Moon :size="20" /> <!-- Luna estilo iOS -->
```

## 🎯 ICONOS RECOMENDADOS PARA TU APP

### 📊 FINANZAS Y DASHBOARD
```vue
import { 
  BarChart3,      // Gráficas (más moderno que svg)
  PieChart,       // Charts circulares 
  TrendingUp,     // Tendencias
  DollarSign,     // Dinero
  CreditCard,     // Pagos
  Wallet,         // Billetera
  Calculator,     // Calculadora
  Receipt,        // Recibos
  Building,       // Empresa
  Users           // Clientes
} from 'lucide-vue-next'
```

### 🏠 NAVEGACIÓN PRINCIPAL
```vue
import {
  Home,           // Dashboard (más limpio)
  FileText,       // Cotizaciones 
  DollarSign,     // Finanzas
  Store,          // Tiendas
  TrendingUp,     // Estadísticas
  Receipt,        // Cobros
  Plus,           // Agregar/Nueva cotización
  Menu,           // Menú hamburguesa
  X               // Cerrar
} from 'lucide-vue-next'
```

### ⚙️ ACCIONES Y BOTONES
```vue
import {
  Edit3,          // Editar (más suave que Edit)
  Trash2,         // Eliminar (más elegante)
  Eye,            // Ver detalles
  Download,       // Descargar
  Upload,         // Subir
  Search,         // Buscar
  Filter,         // Filtrar
  Settings,       // Configuración
  Bell,           // Notificaciones
  Check,          // Confirmación
  AlertCircle     // Alertas
} from 'lucide-vue-next'
```

## 🎨 EJEMPLO DE USO

### Antes (SVG manual):
```vue
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
</svg>
```

### Después (Lucide iOS):
```vue
<Plus :size="20" class="text-current" />
```

## 🚀 VENTAJAS LUCIDE

✅ **Estilo iOS nativo**
✅ **Consistencia total**
✅ **Tamaño optimizable**
✅ **Tree-shaking automático**
✅ **Colores heredados**
✅ **Animaciones suaves**

## 📱 RECOMENDACIÓN FINAL

Para tu app de finanzas estilo iOS corporativo:

```vue
<template>
  <div class="navigation">
    <Home :size="24" />        <!-- Dashboard -->
    <BarChart3 :size="24" />   <!-- Finanzas -->
    <FileText :size="24" />    <!-- Cotizaciones -->
    <Store :size="24" />       <!-- Tiendas -->
  </div>
</template>

<script setup>
import { Home, BarChart3, FileText, Store } from 'lucide-vue-next'
</script>
```

**¿Quieres que reemplace algunos iconos específicos en tu navegación?**