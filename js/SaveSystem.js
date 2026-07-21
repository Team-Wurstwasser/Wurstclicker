(function(App) {
    'use strict';

    let lastSavedSnapshot = null;

    function getSaveData() {
        const currentState = App.getState();
        return {
            stats: {
                cookies: currentState.cookies,
                rebirthPoints: currentState.rebirthPoints,
                totalRebirths: currentState.totalRebirths,
                lifetimeCookies: currentState.lifetimeCookies,
                lifetimeRebirthPoints: currentState.lifetimeRebirthPoints,
                created: currentState.created.getTime()
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

    function applySaveData(data) {
        if (!data) return;

        try {
            const stats = data.stats || {};

            App.setLoadedState(stats);

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
            return;
        }
    };

    function saveGameToCloud() {
        const payload = getSaveData();
        const payloadString = JSON.stringify(payload);

        if (payloadString === lastSavedSnapshot) {
            return;
        }

        supabaseClient
            .from('game_saves')
            .select('updated_at')
            .eq('user_id', App.getCurrentUser().id)
            .maybeSingle()
            .then(result => {
                const existing = result.data;
                const fetchError = result.error;

                if (fetchError) {
                    return;
                }

                if (existing?.updated_at) {
                    const remoteTime = new Date(existing.updated_at).getTime();

                    if (App.getLastSave() && remoteTime > App.getLastSave()) {
                        App.setLastSave(remoteTime);
                        return;
                    }
                }

                return supabaseClient
                    .from('game_saves')
                    .upsert({
                        user_id: App.getCurrentUser().id,
                        save_data: payload
                    })
                    .select('updated_at')
                    .single()
                    .then(saveResult => {
                        const saveError = saveResult.error;
                        const savedData = saveResult.data;

                        if (saveError) {
                            return;
                        }

                        lastSavedSnapshot = payloadString;

                        if (savedData?.updated_at) {
                            App.setLastSave(new Date(savedData.updated_at).getTime());
                        }
                    });
            });
    }

    function loadGameFromCloud() {
        supabaseClient
            .from('game_saves')
            .select('save_data, updated_at')
            .eq('user_id', App.getCurrentUser().id)
            .maybeSingle()
            .then(result => {
                const data = result.data;
                const error = result.error;

                if (error || !data) {
                    return;
                }

                applySaveData(data.save_data);
                lastSavedSnapshot = JSON.stringify(getSaveData());

                if (data.updated_at) {
                    App.setLastSave(new Date(data.updated_at).getTime());
                }

                App.updateUI();
            });
    };

    function isSaveEmpty() {
        const currentState = App.getState();
        const hasNoCookies = currentState.lifetimeCookies.eq(0);
        const hasNoFactory = Object.values(App.factoryData).every(factory => factory.amount.eq(0));
        const hasNoRebirth = currentState.lifetimeRebirthPoints.eq(0);

        return hasNoCookies && hasNoFactory && hasNoRebirth;
    }

    App.saveGame = function() {
        if (App.isResetting() || !App.getCurrentUser()) return;

        if (isSaveEmpty()) {
            return;
        }

        saveGameToCloud();
    }

    App.loadGame = function() {
        if (!App.getCurrentUser()) return;
        loadGameFromCloud();
    };

    App.resetGame = function() {
        if (confirm("Wirklich alles löschen? Fortschritt geht verloren!")) {
            App.setResetting(true);
        
            if (App.getCurrentUser()) {
                Promise.all([
                    supabaseClient.from('game_saves').delete().eq('user_id', App.getCurrentUser().id),
                    supabaseClient.from('leaderboard').delete().eq('user_id', App.getCurrentUser().id)
                ]).then((results) => {
                    location.reload();
                }).catch(() => {
                    location.reload(); 
                });
            } else {
                location.reload();
            }
        }
    }
})(window.GameApp = window.GameApp || {});