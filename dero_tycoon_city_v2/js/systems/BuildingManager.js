class BuildingManager {
    constructor(game) {
        this.game = game;
        this.gridSize = 25; // Expanded to 25x25
        this.grid = this.generateCityLayout();
    }

    generateCityLayout() {
        const size = this.gridSize;
        // Fix: Create distinct objects for each cell
        const grid = Array(size).fill(null).map(() =>
            Array(size).fill(null).map(() => ({ type: 'empty', owner: null }))
        );

        // 1. GRID ROADS (Blocks of 5x5)
        // Roads at indices: 0, 6, 12, 18, 24
        const BLOCK_SIZE = 5;
        const STRIDE = BLOCK_SIZE + 1;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (x % STRIDE === 0 || y % STRIDE === 0) {
                    grid[y][x] = { type: 'road', owner: 'public', locked: true };
                }
            }
        }

        // Helper to place building in a block
        // blockX, blockY are 0..3
        const placeInBlock = (blockX, blockY, type, offsetX = 2, offsetY = 2, owner = 'public') => {
            const baseX = 1 + blockX * STRIDE;
            const baseY = 1 + blockY * STRIDE;
            // Center of block is +2, +2
            const tx = baseX + offsetX;
            const ty = baseY + offsetY;

            if (tx < size && ty < size) {
                grid[ty][tx] = { type: type, owner: owner, locked: true };
            }
        };

        // 2. UNIQUE BUILDINGS PLACEMENT (4x4 Blocks available)

        // Block [1, 1] (Near Center-Left): University Area
        placeInBlock(1, 1, 'university', 1, 1);
        placeInBlock(1, 1, 'school', 3, 3);

        // Block [2, 1] (Near Center-Right): Services
        placeInBlock(2, 1, 'hospital', 1, 1);
        placeInBlock(2, 1, 'police', 3, 1);
        placeInBlock(2, 1, 'fire', 2, 3);

        // Block [1, 2] (Center-Low-Left): Leisure
        placeInBlock(1, 2, 'stadium', 2, 2);
        placeInBlock(1, 2, 'weather', 0, 0);
        placeInBlock(1, 2, 'pub', 1, 3); // Pub placement

        // RIVAL BUILDINGS (Needs)
        // Rival 1: Restaurant
        placeInBlock(1, 2, 'restaurant', 4, 1, 'rival1');

        // Rival 2: Cinema
        placeInBlock(1, 2, 'cinema_priv', 0, 4, 'rival2');

        // Block [2, 2] (Center-Low-Right): Admin / Finance
        placeInBlock(2, 2, 'town_hall', 1, 1);
        placeInBlock(2, 2, 'bank', 3, 1);
        placeInBlock(2, 2, 'job_center', 2, 3);
        placeInBlock(2, 2, 'cathedral', 3, 3);
        placeInBlock(2, 2, 'notary', 1, 3); // Notary Placement

        // RIVAL SHOPS
        // Rival 1: Supermarket (Near Hospital)
        placeInBlock(2, 1, 'supermarket', 0, 4, 'rival1');

        // Rival 2: Hotel (West Side)
        placeInBlock(0, 1, 'hotel', 2, 2, 'rival2');

        // NEW: Car Dealer (Near Industrial/Sport)
        placeInBlock(1, 2, 'car_dealer', 1, 1); // Replaces something? No, adds to empty.

        // Edges
        // NW Corner [0,0] -> Power Plant & Hostel
        placeInBlock(0, 0, 'power_plant', 2, 2);
        placeInBlock(0, 0, 'hostel', 4, 1, 'rival2'); // Rival Hostel

        // NE Corner [3,0] -> Port
        placeInBlock(3, 0, 'port', 2, 2);

        // SW Corner [0,3] -> Ruins
        placeInBlock(0, 3, 'ruins', 2, 2);

        // SE Corner [3,3] -> Airport & B&B
        placeInBlock(3, 3, 'airport', 2, 2);
        placeInBlock(3, 3, 'bb', 1, 1, 'rival1'); // Rival B&B

        // Central Park in the strict center intersection
        grid[12][12] = { type: 'park', owner: 'public', locked: true };

        // Make Park interactive for Pets
        // This is handled in interact(), no need to change grid data unless type changes

        return grid;

        return grid;
    }

    // Called when player clicks a tile
    interact(x, y) {
        const cell = this.grid[y][x];
        const type = cell.type;

        // INTERACTION: UNIQUE BUILDINGS -> OPEN APPS
        if (type === 'bank') { this.game.ui.openApp('bank'); return; }
        if (type === 'town_hall') { this.game.ui.openApp('politics'); return; }
        if (type === 'job_center') { this.game.ui.openApp('jobs'); return; }
        if (type === 'university') { this.game.ui.openApp('university'); return; }
        if (type === 'school') { this.game.ui.openApp('school'); return; }
        if (type === 'stadium') { this.game.ui.openApp('stadium'); return; }
        if (type === 'weather') { this.game.ui.openApp('weather'); return; }
        if (type === 'hospital') { this.game.ui.openApp('hospital'); return; }
        if (type === 'police') { this.game.ui.openApp('police'); return; }
        if (type === 'fire') { this.game.ui.openApp('fire'); return; }
        if (type === 'community') { this.game.ui.openApp('community'); return; }
        if (type === 'notary') { this.game.ui.openApp('notary'); return; }
        if (type === 'car_dealer') { this.game.ui.openApp('carShop'); return; }

        // Decorative / Lore Interactions -> NPC UPDATES
        if (type === 'cathedral') {
            if (confirm("⛪ Duomo di Dero.\nVuoi parlare con Don Franco?")) {
                this.game.npcs.interact('priest');
            }
            return;
        }
        if (type === 'ruins') {
            this.game.ui.showNotification("🗿 Rovine Antiche: Un luogo misterioso...", "info");
            return;
        }
        if (type === 'power_plant') {
            if (confirm("🏭 Centrale Elettrica.\nVuoi parlare con l'Ing. Volt?")) {
                this.game.npcs.interact('energy');
            }
            return;
        }
        if (type === 'port') {
            if (confirm("🚢 Porto Mercantile.\nVuoi parlare con il Capitan Nemo?")) {
                this.game.npcs.interact('port');
            }
            return;
        }

        if (type === 'park') {
            const hasPet = this.game.player.pet;
            const msg = hasPet
                ? "🌳 Parco Centrale.\nVuoi portare a spasso il tuo animale?"
                : "🌳 Parco Centrale.\nVuoi cercare animali da adottare (apre Pet App)?";

            if (confirm(msg)) {
                if (hasPet) {
                    this.game.ui.apps.pets.play(); // Reuse play logic
                } else {
                    this.game.ui.openApp('pets');
                }
            }
            return;
        }
        if (type === 'airport') {
            // Airport has no specific NPC in the list yet, maybe add Pilot later or use existing logic
            if (confirm("✈️ Aeroporto Internazionale. Vuoi cercare lavoro qui?")) {
                this.game.ui.openApp('jobs');
            }
            return;
        }

        if (type === 'pub') {
            this.game.ui.openApp('contacts', 'pub');
            return;
        }

        // Shopping / Needs
        if (['supermarket', 'shop', 'kiosk', 'mall', 'restaurant', 'cinema_priv', 'hotel', 'hostel', 'bb', 'casino', 'hospital_priv', 'school_priv'].includes(type)) {
            const bName = BUILDINGS[type] ? BUILDINGS[type].name : 'Negozio';
            this.game.ui.openApp('needs', bName);
            return;
        }

        // Jobs (Industrial/Office)
        if (['factory', 'lab', 'office_small', 'office_large', 'factory_high', 'factory_auto', 'refinery'].includes(type)) {
            // Instead of auto-opening jobs, ask user
            if (confirm(`Questo è un luogo di lavoro (${BUILDINGS[type].name}). Vuoi aprire il Centro Impiego?`)) {
                this.game.ui.openApp('jobs');
            }
            return;
        }

        // Social / Contacts (Residential)
        if (['house', 'apartment', 'villa', 'skyscraper', 'skyscraper_lux'].includes(type)) {
            if (confirm("Zona Residenziale. Vuoi cercare contatti qui?")) {
                this.game.ui.openApp('contacts');
            }
            return;
        }

        if (cell.locked) {
            this.game.ui.showNotification(`🚫 ${BUILDINGS[type]?.name || 'Edificio Pubblico'}`, "error");
            return;
        }

        // OWNED LAND (Empty or Building) -> Interaction / Construction
        if (cell.owner === 'player') {
            if (type === 'empty') {
                this.openBuildMenu(x, y);
            } else {
                // MANAGING OWNED BUILDING
                const bData = BUILDINGS[type];
                if (['house', 'apartment', 'villa', 'skyscraper', 'skyscraper_lux'].includes(type)) {
                    if (confirm(`🏠 ${bData.name}\nVuoi impostare questa come Abitazione Principale?`)) {
                        this.game.player.mainHomeId = type; // Store ID (or maybe coords if multiple of same type? For now ID is simple but flawed if multiple houses. Let's start with ID)
                        // Actually, simplified logic uses ID.
                        this.game.ui.showNotification("🏠 Abitazione Principale impostata!", "success");
                    }
                } else {
                    this.game.ui.showNotification(`🏭 Tua Proprietà: ${bData?.name} (Rendita attiva)`);
                }
            }
            return;
        }

        // UNOWNED EMPTY -> Buy Land
        if (type === 'empty') {
            this.buyLand(x, y);
            return;
        }

        // RIVAL / OTHER
        this.game.ui.showNotification(`Proprietà di: ${cell.owner || 'Nessuno'}`);
    }

    // Calculate Land Value & Details
    getLandDetails(x, y) {
        const centerX = 12;
        const centerY = 12;
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = Math.sqrt(12 * 12 + 12 * 12); // ~17

        // Factors
        const centerFactor = 1 - (dist / maxDist); // 1.0 (Center) -> 0.0 (Edge)

        // Price Calculation
        const price = Math.floor(200 + (800 * centerFactor)); // €200 - €1000

        // Metrics
        const desirability = Math.floor(centerFactor * 100); // 0 - 100

        let zoneType = 'Periferia';
        let traffic = 'Basso';
        let suggested = 'Industriale';

        if (desirability > 75) {
            zoneType = 'Centro Città';
            traffic = 'Altissimo';
            suggested = 'Commerciale (Lusso)';
        } else if (desirability > 40) {
            zoneType = 'Zona Residenziale';
            traffic = 'Medio';
            suggested = 'Negozi / Abitazioni';
        }

        return { price, desirability, zoneType, traffic, suggested };
    }

    // Deprecated but kept for compatibility logic (returns just price)
    getLandValue(x, y) {
        return this.getLandDetails(x, y).price;
    }

    buyLand(x, y) {
        const details = this.getLandDetails(x, y);
        this.game.ui.showLandPurchaseMenu(x, y, details);
    }

    openBuildMenu(x, y) {
        const options = [];
        for (const [id, data] of Object.entries(BUILDINGS)) {
            // Filter purchasable types
            if (['res', 'com', 'ind', 'spec', 'nature'].includes(data.type)) {
                // Exclude specific unique ones if needed, but type check is good start.
                // 'park' is type 'nature' and cost 1000. 'tree' is 50.
                if (id === 'park') continue; // Unique park is central, maybe allow small parks? 
                // Let's allow all non-unique.
                // Unique public buildings are type 'pub'.
                options.push({ id, ...data });
            }
        }
        this.game.ui.showBuildMenu(x, y, options);
    }

    finalizeLandPurchase(x, y) {
        if (this.grid[y][x]) {
            this.grid[y][x].owner = 'player';

            // Add to Player's list if not exists
            const alreadyOwned = this.game.player.ownedBuildings.some(b => b.x === x && b.y === y);
            if (!alreadyOwned) {
                this.game.player.ownedBuildings.push({ x, y, type: this.grid[y][x].type });
            }

            this.updateMap();
            // Force save to prevent data loss if crash happens right after
            this.game.saveSystem.saveGame();
        }
    }

    // Called by SaveSystem after loading player data
    loadFromSave(ownedList) {
        if (!ownedList) return;
        ownedList.forEach(b => {
            if (this.grid[b.y] && this.grid[b.y][b.x]) {
                this.grid[b.y][b.x].owner = 'player';
                this.grid[b.y][b.x].type = b.type; // Restore building type (e.g. if constructed)
                this.grid[b.y][b.x].locked = false; // Ensure unlocked
            }
        });
        this.updateMap();
    }

    confirmLandPurchase(x, y, price) {
        if (this.game.notary.isPending(x, y)) {
            this.game.ui.showNotification("⏳ Pratica già in corso per questo terreno!", "warning");
            return;
        }

        if (this.game.player.payBank(price)) {
            // Start Notary Process
            this.game.notary.startTransaction(x, y, 'land');
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti nel Conto Bancario!", "error");
        }
    }

    construct(x, y, buildingId) {
        const bData = BUILDINGS[buildingId];
        let cost = bData.cost;

        // CHECK BUILDING PERMIT
        const p = this.game.player;
        const isMayor = this.game.politics && this.game.politics.isMayor;

        if (isMayor) {
            cost = Math.floor(cost * 0.5); // 50% Construction Discount for Mayor
            // Permit is auto-granted/ignored
        } else if (p.licenses.buildingPermit >= this.game.time.day) {
            cost = Math.floor(cost * 0.8); // 20% Discount
        }

        // CHECK EDUCATION: Worker Training
        if (p.education && p.education.workerTraining) {
            cost = Math.floor(cost * 0.9); // Further 10% Discount
        }

        if (this.game.player.payBank(cost)) {
            this.grid[y][x] = { type: buildingId, owner: 'player' };

            // UPDATE PLAYER LIST
            const pIdx = this.game.player.ownedBuildings.findIndex(b => b.x === x && b.y === y);
            if (pIdx >= 0) {
                this.game.player.ownedBuildings[pIdx].type = buildingId;
            } else {
                this.game.player.ownedBuildings.push({ x, y, type: buildingId });
            }

            const discountMsg = (cost < bData.cost) ? " (Scontato!)" : "";

            // XP Reward
            const xpGain = 50;
            this.game.player.gainXp(xpGain);

            this.game.ui.showNotification(`🏗️ Costruzione iniziata: ${bData.name}${discountMsg} (+${xpGain} XP)`);
            this.updateMap();
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti nel Conto Bancario!", "error");
        }
    }

    updateMap() {
        if (this.game.ui.mapRenderer) {
            this.game.ui.mapRenderer.renderGrid(this.grid);
        }
    }

    collectDailyIncome() {
        let totalIncome = 0;
        const size = this.gridSize;
        const p = this.game.player;
        const hasCommercialLicense = p.licenses.commercialLicense >= this.game.time.day;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = this.grid[y][x];
                if (cell.owner === 'player' && cell.type !== 'empty') {
                    const bData = BUILDINGS[cell.type];
                    if (bData && bData.income) {
                        let income = bData.income;
                        const mod = this.game.environment.getIncomeModifier(cell.type);
                        income = income * mod;

                        // ZONE BONUS: Closer to center = More customers/rent
                        const dist = Math.sqrt(Math.pow(x - 12, 2) + Math.pow(y - 12, 2));
                        const zoneMod = Math.max(1, 2.0 - (dist / 12)); // Center 2x, Edge 1x (approx)
                        income = income * zoneMod;

                        // COMMERCIAL LICENSE BONUS
                        if (['com', 'spec'].includes(bData.type) && hasCommercialLicense) {
                            income = income * 1.5; // +50%
                        }

                        // EDUCATION BONUSES
                        if (['com'].includes(bData.type)) {
                            if (p.education.digitalMarketing) income *= 1.25; // +25%
                            if (p.education.socialMedia && ['shop', 'outlet', 'mall', 'cinema_priv'].includes(cell.type)) {
                                income *= 1.30; // +30% Modern Shops
                            }
                        }

                        totalIncome += income;
                    }
                }
            }
        }

        if (totalIncome > 0) {
            // CORPORATION BONUS
            if (this.game.politics && this.game.politics.hasCorporation) {
                totalIncome *= 1.2; // +20%
            }

            const bonusMsg = hasCommercialLicense ? " (Bonus Licenza Attivo!)" : "";
            this.game.player.earn(totalIncome);
            this.game.ui.showNotification(`💰 Rendita Immobiliare: +€${totalIncome.toFixed(0)}${bonusMsg}`, 'success');
        }
    }
}
