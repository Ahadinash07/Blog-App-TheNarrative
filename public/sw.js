// Service Worker for PWA functionality
const CACHE_NAME = 'blog-cache-v1';
const STATIC_CACHE = 'blog-static-v1';
const DYNAMIC_CACHE = 'blog-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add your main CSS and JS files here when built
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // Return cached version if available
          return cache.match(request);
        });
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Handle article pages with cache-first strategy
  if (url.pathname.startsWith('/post/') || url.pathname.startsWith('/author/') || url.pathname.startsWith('/category/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Return cached version and update cache in background
          fetch(request).then((freshResponse) => {
            if (freshResponse.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, freshResponse.clone());
              });
            }
          }).catch(() => {
            // Network failed, keep cached version
          });
          return response;
        }

        // Not in cache, fetch and cache
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'CACHE_ARTICLE') {
    event.waitUntil(cacheArticle(event.data.url));
  }

  if (event.data && event.data.type === 'CACHE_USER_DATA') {
    event.waitUntil(cacheUserData(event.data.data));
  }

  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(getCacheStatus(event));
  }
});

async function cacheArticle(url) {
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(url, response);
      console.log('Service Worker: Article cached', url);
    }
  } catch (error) {
    console.error('Service Worker: Failed to cache article', url, error);
  }
}

async function cacheUserData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const userDataRequest = new Request('/user-data');
    const userDataResponse = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(userDataRequest, userDataResponse);
    console.log('Service Worker: User data cached');
  } catch (error) {
    console.error('Service Worker: Failed to cache user data', error);
  }
}

async function getCacheStatus(event) {
  try {
    const cacheNames = await caches.keys();
    const cacheStatus = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheStatus[cacheName] = keys.length;
    }

    event.ports[0].postMessage({
      type: 'CACHE_STATUS',
      status: cacheStatus
    });
  } catch (error) {
    console.error('Service Worker: Failed to get cache status', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);

  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Redux Magic Blog', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }

  if (event.tag === 'content-sync') {
    event.waitUntil(syncOfflineContent());
  }
});

async function doBackgroundSync() {
  // Handle offline actions like bookmarking, liking, etc.
  console.log('Performing background sync...');

  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const offlineActionsRequest = await cache.match('/offline-actions');

    if (offlineActionsRequest) {
      const offlineActions = await offlineActionsRequest.json();

      // Process each offline action
      for (const action of offlineActions) {
        try {
          await processOfflineAction(action);
        } catch (error) {
          console.error('Failed to process offline action:', action, error);
        }
      }

      // Clear processed actions
      await cache.delete('/offline-actions');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncOfflineContent() {
  // Sync any cached content that needs to be uploaded
  console.log('Syncing offline content...');
}

async function processOfflineAction(action) {
  // This would send the action to the server
  // For now, just log it
  console.log('Processing offline action:', action);

  // Simulate API call
  const response = await fetch('/api/offline-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action)
  });

  if (!response.ok) {
    throw new Error('Failed to process offline action');
  }
}