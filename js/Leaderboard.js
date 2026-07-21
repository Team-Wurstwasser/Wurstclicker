(function(App) {
    'use strict';

    const leaderboardElements = {
        toggleBtn: document.getElementById('leaderboard-toggle'),
        overlay: document.getElementById('leaderboard-overlay'),
        closeBtn: document.getElementById('close-leaderboard'),
        list: document.getElementById('leaderboard-list')
    };

    function loadLeaderboard() {
        leaderboardElements.list.innerHTML = '<li class="loading">Lade Highscores...</li>';

        supabaseClient
            .from('leaderboard')
            .select('username, best_score')
            .order('best_score', { ascending: false })
            .limit(20)
            .then(({ data, error }) => {
                if (error) {
                    console.error('Fehler beim Laden des Leaderboards:', error);
                    leaderboardElements.list.innerHTML = '<li class="error">Fehler beim Laden der Daten.</li>';
                    return;
                }

                if (!data || data.length === 0) {
                    leaderboardElements.list.innerHTML = '<li>Noch keine Einträge vorhanden.</li>';
                    return;
                }

                const sortedData = data.map(entry => ({
                    username: entry.username || 'Unbekannt',
                    scoreDecimal: new Decimal(entry.best_score || 0)
                }))
                .sort((a, b) => b.scoreDecimal.comparedTo(a.scoreDecimal));

                leaderboardElements.list.innerHTML = '';

                sortedData.forEach((entry, index) => {
                    const li = document.createElement('li');
                    
                    const scoreText = App.formatNumber(entry.scoreDecimal);

                    li.textContent = `${entry.username} - ${scoreText} Cookies`;

                    leaderboardElements.list.appendChild(li);
                });
            })
            .catch(err => {
                leaderboardElements.list.innerHTML = '<li class="error">Verbindungsfehler.</li>';
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