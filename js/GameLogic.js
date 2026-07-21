(function(App) {
    'use strict';

    // Private Variablen (vollständig abgekapselt)
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

    // Freigabe für andere Module
    App.state = state;
    App.factoryData = factoryData;
    App.upgradeData = upgradeData;
    App.rebirthTreeData = rebirthTreeData;
    App.visibleupgrades = visibleupgrades;

    App.isResetting = () => isResetting;
    App.setResetting = (val) => { isResetting = val; };

    App.elements = {
        sidebar: document.querySelector('.sidebar'),
        cookieBtn: document.getElementById('cookie'),
        cookieDisplay: document.getElementById('cookie-count'),
        cpsDisplay: document.getElementById('cps-count'),
        shopToggle: document.getElementById('shop-toggle'),
        shopIcon: document.getElementById('shop-icon'),
        shopText: document.getElementById('shop-text'),
        settingsBtn: document.getElementById('settings-toggle'),
        settingsOverlay: document.getElementById('settings-overlay'),
        closeSettings: document.getElementById('close-settings'),
        resetBtn: document.getElementById('reset-game'),
        exportBtn: document.getElementById('export-save'),
        importBtn: document.getElementById('import-save'),
        savePopup: document.getElementById('save-popup'),
        loadPopup: document.getElementById('load-popup'),
        saveCodeField: document.getElementById('save-code-field'),
        loadCodeField: document.getElementById('load-code-field'),
        confirmLoadBtn: document.getElementById('confirm-load'),
        closeSave: document.getElementById('close-save'),
        closeLoad: document.getElementById('close-load'),
        rebirthInfo: document.getElementById('rebirth-info'),
        rebirthBtn: document.getElementById('rebirth-btn'),
        rebirthTreeOverlay: document.getElementById('rebirth-tree-overlay'),
        closeRebirthTree: document.getElementById('close-rebirth-tree'),
        rebirthTreePoints: document.getElementById('rebirth-tree-points'),
        rebirthTreeScroll: document.getElementById('rebirth-tree-scroll'),
        rebirthTreeMap: document.getElementById('rebirth-tree-map'),
        upgradePopup: document.getElementById('upgrade-popup'),
        closeUpgradePop: document.getElementById('close-upgrade-pop'),
        confirmUpgradeBuy: document.getElementById('confirm-upgrade-buy'),
        upPopName: document.getElementById('up-pop-name'),
        upPopIcon: document.getElementById('up-pop-icon'),
        upPopDesc: document.getElementById('up-pop-desc'),
        upPopPriceBtn: document.getElementById('up-pop-price-btn'),
        upgradeContainer: document.getElementById('upgrade-list'),
        factoryContainer: document.getElementById('factory-list')
    };

    App.formatNumber = function(num) {
        if (!(num instanceof Decimal)) num = new Decimal(num || 0);
        if (num.lt(1000)) return num.floor().toString();

        const suffixes = [
            "", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", 
            "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", 
            "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg"
        ];

        const parts = num.toExponential().split('e');
        const exponent = parseInt(parts[1]);
        const suffixIndex = Math.floor(exponent / 3);

        if (suffixIndex >= suffixes.length) {
            return num.toExponential(2).replace('+', '').replace('.', ',');
        }

        const shortValue = num.div(new Decimal(10).pow(suffixIndex * 3)).toFixed(2).replace('.', ',');
        return shortValue + " " + suffixes[suffixIndex];
    };

    App.formatValue = function(num) {
        if (!(num instanceof Decimal)) num = new Decimal(num || 0);

        if (num.lt(1000)) {
            return num.toFixed(2).replace('.', ',');
        }

        return App.formatNumber(num).replace('.', ',');
    };

    App.getRebirthPoints = function() {
        if (state.lifetimeCookies.lt(App.rebirthConfig.baseCookies)) {
            return new Decimal(0);
        }
        const totalPointsPossible = state.lifetimeCookies.div(App.rebirthConfig.baseCookies).log(App.rebirthConfig.pointsMultiplier).floor().plus(1);
        const rebirthPoints = totalPointsPossible.minus(state.lifetimeRebirthPoints);
        return rebirthPoints.gt(0) ? rebirthPoints : new Decimal(0);
    };

    App.getRebirthMultiplier = function() {
        return new Decimal(1).plus(state.lifetimeRebirthPoints.times(App.rebirthConfig.bonusPerPoint));
    };

    App.updateRebirthTree = function() {
        const mapWidth = App.elements.rebirthTreeMap.clientWidth || 1600;
        const mapHeight = App.elements.rebirthTreeMap.clientHeight || 1000;

        Object.entries(rebirthTreeData).forEach(([key, node]) => {
            const hasEnoughPoints = state.rebirthPoints.gte(node.cost || 0);
            
            const parentsMet = (node.parents || []).every(reqKey => {
                const reqNode = rebirthTreeData[reqKey];
                return reqNode && reqNode.bought === true;
            });

            const available = !node.bought && parentsMet && hasEnoughPoints;

            node.dom.classList.toggle('bought', !!node.bought);
            node.dom.classList.toggle('available', available);
            node.dom.classList.toggle('locked', !node.bought && !available);
            
            node.dom.disabled = node.bought || !available;
        });

        App.elements.rebirthTreePoints.innerText = `Verfügbare Punkte: ${App.formatNumber(state.rebirthPoints)}`;
        
        App.elements.rebirthTreeMap.querySelectorAll('.rebirth-tree-link').forEach(link => {
            const fromNode = rebirthTreeData[link.dataset.from];
            const toNode = rebirthTreeData[link.dataset.to];
            const fromX = ((fromNode.x || 0) / 1600) * mapWidth;
            const fromY = ((fromNode.y || 0) / 1000) * mapHeight;
            const toX = ((toNode.x || 0) / 1600) * mapWidth;
            const toY = ((toNode.y || 0) / 1000) * mapHeight;
            const deltaX = toX - fromX;
            const deltaY = toY - fromY;
            const length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            link.style.left = `${fromX}px`;
            link.style.top = `${fromY}px`;
            link.style.width = `${length}px`;
            link.style.transform = `rotate(${angle}deg)`;
            link.classList.toggle('active', !!fromNode?.bought);
        });
    };

    App.centerRebirthTree = function() {
        const scrollContainer = App.elements.rebirthTreeScroll;
        const scrollLeft = (App.elements.rebirthTreeMap.scrollWidth - scrollContainer.clientWidth) / 2;

        scrollContainer.scrollLeft = scrollLeft;
        scrollContainer.scrollTop = 0;
    };

    App.getFactoryCPS = function() {
        let total = new Decimal(0);
        for (const key in factoryData) {
            const item = factoryData[key];
            total = total.plus(new Decimal(item.amount).times(item.cps).times(item.multiplier));
        }
        return total.times(App.getRebirthMultiplier());
    };

    App.getClickValue = function() {
        return state.clickValue.plus(state.clickBonus).times(state.clickMultiplier).times(App.getRebirthMultiplier());
    };

    function getUpgradeDescription(upg) {
        if (upg.type === "clickBoost") {
            const boost = new Decimal(upg.boost || 1).times(App.getRebirthMultiplier());
            const pluralSuffix = boost.equals(1) ? "" : "e";
            return upg.desc.replace("{value}", App.formatValue(boost)).replace("{e}", pluralSuffix);
        }

        return upg.desc;
    }

    App.performRebirth = function() {
        const points = App.getRebirthPoints();

        if (!confirm(`Wirklich Rebirth ausführen? Du erhältst +${App.formatNumber(points)} Rebirth-Punkte und setzt den normalen Fortschritt zurück.`)) {
            return;
        }

        state.rebirthPoints = state.rebirthPoints.plus(points);
        state.totalRebirths = state.totalRebirths.plus(1);
        state.lifetimeRebirthPoints = state.lifetimeRebirthPoints.plus(points);
        state.cookies = new Decimal(0);
        state.clickValue = new Decimal(1);
        state.clickBonus = new Decimal(0);
        state.clickMultiplier = new Decimal(1);

        for (const key in factoryData) {
            factoryData[key].amount = new Decimal(0);
            factoryData[key].multiplier = new Decimal(1);
            factoryData[key].price = new Decimal(factoryData[key].basePrice);
        }

        for (const key in upgradeData) {
            const upg = upgradeData[key];
            upg.bought = false;
            if (upg.dom.btn) {
                upg.dom.btn.remove();
                upg.dom.btn = null;
            }
        }

        visibleupgrades.clear();
        App.updateUI();
        App.saveGame();
        App.updateRebirthTree();
        showOverlay(App.elements.rebirthTreeOverlay);
        App.centerRebirthTree();
    };

    App.updateUI = function() {
        App.elements.cookieDisplay.innerText = App.formatNumber(state.cookies);
        App.elements.cpsDisplay.innerText = App.formatValue(App.getFactoryCPS());
        const rebirthMultiplier = App.getRebirthMultiplier();

        const rebirthBonusPercent = state.lifetimeRebirthPoints.times(App.rebirthConfig.bonusPerPoint).times(100).round(0, 0);
        const potentialGain = App.getRebirthPoints();
        App.elements.rebirthInfo.innerText = `Rebirth: ${App.formatNumber(state.lifetimeRebirthPoints)} Punkte (+${App.formatNumber(rebirthBonusPercent)}%)`;
        App.elements.rebirthBtn.innerText = `Rebirth (+${App.formatNumber(potentialGain)})`;
        App.elements.rebirthBtn.disabled = potentialGain.lte(0);

        for (const key in factoryData) {
            const upg = factoryData[key];
            const currentCPS = upg.cps.times(upg.multiplier).times(rebirthMultiplier);

            upg.dom.amount.innerText = App.formatNumber(upg.amount);
            upg.dom.price.innerText = App.formatNumber(upg.price);
            upg.dom.desc.innerText = `+${App.formatValue(currentCPS)} Cookies/s`;
            upg.dom.btn.disabled = state.cookies.lt(upg.price);
        }

        if (App.elements.upgradePopup.style.display === 'flex') {
            updateUpgradePopupButton();
        }

        checkUpgradeUnlocks();
    };

    function updateUpgradePopupButton() {
        const selectedUpgrade = currentUpgradeToBuy ? upgradeData[currentUpgradeToBuy] : null;
        App.elements.confirmUpgradeBuy.disabled = !selectedUpgrade || state.cookies.lt(selectedUpgrade.price);
    }

    function checkUpgradeUnlocks() {
        for (const key in upgradeData) {
            const upg = upgradeData[key];
            
            if (upg.bought) continue;

            const shouldBeVisible = visibleupgrades.has(key) || state.cookies.gte(upg.price.times(0.8));

            if (shouldBeVisible && !upg.dom.btn) {
                const btn = document.createElement('button');
                btn.className = 'upgrade-unlock-btn';
                btn.innerHTML = `<img src="${upg.icon}" class="btn-icon">`;

                App.elements.upgradeContainer.appendChild(btn);
                visibleupgrades.add(key);
                upg.dom.btn = btn;

                btn.addEventListener('click', () => {
                    currentUpgradeToBuy = key;
                    App.elements.upPopName.innerText = upg.name;
                    App.elements.upPopIcon.src = upg.icon;
                    App.elements.upPopDesc.innerText = getUpgradeDescription(upg);
                    App.elements.upPopPriceBtn.innerText = App.formatNumber(upg.price);
                    updateUpgradePopupButton();
                    showOverlay(App.elements.upgradePopup);
                });
            }
        }
    }

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

    App.applyUpgrade = function(key, restore = false) {
        const upg = upgradeData[key];
        if (!upg || upg.bought || (!restore && state.cookies.lt(upg.price))) return;

        if (!restore) {
            state.cookies = state.cookies.minus(upg.price);
        }

        upg.bought = true;

        const factor = new Decimal(upg.factor || 2);
        const boost = new Decimal(upg.boost || 1);

        switch (upg.type) {
            case "clickBoost":
                state.clickBonus = state.clickBonus.plus(boost);
                break;
            
            case "clickMultiplier":
                state.clickMultiplier = state.clickMultiplier.times(factor);
                break;

            case "factoryMultiplier":
                factoryData[upg.target].multiplier = factoryData[upg.target].multiplier.times(factor);
                break;

            case "globalMultiplier":
                Object.keys(factoryData).forEach(m => {
                    factoryData[m].multiplier = factoryData[m].multiplier.times(factor);
                });
                state.clickMultiplier = state.clickMultiplier.times(factor);
                break;
        }

        if (upg.dom.btn) {
            upg.dom.btn.remove();
            upg.dom.btn = null;
        }
        visibleupgrades.delete(key);

        if (!restore) {
            App.updateUI();
            App.saveGame();
        }
    };

    App.applyRebirth = function(key, restore = false) {
        const rebirth = rebirthTreeData[key];
        if (!rebirth || rebirth.bought || (!restore && !(rebirth.parents || []).every(reqKey => rebirthTreeData[reqKey]?.bought))) return;

        if (!restore) {
            if (state.rebirthPoints.lt(rebirth.cost)) return;

            state.rebirthPoints = state.rebirthPoints.minus(rebirth.cost);
        }

        rebirth.bought = true;

        const factor = new Decimal(rebirth.factor || 1);
        const value = new Decimal(rebirth.value || 0);

        switch (rebirth.type) {
            case "clickBoost":
                state.clickBonus = state.clickBonus.plus(value);
                break;
            
            case "clickMultiplier":
                state.clickMultiplier = state.clickMultiplier.times(factor);
                break;

            case "factoryMultiplier":
                factoryData[rebirth.target].multiplier = factoryData[rebirth.target].multiplier.times(factor);
                break;

            case "globalMultiplier":
                Object.keys(factoryData).forEach(m => {
                    factoryData[m].multiplier = factoryData[m].multiplier.times(factor);
                });
                state.clickMultiplier = state.clickMultiplier.times(factor);
                break;
        }

        if (!restore) {
            App.updateUI();
            App.updateRebirthTree();
            App.saveGame();
        }
    };

    App.elements.cookieBtn.addEventListener('click', (e) => {
        const clickGain = App.getClickValue();
        state.cookies = state.cookies.plus(clickGain);
        state.lifetimeCookies = state.lifetimeCookies.plus(clickGain);
        App.updateUI();
        createParticle(e.clientX, e.clientY);
        createFloatingText(e.clientX, e.clientY, clickGain);
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cookie-particle';
        particle.style.backgroundImage = state.isWurstMode ? "url('img/Logo.png')" : "url('img/Keks.svg')";
        const dX = (Math.random() - 0.5) * 300;
        const dY = (Math.random() - 0.5) * 300;
        particle.style.left = `${x - 15}px`;
        particle.style.top = `${y - 15}px`;
        particle.style.setProperty('--x', `${dX}px`);
        particle.style.setProperty('--y', `${dY}px`);
        particle.style.setProperty('--r', `${Math.random() * 360}deg`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    function createFloatingText(x, y, value) {
        const text = document.createElement('div');
        text.className = 'click-value-float';
        text.innerText = `+${App.formatValue(value)}`;
        text.style.left = `${x}px`;
        text.style.top = `${y}px`;
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 1000);
    }

    App.elements.shopToggle.addEventListener('click', () => {
        const isOpen = App.elements.sidebar.classList.toggle('open');
        App.elements.shopIcon.src = isOpen ? 'img/Close.png' : 'img/Shop.png';
        App.elements.shopText.textContent = isOpen ? ' Schließen' : ' Shop';
    });

    const showOverlay = (o) => o.style.display = 'flex';
    const hideOverlay = (o) => o.style.display = 'none';

    App.elements.closeRebirthTree.addEventListener('click', () => hideOverlay(App.elements.rebirthTreeOverlay));
    App.elements.settingsBtn.addEventListener('click', () => showOverlay(App.elements.settingsOverlay));
    App.elements.closeSettings.addEventListener('click', () => hideOverlay(App.elements.settingsOverlay));

    App.elements.exportBtn.addEventListener('click', () => {
        App.elements.saveCodeField.value = btoa(JSON.stringify(App.getSaveData()));
        showOverlay(App.elements.savePopup);
    });

    App.elements.importBtn.addEventListener('click', () => showOverlay(App.elements.loadPopup));

    App.elements.confirmLoadBtn.addEventListener('click', () => {
        const code = App.elements.loadCodeField.value.trim();
        if (!code) return;
        try {
            const data = JSON.parse(atob(code));
            App.applySaveData(data);
            App.saveGame();
            hideOverlay(App.elements.loadPopup);
            hideOverlay(App.elements.settingsOverlay);
            alert("Spielstand geladen!");
        } catch (e) {
            alert("Ungültiger Code!");
        }
    });

    App.elements.resetBtn.addEventListener('click', () => {
        if (confirm("Wirklich alles löschen? Fortschritt geht verloren!")) {
            App.setResetting(true);
            localStorage.removeItem('kekslefant_save');
            location.reload();
        }
    });

    App.elements.rebirthBtn.addEventListener('click', App.performRebirth);

    [App.elements.closeSave, App.elements.closeLoad].forEach(btn => {
        btn.addEventListener('click', () => {
            hideOverlay(App.elements.savePopup);
            hideOverlay(App.elements.loadPopup);
        });
    });

    App.elements.closeUpgradePop.addEventListener('click', () => hideOverlay(App.elements.upgradePopup));
    App.elements.confirmUpgradeBuy.addEventListener('click', () => {
        if (currentUpgradeToBuy && state.cookies.gte(upgradeData[currentUpgradeToBuy].price)) {
            App.applyUpgrade(currentUpgradeToBuy);
            hideOverlay(App.elements.upgradePopup);
            currentUpgradeToBuy = null;
        }
    });

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === targetWord[inputBuffer.length]) inputBuffer += key;
        else inputBuffer = (key === 'w') ? 'w' : "";
        if (inputBuffer === targetWord) {
            state.isWurstMode = !state.isWurstMode;
            App.elements.cookieBtn.src = state.isWurstMode ? "img/Logo.png" : "img/Keks.svg";
            inputBuffer = "";
        }
    });

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

    setInterval(() => App.saveGame(), 30000);
    window.addEventListener('beforeunload', () => App.saveGame());

})(window.GameApp = window.GameApp || {});
