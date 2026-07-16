/*
  Crete Family Holiday 2026 - Safe Service Worker
  Purpose: basic offline/PWA support without failing if one optional file is missing.
  Version: 2026-07-16-v2-safe
*/

const CACHE_NAME = "crete-family-holiday-2026-v2-safe";

const CORE_ASSETS = [
  "./",
  "index.html",
  "itinerary.html",
  "activities.html",
  "restaurants.html",
  "beaches.html",
  "budget.html",
  "packing.html",
  "maps.html",
  "traveltips.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "about.html",
  "manifest.json",
  "css/style.css",
  "js/script.js",
  "js/data.js",
  "images/icon-192.png",
  "images/icon-512.png"
];

const OPTIONAL_ASSETS = [
  "images/hero.jpg"
];

async function cacheAsset(cache, asset) {
  try {
    const response = await fetch(asset, { cache: "no-cache" });
    if (response && response.ok) {
      await cache.put(asset, response.clone());
    }
  } catch (error) {
    console.warn("Skipping cache asset:", asset, error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(CORE_ASSETS.map((asset) => cacheAsset(cache, asset)));
      await Promise.all(OPTIONAL_ASSETS.map((asset) => cacheAsset(cache, asset)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cachedResponse) => cachedResponse || caches.match("index.html")))
    );
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          });
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
