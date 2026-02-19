const NPCS = {
    'mayor': { name: 'Mario Rossi', role: 'Sindaco', loc: 'Municipio', desc: 'Gestisce la città.', img: '🏛️' },
    'banker': { name: 'Luigi Verdi', role: 'Banchiere', loc: 'Banca', desc: 'Gestisce i tassi.', img: '💰' },
    'doctor': { name: 'Giulia Bianchi', role: 'Medico', loc: 'Ospedale', desc: 'Salute pubblica.', img: '👩‍⚕️' },
    'police': { name: 'Capitano Neri', role: 'Capo Polizia', loc: 'Polizia', desc: 'Mantiene l\'ordine.', img: '👮' },
    'fire': { name: 'Capo Rosso', role: 'Pompierre', loc: 'Vigili Fuoco', desc: 'Sicurezza incendi.', img: '🚒' },
    'school': { name: 'Preside Gialli', role: 'Preside', loc: 'Scuola', desc: 'Istruzione base.', img: '🏫' },
    'univ': { name: 'Prof. Cervello', role: 'Rettore', loc: 'Università', desc: 'Alta formazione.', img: '🎓' },
    'job': { name: 'Dott. Lavoro', role: 'Recruiter', loc: 'Centro Impiego', desc: 'Trova talenti.', img: '💼' },
    'stadium': { name: 'Mister Palla', role: 'Allenatore', loc: 'Stadio', desc: 'Sport e salute.', img: '⚽' },
    'weather': { name: 'Bernacca Jr.', role: 'Meteorologo', loc: 'Staz. Meteo', desc: 'Previsioni.', img: '🌤️' },
    'priest': { name: 'Don Franco', role: 'Prete', loc: 'Duomo', desc: 'Pace spirituale.', img: '⛪' },
    'barman': { name: 'Joe', role: 'Barista', loc: 'Pub', desc: 'Sa tutto di tutti.', img: '🍺' },
    'port': { name: 'Cap. Nemo', role: 'Portuale', loc: 'Porto', desc: 'Import/Export.', img: '🚢' },
    'energy': { name: 'Ing. Volt', role: 'Elettrico', loc: 'Centrale', desc: 'Gestione energia.', img: '⚡' },
    'mafia': { name: 'Don Vito', role: 'Imprenditore', loc: '??', desc: 'Affari privati.', img: '🕶️' },
    'notary': { name: 'Dott. Bollo', role: 'Notaio', loc: 'Studio', desc: 'Burocrazia lenta.', img: '⚖️' }
};

class NPCManager {
    constructor(game) {
        this.game = game;
        this.relationships = {};

        // Init relationships
        Object.keys(NPCS).forEach(k => {
            this.relationships[k] = 0;
        });

        // Starting relationships
        this.relationships['mayor'] = 10;
        this.relationships['barman'] = 20;
    }

    getNPCs() {
        return NPCS;
    }

    getRelationship(id) {
        return this.relationships[id] || 0;
    }

    interact(npcId) {
        const npc = NPCS[npcId];
        const rel = this.relationships[npcId];

        // Fallback for missing fallback
        if (!npc) return;

        // Simple Prompt Interaction (Can be upgraded to UI later)
        const action = prompt(`Parli con ${npc.name} (${npc.role})\nRelazione: ${rel}/100\n\n1. Saluta (+2 Rel)\n2. Fai Regalo (€100, +10 Rel)\n3. Chiedi Favore (Richiede 50+ Rel)`);

        if (action === '1') {
            this.game.ui.showNotification(`${npc.name}: "Salve!"`);
            this.changeRelationship(npcId, 2);
        } else if (action === '2') {
            if (this.game.player.payCash(100)) {
                this.changeRelationship(npcId, 10);
                this.game.ui.showNotification(`${npc.name}: "Grazie mille!"`);
            } else {
                this.game.ui.showNotification("Non hai abbastanza contanti!", "error");
            }
        } else if (action === '3') {
            if (rel >= 50) {
                if (confirm(`Chiedere un favore ridurrà la relazione di 30 punti. Procedere?`)) {
                    this.askFavor(npcId);
                }
            } else {
                this.game.ui.showNotification(`${npc.name}: "Non siamo abbastanza intimi per questo."`, "warning");
            }
        }
    }

