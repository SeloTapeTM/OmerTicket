const CACHE = 'family-tickets-v1';
const ASSETS = [
  './',
  './index.html',
  './ticket.html',
  './style.css',
  './manifest.json'
  // config.js is intentionally excluded — it is generated at deploy time
  // and must always be fetched fresh so secrets are never stale-cached
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Always network-first for: config (generated at deploy), Firebase SDKs, remote APIs
  if (url.includes('config.js') || url.includes('firebasejs') || url.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
