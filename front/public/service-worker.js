// GMAO Service Worker - v2
// Stratégie : NetworkFirst pour l'API, CacheFirst pour les assets statiques

const CACHE_STATIC = 'gmao-static-v2';
const CACHE_API    = 'gmao-api-v2';
const API_TIMEOUT  = 5000; // 5 secondes avant de tomber sur le cache

const STATIC_PRECACHE = ['/', '/index.html', '/manifest.json'];

// ── Installation ──────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_PRECACHE))
  );
  self.skipWaiting();
});

// ── Activation : purge des anciens caches ────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_STATIC && k !== CACHE_API)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
      .then(() =>
        // Force le rechargement de tous les onglets ouverts après purge du cache
        self.clients.matchAll({ type: 'window' }).then((clients) => {
          for (const client of clients) client.navigate(client.url);
        })
      )
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et Socket.IO
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/socket.io')) return;

  // Routes API → NetworkFirst (réseau en priorité, cache si hors ligne)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstApi(request));
    return;
  }

  // Assets statiques et pages SPA → CacheFirst
  event.respondWith(cacheFirstStatic(request));
});

// ── NetworkFirst pour /api/ ───────────────────────────────────────────────────
async function networkFirstApi(request) {
  const cache = await caches.open(CACHE_API);

  try {
    // Race entre le réseau et un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(request.clone(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Réseau indisponible → retour sur le cache
    const cached = await cache.match(request);
    if (cached) return cached;

    // Aucun cache disponible
    return new Response(
      JSON.stringify({ error: 'hors ligne', cached: false }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ── CacheFirst pour les assets ────────────────────────────────────────────────
async function cacheFirstStatic(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Fallback SPA uniquement pour les navigations HTML, jamais pour les assets JS/CSS
    if (request.mode === 'navigate') {
      const indexFallback = await caches.match('/index.html');
      return indexFallback ?? new Response('Hors ligne', { status: 503 });
    }
    return new Response('Hors ligne', { status: 503 });
  }
}
