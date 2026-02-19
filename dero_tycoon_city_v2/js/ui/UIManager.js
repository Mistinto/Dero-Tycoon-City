class UIManager {
    constructor(game) {
        this.game = game;
        this.activeApp = null;

        // HUD Elements
        this.clockEl = document.getElementById('clock');
        this.dateEl = document.getElementById('date-display');
        this.weatherEl = document.getElementById('weather-display');
        this.moneyEl = document.getElementById('money-display');
        this.bankEl = document.getElementById('bank-display');
        this.repEl = document.getElementById('rep-display');

        // Bars
        this.barHunger = document.getElementById('bar-hunger');
        this.barThirst = document.getElementById('bar-thirst');

        // Modal
        this.modalContainer = document.getElementById('app-modal-container');
        this.modalBody = document.getElementById('modal-body');

        // Init Map
        this.mapRenderer = new MapRenderer(game);
        // Map init moved to init() to ensure buildings are ready
    }

    init() {
        console.log("UIManager: Init sequence");
        this.initMap();
        this.update();

        // Global Click Sound
        document.body.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.classList.contains('job-card')) {
                if (this.game.audio) this.game.audio.playSound('click');
            }
        });
    }

    initMap() {
        const mapContainer = document.getElementById('map-view');
        this.mapRenderer.container = mapContainer; // Target Fullscreen div
        this.mapRenderer.renderGrid(this.game.buildings.grid);
        this.apps = {}; // Store app logic instances if needed

        // Init logic for apps (but don't render them yet)
        this.apps = {
            bank: new BankApp(this.game),
            jobs: new JobApp(this.game),
            needs: new NeedsApp(this.game),
            contacts: new ContactsApp(this.game),
            politics: new PoliticsApp(this.game),
            university: new UniversityApp(this.game),
            stadium: new StadiumApp(this.game),
            weather: new WeatherApp(this.game),
            community: new CommunityApp(this.game),
            school: new SchoolApp(this.game),
            hospital: new HospitalApp(this.game),
            police: new PoliceApp(this.game),
            fire: new FireStationApp(this.game),
            notary: new NotaryApp(this.game),
            carShop: new CarShopApp(this.game),
            premium: new PremiumShopApp(this.game),
            pets: new PetApp(this.game),
            profile: new ProfileApp(this.game),
            news: new NewsApp(this.game),
            // Helper Apps
            achievements: new AchievementsApp(this.game),
            wiki: new WikiApp(this.game)
        };

        // Visuals
        this.particles = new ParticleSystem(this.game);
    }

    openApp(appName, ...args) {
        if (appName === 'check_bank') appName = 'bank'; // Alias
        if (appName === 'menu') {
            this.renderAppGrid();
            return;
        }
        if (appName === 'settings') {
            this.openSettings();
            return;
        }

        this.modalContainer.classList.remove('hidden');
        this.modalBody.innerHTML = ''; // Clear

        this.activeApp = appName; // TRACK ACTIVE APP

        // Temp render logic for apps into the modal
        if (this.apps[appName]) {
            // Hijack container mechanism of apps or just use their render to string?
            // Existing apps append to 'app-container'. We need to patch that or change their container temporarily.
            this.apps[appName].container = this.modalBody;

            // Pass args to render if supported
            this.apps[appName].render(...args);
        } else {
            this.modalBody.innerHTML = `<p>App ${appName} in caricamento...</p>`;
        }
    }

    closeModal() {
        this.modalContainer.classList.add('hidden');
        this.modalBody.innerHTML = '';
        this.activeApp = null; // RESET ACTIVE APP
    }

    // Global helper called by HTML
    goHome() { this.closeModal(); }
    goBack() { this.closeModal(); }

    update() {
        // Update HUD
        const p = this.game.player;
        const t = this.game.time;

        if (this.clockEl) this.clockEl.innerText = t.getTimeString();
        if (this.dateEl) this.dateEl.innerText = `Giorno ${t.day}`;
        // Verify environment exists before accessing
        if (this.weatherEl) this.weatherEl.innerText = (this.game.environment && this.game.environment.getWeatherEmoji) ? this.game.environment.getWeatherEmoji() : '☀️';

        if (this.moneyEl) {
            // Particle Check
            if (this.lastMoney !== undefined && p.money > this.lastMoney) {
                const diff = p.money - this.lastMoney;
                if (diff > 0 && this.particles) this.particles.spawnMoney(null, null, diff);
            }
            this.lastMoney = p.money;

            this.moneyEl.innerHTML = `€${Math.floor(p.money).toLocaleString()}`;
            this.moneyEl.onclick = () => this.game.ui.openApp('jobs'); // Money -> Jobs
            this.moneyEl.style.cursor = 'pointer';
        }
        if (this.bankEl) {
            this.bankEl.innerHTML = `€${Math.floor(p.bankBalance).toLocaleString()}`;
            this.bankEl.onclick = () => this.game.ui.openApp('bank'); // Bank -> Bank
            this.bankEl.style.cursor = 'pointer';
        }
        if (this.repEl) {
            this.repEl.innerHTML = `${p.level} 🆙 <span style="margin:0 8px; opacity:0.3">|</span> ${p.reputation} ⭐ <span style="color:#E040FB; margin-left:10px; display:inline-flex; align-items:center;"><span class="derini-icon"></span> ${p.derini}</span>`;
            this.repEl.onclick = () => this.game.ui.openApp('profile');
            this.repEl.style.cursor = 'pointer';
        }

        // Bars with color changes
        if (this.barHunger) {
            this.barHunger.style.width = `${p.needs.hunger}%`;
            this.barHunger.style.background = p.needs.hunger < 20 ? 'red' : '#4CAF50';
        }
        if (this.barThirst) {
            this.barThirst.style.width = `${p.needs.thirst}%`;
            this.barThirst.style.background = p.needs.thirst < 20 ? 'red' : '#2196F3';
        }

        // TRIGGER ACTIVE APP UPDATE
        // Need to know which app is active. We need to track it in openApp/closeModal.
        if (this.activeApp && this.apps[this.activeApp] && this.apps[this.activeApp].update) {
            this.apps[this.activeApp].update();
        }

        // EMERGENCY SLEEP BUTTON (Midnight)
        let sleepBtn = document.getElementById('hud-sleep-btn');
        // Fix: Use totalMinutes >= 1440 instead of undefined 'firstMidnight'
        if (t.totalMinutes >= 1440 && t.isPaused) {
            if (!sleepBtn) {
                const hud = document.querySelector('.hud-top');
                if (hud) {
                    sleepBtn = document.createElement('button');
                    sleepBtn.id = 'hud-sleep-btn';
                    sleepBtn.innerText = '🛌 DORMI (Obbligatorio)';
                    sleepBtn.style.cssText = "background:red; color:white; border:none; padding:10px; border-radius:5px; margin-left:10px; cursor:pointer; animation: pulse 1s infinite;";
                    sleepBtn.onclick = () => {
                        if (confirm("Vuoi dormire e passare al giorno successivo?")) {
                            this.game.time.sleep();
                            sleepBtn.remove();
                        }
                    };
                    const clockContainer = document.getElementById('clock-container');
                    if (clockContainer) clockContainer.appendChild(sleepBtn);
                    else hud.appendChild(sleepBtn);
                }
            }
        } else {
            if (sleepBtn) sleepBtn.remove();
        }
    }

    showNotification(msg, type = 'info') {
        const area = document.getElementById('notification-area');
        if (!area) return;

        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.innerText = msg;
        area.appendChild(note);
        setTimeout(() => note.remove(), 10000); // 10 seconds
    }

    // NEW: Build Menu Modal
    showBuildMenu(x, y, options) {
        this.openApp('build_menu'); // Open modal container

        const p = this.game.player;
        const playerLevel = p.level || 1;

        // Group by Type
        const categories = {
            'res': { name: 'Residenziale', icon: '🏠', items: [] },
            'com': { name: 'Commerciale', icon: '🏪', items: [] },
            'ind': { name: 'Industriale', icon: '🏭', items: [] },
            'spec': { name: 'Speciale', icon: '✨', items: [] },
            'nature': { name: 'Natura', icon: '🌳', items: [] }
        };

        options.forEach(b => {
            if (categories[b.type]) categories[b.type].items.push(b);
        });

        let listHtml = '';

        for (const [key, cat] of Object.entries(categories)) {
            if (cat.items.length === 0) continue;

            listHtml += `<h4 style="margin: 15px 0 5px 0; border-bottom: 1px solid #444; padding-bottom: 5px; color: #aaa;">${cat.icon} ${cat.name}</h4>`;

            listHtml += cat.items.map(b => {
                const levelRequired = b.level || 1;
                const isLocked = playerLevel < levelRequired;
                const canAfford = p.money >= b.cost; // Check cash on hand (or bank? construct uses checkBank usually)
                // Actually construct() checkBank. Let's assume Bank pay.
                const canAffordBank = p.bankBalance >= b.cost;

                const opacity = isLocked ? '0.5' : '1';
                const cursor = isLocked ? 'not-allowed' : 'pointer';
                const lockIcon = isLocked ? '🔒' : '';

                let clickAction = '';
                if (isLocked) clickAction = `alert('🔒 Richiesto Livello ${levelRequired}!')`;
                else if (!canAffordBank) clickAction = `alert('💸 Fondi bancari insufficienti!')`; // Pre-check warning
                else clickAction = `window.GameEngine.buildings.construct(${x}, ${y}, '${b.id}'); window.GameEngine.ui.closeModal();`;

                const costColor = canAffordBank ? '#4CAF50' : '#F44336';

                return `
                    <div class="job-card" 
                         style="border-left: 4px solid ${b.color}; cursor: ${cursor}; opacity: ${opacity}; display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 10px; margin-bottom: 8px; background: #2a2a2a;" 
                         onclick="${clickAction}">
                        <div>
                            <div style="font-weight: bold; font-size: 1.1em;">${lockIcon} ${b.name}</div>
                            <div style="font-size: 0.9em; color: #ccc;">
                                ${b.income ? `Rendita: <span style="color:#81C784">€${b.income}/gg</span>` : 'Servizio Pubblico'}
                            </div>
                            ${isLocked ? `<div style="color: salmon; font-size: 0.8em;">Livello ${levelRequired} richiesto</div>` : ''}
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: ${costColor};">€${b.cost.toLocaleString()}</div>
                            <div style="font-size: 0.8em; color: #888;">Costo</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        this.modalBody.innerHTML = `
            <div class="app-header">
                <span class="app-title">🏗️ Cantiere</span>
                <button onclick="window.GameEngine.ui.closeModal()">✖️</button>
            </div>
            <div class="app-content" style="padding: 10px; overflow-y: auto; max-height: 70vh; padding-bottom: 50px;">
                <h3 style="margin-top:0;">Seleziona Progetto</h3>
                <p style="font-size:0.9em; color:#aaa;">Saldo Banca: €${p.bankBalance.toLocaleString()}</p>
                ${listHtml}
            </div>
        `;
    }

    // NEW: Land Purchase Modal
    showLandPurchaseMenu(x, y, details) {
        this.openApp('land_buy'); // Open modal container

        // Color based on desirability
        let color = '#4CAF50'; // Green (Cheap)
        if (details.desirability > 40) color = '#FFC107'; // Orange
        if (details.desirability > 75) color = '#F44336'; // Red (Expensive)

        // Hijack the modal body
        this.modalBody.innerHTML = `
            <div class="app-header">
                <span class="app-title">🌍 Acquisto Terreno</span>
                <button onclick="window.GameEngine.ui.closeModal()">✖️</button>
            </div>
            <div class="app-content" style="padding: 20px; text-align: center;">
                <div style="font-size: 50px; margin-bottom: 10px;">🏞️</div>
                <h2 style="margin: 0; color: ${color};">${details.zoneType}</h2>
                <p style="color: #aaa; margin-top: 5px;">Coordinate: ${x}, ${y}</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; margin: 20px 0; background: #222; padding: 15px; border-radius: 8px;">
                    <div>
                        <small style="color: #888;">Desiderabilità</small>
                        <div style="background: #444; height: 8px; border-radius: 4px; margin-top: 5px;">
                            <div style="background: ${color}; width: ${details.desirability}%; height: 100%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div>
                        <small style="color: #888;">Traffico</small>
                        <div style="font-weight: bold;">${details.traffic}</div>
                    </div>
                     <div style="grid-column: span 2;">
                        <small style="color: #888;">Consigliato per</small>
                        <div style="color: #fff; font-style: italic;">${details.suggested}</div>
                    </div>
                </div>

                <div style="background: #333; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${color};">
                    <small>Prezzo di listino</small>
                    <h1 style="margin:0;">€${details.price.toLocaleString()}</h1>
                </div>

                <button class="job-btn" style="width: 100%; background: #4CAF50; font-size: 1.2em; padding: 15px;" 
                    onclick="window.GameEngine.buildings.confirmLandPurchase(${x}, ${y}, ${details.price}); window.GameEngine.ui.closeModal();">
                    ✅ Acquista Terreno
                </button>
            </div>
        `;
    }
    // NEW: Main App Grid (Smartphone Home)
    renderAppGrid() {
        this.openApp('menu_internal'); // Internal state

        const apps = [
            { id: 'bank', name: 'Banca', icon: '💳', color: '#673AB7' },
            { id: 'jobs', name: 'Lavoro', icon: '💼', color: '#795548' },
            { id: 'needs', name: 'Benessere', icon: '❤️', color: '#F44336' },
            { id: 'contacts', name: 'Contatti', icon: '👥', color: '#FF9800' },
            { id: 'politics', name: 'Politica', icon: '🗳️', color: '#607D8B' },
            { id: 'news', name: 'News', icon: '📰', color: '#FFC107' },
            { id: 'weather', name: 'Meteo', icon: '☀️', color: '#2196F3' },
            { id: 'premium', name: 'Shop', icon: '💎', color: '#E040FB' },
            { id: 'wiki', name: 'Guida', icon: '📚', color: '#8D6E63' },
            { id: 'achievements', name: 'Trofei', icon: '🏆', color: '#FFEB3B' },
            { id: 'profile', name: 'Profilo', icon: '👤', color: '#1976D2' },
            { id: 'pets', name: 'Pets', icon: '🐾', color: '#8BC34A' },
            { id: 'settings', name: 'Opzioni', icon: '⚙️', color: '#607D8B' }
        ];

        const gridHtml = apps.map(app => `
            <div onclick="window.GameEngine.ui.openApp('${app.id}')" 
                 style="background: ${app.color}; padding: 20px; border-radius: 15px; text-align: center; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.1s;">
                <div style="font-size: 30px; margin-bottom: 5px;">${app.icon}</div>
                <div style="font-weight: bold; font-size: 0.9em; color: white;">${app.name}</div>
            </div>
        `).join('');

        this.modalBody.innerHTML = `
            <div class="app-header">
                <span class="app-title">📱 DeroOS 2.0</span>
                <button onclick="window.GameEngine.ui.closeModal()">✖️</button>
            </div>
            <div class="app-content" style="padding: 20px;">
                <div id="app-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    ${gridHtml}
                </div>
            </div>
        `;
    }

    // Settings App Implementation (Inline)
    openSettings() {
        // Build HTML for install button if deferredPrompt exists
        let installBtn = '';
        if (window.deferredPrompt) {
            installBtn = `<button class="job-btn" style="background: #E91E63;" onclick="window.GameEngine.ui.installApp()">📲 Installa App</button>`;
        }

        this.modalBody.innerHTML = `
            <div class="app-header" style="background: #455A64;">
                <span class="app-title">⚙️ Opzioni</span>
                <button onclick="window.GameEngine.ui.openApp('menu')">🔙</button>
            </div>
            <div class="app-content" style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                ${installBtn}
                <h3>Gestione Salvataggi</h3>
                <button class="job-btn" onclick="saveGame(); window.GameEngine.ui.showNotification('✅ Salvato!', 'success')">💾 Salva (Locale)</button>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                     <button class="job-btn" style="background: #00897B;" onclick="window.GameEngine.saveSystem.exportSave()">⬇️ Export File</button>
                     <button class="job-btn" style="background: #00897B;" onclick="window.GameEngine.saveSystem.importSave()">⬆️ Import File</button>
                </div>
                <button class="job-btn" style="background: #FF9800;" onclick="loadGame(); window.GameEngine.ui.closeModal()">📂 Carica (Locale)</button>
                <button class="job-btn" style="background: #f44336;" onclick="if(confirm('Cancellare tutto?')) { localStorage.removeItem('dero_tycoon_save'); location.reload(); }">🗑️ Reset Totale</button>
                
                <h3>Audio</h3>
                <button class="job-btn" onclick="window.GameEngine.audio.toggleMute()">🔊 Attiva/Disattiva Suoni</button>
                
                <h3 style="margin-top: 20px;">Info</h3>
                <p style="color: #aaa; font-size: 0.9em;">Dero Tycoon City v2.0 - Phase 13 (PWA)</p>
            </div>
        `;
    }

    installApp() {
        if (!window.deferredPrompt) return;
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            window.deferredPrompt = null;
            this.openSettings(); // Refresh UI to hide button
        });
    }
}
