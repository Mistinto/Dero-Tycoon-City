class PoliticsManager {
    constructor(game) {
        this.game = game;
        this.isMayor = false;
        this.hasCorporation = false;
        this.campaignActive = false;
        this.campaignProgress = 0;

        // Requirements
        this.mayorReqRep = 500;
        this.mayorCost = 50000;

        this.corpCost = 1000000; // 1 Million
    }

    startCampaign() {
        if (this.game.player.reputation < this.mayorReqRep) {
            this.game.ui.showNotification(`❌ Serve ${this.mayorReqRep} Reputazione!`, 'error');
            return;
        }
        if (!this.game.player.pay(this.mayorCost)) {
            this.game.ui.showNotification("❌ Fondi insufficienti per la campagna!", 'error');
            return;
        }

        this.campaignActive = true;
        this.campaignProgress = 10; // Start with 10%
        this.game.ui.showNotification("🗳️ Campagna Elettorale Iniziata!", 'success');
        this.game.ui.apps.politics.render();
    }

    campaignEvent(type) {
        if (!this.campaignActive) return;

        const p = this.game.player;
        let cost = 0;
        let gain = 0;

        if (type === 'rally') {
            cost = 1000;
            gain = Math.floor(Math.random() * 5) + 2; // 2-6%
        } else if (type === 'ad') {
            cost = 5000;
            gain = Math.floor(Math.random() * 8) + 5; // 5-12%
        } else if (type === 'debate') {
            // Skill check?
            if (p.reputation > 700) gain = 10;
            else gain = -5; // Backfire
        }

        if (cost > 0 && !p.pay(cost)) {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
            return;
        }

        this.campaignProgress += gain;
        if (this.campaignProgress > 100) this.campaignProgress = 100;
        if (this.campaignProgress < 0) this.campaignProgress = 0;

        let msgType = gain >= 0 ? 'success' : 'error';
        this.game.ui.showNotification(`📢 Campagna: ${gain > 0 ? '+' : ''}${gain}% Consenso`, msgType);

        if (this.campaignProgress >= 100) {
            this.winElection();
        } else {
            this.game.ui.apps.politics.render();
        }
    }

    winElection() {
        this.campaignActive = false;
        this.isMayor = true;
        this.game.player.reputation += 500;
        this.game.player.gainDerini(50);
        this.game.ui.showNotification("🎉 SEI STATO ELETTO SINDACO!", 'success');
        this.game.ui.showNotification("👑 Tasse azzerate. Poteri sbloccati.", 'info');

        // Unlock Achievement
        if (this.game.achievements) {
            const ach = this.game.achievements.achievements.find(a => a.id === 'mayor_win'); // hypothetical
            // Manual unlock or rely on check() loop? 
            // Better to let check() handle it if stats align, or force it here.
        }

        this.game.ui.apps.politics.render();
        this.checkWin();
    }

    // TOWN HALL ACTIONS
    buyLicense(type, cost) {
        const p = this.game.player;
        if (!p.pay(cost)) {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
            return;
        }

        const currentDay = this.game.time.day;
        if (type === 'building') {
            p.licenses.buildingPermit = currentDay + 7;
            this.game.ui.showNotification("🏗️ Permesso Edilizio acquisito! (7gg)", "success");
        } else if (type === 'commercial') {
            p.licenses.commercialLicense = currentDay + 7;
            this.game.ui.showNotification("💳 Licenza Commerciale acquisita! (7gg)", "success");
        }

        this.game.ui.apps.politics.render(); // Refresh UI
    }

    payTaxes(amount) {
        if (this.isMayor) {
            this.game.ui.showNotification("👑 Il Sindaco non paga le tasse!", "success");
            return;
        }

        const p = this.game.player;
        if (!p.pay(amount)) {
            this.game.ui.showNotification("💸 Non hai abbastanza soldi per le tasse!", "error");
            return;
        }

        p.licenses.taxesPaidDay = this.game.time.day + 30; // Paid for 30 days
        this.game.ui.showNotification("🧾 Tasse pagate per 30 giorni.", "success");
        if (window.GameEngine.ui.activeApp === 'politics') this.game.ui.apps.politics.render();
    }

    // ELECTION LOGIC
    voteMenu() {
        // Placeholder for NPC elections if not running
        this.game.ui.showNotification("🗳️ Hai votato. (Simulazione)", "info");
    }

    foundCorporation(name) {
        if (this.hasCorporation) return;

        if (!this.game.player.pay(this.corpCost)) {
            this.game.ui.showNotification("❌ Serve €1.000.000!", 'error');
            return;
        }

        this.hasCorporation = true;
        this.corpName = name || "DeroCorp";
        this.game.player.gainDerini(100);
        this.game.ui.showNotification(`🏢 ${this.corpName} fondata!`, 'success');
        this.game.ui.showNotification("💹 Entrate passive +20%", 'info'); // Logic needs to be applied in Economy/Buildings
        this.game.ui.apps.politics.render();
        this.checkWin();
    }

    checkWin() {
        if (this.isMayor && this.hasCorporation) {
            // GAME COMPLETED
            setTimeout(() => {
                // Check if already won to avoid spam
                if (!this.hasWon) {
                    this.hasWon = true;
                    alert("🏆 COMPLIMENTI! HAI VINTO DERO TYCOON: CITY!\n\nSei il Sindaco e possiedi la più grande Corporation.\nHai dominato la città!");
                    this.game.player.gainDerini(500);
                }
            }, 1000);
        }
    }
}
