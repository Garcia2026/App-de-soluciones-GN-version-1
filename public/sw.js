// Service Worker - GN Soluciones PWA
// Optimizado para rendimiento móvil

const CACHE_NAME = 'gn-soluciones-v1.0.0';
const OFFLINE_URL = '/';

// Assets críticos para cache inicial
const CRITICAL_ASSETS = [
  '/',
  '/manifest.json',
  '/gn-icon-modern.svg'
];

// Patrones de URLs que NO deben cachearse
const NO_CACHE_PATTERNS = [
  /\/api\//,
  /firebase/,
  /firestore/,
  /hot-update/,
  /sockjs-node/
];

// === INSTALLATION ===
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache solo assets críticos en install
        console.log('📦 Caching critical assets...');
        await cache.addAll(CRITICAL_ASSETS);
        
        console.log('✅ Service Worker: Installed successfully');
        
        // Skip waiting para activar inmediatamente
        self.skipWaiting();
      } catch (error) {
        console.error('❌ Service Worker install error:', error);
      }
    })()
  );
});

// === ACTIVATION ===
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar caches viejos
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('🗑️ Deleting old cache:', name);
            return caches.delete(name);
          });
        
        await Promise.all(deletePromises);
        
        // Tomar control inmediato de todos los clientes
        await clients.claim();
        
        console.log('✅ Service Worker: Activated successfully');
      } catch (error) {
        console.error('❌ Service Worker activation error:', error);
      }
    })()
  );
});

// === FETCH HANDLER ===
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip si no es GET request
  if (request.method !== 'GET') return;
  
  // Skip si es un patrón que no debe cachearse
  if (NO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return;
  }
  
  // Estrategia: Cache First para assets estáticos, Network First para HTML
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isHTMLRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// === STRATEGIES ===

// Cache First - Para assets estáticos (JS, CSS, imágenes)
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Cache en background para próxima vez
      fetchAndCache(request);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Cache first strategy failed:', error);
    
    // Fallback a cache si existe
    const cache = await caches.open(CACHE_NAME);
    const fallback = await cache.match(request);
    
    if (fallback) return fallback;
    
    // Return offline page para navegación
    if (isHTMLRequest(request)) {
      return await cache.match(OFFLINE_URL) || new Response('Offline', { status: 200 });
    }
    
    throw error;
  }
}

// Network First - Para HTML y datos dinámicos
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful HTML responses
    if (networkResponse.ok && isHTMLRequest(request)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Network first strategy failed, falling back to cache');
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) return cachedResponse;
    
    // Offline fallback
    if (isHTMLRequest(request)) {
      return await cache.match(OFFLINE_URL) || new Response(getOfflineHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

// === HELPERS ===

function isStaticAsset(url) {
  return /\.(js|css|svg|png|jpg|jpeg|webp|woff|woff2|ttf)$/i.test(url.pathname);
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <title>Sin conexión - GN Soluciones</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .container {
            max-width: 400px;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.8;
          }
          .title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #10b981;
          }
          .message {
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .retry-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: transform 0.2s ease;
          }
          .retry-btn:hover {
            transform: translateY(-2px);
          }
          .retry-btn:active {
            transform: translateY(0);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📱</div>
          <h1 class="title">Sin Conexión</h1>
          <p class="message">
            No hay conexión a internet disponible. 
            La aplicación funcionará cuando la conexión se restablezca.
          </p>
          <button class="retry-btn" onclick="window.location.reload()">
            Reintentar
          </button>
        </div>
      </body>
    </html>
  `;
}

console.log('🎉 Service Worker loaded successfully');