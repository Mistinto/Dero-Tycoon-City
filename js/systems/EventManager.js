class EventManager {
    constructor(game) {
        this.game = game;
        this.lastDayChecked = 0;
    }

    // Checking events periodically or daily
    checkEvent() {
        // Daily Check
        const currentDay = this.game.time.day;
        if (currentDay > this.lastDayChecked) {
            this.dailyChecks(currentDay);
            this.lastDayChecked = currentDay;
        }
    }

    dailyChecks(day) {
        // Probabilities (Daily)
        if (Math.random() < 0.10) this.triggerCrime();       // 10% Crime
        if (Math.random() < 0.05) this.triggerFire();        // 5% Fire
        if (Math.random() < 0.05) this.triggerEconomy();     // 5% Market Event
        if (Math.random() < 0.03) this.triggerWindfall();    // 3% Good Luck

        this.checkHealthSeasons();
    }

    triggerCrime() {
        const p = this.game.player;
        const hasBasicSecurity = p.licenses.securityBasic > this.game.time.day;
        const hasTotalSecurity = p.licenses.securityTotal > this.game.time.day;

        let successChance = 0.5; // Base 50/50 if triggered
        if (hasBasicSecurity) successChance = 0.2;
        if (hasTotalSecurity) successChance = 0.0;

        if (Math.random() < successChance) {
            // Robbery Success
            const stolen = Math.floor(p.money * 0.05) + 50; // 5% + 50 flat
            if (p.money > 0) {
                p.money = Math.max(0, p.money - stolen);
                p.stats.moneyLostToCrime = (p.stats.moneyLostToCrime || 0) + stolen;
                this.game.ui.showNotification(`🔫 RAPINA! Ti hanno rubato €${stolen}!`, "error");
                if (this.game.audio) this.game.audio.playSound('error');
            }
        } else {
            // Sventato
            if (hasBasicSecurity || hasTotalSecurity) {
                this.game.ui.showNotification("🛡️ La sicurezza ha sventato un tentativo di furto.", "success");
            } else {
                this.game.ui.showNotification("🏃‍♂️ Un ladro ha tentato lo scippo ma è scappato!", "warning");
            }
        }
    }

    triggerFire() {
        // Simplification: Player needs buildings to have a fire
        if (!this.game.player.ownedBuildings.length) return;

        const p = this.game.player;
        const hasInspection = p.licenses.fireInspection > this.game.time.day;
        const hasSprinklers = p.licenses.fireSprinklers > this.game.time.day;

        if (hasSprinklers) return; // Protected

        // Pick random building
        // Logic to damage building would need repair mechanic. 
        // For now, simple "Fine" / "Repair Cost"

        if (hasInspection && Math.random() < 0.7) {
            this.game.ui.showNotification("🚒 I Pompieri hanno prevenuto un incendio nei tuoi edifici.", "info");
            return;
        }

        const cost = 500 * p.level;
        if (p.money >= cost) {
            p.money -= cost;
            this.game.ui.showNotification(`🔥 INCENDIO! Danni alle strutture. Riparazioni: -€${cost}`, "error");
            if (this.game.audio) this.game.audio.playSound('error');
        } else {
            // Debt? Or just 0
            p.money = 0;
            this.game.ui.showNotification(`🔥 INCENDIO DEVASTANTE! Hai perso tutti i contanti per le riparazioni.`, "error");
            if (this.game.audio) this.game.audio.playSound('error');
        }
    }

    triggerEconomy() {
        const boom = Math.random() > 0.5;
        if (boom) {
            this.game.ui.showNotification("📈 BOOM ECONOMICO! Le azioni salgono!", "success");
            // Simulate stock rise (mock, real implementation needs Market hook)
            if (this.game.audio) this.game.audio.playSound('money_in');
        } else {
            this.game.ui.showNotification("📉 CROLLO MERCATI! Le criptovalute tremano...", "warning");
            if (this.game.audio) this.game.audio.playSound('error');
        }
    }

    triggerWindfall() {
        const type = Math.random();
        if (type < 0.5) {
            // Find Money
            const amount = 50 * this.game.player.level;
            this.game.player.earn(amount);
            this.game.ui.showNotification(`🍀 Che fortuna! Hai trovato €${amount} per terra.`, "success");
        } else {
            // Lottery
            const win = 1000;
            this.game.player.earn(win);
            this.game.ui.showNotification(`🎫 HAI VINTO ALLA LOTTERIA PROVINCIALE! +€${win}`, "success");
            if (this.game.audio) this.game.audio.playSound('level_up');
        }
    }

    checkHealthSeasons() {
        // Simulating simple seasons with Day cycle
        const seasonDay = this.game.time.day % 40;

        // Spring
        if (seasonDay < 10 && Math.random() < 0.1) {
            // Low chance text only
        }

        // Winter
        if (seasonDay >= 30) {
            if (this.game.player.needs.hunger < 50 && Math.random() < 0.1) {
                this.game.ui.showNotification("🥶 Influenza! Riposati o mangia meglio.", "info");
                this.game.player.needs.sleep = Math.max(0, this.game.player.needs.sleep - 20);
            }
        }
    }
}
