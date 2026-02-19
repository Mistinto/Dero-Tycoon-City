class RivalAI {
    constructor(game) {
        this.game = game;
        this.rivals = [
            { name: 'Corp. Omega', money: 50000, color: '#E91E63', aggressiveness: 0.8, friendship: 30 },
            { name: 'Dr. Zanna', money: 20000, color: '#9C27B0', aggressiveness: 0.5, friendship: 50 },
            { name: 'Immobiliare Re', money: 100000, color: '#FF5722', aggressiveness: 0.3, friendship: 40 },
            { name: 'Barone Von Dero', money: 250000, color: '#607D8B', aggressiveness: 0.2, friendship: 20 }
        ];
        this.actionsPerDay = 3;
    }

    changeFriendship(index, amount) {
        const rival = this.rivals[index];
        if (!rival) return;

        rival.friendship = Math.max(0, Math.min(100, rival.friendship + amount));

        let status = "Indifferente";
        if (rival.friendship >= 80) status = "Alleato";
        else if (rival.friendship >= 60) status = "Amichevole";
        else if (rival.friendship <= 20) status = "Ostile";
        else if (rival.friendship <= 40) status = "Diffidente";

        this.game.ui.showNotification(`Relazione con ${rival.name}: ${status} (${rival.friendship})`, amount > 0 ? 'success' : 'error');

        // Dynamic Aggressiveness based on friendship
        // High friendship = lower Aggressiveness (less likely to screw you over)
        // Base aggressiveness is kept, but modifed effectively logic-side if needed.
        // For now just visual/stat tracking.
    }

    // Called daily by GameEngine/TimeManager
    processDailyDecisions() {
        console.log("Rival AI: Processing Daily Decisions...");

        this.rivals.forEach(rival => {
            // Earn daily income from their buildings
            // Tech Note: We need to scan grid for rival buildings
            // For simplicity, we give them a base income + random
            rival.money += 200 + Math.floor(Math.random() * 500);

            // Chance to act
            if (Math.random() < rival.aggressiveness) {
                this.performAction(rival);
            }
        });
    }

    performAction(rival) {
        // Simple logic: Try to buy a random empty spot and build something random
        const size = this.game.buildings.gridSize; // Dynamic Size
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);

        // Grid safety check
        if (!this.game.buildings.grid[y]) return;
        const cell = this.game.buildings.grid[y][x];

        if (cell.type === 'empty') {
            // 1. Buy Land
            if (rival.money >= 200) {
                rival.money -= 200;

                // 2. Build Random Building
                const options = ['house', 'shop', 'kiosk', 'workshop', 'supermarket', 'factory'];
                const choice = options[Math.floor(Math.random() * options.length)];

                if (BUILDINGS[choice]) {
                    const cost = BUILDINGS[choice].cost;

                    if (rival.money >= cost) {
                        rival.money -= cost;

                        // Update Grid
                        this.game.buildings.grid[y][x] = {
                            type: choice,
                            owner: rival.name,
                            _aiColor: rival.color
                        };

                        this.game.ui.showNotification(`📢 ${rival.name} ha costruito: ${BUILDINGS[choice].name}`, 'warning');
                        this.game.buildings.updateMap();
                    }
                }
            }
        }
    }
}
