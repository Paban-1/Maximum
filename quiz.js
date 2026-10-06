
const QuizModule = {
    init: function() {
        const questions = [];
        for (let i = 0; i < 10; i++) {
            const a = Math.floor(Math.random() * 12) + 1;
            const b = Math.floor(Math.random() * 12) + 1;
            questions.push({ a, b, answer: a * b });
        }

        appState.currentQuiz = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            timerInterval: null,
            timeLeft: 30
        };

        this.renderQuestion();
    },

    renderQuestion: function() {
        const q = appState.currentQuiz;
        if (q.currentIndex >= q.questions.length) {
            this.finishQuiz();
            return;
        }

        const currentQ = q.questions[q.currentIndex];
        document.getElementById('quiz-progress-text').textContent = `Question ${q.currentIndex + 1} of 10`;
        document.getElementById('question-display').textContent = `${currentQ.a} × ${currentQ.b} = ?`;
        document.getElementById('question-feedback').textContent = '';
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();

        q.timeLeft = 30;
        document.getElementById('quiz-timer').textContent = `${q.timeLeft}s`;
        if (q.timerInterval) clearInterval(q.timerInterval);

        q.timerInterval = setInterval(() => {
            q.timeLeft--;
            document.getElementById('quiz-timer').textContent = `${q.timeLeft}s`;
            if (q.timeLeft <= 0) {
                clearInterval(q.timerInterval);
                this.handleTimeout();
            }
        }, 1000);
    },

    handleTimeout: function() {
        const q = appState.currentQuiz;
        q.wrongCount++;
        const fb = document.getElementById('question-feedback');
        fb.textContent = `Time's up! Correct answer was ${q.questions[q.currentIndex].answer} (-1 mark)`;
        fb.className = "h-6 text-sm font-semibold text-rose-600";

        setTimeout(() => {
            q.currentIndex++;
            this.renderQuestion();
        }, 1200);
    },

    submitAnswer: function() {
        const q = appState.currentQuiz;
        const inputVal = document.getElementById('answer-input').value.trim();
        if (inputVal === '') return;

        clearInterval(q.timerInterval);

        const userAnswer = parseInt(inputVal, 10);
        const currentQ = q.questions[q.currentIndex];
        const fb = document.getElementById('question-feedback');

        if (userAnswer === currentQ.answer) {
            q.correctCount++;
            fb.textContent = `Correct! (+1 mark)`;
            fb.className = "h-6 text-sm font-semibold text-emerald-600";
        } else {
            q.wrongCount++;
            fb.textContent = `Incorrect! Answer is ${currentQ.answer} (-1 mark)`;
            fb.className = "h-6 text-sm font-semibold text-rose-600";
        }

        setTimeout(() => {
            q.currentIndex++;
            this.renderQuestion();
        }, 1200);
    },

    finishQuiz: function() {
        const q = appState.currentQuiz;
        const finalScore = Math.max(0, q.correctCount - q.wrongCount);

        document.getElementById('result-score').textContent = finalScore;
        document.getElementById('result-correct').textContent = q.correctCount;
        document.getElementById('result-wrong').textContent = q.wrongCount;

        const historyItem = {
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            score: finalScore,
            correct: q.correctCount,
            wrong: q.wrongCount
        };
        appState.history.push(historyItem);
        saveAppData();

        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.getElementById('view-result').classList.remove('hidden');
        lucide.createIcons();
    }
};

