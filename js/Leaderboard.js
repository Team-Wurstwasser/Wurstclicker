(function(App) {
    'use strict';

    const leaderboardElements = {
        toggleBtn: document.getElementById('leaderboard-toggle'),
        overlay: document.getElementById('leaderboard-overlay'),
        closeBtn: document.getElementById('close-leaderboard'),
        list: document.getElementById('leaderboard-list')
    };

    function loadLeaderboard() {
        supabaseClient
            .from('v_leaderboard')
            .select('username, best_score')
            .order('best_score', { ascending: false })
            .limit(50)
            .then(({ data, error }) => {
                if (error) {
                    return;
                }

                leaderboardElements.list.innerHTML = '';
                data.forEach(entry => {
                    const li = document.createElement('li');
                    const scoreText = App.formatNumber(new Decimal(entry.best_score || 0));
                    li.textContent = `${entry.username || 'Unbekannt'} – ${scoreText} Cookies`;
                    leaderboardElements.list.appendChild(li);
                });
            });
    }

    leaderboardElements.toggleBtn?.addEventListener('click', () => {
        loadLeaderboard();
        App.showOverlay(leaderboardElements.overlay);
    });

    leaderboardElements.closeBtn?.addEventListener('click', () => {
        App.hideOverlay(leaderboardElements.overlay);
    });

})(window.GameApp = window.GameApp || {});