/* WSP service worker: offline app shell + web push */
const VERSION = "wsp-v1";
const SHELL = ["./", "index.html", "articles-data.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/badge-96.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// HTML/JS from our origin: network first, fall back to cache (works offline). Images: cache first.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isImage = req.destination === "image" && /ytimg\.com|wixstatic\.com/.test(url.host);
  if (sameOrigin) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
  } else if (isImage) {
    e.respondWith(caches.open(VERSION + "-img").then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }))));
  }
});

// Push payload (JSON): { title, body, url, image, tag }
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  const title = d.title || "WSP";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "יש תוכן חדש מחכה לך",
    icon: "icons/icon-192.png",
    badge: "icons/badge-96.png",
    image: d.image,
    tag: d.tag || "wsp",
    dir: "rtl",
    lang: "he",
    data: { url: d.url || "./" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = new URL(e.notification.data && e.notification.data.url || "./", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.navigate(target); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});
