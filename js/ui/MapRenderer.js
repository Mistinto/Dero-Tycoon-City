class MapRenderer {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('map-view');
        this.gridSize = 12;
        this.tileSize = 50; // CSS consistent

        // Camera / Drag State
        this.isDragging = false;
        this.movedDuringDrag = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;

        this.initEvents();
    }

    initEvents() {
        if (!this.container) return;

        // Mouse Events
        this.container.addEventListener('mousedown', (e) => this.startDragging(e));
        window.addEventListener('mousemove', (e) => this.drag(e));
        window.addEventListener('mouseup', () => this.stopDragging());

        // Touch Events
        this.container.addEventListener('touchstart', (e) => this.startDragging(e.touches[0]), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.drag(e.touches[0]), { passive: false });
        this.container.addEventListener('touchend', () => this.stopDragging());
    }

    startDragging(e) {
        if (e.target.closest('button')) return;
        this.isDragging = true;
        this.movedDuringDrag = false;
        this.startX = e.pageX - this.container.offsetLeft;
        this.startY = e.pageY - this.container.offsetTop;
        this.scrollLeft = this.container.scrollLeft;
        this.scrollTop = this.container.scrollTop;
        this.container.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;

        const x = e.pageX - this.container.offsetLeft;
        const y = e.pageY - this.container.offsetTop;
        const walkX = (x - this.startX);
        const walkY = (y - this.startY);

        // Threshold for "moved"
        if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
            this.movedDuringDrag = true;
        }

        this.container.scrollLeft = this.scrollLeft - walkX;
        this.container.scrollTop = this.scrollTop - walkY;
    }

    stopDragging() {
        this.isDragging = false;
        if (this.container) this.container.style.cursor = 'grab';
    }

    renderGrid(gridData) {
        if (!this.container) {
            this.container = document.getElementById('map-view');
            if (!this.container) return;
            this.initEvents();
        }

        this.container.style.cursor = 'grab';
        this.container.style.overflow = 'auto';
        this.container.style.touchAction = 'none';

        this.gridSize = gridData.length;
        this.container.innerHTML = '';

        const gridEl = document.createElement('div');
        gridEl.className = 'iso-grid';
        gridEl.style.display = 'grid';
        gridEl.style.position = 'relative';
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
                tile.dataset.x = x;
                tile.dataset.y = y;
                tile.dataset.type = cell.type;

                if (cell.owner === 'player') tile.classList.add('owner-player');
                else if (cell.owner === 'public') tile.classList.add('owner-public');
                else if (cell.owner) tile.classList.add('owner-rival');

                if (cell.type) tile.classList.add(cell.type);

                if (cell.type !== 'empty') {
                    if (BUILDINGS[cell.type]) {
                        const bData = BUILDINGS[cell.type];
                        const building = document.createElement('div');
                        building.className = 'building';
                        building.style.backgroundColor = bData.color;
                        building.style.zIndex = '10';
                        building.style.display = 'flex';
                        building.style.justifyContent = 'center';
                        building.style.alignItems = 'center';
                        building.style.color = '#fff';

                        const EMOJIS = {
                            'town_hall': '🏛️', 'bank': '🏦', 'hospital': '🏥', 'police': '🚓',
                            'fire': '🚒', 'school': '🏫', 'university': '🎓', 'job_center': '💼',
                            'stadium': '🏟️', 'weather': '🌦️', 'port': '🚢', 'airport': '✈️',
                            'ruins': '🗿', 'cathedral': '⛪', 'power_plant': '🏭', 'community': '🤝',
                            'house': '🏠', 'apartment': '🏢', 'villa': '🏡', 'skyscraper': '🌆', 'skyscraper_lux': '🏙️',
                            'shop': '🏪', 'supermarket': '🛒', 'restaurant': '🍝', 'cinema_priv': '🍿',
                            'kiosk': '🌭', 'mall': '🛍️', 'hotel': '🏨', 'hostel': '🛏️', 'bb': '🛋️',
                            'outlet': '🧥', 'pub': '🍺', 'notary': '⚖️', 'car_dealer': '🚘',
                            'factory': '🏭', 'workshop': '🔨', 'warehouse': '📦', 'power_coal': '🏭',
                            'factory_high': '🔬', 'power_hydro': '💧', 'factory_auto': '🚗',
                            'power_nuke': '☢️', 'refinery': '🛢️',
                            'casino': '🎰', 'hospital_priv': '🏨', 'school_priv': '🎓',
                            'park': '🌳', 'tree': '🌲', 'road': ''
                        };

                        const emoji = (cell.type in EMOJIS) ? EMOJIS[cell.type] : bData.name.substring(0, 1);
                        building.innerText = emoji;
                        building.style.fontSize = '24px';
                        building.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
                        if (['park', 'road'].includes(cell.type)) building.style.borderRadius = '0%';
                        if (cell.type === 'park') building.style.borderRadius = '50%';
                        tile.appendChild(building);
                    }
                }

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

                tile.onclick = (e) => {
                    if (this.movedDuringDrag) return;
                    this.onTileClick(x, y, cell);
                };
                gridEl.appendChild(tile);
            }
        }

        this.container.appendChild(gridEl);

        setTimeout(() => {
            const centerX = (gridEl.offsetWidth - this.container.offsetWidth) / 2;
            const centerY = (gridEl.offsetHeight - this.container.offsetHeight) / 2;
            this.container.scrollLeft = centerX;
            this.container.scrollTop = centerY;
        }, 100);
    }

    onTileClick(x, y, cell) {
        if (this.game.buildings) {
            this.game.buildings.interact(x, y);
        }
    }
}
