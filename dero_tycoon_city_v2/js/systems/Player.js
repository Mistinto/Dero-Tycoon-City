class Player {
    constructor(game) {
        this.game = game;
        this.money = 200; // Cash in hand
        this.bankBalance = 5000; // Bank Account
        this.derini = 10; // New Premium Currency (Start with 10)
        this.pet = null; // { name, type, hunger, happiness, xp }
        this.reputation = 0; // -100 to 1000

        // Needs (0-100)
        this.needs = {
            hunger: 100,
            thirst: 100,
            sleep: 100,
            hygiene: 100, // Added hygiene for realism
            hygiene: 100, // Added hygiene for realism
            social: 100   // Added social for mental health
        };

        // Statistics for Achievements
        this.stats = {
            totalEarned: 0,
            totalSpent: 0,
            shiftsCompleted: 0,
            investmentEarnings: 0,
            daysPlayed: 0
        };

        this.job = null; // Current job
        this.jobLevel = 1; // Career progress

        // Player Level
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 1000;

        // Inventory / Assets
        this.ownedBuildings = [];
        this.rentedBuildings = [];
        this.mainHomeId = null; // ID of the primary residence

        // Active Job Tracking
        this.currentJob = null; // { id, name, salary, endTime }

        // Financial Assets
        this.portfolio = {
            stocks: {},
            crypto: {}
        };
        this.loans = [];
        this.savings = { balance: 0, interest: 0.005 }; // 0.5% Daily Interest
        this.cds = []; // Certificate of Deposits { amount, matureDay, rate, name }
        this.transactions = []; // History log

        // LICENSES (Expiry Day)
        this.licenses = {
            buildingPermit: 0,
            commercialLicense: 0,
            taxesPaidDay: 0,
            insurance: 0,
            fireInspection: 0,
            fireSprinklers: 0,
            securityBasic: 0,
            securityTotal: 0,
            checkupBuff: 0
        };

        // EDUCATION
        this.education = {
            workerTraining: false,
            siteSafety: false,
            commerceCourse: false,
            digitalMarketing: false,
            businessManagement: false,
            socialMedia: false
        };

        // RESEARCH
        this.research = {
            mechanicalEng: false,
            nuclearPhys: false,
            advEcon: false,
            greenArch: false,
            robotics: false,
            renewables: false
        };
    }

    getNetWorth() {
        let worth = this.money + this.bankBalance;
        return worth;
    }

    getSpeedMultiplier() {
        let speed = 1.0; // Walking
        if (!this.vehicles || this.vehicles.length === 0) return speed;

        // Vehicle Data (Should match CarShopApp, but hardcoding for speed/simplicity or import)
        const vehicleSpeeds = {
            'bike': 1.5,
            'scooter': 2.0,
            'used_car': 2.5,
            'sport_car': 4.0,
            'supercar': 6.0
        };

        this.vehicles.forEach(v => {
            if (vehicleSpeeds[v] && vehicleSpeeds[v] > speed) {
                speed = vehicleSpeeds[v];
            }
        });
        return speed;
    }

    update(deltaTime) {
        // Decay logic (called every frame, but we should use TimeManager ticks for balance)
    }

    // Called by TimeManager every in-game minute
    onTimeTick(minutesPassed) {
        // JOB PROCESSING
        if (this.currentJob) {
            this.currentJob.remaining -= minutesPassed;
            if (this.currentJob.remaining <= 0) {
                // Job Completed
                this.earn(this.currentJob.salary);
                const xp = this.currentJob.xpReward || 10;
                this.gainXp(xp);

                if (!this.stats) this.stats = {};
                this.stats.shiftsCompleted = (this.stats.shiftsCompleted || 0) + 1;

                this.game.ui.showNotification(`✅ Hai finito di lavorare come ${this.currentJob.name}! (+€${this.currentJob.salary}, +${xp} XP)`, "success");

                // Fatigue
                const hours = this.currentJob.originalDuration / 60;
                this.needs.sleep = Math.max(0, this.needs.sleep - (hours * 5));
                this.needs.hunger = Math.max(0, this.needs.hunger - (hours * 8));

                this.currentJob = null;
                // Force UI update if JobApp is open
                if (window.GameEngine.ui.activeApp === 'jobs') window.GameEngine.ui.apps.jobs.render();
            }
        }

        // User requested: "Once a day" or much slower. 
        // Original was 0.05 * minutes. 24h = 1440m. 0.05 * 1440 = 72% decay per day.
        // Let's reduce it to ~30% per day to be less annoying.
        // 30 / 1440 = 0.02

        const decayRate = 0.02 * minutesPassed;

        this.needs.hunger = Math.max(0, this.needs.hunger - decayRate);
        this.needs.thirst = Math.max(0, this.needs.thirst - (decayRate * 1.5));
        this.needs.sleep = Math.max(0, this.needs.sleep - (decayRate * 0.5));

        // Critical conditions
        if (this.needs.hunger < 20) this.game.ui.showNotification("⚠️ Hai molta fame!", "warning");
        if (this.needs.sleep < 20) this.game.ui.showNotification("⚠️ Stai crollando dal sonno!", "warning");
    }

    canAfford(amount) {
        return this.money >= amount;
    }

    // Unified Pay Method (Default: Cash)
    pay(amount, source = 'cash') {
        if (source === 'cash') return this.payCash(amount);
        if (source === 'bank') return this.payBank(amount);
        if (source === 'derini') return this.payDerini(amount);
        return false;
    }

    payDerini(amount) {
        if (this.derini >= amount) {
            this.derini -= amount;
            this.game.ui.showNotification(`💎 Spesi ${amount} Derini. Rimasti: ${this.derini}`, "info");
            if (this.game.audio) this.game.audio.playSound('money_out'); // SFX
            return true;
        }
        return false;
    }

    gainDerini(amount) {
        this.derini += amount;
        this.game.ui.showNotification(`💎 Ricevuti ${amount} Derini!`, "success");
        if (this.game.audio) this.game.audio.playSound('success'); // SFX
    }

    payCash(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            if (!this.stats) this.stats = {};
            this.stats.totalSpent = (this.stats.totalSpent || 0) + amount;

            this.game.ui.showNotification(`💸 Pagato in Contanti: €${amount}`, "info");
            if (this.game.audio) this.game.audio.playSound('money_out'); // SFX
            return true;
        }
        if (this.game.audio) this.game.audio.playSound('error'); // Error SFX
        return false;
    }

    payBank(amount) {
        if (this.bankBalance >= amount) {
            this.bankBalance -= amount;
            if (!this.stats) this.stats = {};
            this.stats.totalSpent = (this.stats.totalSpent || 0) + amount;

            this.addTransaction('Spesa (Carta)', -amount);
            this.game.ui.showNotification(`💳 Pagato: €${amount} | Saldo: €${this.bankBalance.toFixed(0)}`, "info");
            if (this.game.audio) this.game.audio.playSound('money_out'); // SFX
            return true;
        }
        if (this.game.audio) this.game.audio.playSound('error'); // Error SFX
        return false;
    }

    earn(amount) {
        this.money += amount;
        if (!this.stats) this.stats = {}; // Safety check
        this.stats.totalEarned = (this.stats.totalEarned || 0) + amount;

        this.game.ui.showNotification(`💰 +€${amount}`, "success");
        if (this.game.audio) this.game.audio.playSound('money_in'); // SFX
        // Earning money grants small XP? Maybe not, better specific actions.
    }

    gainXp(amount) {
        this.xp += amount;
        // Check Level Up
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.xp -= this.xpToNextLevel;
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5); // Steep curve

        this.game.ui.showNotification(`🆙 LEVEL UP! Sei al livello ${this.level}!`, "success");
        if (this.game.audio) this.game.audio.playSound('level_up'); // SFX

        // Rewards
        this.reputation += 50;
        this.money += 500 * this.level; // Cash bonus

        this.game.ui.showNotification(`🎁 Bonus Livello: +€${500 * this.level}`, "success");

        // Particles
        if (this.game.ui && this.game.ui.particles) {
            this.game.ui.particles.spawnConfetti();
        }

        // Force HUD update
        if (this.game.ui) this.game.ui.update();
    }

    restoreNeed(need, amount) {
        if (this.needs[need] !== undefined) {
            this.needs[need] = Math.min(100, this.needs[need] + amount);
        }
    }

    deposit(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.bankBalance += amount;
            this.addTransaction('Deposito', amount);
            this.game.ui.showNotification(`💳 Depositato: €${amount}`, "success");
            return true;
        }
        return false;
    }

    withdraw(amount) {
        if (this.bankBalance >= amount) {
            this.bankBalance -= amount;
            this.money += amount;
            this.addTransaction('Prelievo', -amount);
            this.game.ui.showNotification(`💵 Prelevato: €${amount}`, "success");
            return true;
        }
        return false;
    }

    addTransaction(description, amount) {
        this.transactions.unshift({
            desc: description,
            amount: amount,
            date: `Giorno ${this.game.time.day} ${this.game.time.getTimeString()}`
        });
        if (this.transactions.length > 20) this.transactions.pop(); // Keep last 20
    }

    checkJobStatus() {
        if (this.currentJob) {
            // Check if time is past job endTime (in accumulated minutes)
            // Need absolute time tracking or relative? 
            // Game Time is linear (totalMinutes increases forever across days? No, resets daily).
            // Better to track remainingMinutes or check against totalMinutes if strict day.

            // Actually TimeManager.totalMinutes resets daily. 
            // So we need to handle "endTime > 1440" which wraps to next day?
            // Simplified: Store "startMinutes" and "duration".

            const time = this.game.time;

            // If new day, totalMinutes logic breaks if not handled.
            // Let's rely on TimeManager passing "minutesPassed" to decrement duration.
        }
    }
}
