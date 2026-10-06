
const DashboardModule = {
    updateStats: function() {
        const history = appState.history;
        const totalTests = history.length;
        document.getElementById('stat-total-tests').textContent = totalTests;

        let totalCorrect = 0;
        let totalWrong = 0;
        let sumScores = 0;

        history.forEach(item => {
            totalCorrect += item.correct;
            totalWrong += item.wrong;
            sumScores += item.score;
        });

        document.getElementById('stat-total-correct').textContent = totalCorrect;
        document.getElementById('stat-total-wrong').textContent = totalWrong;
        const avg = totalTests > 0 ? (sumScores / totalTests).toFixed(1) : "0.0";
        document.getElementById('stat-avg-score').textContent = avg;

        const historyContainer = document.getElementById('history-list');
        if (history.length === 0) {
            historyContainer.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center">No tests completed yet. Start your morning routine!</p>`;
            return;
        }

        historyContainer.innerHTML = history.slice(-5).reverse().map(h => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        ${h.score}
                    </div>
                    <div>
                        <span class="font-bold text-slate-800">Score: ${h.score}/10</span>
                        <span class="text-xs text-slate-400 block">${h.date}</span>
                    </div>
                </div>
                <div class="flex items-center space-x-3 text-xs font-semibold">
                    <span class="text-emerald-600">✓ ${h.correct}</span>
                    <span class="text-rose-600">✗ ${h.wrong}</span>
                </div>
            </div>
        `).join('');
    },

    clearHistory: function() {
        if (confirm("Are you sure you want to clear your test history?")) {
            appState.history = [];
            saveAppData();
            showToast("History cleared.");
        }
    }
};

