class SaveSystem {
    constructor(game) {
        this.game = game;
        this.SAVE_KEY = 'dero_tycoon_v2_save';
    }

    saveGame() {
        const data = {
            time: {
                totalMinutes: this.game.time.totalMinutes,
                day: this.game.time.day
            },
            player: {
                money: this.game.player.money,
                bankBalance: this.game.player.bankBalance,
                reputation: this.game.player.reputation,
                needs: this.game.player.needs,
                job: this.game.player.job,
                jobLevel: this.game.player.jobLevel,
                level: this.game.player.level,
                xp: this.game.player.xp,
                xpToNextLevel: this.game.player.xpToNextLevel,
                ownedBuildings: this.game.player.ownedBuildings,
                rentedBuildings: this.game.player.rentedBuildings,
                portfolio: this.game.player.portfolio,
                loans: this.game.player.loans,
                savings: this.game.player.savings,
                cds: this.game.player.cds,
                transactions: this.game.player.transactions,
                licenses: this.game.player.licenses,
                education: this.game.player.education,
                research: this.game.player.research,
                currentJob: this.game.player.currentJob
            },
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            console.log("Game Saved.");
            this.game.ui.showNotification("💾 Partita Salvata!");
        } catch (e) {
            console.error("Save failed:", e);
            this.game.ui.showNotification("❌ Errore Salvataggio!", "error");
        }
    }

    loadGame(manual = true) {
        if (manual && !confirm("Sei sicuro di voler caricare? I progressi non salvati andranno persi.")) return;

        try {
            const json = localStorage.getItem(this.SAVE_KEY);
            if (!json) {
                this.game.ui.showNotification("⚠️ Nessun salvataggio trovato!", "warning");
                return false;
            }

            const data = JSON.parse(json);

            // Restore Time
            this.game.time.totalMinutes = data.time.totalMinutes || 0;
            this.game.time.day = data.time.day || 1;

            // Restore Player Data (Merge with defaults to avoid undefined errors if new fields added)
            const p = this.game.player;
            if (data.player) {
                p.money = data.player.money ?? 200;
                p.bankBalance = data.player.bankBalance ?? 5000;
                p.reputation = data.player.reputation ?? 100;

                // Robust Needs Merge
                if (data.player.needs) {
                    p.needs.hunger = data.player.needs.hunger ?? 100;
                    p.needs.thirst = data.player.needs.thirst ?? 100;
                    p.needs.sleep = data.player.needs.sleep ?? 100;
                    p.needs.hygiene = data.player.needs.hygiene ?? 100;
                    p.needs.social = data.player.needs.social ?? 100;
                }

                p.job = data.player.job || null;
                p.jobLevel = data.player.jobLevel || 1;

                // Leveling System (New)
                p.level = data.player.level || 1;
                p.xp = data.player.xp || 0;
                // Recalculate xpToNextLevel based on level if not saved, or simple formula
                p.xpToNextLevel = data.player.xpToNextLevel || (1000 * Math.pow(1.5, p.level - 1));

                p.ownedBuildings = data.player.ownedBuildings || [];
                p.rentedBuildings = data.player.rentedBuildings || [];

                // Financials - Robust Merge
                p.portfolio = p.portfolio || { stocks: {}, crypto: {} };
                if (data.player.portfolio) {
                    p.portfolio.stocks = data.player.portfolio.stocks || {};
                    p.portfolio.crypto = data.player.portfolio.crypto || {};
                }

                p.loans = data.player.loans || [];
                p.savings = data.player.savings || { balance: 0, interest: 0.005 };
                p.cds = data.player.cds || [];
                p.transactions = data.player.transactions || [];

                // Progression
                p.licenses = data.player.licenses || p.licenses;
                p.education = data.player.education || p.education;
                p.research = data.player.research || p.research;

                // Active Job
                p.currentJob = data.player.currentJob || null;
                // Resume UI if job active
                if (p.currentJob && window.GameEngine && window.GameEngine.ui) {
                    // We need to restart the UI timer if it was running. 
                    // JobApp.render() handles the UI loop if currentJob exists.
                    setTimeout(() => {
                        window.GameEngine.ui.openApp('jobs'); // Re-open window
                    }, 500);
                }

                // Restore Buildings on Grid
                if (this.game.buildings) {
                    this.game.buildings.loadFromSave(p.ownedBuildings);
                }
            }

            console.log("Game Loaded.");
            this.game.ui.showNotification("📂 Partita Caricata!");

            // Check for offline progress
            if (data.timestamp) {
                this.game.time.checkOfflineProgress(data.timestamp);
            }

            // Force UI refresh
            if (window.GameEngine && window.GameEngine.ui) window.GameEngine.ui.update();
            return true;
        } catch (e) {
            console.error("Load failed:", e);
            alert("ERRORE CARICAMENTO:\n" + e.message + "\n\nIl salvataggio potrebbe essere corrotto. Prova a ricaricare la pagina o usa 'Wipe Save' se necessario.");
            this.game.ui.showNotification("❌ Errore Caricamento!", "error");
            return false;
        }
    }

    wipe() {
        localStorage.removeItem(this.SAVE_KEY);
        location.reload();
    }

    exportSave() {
        const json = localStorage.getItem(this.SAVE_KEY);
        if (!json) {
            this.game.ui.showNotification("⚠️ Nessun salvataggio da esportare!", "warning");
            return;
        }
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dero_tycoon_save_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.game.ui.showNotification("💾 Salvataggio Scaricato!", "success");
    }

    importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                try {
                    JSON.parse(content); // Validate JSON
                    localStorage.setItem(this.SAVE_KEY, content);
                    this.game.ui.showNotification("✅ Salvataggio Importato! Ricarico...", "success");
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    alert("File non valido!");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}
