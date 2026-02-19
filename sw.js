const CACHE_NAME = 'dero-tycoon-v1.3';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './css/apps.css',
    './css/map.css',
    './css/hud.css',
    './js/main.js',
    './js/core/GameEngine.js',
    './js/core/TimeManager.js',
    './js/core/SaveSystem.js',
    './js/core/AudioManager.js',
    './js/ui/UIManager.js',
    './js/systems/Player.js',
    './js/systems/EconomySystem.js',
    './js/systems/BuildingManager.js',
    './js/data/buildings.js',
    './js/ui/MapRenderer.js',
    './js/ui/ParticleSystem.js'
];

// Install: Cache all assets
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Activate: Delete old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch: Strategy Network-first with Cache fallback for game logic
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
