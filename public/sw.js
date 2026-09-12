// Minimal service worker: exists only so browsers (Android/Chrome) consider
// Travelers installable as a PWA. It deliberately does no caching — the app
// has no offline data layer, so caching pages here would just serve stale
// content instead of the "you're offline" state the network already gives.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
