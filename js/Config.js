(function(App) {
    'use strict';

    App.factoryConfig = {
        huette: {
            name: "Keks Hütte",
            basePrice: new Decimal(15),
            cps: new Decimal(1),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Huette.png"
        },
        // ... restliche Configs
    };

    App.upgradeConfig = {
        click_1: { /* ... */ }
    };

    App.rebirthConfig = {
        baseCookies: new Decimal(1000000),
        bonusPerPoint: new Decimal(0.05),
        pointsMultiplier: new Decimal(1.15)
    };

    App.rebirthTreeConfig = {
        root: { /* ... */ }
    };

})(window.GameApp = window.GameApp || {});
