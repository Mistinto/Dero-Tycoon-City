class PoliceApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'police-screen';
        screen.className = 'app-screen';

        const p = this.game.player;
        // Assume protection is stored in p.licenses or p.security for now
        const basicActive = p.licenses.securityBasic > this.game.time.day;
        const totalActive = p.licenses.securityTotal > this.game.time.day;

        screen.innerHTML = `
            <div class="app-header" style="background-color: #3F51B5;">
                <span class="app-title">🚓 Stazione Carabinieri</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Sicurezza Cittadina</h3>
                    <p>Livello Crimine: <span style="color:orange">MEDIO</span></p>
                    <p>La tua protezione: ${totalActive ? '🛡️ TOTALE' : (basicActive ? '👮 BASE' : '❌ NESSUNA')}</p>
                </div>

                <div class="services-list">
                    <h3>Servizi di Protezione</h3>
                    
                    <div class="service-item">
                        <span>👮 Pattugliamento (7gg)</span>
                        <span>€1.500</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.police.buyProtection('basic', 1500)">Richiedi</button>
                    </div>
                    <small>Riduce rischio furti del 50%</small>
                    <hr>

                    <div class="service-item">
                        <span>🎥 Sorveglianza 24h (7gg)</span>
                        <span>€5.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.police.buyProtection('total', 5000)">Attiva</button>
                    </div>
                    <small>Protezione Totale dai criminali</small>
                </div>
            </div>
        `;

        // Clear previous
        const existing = document.getElementById('police-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    buyProtection(type, cost) {
        if (this.game.player.pay(cost)) {
            const p = this.game.player;
            // Init stats if missing
            if (!p.licenses.securityBasic) p.licenses.securityBasic = 0;
            if (!p.licenses.securityTotal) p.licenses.securityTotal = 0;

            if (type === 'basic') {
                p.licenses.securityBasic = this.game.time.day + 7;
                this.game.ui.showNotification("👮 Pattuglie attivate per 7 giorni.");
            } else {
                p.licenses.securityTotal = this.game.time.day + 7;
                this.game.ui.showNotification("🎥 Sorveglianza 24h attivata per 7 giorni.");
            }
            this.render();
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }
}
