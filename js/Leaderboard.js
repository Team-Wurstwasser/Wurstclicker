const leaderboardElements = {
    toggleBtn: document.getElementById('leaderboard-toggle'),
    overlay: document.getElementById('leaderboard-overlay'),
    closeBtn: document.getElementById('close-leaderboard'),
    list: document.getElementById('leaderboard-list')
};

async function loadLeaderboard() {
    if (!leaderboardElements.list) return;

    const { data, error } = await supabaseClient
        .from('v_leaderboard') 
        .select('username, best_score')
        .order('best_score', { ascending: false })
        .limit(20);

    if (error) {
        return;
    }

    leaderboardElements.list.innerHTML = '';
    data.forEach(entry => {
        const li = document.createElement('li');
        const scoreText = typeof formatNumber === 'function'
            ? formatNumber(new Decimal(entry.best_score || 0))
            : entry.best_score;
        li.textContent = `${entry.username || 'Unbekannt'} – ${scoreText} Cookies`;
        leaderboardElements.list.appendChild(li);
    });
}

leaderboardElements.toggleBtn?.addEventListener('click', async () => {
    await loadLeaderboard();
    if (leaderboardElements.overlay) leaderboardElements.overlay.style.display = 'flex';
});

leaderboardElements.closeBtn?.addEventListener('click', () => {
    if (leaderboardElements.overlay) leaderboardElements.overlay.style.display = 'none';
});