(function(App) {
    'use strict';

    App.initShop = function() {
        App.elements.factoryContainer.innerHTML = '';

        for (const [key, data] of Object.entries(App.factoryConfig)) {
            // ... DOM-Erstellung bleibt gleich ...
            
            App.factoryData[key] = {
                ...data,
                amount: new Decimal(0),
                price: new Decimal(data.basePrice),
                multiplier: new Decimal(1),
                dom: {
                    btn: document.getElementById(`buy-${key}`),
                    price: document.getElementById(`${key}-price`),
                    amount: document.getElementById(`${key}-amount`),
                    desc: itemDiv.querySelector('.factory-desc')
                }
            };
            App.factoryData[key].dom.btn.addEventListener('click', () => App.buyFactory(key));
        }
    };

    App.initUpgrades = function() {
        for (const [key, data] of Object.entries(App.upgradeConfig)) {
            App.upgradeData[key] = {
                ...data,
                price: new Decimal(data.price),
                bought: false,
                dom: { btn: null }
            };
        }
    };

    App.initRebirthTree = function() {
        // Gleiches Prinzip mit App.rebirthTreeConfig und App.rebirthTreeData
    };

    App.initAll = function() {
        App.initShop();
        App.initUpgrades();
        App.initRebirthTree();
    };

})(window.GameApp = window.GameApp || {});
