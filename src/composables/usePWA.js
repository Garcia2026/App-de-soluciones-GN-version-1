import { ref, onMounted } from 'vue';

export function usePWA() {
  const deferredPrompt = ref(null);
  const isInstallable = ref(false);
  const isInstalled = ref(false);
  const isMobile = ref(false);
  const showInstallPrompt = ref(false);

  // Detectar si es móvil
  const detectMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  };

  // Verificar si ya está instalado
  const checkIfInstalled = () => {
    // PWA instalada en navegador
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    // App instalada en iOS
    if (window.navigator.standalone === true) {
      return true;
    }
    return false;
  };

  // Mostrar prompt de instalación
  const showInstallBanner = () => {
    if (isMobile.value && !isInstalled.value && isInstallable.value) {
      showInstallPrompt.value = true;
      
      // Auto-hide después de 10 segundos si no interactúa
      setTimeout(() => {
        if (showInstallPrompt.value) {
          showInstallPrompt.value = false;
        }
      }, 10000);
    }
  };

  // Instalar PWA
  const installPWA = async () => {
    if (!deferredPrompt.value) {
      console.log('No hay prompt de instalación disponible');
      return;
    }

    try {
      // Mostrar prompt nativo
      deferredPrompt.value.prompt();
      
      // Esperar respuesta del usuario
      const { outcome } = await deferredPrompt.value.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
        isInstalled.value = true;
        showInstallPrompt.value = false;
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
      
      // Limpiar el prompt
      deferredPrompt.value = null;
      isInstallable.value = false;
    } catch (error) {
      console.error('Error al instalar PWA:', error);
    }
  };

  // Cerrar prompt de instalación
  const closeInstallPrompt = () => {
    showInstallPrompt.value = false;
    // No volver a mostrar por 24 horas
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Verificar si se debe mostrar el prompt
  const shouldShowPrompt = () => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      // 24 horas = 24 * 60 * 60 * 1000 ms
      if (now - dismissedTime < 86400000) {
        return false;
      }
    }
    return true;
  };

  onMounted(() => {
    // Detectar móvil
    isMobile.value = detectMobile();
    
    // Verificar si ya está instalado
    isInstalled.value = checkIfInstalled();
    
    // Escuchar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir mostrar el prompt automático
      e.preventDefault();
      
      // Guardar el evento para usarlo después
      deferredPrompt.value = e;
      isInstallable.value = true;
      
      // Mostrar banner si es móvil y se debe mostrar
      if (shouldShowPrompt()) {
        setTimeout(() => showInstallBanner(), 2000); // Esperar 2 segundos
      }
    });
    
    // Escuchar cuando la app se instala
    window.addEventListener('appinstalled', (e) => {
      console.log('PWA instalada exitosamente');
      isInstalled.value = true;
      showInstallPrompt.value = false;
      deferredPrompt.value = null;
      isInstallable.value = false;
    });
  });

  return {
    isInstallable,
    isInstalled,
    isMobile,
    showInstallPrompt,
    installPWA,
    closeInstallPrompt
  };
}