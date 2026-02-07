const CACHE_NAME = 'cake-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://img.icons8.com/color/192/cake.png',
  'https://apis.google.com/js/api.js',
  'https://accounts.google.com/gsi/client'
];

// Установка: Скачиваем файлы в кэш
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: Чистим старый кэш
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Перехват запросов (Офлайн режим)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Если есть в кэше — отдаем из кэша. Если нет — идем в сеть.
      return res || fetch(e.request);
    }).catch(() => {
      // Если сети нет и в кэше нет — можно вернуть заглушку (пока не нужно)
    })
  );
});
