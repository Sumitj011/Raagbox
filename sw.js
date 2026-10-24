/* RaagBox service worker.
   Naya version deploy karo to CACHE ka naam badal do (v2 -> v3). */
const CACHE = "raagbox-v2";
const SHELL = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // YouTube, lrclib, Firebase, fonts: kabhi cache mat karo, seedha network.
  if (url.origin !== self.location.origin) return;

  // Page: pehle network (taaki update turant dikhe), na mile to cache.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // Baaki apni files (wallpaper, icons): cache pehle, background mein refresh.
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
