class FireStationApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'fire-screen';
        screen.className = 'app-screen';

        const p = this.game.player;
        const inspectActive = p.licenses.fireInspection > this.game.time.day;
        const sprinklerActive = p.licenses.fireSprinklers > this.game.time.day;

        screen.innerHTML = `
            <div class="app-header" style="background-color: #D32F2F;">
                <span class="app-title">🚒 Vigili del Fuoco</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Protezione Incendi</h3>
                    <p>Rischio Attuale: <span style="color:${sprinklerActive ? 'green' : (inspectActive ? 'orange' : 'red')}">${sprinklerActive ? 'BASSO' : (inspectActive ? 'MEDIO' : 'ALTO 🔥')}</span></p>
                    <p>Stato: ${sprinklerActive ? '💦 Sprinkler Attivi' : (inspectActive ? '📋 Ispezione OK' : '⚠️ Nessuna Protezione')}</p>
                </div>

                <div class="services-list">
                    <h3>Servizi di Prevenzione</h3>
                    
                    <div class="service-item">
                        <span>📋 Ispezione Sicurezza (30gg)</span>
                        <span>€800</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.fire.buyService('inspection', 800)">Richiedi</button>
                    </div>
                    <small>Riduce i danni del 50%. Obbligatorio per legge.</small>
                    <hr>

                    <div class="service-item">
                        <span>💦 Sistema Sprinkler (30gg)</span>
                        <span>€3.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.fire.buyService('sprinkler', 3000)">Installa</button>
                    </div>
                    <small>Protezione Totale contro gli incendi.</small>
                </div>
            </div>
        `;

        const existing = document.getElementById('fire-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    buyService(type, cost) {
        if (this.game.player.pay(cost)) {
            const p = this.game.player;
            // Init stats if missing
            if (!p.licenses.fireInspection) p.licenses.fireInspection = 0;
            if (!p.licenses.fireSprinklers) p.licenses.fireSprinklers = 0;

            if (type === 'inspection') {
                p.licenses.fireInspection = this.game.time.day + 30;
                this.game.ui.showNotification("📋 Ispezione completata. Rischio ridotto per 30 giorni.");
            } else {
                p.licenses.fireSprinklers = this.game.time.day + 30;
                this.game.ui.showNotification("💦 Sprinkler installati per 30 giorni.");
            }
            this.render();
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }
}
