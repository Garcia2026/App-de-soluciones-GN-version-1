import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Lazy loading para todas las rutas - CRÍTICO para móvil
// Solo Login y Dashboard se cargan inmediatamente

// Rutas críticas (carga inmediata)
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

// Rutas de autenticación (carga inmediata)
const CambiarPassword = () => import(/* webpackChunkName: "auth" */ '../views/CambiarPassword.vue')
const RecuperarPassword = () => import(/* webpackChunkName: "auth" */ '../views/RecuperarPassword.vue')

// Rutas administrativas
const Bitacora = () => import(/* webpackChunkName: "admin" */ '../views/Bitacora.vue')

// Rutas con lazy loading (carga bajo demanda)
const HomeView = () => import('../views/HomeView.vue')
const Tiendas = () => import(/* webpackChunkName: "tiendas" */ '../views/Tiendas.vue')
const Cobros = () => import(/* webpackChunkName: "cobros" */ '../views/Cobros.vue')
const Estadisticas = () => import(/* webpackChunkName: "estadisticas" */ '../views/Estadisticas.vue')
const Finanzas = () => import(/* webpackChunkName: "finanzas" */ '../views/Finanzas.vue')
const Cotizaciones = () => import(/* webpackChunkName: "cotizaciones" */ '../views/Cotizaciones.vue')
const Proyectos = () => import(/* webpackChunkName: "proyectos" */ '../views/Proyectos.vue')

// Rutas de testing/showcase (carga diferida con prioridad baja)
const ThemeShowcase = () => import(/* webpackChunkName: "showcase" */ '../views/ThemeShowcase.vue')
const TestNewDesign = () => import(/* webpackChunkName: "showcase" */ '../views/TestNewDesign.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  // Rutas públicas (sin autenticación)
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'Iniciar Sesión', public: true }
  },
  {
    path: '/recuperar-password',
    name: 'recuperar-password',
    component: RecuperarPassword,
    meta: { title: 'Recuperar Contraseña', public: true }
  },
  // Rutas protegidas (requieren autenticación)
  {
    path: '/cambiar-password',
    name: 'cambiar-password',
    component: CambiarPassword,
    meta: { title: 'Cambiar Contraseña', requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', requiresAuth: true, preload: true }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio', requiresAuth: true }
  },
  {
    path: '/tiendas',
    name: 'tiendas',
    component: Tiendas,
    meta: { title: 'Tiendas', requiresAuth: true }
  },
  {
    path: '/cobros',
    name: 'cobros',
    component: Cobros,
    meta: { title: 'Cobros', requiresAuth: true }
  },
  {
    path: '/estadisticas',
    name: 'estadisticas',
    component: Estadisticas,
    meta: { title: 'Estadísticas', requiresAuth: true }
  },
  {
    path: '/finanzas',
    name: 'finanzas',
    component: Finanzas,
    meta: { title: 'Finanzas', requiresAuth: true }
  },
  {
    path: '/cotizaciones',
    name: 'cotizaciones',
    component: Cotizaciones,
    meta: { title: 'Cotizaciones', requiresAuth: true }
  },
  {
    path: '/proyectos',
    name: 'proyectos',
    component: Proyectos,
    meta: { title: 'Proyectos', requiresAuth: true }
  },
  // Rutas administrativas (solo administrador)
  {
    path: '/bitacora',
    name: 'bitacora',
    component: Bitacora,
    meta: { title: 'Bitácora', requiresAuth: true }
  },
  // Rutas de desarrollo
  {
    path: '/theme-showcase',
    name: 'theme-showcase',
    component: ThemeShowcase,
    meta: { title: 'Themes', dev: true, requiresAuth: true }
  },
  {
    path: '/test-design',
    name: 'test-design',
    component: TestNewDesign,
    meta: { title: 'Test Design', dev: true, requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Configuración optimizada para móvil
  scrollBehavior(to, from, savedPosition) {
    // Restaurar posición en navegación hacia atrás
    if (savedPosition) {
      return savedPosition
    }
    // Scroll suave al top en nuevas rutas
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0, behavior: 'auto' }
  }
})

// Loading state global para mostrar spinner durante lazy loading
let isLoading = false

// Guards optimizados para móvil con autenticación
router.beforeEach((to, from, next) => {
  const { currentUser, isAdmin, restaurarSesion } = useAuth()

  // Intentar restaurar sesión si no hay usuario
  if (!currentUser.value) {
    restaurarSesion()
  }

  // Mostrar loading para lazy routes
  if (!isLoading && to.name !== from.name) {
    isLoading = true
    document.body.classList.add('route-loading')
  }

  // Actualizar título de la página
  if (to.meta?.title) {
    document.title = `${to.meta.title} - GN Soluciones`
  }

  // Verificar autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isPublic = to.matched.some(record => record.meta.public)

  // Si la ruta requiere autenticación y no hay usuario, redirigir a login
  if (requiresAuth && !currentUser.value) {
    next('/login')
    return
  }

  // Si la ruta requiere admin y el usuario no es admin
  if (requiresAdmin && !isAdmin.value) {
    next('/dashboard')
    return
  }

  // Si está autenticado e intenta ir al login, redirigir al dashboard
  if (currentUser.value && to.path === '/login') {
    next('/dashboard')
    return
  }

  next()
})

router.afterEach(() => {
  // Ocultar loading
  isLoading = false
  document.body.classList.remove('route-loading')
  
  // Force scroll to top en móvil
  if (window.innerWidth < 768) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
})

// Preload crítico: precargar rutas más usadas en idle time
router.isReady().then(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Precargar rutas principales en background
      import(/* webpackChunkName: "preload-finanzas" */ '../views/Finanzas.vue')
      import(/* webpackChunkName: "preload-cotizaciones" */ '../views/Cotizaciones.vue')
    })
  }
})

export default router
