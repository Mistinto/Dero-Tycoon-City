class NeedsApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render(title = 'DeroDelivery') {
        const screen = document.createElement('div');
        screen.id = 'needs-screen';
        screen.className = 'app-screen';

        // Determine Type based on Title logic
        let showFood = true;
        let showSleep = true;
        let showShop = true;
        let showCinema = false;

        if (title.includes('Ristorante') || title.includes('Chiosco') || title.includes('Bar')) {
            showSleep = false; showShop = false;
        } else if (title.includes('Hotel') || title.includes('Ostello') || title.includes('B&B')) {
            showFood = false; showShop = false;
        } else if (title.includes('Supermercato') || title.includes('Negozio')) {
            showSleep = false; showFood = true; // Supermarket has food
        } else if (title.includes('Cinema')) {
            showFood = true;
            showSleep = false;
            showShop = false;
            showCinema = true;
        }

        let contentHtml = '';
        const cardStyle = 'background: #333; color: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #555;';

        if (showCinema) {
            contentHtml += '<h3>🎬 Cinema</h3>';
            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Biglietto Film</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €15 | +40 Divertimento | ⏱️ 2h</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'movie\')">Guarda Film</button>';
            contentHtml += '</div>';
            contentHtml += '<hr style="margin:20px 0; border-color:#555;">';
        }

        if (showFood) {
            contentHtml += '<h3>🍔 Cibo & Bevande</h3>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Cibo di Strada (Unto)</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €5 | +40 Fame, -5 Igiene | ⏱️ 10m</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'street_food\')">Mangia al Volo</button>';
            contentHtml += '</div>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Ristorante</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €50 | +100 Fame, +20 Sociale | ⏱️ 1h</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'restaurant\')">Cena Fuori</button>';
            contentHtml += '</div>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Supermercato (Scorta)</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €100 | +100 Fame & Sete | ⏱️ 30m</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'groceries\')">Fai la Spesa</button>';
            contentHtml += '</div>';

            // Add Pet Food (Always visible so players know where to find it)
            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#FF9800; margin-top:0;">Cibo per Animali</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €20 | +50 Fame Animale</p>';
            contentHtml += '<button class="job-btn" style="background:#FF9800; color:black;" onclick="window.GameEngine.ui.apps.needs.buy(\'pet_food\')">Compra Croccantini</button>';
            contentHtml += '</div>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Caffè</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €3 | +20 Sete, +10 Energy | ⏱️ 5m</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'coffee\')">Bevi Caffè</button>';
            contentHtml += '</div>';

            contentHtml += '<hr style="margin:20px 0; border-color:#555;">';
        }

        if (showSleep) {
            if (this.game.player.mainHomeId) {
                contentHtml += '<h3>🏠 Casa Dolce Casa</h3>';
                contentHtml += `<div style="${cardStyle} border-color:#4CAF50; background:#1b5e20;">`;
                contentHtml += '<h3 style="color:#fff; margin-top:0;">Dormi nel tuo Letto</h3>';
                contentHtml += '<p style="color:#ddd;">Gratis | +100 Sonno, +10 Felicità</p>';
                contentHtml += '<p style="color:#ccc; font-size:0.9em;"><em>Passa al giorno successivo</em></p>';
                contentHtml += '<button class="job-btn" style="background:#4CAF50" onclick="window.GameEngine.ui.apps.needs.buy(\'home_sleep\')">Dormi a Casa</button>';
                contentHtml += '</div>';
                contentHtml += '<hr style="margin:20px 0; border-color:#555;">';
            }

            contentHtml += '<h3>🛌 Hotel & Sistemazioni</h3>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Panchina / Ostello</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €10 | +40 Sonno, -20 Igiene</p>';
            contentHtml += '<p style="color:#999; font-size:0.9em;"><em>Mal di schiena assicurato</em></p>';
            contentHtml += '<button class="job-btn" style="background:#bfc5c9; color:#333;" onclick="window.GameEngine.ui.apps.needs.buy(\'bench\')">Arrangiati (€10)</button>';
            contentHtml += '</div>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Hotel Standard</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €80 | +100 Sonno, +10 Igiene</p>';
            contentHtml += '<button class="job-btn" style="background:#7986CB" onclick="window.GameEngine.ui.apps.needs.buy(\'hotel_std\')">Camera Doppia</button>';
            contentHtml += '</div>';

            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#FFD700; margin-top:0;">Resort di Lusso</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €300 | +100 Sonno, +50 Fun, +20 Soc</p>';
            contentHtml += '<button class="job-btn" style="background:#FFD700; color:#333;" onclick="window.GameEngine.ui.apps.needs.buy(\'hotel_lux\')">Suite Imperiale</button>';
            contentHtml += '</div>';
        }

        // Safety fallback if flags fail
        if (!showFood && !showSleep && !showShop && !showCinema) {
            contentHtml += '<h3>🏪 Negozio Generico</h3>';
            contentHtml += `<div style="${cardStyle}">`;
            contentHtml += '<h3 style="color:#4CAF50; margin-top:0;">Snack & Bibite</h3>';
            contentHtml += '<p style="color:#ccc;">Costo: €5 | +20 Fame/Sete</p>';
            contentHtml += '<button class="job-btn" onclick="window.GameEngine.ui.apps.needs.buy(\'street_food\')">Compra Snack</button>';
            contentHtml += '</div>';
        }

        screen.innerHTML = `
            <div class="app-header">
                <span class="app-title">${title}</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                ${contentHtml || '<p>Servizi non disponibili al momento.</p>'}
            </div>
        `;

        this.container.appendChild(screen);
    }

    buy(item) {
        let cost = 0;
        let hunger = 0;
        let thirst = 0;
        let sleep = 0;
        let fun = 0;
        let hygiene = 0;
        let social = 0;
        let baseTime = 0; // minutes

        switch (item) {
            // Food
            case 'street_food': cost = 5; hunger = 40; hygiene = -5; baseTime = 10; break;
            case 'restaurant': cost = 50; hunger = 100; social = 20; baseTime = 60; break;
            case 'groceries': cost = 100; hunger = 100; thirst = 100; baseTime = 30; break;
            case 'coffee': cost = 3; thirst = 20; sleep = 5; baseTime = 15; break; // Coffee implies travel
            case 'movie': cost = 15; fun = 40; baseTime = 120; break; // Movie length fixed? Maybe travel to cinema
            case 'pet_food': cost = 20; baseTime = 15; break;

            // Sleep (Fixed times, vehicles don't help sleeping faster)
            case 'bench': cost = 10; sleep = 40; hygiene = -20; social = -10; break;
            case 'hotel_std': cost = 80; sleep = 100; hygiene = 10; break;
            case 'hotel_lux': cost = 300; sleep = 100; fun = 50; social = 20; hygiene = 20; break;
            case 'home_sleep': cost = 0; sleep = 100; fun = 10; break;
        }

        // Apply Speed Multiplier to "Errand" type actions (Food, Shop, Cinema travel)
        // Sleep actions are unaffected usually, but let's keep it simple.

        let timeCost = 0;
        if (baseTime > 0) {
            const speed = this.game.player.getSpeedMultiplier();
            // Minimum time 5 minutes
            timeCost = Math.max(5, Math.floor(baseTime / speed));

            // Log for user understanding
            if (speed > 1.0) {
                console.log(`Speed Bonus: ${speed}x. Time reduced from ${baseTime} to ${timeCost}`);
            }
        }

        // 1. Check Time Limit
        const isSleep = ['bench', 'hotel_std', 'hotel_lux', 'home_sleep'].includes(item);
        const time = this.game.time;

        if (!isSleep) {
            if (time.totalMinutes >= 24 * 60) {
                this.game.ui.showNotification("🚫 È mezzanotte! Devi dormire.", "warning");
                return;
            }
            if (time.totalMinutes + timeCost > 24 * 60) {
                this.game.ui.showNotification(`🚫 Non c'è abbastanza tempo!`, "warning");
                return;
            }
        }

        // PRE-CHECK: PET FOOD
        if (item === 'pet_food' && !this.game.player.pet) {
            this.game.ui.showNotification("🚫 Non hai un animale da sfamare!", "warning");
            return;
        }

        // Check funds
        if (this.game.player.payCash(cost)) {
            if (isSleep) {
                this.game.ui.showNotification("💤 Zzz... A domani!", "info");
                if (hygiene !== 0) this.game.player.restoreNeed('hygiene', hygiene);
                if (social !== 0) this.game.player.restoreNeed('social', social);
                if (fun !== 0) this.game.player.restoreNeed('fun', fun);

                setTimeout(() => {
                    this.game.time.sleep();
                    this.game.ui.closeModal();
                }, 1000);
            } else {
                this.game.player.restoreNeed('hunger', hunger);
                this.game.player.restoreNeed('thirst', thirst);
                if (hygiene !== 0) this.game.player.restoreNeed('hygiene', hygiene);
                if (sleep > 0) this.game.player.restoreNeed('sleep', sleep); // Coffee

                // PET FOOD LOGIC
                if (item === 'pet_food') {
                    if (this.game.player.pet) {
                        this.game.player.pet.hunger = Math.min(100, this.game.player.pet.hunger + 50);
                        this.game.player.pet.happiness = Math.min(100, this.game.player.pet.happiness + 5);
                        this.game.ui.showNotification(`🐾 ${this.game.player.pet.nickname} ha mangiato! (+50 Fame)`, "success");
                    }
                }

                this.game.time.forward(timeCost);

                // Optional: Notify speed bonus
                const speed = this.game.player.getSpeedMultiplier();
                if (speed > 1.0 && timeCost < baseTime) {
                    this.game.ui.showNotification(`🚀 Tempo risparmiato grazie al veicolo! (-${baseTime - timeCost}m)`, "success");
                }
            }
        } else {
            this.game.ui.showNotification("💸 Non hai abbastanza contanti!", "error");
        }
    }
}
