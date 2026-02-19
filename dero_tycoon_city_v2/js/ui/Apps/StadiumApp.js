class StadiumApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'stadium-screen';
        screen.className = 'app-screen';

        screen.innerHTML = `
            <div class="app-header" style="background-color: #4CAF50;">
                <span class="app-title">🏟️ Stadio Comunale</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Gestione Eventi</h3>
                    <h3>Gestione Eventi</h3>
                    <p>Patrimonio (Valore Totale): €${this.game.player.getNetWorth().toLocaleString()}</p>
                </div>

                <div class="services-list">
                    <h3>Organizza</h3>
                    
                    ${this.renderEvent('Partita di Calcio', 100, 500, 0.01)}
                    ${this.renderEvent('Concerto Rock', 500, 5000, 0.02)}
                    ${this.renderEvent('Grande Evento', 20000, 200000, 0.02)}
                    ${this.renderEvent('Sponsorizzazione', 50000, 500000, 0.05)}
                    
                </div>
            </div>
        `;

        const existing = document.getElementById('stadium-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    renderEvent(name, costBase, costMax, returnPct) {
        // Simple logic for display
        return `
            <div class="service-item">
                <div style="flex:1;">
                    <span style="font-size:1.1em;">🎫 ${name}</span><br>
                    <small style="color:#aaa;">Costo: €${costBase.toLocaleString()}</small>
                    <small style="color:#4CAF50;">Ritorno: +${(returnPct * 100).toFixed(0)}% del Patrimonio</small>
                </div>
                <button class="job-btn" style="width:auto; padding:5px 15px;" onclick="window.GameEngine.ui.apps.stadium.organizeEvent('${name}', ${costBase}, ${returnPct})">Organizza</button>
            </div>
        `;
    }

    organizeEvent(name, cost, returnPct) {
        const p = this.game.player;

        if (p.pay(cost)) {
            // Check Net Worth scaling
            // To prevent exploit, maybe cap the return?
            // User requested scaling return.
            // Let's implement it as requested.

            const netWorth = p.getNetWorth();
            const potentialGain = netWorth * returnPct;

            this.game.ui.showNotification(`📢 Organizzazione ${name} in corso...`);

            // Disable button spam/reload?
            // Should properly be async/stateful but for now timeout is fine.

            setTimeout(() => {
                const flop = Math.random() < 0.10; // 10% Flop
                if (flop) {
                    const gain = potentialGain * 0.5;
                    p.earn(gain);
                    p.reputation = Math.max(0, p.reputation * 0.9); // -10% Rep
                    this.game.ui.showNotification(`📉 FLOP! ${name} non è piaciuto. Guadagno ridotto.`, "warning");
                } else {
                    p.earn(potentialGain);
                    p.reputation += 20; // Good rep for events
                    this.game.ui.showNotification(`🎉 SUCCESSO! ${name} è stato un trionfo!`, "success");
                }

                // Refresh to update net worth display
                this.render();
            }, 2000);

        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }
}
