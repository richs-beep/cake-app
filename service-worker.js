const CACHE_NAME = 'cake-app-v6.0'; // Поменял версию, чтобы обновилось
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // УБРАЛ внешние ссылки на Google и иконку. 
  // Если хотите иконку в офлайне — скачайте файл cake.png 
  // положите в папку с сайтом и напишите './cake.png'
];

// Установка: Скачиваем ТОЛЬКО критически важные локальные файлы
self.addEventListener('install', (e) => {
  // Эта строка заставляет новый воркер активироваться мгновенно, 
  // не дожидаясь закрытия всех вкладок
  self.skipWaiting(); 

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⏳ Кэширование файлов оболочки...');
      return cache.addAll(ASSETS);
    }).catch(err => {
        console.error('❌ Ошибка кэширования:', err);
    })
  );
});

// Активация: Чистим старый кэш и перехватываем контроль
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => {
        // Заставляет SW немедленно начать контролировать открытые страницы
        return self.clients.claim(); 
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Стратегия: Сначала ищем в кэше, если нет — идем в сеть
      return res || fetch(e.request);
    })
  );
});
