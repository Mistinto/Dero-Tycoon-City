const CACHE_NAME = 'dero-tycoon-v1';
const ASSETS = [
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
    './js/data/buildings.js'
    // Add other critical files as needed
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
