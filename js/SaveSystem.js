function getSaveData() {
    return {
        stats: {
            cookies: state.cookies.toString(),
            rebirthPoints: state.rebirthPoints.toString(),
            totalRebirths: state.totalRebirths.toString(),
            lifetimeCookies: state.lifetimeCookies.toString(),
            lifetimeRebirthPoints: state.lifetimeRebirthPoints.toString()
        },
        factories: Object.keys(factoryData).reduce((all, key) => {
            all[key] = {
                amount: factoryData[key].amount.toString()
            };
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
        const loadedCookies = new Decimal(data.stats?.cookies || 0);

        state.cookies = loadedCookies;
        state.clickValue = new Decimal(1);
        state.clickBonus = new Decimal(0);
        state.clickMultiplier = new Decimal(1);
        state.rebirthPoints = new Decimal(data.stats?.rebirthPoints || 0);
        state.totalRebirths = new Decimal(data.stats?.totalRebirths || 0);
        state.lifetimeCookies =  new Decimal(data.stats?.lifetimeCookies || data.stats?.cookies || 0);
        state.lifetimeRebirthPoints = new Decimal(data.stats?.lifetimeRebirthPoints || data.stats?.rebirthPoints || 0);

        if (data.factories) {
            for (const key in data.factories) {
                if (factoryData[key]) {
                    const fData = data.factories[key];
                    factoryData[key].amount = new Decimal(fData.amount || 0);
                    factoryData[key].multiplier = new Decimal(1);
                    factoryData[key].price = factoryData[key].basePrice.times(
                        new Decimal(1.15).pow(parseInt(factoryData[key].amount.toString()))
                    ).round(0, 0);
                }
            }
        }

        for (const key in upgradeData) {
            upgradeData[key].bought = false;
        }

        if (data.upgrades?.bought) {
            data.upgrades.bought.forEach(key => {
                if (upgradeData[key]) {
                    applyUpgrade(key, true);
                }
            });
        }

        for (const key in rebirthTreeData) {
            rebirthTreeData[key].bought = false;
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
        console.error("Fehler beim Laden:", e);
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
    const savedData = localStorage.getItem('kekslefant_save');
    if (savedData) applySaveData(JSON.parse(savedData));
}