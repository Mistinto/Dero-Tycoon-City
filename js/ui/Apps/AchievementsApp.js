class AchievementsApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render() {
        const screen = document.createElement('div');
        screen.className = 'app-screen';
        screen.style.background = '#2c2c2c';
        screen.style.color = 'white';

        const list = this.game.achievements.achievements.map(ach => {
            const isUnlocked = this.game.achievements.unlocked.includes(ach.id);
            const opacity = isUnlocked ? '1' : '0.5';
            const icon = isUnlocked ? '🏆' : '🔒';
            const statusColor = isUnlocked ? '#FFD700' : '#888';

            return `
                <div style="background: #444; padding: 10px; border-radius: 8px; margin-bottom: 10px; opacity: ${opacity}; border-left: 4px solid ${statusColor};">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="margin:0; color:white;">${icon} ${ach.name}</h4>
                        <span style="color: #E040FB; font-weight:bold; display:flex; align-items:center;">+${ach.reward} <span class="derini-icon"></span></span>
                    </div>
                    <p style="font-size: 0.9em; color: #ccc; margin-top: 5px;">${ach.desc}</p>
                    ${isUnlocked ? '<small style="color:#4CAF50;">Sbloccato</small>' : ''}
                </div>
            `;
        }).join('');

        screen.innerHTML = `
            <div class="app-header" style="background-color: #FFD700; color: black;">
                <span class="app-title">🏆 Obiettivi</span>
                <button onclick="goHome()" style="background:transparent; color:black; border:1px solid black;">✖️</button>
            </div>
            <div class="app-content" style="padding: 15px;">
                <div style="text-align:center; margin-bottom:20px;">
                    <h2 style="color:white;">I Tuoi Traguardi</h2>
                    <p style="color:#aaa;">Completa le sfide per guadagnare Derini!</p>
                </div>
                ${list}
            </div>
        `;

        this.container.appendChild(screen);
    }
}
