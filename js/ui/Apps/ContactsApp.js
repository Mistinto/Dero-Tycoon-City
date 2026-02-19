class ContactsApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
    }

    render(filter = 'all') {
        const screen = document.createElement('div');
        screen.id = 'contacts-screen';
        screen.className = 'app-screen';

        // NPC LIST (Fetch from NPCManager)
        const npcsData = this.game.npcs.getNPCs();
        const npcs = [];

        Object.keys(npcsData).forEach(key => {
            const data = npcsData[key];
            npcs.push({
                id: key,
                name: data.name,
                role: data.role,
                loc: data.loc,
                rep: this.game.npcs.getRelationship(key), // Fetch current relationship
                // color: '#fff' // Default
            });
        });

        // Add Rivals if in Pub
        if (filter === 'pub') {
            this.game.rivals.rivals.forEach((rival, index) => {
                npcs.unshift({
                    name: rival.name,
                    role: "Rivale Commerciale",
                    rep: rival.friendship, // Using rep field for friendship visualization
                    loc: "Tavolo VIP",
                    isRival: true,
                    rivalIndex: index,
                    color: rival.color
                });
            });
        }

        let listHtml = '';
        npcs.forEach(npc => {
            let actions = '';

            if (npc.isRival) {
                // RIVAL ACTIONS
                actions = `
                    <div style="display:flex; gap:5px; justify-content:flex-end; margin-top:5px;">
                        <button class="mini-btn" style="background:#8BC34A" 
                            onclick="if(window.GameEngine.player.payCash(50)) { window.GameEngine.rivals.changeFriendship(${npc.rivalIndex}, 10); window.GameEngine.ui.openApp('contacts', 'pub'); } else { alert('Serve €50!'); }">
                            🍺 Offri (€50)
                        </button>
                        <button class="mini-btn" style="background:#FFC107; color:black;" 
                            onclick="window.GameEngine.rivals.changeFriendship(${npc.rivalIndex}, Math.floor(Math.random()*10 - 5)); window.GameEngine.ui.openApp('contacts', 'pub');">
                            💬 Pettegolezzi
                        </button>
                        <button class="mini-btn" style="background:#F44336" 
                            onclick="window.GameEngine.rivals.changeFriendship(${npc.rivalIndex}, -15); window.GameEngine.ui.openApp('contacts', 'pub');">
                            🤬 Insulta
                        </button>
                    </div>
                `;
            } else {
                // NORMAL NPC ACTIONS
                actions = `
                    <button class="mini-btn" onclick="window.GameEngine.npcs.interact('${npc.id}')">Parla</button>
                    ${filter === 'pub' ? `<button class="mini-btn" style="background:#FF9800" onclick="if(window.GameEngine.player.payCash(10)) { window.GameEngine.npcs.changeRelationship('${npc.id}', 5); window.GameEngine.ui.openApp('contacts', 'pub'); } else { alert('Non hai abbastanza contanti!'); }">Offri Drink (€10)</button>` : ''}
                `;

                // Hide normal NPCs if in Pub mode if we want only rivals? 
                // User said "also the 4 rivals", implying addition. 
                // But list might be long. Let's keep specific Pub NPCs (Tony, Joe) + Rivals.
                // if (filter === 'pub' && npc.loc !== 'Pub' && !npc.isRival) return; // Show all NPCs in pub!
            }

            // Determine Status Color based on Rep/Friendship
            const val = npc.rep;
            let statusColor = '#4CAF50';
            if (val < 40) statusColor = '#F44336';
            else if (val < 70) statusColor = '#FFC107';

            listHtml += `
            <div class="service-item" style="border-left: 4px solid ${npc.color || '#ccc'};">
                <div style="flex:1;">
                    <span style="font-size:1.1em; font-weight:bold;">${npc.name}</span><br>
                    <small style="color:#aaa;">${npc.role} - 📍 ${npc.loc}</small>
                </div>
                <div style="text-align:right; min-width:150px;">
                    <small style="color:${statusColor}; font-weight:bold;">${npc.isRival ? 'Amicizia' : 'Rep'}: ${val}</small>
                    <div style="margin-top:5px;">
                        ${actions}
                    </div>
                </div>
            </div>`;
        });

        const title = filter === 'pub' ? '🍺 Pub: Incontri' : '📒 Contatti';

        screen.innerHTML = `
            <div class="app-header">
                <span class="app-title">${title}</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div class="app-content">
                <div class="services-list">
                    ${listHtml}
                </div>
            </div>
        `;

        this.container.appendChild(screen);
    }
}
