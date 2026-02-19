class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.3; // Default low volume
        this.enabled = true;
    }

    playTone(freq, type, duration, volume = 1.0) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(this.masterVolume * volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // SFX PRESETS
    playSound(name) {
        if (this.ctx.state === 'suspended') this.ctx.resume(); // Ensure context is running

        switch (name) {
            case 'click':
                this.playTone(800, 'sine', 0.05, 0.5);
                break;
            case 'money_in':
                // Cash register sequence
                this.playTone(1200, 'square', 0.1, 0.4);
                setTimeout(() => this.playTone(1600, 'square', 0.2, 0.4), 100);
                break;
            case 'money_out':
                this.playTone(300, 'sawtooth', 0.15, 0.5);
                break;
            case 'success':
                // Major triad arpeggio
                this.playTone(523.25, 'sine', 0.2, 0.3); // C5
                setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.3), 100); // E5
                setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.3), 200); // G5
                break;
            case 'error':
                this.playTone(150, 'sawtooth', 0.3, 0.6);
                break;
            case 'level_up':
                // Victory fanfare script
                const now = this.ctx.currentTime;
                [523, 659, 783, 1046].forEach((f, i) => {
                    setTimeout(() => this.playTone(f, 'square', 0.2, 0.3), i * 150);
                });
                break;
        }
    }
    toggleMute() {
        this.enabled = !this.enabled;
        console.log("Audio Enabled:", this.enabled);
        return this.enabled;
    }
}
