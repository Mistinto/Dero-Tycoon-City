class PremiumShopApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'premium-shop-screen';
        screen.className = 'app-screen';
        screen.style.background = 'linear-gradient(135deg, #1a237e, #4a148c)'; // Deep Blue/Purple
        screen.style.color = 'white';

        const p = this.game.player;

        screen.innerHTML = `
            <div class="app-header" style="background: rgba(0,0,0,0.5);">
                <span class="app-title"><span class="derini-icon"></span> Negozio Derini</span>
                <button onclick="goHome()" style="color:white;">✖️</button>
            </div>
            <div class="app-content" style="padding:15px; text-align:center;">
                
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #E040FB;">
                    <br>
                    <div class="derini-icon large" style="margin-bottom:10px;"></div>
                    <h2>${p.derini} Derini</h2>
                    <p style="color:#E040FB;">Valuta Premium</p>
                </div>

                <h3>⚡ Potenziamenti Rapidi</h3>
                
                <div class="job-card" style="background: rgba(0,0,0,0.3); border: 1px solid #4CAF50;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="text-align:left;">
                            <h4>💵 Pacchetto Soldi</h4>
                            <small>Ottieni €5.000 (No Tasse)</small>
                        </div>
                        <button class="job-btn" style="width:auto; background:#4CAF50;" onclick="window.GameEngine.ui.apps.premium.buy('money')">
                            <span class="derini-icon"></span> 5
                        </button>
                    </div>
                </div>

                <div class="job-card" style="background: rgba(0,0,0,0.3); border: 1px solid #2196F3;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="text-align:left;">
                            <h4>🔋 Ricarica Completa</h4>
                            <small>Ripristina tutti i bisogni</small>
                        </div>
                        <button class="job-btn" style="width:auto; background:#2196F3;" onclick="window.GameEngine.ui.apps.premium.buy('energy')">
                            <span class="derini-icon"></span> 3
                        </button>
                    </div>
                </div>

                <div class="job-card" style="background: rgba(0,0,0,0.3); border: 1px solid #FFC107;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="text-align:left;">
                            <h4>⏳ Salto Temporale</h4>
                            <small>Avanti veloce 4 ore</small>
                        </div>
                        <button class="job-btn" style="width:auto; background:#FFC107; color:black;" onclick="window.GameEngine.ui.apps.premium.buy('time')">
                            <span class="derini-icon"></span> 2
                        </button>
                    </div>
                </div>

                <hr style="border-color: rgba(255,255,255,0.2); margin: 20px 0;">

                <h3>📺 Guadagna Derini</h3>
                <p><small>Guarda uno spot pubblicitario (simulato) per guadagnare gemme!</small></p>

                <button id="ad-btn" class="job-btn" style="background: linear-gradient(45deg, #FF5722, #FF9800); animation: pulse 2s infinite;" onclick="window.GameEngine.ui.apps.premium.watchAd()">
                    🎬 Guarda Spot (+1 <span class="derini-icon"></span>)
                </button>

            </div>
        `;

        this.container.appendChild(screen);
    }

    buy(itemId) {
        const p = this.game.player;

        if (itemId === 'money') {
            if (p.payDerini(5)) {
                p.money += 5000;
                this.game.ui.showNotification("💵 Hai ricevuto €5.000!", "success");
            } else {
                this.game.ui.showNotification("💎 Derini insufficienti!", "error");
            }
        } else if (itemId === 'energy') {
            if (p.payDerini(3)) {
                p.needs.hunger = 100;
                p.needs.thirst = 100;
                p.needs.sleep = 100;
                p.needs.hygiene = 100;
                p.needs.social = 100;
                p.needs.fun = 100;
                this.game.ui.showNotification("🔋 Energia ripristinata al massimo!", "success");
            } else {
                this.game.ui.showNotification("💎 Derini insufficienti!", "error");
            }
        } else if (itemId === 'time') {
            if (p.payDerini(2)) {
                this.game.time.forward(240); // 4 hours
                this.game.ui.showNotification("⏳ Hai saltato 4 ore nel futuro!", "info");
            } else {
                this.game.ui.showNotification("💎 Derini insufficienti!", "error");
            }
        }

        // Refresh UI
        this.render(); // Re-render to update balance
        const existing = document.getElementById('premium-shop-screen');
        if (existing) existing.remove(); // Remove old one (render append duplicate otherwise if simple implementation)
        // Correction: render appends. We should clear first. 
        // My simple implementation usually clears container in UIManager, but here I'm calling render directly inside buy.
        // Let's rely on UIManager to re-open or handle it.
        // Actually, easiest is to just update the balance text if I kept reference, but re-render is fine if I handle the DOM correctly.

        // Fix for re-render duplication:
        if (document.getElementById('premium-shop-screen')) {
            document.getElementById('premium-shop-screen').remove();
            this.render();
        }
    }

    watchAd() {
        const btn = document.getElementById('ad-btn');
        if (!btn) return;

        btn.disabled = true;
        btn.innerText = "⏳ Riproduzione in corso...";
        btn.style.animation = "none";
        btn.style.background = "#555";

        this.game.ui.showNotification("📺 Spot Pubblicitario: 'Compra DeroCola!'...", "info");

        setTimeout(() => {
            this.game.player.gainDerini(1);
            this.game.ui.showNotification("💎 Grazie per la visione! (+1 Derini)", "success");

            // Refresh
            if (document.getElementById('premium-shop-screen')) {
                document.getElementById('premium-shop-screen').remove();
                this.render();
            }
        }, 3000); // 3 seconds delay
    }
}
