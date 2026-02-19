class HospitalApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'hospital-screen';
        screen.className = 'app-screen';

        const p = this.game.player;
        const hasInsurance = p.licenses.insurance > this.game.time.day;
        const costMult = hasInsurance ? 0.5 : 1.0;

        screen.innerHTML = `
            <div class="app-header" style="background-color: #E91E63;">
                <span class="app-title">🏥 Ospedale Generale</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Stato Salute</h3>
                    <div class="progress-bar">
                        <div class="fill" style="width: ${p.needs.health}%; background: #E91E63;"></div>
                    </div>
                    <p>❤️ ${Math.floor(p.needs.health)}%</p>
                    <small>${hasInsurance ? '✅ Assicurazione Attiva' : '❌ Non Assicurato'}</small>
                </div>

                <div class="services-list">
                    <h3>Trattamenti</h3>
                    
                    <div class="service-item">
                        <span>💊 Cura Medica (Base)</span>
                        <span>€${500 * costMult}</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.hospital.buyTreatment('cure', ${500 * costMult})">Paga</button>
                    </div>
                    <small>Ripristina 50% Salute</small>
                    <hr>

                    <div class="service-item">
                        <span>🩺 Check-up Completo</span>
                        <span>€${3000 * costMult}</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.hospital.buyTreatment('checkup', ${3000 * costMult})">Prenota</button>
                    </div>
                    <small>+20% Produttività (5gg)</small>
                    <hr>

                    <div class="service-item">
                        <span>🛡️ Assicurazione Sanitaria</span>
                        <span>€2.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.hospital.buyInsurance()">Attiva</button>
                    </div>
                    <small>Sconto 50% su cure. Ambulanza Gratis.</small>
                    <hr>

                     <div class="service-item">
                        <span>🚑 Ambulanza Rapida</span>
                        <span>${hasInsurance ? 'GRATIS' : '€1.000'}</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.hospital.callAmbulance()">Chiama</button>
                    </div>
                </div>
            </div>
        `;

        // Clear previous
        const existing = document.getElementById('hospital-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    buyTreatment(type, cost) {
        if (this.game.player.pay(cost)) {
            if (type === 'cure') {
                this.game.player.restoreNeed('health', 50);
                this.game.ui.showNotification("💊 Ti senti molto meglio!");
            } else if (type === 'checkup') {
                this.game.player.licenses.checkupBuff = this.game.time.day + 5;
                this.game.ui.showNotification("🩺 Check-up completato. Ti senti energico!");
            }
            this.render();
        } else {
            this.game.ui.showNotification("💸 Non hai abbastanza soldi!", "error");
        }
    }

    buyInsurance() {
        if (this.game.player.licenses.insurance > this.game.time.day) {
            this.game.ui.showNotification("🛡️ Hai già un'assicurazione attiva!", "info");
            return;
        }

        if (this.game.player.pay(2000)) {
            this.game.player.licenses.insurance = this.game.time.day + 30; // 30 Days coverage
            this.game.ui.showNotification("🛡️ Assicurazione attivata per 30 giorni.", "success");
            this.render();
        } else {
            this.game.ui.showNotification("💸 Non hai abbastanza soldi!", "error");
        }
    }

    callAmbulance() {
        const hasInsurance = this.game.player.licenses.insurance > this.game.time.day;
        const cost = hasInsurance ? 0 : 1000;

        if (cost === 0 || this.game.player.pay(cost)) {
            this.game.player.restoreNeed('health', 100);
            this.game.ui.showNotification("🚑 Ambulanza arrivata! Sei stato curato.", "success");
            this.render();
        } else {
            this.game.ui.showNotification("💸 Non puoi permetterti l'ambulanza!", "error");
        }
    }
}
