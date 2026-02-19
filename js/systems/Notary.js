class Notary {
    constructor(game) {
        this.game = game;
        this.pendingTransactions = [];
        this.baseDelay = 5; // 5 in-game minutes (~100 real seconds)
    }

    // Called by BuildingManager when buying land
    startTransaction(x, y, type = 'land') {
        const endTime = this.game.time.totalMinutes + this.baseDelay;

        this.pendingTransactions.push({
            x, y, type, endTime,
            desc: (type === 'land' ? 'Acquisto Terreno' : 'Acquisto Immobile')
        });

        this.game.ui.showNotification("📜 Pratica Notaio avviata... (2h)", "info");

        // VISUAL FEEDBACK: Update Map to show hourglass
        if (this.game.buildings) this.game.buildings.updateMap();
    }

    update() {
        // Check for completed transactions
        const now = this.game.time.totalMinutes;

        // Filter out completed ones
        const completed = this.pendingTransactions.filter(t => t.endTime <= now);
        this.pendingTransactions = this.pendingTransactions.filter(t => t.endTime > now);

        completed.forEach(t => {
            this.completeTransaction(t);
        });
    }

    completeTransaction(t) {
        if (t.type === 'land') {
            // Finalize Land Purchase
            this.game.buildings.finalizeLandPurchase(t.x, t.y);
            this.game.ui.showNotification("✅ Atto Notarile completato! Terreno tuo.", "success");
        }
    }

    // Check if a tile is pending
    isPending(x, y) {
        return this.pendingTransactions.some(t => t.x === x && t.y === y);
    }
}
