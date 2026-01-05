const CACHE_VERSION = "10k-challenge-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/tkc-icon-72.png",
  "./icons/tkc-icon-96.png",
  "./icons/tkc-icon-144.png",
  "./icons/tkc-icon-192.png",
  "./icons/tkc-icon-512.png"
];

/* ---------- INSTALL ---------- */
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});

/* ---------- ACTIVATE ---------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      // Alte Caches entfernen
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_VERSION)
            .map(k => caches.delete(k))
        )
      ),
      // Kontrolle sofort übernehmen
      self.clients.claim()
    ])
  );
});

/* ---------- FETCH ---------- */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Nur valide Responses cachen
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => cached);
    })
  );
});

/* ---------- MESSAGE (optional, aber day-of-year-kompatibel) ---------- */
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
