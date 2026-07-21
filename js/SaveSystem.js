(function(App) {
    'use strict';

    App.getSaveData = function() {
        return {
            stats: {
                cookies: App.state.cookies,
                rebirthPoints: App.state.rebirthPoints,
                // ...
            },
            // ...
        };
    };

    App.saveGame = function() {
        // Speichern über App.getSaveData()
    };

    App.loadGame = function() {
        // Laden
    };

})(window.GameApp = window.GameApp || {});
