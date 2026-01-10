/* Minimal service worker: avoids aggressive caching so favicon/icon updates reflect quickly. */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Default network behavior (no cache). This keeps updates instant.
self.addEventListener('fetch', () => {
  // Intentionally empty
});
