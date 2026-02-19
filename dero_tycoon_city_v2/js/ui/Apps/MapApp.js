class MapApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
        this.renderer = null;
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'map-screen';
        screen.className = 'app-screen';

        // Map needs special styling to be full screen inside the app
        screen.innerHTML = `
            <div class="app-header">
                <span class="app-title">🗺️ Mappa Città</span>
                <button onclick="goHome()">✖️</button>
            </div>
            <div id="map-view" class="map-view">
                <div id="iso-grid" class="iso-grid"></div>
            </div>
        `;

        this.container.appendChild(screen);

        // Initialize Renderer targeting the new #iso-grid
        setTimeout(() => {
            const gridEl = screen.querySelector('#iso-grid');
            if (gridEl && this.game.buildings) {
                this.renderer = new MapRenderer(this.game);
                this.renderer.container = gridEl; // Override container
                // Render the actual game grid
                this.renderer.renderGrid(this.game.buildings.grid);
            } else {
                console.error("Map Grid Element or BuildingManager not found!");
            }
        }, 100); // Slight delay to ensure DOM insertion
    }

    update() {
        // Refresh map if needed
    }
}
