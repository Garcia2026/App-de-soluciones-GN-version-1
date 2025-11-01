import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './styles/glassmorphism.css';
import './styles/mobile.css';

// Initialize Firebase before anything else
import './firebase.js';

// 1. Importa el plugin y su CSS
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // <-- Asegúrate que esta ruta sea correcta

const app = createApp(App);

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Error global capturado:', error, info);

  // Notify user of error - pero no redirigir desde proyectos para permitir debugging
  const currentPath = window.location.pathname;
  if (currentPath !== '/dashboard' && currentPath !== '/proyectos') {
    console.warn('Redirigiendo a dashboard debido a error...');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  }
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazado no manejado:', event.reason);
  event.preventDefault(); // Prevent default browser error handling
});

// Handle JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Error JavaScript:', event.error);
  // Optionally reload if critical error
  if (event.error && event.error.message && event.error.message.includes('Cannot read prop')) {
    console.warn('Error crítico detectado, considerando reload...');
  }
});

// 2. Opcional: Define las opciones de configuración para las notificaciones
// Puedes personalizar la posición, duración, etc.
// Consulta la documentación para más opciones: https://vue-toastification.maronato.dev/
const options = {
    position: "top-right", // Posición común para notificaciones
    timeout: 3000,        // Duración en milisegundos (3 segundos)
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

// 3. Registra el router y LUEGO el plugin Toast ANTES de montar la app
app.use(router);
app.use(Toast, options); // <-- Registra vue-toastification con sus opciones

// Mobile improvements CSS removed due to conflicts with responsive design

// 4. Monta la aplicación
app.mount('#app');

// 5. Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registrado exitosamente:', registration);

      // Escuchar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nueva versión disponible, actualizando...');
              // Forzar actualización inmediata
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          });
        }
      });

      // Escuchar cambios del service worker
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('🔄 Service Worker actualizado, recargando página...');
          window.location.reload();
        }
      });

      // Verificar actualizaciones cada 30 segundos
      setInterval(() => {
        registration.update();
      }, 30000);

    } catch (error) {
      console.error('❌ Error al registrar Service Worker:', error);
    }
  });

  // Escuchar mensajes del Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case 'NEW_VERSION_AVAILABLE':
          console.log('📱 Nueva versión disponible:', event.data.version);
          break;
        case 'APP_UPDATED':
          console.log('✅ App actualizada a versión:', event.data.version);
          break;
        case 'SW_UPDATED':
          console.log('🔄 Service Worker actualizado');
          break;
        case 'CONTENT_UPDATED':
          console.log('🆕 Contenido actualizado, recargando...', event.data.url);
          // Mostrar notificación al usuario y recargar
          if (confirm('🆕 Nueva versión disponible. ¿Deseas actualizar ahora?')) {
            window.location.reload();
          }
          break;
      }
    }
  });

  // Forzar verificación de actualizaciones cada 10 segundos para PWA instaladas
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    console.log('📱 PWA instalada detectada - Activando verificación frecuente de actualizaciones');
    setInterval(() => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
      }
    }, 10000); // Cada 10 segundos
  }
}
