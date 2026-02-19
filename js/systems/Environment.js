class Environment {
    constructor(game) {
        this.game = game;
        this.seasons = ['Primavera', 'Estate', 'Autunno', 'Inverno'];
        this.currentSeasonIndex = 0; // Start in Spring

        this.weatherTypes = ['Sole', 'Pioggia', 'Temporale', 'Neve', 'Nebbia'];
        this.currentWeather = 'Sole';

        this.dayCounter = 0;
        this.seasonDuration = 7; // Days per season
    }

    update(deltaTime) {
        // Weather changes could happen randomly during the day
    }

    // Called by TimeManager on new day
    onNewDay(day) {
        this.dayCounter++;

        // Change Season?
        if (this.dayCounter > this.seasonDuration) {
            this.dayCounter = 1;
            this.currentSeasonIndex = (this.currentSeasonIndex + 1) % 4;
            this.game.ui.showNotification(`🍂 Cambio Stagione: È arrivata l'${this.seasons[this.currentSeasonIndex]}!`, 'info');
            this.updateMapVisuals();
        }

        // Change Weather
        this.randomizeWeather();
    }

    randomizeWeather() {
        // Weights depend on season
        const season = this.seasons[this.currentSeasonIndex];
        let weights = [];

        // Simple weighted random
        if (season === 'Estate') weights = ['Sole', 'Sole', 'Sole', 'Temporale', 'Pioggia'];
        else if (season === 'Inverno') weights = ['Neve', 'Neve', 'Pioggia', 'Nebbia', 'Sole'];
        else weights = ['Sole', 'Pioggia', 'Nuvoloso', 'Sole', 'Pioggia']; // Spring/Autumn

        this.currentWeather = weights[Math.floor(Math.random() * weights.length)] || 'Sole';

        this.game.ui.showNotification(`meteo: Oggi c'è ${this.currentWeather}`, 'info');
        this.updateMapVisuals();
    }

    forceWeather(type) {
        if (this.weatherTypes.includes(type)) {
            this.currentWeather = type;
            this.game.ui.showNotification(`🌤️ Meteo Cambiato: ${type}`, 'success');

            // Particles
            if (type === 'Pioggia' || type === 'Temporale') {
                // The ParticleSystem loop checks weather property, so we just need to ensure it updates.
            }
            this.updateMapVisuals();
        }
    }

    updateMapVisuals() {
        // Update global CSS class for map container to handle background/overlay
        const mapEl = document.getElementById('map-view');
        if (mapEl) {
            mapEl.className = `map-view season-${this.currentSeasonIndex} weather-${this.currentWeather.toLowerCase()}`;
        }

        // Refresh tiles if needed (snow on ground etc)
        if (this.game.buildings) this.game.buildings.updateMap();
    }

    getIncomeModifier(buildingType) {
        let mod = 1.0;
        const s = this.seasons[this.currentSeasonIndex];
        const w = this.currentWeather;

        // Seasonal Modifiers
        if (buildingType === 'hotel' && s === 'Estate') mod *= 1.5;
        if (buildingType === 'kiosk' && s === 'Inverno') mod *= 0.5;
        if (buildingType === 'shop' && s === 'Natale') mod *= 2.0; // Special event TODO

        // Weather Modifiers
        if (w === 'Pioggia' || w === 'Temporale') {
            if (buildingType === 'cinema') mod *= 1.2; // People go inside
            if (buildingType === 'park') mod *= 0.2;
        }

        return mod;
    }
}
