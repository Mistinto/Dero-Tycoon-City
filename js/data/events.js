const EVENTS = [
    {
        id: 'wallet',
        title: 'Portafoglio Smarrito',
        desc: 'Hai trovato un portafoglio per terra.',
        choices: [
            { text: 'Tienilo (+€200, -10 Rep)', effect: (game) => { game.player.earn(200); game.player.reputation -= 10; } },
            { text: 'Portalo alla Polizia (+20 Rep)', effect: (game) => { game.player.reputation += 20; game.ui.showNotification("La polizia ringrazia."); } }
        ]
    },
    {
        id: 'scandal',
        title: 'Scandalo Locale',
        desc: 'Un rivale è stato coinvolto in uno scandalo!',
        choices: [
            { text: 'Diffondi la notizia (-Rep, Rival -Money)', effect: (game) => { game.player.reputation -= 5; /* TODO: dmg rival */ game.ui.showNotification("Gossip diffuso!"); } },
            { text: 'Ignora', effect: (game) => { game.ui.showNotification("Ti fai gli affari tuoi."); } }
        ]
    },
    {
        id: 'investment',
        title: 'Opportunità Crypto',
        desc: 'Un amico ti consiglia una nuova moneta.',
        choices: [
            {
                text: 'Investi €500', effect: (game) => {
                    if (game.player.pay(500)) {
                        const win = Math.random() > 0.5;
                        if (win) { game.player.earn(1500); game.ui.showNotification("🚀 La moneta è esplosa! (+€1500)", "success"); }
                        else { game.ui.showNotification("📉 Rugpull! Hai perso tutto.", "error"); }
                    } else {
                        game.ui.showNotification("Non hai €500.");
                    }
                }
            },
            { text: 'Rifiuta', effect: (game) => { game.ui.showNotification("Meglio non rischiare."); } }
        ]
    }
];
