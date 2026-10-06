
const STORAGE_KEY_USER = 'morning_quiz_user';
const STORAGE_KEY_HISTORY = 'morning_quiz_history';

let appState = {
    user: {
        name: 'Scholar',
        avatar: 'https://placehold.co/100x100/indigo/white?text=Scholar'
    },
    history: [],
    overrideTimeWindow: false,
    currentQuiz: null
};

function loadAppData() {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
        try { appState.user = JSON.parse(savedUser); } catch(e){}
    }
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
        try { appState.history = JSON.parse(savedHistory); } catch(e){}
    }
    ProfileModule.updateUI();
    DashboardModule.updateStats();
    checkTimeWindow();
}

function saveAppData() {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appState.user));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(appState.history));
    ProfileModule.updateUI();
    DashboardModule.updateStats();
}

const router = {
    navigate: function(viewId) {
        if (viewId === 'test' && !isTimeWindowActive() && !appState.overrideTimeWindow) {
            showToast('Quiz is only available between 8:00 AM and 8:30 AM! (Use toggle bypass to test)', 'rose');
            return;
        }

        if (viewId !== 'test' && appState.currentQuiz && appState.currentQuiz.timerInterval) {
            clearInterval(appState.currentQuiz.timerInterval);
        }

        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`view-${viewId}`);
        if (target) target.classList.remove('hidden');

        ['dashboard', 'test', 'profile'].forEach(id => {
            const btn = document.getElementById(`nav-${id}`);
            if (btn) {
                if (id === viewId) {
                    btn.classList.add('bg-indigo-50', 'text-indigo-600');
                    btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
                } else {
                    btn.classList.remove('bg-indigo-50', 'text-indigo-600');
                    btn.classList.add('text-slate-600', 'hover:bg-slate-100');
                }
            }
        });

        window.scrollTo(0, 0);

        if (viewId === 'test') {
            QuizModule.init();
        }

        setTimeout(() => lucide.createIcons(), 50);
    }
};

function isTimeWindowActive() {
    if (appState.overrideTimeWindow) return true;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours === 8 && minutes >= 0 && minutes <= 30);
}

function checkTimeWindow() {
    const active = isTimeWindowActive();
    const banner = document.getElementById('time-window-banner');
    const iconBg = document.getElementById('time-status-icon-bg');
    const icon = document.getElementById('time-status-icon');
    const title = document.getElementById('time-status-title');
    const desc = document.getElementById('time-status-desc');
    const startBtn = document.getElementById('start-quiz-main-btn');

    if (active) {
        banner.className = "rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border bg-emerald-50/70 border-emerald-200 text-emerald-900";
        iconBg.className = "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-emerald-600";
        icon.setAttribute('data-lucide', 'sun');
        title.textContent = appState.overrideTimeWindow ? "Time Window Active (Bypass Enabled)" : "Morning Quiz Window is OPEN!";
        desc.textContent = "It's between 8:00 AM and 8:30 AM. Perfect time for your multiplication warmup!";
        startBtn.disabled = false;
        startBtn.className = "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-200 transition flex items-center space-x-2";
    } else {
        banner.className = "rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border bg-amber-50/70 border-amber-200 text-amber-900";
        iconBg.className = "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-amber-600";
        icon.setAttribute('data-lucide', 'moon');
        title.textContent = "Outside Morning Window (8:00 AM - 8:30 AM)";
        desc.textContent = "Quiz is locked outside routine hours. Click 'Toggle Test Bypass' to practice anytime!";
        startBtn.disabled = true;
        startBtn.className = "px-4 py-2 bg-slate-300 text-slate-500 text-sm font-semibold rounded-xl cursor-not-allowed flex items-center space-x-2";
    }
    lucide.createIcons();
}

function toggleTimeOverride() {
    appState.overrideTimeWindow = !appState.overrideTimeWindow;
    checkTimeWindow();
    showToast(appState.overrideTimeWindow ? "Test bypass enabled! You can now take the quiz." : "Test bypass disabled.", "indigo");
}

function startQuiz() {
    if (!isTimeWindowActive() && !appState.overrideTimeWindow) {
        showToast('Quiz window closed (8:00 - 8:30 AM). Enable test bypass to play.', 'rose');
        return;
    }
    router.navigate('test');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.className = `fixed bottom-5 right-5 z-50 transform translate-y-0 opacity-100 transition-all duration-300 ${type === 'rose' ? 'bg-rose-600' : 'bg-slate-900'} text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-medium`;
    setTimeout(() => {
        toast.className = `fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 ${type === 'rose' ? 'bg-rose-600' : 'bg-slate-900'} text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-medium`;
    }, 3000);
}

document.getElementById('answer-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        QuizModule.submitAnswer();
    }
});

window.onload = function() {
    loadAppData();
    lucide.createIcons();
    setInterval(checkTimeWindow, 60000);
};

