const CACHE_NAME = "control-stock-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./Ametller.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
  "./icon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // No cachear API (clave en tu caso)
  if (url.hostname.includes("script.google.com")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
