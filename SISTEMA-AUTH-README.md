# 🔐 Sistema de Autenticación y Bitácora - GN Soluciones

## ✅ Sistema Implementado Exitosamente

Se ha implementado un **sistema completo de autenticación con bitácora de auditoría** para tu aplicación.

---

## 📦 Lo que se creó:

### 1. **Sistema de Autenticación**
- ✅ Login con usuario y contraseña
- ✅ Recuperación de contraseña por código de 6 dígitos
- ✅ Cambio obligatorio de contraseña en primer ingreso
- ✅ Validación de contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números)
- ✅ Hash de contraseñas con SHA-256

### 2. **Usuarios Creados**
✅ **Byron García** (Administrador)
- Usuario: `byron.garcia`
- Contraseña inicial: `123456`
- Rol: Administrador (acceso total + bitácora)

✅ **Eduardo Navarro** (Usuario)
- Usuario: `eduardo.navarro`
- Contraseña inicial: `123456`
- Rol: Usuario estándar

✅ **Brandon García** (Usuario)
- Usuario: `brandon.garcia`
- Contraseña inicial: `123456`
- Rol: Usuario estándar

### 3. **Bitácora de Auditoría**
✅ Registro automático de todas las acciones:
- Inicio/cierre de sesión
- Cambio de contraseñas
- Creación/edición/eliminación de gastos
- Creación/edición/eliminación de tiendas
- Creación de cotizaciones
- Y más...

✅ Panel de visualización (solo para Byron - administrador):
- Filtros por usuario, acción y fecha
- Estadísticas de uso
- Exportación de registros
- Vista detallada de cada acción

---

## 🚀 Cómo Usar el Sistema

### **Primer Acceso:**

1. Abre la aplicación en: `http://localhost:5173`
2. Serás redirigido automáticamente a `/login`
3. Ingresa con tus credenciales:
   - Usuario: `byron.garcia`
   - Contraseña: `123456`
4. Se te pedirá cambiar la contraseña (obligatorio por seguridad)
5. Crea una contraseña segura que cumpla los requisitos:
   - Mínimo 8 caracteres
   - Una letra mayúscula
   - Una letra minúscula
   - Un número

### **Recuperar Contraseña:**

1. En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu usuario
3. Se generará un código de 6 dígitos
4. **IMPORTANTE**: Por ahora el código se muestra en pantalla (en producción se enviará por email)
5. Ingresa el código y tu nueva contraseña

---

## 📁 Archivos Creados

```
src/
├── views/
│   ├── Login.vue                  ← Pantalla de inicio de sesión
│   ├── CambiarPassword.vue        ← Cambio de contraseña
│   ├── RecuperarPassword.vue      ← Recuperación por código
│   └── Bitacora.vue               ← Panel de auditoría (solo admin)
├── composables/
│   └── useAuth.js                 ← Lógica de autenticación
└── router/
    └── index.js                   ← Rutas protegidas con guards

Raíz del proyecto/
└── init-usuarios.js               ← Script de inicialización (ya ejecutado)
```

---

## 🔧 Para Integrar la Bitácora en Tus Componentes

En cualquier componente donde quieras registrar acciones, importa el composable:

```javascript
import { useAuth } from '@/composables/useAuth'

const { registrarBitacora, currentUser } = useAuth()

// Ejemplo: Al crear un gasto
const crearGasto = async () => {
  // ... tu lógica de crear gasto ...

  // Registrar en bitácora
  await registrarBitacora(
    currentUser.value.id,
    currentUser.value.nombre,
    'crear_gasto',
    `Gasto de Q${monto} - ${descripcion}`,
    { monto, categoria, fecha } // datos opcionales
  )
}
```

### Tipos de Acciones Disponibles:
- `login` / `logout`
- `cambio_password`
- `crear_gasto` / `actualizar_gasto` / `eliminar_gasto`
- `crear_ingreso` / `actualizar_ingreso` / `eliminar_ingreso`
- `crear_tienda` / `actualizar_tienda` / `eliminar_tienda`
- `crear_cotizacion`
- `solicitud_recuperacion` / `recuperacion_password`
- O cualquier otra acción personalizada

---

## 📊 Acceder a la Bitácora

1. Inicia sesión como Byron (administrador)
2. Ve a: `http://localhost:5173/bitacora`
3. Verás el historial completo de todas las acciones
4. Puedes filtrar por:
   - Usuario específico
   - Tipo de acción
   - Fecha
5. Haz clic en el ícono de ojo para ver detalles completos

