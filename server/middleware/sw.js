// Middleware to handle service worker requests
export default defineEventHandler(event => {
  // If the request is for sw.js, return a simple service worker
  if (event.node.req.url === '/sw.js') {
    const swContent = `// Simple service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let all requests pass through
});`

    setHeader(event, 'Content-Type', 'application/javascript')
    return swContent
  }
})
