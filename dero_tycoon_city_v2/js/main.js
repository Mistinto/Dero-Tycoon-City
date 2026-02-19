// Main Entry Point
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log("App Install Available");
    if (window.GameEngine && window.GameEngine.ui) window.GameEngine.ui.showNotification("📲 App Installabile! Vai in Opzioni.", "success");
});

window.addEventListener('DOMContentLoaded', () => {
    // DEBUG: On-screen logger (DISABLED)
    /*
    const dbg = document.createElement('div');
    ...
    */
    console.log("Dero Tycoon: City V2.0 - Starting...");
    console.log("Checking dependencies...");

    if (typeof GameEngine === 'undefined') {
        console.error("CRITICAL: GameEngine class not loaded!");
        return;
    }

    try {
        const game = new GameEngine();
        window.GameEngine = game;

        // Global helpers for HTML onclick
        window.openApp = (appName) => {
            console.log("Command: openApp " + appName);
            if (game.ui) game.ui.openApp(appName);
        };
        window.closeApp = () => {
            console.log("Command: closeApp");
            if (game.ui) game.ui.closeModal();
        };
        window.goHome = window.closeApp; // Alias for Apps using goHome()
        window.saveGame = () => {
            if (game.saveSystem) game.saveSystem.saveGame();
        };
        window.loadGame = () => {
            if (game.saveSystem) game.saveSystem.loadGame();
        };

        console.log("Initializing Game Engine...");
        game.init();
        console.log("Game Init Complete. Checking Map...");

        const mapEl = document.getElementById('map-view');
        if (!mapEl) console.error("#map-view NOT FOUND in DOM");
        else console.log("#map-view found. ClientHeight: " + mapEl.clientHeight);

    } catch (e) {
        console.error("FATAL ERROR: " + e.message + "\n" + e.stack);
        alert("ERRORE DI GIOCO:\n" + e.message + "\n\nPer favore riferisci questo errore.");
    }
});