    changeRelationship(npcId, amount) {
        this.relationships[npcId] = Math.min(100, Math.max(0, this.relationships[npcId] + amount));
        if (amount !== 0) {
            const sign = amount > 0 ? '+' : '';
            const color = amount > 0 ? 'success' : 'error';
            const npcName = NPCS[npcId] ? NPCS[npcId].name : 'NPC';
            this.game.ui.showNotification(`Relazione con ${npcName}: ${sign}${amount} (${this.relationships[npcId]}/100)`, color);
        }
    }

    askFavor(npcId) {
        const p = this.game.player;
        let success = true;

        switch (npcId) {
            case 'mayor':
                p.reputation += 25;
                this.game.ui.showNotification("Il Sindaco ti ha elogiato pubblicamente! (+25 Rep)", 'success');
                break;
            case 'banker':
                p.bankBalance += 1000;
                this.game.ui.showNotification("Il Banchiere ti ha stornato delle commissioni. (+€1.000)", 'success');
                break;
            case 'doctor':
                p.restoreNeed('hunger', 100);
                p.restoreNeed('thirst', 100);
                p.restoreNeed('sleep', 50); // Medicine helps
                this.game.ui.showNotification("Check-up completo gratuito! Salute ripristinata.", 'success');
                break;
            case 'police':
                p.reputation += 10;
                this.game.ui.showNotification("La Polizia ignorerà le tue infrazioni minori per un po'. (+10 Rep)", 'success');
                break;
            case 'fire':
                p.reputation += 10;
                this.game.ui.showNotification("Ispezione antincendio passata con successo. (+10 Rep)", 'success');
                break;
            case 'school':
                if (!p.education.workerTraining) {
                    p.education.workerTraining = true;
                    this.game.ui.showNotification("Corso accelerato per i tuoi dipendenti sbloccato! (Sconto Costruzioni)", 'success');
                } else {
                    p.reputation += 15;
                    this.game.ui.showNotification("Hai tenuto un discorso agli studenti. (+15 Rep)", 'success');
                }
                break;
            case 'univ':
                if (!p.education.management) {
                    p.education.management = true;
                    this.game.ui.showNotification("Master in Management ottenuto! (Efficienza Aumentata)", 'success');
                } else {
                    p.reputation += 20;
                    this.game.ui.showNotification("Sei diventato Lettore Onorario. (+20 Rep)", 'success');
                }
                break;
            case 'job':
                p.money += 500;
                this.game.ui.showNotification("Hai ricevuto un bonus per aver assunto personale locale. (+€500)", 'success');
                break;
            case 'stadium':
                p.restoreNeed('fun', 100);
                this.game.ui.showNotification("Biglietti VIP per la partita! (+100 Divertimento)", 'success');
                break;
            case 'weather':
                this.game.ui.showNotification("Previsione: Domani ci sarà il sole!", 'info');
                // Could actully manipulate weather in environment
                break;
            case 'priest':
                if (p.reputation < 0) {
                    p.reputation += 50;
                    this.game.ui.showNotification("Ti sei confessato... i tuoi peccati sono perdonati. (+50 Rep)", 'success');
                } else {
                    p.restoreNeed('fun', 50); // Peace of mind
                    this.game.ui.showNotification("Benedizione ricevuta. Ti senti in pace.", 'success');
                }
                break;
            case 'barman':
                p.restoreNeed('thirst', 100);
                p.restoreNeed('fun', 50);
                this.game.ui.showNotification("Giro offerto dalla casa! Salute!", 'success');
                break;
            case 'port':
                p.money += 800;
                this.game.ui.showNotification("Hai concluso un affare di importazione. (+€800)", 'success');
                break;
            case 'energy':
                p.money += 600;
                this.game.ui.showNotification("Rimborso per efficienza energetica. (+€600)", 'success');
                break;
            case 'mafia':
                p.money += 2000;
                p.reputation -= 30;
                this.game.ui.showNotification("Soldi facili... ma la gente mormora. (+€2k, -30 Rep)", 'warning');
                break;
            case 'notary':
                // Special favor: Temporary discount flag or just cash back from "taxes"
                p.money += 500;
                this.game.ui.showNotification("Il Notaio ha trovato un cavillo a tuo favore. Rimborso tasse! (+€500)", 'success');
                break;
            default:
                success = false;
        }

        if (success) {
            this.changeRelationship(npcId, -30); // Cost of favor
        }
    }
}
