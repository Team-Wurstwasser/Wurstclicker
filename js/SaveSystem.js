function getSaveData() {
    return {
        stats: {
            cookies: state.cookies,
            rebirthPoints: state.rebirthPoints,
            totalRebirths: state.totalRebirths,
            lifetimeCookies: state.lifetimeCookies,
            lifetimeRebirthPoints: state.lifetimeRebirthPoints,
            created: state.created.getTime()
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
        return;
    }
}

function saveGameToCloud() {
    supabaseClient
        .from('game_saves')
        .select('save_data, updated_at')
        .eq('user_id', currentUser.id)
        .maybeSingle()
        .then(result => {
            const existing = result.data;
            const fetchError = result.error;

            if (fetchError) {
                return;
            }

            if (existing?.updated_at) {
                const remoteTime = new Date(existing.updated_at).getTime();

                if (state.lastSave && remoteTime > state.lastSave) {
                    state.lastSave = remoteTime;
                    return;
                }
            }

            const payload = getSaveData();

            return supabaseClient
                .from('game_saves')
                .upsert({
                    user_id: currentUser.id,
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

                    if (savedData?.updated_at) {
                        state.lastSave = new Date(savedData.updated_at).getTime();
                    }
                });
        });
}

function loadGameFromCloud() {
    if (!currentUser) return;

    supabaseClient
        .from('game_saves')
        .select('save_data, updated_at')
        .eq('user_id', currentUser.id)
        .maybeSingle()
        .then(result => {
            const data = result.data;
            const error = result.error;

            if (error) {
                return;
            }

            if (data && data.save_data) {
                applySaveData(data.save_data);
                state.lastSave = data.updated_at ? new Date(data.updated_at).getTime() : Date.now();
            }
        });
}

function isSaveEmpty() {
    const hasNoCookies = state.lifetimeCookies.eq(0);
    const hasNoFactory = Object.values(factoryData).every(factory => factory.amount.eq(0));
    const hasNoRebirth = state.lifetimeRebirthPoints.eq(0);

    return hasNoCookies && hasNoFactory && hasNoRebirth;
}

function saveGame() {
    if (isResetting || !currentUser) return;

    if (isSaveEmpty()) {
        return;
    }

    saveGameToCloud();
}


function loadGame() {
    if (!currentUser) return;
    loadGameFromCloud();
}

function resetGame() {
    if (confirm("Wirklich alles löschen? Fortschritt geht verloren!")) {
        isResetting = true;
        (async () => {
            if (currentUser) {
                await supabaseClient.from('game_saves').delete().eq('user_id', currentUser.id);
                await supabaseClient.from('leaderboard').delete().eq('user_id', currentUser.id);
            }
            location.reload();
        })();
    }
}