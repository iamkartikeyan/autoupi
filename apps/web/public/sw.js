const CACHE_NAME = `autoupi-v-${Date.now()}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy for 100% fresh UI on every page load
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // For HTML navigations & Next.js chunk files, ALWAYS fetch latest from network
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache ONLY if network is completely disconnected
        return caches.match(event.request);
      })
  );
});
