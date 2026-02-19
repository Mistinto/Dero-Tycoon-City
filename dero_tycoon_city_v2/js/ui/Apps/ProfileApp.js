class ProfileApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'profile-screen';
        screen.className = 'app-screen';

        const p = this.game.player;

        // Handle Legacy Saves (Default to Level 1 if missing)
        const level = p.level || 1;
        const xp = p.xp || 0;
        const nextLevelXp = p.xpToNextLevel || 1000;

        const progress = Math.min(100, Math.floor((xp / nextLevelXp) * 100));

        // Level Unlocks Data
        const unlocks = [
            { lvl: 1, text: "👷 Lavori Base (Lavapiatti)", icon: "🥣" },
            { lvl: 2, text: "🚲 Bici (Spostamenti veloci), Prestiti Piccoli", icon: "🚲" },
            { lvl: 3, text: "🏪 Licenza Commerciale, Fattorino", icon: "📦" },
            { lvl: 4, text: "🛵 Scooter, Lavoro Operaio", icon: "🧱" },
            { lvl: 5, text: "🏗️ Permesso Costruzione, Mutui Casa", icon: "🏠" },
            { lvl: 6, text: "💼 Lavoro Manager, Auto Usata", icon: "🚘" },
            { lvl: 7, text: "📈 Investimenti, Lavoro Banca", icon: "💳" },
            { lvl: 8, text: "🏭 Industria, Auto Sportiva", icon: "🏎️" },
            { lvl: 9, text: "🚁 Elicottero, Evasione Fiscale", icon: "🚁" },
            { lvl: 10, text: "🏛️ Candidatura Sindaco", icon: "🗳️" }
        ];

        let unlockHtml = '<div style="margin-top:20px; text-align:left;"><h3>🏆 Guida Livelli</h3>';

        unlocks.forEach(u => {
            const isUnlocked = level >= u.lvl;
            const bg = isUnlocked ? '#2E7D32' : '#333';
            const color = '#fff';
            const check = isUnlocked ? '✅' : '🔒';

            unlockHtml += `
                <div style="background: ${bg}; color: ${color}; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #555; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center;">
                        <span style="font-size:1.5em; margin-right:15px;">${u.icon}</span>
                        <div>
                            <strong style="font-size:1.1em;">Livello ${u.lvl}</strong>
                            <div style="margin-top:5px; color:#ddd;">${u.text}</div>
                        </div>
                    </div>
                    <span style="font-size:1.5em;">${check}</span>
                </div>
            `;
        });
        unlockHtml += '</div>';

        screen.innerHTML = `
            <div class="app-header" style="background-color: #9C27B0; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span class="app-title" style="font-weight: bold;">👤 Profilo Cittadino</span>
                <button onclick="goHome()" style="background: none; border: none; color: white; font-size: 1.2em; cursor: pointer;">✖️</button>
            </div>
            <div class="app-content" style="padding:15px; text-align:center; background: #222; min-height: 100%;">
                
                <div class="bank-balance-card" style="background: linear-gradient(45deg, #7B1FA2, #9C27B0); text-align:center; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="font-size:3em; margin-bottom:10px;">👤</div>
                    <h2>Livello ${level}</h2>
                    <p class="balance-label" style="color: #eee;">Reputazione: ${Math.floor(p.reputation || 0)}</p>
                    
                    <div style="margin:15px 0; text-align:left;">
                        <small>Igiene</small>
                        <div class="bar-bg" style="width:100%; height:8px; background:#444; border-radius:4px; margin-bottom:5px;">
                            <div style="width:${p.needs.hygiene}%; background:#00BCD4; height:100%; border-radius:4px;"></div>
                        </div>
                        <small>Sociale</small>
                        <div class="bar-bg" style="width:100%; height:8px; background:#444; border-radius:4px; margin-bottom:5px;">
                            <div style="width:${p.needs.social}%; background:#E91E63; height:100%; border-radius:4px;"></div>
                        </div>
                        <small>Divertimento</small>
                        <div class="bar-bg" style="width:100%; height:8px; background:#444; border-radius:4px;">
                            <div style="width:${p.needs.fun}%; background:#FFC107; height:100%; border-radius:4px;"></div>
                        </div>
                    </div>
                    
                    <div style="margin:15px 0; position:relative;">
                        <div style="background:rgba(0,0,0,0.3); height:20px; border-radius:10px; overflow:hidden;">
                            <div style="width:${progress}%; background:#E040FB; height:100%;"></div>
                        </div>
                        <p style="margin-top:5px; font-size:0.9em; color:#fff;">${Math.floor(xp)} / ${nextLevelXp} XP</p>
                    </div>

                    <button class="job-btn" style="background:#FFC107; color:black; font-weight:bold;" onclick="window.GameEngine.ui.openApp('achievements')">🏆 Vedi Obiettivi</button>
                </div>

                ${unlockHtml}

            </div>
        `;

        const existing = document.getElementById('profile-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }
}
