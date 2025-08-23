/* EcoBike PWA v1.0.0-rc, build: 2025-08-23T12:11:33+00:00 */
const CACHE_VER = 'v1.0.0-rc';
const CACHE_NAME = `ecobike-shell-${CACHE_VER}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/router.js',
  '/routes/splash.js',
  '/routes/onboarding.js',
  '/routes/splash.css',
  '/routes/onboarding.css',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/assets/illustrations/welcome.svg',
  '/assets/illustrations/how.svg',
  '/assets/illustrations/tariffs.svg',
  '/assets/illustrations/docs.svg',
  '/data/cities.json'
];
try { importScripts('./firebase-messaging-sw.js'); } catch (e) {}

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil((async () => {
    const keys = await caches.keys();
    const hasOld = keys.some(k => k !== CACHE_NAME);
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
    if (hasOld) {
      const clients = await self.clients.matchAll();
      clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
    }
  })());
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return cache.match('/offline.html');
  }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached || cache.match('/offline.html');
  }
}

async function networkFirstJson(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    const fresh = await fetch(req, { signal: controller.signal });
    clearTimeout(id);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached || new Response('', { status: 408 });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then(res => {
    cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || fetchPromise || cache.match('/offline.html');
}

self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);
  if (APP_SHELL.includes(url.pathname)) {
    evt.respondWith(cacheFirst(evt.request));
    return;
  }
  if (url.pathname.endsWith('.json')) {
    evt.respondWith(networkFirstJson(evt.request));
    return;
  }
  if (/\.(?:js|css|png|jpg|svg|webp)$/.test(url.pathname)) {
    evt.respondWith(staleWhileRevalidate(evt.request));
    return;
  }
  if (evt.request.mode === 'navigate') {
    evt.respondWith(networkFirst(evt.request));
    return;
  }
});
