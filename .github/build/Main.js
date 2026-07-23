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

    function setVersionDisplay() {
        const versionEl = document.getElementById('app-version');
        if (versionEl) {
            versionEl.textContent = (window.GameApp && window.GameApp.VERSION) || 'unbekannt';
        }
    }

    async function initGame() {
        try {
            await loadScript('js/Version.js?v=BUILD_VERSION');
            await loadScript('js/Config.js?v=BUILD_VERSION');
            await loadScript('js/SaveSystem.js?v=BUILD_VERSION');
            await loadScript('js/InitMethods.js?v=BUILD_VERSION');
            await loadScript('js/Auth.js?v=BUILD_VERSION');
            await loadScript('js/Leaderboard.js?v=BUILD_VERSION');
            await loadScript('js/GameLogic.js?v=BUILD_VERSION');
            await loadScript('js/UpdateCheck.js?v=BUILD_VERSION');

            window.GameApp.initAll();
            setVersionDisplay();
            window.GameApp.initAuth().then(() => {
                window.GameApp.loadGame();
                window.GameApp.updateUI();
            });

        } catch (e) {
            console.error("Fehler beim Laden: ", e);
        }
    }

    initGame();
})();