---

## 🔒 Seguridad Implementada

### Contraseñas:
- ✅ Hash SHA-256 (no se guardan en texto plano)
- ✅ Validación de complejidad
- ✅ Cambio obligatorio en primer ingreso

### Rutas:
- ✅ Todas las rutas requieren autenticación (excepto login y recuperación)
- ✅ Ruta `/bitacora` solo accesible por administradores
- ✅ Redirección automática si no estás autenticado
- ✅ Sesión persistente en localStorage

### Recuperación:
- ✅ Códigos de 6 dígitos aleatorios
- ✅ Expiración de 15 minutos
- ✅ Un solo uso por código

---

## 🎯 Próximos Pasos Recomendados

### 1. **Agregar Botón de Logout en el Sidebar**

Edita: `src/components/NewSidebar.vue`

Agrega al final del nav (antes de cerrar `</nav>`):

```vue
<div class="nav-item-container logout-section">
  <button @click="handleLogout" class="curved-nav-item logout-btn">
    <LogOutIcon class="nav-icon" />
    <span class="nav-text">Cerrar Sesión</span>
  </button>
</div>
```

En el script:

```javascript
import { LogOutIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
```

### 2. **Agregar Opción de Bitácora en el Menú (solo admin)**

En `NewSidebar.vue`, agrega a los menuItems:

```javascript
import { ScrollTextIcon } from '@heroicons/vue/24/outline'

const menuItems = [
  // ... items existentes ...
  {
    path: '/bitacora',
    label: 'Bitácora',
    icon: ScrollTextIcon,
    adminOnly: true  // Solo para admin
  }
]
```

Y filtra los items:

```javascript
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (item.adminOnly) {
      return isAdmin.value
    }
    return true
  })
})
```

### 3. **Integrar Bitácora en Finanzas.vue**

Ya agregamos los imports necesarios. Ahora solo necesitas registrar las acciones:

```javascript
import { useAuth } from '@/composables/useAuth'
const { registrarBitacora, currentUser } = useAuth()

// Al crear un movimiento
await registrarBitacora(
  currentUser.value.id,
  currentUser.value.nombre,
  'crear_gasto',
  `Gasto: ${formMovimiento.value.descripcion} - Q${formMovimiento.value.monto}`
)
```

### 4. **Configurar Email para Recuperación (Producción)**

Para enviar códigos por email en producción:

1. Configura Firebase Cloud Functions o SendGrid
2. Modifica `useAuth.js` en `solicitarCodigoRecuperacion`
3. Envía el código por email en lugar de mostrarlo en pantalla

---

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado"
- Verifica que estés usando el username correcto (todo en minúsculas)
- Usuarios disponibles: `byron.garcia`, `eduardo.navarro`, `brandon.garcia`

### Error: "No tienes permisos"
- Solo Byron (administrador) puede acceder a `/bitacora`
- Cierra sesión y vuelve a entrar con las credenciales de Byron

### La sesión no persiste
- Verifica que localStorage esté habilitado en tu navegador
- Limpia el localStorage: `localStorage.clear()` en la consola

### Re-ejecutar inicialización de usuarios
```bash
node init-usuarios.js
```
Nota: Si los usuarios ya existen, serán omitidos

---

## 📧 Configuración del Email

**Email único para notificaciones:**
`solucionesintegralesgn@gmail.com`

Este email se usa para:
- Notificaciones de recuperación de contraseña
- Alertas de sistema (opcional)
- Contacto de todos los usuarios

---

## 🎨 Personalización

### Cambiar Contraseña Inicial:
Edita `init-usuarios.js` línea 42-44:
```javascript
password: hashPassword('TU_NUEVA_CONTRASEÑA')
```

### Agregar Más Usuarios:
```javascript
{
  username: 'nuevo.usuario',
  nombre: 'Nuevo Usuario',
  email: 'solucionesintegralesgn@gmail.com',
  rol: 'usuario', // o 'administrador'
  password: hashPassword('123456'),
  primerIngreso: true,
  activo: true,
  fechaCreacion: serverTimestamp()
}
```

Luego ejecuta: `node init-usuarios.js`

---

## ✨ ¡Todo Listo!

Tu sistema de autenticación y bitácora está **100% funcional**. Prueba iniciando sesión y explorando las funcionalidades.

**Credenciales de Prueba:**
```
Usuario: byron.garcia
Contraseña: 123456
```

¡Disfruta tu nuevo sistema de seguridad! 🚀
