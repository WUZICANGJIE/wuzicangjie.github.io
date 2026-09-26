// Keeps the page usable on slow or missing connections after the first visit.
// scripts/build.mjs fills in VERSION and PRECACHE when it writes dist/sw.js.
const VERSION = 'dev';
const PRECACHE = [];
const CACHE_PREFIX = 'site-';
const CACHE = CACHE_PREFIX + VERSION;
// Pages and contact files come from the network so edits appear right away. If the
// network has not answered by then, the saved copy is shown and updated in the background.
const NETWORK_TIMEOUT_MS = 2000;

const precached = new Set(PRECACHE.map(path => new URL(path, self.location).href));

function cacheKey(request) {
    const url = new URL(request.url);
    url.search = '';
    url.hash = '';
    if (url.pathname.endsWith('/index.html')) url.pathname = url.pathname.slice(0, -'index.html'.length);
    return url.href;
}

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        // Skip the HTTP cache so this version never stores files from the previous one.
        await cache.addAll(PRECACHE.map(path => new Request(path, { cache: 'no-cache' })));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        await self.registration.navigationPreload?.enable();
        const names = await caches.keys();
        await Promise.all(names
            .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE)
            .map(name => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const key = cacheKey(event.request);
    if (!precached.has(key)) return;
    event.respondWith(event.request.mode === 'navigate'
        ? networkFirst(event, key)
        : staleWhileRevalidate(event, key));
});

async function networkFirst(event, key) {
    const cache = await caches.open(CACHE);
    const network = (async () => {
        const response = await event.preloadResponse || await fetch(event.request);
        if (response.status === 200) event.waitUntil(cache.put(key, response.clone()));
        return response;
    })();
    event.waitUntil(network.catch(() => {}));
    const cached = await cache.match(key);
    if (!cached) return network;
    const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS, cached));
    // A server error is no more useful than no connection when a saved copy exists.
    const fresh = network.then(response => response.status >= 500 ? cached : response, () => cached);
    return Promise.race([fresh, timeout]);
}

async function staleWhileRevalidate(event, key) {
    const cache = await caches.open(CACHE);
    const network = fetch(event.request).then(response => {
        if (response.status === 200) event.waitUntil(cache.put(key, response.clone()));
        return response;
    });
    const cached = await cache.match(key);
    if (!cached) return network;
    event.waitUntil(network.catch(() => {}));
    return cached;
}
