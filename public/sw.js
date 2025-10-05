// Simple service worker to prevent router warnings
// This is a minimal service worker that doesn't do anything
// but prevents the "No match found for location with path '/sw.js'" warning

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// Optional: Add a fetch event listener for basic caching
self.addEventListener('fetch', (event) => {
  // For now, just let all requests pass through
  // You can add caching logic here if needed in the future
});
