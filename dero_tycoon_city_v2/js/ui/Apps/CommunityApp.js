class CommunityApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'community-screen';
        screen.className = 'app-screen';

        screen.innerHTML = `
            <div class="app-header" style="background-color: #FF9800;">
                <span class="app-title">🤝 Centro Sociale</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Vita Sociale</h3>
                    <p>Reputazione: ⭐ ${this.game.player.reputation}</p>
                    <p>Amici: 0 (Arriveranno presto!)</p>
                </div>

                <div class="services-list">
                    <h3>Attività</h3>
                    
                    <div class="service-item">
                        <span>🎉 Festa Cittadina</span>
                        <span>€10.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.community.organizeParty()">Organizza</button>
                    </div>
                    <small>Migliora relazione con tutti gli NPC</small>
                    <hr>

                    <div class="service-item">
                        <span>☕ Incontro Sociale</span>
                        <span>€500</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.community.meetNPC()">Partecipa</button>
                    </div>
                    <small>Incontra un cittadino a caso</small>
                    <hr>

                    <div class="service-item">
                        <span>🎁 Donazione Pubblica</span>
                        <span>€1.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.community.donate(1000)">Dona</button>
                    </div>
                    <small>+10 Reputazione</small>
                </div>
            </div>
        `;

        const existing = document.getElementById('community-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    organizeParty() {
        if (this.game.player.pay(10000)) {
            this.game.ui.showNotification("🎉 La festa è un successo! Tutti ti amano di più.");
            this.game.player.reputation += 50;
            // TODO: Increase NPC relationship stats
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }

    meetNPC() {
        if (this.game.player.pay(500)) {
            const names = ["Mario", "Luigi", "Giovanna", "Anna", "Paolo"];
            const npc = names[Math.floor(Math.random() * names.length)];
            this.game.ui.showNotification(`☕ Hai preso un caffè con ${npc}.`);
            // TODO: Add specific NPC stats
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }

    donate(amount) {
        if (this.game.player.pay(amount)) {
            this.game.player.reputation += 10;
            this.game.ui.showNotification("💖 Grazie per la tua generosità! (+10 Rep)");
            this.render();
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }
}
