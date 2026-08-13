/* Koda service worker — offline support (PWA).
   IMPORTANT: pages are NETWORK-FIRST, so visitors always get the newest app.html
   when online; the cache is only an offline fallback. Bump CACHE when the app
   changes structurally so stale entries are wiped. */
const CACHE = 'koda-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['./index.html'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isPage = e.request.mode === 'navigate' ||
    (url.pathname.endsWith('.html') || url.pathname.endsWith('/'));

  if (isPage) {
    /* Network-first for pages: fresh app when online, cached copy when offline. */
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() =>
          caches.match(e.request).then((hit) => hit || caches.match('./index.html'))
        )
    );
    return;
  }

  /* Assets: stale-while-revalidate (fast, refreshed in background). */
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
