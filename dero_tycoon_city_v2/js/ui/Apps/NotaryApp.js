class NotaryApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'notary-screen';
        screen.className = 'app-screen';
        screen.style.background = '#f4e7d1'; // Parchment color
        screen.style.color = '#3e2723';

        // 1. Pending Transactions
        const pending = this.game.notary.pendingTransactions;
        let pendingHtml = '';
        if (pending.length === 0) {
            pendingHtml = '<p><i>Nessuna pratica in corso.</i></p>';
        } else {
            pendingHtml = pending.map(t => {
                const minutesLeft = Math.max(0, t.endTime - this.game.time.totalMinutes);
                const progress = 100 - ((minutesLeft / this.game.notary.baseDelay) * 100);
                return `
                <div style="background:#fff; padding:10px; margin-bottom:5px; border:1px solid #8d6e63; border-radius:4px;">
                    <strong>${t.desc} (${t.x}, ${t.y})</strong><br>
                    <small>Tempo rimanente: ${minutesLeft} min</small>
                    <div style="width:100%; background:#ccc; height:5px; margin-top:5px;">
                        <div style="width:${progress}%; background:#4CAF50; height:100%;"></div>
                    </div>
                </div>`;
            }).join('');
        }

        // 2. Land Value Zones
        // Visual representation of the formula in BuildingManager.js
        // Price = 200 + (800 * centerFactor)
        const zones = [
            { name: "Centro Città (Raggio 0-5)", factor: "100%", price: "€800 - €1000" },
            { name: "Zona Residenziale (Raggio 5-10)", factor: "60-80%", price: "€500 - €800" },
            { name: "Periferia (Raggio 10+)", factor: "20-50%", price: "€200 - €500" }
        ];

        let zonesHtml = zones.map(z => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px dashed #8d6e63; padding:5px 0;">
                <span>${z.name}</span>
                <span>${z.price}</span>
            </div>
        `).join('');

        zonesHtml += `
        <h4 style="margin-top:20px; border-bottom:1px solid #ddd;">⚖️ Tasse & Commissioni</h4>
        <ul style="font-size:0.9em; padding-left:20px; margin-top:5px;">
            <li><strong>Tassa Acquisto Suolo:</strong> 100% (Inclusa nel prezzo)</li>
            <li><strong>Permessi Costruzione:</strong> +20% sul Costo Base</li>
            <li><strong>Tassa Commerciale:</strong> +5% sui Profitti (Stimata)</li>
            <li><strong>Spese Notarili:</strong> €500 fisse per pratica</li>
        </ul>`;


        screen.innerHTML = `
            <div class="app-header" style="background:#5d4037; color:#fff;">
                <span class="app-title">⚖️ Studio Notarile</span>
                <button onclick="goHome()" style="color:#fff;">✖️</button>
            </div>
            <div class="app-content" style="padding:15px;">
                <h3>📜 Pratiche in Corso</h3>
                <div id="notary-pending-list">
                    ${pendingHtml}
                </div>

                <hr style="border-color:#8d6e63; margin:20px 0;">

                <h3>🌍 Valore Terreni</h3>
                <p><small>Il costo dei terreni varia in base alla distanza dal Centro.</small></p>
                <div style="background:#fff; padding:10px; border:1px solid #8d6e63;">
                    ${zonesHtml}
                </div>

                <div style="margin-top:20px; text-align:center;">
                    <button class="action-btn" style="background:#5d4037; color:white;" onclick="window.GameEngine.npcs.interact('notary')">
                        Parla con il Notaio
                    </button>
                </div>
            </div>
        `;

        this.container.appendChild(screen);
    }
}
