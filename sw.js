// THE GOLDEN RULE: Change this version number EVERY time you push an update to GitHub!
const CACHE_NAME = 'expense-pro-v2.0'; 

// 1. Install & Force Takeover
self.addEventListener('install', (event) => {
    // skipWaiting forces the waiting ServiceWorker to become the active ServiceWorker instantly.
    self.skipWaiting(); 
});

// 2. Activate & Destroy Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // If the cache name doesn't match our current version, delete it
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Instantly take control of all open windows/apps
    );
});

// 3. The "Network-First" Fetch Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // We got a response from the internet! Save a copy to the cache and return it.
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // The internet failed (offline). Fall back to the cached files.
                return caches.match(event.request);
            })
    );
});
