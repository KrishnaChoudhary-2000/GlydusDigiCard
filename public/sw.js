// Simple service worker to prevent communication errors
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('message', (event) => {
  // Handle any messages to prevent errors
  if (event.data && event.data.type) {
    console.log('Service Worker received message:', event.data.type);
  }
}); 