class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9000;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());

        requestAnimationFrame(() => this.loop());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnMoney(x, y, amount) {
        const count = Math.min(10, Math.ceil(amount / 10)); // Max 10 particles
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x || Math.random() * this.canvas.width,
                y: y || this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 2,
                vy: -2 - Math.random() * 3,
                life: 1.0,
                text: '💵',
                type: 'money'
            });
        }
    }

    spawnConfetti() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 2.0,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                type: 'confetti'
            });
        }
    }

    spawnRain() {
        // Continuous rain spawner called by update if raining
        for (let i = 0; i < 2; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: 0,
                vy: 5 + Math.random() * 5,
                life: 1.0,
                color: '#64B5F6',
                type: 'rain'
            });
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Check weather
        if (this.game.environment && this.game.environment.weather === 'rain') {
            this.spawnRain();
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;

            if (p.type === 'money') {
                this.ctx.font = "20px Arial";
                this.ctx.globalAlpha = p.life;
                this.ctx.fillText(p.text, p.x, p.y);
            } else if (p.type === 'confetti') {
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.fillRect(p.x, p.y, 5, 5);
                p.vy += 0.1; // Gravity
            } else if (p.type === 'rain') {
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x, p.y + 10);
                this.ctx.stroke();
            }

            if (p.life <= 0) this.particles.splice(i, 1);
        }

        requestAnimationFrame(() => this.loop());
    }
}
