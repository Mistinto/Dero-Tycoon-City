class TimeManager {
    constructor(game) {
        this.game = game;
        this.totalMinutes = 8 * 60; // Start at 08:00 (480 mins)
        this.day = 1;
        this.speed = 1; // 1x Speed
        this.isPaused = false;

        // 8 Real Hours = 24 Game Hours (Ratio 1:3)
        // 1 Real Second = 3 Game Seconds.
        // 20 Real Seconds = 1 Game Minute.
        // We tick every 1 real second, accumulating game seconds.
        this.tickRate = 1000;
        this.gameSecondsAccumulator = 0;
    }

    start() {
        this.isPaused = false;
        this.lastTimestamp = Date.now(); // Track real time for drift/offline
    }

    pause() {
        this.isPaused = true;
        this.lastTimestamp = null;
    }

    update(deltaTime) {
        if (this.isPaused) return;

        // Use deltaTime (ms) for smoother accumulation
        // Game Speed Multiplier (3x default)
        const gameMs = deltaTime * 3 * this.speed;

        this.gameSecondsAccumulator += gameMs;

        // If we have enough for 1 game minute (60000ms game time)
        // Use while to catch up multiple minutes if lagged
        while (this.gameSecondsAccumulator >= 60000) {
            try {
                this.forward(1);
                this.gameSecondsAccumulator -= 60000;
            } catch (e) {
                console.error("Critical Error in Time Forward:", e);
                this.gameSecondsAccumulator = 0; // Reset to 0 and BREAK to avoid negative numbers or infinite loops
                this.game.ui.showNotification(`⚠️ Errore Tempo: ${e.message}`, "error");
                break;
            }
        }
    }

    tick() {
        // Deprecated by update() logic, but kept for manual calls if needed
    }

    forceSleep() {
        console.log("It's midnight! Forcing sleep...");
        if (!this.isPaused) {
            this.game.ui.showNotification("⏸️ È mezzanotte! Il tempo si è fermato. Devi dormire.", "warning");
            this.isPaused = true;
        }
    }

    forward(minutes) {
        // Hard Stop check BEFORE adding
        if (this.totalMinutes >= 24 * 60) {
            this.forceSleep();
            return;
        }

        const oldDay = Math.floor(this.totalMinutes / (24 * 60));
        this.totalMinutes += minutes;

        // Cap at 24:00
        if (this.totalMinutes >= 24 * 60) {
            this.totalMinutes = 24 * 60;
            this.forceSleep();
        }

        // Notify UI (only significant jumps or every X mins?)
        // this.game.ui.updateTime(); // Assumed method, or triggering update loop

        // Updates needs
        // We pass 'minutes' but need to be careful with fractional updates if calling frequently
        if (minutes > 0) this.game.player.onTimeTick(minutes);
    }

    getTimeString() {
        const h = Math.floor(this.totalMinutes / 60);
        const m = this.totalMinutes % 60;
        // Ensure seconds don't look weird during frame transition
        const s = Math.floor(this.gameSecondsAccumulator / 1000) % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    sleep() {
        this.day++;
        this.totalMinutes = 8 * 60; // Reset to 08:00
        this.isPaused = false;

        // Income Collection
        this.game.buildings.collectDailyIncome();

        // Rival Actions
        this.game.rivals.processDailyDecisions();

        // Environment Update
        this.game.environment.onNewDay(this.day);

        // Economy Update (Dividends & Market Shift)
        this.game.economy.onNewDay(this.day);

        // News Update
        if (this.game.ui.apps.news) {
            this.game.ui.apps.news.onNewDay();
        }

        this.game.ui.showNotification(`☀️ Buongiorno! Inizia il Giorno ${this.day}`);

        // Restore Sleep
        this.game.player.restoreNeed('sleep', 100);

        // Reset Accumulator to avoid instant jumps
        this.gameSecondsAccumulator = 0;
    }

    // Called by SaveSystem or GameEngine on load
    checkOfflineProgress(lastSaveTime) {
        if (!lastSaveTime) return;

        const now = Date.now();
        const diffMs = now - lastSaveTime;

        // 8 Real Hours = 24 Game Hours => 3x multiplier
        const gameMinutesPassed = Math.floor((diffMs * 3) / 60000);

        if (gameMinutesPassed > 0) {
            console.log(`Offline: Passed ${gameMinutesPassed} game minutes.`);

            // Should we stop at midnight? YES.
            const minutesToMidnight = (24 * 60) - this.totalMinutes;
            const actualMinutes = Math.min(gameMinutesPassed, minutesToMidnight);

            if (actualMinutes > 0) {
                this.forward(actualMinutes);
                this.game.ui.showNotification(`⌛ Mentre eri via sono passati ${actualMinutes} min (in-game).`, "info");
            }

            if (gameMinutesPassed >= minutesToMidnight) {
                this.forceSleep();
            }
        }
    }
}
