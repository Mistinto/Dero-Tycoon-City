class GameEngine {
    constructor() {
        this.time = new TimeManager(this);
        this.audio = new AudioManager(); // Init Audio
        this.ui = new UIManager(this);
        this.player = new Player(this);
        this.buildings = new BuildingManager(this);
        this.rivals = new RivalAI(this);
        this.notary = new Notary(this);
        this.environment = new Environment(this);
        this.npcs = new NPCManager(this);
        this.events = new EventManager(this);
        this.politics = new PoliticsManager(this);
        this.economy = new EconomySystem(this);
        this.economy = new EconomySystem(this);
        this.saveSystem = new SaveSystem(this);
        this.achievements = new AchievementManager(this);
        this.tutorial = new TutorialManager(this); // Init Tutorial
        this.isRunning = false;
    }

    init() {
        console.log("Game Initialized.");
        this.achievements.init();
        this.ui.init();
        this.time.start();
        setTimeout(() => this.tutorial.start(), 1000); // Start tutorial after 1s
        this.gameLoop(0);
    }

    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        this.time.update(deltaTime);
        this.player.update(deltaTime);
        this.notary.update();
        this.achievements.check();
        // Rivals update is daily, handled by TimeManager event usually, or check day change
    }

    draw() {
        this.ui.update();
    }
}
