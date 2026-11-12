const CACHE_NAME = 'imobipro-pwa-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/images/logo_joel_santana.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cross-browser resilience (Edge, Chrome, Safari, Firefox):
  // NEVER intercept non-HTTP schemes (chrome-extension, edge, data, blob)
  if (!url.protocol.startsWith('http')) return;

  // Let browser natively handle third-party CDNs and Firebase APIs for maximum streaming speed
  if (
    url.origin !== self.location.origin ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    return;
  }

  // 1. Navigation & App Shell: Network first with cache fallback
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then((response) => response || caches.match('/'))
        .catch(() => caches.match('/'))
    );
    return;
  }

  // 2. Same-origin Static Assets: Cache first with background update
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache immediately and revalidate in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
          }
          return networkResponse;
        })
        .catch((err) => {
          // If offline and request is an image, fallback to logo
          if (event.request.destination === 'image') {
            return caches.match('/images/logo_joel_santana.svg');
          }
          throw err;
        });
    })
  );
});
