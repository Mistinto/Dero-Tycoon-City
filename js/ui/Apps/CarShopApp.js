class CarShopApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');

        this.cars = [
            { id: 'bike', name: 'Bicicletta', price: 200, speed: 1.5, reqLevel: 1, desc: 'Ecologica e lenta.', icon: '🚲' },
            { id: 'scooter', name: 'Scooter', price: 1500, speed: 2.0, reqLevel: 3, desc: 'Agile nel traffico.', icon: '🛵' },
            { id: 'used_car', name: 'Auto Usata', price: 5000, speed: 2.5, reqLevel: 5, desc: 'Un po\' arrugginita.', icon: '🚗' },
            { id: 'sport_car', name: 'Auto Sportiva', price: 25000, speed: 4.0, reqLevel: 8, desc: 'Veloce e rumorosa!', icon: '🏎️' },
            { id: 'supercar', name: 'Supercar', price: 100000, speed: 6.0, reqLevel: 10, desc: 'Status symbol definitivo.', icon: '🚀' }
        ];
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'car-shop-screen';
        screen.className = 'app-screen';

        let contentHtml = '<h3>🚗 Vincenzo\'s Motors</h3>';
        contentHtml += '<p style="color:#ccc; font-style:italic;">"Se ha le ruote, te lo vendo!"</p>';

        const p = this.game.player;

        this.cars.forEach(car => {
            const owned = p.vehicles && p.vehicles.includes(car.id);
            const levelOk = p.level >= car.reqLevel;

            let btnText = `Compra (€${car.price})`;
            let btnState = '';
            let action = `onclick="window.GameEngine.ui.apps.carShop.buy('${car.id}')"`;

            if (owned) {
                btnText = 'Già Posseduto';
                btnState = 'disabled style="background:grey; cursor:not-allowed;"';
                action = '';
            } else if (!levelOk) {
                btnText = `🔒 Livello ${car.reqLevel}`;
                btnState = 'disabled style="background:#555; color:#999; cursor:not-allowed;"';
                action = '';
            }

            contentHtml += `
                <div style="background: #333; color: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #555; display:flex; justify-content:space-between; align-items:center;">
                    <div style="text-align:left;">
                        <span style="font-size:2em; margin-right:10px;">${car.icon}</span>
                        <div style="display:inline-block; vertical-align:middle;">
                            <strong style="font-size:1.2em; color:#FF9800;">${car.name}</strong>
                            <div style="color:#aaa; font-size:0.9em;">${car.desc}</div>
                            <div style="color:#4CAF50; font-weight:bold;">Velocità: ${car.speed}x</div>
                        </div>
                    </div>
                    <button class="job-btn" ${btnState} ${action} style="width:auto; padding:10px 20px;">${btnText}</button>
                </div>
            `;
        });

        screen.innerHTML = `
            <div class="app-header" style="background-color: #FF9800;">
                <span class="app-title">🏎️ Concessionaria</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content" style="text-align:center;">
                ${contentHtml}
            </div>
        `;

        this.container.appendChild(screen);
    }

    buy(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;

        // Security Check
        if (this.game.player.level < car.reqLevel) {
            this.game.ui.showNotification(`🔒 Devi essere livello ${car.reqLevel}!`, "error");
            return;
        }

        if (this.game.player.pay(car.price, 'bank')) { // Prefer bank for big purchases
            if (!this.game.player.vehicles) this.game.player.vehicles = [];
            this.game.player.vehicles.push(carId);
            this.game.ui.showNotification(`🚗 Hai comprato: ${car.name}!`, "success");
            this.render(); // Refresh UI
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti (Banca o Contanti)!", "error");
        }
    }
}
