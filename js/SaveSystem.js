(function(App) {
    'use strict';

    let lastSavedSnapshot = null;

    function getSaveData() {
        const currentState = App.getState();
        const factoryData = App.getFactoryData();
        const upgradeData = App.getUpgradeData();
        const rebirthTreeData = App.getRebirthTreeData();
        const visibleUpgrades = App.getVisibleUpgrades();

        return {
            stats: {
                cookies: currentState.cookies,
                rebirthPoints: currentState.rebirthPoints,
                totalRebirths: currentState.totalRebirths,
                lifetimeCookies: currentState.lifetimeCookies,
                lifetimeRebirthPoints: currentState.lifetimeRebirthPoints,
                created: currentState.created.getTime()
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
                visible: Array.from(visibleUpgrades)
            },
            rebirthTree: {
                bought: Object.keys(rebirthTreeData).filter(key => rebirthTreeData[key].bought)
            }
        };
    }

    function applySaveData(data) {
        if (!data) return;

        try {
            App.setLoadedState(data.stats || {});
            App.loadFactoriesState(data.factories);
            App.loadUpgradesState(
                data.upgrades?.bought || [], 
                data.upgrades?.visible || []
            );
            App.loadRebirthTreeState(data.rebirthTree?.bought || []);

        } catch (e) {
            return;
        }
    }

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
                        loadGameFromCloud();
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
                App.setLastSave(new Date(data.updated_at).getTime());

                App.updateUI();
            });
    }

    function isSaveEmpty() {
        const currentState = App.getState();
        const factoryData = App.getFactoryData();

        const hasNoCookies = currentState.lifetimeCookies.eq(0);
        const hasNoFactory = Object.values(factoryData).every(factory => factory.amount.eq(0));
        const hasNoRebirth = currentState.lifetimeRebirthPoints.eq(0);

        return hasNoCookies && hasNoFactory && hasNoRebirth;
    }

    App.saveGame = function() {
        if (App.isResetting() || !App.getCurrentUser()) return;

        if (isSaveEmpty()) {
            return;
        }

        saveGameToCloud();
    };

    App.loadGame = function() {
        if (!App.getCurrentUser()) return;
        loadGameFromCloud();
    };

    App.resetGame = function() {
        if (confirm("Wirklich alles löschen? Fortschritt geht verloren!")) {
            App.setResetting(true);
        
            if (App.getCurrentUser()) {
                supabaseClient.from('game_saves').delete().eq('user_id', App.getCurrentUser().id)
                    .then(() => {
                        location.reload();
                    })
                    .catch(() => {
                        location.reload(); 
                    });
            } else {
                location.reload();
            }
        }
    };

})(window.GameApp = window.GameApp || {});