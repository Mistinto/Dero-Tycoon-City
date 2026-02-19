class NewsApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
        this.currentNews = this.generateDailyNews();
    }

    generateDailyNews() {
        const day = this.game.time.day;
        const weather = this.game.environment ? this.game.environment.currentWeather : 'Soleggiato';
        const season = this.game.environment ? this.game.environment.seasons[this.game.environment.currentSeasonIndex] : 'Primavera';

        // 1. Determine Headline based on Game State priority
        let headline = "Giornata tranquilla a Dero City.";

        // Priority 1: Player Achievements / Status
        if (this.game.player.reputation > 800) headline = "Il nostro amato cittadino modello riceve le chiavi della città?";
        else if (this.game.player.money > 100000) headline = "Nuovo milionario in città: chi è il misterioso magnate?";
        else if (this.game.player.pet) headline = `Boom di adozioni: anche ${this.game.player.pet.nickname} trova casa!`;

        // Priority 2: Economy (Random but linked to trend if possible, or just random flux)
        // We don't track market trend history easily yet, so let's mock it based on day parity
        else if (day % 3 === 0) headline = "Borsa in rialzo: gli investitori festeggiano!";
        else if (day % 5 === 0) headline = "Crisi immobiliare? I prezzi delle case oscillano.";

        // Priority 3: Weather
        else if (weather === 'Pioggia' || weather === 'Temporale') headline = "Allerta Meteo: ombrelli aperti in tutta la città.";
        else if (weather === 'Neve') headline = "Nevicata eccezionale blocca il traffico!";
        else if (season === 'Estate') headline = "Odata di caldo: record di temperature registrato.";

        // Fallback to random if nothing special
        if (headline === "Giornata tranquilla a Dero City.") {
            headline = this.getHeadline(day);
        }

        // Market Trends linked to randomness for now (Economy logic needs deep hook to be accurate)
        const cryptoTrend = Math.random() > 0.5 ? '📈 In rialzo' : '📉 In ribasso';
        const stockTrend = Math.random() > 0.5 ? '🐂 Toro' : '🐻 Orso';

        return {
            headline: headline,
            weather: `${weather}, ${season}`,
            market: `Crypto: ${cryptoTrend} | Azioni: ${stockTrend}`,
            gossip: this.getGossip(),
            horoscope: this.getHoroscope()
        };
    }

    getHeadline(day) {
        const headlines = [
            "Dero City in espansione!",
            "Nuovi investitori in città",
            "Il sindaco promette meno tasse",
            "Scandalo al Dero Pub!",
            "Prezzi delle case alle stelle",
            "Traffico in aumento sulla Main St.",
            "Apertura del nuovo Centro Commerciale?",
            "Sciopero dei mezzi pubblici evitato",
            "Misterioso benefattore dona al parco",
            "Il meteo prevede instabilità"
        ];
        return headlines[day % headlines.length];
    }

    getGossip() {
        const gossips = [
            "Si dice che il banchiere nasconda oro sotto il letto.",
            "Visto un vip al ristorante ieri sera.",
            "I gatti del quartiere stanno tramando qualcosa.",
            "Il chiosco vende hotdog o... qualcos'altro?",
            "Chi è il misterioso proprietario della villa in collina?"
        ];
        return gossips[Math.floor(Math.random() * gossips.length)];
    }

    getHoroscope() {
        const signs = ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'];
        const sign = signs[Math.floor(Math.random() * signs.length)];
        const forecasts = ["Soldi in arrivo!", "Attento alle spese.", "Amore nell'aria.", "Lavora sodo oggi.", "Giornata fortunata!"];
        return `Oroscopo (${sign}): ${forecasts[Math.floor(Math.random() * forecasts.length)]}`;
    }

    onNewDay() {
        this.currentNews = this.generateDailyNews();
        // Auto-open news or notification?
        // this.game.ui.showNotification("📰 È arrivato il Dero News!", "info");
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'news-screen';
        screen.className = 'app-screen';
        screen.style.background = '#f4e7c3'; // Newspaper color
        screen.style.color = '#000000'; // Pure Black
        screen.style.fontFamily = 'Georgia, serif';

        screen.innerHTML = `
            <div class="app-header" style="background-color: #333; color: white; font-family: sans-serif;">
                <span class="app-title">📰 Dero News</span>
                <button onclick="goHome()" style="color:white;">✖️</button>
            </div>
            <div class="app-content" style="padding: 20px; color: #000000 !important;">
                <div style="text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px;">
                    <h1 style="font-size: 2.5em; margin: 0; text-transform: uppercase; color: #000000 !important;">Dero Chronicle</h1>
                    <p style="margin: 0; font-style: italic; color: #333 !important;">Giorno ${this.game.time.day} - L'unica verità di Dero City</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 1.8em; margin-bottom: 5px; color: #000000 !important;">${this.currentNews.headline}</h2>
                    <p style="color: #000000 !important;">
                        Le ultime notizie dalla nostra amata città riportano grandi novità. 
                        I cittadini sono in fermento per gli avvenimenti recenti. 
                        Restate sintonizzati per ulteriori aggiornamenti dai nostri inviati speciali.
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 15px 0;">
                    <div>
                        <h4 style="margin:0; color: #000000 !important;">🌤️ Meteo</h4>
                        <p style="margin:5px 0; color: #000000 !important;">${this.currentNews.weather}</p>
                    </div>
                    <div>
                        <h4 style="margin:0; color: #000000 !important;">📊 Finanza</h4>
                        <p style="margin:5px 0; color: #000000 !important;">${this.currentNews.market}</p>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="border-bottom: 1px solid #000; color: #000000 !important;">🤫 Gossip Cittadino</h3>
                    <p style="color: #000000 !important;"><em style="color: #000000 !important;">"${this.currentNews.gossip}"</em></p>
                </div>

                <div style="margin-top: 20px; background: #e0d0a0; padding: 10px; border: 1px dashed #555; color: #000000 !important;">
                    <strong style="color: #000000 !important;">🔮 L'Angolo delle Stelle</strong><br>
                    ${this.currentNews.horoscope}
                </div>
            </div>
        `;

        this.container.appendChild(screen);
    }
}
