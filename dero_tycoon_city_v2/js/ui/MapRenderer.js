class MapRenderer {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('map-view');
        this.gridSize = 12;
        this.tileSize = 50; // CSS consistent
    }

    renderGrid(gridData) {
        console.log("MapRenderer: Rendering Grid...", gridData);
        if (!this.container) {
            console.error("MapRenderer: No container found!");
            this.container = document.getElementById('map-view');
            if (!this.container) return;
        }

        this.gridSize = gridData.length; // FIX: Use actual data size!

        this.container.innerHTML = ''; // Clear existing

        const gridEl = document.createElement('div');
        gridEl.className = 'iso-grid';

        // DYNAMIC STYLE
        gridEl.style.display = 'grid';
        gridEl.style.position = 'relative';
        // gridEl.style.width = (this.gridSize * this.tileSize) + 'px'; // Let CSS Grid handle it or set specifically
        // Better:
        gridEl.style.width = 'fit-content';
        gridEl.style.height = 'fit-content';

        gridEl.style.gridTemplateColumns = `repeat(${this.gridSize}, ${this.tileSize}px)`;
        gridEl.style.gridTemplateRows = `repeat(${this.gridSize}, ${this.tileSize}px)`;

        gridEl.style.zIndex = '100';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = gridData[y][x];

                const tile = document.createElement('div');
                tile.className = 'iso-tile';

                // DATA ATTRIBUTES FOR LOGIC
                tile.dataset.x = x;
                tile.dataset.y = y;
                tile.dataset.type = cell.type; // For CSS styling (roads)

                // OWNER CLASS FOR BORDER COLOR
                if (cell.owner === 'player') tile.classList.add('owner-player');
                else if (cell.owner === 'public') tile.classList.add('owner-public');
                else if (cell.owner) tile.classList.add('owner-rival');

                // TYPE CLASS (For CSS)
                if (cell.type) tile.classList.add(cell.type);

                // CONTENT
                if (cell.type !== 'empty') {
                    // Check if it's a building
                    if (BUILDINGS[cell.type]) {
                        const bData = BUILDINGS[cell.type];

                        // Building Body
                        const building = document.createElement('div');
                        building.className = 'building';
                        building.style.backgroundColor = bData.color; // Inner Color = Building Type

                        // TEXT CONTENT VISIBILITY FIX
                        building.style.zIndex = '10';
                        building.style.display = 'flex';
                        building.style.justifyContent = 'center';
                        building.style.alignItems = 'center';
                        building.style.color = '#fff';

                        // EMOJI MAPPING
                        // EMOJI MAPPING
                        const EMOJIS = {
                            // Public Services
                            'town_hall': '🏛️', 'bank': '🏦', 'hospital': '🏥', 'police': '🚓',
                            'fire': '🚒', 'school': '🏫', 'university': '🎓', 'job_center': '💼',
                            'stadium': '🏟️', 'weather': '🌦️', 'port': '🚢', 'airport': '✈️',
                            'ruins': '🗿', 'cathedral': '⛪', 'power_plant': '🏭', 'community': '🤝',

                            // Housing
                            'house': '🏠', 'apartment': '🏢', 'villa': '🏡', 'skyscraper': '🌆', 'skyscraper_lux': '🏙️',

                            // Commercial
                            'shop': '🏪', 'supermarket': '🛒', 'restaurant': '🍝', 'cinema_priv': '🍿',
                            'kiosk': '🌭', 'mall': '🛍️', 'hotel': '🏨', 'hostel': '🛏️', 'bb': '🛋️',
                            'outlet': '🧥', 'pub': '🍺', 'notary': '⚖️', 'car_dealer': '🚘',

                            // Industrial
                            'factory': '🏭', 'workshop': '🔨', 'warehouse': '📦', 'power_coal': '🏭',
                            'factory_high': '🔬', 'power_hydro': '💧', 'factory_auto': '🚗',
                            'power_nuke': '☢️', 'refinery': '🛢️',

                            // Special
                            'casino': '🎰', 'hospital_priv': '🏨', 'school_priv': '🎓',

                            // Terrain
                            'park': '🌳', 'tree': '🌲', 'road': ''
                        };

                        const emoji = EMOJIS[cell.type] || bData.name.substring(0, 1);

                        // Icon Style
                        building.innerText = emoji;
                        building.style.fontSize = '24px'; // Bigger Emojis
                        building.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';

                        if (['park', 'road'].includes(cell.type)) building.style.borderRadius = '0%'; // Reset radius logic for grid consistency ? 
                        if (cell.type === 'park') building.style.borderRadius = '50%'; // Parks still roundish

                        tile.appendChild(building);
                    }
                }

                // Check for Pending Notary Transaction
                if (this.game.notary && this.game.notary.isPending(x, y)) {
                    const pendingOverlay = document.createElement('div');
                    pendingOverlay.innerText = '⏳';
                    pendingOverlay.style.position = 'absolute';
                    pendingOverlay.style.zIndex = '20';
                    pendingOverlay.style.top = '50%';
                    pendingOverlay.style.left = '50%';
                    pendingOverlay.style.transform = 'translate(-50%, -50%)';
                    pendingOverlay.style.fontSize = '24px';
                    pendingOverlay.style.pointerEvents = 'none';
                    tile.appendChild(pendingOverlay);
                    tile.style.opacity = '0.7';
                }

                // Fix onclick scope
                tile.onclick = () => {
                    console.log(`Clicked tile: ${x},${y}`);
                    this.onTileClick(x, y, cell);
                };
                gridEl.appendChild(tile);
            }
        }

        this.container.appendChild(gridEl);
        console.log("MapRenderer: Grid appended to DOM");
    }

    onTileClick(x, y, cell) {
        // Delegate to BuildingManager
        if (this.game.buildings) {
            this.game.buildings.interact(x, y);
        } else {
            console.error("Game Buildings system missing!");
        }
    }
}
