/* ============================================================
   ROBERT MENSAH'S BIRTHDAY — Service Worker
   Offline-first: the celebration works even with no network.
   Strategy: precache core pages/assets, cache-first with
   network fallback + runtime caching for photos.
   ============================================================ */
'use strict';

const CACHE_NAME = 'rm-birthday-v1';
/* Tiny install shell ONLY — never compete with the first page load
   for bandwidth on slow mobile connections. Everything else is
   cached on-demand by the fetch handler as friends browse. */
const CORE_ASSETS = [
    './css/style.css',
    './js/main.js',
    './manifest.json',
    './icon.svg'
];

/* Install: precache the minimal shell */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

/* Activate: clean up old caches */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

/* Fetch: cache-first, then network; runtime-cache successful GETs */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    /* Never cache cross-origin API calls (e.g. Firebase chat sync) */
    if (!request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                /* Refresh in the background (stale-while-revalidate) */
                fetch(request).then((response) => {
                    if (response && response.ok) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
                    }
                }).catch(() => {});
                return cached;
            }
            return fetch(request).then((response) => {
                if (response && response.ok && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            }).catch(() => cached);
        })
    );
});