class WikiApp {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.currentCategory = 'basics';
    }

    render() {
        if (!this.container) return;

        const categories = {
            'basics': 'Primi Passi',
            'economy': 'Economia',
            'buildings': 'Edifici',
            'city_life': 'Città',
            'controls': 'Comandi'
        };

        const content = this.getContent(this.currentCategory);

        this.container.innerHTML = `
            <div class="app-header" style="background-color: #5D4037; color: white; border-bottom: 2px solid #3E2723;">
                <span class="app-title">📚 Dero Wiki</span>
                <button onclick="window.GameEngine.ui.closeModal()" style="background:#8D6E63;">✖️</button>
            </div>
            <div class="app-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; background: #2c2c2c;">
                <!-- TABS -->
                <div style="display: flex; overflow-x: auto; background: #3E2723; padding: 10px; gap: 5px; flex-shrink: 0;">
                    ${Object.entries(categories).map(([key, label]) => `
                        <button onclick="window.GameEngine.ui.apps.wiki.switchCategory('${key}')" 
                                style="flex: 1; white-space: nowrap; padding: 8px 15px; border-radius: 4px; border: none; cursor: pointer;
                                       background: ${this.currentCategory === key ? '#8D6E63' : '#4E342E'}; 
                                       color: ${this.currentCategory === key ? '#fff' : '#ccc'}; font-weight: bold;">
                            ${label}
                        </button>
                    `).join('')}
                </div>

                <!-- CONTENT AREA -->
                <div style="padding: 20px; color: #fff; overflow-y: auto; flex: 1; line-height: 1.6; font-size: 0.95em;">
                    ${content}
                </div>
            </div>
        `;
    }

    switchCategory(cat) {
        this.currentCategory = cat;
        this.render();
    }

    getContent(cat) {
        switch (cat) {
            case 'basics':
                return `
                    <h2 style="color: #8D6E63; border-bottom: 1px solid #555; padding-bottom: 5px;">👋 Guida Introduttiva</h2>
                    <p>Benvenuto a <strong>Dero City</strong>! Il tuo scopo è partire da zero e diventare il padrone della città.</p>
                    
                    <h3 style="margin-top: 15px; color: #FFB74D;">❤️ I Tuoi Bisogni</h3>
                    <ul style="margin-left: 20px; list-style-type: disc;">
                        <li><strong>🍔 Fame & 💧 Sete:</strong> Scendono col tempo. Se arrivano a 0, svieni e finisci in ospedale (costa caro!). Compra cibo al Supermercato o Pub.</li>
                        <li><strong>😴 Sonno:</strong> Devi dormire prima delle 24:00. Se non dormi, il giorno dopo avrai meno energia max. Usa il tasto <strong>"DORMI"</strong> che appare a mezzanotte o vai a casa.</li>
                        <li><strong>🚿 Igiene & 👥 Sociale:</strong> Lavati (a casa/hotel) e parla con la gente al Pub per non impazzire.</li>
                    </ul>

                    <h3 style="margin-top: 15px; color: #4DB6AC;">🕒 Tempo e Giorni</h3>
                    <p>Ogni minuto reale è qualche minuto di gioco. La giornata finisce obbligatoriamente a mezzanotte. Il gioco salva automaticamente.</p>
                `;
            case 'economy':
                return `
                    <h2 style="color: #4CAF50; border-bottom: 1px solid #555; padding-bottom: 5px;">💰 Economia & Finanza</h2>
                    
                    <h3 style="margin-top: 15px; color: #81C784;">💵 Soldi e Lavoro</h3>
                    <p>Inizia lavorando (App Lavoro). Guadagnerai XP e sbloccherai carriere migliori (es. da Cameriere a Manager).</p>
                    
                    <h3 style="margin-top: 15px; color: #64B5F6;">💳 Banca</h3>
                    <p>I soldi in tasca possono essere rubati! Depositali in Banca.</p>
                    <ul>
                        <li><strong>Conto Corrente:</strong> Sicuro, zero interessi.</li>
                        <li><strong>Conto Risparmio:</strong> Dà il <strong>0.5%</strong> di interessi ogni notte. Ottimo per iniziare.</li>
                    </ul>

                    <h3 style="margin-top: 15px; color: #E57373;">📈 Investimenti (Rischiosi)</h3>
                    <ul>
                        <li><strong>Azioni:</strong> Pagano dividendi ogni giorno. Prezzi stabili.</li>
                        <li><strong>Crypto:</strong> Prezzi folli. Puoi diventare ricco o povero in un attimo. Compra basso, vendi alto!</li>
                    </ul>
                `;
            case 'buildings':
                return `
                    <h2 style="color: #FF7043; border-bottom: 1px solid #555; padding-bottom: 5px;">🏗️ Edifici e Proprietà</h2>
                    <p>Quando hai abbastanza soldi, puoi comprare terreni e costruire.</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <div style="background: #333; padding: 10px; border-radius: 5px; border-left: 3px solid #4CAF50;">
                            <strong>🏠 Residenziale</strong><br>
                            <small>Case, Appartamenti.</small><br>
                            Aumentano la popolazione max.
                        </div>
                        <div style="background: #333; padding: 10px; border-radius: 5px; border-left: 3px solid #2196F3;">
                            <strong>🏪 Commerciale</strong><br>
                            <small>Negozi, Uffici.</small><br>
                            Generano tasse giornaliere.
                        </div>
                        <div style="background: #333; padding: 10px; border-radius: 5px; border-left: 3px solid #FF9800;">
                            <strong>🏭 Industriale</strong><br>
                            <small>Fabbriche.</small><br>
                            Altissimo profitto, ma inquinano (abbassano il valore dei terreni vicini).
                        </div>
                        <div style="background: #333; padding: 10px; border-radius: 5px; border-left: 3px solid #E040FB;">
                            <strong>✨ Speciale</strong><br>
                            <small>Monumenti, Casinò.</small><br>
                            Bonus unici e Reputazione.
                        </div>
                    </div>
                    <p style="margin-top:10px;"><em>Nota: Devi possedere il terreno prima di costruirci sopra!</em></p>
                `;
            case 'city_life':
                return `
                    <h2 style="color: #AB47BC; border-bottom: 1px solid #555; padding-bottom: 5px;">🌆 Vita in Città</h2>
                    
                    <h3 style="margin-top: 15px;">⭐ Reputazione</h3>
                    <p>Più è alta, più prestiti puoi chiedere e più gente verrà nei tuoi negozi. Si alza lavorando bene e costruendo cose belle.</p>

                    <h3 style="margin-top: 15px;">🍻 Il Pub e gli NPC</h3>
                    <p>Vai al Pub per incontrare personaggi unici (Sindaco, Poliziotto, ecc.). Offri da bere per farteli amici. A livelli alti di amicizia sbloccano <strong>Favori</strong> (sconti, protezione, ecc.).</p>

                    <h3 style="margin-top: 15px;">💎 Derini</h3>
                    <p>Le gemme blu sono la valuta Premium. Sono rarissime. Usale per:</p>
                    <ul>
                        <li>Accelerare tempi.</li>
                        <li>Comprare oggetti esclusivi allo Shop.</li>
                        <li>Resettare le skill.</li>
                    </ul>
                `;
            case 'controls':
                return `
                    <h2 style="color: #9E9E9E; border-bottom: 1px solid #555; padding-bottom: 5px;">🎮 Comandi</h2>
                    <ul>
                        <li><strong>Click / Touch:</strong> Interagisci con tutto.</li>
                        <li><strong>Trascina Mappa:</strong> Per muoverti nella città.</li>
                        <li><strong>Rotella Mouse / Pinch:</strong> Zoom avanti/indietro.</li>
                        <li><strong>📱 Menu:</strong> Apre tutte le app.</li>
                    </ul>
                    <p style="margin-top: 15px;"><strong>Salvataggio:</strong> Il gioco salva da solo, ma puoi forzare il salvataggio in <em>Opzioni</em>.</p>
                `;
            default:
                return `<p>Seleziona una categoria sopra.</p>`;
        }
    }
}
