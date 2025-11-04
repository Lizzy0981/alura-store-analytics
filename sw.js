// ========================================
// SERVICE WORKER - ALURA STORE ANALYTICS PWA
// ========================================

const CACHE_NAME = 'alura-store-analytics-v1.2.0';
const STATIC_CACHE = 'alura-static-v1.2.0';
const DYNAMIC_CACHE = 'alura-dynamic-v1.2.0';

// Archivos para cachear inmediatamente
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css', 
  '/css/animations.css',
  '/js/app.js',
  '/js/quantum-engine.js',
  '/js/ml-algorithms.js',
  '/js/chart-manager.js',
  '/js/api-connector.js',
  '/js/report-generator.js',
  '/assets/images/favicon.svg',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/data/sample-quantum.csv',
  '/assets/data/translations.json'
];

// CDN y recursos externos
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'
];

// ========================================
// EVENTOS DEL SERVICE WORKER
// ========================================

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Instalando Alura Analytics PWA');
  
  event.waitUntil(
    Promise.all([
      // Cache de archivos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Cacheando archivos estáticos...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache de CDN assets
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('🌐 Cacheando recursos CDN...');
        return cache.addAll(CDN_ASSETS);
      })
    ]).then(() => {
      console.log('✅ Cache inicial completado');
      // Activar inmediatamente el nuevo SW
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Error en instalación SW:', error);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      cleanOldCaches(),
      
      // Tomar control de todas las páginas inmediatamente
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activado y controlando todas las páginas');
      
      // Notificar a todos los clientes sobre la activación
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            message: 'Alura Analytics PWA está listo para uso offline'
          });
        });
      });
    })
  );
});

// Interceptar todas las requests de red
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia de cache según el tipo de recurso
  if (request.method === 'GET') {
    event.respondWith(handleFetchRequest(request, url));
  }
});

// ========================================
// ESTRATEGIAS DE CACHE
// ========================================

async function handleFetchRequest(request, url) {
  const isStaticAsset = STATIC_ASSETS.some(asset => 
    request.url.includes(asset) || request.url.endsWith(asset)
  );
  
  const isCDNAsset = CDN_ASSETS.some(asset => 
    request.url.includes(asset)
  );
  
  try {
    if (isStaticAsset) {
      // Cache First para assets estáticos
      return await cacheFirst(request, STATIC_CACHE);
    } else if (isCDNAsset) {
      // Stale While Revalidate para CDN
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    } else if (url.pathname.includes('/api/')) {
      // Network First para APIs
      return await networkFirst(request, DYNAMIC_CACHE);
    } else {
      // Network First con fallback para otras requests
      return await networkFirstWithFallback(request);
    }
  } catch (error) {
    console.warn('⚠️ Error en fetch strategy:', error);
    return await getFallbackResponse(request);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Network First con Fallback
async function networkFirstWithFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Fallback específico según el tipo de request
    return await getFallbackResponse(request);
  }
}

// ========================================
// UTILIDADES Y FALLBACKS
// ========================================

async function getFallbackResponse(request) {
  const url = new URL(request.url);
  
  // Fallback para páginas HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    const cachedIndex = await caches.match('/index.html');
    if (cachedIndex) {
      return cachedIndex;
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Alura Analytics - Offline</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0F172A, #1E3A8A);
              color: #F8FAFC;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              text-align: center;
            }
            .offline-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border-radius: 20px;
              padding: 40px;
              border: 1px solid rgba(243, 156, 18, 0.3);
            }
            .offline-icon { font-size: 4rem; margin-bottom: 20px; }
            .offline-title { font-size: 2rem; margin-bottom: 15px; color: #F39C12; }
            .offline-message { font-size: 1.1rem; margin-bottom: 20px; opacity: 0.8; }
            .retry-btn {
              background: linear-gradient(45deg, #F39C12, #F59E0B);
              color: #0F172A;
              border: none;
              padding: 12px 24px;
              border-radius: 25px;
              font-weight: 600;
              cursor: pointer;
              font-size: 1rem;
            }
            .retry-btn:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1 class="offline-title">Modo Offline</h1>
            <p class="offline-message">
              Alura Store Analytics está funcionando offline.<br>
              Algunas funciones pueden estar limitadas.
            </p>
            <button class="retry-btn" onclick="window.location.reload()">
              🔄 Reintentar Conexión
            </button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Fallback para imágenes
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0F172A"/>
        <text x="100" y="100" text-anchor="middle" fill="#F39C12" font-size="24">📊</text>
        <text x="100" y="130" text-anchor="middle" fill="#F8FAFC" font-size="12">Imagen no disponible</text>
      </svg>
    `, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  // Fallback genérico
  return new Response('Recurso no disponible offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('alura-') && 
    name !== STATIC_CACHE && 
    name !== DYNAMIC_CACHE
  );
  
  await Promise.all(
    oldCaches.map(name => {
      console.log('🗑️ Eliminando cache antiguo:', name);
      return caches.delete(name);
    })
  );
}

// ========================================
// EVENTOS DE MENSAJE
// ========================================

self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'UPDATE_CACHE':
      updateCache(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// ========================================
// NOTIFICACIONES PUSH
// ========================================

self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/icon-192.png',
    tag: 'alura-notification',
    data: {
      timestamp: Date.now(),
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir Dashboard',
        icon: '/assets/images/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Descartar'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Alura Store Analytics', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ========================================
// SINCRONIZACIÓN EN BACKGROUND
// ========================================

self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('🔄 Ejecutando sincronización en background');
  
  try {
    // Sincronizar datos pendientes
    const pendingData = await getStoredData('pending-sync');
    if (pendingData) {
      await syncPendingData(pendingData);
      await clearStoredData('pending-sync');
    }
    
    // Actualizar cache con datos frescos
    await updateCriticalResources();
    
    console.log('✅ Sincronización completada');
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
}

// ========================================
// UTILIDADES ADICIONALES
// ========================================

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    info[name] = {
      size: keys.length,
      lastUpdated: Date.now()
    };
  }
  
  return info;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

async function updateCache(urls) {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(urls);
}

async function getStoredData(key) {
  // Implementar storage local para sync
  return null;
}

async function clearStoredData(key) {
  // Implementar limpieza de storage
}

async function syncPendingData(data) {
  // Implementar sincronización de datos pendientes
}

async function updateCriticalResources() {
  // Actualizar recursos críticos en background
  const criticalUrls = ['/manifest.json', '/js/app.js'];
  const cache = await caches.open(STATIC_CACHE);
  
  for (const url of criticalUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo actualizar:', url, error);
    }
  }
}

console.log('🎯 Service Worker Alura Analytics cargado y listo');