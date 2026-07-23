(function(App) {
    'use strict';

    let updateAvailable = false;

    const updateElements = {
        overlay: document.getElementById('update-overlay'),
        reloadBtn: document.getElementById('reload-update-btn')
    };

    function showUpdatePopup() {
        if (updateAvailable) return;
        updateAvailable = true;
        App.showOverlay(updateElements.overlay);
    }

    function checkForUpdate() {
        if (updateAvailable || !App.VERSION || App.VERSION === 'dev') return;

        fetch(`https://api.github.com/repos/Team-Wurstwasser/Wurstclicker/commits/main`, {
            headers: { 'Accept': 'application/vnd.github+json' }
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                const latestSha = data?.sha;
                if (!latestSha) return;

                const latestShortSha = latestSha.substring(0, 7);

                if (latestShortSha !== App.VERSION) {
                    showUpdatePopup();
                }
            })
            .catch(() => {
            });
    }

    updateElements.reloadBtn?.addEventListener('click', () => location.reload());

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkForUpdate();
        }
    });

    setInterval(checkForUpdate, 300000);

    checkForUpdate();

})(window.GameApp = window.GameApp || {});