function getSaveData() {
    return {
        stats: {
            cookies: state.cookies,
            rebirthPoints: state.rebirthPoints,
            totalRebirths: state.totalRebirths,
            lifetimeCookies: state.lifetimeCookies,
            lifetimeRebirthPoints: state.lifetimeRebirthPoints,
            created: state.created.getTime(),
        },
        factories: Object.keys(factoryData).reduce((all, key) => {
            if (factoryData[key]) {
                all[key] = {
                    amount: factoryData[key].amount
                };
            }
            return all;
        }, {}),
        upgrades: {
            bought: Object.keys(upgradeData).filter(key => upgradeData[key].bought),
            visible: Array.from(visibleupgrades)
        },
        rebirthTree: {
            bought: Object.keys(rebirthTreeData).filter(key => rebirthTreeData[key].bought)
        }
    };
}

function applySaveData(data) {
    if (!data) return;

    try {
        const stats = data.stats || {};

        state.cookies = new Decimal(stats.cookies || 0);
        state.rebirthPoints = new Decimal(stats.rebirthPoints || 0);
        state.totalRebirths = new Decimal(stats.totalRebirths || 0);
        state.lifetimeCookies = new Decimal(stats.lifetimeCookies || stats.cookies || 0);
        state.lifetimeRebirthPoints = new Decimal(stats.lifetimeRebirthPoints || stats.rebirthPoints || 0);  
        state.created = new Date(stats.created || Date.now());

        state.clickValue = new Decimal(1);
        state.clickBonus = new Decimal(0);
        state.clickMultiplier = new Decimal(1);

        if (data.factories) {
            for (const key in data.factories) {
                if (factoryData[key] && data.factories[key]) {
                    const savedAmount = new Decimal(data.factories[key].amount).toNumber();

                    factoryData[key].amount = new Decimal(0);
                    factoryData[key].price = factoryData[key].basePrice;
                    factoryData[key].multiplier = new Decimal(1);

                    for (let i = 0; i < savedAmount; i++) {
                        buyFactory(key, true);
                    }
                }
            }
        }

        for (const key in upgradeData) {
            if (upgradeData[key]) upgradeData[key].bought = false;
        }
        if (data.upgrades?.bought) {
            data.upgrades.bought.forEach(key => {
                if (upgradeData[key]) {
                    applyUpgrade(key, true);
                }
            });
        }

        for (const key in rebirthTreeData) {
             if (rebirthTreeData[key]) rebirthTreeData[key].bought = false;
        }
        if (data.rebirthTree?.bought) {
            data.rebirthTree.bought.forEach(key => {
                if (rebirthTreeData[key]) {
                    applyRebirth(key, true);
                }
            });
        }
        
            visibleupgrades.clear();
            if (data.upgrades?.visible) {
                data.upgrades.visible.forEach(key => {
                    if (upgradeData[key] && !upgradeData[key].bought) {
                        visibleupgrades.add(key);
                    }
                });
        }
    } catch (e) {
        console.error("Fehler beim Laden des Spielstands:", e);
    }
}

function saveGame() {
    if (isResetting) return;

    const hasNoCookies = state.lifetimeCookies.eq(0);
    const hasNoFactory = Object.values(factoryData).every(factory => factory.amount.eq(0));
    const hasNoRebirth = state.lifetimeRebirthPoints.eq(0);

    if (hasNoCookies && hasNoFactory && hasNoRebirth) {
        return;
    }

    localStorage.setItem('kekslefant_save', JSON.stringify(getSaveData()));
}

function loadGame() {
    try {
        const savedData = localStorage.getItem('kekslefant_save');
        if (savedData) {
            applySaveData(JSON.parse(savedData));
        }
    } catch (e) {
        console.error("LocalStorage konnte nicht gelesen werden:", e);
    }
}