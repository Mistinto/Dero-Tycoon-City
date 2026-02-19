class JobApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');

        this.jobs = [
            { id: 'dishwasher', name: 'Lavapiatti', salary: 40, hours: 2, req: null, reqName: 'Nessuno' },
            { id: 'delivery', name: 'Fattorino', salary: 60, hours: 3, req: null, reqName: 'Nessuno' }, // Higher pay/hr
            { id: 'worker', name: 'Operaio', salary: 100, hours: 4, req: 'workerTraining', reqName: 'Formazione Operai' },
            { id: 'clerk', name: 'Commesso', salary: 90, hours: 4, req: 'commerceCourse', reqName: 'Corso Commercio' },
            { id: 'banker', name: 'Impiegato Banca', salary: 150, hours: 5, req: 'socialMedia', reqName: 'Social Media' },
            { id: 'manager', name: 'Manager', salary: 300, hours: 6, req: 'businessManagement', reqName: 'Gestione Imprese' }
        ];
    }

    render() {
        const screen = document.createElement('div');
        screen.id = 'jobs-screen';
        screen.className = 'app-screen';

        // Check active job
        if (this.game.player.currentJob) {
            const job = this.game.player.currentJob;
            const minutesLeft = Math.ceil(job.remaining);
            const progress = 100 - ((minutesLeft / job.originalDuration) * 100);

            screen.innerHTML = `
                <div class="app-header" style="background-color: #FF5722;">
                    <span class="app-title">💼 Lavoro in Corso</span>
                    <button onclick="goHome()">✖️</button>
                </div>
                <div class="app-content" style="text-align:center; padding-top:50px;">
                    <h3>Stai lavorando come ${job.name}</h3>
                    <p>Stipendio alla fine: €${job.salary}</p>
                    
                    <div style="margin:20px 0; background:#ddd; height:20px; border-radius:10px; overflow:hidden;">
                        <div style="width:${progress}%; background:#4CAF50; height:100%; transition: width 0.5s;"></div>
                    </div>
                    
                    <p>Tempo Rimanente: ${minutesLeft} minuti (in-game)</p>
                    <small>Puoi chiudere questa finestra, il lavoro continuerà.</small>
                </div>
            `;

            // Auto Update UI every second if open
            if (!this.updateInterval) {
                this.updateInterval = setInterval(() => {
                    if (document.getElementById('jobs-screen')) {
                        this.render(); // Re-render to update bar
                    } else {
                        clearInterval(this.updateInterval);
                        this.updateInterval = null;
                    }
                }, 1000); // 1 real second = 3 game seconds approx
            }

        } else {
            // STANDARD LIST
            let content = '';
            this.jobs.forEach(job => {
                const unlocked = !job.req || (this.game.player.education && this.game.player.education[job.req]);
                const btnState = unlocked ? '' : 'disabled style="background:grey; cursor:not-allowed;"';
                const btnText = unlocked ? 'Inizia Turno' : 'Bloccato';

                content += `
                    <div class="job-card">
                        <h3>${job.name}</h3>
                        <p>Stipendio: €${job.salary} (${job.hours}h)</p>
                        <button class="job-btn" ${btnState} onclick="window.GameEngine.ui.apps.jobs.startShift('${job.id}')">${btnText}</button>
                    </div>
                `;
            });

            screen.innerHTML = `
                <div class="app-header" style="background-color: #FF5722;">
                    <span class="app-title">💼 Centro per l'Impiego</span>
                    <button onclick="goHome()">✖️</button>
                </div>
                <div class="app-content">
                    ${content}
                </div>
            `;
        }

        const existing = document.getElementById('jobs-screen');
        if (existing) existing.remove();

        this.container.appendChild(screen);
    }

    startShift(jobId) {
        if (this.game.player.currentJob) {
            this.game.ui.showNotification("🚫 Hai già un lavoro in corso!", "error");
            return;
        }

        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;

        // Check req again
        if (job.req && !this.game.player.education[job.req]) {
            this.game.ui.showNotification("🚫 Non hai i requisiti!", "error");
            return;
        }

        // Check energy
        if (this.game.player.needs.sleep < 20) {
            this.game.ui.showNotification("🚫 Troppo stanco per lavorare!", "error");
            return;
        }

        // Check Time Limit
        const currentMinutes = this.game.time.totalMinutes;
        const shiftMinutes = job.hours * 60;

        if (currentMinutes + shiftMinutes >= 24 * 60) {
            this.game.ui.showNotification("🚫 È troppo tardi per iniziare questo turno!", "warning");
            return;
        }

        // START JOB (Background)
        this.game.ui.showNotification(`💼 Iniziato turno come ${job.name}.`, "info");

        // XP Calculation: 10 XP per hour
        const xpReward = job.hours * 10;

        this.game.player.currentJob = {
            id: job.id,
            name: job.name,
            salary: job.salary,
            xpReward: xpReward,
            originalDuration: shiftMinutes,
            remaining: shiftMinutes
        };

        this.render(); // Refresh UI to show progress
    }
}
