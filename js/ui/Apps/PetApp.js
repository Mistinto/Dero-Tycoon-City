class PetApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'pet-screen';
        screen.className = 'app-screen';
        screen.style.background = '#81C784'; // Soft Green
        screen.style.color = '#1B5E20';

        const p = this.game.player;

        screen.innerHTML = `
            <div class="app-header" style="background-color: #388E3C; color: white;">
                <span class="app-title">🐾 I Miei Animali</span>
                <button onclick="goHome()" style="color:white;">✖️</button>
            </div>
            <div class="app-content" style="padding:15px; text-align:center;">
                ${this.getContent(p)}
            </div>
        `;

        this.container.appendChild(screen);
    }

    getContent(p) {
        if (!p.pet) {
            return this.getAdoptionPage();
        } else {
            return this.getPetPage(p.pet);
        }
    }

    getAdoptionPage() {
        const pets = [
            { id: 'dog', name: 'Cane Fedele', cost: 500, icon: '🐶', desc: 'Migliore amico.' },
            { id: 'cat', name: 'Gatto Pigro', cost: 300, icon: '🐱', desc: 'Giudica ogni tua mossa.' },
            { id: 'hamster', name: 'Criceto', cost: 100, icon: '🐹', desc: 'Corre corre corre.' },
            { id: 'parrot', name: 'Pappagallo', cost: 1000, icon: '🦜', desc: 'Ripete le parolacce.' }
        ];

        let html = `
            <h3>🏠 Centro Adozioni</h3>
            <p>Non hai ancora un animale domestico. Adottane uno!</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
        `;

        pets.forEach(pet => {
            const hasHome = !!this.game.player.mainHomeId;
            const btnState = hasHome ? '' : 'disabled style="background:#555; cursor:not-allowed;"';
            const btnText = hasHome ? `€${pet.cost}` : 'Serve Casa';
            const clickAction = hasHome ? `window.GameEngine.ui.apps.pets.adopt('${pet.id}', '${pet.name}', ${pet.cost}, '${pet.icon}')` : '';

            html += `
                <div class="job-card" style="border:1px solid #388E3C;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:2.5em;">${pet.icon}</span>
                        <div style="text-align:left; flex-grow:1; margin-left:15px;">
                            <strong style="color: #4CAF50;">${pet.name}</strong><br>
                            <small style="color: #ccc;">${pet.desc}</small>
                        </div>
                        <button class="job-btn" style="width:auto;" ${btnState} onclick="${clickAction}">
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    getPetPage(pet) {
        // Pet Logic handled here for simplicity or moved to Player/PetSystem later
        // Decay visuals
        const hungerColor = pet.hunger < 30 ? 'red' : '#4CAF50';
        const happyColor = pet.happiness < 30 ? 'red' : '#FFC107';

        return `
            <div style="background:#383838; padding:20px; border-radius:15px; border:2px solid #388E3C; margin-top:20px;">
                <div style="font-size:5em; margin-bottom:10px;">${pet.icon}</div>
                <h2>${pet.nickname || pet.name}</h2>
                <p style="color:#ccc;">Livello Affetto: ${Math.floor(pet.xp / 100)} ❤️</p>

                <div style="margin:20px 0; text-align:left;">
                    <small>Fame</small>
                    <div class="bar-bg" style="width:100%; height:10px; background:#ddd; border-radius:5px; margin-bottom:5px;">
                        <div style="width:${pet.hunger}%; background:${hungerColor}; height:100%; border-radius:5px;"></div>
                    </div>

                    <small>Felicità</small>
                    <div class="bar-bg" style="width:100%; height:10px; background:#ddd; border-radius:5px;">
                        <div style="width:${pet.happiness}%; background:${happyColor}; height:100%; border-radius:5px;"></div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <button class="action-btn" style="background:#FF9800;" onclick="window.GameEngine.ui.apps.pets.feed()">
                        🍖 Compra Cibo (€10)
                    </button>
                    <button class="action-btn" style="background:#2196F3;" onclick="window.GameEngine.ui.apps.pets.play()">
                        🎾 Gioca (+Felicità)
                    </button>
                    <button class="action-btn" style="background:#9C27B0; grid-column: span 2;" onclick="window.GameEngine.ui.apps.pets.rename()">
                        ✏️ Rinomina
                    </button>
                </div>
            </div>
        `;
    }

    adopt(id, name, cost, icon) {
        if (this.game.player.payCash(cost) || this.game.player.payBank(cost)) {
            const nickname = prompt("Dai un nome al tuo nuovo amico:", name);
            this.game.player.pet = {
                id: id,
                name: name,
                nickname: nickname || name,
                icon: icon,
                hunger: 80,
                happiness: 80,
                xp: 0
            };
            this.game.ui.showNotification(`🎉 Hai adottato ${this.game.player.pet.nickname}!`, "success");
            this.render(); // Refresh to Pets page

            // Re-render UI to remove old screen
            const existing = document.getElementById('pet-screen');
            if (existing) existing.remove();
            this.render();

        } else {
            this.game.ui.showNotification("💸 Non hai abbastanza soldi!", "error");
        }
    }

    feed() {
        const p = this.game.player;
        if (!p.pet) return;

        if (p.payCash(10)) {
            p.pet.hunger = Math.min(100, p.pet.hunger + 30);
            p.pet.xp += 5;
            p.pet.happiness += 5;
            this.game.ui.showNotification("🍖 Gnam gnam! (+Fame, +Exp)", "success");
            this.updateUI();
        } else {
            this.game.ui.showNotification("💸 Non hai soldi per il cibo!", "error");
        }
    }

    play() {
        const p = this.game.player;
        if (!p.pet) return;

        // Playing takes time
        this.game.time.forward(30);
        p.pet.happiness = Math.min(100, p.pet.happiness + 20);
        p.pet.hunger -= 10;
        p.pet.xp += 10;

        // Bonus to player fun
        p.restoreNeed('fun', 15);
        p.restoreNeed('social', 5);

        this.game.ui.showNotification("🎾 Avete giocato insieme! (+Felicità, +Divertimento)", "success");
        this.updateUI();
    }

    rename() {
        const p = this.game.player;
        if (!p.pet) return;
        const newName = prompt("Nuovo nome:", p.pet.nickname);
        if (newName) {
            p.pet.nickname = newName;
            this.updateUI();
        }
    }

    updateUI() {
        const existing = document.getElementById('pet-screen');
        if (existing) {
            existing.innerHTML = `
                <div class="app-header" style="background-color: #388E3C; color: white;">
                    <span class="app-title">🐾 I Miei Animali</span>
                    <button onclick="goHome()" style="color:white;">✖️</button>
                </div>
                <div class="app-content" style="padding:15px; text-align:center;">
                    ${this.getContent(this.game.player)}
                </div>
            `;
        }
    }
}
