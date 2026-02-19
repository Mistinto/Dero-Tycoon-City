class EconomySystem {
    constructor(game) {
        this.game = game;

        // STOCKS (5 Companies)
        this.stocks = {
            'dero_tech': { name: 'Dero Tech', symbol: 'DERO', price: 100, trend: 0 },
            'green_energy': { name: 'EcoPower', symbol: 'ECO', price: 50, trend: 0 },
            'massive_motors': { name: 'Massive Motors', symbol: 'MOTO', price: 200, trend: 0 },
            'food_inc': { name: 'Food & Co.', symbol: 'FOOD', price: 25, trend: 0 },
            'sky_airlines': { name: 'Sky High', symbol: 'SKY', price: 80, trend: 0 }
        };

        // CRYPTO (10 Currencies)
        this.crypto = {
            'bitcoin': { name: 'Bitcoin', symbol: 'BTC', price: 30000, trend: 0, volatility: 0.1 },
            'ethereum': { name: 'Ethereum', symbol: 'ETH', price: 2000, trend: 0, volatility: 0.12 },
            'derocoin': { name: 'DeroCoin', symbol: 'DRC', price: 1, trend: 0, volatility: 0.5 }, // High risk
            'doge': { name: 'Doge', symbol: 'DOGE', price: 0.1, trend: 0, volatility: 0.2 },
            'litecoin': { name: 'Litecoin', symbol: 'LTC', price: 150, trend: 0, volatility: 0.08 },
            'cardano': { name: 'Cardano', symbol: 'ADA', price: 1.2, trend: 0, volatility: 0.1 },
            'solana': { name: 'Solana', symbol: 'SOL', price: 100, trend: 0, volatility: 0.15 },
            'ripple': { name: 'Ripple', symbol: 'XRP', price: 0.5, trend: 0, volatility: 0.1 },
            'polkadot': { name: 'Polkadot', symbol: 'DOT', price: 20, trend: 0, volatility: 0.1 },
            'shiba': { name: 'Shiba', symbol: 'SHIB', price: 0.0001, trend: 0, volatility: 0.3 }
        };

        // LOAN OFFERS
        this.loanTypes = [
            { name: "Micro", amount: 1000, interest: 0.02, days: 7, minRep: 0 },
            { name: "Small", amount: 10000, interest: 0.04, days: 15, minRep: 100 },
            { name: "Business", amount: 100000, interest: 0.06, days: 30, minRep: 300 },
            { name: "Tycoon", amount: 500000, interest: 0.08, days: 60, minRep: 700 }
        ];

        // DEPOSIT OFFERS
        // DEPOSIT OFFERS
        this.depositTypes = [
            { name: "Conto Risparmio", min: 100, rate: 0.005, days: 0, desc: "0.5% Giornaliero (Flessibile)" },
            { name: "CD 7 Giorni", min: 5000, rate: 0.05, days: 7, desc: "5% a Scadenza (Bloccato)" },
            { name: "CD 30 Giorni", min: 20000, rate: 0.15, days: 30, desc: "15% a Scadenza (Bloccato)" },
            { name: "Mutuo Casa", amount: 200000, interest: 0.04, days: 120, minRep: 200, type: 'mortgage' } // Mortgage Offer
        ];
    }

    update(deltaTime) {
        // Real-time market fluctuation could go here, or daily
    }

    // Called frequently by TimeManager (e.g. every 30 mins)
    onTimeTick(minutes) {
        // Small market fluctuations during the day
        if (minutes % 30 === 0) {
            this.updateMarket(0.02); // 2% max change
        }
    }

    // Called Daily
    onNewDay(day) {
        this.updateMarket(0.1); // Larger daily change
        this.processFinancials();
    }

    updateMarket(volatilityMult = 1.0) {
        // Random Market Movements
        Object.keys(this.stocks).forEach(k => {
            const stock = this.stocks[k];
            // Stocks: +/- 5% * multiplier
            const change = (Math.random() - 0.5) * 0.1 * volatilityMult;
            stock.price = Math.max(1, stock.price * (1 + change));

            // Trend logic (simple)
            stock.trend = change > 0 ? 1 : -1;
        });

        Object.keys(this.crypto).forEach(k => {
            const coin = this.crypto[k];
            // Crypto: Volatility * 2 * multiplier
            const change = (Math.random() - 0.5) * (coin.volatility * 2) * volatilityMult;
            coin.price = Math.max(0.00001, coin.price * (1 + change));

            coin.trend = change > 0 ? 1 : -1;
        });

        // Refresh Bank UI if open to show new prices
        if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
            this.game.ui.apps.bank.render();
        }
    }

    processFinancials() {
        const p = this.game.player;

        // 1. Dividends (Daily)
        let totalDividends = 0;
        Object.keys(this.stocks).forEach(k => {
            // Check if player owns this stock
            // Portfolio structure: { qty: 10, avgPrice: 100 } OR just plain number?
            // User requested avg price tracking, so we need object.
            // Supporting both legacy (number) and new (object) for safety.

            let qty = 0;
            if (typeof p.portfolio.stocks[k] === 'number') qty = p.portfolio.stocks[k];
            else if (p.portfolio.stocks[k]) qty = p.portfolio.stocks[k].qty;

            if (qty > 0) {
                // Dividend yield approx 0.1% of price per day
                const div = this.stocks[k].price * 0.001 * qty;
                totalDividends += div;
            }
        });

        if (totalDividends > 0) {
            p.bankBalance += totalDividends;
            if (!p.stats) p.stats = {};
            p.stats.investmentEarnings = (p.stats.investmentEarnings || 0) + totalDividends;
            this.game.ui.showNotification(`💰 Dividendi Azionari: +€${totalDividends.toFixed(2)}`, "success");
        }

        // 2. Savings Interest (Daily)
        if (p.savings && p.savings.balance > 0) {
            const interest = p.savings.balance * (p.savings.interest || 0.005);
            p.savings.balance += interest;
            // Interest counts as investment earnings? Sure.
            if (!p.stats) p.stats = {};
            p.stats.investmentEarnings = (p.stats.investmentEarnings || 0) + interest;

            this.game.ui.showNotification(`🐖 Interessi Risparmi: +€${interest.toFixed(2)}`, "success");
        }

        // 2. Loan Interest (Compounded or just daily payment? Simple: Interest is already correctly calculated in totalRepay)
        // We could force a daily payment? For now, manual repayment as designed.
    }

    takeLoan(typeIndex) {
        const offer = this.loanTypes[typeIndex];
        const p = this.game.player;

        if (p.loans.length >= 3) {
            this.game.ui.showNotification("🚫 Hai già troppi prestiti attivi (Max 3)!", "error");
            return;
        }

        if (p.reputation < offer.minRep) {
            this.game.ui.showNotification(`🔒 Reputazione insufficiente! Serve: ${offer.minRep}`, "error");
            return;
        }

        // Add Cash
        p.bankBalance += offer.amount;

        // Add Debt
        p.loans.push({
            name: offer.name,
            amount: offer.amount,
            totalRepay: offer.amount * (1 + offer.interest),
            daysLeft: offer.days
        });

        this.game.ui.showNotification(`🏦 Prestito ${offer.name} ottenuto: +€${offer.amount}`);

        // Refresh UI if open
        if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
            this.game.ui.apps.bank.render();
        }
    }

    repayLoan(index) {
        const p = this.game.player;
        const loan = p.loans[index];
        if (!loan) return;

        // Repay from BANK BALANCE (Logic change for "Bank App")? 
        // User asked to separate cash/bank. Loans usually paid from bank.
        // Let's use bankBalance for loans to keep "Bank App" consistent.

        if (p.bankBalance >= loan.totalRepay) {
            p.bankBalance -= loan.totalRepay;
            p.loans.splice(index, 1);
            this.game.ui.showNotification(`✅ Hai rimborsato il prestito ${loan.name} (dal conto)!`, 'success');
            // Refresh UI if open
            if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
                this.game.ui.apps.bank.render();
            }
        } else {
            this.game.ui.showNotification("💸 Saldo bancario insufficiente per rimborsare!", "error");
        }
    }

    makeDeposit(typeIndex, amount) {
        const offer = this.depositTypes[typeIndex];
        const p = this.game.player;

        if (p.bankBalance < amount) {
            this.game.ui.showNotification("💸 Saldo bancario insufficiente!", "error");
            return false;
        }

        // 0 is Savings Account (Special handling)
        if (typeIndex === 0) {
            p.bankBalance -= amount;
            p.savings.balance += amount;
            this.game.ui.showNotification(`💰 Versati €${amount} nel Salvadanaio.`);
        } else {
            // CDs
            p.bankBalance -= amount;
            p.deposits.push({ // Wait, p.deposits or p.cds? Player.js uses p.cds usually? 
                // Creating new array p.deposits might be inconsistent if Player.js uses p.cds.
                // Checking Player.js... it has p.cds = []. 
                // Existing code in BankApp maps p.cds. 
                // But here in makeDeposit it pushes to p.deposits? 
                // Let's check constructor/init. 
                // Player.js has `this.cds = []`. 
                // EconomySystem line 184 pushes to `p.deposits`. 
                // This is a BUG in existing code. I should fix it to use `p.cds`.
            });
            // Actually, let's fix the bug in the existing makeDeposit first if I can see it. 
            // In the view_file above: p.deposits.push({...}). 
            // Player.js has this.cds. BankApp reads p.cds.
            // So makeDeposit is broken for CDs! 
            // But Savings (type 0) is usually just p.savings.balance.
            // The existing makeDeposit treats everything as a fixed deposit object?
            // type 0 in depositTypes is "Conto Risparmio", days 0.
            // If I push it to p.cds, it becomes a discrete item.
            // But BankApp render (line 86) reads p.savings.balance!
            // So makeDeposit DOES NOT handle Type 0 correctly currently!

            // I will REWRITE makeDeposit to handle Type 0 (Savings) vs Others (CDs).
        }

        // Refresh UI
        if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
            this.game.ui.apps.bank.render();
        }
        return true;
    }

    // Rewrite makeDeposit to be correct
    makeDeposit(typeIndex, amount) {
        const offer = this.depositTypes[typeIndex];
        const p = this.game.player;

        if (p.bankBalance < amount) {
            this.game.ui.showNotification("💸 Saldo insufficiente!", "error");
            return false;
        }

        p.bankBalance -= amount;

        if (typeIndex === 0) {
            // SAVINGS ACCOUNT
            p.savings.balance += amount;
            this.game.ui.showNotification(`💰 Versati €${amount} nel Conto Risparmio.`);
        } else {
            // CDs
            p.cds.push({
                name: offer.name,
                amount: amount,
                rate: offer.rate,
                maturityDay: this.game.time.day + offer.days
            });
            this.game.ui.showNotification(`📜 Sottoscritto ${offer.name} (€${amount})`);
        }

        if (this.game.ui.activeApp === 'bank') this.game.ui.apps.bank.render();
        return true;
    }

    withdrawSavings(amount) {
        const p = this.game.player;
        if (p.savings.balance >= amount) {
            p.savings.balance -= amount;
            p.bankBalance += amount;
            this.game.ui.showNotification(`💰 Prelevati €${amount} dai Risparmi.`);

            if (this.game.ui.activeApp === 'bank') this.game.ui.apps.bank.render();
            return true;
        } else {
            this.game.ui.showNotification("💸 Fondi insufficienti nei Risparmi!", "error");
            return false;
        }
    }

    buyAsset(type, id, qty) {
        const p = this.game.player;
        let price = 0;
        let obj = null;

        if (type === 'stock') obj = this.stocks[id];
        if (type === 'crypto') obj = this.crypto[id];

        if (!obj) return;

        price = obj.price;
        const totalCost = price * qty;

        if (p.bankBalance >= totalCost) {
            p.bankBalance -= totalCost;

            // Init portfolio if needed
            if (p.portfolio[type + 's'] === undefined) p.portfolio[type + 's'] = {};

            const port = (type === 'stock') ? p.portfolio.stocks : p.portfolio.crypto;

            // Initialize entry if new
            if (!port[id]) {
                port[id] = { qty: 0, avgPrice: 0 };
            }
            // Migrate old number format if exists
            else if (typeof port[id] === 'number') {
                port[id] = { qty: port[id], avgPrice: 0 }; // 0 avg price for old saves (unknown)
            }

            // Calculate new average price
            // (OldTotalVal + NewCost) / NewTotalQty
            const oldTotalVal = port[id].qty * port[id].avgPrice;
            const newTotalVal = oldTotalVal + totalCost;
            const newQty = port[id].qty + qty;

            port[id].qty = newQty;
            port[id].avgPrice = newTotalVal / newQty;

            this.game.ui.showNotification(`📈 Comprati ${qty} ${obj.symbol} a €${price.toFixed(2)} (dal conto). Media: €${port[id].avgPrice.toFixed(2)}`);

            // Refresh UI
            if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
                this.game.ui.apps.bank.render();
            }
            return true;
        } else {
            this.game.ui.showNotification("💸 Saldo bancario insufficiente!");
            return false;
        }
    }

    sellAsset(type, id, qty) {
        const p = this.game.player;
        let obj = null;
        if (type === 'stock') obj = this.stocks[id];
        if (type === 'crypto') obj = this.crypto[id];

        const port = (type === 'stock') ? p.portfolio.stocks : p.portfolio.crypto;

        // Check ownership (handle strict object structure)
        let currentQty = 0;
        let avgPrice = 0;

        if (port[id]) {
            if (typeof port[id] === 'number') {
                currentQty = port[id];
                avgPrice = 0;
            } else {
                currentQty = port[id].qty;
                avgPrice = port[id].avgPrice;
            }
        }

        if (currentQty < qty) {
            this.game.ui.showNotification("❌ Non possiedi abbastanza asset!");
            return false;
        }

        const price = obj.price;
        const earnings = price * qty;

        // Calculate Profit/Loss
        // Profit = (SellPrice - AvgBuyPrice) * Qty
        const profit = (price - avgPrice) * qty;
        const profitColor = profit >= 0 ? 'green' : 'red';
        const profitSign = profit >= 0 ? '+' : '';

        // Update Portfolio
        if (typeof port[id] === 'number') {
            port[id] -= qty;
        } else {
            port[id].qty -= qty;
            // Avg price doesn't change on sell
            if (port[id].qty === 0) port[id].avgPrice = 0;
        }

        p.bankBalance += earnings;

        if (profit > 0) {
            if (!p.stats) p.stats = {};
            p.stats.investmentEarnings = (p.stats.investmentEarnings || 0) + profit;
        }

        this.game.ui.showNotification(`📉 Venduti ${qty} ${obj.symbol} per €${earnings.toFixed(2)} (sul conto)`, profit >= 0 ? 'success' : 'error');

        // Refresh UI
        if (this.game.ui.activeApp === 'bank' || document.getElementById('bank-screen')) {
            this.game.ui.apps.bank.render();
        }
        return true;
    }

    // --- CHECKING ACCOUNT ACTIONS ---
    deposit(amount) {
        const p = this.game.player;
        if (p.money < amount) {
            this.game.ui.showNotification("💸 Non hai abbastanza contanti!", "error");
            return;
        }
        p.money -= amount;
        p.bankBalance += amount;
        this.game.ui.showNotification(`Done! Versati €${amount} sul conto.`);

        // Log Transaction
        if (!p.transactions) p.transactions = [];
        p.transactions.unshift({
            date: `Giorno ${this.game.time.day}`,
            desc: "Versamento Contanti",
            amount: amount
        });
        if (p.transactions.length > 20) p.transactions.pop();

        if (this.game.ui.activeApp === 'bank') this.game.ui.apps.bank.render();
    }

    withdraw(amount) {
        const p = this.game.player;
        if (p.bankBalance < amount) {
            this.game.ui.showNotification("💸 Saldo bancario insufficiente!", "error");
            return;
        }
        p.bankBalance -= amount;
        p.money += amount;
        this.game.ui.showNotification(`Done! Prelevati €${amount} dal conto.`);

        // Log Transaction
        if (!p.transactions) p.transactions = [];
        p.transactions.unshift({
            date: `Giorno ${this.game.time.day}`,
            desc: "Prelievo Contanti",
            amount: -amount
        });
        if (p.transactions.length > 20) p.transactions.pop();

        if (this.game.ui.activeApp === 'bank') this.game.ui.apps.bank.render();
    }
}
