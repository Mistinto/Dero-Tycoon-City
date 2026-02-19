class BankApp {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('app-container');
        this.currentTab = 'account';
    }

    render() {
        try {
            // Track current tab if we are re-rendering, default to account
            if (!this.currentTab) this.currentTab = 'account';

            const screen = document.createElement('div');
            screen.id = 'bank-screen';
            screen.className = 'app-screen';

            const eco = this.game.economy;
            const p = this.game.player;

            // Initialize collections if missing (Safety Check)
            if (!p.savings) p.savings = { balance: 0, interest: 0.005 };
            if (!p.cds) p.cds = [];
            if (!p.transactions) p.transactions = [];
            if (!p.portfolio) p.portfolio = { stocks: {}, crypto: {} };
            if (!p.portfolio.stocks) p.portfolio.stocks = {};
            if (!p.portfolio.crypto) p.portfolio.crypto = {};

            // --- RENDER CONTENT GENERATION ---

            // 1. MAIN ACCOUNT (Missing variable fix)
            let accountHtml = `
            <h3>Gestione Conto Corrente</h3>
            <div style="background:#222; padding:15px; border-radius:10px; text-align:center; margin-bottom:20px;">
                <p style="color:#aaa; margin-bottom:5px;">Saldo Disponibile</p>
                <h1 style="color:#2196F3; margin:0;">€${Math.floor(p.bankBalance).toLocaleString()}</h1>
                <p style="color:#aaa; font-size:0.9em; margin-top:5px;">In contanti: €${Math.floor(p.money).toLocaleString()}</p>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <button class="job-btn" style="background:#4CAF50;" onclick="window.GameEngine.economy.deposit(100)">Versa €100</button>
                <button class="job-btn" style="background:#f44336;" onclick="window.GameEngine.economy.withdraw(100)">Preleva €100</button>
                
                <button class="job-btn" style="background:#4CAF50;" onclick="window.GameEngine.economy.deposit(1000)">Versa €1.000</button>
                <button class="job-btn" style="background:#f44336;" onclick="window.GameEngine.economy.withdraw(1000)">Preleva €1.000</button>
                
                <button class="job-btn" style="background:#4CAF50;" onclick="window.GameEngine.economy.deposit(p.money)">Versa Tutto</button>
                <button class="job-btn" style="background:#f44336;" onclick="window.GameEngine.economy.withdraw(p.bankBalance)">Preleva Tutto</button>
            </div>
            
            <div style="margin-top:20px; padding:10px; background:#333; border-radius:5px;">
                <p>📋 <strong>IBAN:</strong> IT88DERO0000${Math.floor(Math.random() * 999999)}</p>
                <p>💳 <strong>Carta:</strong> **** **** **** 4492</p>
            </div>
        `;

            // 2. LOANS & MORTGAGES
            let loansHtml = '';
            loansHtml += `<h3>Offerte Prestiti & Mutui</h3>`;
            eco.loanTypes.forEach((l, i) => {
                const canTake = p.reputation >= l.minRep;
                const btnStyle = canTake ? '' : 'background:#555; cursor:not-allowed; opacity:0.7;';
                const clickAction = canTake ? `window.GameEngine.economy.takeLoan(${i})` : `alert('🔒 Serve reputazione ${l.minRep} per sbloccare!')`;
                const lockIcon = canTake ? '' : '🔒';
                const isMortgage = l.type === 'mortgage';
                const color = isMortgage ? '#9C27B0' : '#FF9800'; // Purple for mortgage

                loansHtml += `<button class="job-btn" style="width:100%; margin:5px 0; ${btnStyle} border-left: 4px solid ${color};" onclick="${clickAction}">
                    ${lockIcon} ${l.name} (€${l.amount.toLocaleString()}) - Rep: ${l.minRep}
                </button>`;
            });
            loansHtml += `<hr style="margin: 15px 0;"><h3>I tuoi Debiti</h3><div id="my-loans">`;
            loansHtml += p.loans.map((l, index) => `
                <div style="margin:5px 0; border:1px solid #444; background:#222; padding:10px; border-radius:5px;">
                    <p><strong>${l.name}</strong>: €${l.totalRepay.toFixed(0)}</p>
                    <p style="font-size:0.8em; color:#aaa;">Scadenza: ${l.daysLeft}gg</p>
                    <button class="mini-btn" style="background:#ff9800; width:100%; margin-top:5px;" onclick="window.GameEngine.economy.repayLoan(${index})">Rimborsa</button>
                </div>
            `).join('') || '<p style="color:#888; font-style:italic;">Nessun debito attivo.</p>';
            loansHtml += `</div>`;


            // 5. SAVINGS & INVESTMENTS
            let investHtml = `
                <h3>Conto Risparmio</h3>
                <div style="background:#333; padding:15px; border-radius:10px; margin-bottom:15px; border-left:4px solid #4CAF50;">
                    <p>Saldo Risparmi: <strong style="color:#4CAF50; font-size:1.2em;">€${p.savings.balance.toLocaleString()}</strong></p>
                    <small>Interesse Giornaliero: ${(p.savings.interest * 100).toFixed(1)}%</small>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="mini-btn" style="flex:1;" onclick="window.GameEngine.economy.makeDeposit(0, 100)">Versa €100</button>
                        <button class="mini-btn" style="flex:1;" onclick="window.GameEngine.economy.makeDeposit(0, 1000)">Versa €1k</button>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:5px;">
                        <button class="mini-btn" style="flex:1; background:#f44336;" onclick="window.GameEngine.economy.withdrawSavings(100)">Preleva €100</button>
                        <button class="mini-btn" style="flex:1; background:#f44336;" onclick="window.GameEngine.economy.withdrawSavings(1000)">Preleva €1k</button>
                    </div>
                </div>
                
                <h3>Certificati di Deposito (CD)</h3>
                <div class="market-list">
            `;

            // Render CD Types (skip index 0 which is savings)
            if (eco.depositTypes && eco.depositTypes.length > 1) {
                eco.depositTypes.slice(1).forEach((d, index) => {
                    // Adjust index because slice shifts it. Actual index in eco.depositTypes is index + 1
                    const realIndex = index + 1;
                    investHtml += `
                        <div class="job-card" style="margin-bottom:10px;">
                            <h4 style="margin:0;">${d.name}</h4>
                            <p style="font-size:0.9em; color:#ccc;">${d.desc}</p>
                            <p style="font-size:0.8em;">Min: €${d.min}</p>
                            <button class="mini-btn" style="background:#2196F3; width:100%;" 
                                onclick="window.GameEngine.economy.makeDeposit(${realIndex}, ${d.min})">Sottoscrivi (€${d.min})</button>
                        </div>
                    `;
                });
            }

            investHtml += `<h3>I tuoi Investimenti</h3>`;
            investHtml += p.cds.map(cd => `
                <div style="margin:5px 0; border:1px solid #2196F3; background:#222; padding:10px; border-radius:5px;">
                    <p><strong>${cd.name}</strong>: €${cd.amount.toLocaleString()}</p>
                    <p style="font-size:0.8em; color:#aaa;">Scadenza: Giorno ${cd.maturityDay}</p>
                    <small style="color:#4CAF50;">Rendimento: +${(cd.rate * 100).toFixed(0)}%</small>
                </div>
            `).join('') || '<p style="color:#888;">Nessun CD attivo.</p>';
            investHtml += `</div>`;


            // 6. HISTORY
            let historyHtml = `<h3>Ultime Transazioni</h3><div style="max-height:300px; overflow-y:auto;">`;
            if (p.transactions && p.transactions.length > 0) {
                historyHtml += p.transactions.map(t => {
                    const color = t.amount >= 0 ? '#4CAF50' : '#f44336';
                    const sign = t.amount >= 0 ? '+' : '';
                    return `
                        <div style="border-bottom:1px solid #444; padding:8px 0; display:flex; justify-content:space-between;">
                            <div>
                                <div style="font-weight:bold;">${t.desc}</div>
                                <small style="color:#888;">${t.date}</small>
                            </div>
                            <div style="color:${color}; font-weight:bold;">${sign}€${Math.abs(t.amount).toLocaleString()}</div>
                        </div>
                    `;
                }).join('');
            } else {
                historyHtml += '<p style="color:#888;">Nessuna transazione recente.</p>';
            }
            historyHtml += `</div>`;


            // 7. STOCKS (Missing variable fix)
            let stocksHtml = `<h3>Mercato Azionario</h3><div class="market-list">`;
            stocksHtml += Object.keys(eco.stocks).map(k => {
                const s = eco.stocks[k];
                // Handle both number (old save) and object (new save)
                let qty = 0;
                let avg = 0;
                if (p.portfolio.stocks && p.portfolio.stocks[k]) {
                    if (typeof p.portfolio.stocks[k] === 'number') qty = p.portfolio.stocks[k];
                    else {
                        qty = p.portfolio.stocks[k].qty;
                        avg = p.portfolio.stocks[k].avgPrice;
                    }
                }

                const trendIcon = s.trend > 0 ? '📈' : '📉';
                const trendColor = s.trend > 0 ? '#4CAF50' : '#f44336';

                // Profit calc
                let profitHtml = '';
                if (qty > 0 && avg > 0) {
                    const profit = (s.price - avg) * qty;
                    const pColor = profit >= 0 ? '#4CAF50' : '#f44336';
                    profitHtml = `<small style="display:block; color:${pColor};">P/L: ${profit >= 0 ? '+' : ''}€${profit.toFixed(0)}</small>`;
                }

                return `
                <div class="job-card" style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>${s.name} (${s.symbol}) ${trendIcon}</h4>
                        <span style="color:${trendColor}; font-weight:bold;">€${s.price.toFixed(2)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:5px;">
                        <small>Posseduti: ${qty}</small>
                        ${profitHtml}
                    </div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button class="mini-btn" style="flex:1; background:#4CAF50;" onclick="window.GameEngine.economy.buyAsset('stock', '${k}', 1)">Comprane 1</button>
                        <button class="mini-btn" style="flex:1; background:#f44336;" onclick="window.GameEngine.economy.sellAsset('stock', '${k}', 1)">Vendine 1</button>
                    </div>
                </div>
                `;
            }).join('');
            stocksHtml += `</div>`;


            screen.innerHTML = `
                <div class="app-header">
                    <span class="app-title">🏦 Bank of Dero</span>
                    <button onclick="goHome()">✖️</button>
                </div>
                <div class="app-content">
                    <div class="bank-balance-card">
                        <div class="balance-label">Saldo Bancario</div>
                        <div class="balance-amount" id="bank-balance-header">€${Math.floor(p.bankBalance).toLocaleString()}</div>
                    </div>
                    
                    <div class="bank-tabs" style="display:flex; gap:5px; background:#333; padding:5px; border-radius:5px; overflow-x:auto;">
                    <button id="btn-account" class="tab-btn active" style="flex:1; background:#555;">Conto</button>
                    <button id="btn-invest" class="tab-btn" style="flex:1; background:#333;">Investi</button>
                    <button id="btn-loans" class="tab-btn" style="flex:1; background:#333;">Prestiti</button>
                    <button id="btn-stocks" class="tab-btn" style="flex:1; background:#333;">Azioni</button>
                    <button id="btn-crypto" class="tab-btn" style="flex:1; background:#333;">Crypto</button>
                    <button id="btn-history" class="tab-btn" style="flex:1; background:#333;">Storico</button>
                </div>

                <div id="content-account" class="tab-content" style="margin-top:15px;">
                    ${accountHtml}
                </div>

                <div id="content-invest" class="tab-content" style="margin-top:15px;">
                    ${investHtml}
                </div>

                <div id="content-loans" class="tab-content" style="margin-top:15px;">
                    ${loansHtml}
                </div>

                <div id="content-stocks" class="tab-content" style="margin-top:15px;">
                    ${stocksHtml}
                </div>
                
                <div id="content-crypto" class="tab-content" style="margin-top:15px; display:none;">
                     <!-- CRYPTO SECTION GENERATED HERE -->
                     <h3>Crypto Market (High Risk)</h3>
                     <div class="market-list">
                     ${Object.keys(eco.crypto).map(k => {
                const c = eco.crypto[k];
                // Handle both number and object like stocks
                let owned = 0;
                let avg = 0;
                if (p.portfolio.crypto && p.portfolio.crypto[k]) {
                    if (typeof p.portfolio.crypto[k] === 'number') owned = p.portfolio.crypto[k];
                    else {
                        owned = p.portfolio.crypto[k].qty;
                        avg = p.portfolio.crypto[k].avgPrice;
                    }
                }

                const trendIcon = c.trend > 0 ? '📈' : '📉';
                const trendColor = c.trend > 0 ? '#4CAF50' : '#f44336';

                // Profit Calculation
                let profitHtml = '';
                if (owned > 0 && avg > 0) {
                    const profit = (c.price - avg) * owned;
                    const pColor = profit >= 0 ? '#4CAF50' : '#f44336';
                    profitHtml = `<small style="display:block; color:${pColor};">P/L: ${profit >= 0 ? '+' : ''}€${profit.toFixed(2)}</small>`;
                } else if (owned > 0) {
                    profitHtml = `<small style="display:block; color:#aaa;">P/L: N/A</small>`;
                }

                return `
                            <div class="market-item" style="border-bottom:1px solid #444; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="font-weight:bold;">${c.name} (${c.symbol}) ${trendIcon}</div>
                                    <div style="color:${trendColor};">€${c.price.toFixed(4)}</div>
                                    <small style="color:#888;">Posseduti: ${owned}</small>
                                    ${profitHtml}
                                </div>
                                <div style="display:flex; gap:5px;">
                                    <button class="mini-btn" style="background:#4CAF50;" onclick="window.GameEngine.economy.buyAsset('crypto', '${k}', 1)">Compra 1</button>
                                    <button class="mini-btn" style="background:#f44336;" onclick="window.GameEngine.economy.sellAsset('crypto', '${k}', 1)">Vendi 1</button>
                                </div>
                            </div>
                            `;
            }).join('')}
                     </div>
                </div>

                <div id="content-history" class="tab-content" style="margin-top:15px;">
                     ${historyHtml}
                </div>
            </div>
        `;

            this.container.appendChild(screen);

            // --- TAB LOGIC ---
            const tabs = ['account', 'invest', 'loans', 'stocks', 'crypto', 'history'];

            // Initial Visibility based on this.currentTab
            tabs.forEach(t => {
                const content = document.getElementById(`content-${t}`);
                const btn = document.getElementById(`btn-${t}`);
                if (t === this.currentTab) {
                    if (content) content.style.display = 'block';
                    if (btn) btn.style.background = '#555';
                } else {
                    if (content) content.style.display = 'none';
                    if (btn) btn.style.background = '#333';
                }
            });

            // Click Handlers
            tabs.forEach(t => {
                document.getElementById(`btn-${t}`).onclick = () => {
                    this.currentTab = t; // Save state

                    // Reset UI
                    tabs.forEach(x => {
                        document.getElementById(`content-${x}`).style.display = 'none';
                        document.getElementById(`btn-${x}`).style.background = '#333';
                    });
                    // Activate clicked
                    document.getElementById(`content-${t}`).style.display = 'block';
                    document.getElementById(`btn-${t}`).style.background = '#555';
                };
            });
        } catch (e) {
            console.error("BankApp Render Error:", e);
            this.container.innerHTML = `<div style="color:red; padding:20px;"><h3>Errore Bank App</h3><pre>${e.message}</pre></div>`;
        }
    }

    update() {
        const p = this.game.player;

        // Update Header
        const elHeader = document.getElementById('bank-balance-header');
        if (elHeader) elHeader.innerText = `€${Math.floor(p.bankBalance).toLocaleString()}`;

        // Update Account Tab Values
        const elCash = document.getElementById('app-cash-display');
        if (elCash) elCash.innerText = `€${Math.floor(p.money).toLocaleString()}`;

        const elBank = document.getElementById('app-bank-display');
        if (elBank) elBank.innerText = `€${Math.floor(p.bankBalance).toLocaleString()}`;
    }
}
