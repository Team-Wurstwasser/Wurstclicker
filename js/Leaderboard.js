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
            .then(({ data, error }) => {
                if (error || !data) {
                    return;
                }

                const sortedData = data.map(entry => ({
                    username: entry.username,
                    scoreDecimal: new Decimal(entry.best_score || 0)
                }))
                .sort((a, b) => b.scoreDecimal.comparedTo(a.scoreDecimal))
                .slice(0, 50);

                leaderboardElements.list.innerHTML = '';
                sortedData.forEach(entry => {
                    const li = document.createElement('li');
                    const scoreText = App.formatNumber(entry.scoreDecimal);
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
