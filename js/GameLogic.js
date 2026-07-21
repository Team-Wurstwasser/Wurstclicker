(function(App) {
    'use strict';

    // Diese Variablen existieren JETZT NUR NOCH HIER im Speicher
    // und können von der Browser-Konsole (F12) NICHT mehr manipuliert werden!
    let isResetting = false;
    let inputBuffer = "";
    const targetWord = "wurst";

    const state = {
        cookies: new Decimal(0),
        clickValue: new Decimal(1),
        clickBonus: new Decimal(0),
        clickMultiplier: new Decimal(1),
        rebirthPoints: new Decimal(0),
        totalRebirths: new Decimal(0),
        lifetimeCookies: new Decimal(0),
        lifetimeRebirthPoints: new Decimal(0),
        isWurstMode: false,
        lastUpdate: Date.now(),
        created: new Date()
    };

    const factoryData = {};
    const upgradeData = {};
    const rebirthTreeData = {};
    const visibleupgrades = new Set();
    let currentUpgradeToBuy = null;

    // Wir teilen diese Objekte mit den anderen Skript-Dateien über das App-Objekt
    App.state = state;
    App.factoryData = factoryData;
    App.upgradeData = upgradeData;
    App.rebirthTreeData = rebirthTreeData;
    App.visibleupgrades = visibleupgrades;

    App.elements = {
        sidebar: document.querySelector('.sidebar'),
        cookieBtn: document.getElementById('cookie'),
        cookieDisplay: document.getElementById('cookie-count'),
        cpsDisplay: document.getElementById('cps-count'),
        // ... restliche Elemente
    };

    // Logik-Funktionen (z. B. buyFactory, performRebirth...)
    App.buyFactory = function(key, restore = false) {
        const upg = factoryData[key];
        if (!upg || (!restore && state.cookies.lt(upg.price))) return;

        if (!restore) {
            state.cookies = state.cookies.minus(upg.price);
        }

        upg.amount = upg.amount.plus(1);
        upg.price = upg.basePrice.times(
            upg.priceMultiplier.pow(upg.amount.toNumber())
        ).round(0, 0);

        if (!restore) {
            App.updateUI();
            App.saveGame();
        }
    };

    // Multi-Game-Loop & Event Listener
    setInterval(() => {
        const now = Date.now();
        const deltaTime = new Decimal(now - state.lastUpdate).div(1000);
        if (App.getFactoryCPS().gt(0)) {
            const passiveGain = App.getFactoryCPS().times(deltaTime);
            state.cookies = state.cookies.plus(passiveGain);
            state.lifetimeCookies = state.lifetimeCookies.plus(passiveGain);
            App.updateUI();
        }
        state.lastUpdate = now;
    }, 100);

})(window.GameApp = window.GameApp || {});
