/*
 * Service worker GabonMICE (PWA).
 * - Pages : réseau d'abord, copie en cache en secours, puis /offline.html.
 * - Fichiers de build (/assets/*, noms hachés) : cache d'abord.
 * - Images et polices : cache puis mise à jour en arrière-plan.
 * - Jamais de cache pour l'authentification, les fonctions serveur et l'API :
 *   les données de session doivent toujours venir du serveur.
 * Changer VERSION invalide tous les caches au prochain déploiement.
 */
const VERSION = "v1";
const STATIC_CACHE = `gabonmice-static-${VERSION}`;
const PAGES_CACHE = `gabonmice-pages-${VERSION}`;
const MEDIA_CACHE = `gabonmice-media-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png", "/manifest.webmanifest"];
const MEDIA_LIMIT = 80;

const NEVER_CACHE = ["/auth/", "/_serverFn/", "/api/", "/admin", "/espace"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("gabonmice-") && !key.endsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match(OFFLINE_URL));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(STATIC_CACHE)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(MEDIA_CACHE);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then((response) => {
      if (response.ok || response.type === "opaque") {
        cache.put(request, response.clone()).then(() => trim(MEDIA_CACHE, MEDIA_LIMIT));
      }
      return response;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  return update;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && NEVER_CACHE.some((path) => url.pathname.startsWith(path))) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (sameOrigin && url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (isFont || (sameOrigin && request.destination === "image")) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
