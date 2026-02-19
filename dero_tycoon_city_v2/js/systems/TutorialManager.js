class TutorialManager {
    constructor(game) {
        this.game = game;
        this.step = 0;
        this.isActive = false;

        this.steps = [
            {
                title: "👋 Benvenuto a Dero Tycoon!",
                text: "Il tuo obiettivo è diventare il Re della città. Inizia controllando i tuoi parametri vitali in alto a sinistra.",
                target: "#hud-top"
            },
            {
                title: "❤️ Sopravvivenza",
                text: "Fame e Sete scendono col tempo. Se arrivano a 0, svenimenti e ospedale! Mangia qualcosa al Chiosco o al Supermercato.",
                target: "#bar-hunger" // Approximation
            },
            {
                title: "📱 Il tuo Smartphone",
                text: "Tutto passa da qui. Clicca sulle app per gestire Lavoro, Banca, Acquisti e molto altro.",
                target: "#app-container"
            },
            {
                title: "💼 Trova un Lavoro",
                text: "Ti servono soldi. Apri l'app 'Lavoro' (Valigetta) e inizia la tua carriera.",
                target: null // Just info
            },
            {
                title: "🏦 Gestisci le Finanze",
                text: "Non girare con troppi contanti! Deposita in Banca per evitare furti e guadagnare interessi.",
                target: null
            },
            {
                title: "🗺️ La Città",
                text: "Esplora la mappa per trovare edifici in vendita o servizi. Clicca sui lotti per interagire.",
                target: "#map-view"
            },
            {
                title: "🚀 Buona Fortuna!",
                text: "Ora tocca a te. Diventa Sindaco, fonda una Corporation o vivi di rendita. Divertiti!",
                target: null
            }
        ];
    }

    start() {
        if (localStorage.getItem('dero_tutorial_seen')) return; // Already done

        this.isActive = true;
        this.step = 0;
        this.showStep();
    }

    showStep() {
        if (this.step >= this.steps.length) {
            this.end();
            return;
        }

        const data = this.steps[this.step];
        this.createModal(data);
    }

    createModal(data) {
        // Remove existing
        const old = document.getElementById('tutorial-modal');
        if (old) old.remove();

        const modal = document.createElement('div');
        modal.id = 'tutorial-modal';
        modal.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -20%);
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 2000;
            max-width: 400px;
            text-align: center;
            border: 2px solid #4CAF50;
            animation: popIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <h2 style="color: #2E7D32; margin-top: 0;">${data.title}</h2>
            <p style="font-size: 1.1em; line-height: 1.5;">${data.text}</p>
            <div style="margin-top: 20px;">
                <button onclick="window.GameEngine.tutorial.next()" style="font-size: 1.2em; padding: 10px 20px;">
                    ${this.step < this.steps.length - 1 ? 'Avanti ➡️' : 'Inizia a Giocare! 🚀'}
                </button>
            </div>
            <div style="margin-top: 10px; font-size: 0.8em; color: #777;">
                Passo ${this.step + 1} di ${this.steps.length}
            </div>
        `;

        document.body.appendChild(modal);

        // Highlight target if exists
        // (Simplified highlighting, just ensure it's visible)
    }

    next() {
        if (this.game.audio) this.game.audio.playSound('click');
        this.step++;
        this.showStep();
    }

    end() {
        this.isActive = false;
        const old = document.getElementById('tutorial-modal');
        if (old) old.remove();
        localStorage.setItem('dero_tutorial_seen', 'true');
        this.game.ui.showNotification("🎓 Tutorial Completato!", "success");
        if (this.game.audio) this.game.audio.playSound('success');
    }
}
