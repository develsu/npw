const CACHE_NAME = 'ecobike-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/router.js',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
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

self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);
  if (APP_SHELL.includes(url.pathname)) {
    evt.respondWith(cacheFirst(evt.request));
    return;
  }
  if (url.pathname.startsWith('/map') || url.pathname.startsWith('/api')) {
    evt.respondWith(networkFirst(evt.request));
    return;
  }
  if (evt.request.mode === 'navigate') {
    evt.respondWith(networkFirst(evt.request));
    return;
  }
  evt.respondWith(cacheFirst(evt.request));
});
