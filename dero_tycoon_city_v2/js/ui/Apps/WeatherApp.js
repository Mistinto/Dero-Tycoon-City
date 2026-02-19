class WeatherApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'weather-screen';
        screen.className = 'app-screen';

        const env = this.game.environment;

        screen.innerHTML = `
            <div class="app-header" style="background-color: #03A9F4;">
                <span class="app-title">🌦️ Meteo Dero</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="status-card">
                    <h3>Situazione Attuale</h3>
                    <p style="font-size:2em;">${this.getWeatherEmoji(env.currentWeather)} ${env.currentWeather}</p>
                    <p>Stagione: ${env.seasons[env.currentSeasonIndex]}</p>
                </div>

                <div class="services-list">
                    <h3>Previsioni</h3>
                    
                    <div class="service-item">
                        <span>📅 Previsione Domani</span>
                        <span>GRATIS</span>
                        <div style="font-weight:bold;">${this.getWeatherEmoji(this.predictWeather())} Soleggiato</div>
                    </div>
                    <small>Affidabilità: 80%</small>
                    <hr>

                    <div class="service-item">
                        <span>📡 Previsione 3 Giorni</span>
                        <span>€500</span>
                        <button class="job-btn" onclick="alert('Domani: ☀️ 90%\\nDopodomani: ☁️ 60%\\nTra 3gg: 🌧️ 40%')">Vedi</button>
                    </div>
                    <hr>

                    <h3>Controllo Climatico</h3>
                    <div class="service-item">
                        <span>☀️ Forza Sole (1gg)</span>
                        <span>€2.000</span>
                        <button class="job-btn" onclick="window.GameEngine.ui.apps.weather.forceSun()">Attiva</button>
                    </div>
                    <small>Tecnologia sperimentale. Max 1x/settimana.</small>
                </div>
            </div>
        `;

        const existing = document.getElementById('weather-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    getWeatherEmoji(type) {
        const map = { 'Sole': '☀️', 'Pioggia': '🌧️', 'Temporale': '⚡', 'Neve': '❄️', 'Nebbia': '🌫️', 'Nuvoloso': '☁️' };
        return map[type] || '❓';
    }

    predictWeather() {
        // Simplified prediction logic
        return 'Sole';
    }

    forceSun() {
        if (this.game.player.pay(2000)) {
            this.game.environment.forceWeather('Sole');
            this.render();
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti!", "error");
        }
    }
}
