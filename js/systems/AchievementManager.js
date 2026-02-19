class AchievementManager {
    constructor(game) {
        this.game = game;
        this.achievements = [
            // --- WEALTH ---
            { id: 'first_k', name: 'Primi Passi', desc: 'Guadagna i tuoi primi €1.000', reward: 10, check: (p) => p.stats.totalEarned >= 1000 },
            { id: 'saver_1', name: 'Formichina', desc: 'Risparmia €10.000 in banca', reward: 20, check: (p) => p.bankBalance >= 10000 },
            { id: 'rich', name: 'Benestante', desc: 'Possiedi €50.000 in banca', reward: 50, check: (p) => p.bankBalance >= 50000 },
            { id: 'middle_class', name: 'Ceto Medio', desc: 'Patrimonio netto di €100.000', reward: 50, check: (p) => (p.money + p.bankBalance) >= 100000 },
            { id: 'millionaire', name: 'Milionario', desc: 'Raggiungi €1.000.000 di patrimonio', reward: 100, check: (p) => (p.money + p.bankBalance) >= 1000000 },
            { id: 'billionaire', name: 'Miliardario', desc: 'Raggiungi €1 MILIARDO di patrimonio', reward: 500, check: (p) => (p.money + p.bankBalance) >= 1000000000 },
            { id: 'spender', name: 'Mani Bucate', desc: 'Spendi un totale di €100.000', reward: 20, check: (p) => p.stats.totalSpent >= 100000 },

            // --- WORK & CAREER ---
            { id: 'worker_1', name: 'Primo Giorno', desc: 'Completa il tuo primo turno di lavoro', reward: 5, check: (p) => p.stats.shiftsCompleted >= 1 },
            { id: 'worker_20', name: 'Stacanovista', desc: 'Completa 20 turni di lavoro', reward: 20, check: (p) => p.stats.shiftsCompleted >= 20 },
            { id: 'worker_100', name: 'Veterano del Lavoro', desc: 'Completa 100 turni di lavoro', reward: 50, check: (p) => p.stats.shiftsCompleted >= 100 },
            { id: 'promoted_2', name: 'Gavetta', desc: 'Raggiungi il livello lavorativo 2', reward: 10, check: (p) => p.jobLevel >= 2 },
            { id: 'promoted_5', name: 'Carriera', desc: 'Raggiungi il livello lavorativo 5', reward: 30, check: (p) => p.jobLevel >= 5 },
            { id: 'manager', name: 'Il Capo', desc: 'Raggiungi il livello lavorativo 8 (Manager)', reward: 50, check: (p) => p.jobLevel >= 8 },
            { id: 'ceo', name: 'CEO', desc: 'Raggiungi il livello lavorativo 10', reward: 100, check: (p) => p.jobLevel >= 10 },

            // --- BUILDINGS ---
            { id: 'builder_1', name: 'Proprietario', desc: 'Costruisci il tuo primo edificio', reward: 10, check: (p) => p.ownedBuildings.length >= 1 },
            { id: 'builder_5', name: 'Costruttore', desc: 'Costruisci 5 edifici', reward: 20, check: (p) => p.ownedBuildings.length >= 5 },
            { id: 'builder_10', name: 'Imprenditore Edile', desc: 'Costruisci 10 edifici', reward: 40, check: (p) => p.ownedBuildings.length >= 10 },
            { id: 'builder_20', name: 'Magnate Immobiliare', desc: 'Costruisci 20 edifici', reward: 80, check: (p) => p.ownedBuildings.length >= 20 },
            { id: 'landlord', name: 'Affittuario', desc: 'Metti in affitto un appartamento (Residenziale)', reward: 20, check: (p) => p.ownedBuildings.some(bId => bId.startsWith('res')) }, // Simplified check
            { id: 'industrialist', name: 'Industriale', desc: 'Possiedi una Fabbrica', reward: 30, check: (p) => p.ownedBuildings.some(bId => bId.startsWith('ind')) },

            // --- FINANCIALS ---
            { id: 'investor_small', name: 'Trader Principiante', desc: 'Guadagna €1.000 dagli investimenti', reward: 10, check: (p) => p.stats.investmentEarnings >= 1000 },
            { id: 'investor', name: 'Lupo di Wall Street', desc: 'Guadagna €10.000 dagli investimenti', reward: 50, check: (p) => p.stats.investmentEarnings >= 10000 },
            { id: 'crypto_bro', name: 'Crypto Bro', desc: 'Possiedi delle criptovalute', reward: 10, check: (p) => Object.values(p.portfolio.crypto).some(c => (typeof c === 'number' ? c : c.qty) > 0) },
            { id: 'stock_broker', name: 'Azionista', desc: 'Possiedi delle azioni', reward: 10, check: (p) => Object.values(p.portfolio.stocks).some(s => (typeof s === 'number' ? s : s.qty) > 0) },
            { id: 'loan_shark', name: 'Debito Estinto', desc: 'Ripaga completamente un prestito', reward: 20, check: (p) => p.loans.length === 0 && p.transactions.some(t => t.desc.includes('rimborsato')) }, // Tricky, simple check if 0 loans? No, that's default. Need history check or event. Leaving simpler constraint: Have 0 loans after having taken one? Complex.
            // Simplified: Just have > 0 Rep (which means paid taxes/loans usually) and 0 loans? 
            // Better: 'good_citizen' for 0 loans and > 500 Rep.

            // --- REPUTATION & SOCIAL ---
            { id: 'liked', name: 'Benvoluto', desc: 'Raggiungi 100 di Reputazione', reward: 10, check: (p) => p.reputation >= 100 },
            { id: 'respected', name: 'Rispettato', desc: 'Raggiungi 500 di Reputazione', reward: 30, check: (p) => p.reputation >= 500 },
            { id: 'tycoon', name: 'Celebrità', desc: 'Raggiungi 1.000 di Reputazione', reward: 100, check: (p) => p.reputation >= 1000 },
            { id: 'popular', name: 'Influencer', desc: 'Raggiungi 300 di Reputazione', reward: 20, check: (p) => p.reputation >= 300 },

            // --- EDUCATION & SKILLS ---
            { id: 'student', name: 'Studente', desc: 'Completa un corso di formazione', reward: 10, check: (p) => Object.values(p.education).filter(v => v).length >= 1 },
            { id: 'scholar', name: 'Erudito', desc: 'Completa 3 corsi di formazione', reward: 30, check: (p) => Object.values(p.education).filter(v => v).length >= 3 },
            { id: 'genius', name: 'Genio', desc: 'Completa tutti i corsi disponibili', reward: 100, check: (p) => Object.values(p.education).every(v => v) },

            // --- LIFE & MISC ---
            { id: 'survivor_7', name: 'Sopravvissuto', desc: 'Gioca per 7 giorni (in-game)', reward: 10, check: (p) => this.game.time.day >= 7 },
            { id: 'survivor_30', name: 'Veterano', desc: 'Gioca per 30 giorni (in-game)', reward: 50, check: (p) => this.game.time.day >= 30 },
            { id: 'car_owner', name: 'Motorizzato', desc: 'Acquista un veicolo', reward: 20, check: (p) => p.vehicles && p.vehicles.length > 0 },
            { id: 'pet_owner', name: 'Amico degli Animali', desc: 'Adotta un cucciolo', reward: 20, check: (p) => p.pet !== null },
            { id: 'derini_hoarder', name: 'Ricco di Gemme', desc: 'Possiedi 50 Derini', reward: 20, check: (p) => p.derini >= 50 }
        ];

        // Load unlocked from player or init empty
        this.unlocked = [];
    }

    init() {
        // Restore from player save if exists
        if (this.game.player.achievements) {
            this.unlocked = this.game.player.achievements;
        } else {
            this.game.player.achievements = []; // Init in player
        }
    }

    check() {
        const p = this.game.player;

        // Validating stats existence
        if (!p.stats) p.stats = {};
        if (!p.stats.totalEarned) p.stats.totalEarned = 0;
        if (!p.stats.totalSpent) p.stats.totalSpent = 0; // Added
        if (!p.stats.shiftsCompleted) p.stats.shiftsCompleted = 0;
        if (!p.stats.investmentEarnings) p.stats.investmentEarnings = 0;

        this.achievements.forEach(ach => {
            if (!this.unlocked.includes(ach.id)) {
                try {
                    if (ach.check(p)) {
                        this.unlock(ach);
                    }
                } catch (e) {
                    console.error(`Error checking achievement ${ach.id}:`, e);
                }
            }
        });
    }

    unlock(ach) {
        this.unlocked.push(ach.id);
        this.game.player.achievements.push(ach.id);
        this.game.player.gainDerini(ach.reward); // Premium Currency Reward
        this.game.ui.showNotification(`🏆 Achievement Sbloccato: ${ach.name} (+${ach.reward} Derini)`, "success"); // Text fallback since notification might not parse HTML well or needs CSS match

        // Play sound via AudioManager
        if (this.game.audio) this.game.audio.playSound('level_up'); // Use level up fanfare for achievements too
    }
}
