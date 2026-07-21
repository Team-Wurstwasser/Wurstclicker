(function(App) {
    'use strict';

    App.getSaveData = function() {
        return {
            stats: {
                cookies: App.state.cookies,
                rebirthPoints: App.state.rebirthPoints,
                totalRebirths: App.state.totalRebirths,
                lifetimeCookies: App.state.lifetimeCookies,
                lifetimeRebirthPoints: App.state.lifetimeRebirthPoints,
                created: App.state.created.getTime(),
            },
            factories: Object.keys(App.factoryData).reduce((all, key) => {
                if (App.factoryData[key]) {
                    all[key] = {
                        amount: App.factoryData[key].amount
                    };
                }
                return all;
            }, {}),
            upgrades: {
                bought: Object.keys(App.upgradeData).filter(key => App.upgradeData[key].bought),
                visible: Array.from(App.visibleupgrades)
            },
            rebirthTree: {
                bought: Object.keys(App.rebirthTreeData).filter(key => App.rebirthTreeData[key].bought)
            }
        };
    };

    App.applySaveData = function(data) {
        if (!data) return;

        try {
            const stats = data.stats || {};

            App.state.cookies = new Decimal(stats.cookies || 0);
            App.state.rebirthPoints = new Decimal(stats.rebirthPoints || 0);
            App.state.totalRebirths = new Decimal(stats.totalRebirths || 0);
            App.state.lifetimeCookies = new Decimal(stats.lifetimeCookies || stats.cookies || 0);
            App.state.lifetimeRebirthPoints = new Decimal(stats.lifetimeRebirthPoints || stats.rebirthPoints || 0);  
            App.state.created = new Date(stats.created || Date.now());

            App.state.clickValue = new Decimal(1);
            App.state.clickBonus = new Decimal(0);
            App.state.clickMultiplier = new Decimal(1);

            if (data.factories) {
                for (const key in data.factories) {
                    if (App.factoryData[key] && data.factories[key]) {
                        const savedAmount = new Decimal(data.factories[key].amount).toNumber();

                        App.factoryData[key].amount = new Decimal(0);
                        App.factoryData[key].price = App.factoryData[key].basePrice;
                        App.factoryData[key].multiplier = new Decimal(1);

                        for (let i = 0; i < savedAmount; i++) {
                            App.buyFactory(key, true);
                        }
                    }
                }
            }

            for (const key in App.upgradeData) {
                if (App.upgradeData[key]) App.upgradeData[key].bought = false;
            }
            if (data.upgrades?.bought) {
                data.upgrades.bought.forEach(key => {
                    if (App.upgradeData[key]) {
                        App.applyUpgrade(key, true);
                    }
                });
            }

            for (const key in App.rebirthTreeData) {
                 if (App.rebirthTreeData[key]) App.rebirthTreeData[key].bought = false;
            }
            if (data.rebirthTree?.bought) {
                data.rebirthTree.bought.forEach(key => {
                    if (App.rebirthTreeData[key]) {
                        App.applyRebirth(key, true);
                    }
                });
            }
            
            App.visibleupgrades.clear();
            if (data.upgrades?.visible) {
                data.upgrades.visible.forEach(key => {
                    if (App.upgradeData[key] && !App.upgradeData[key].bought) {
                        App.visibleupgrades.add(key);
                    }
                });
            }
        } catch (e) {
            console.error("Fehler beim Laden des Spielstands:", e);
        }
    };

    App.saveGame = function() {
        if (App.isResetting()) return;

        const hasNoCookies = App.state.lifetimeCookies.eq(0);
        const hasNoFactory = Object.values(App.factoryData).every(factory => factory.amount.eq(0));
        const hasNoRebirth = App.state.lifetimeRebirthPoints.eq(0);

        if (hasNoCookies && hasNoFactory && hasNoRebirth) {
            return;
        }

        localStorage.setItem('kekslefant_save', JSON.stringify(App.getSaveData()));
    };

    App.loadGame = function() {
        try {
            const savedData = localStorage.getItem('kekslefant_save');
            if (savedData) {
                App.applySaveData(JSON.parse(savedData));
            }
        } catch (e) {
            console.error("LocalStorage konnte nicht gelesen werden:", e);
        }
    };
})(window.GameApp = window.GameApp || {});
