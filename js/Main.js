(function() {
    'use strict';

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = false;
            script.onload = () => resolve(url);
            script.onerror = () => reject(new Error('Fehler beim Laden: ' + url));
            document.head.appendChild(script);
        });
    }

    async function initGame() {
        try {
            await loadScript('js/Decimal.js');
            await loadScript('js/Config.js');
            await loadScript('js/GameLogic.js');
            await loadScript('js/SaveSystem.js');
            await loadScript('js/InitMethods.js');
            
            window.GameApp.initAll();
            window.GameApp.loadGame();
            window.GameApp.updateUI();
            
        } catch (e) {
            console.error("Fehler beim Laden: ", e);
        }
    }

    initGame();
})();