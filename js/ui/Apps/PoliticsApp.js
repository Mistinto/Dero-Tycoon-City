class PoliticsApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'politics-screen';
        screen.className = 'app-screen';

        const pm = this.game.politics;
        const p = this.game.player;
        const day = this.game.time.day;
        const netWorth = p.money + p.bankBalance;
        const taxAmount = Math.floor(netWorth * 0.02);

        let content = '';

        // 1. TOWN HALL SERVICES
        content += `
            <div class="job-card" style="border-left: 5px solid #9C27B0;">
                <h3>🏛️ Servizi Comunali</h3>
                
                <div class="service-item">
                    <span>🧾 Tasse Patrimoniali (2%)</span>
                    <span>€${taxAmount.toLocaleString()}</span>
                    <button class="job-btn" onclick="window.GameEngine.politics.payTaxes(${taxAmount})">Paga</button>
                </div>
                <small>Pagate fino al giorno: ${p.licenses.taxesPaidDay}</small>
                <hr>

                <div class="service-item">
                    <span>🏗️ Permesso Edilizio (7gg)</span>
                    <span>€1.000</span>
                    <button class="job-btn" onclick="window.GameEngine.politics.buyLicense('building', 1000)">Acquista</button>
                </div>
                <small>Sconto 20% Costruzioni. Scade: Giorno ${p.licenses.buildingPermit}</small>
                <hr>

                <div class="service-item">
                    <span>💳 Licenza Commerciale (7gg)</span>
                    <span>€5.000</span>
                    <button class="job-btn" onclick="window.GameEngine.politics.buyLicense('commercial', 5000)">Acquista</button>
                </div>
                <small>+50% Reddito Negozi. Scade: Giorno ${p.licenses.commercialLicense}</small>
            </div>
        `;

        // 2. POLITICS & ELECTION
        if (day % 30 === 0) { // Election Day
            content += `
                <div class="job-card" style="border-left: 5px solid gold; animation: pulse 2s infinite;">
                    <h3>🗳️ ELEZIONI IN CORSO!</h3>
                    <p>È il giorno del voto. Scegli il tuo candidato.</p>
                    <button class="job-btn" onclick="window.GameEngine.politics.voteMenu()">VAI AL SEGGIO</button>
                </div>
            `;
        }

        if (pm.isMayor) {
            content += `
                <div class="job-card" style="border-left: 5px solid gold; background: #333;">
                    <h3>👑 Ufficio del Sindaco</h3>
                    <p>Stato: <strong>In Carica</strong></p>
                    <p>Poteri Attivi:</p>
                    <ul>
                        <li>✅ Immunità Fiscale</li>
                        <li>✅ Permessi Edilizi Gratuiti (Automatico)</li>
                        <li>✅ +Livello Reputazione Max</li>
                    </ul>
                </div>
            `;
        } else if (pm.campaignActive) {
            content += `
                <div class="job-card" style="border-left: 5px solid gold;">
                    <h3>🗳️ Campagna Elettorale</h3>
                    <p>Consenso: <strong>${pm.campaignProgress}%</strong> (Serve 100%)</p>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <button class="job-btn" style="background:#2196F3;" onclick="window.GameEngine.politics.campaignEvent('rally')">🎤 Comizio (€1k)</button>
                        <button class="job-btn" style="background:#4CAF50;" onclick="window.GameEngine.politics.campaignEvent('ad')">📺 Pubblicità (€5k)</button>
                        <button class="job-btn" style="background:#E91E63;" onclick="window.GameEngine.politics.campaignEvent('debate')">🗣️ Dibattito (Gratis, Rischioso)</button>
                    </div>
                </div>
            `;
        } else {
            // Not Mayor, Not Campaigning
            content += `
                <div class="job-card">
                    <h3>👔 Carriera Politica</h3>
                    <p>Diventa Sindaco per gestire la città.</p>
                    <p>Requisiti: 500 Rep, €50.000</p>
                    <button class="job-btn" onclick="window.GameEngine.politics.startCampaign()">Candidati (€50k)</button>
                </div>
            `;
        }

        // 3. CORPORATION
        if (pm.hasCorporation) {
            content += `
                <div class="job-card" style="border-left: 5px solid #2196F3;">
                    <h3>🏢 ${pm.corpName}</h3>
                    <p>CEO: ${this.game.player.name || 'Tu'}</p>
                    <p>Benefit: Entrate Passive +20%</p>
                </div>
            `;
        } else {
            content += `
                <div class="job-card">
                    <h3>🏢 Fonda Corporazione</h3>
                    <p>Costo: €1.000.000</p>
                    <p>Sblocca: Monopolio, Bonus Rendite</p>
                    <button class="job-btn" onclick="window.GameEngine.politics.foundCorporation('DeroCorp'); window.GameEngine.ui.apps.politics.render()">Fonda (€1M)</button>
                </div>
            `;
        }

        screen.innerHTML = `
            <div class="app-header">
                <span class="app-title">⚖️ Politica & Potere</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                ${content}
            </div>
        `;

        // Clear previous if re-rendering
        const existing = document.getElementById('politics-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }
}
