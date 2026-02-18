const questions = [
    {
        question: "What does SDLC stand for?",
        answers: [
            { text: "Software Development Life Cycle", correct: true },
            { text: "Software Design Logic Code", correct: false },
            { text: "System Data Life Cycle", correct: false },
            { text: "Server Deployment Line Code", correct: false }
        ]
    },
    {
        question: "Which of these is a Javascript runtime?",
        answers: [
            { text: "Django", correct: false },
            { text: "Node.js", correct: true },
            { text: "Laravel", correct: false },
            { text: "Spring Boot", correct: false }
        ]
    },
    {
        question: "What is the purpose of CSS?",
        answers: [
            { text: "To structure web pages", correct: false },
            { text: "To style web pages", correct: true },
            { text: "To program logic", correct: false },
            { text: "To handle database queries", correct: false }
        ]
    },
    {
        question: "Which HTTP method is used to update valid data?",
        answers: [
            { text: "GET", correct: false },
            { text: "POST", correct: false },
            { text: "PUT", correct: true },
            { text: "DELETE", correct: false }
        ]
    },
    {
        question: "What does DOM stand for?",
        answers: [
            { text: "Data Object Model", correct: false },
            { text: "Document Object Model", correct: true },
            { text: "Digital Object Method", correct: false },
            { text: "Document Oriented Module", correct: false }
        ]
    },
    {
        question: "Which is a NoSQL database?",
        answers: [
            { text: "PostgreSQL", correct: false },
            { text: "MySQL", correct: false },
            { text: "MongoDB", correct: true },
            { text: "Oracle", correct: false }
        ]
    },
    {
        question: "React uses a virtual ___ to optimize rendering.",
        answers: [
            { text: "DOM", correct: true },
            { text: "Browser", correct: false },
            { text: "Engine", correct: false },
            { text: "API", correct: false }
        ]
    },
    {
        question: "What is Git used for?",
        answers: [
            { text: "Hosting websites", correct: false },
            { text: "Version Control", correct: true },
            { text: "Running JavaScript", correct: false },
            { text: "Database Management", correct: false }
        ]
    },
    {
        question: "Which status code indicates 'Not Found'?",
        answers: [
            { text: "200", correct: false },
            { text: "500", correct: false },
            { text: "404", correct: true },
            { text: "403", correct: false }
        ]
    },
    {
        question: "What allows JS to handle async operations?",
        answers: [
            { text: "Event Loop", correct: true },
            { text: "Thread Pool", correct: false },
            { text: "Compiler", correct: false },
            { text: "Interpreter", correct: false }
        ]
    }
];

// ======================== CONSTANTS ========================
const STORAGE_USERS_KEY = 'fsdQuizUsers';
const STORAGE_SESSION_KEY = 'fsdQuizSession';
const STORAGE_BEST_SCORES_KEY = 'fsdQuizBestScores';
const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

// ======================== STATE ========================
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);
const timerDuration = 30;
let timeLeft = timerDuration;
let timerInterval;
let activeUser = null;

// ======================== DOM REFS ========================
const authContainer = document.getElementById('auth-container');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authMessage = document.getElementById('auth-message');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupNameInput = document.getElementById('signup-name');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');

const quizShell = document.getElementById('quiz-shell');
const activeUserName = document.getElementById('active-user-name');
const logoutButton = document.getElementById('logout-btn');
const quizNote = document.getElementById('quiz-note');
const questionProgress = document.getElementById('question-progress');
const answeredProgress = document.getElementById('answered-progress');
const progressDotsContainer = document.getElementById('progress-dots');
const timerDisplay = document.getElementById('timer-display');
const timeDisplay = document.getElementById('time-left');
const timerBar = document.getElementById('timer-bar');

const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const finishButton = document.getElementById('finish-btn');
const resultContainer = document.getElementById('result-container');
const scoreDisplay = document.getElementById('score-display');
const scoreText = document.getElementById('score-text');
const resultMessage = document.getElementById('result-message');
const restartButton = document.getElementById('restart-btn');

// ======================== PARTICLES ========================
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['rgba(102,126,234,0.15)', 'rgba(118,75,162,0.12)', 'rgba(165,180,252,0.1)', 'rgba(74,222,128,0.08)', 'rgba(251,191,36,0.08)'];
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 20 + 6;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}
createParticles();

// ======================== CONFETTI ========================
function launchConfetti() {
    const colors = ['#667eea', '#764ba2', '#4ade80', '#fbbf24', '#f87171', '#a5b4fc', '#22d3ee'];
    const shapes = ['square', 'circle'];
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        piece.style.background = color;
        piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
        piece.style.width = (Math.random() * 10 + 5) + 'px';
        piece.style.height = (Math.random() * 10 + 5) + 'px';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '-10px';
        const duration = (Math.random() * 2 + 1.5);
        piece.style.animation = `confettiFall ${duration}s ease-out forwards`;
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), (duration + 1) * 1000);
    }
}

// ======================== ANIMATED COUNTER ========================
function animateCounter(element, targetValue, suffix = '%', duration = 1200) {
    let start = 0;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * targetValue);
        element.innerText = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ======================== RIPPLE EFFECT ========================
function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ======================== AUTH HELPERS ========================
function getStoredUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || []; }
    catch { return []; }
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY)); }
    catch { return null; }
}

function saveSession(session) {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(STORAGE_SESSION_KEY);
}

function getBestScores() {
    try { return JSON.parse(localStorage.getItem(STORAGE_BEST_SCORES_KEY)) || {}; }
    catch { return {}; }
}

function saveBestScores(scores) {
    localStorage.setItem(STORAGE_BEST_SCORES_KEY, JSON.stringify(scores));
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `status-message ${type}`;
}

function clearAuthMessage() {
    authMessage.textContent = '';
    authMessage.className = 'status-message hidden';
}

function switchAuthMode(mode) {
    const isLogin = mode === 'login';
    loginTab.classList.toggle('active', isLogin);
    signupTab.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('hidden', !isLogin);
    signupForm.classList.toggle('hidden', isLogin);
    clearAuthMessage();
}

function validateSignupInput(name, email, password, confirmPassword) {
    if (!name.trim()) return "Please enter your full name.";
    if (!email.trim()) return "Please enter your email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
}

// ======================== QUIZ CONTROL ========================
function enterQuiz(user) {
    activeUser = user;
    activeUserName.textContent = user.name;
    authContainer.classList.add('hidden');
    quizShell.classList.remove('hidden');
    loginForm.reset();
    signupForm.reset();
    clearAuthMessage();
    startQuiz();
}

function leaveQuiz() {
    clearInterval(timerInterval);
    activeUser = null;
    quizShell.classList.add('hidden');
    authContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    switchAuthMode('login');
}

function updateProgressUI() {
    const answeredCount = userAnswers.filter(a => a !== null).length;
    questionProgress.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
    answeredProgress.textContent = `Answered ${answeredCount} / ${questions.length}`;
    renderProgressDots();
}

function renderProgressDots() {
    progressDotsContainer.innerHTML = '';
    questions.forEach((q, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        if (idx === currentQuestionIndex) dot.classList.add('active');
        if (userAnswers[idx] !== null) {
            const isCorrect = q.answers[userAnswers[idx]].correct;
            dot.classList.add('answered');
            if (!isCorrect) dot.classList.add('wrong');
        }
        dot.title = `Question ${idx + 1}`;
        dot.addEventListener('click', () => {
            currentQuestionIndex = idx;
            loadQuestion();
        });
        progressDotsContainer.appendChild(dot);
    });
}

function showQuizNote(message, holdForMs) {
    quizNote.textContent = message;
    quizNote.style.opacity = '1';
    if (holdForMs) {
        setTimeout(() => {
            if (quizNote.textContent === message) {
                quizNote.style.opacity = '0';
                setTimeout(() => { quizNote.textContent = ''; }, 300);
            }
        }, holdForMs);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    showQuizNote('Pick an answer before the timer runs out.', 2500);
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const question = questions[currentQuestionIndex];

    // Slide animation
    questionElement.classList.remove('question-slide');
    void questionElement.offsetWidth; // trigger reflow
    questionElement.classList.add('question-slide');

    questionElement.innerText = `${currentQuestionIndex + 1}. ${question.question}`;

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('answer-btn');

        // Only animate on fresh (unanswered) questions
        const isAnswered = userAnswers[currentQuestionIndex] !== null;
        if (!isAnswered) {
            button.classList.add('animate-in');
        }

        // Letter label
        const label = document.createElement('span');
        label.classList.add('answer-label');
        label.textContent = ANSWER_LABELS[index];
        button.appendChild(label);

        // Answer text
        const text = document.createElement('span');
        text.classList.add('answer-text');
        text.textContent = answer.text;
        button.appendChild(text);

        if (isAnswered) {
            if (index === userAnswers[currentQuestionIndex]) {
                button.classList.add(answer.correct ? 'correct-visual' : 'wrong-visual');
            } else if (answer.correct) {
                button.classList.add('correct-visual');
            }
            button.disabled = true;
        }

        button.addEventListener('click', (e) => {
            createRipple(e, button);
            selectAnswer(index, answer.correct);
        });
        answerButtonsElement.appendChild(button);
    });

    updateNavButtons();
    updateProgressUI();

    if (userAnswers[currentQuestionIndex] === null) {
        startTimer();
    } else {
        timeDisplay.innerText = '✓';
        timerBar.style.width = '0%';
        timerDisplay.classList.remove('low');
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    updateTimerUI();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleQuestionTimeout();
        }
    }, 1000);
}

function updateTimerUI() {
    timeDisplay.innerText = timeLeft;
    const percentage = (timeLeft / timerDuration) * 100;
    timerBar.style.width = `${percentage}%`;
    if (timeLeft <= 5) {
        timerBar.style.backgroundColor = '#f87171';
        timerDisplay.classList.add('low');
    } else {
        timerBar.style.backgroundColor = '#fbbf24';
        timerDisplay.classList.remove('low');
    }
}

function resetState() {
    clearInterval(timerInterval);
    answerButtonsElement.innerHTML = '';
}

function selectAnswer(selectedIndex, isCorrect) {
    clearInterval(timerInterval);
    userAnswers[currentQuestionIndex] = selectedIndex;
    const buttons = answerButtonsElement.querySelectorAll('.answer-btn');

    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === selectedIndex) {
            btn.classList.add(isCorrect ? 'correct-visual' : 'wrong-visual');
        }
        if (!isCorrect && questions[currentQuestionIndex].answers[idx].correct) {
            btn.classList.add('correct-visual');
        }
    });

    updateProgressUI();
    if (isCorrect) {
        showQuizNote('✅ Correct!', 1500);
    } else {
        const correctAnswer = questions[currentQuestionIndex].answers.find(a => a.correct);
        showQuizNote('❌ Wrong! Correct answer: ' + correctAnswer.text, 3000);
    }
}

function handleQuestionTimeout() {
    const buttons = answerButtonsElement.querySelectorAll('.answer-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (questions[currentQuestionIndex].answers[idx].correct) {
            btn.classList.add('correct-visual');
        }
    });

    showQuizNote('⏰ Time\'s up! Moving to next question...', 900);

    setTimeout(() => {
        if (resultContainer.classList.contains('hidden')) {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                showScore();
            }
        }
    }, 1000);
}

function updateNavButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.classList.add('hidden');
        finishButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        finishButton.classList.add('hidden');
    }
}

function showScore() {
    clearInterval(timerInterval);
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('result-entrance');

    let score = 0;
    userAnswers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== null && questions[questionIndex].answers[answerIndex].correct) {
            score++;
        }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Animated counter
    animateCounter(scoreDisplay, percentage, '%', 1500);
    scoreText.innerText = `${score}/${questions.length}`;

    // Confetti for good scores
    if (percentage >= 50) {
        setTimeout(launchConfetti, 400);
    }

    if (activeUser) {
        const bestScores = getBestScores();
        const key = normalizeEmail(activeUser.email);
        const previousBest = bestScores[key];
        if (!previousBest || percentage > previousBest) {
            bestScores[key] = percentage;
            saveBestScores(bestScores);
        }
        const best = bestScores[key] || percentage;
        resultMessage.innerText = `Great work, ${activeUser.name}! Your best score: ${best}%.`;
    } else {
        resultMessage.innerText = '';
    }
}

// ======================== EVENT LISTENERS ========================
loginTab.addEventListener('click', () => switchAuthMode('login'));
signupTab.addEventListener('click', () => switchAuthMode('signup'));

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearAuthMessage();
    const email = normalizeEmail(loginEmailInput.value);
    const password = loginPasswordInput.value;
    const users = getStoredUsers();
    const foundUser = users.find(u => normalizeEmail(u.email) === email && u.password === password);
    if (!foundUser) {
        showAuthMessage('Invalid email or password.', 'error');
        return;
    }
    const session = { name: foundUser.name, email: foundUser.email };
    saveSession(session);
    showAuthMessage('Login successful!', 'success');
    setTimeout(() => enterQuiz(session), 400);
});

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearAuthMessage();
    const name = signupNameInput.value.trim();
    const email = normalizeEmail(signupEmailInput.value);
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;
    const validationError = validateSignupInput(name, email, password, confirmPassword);
    if (validationError) {
        showAuthMessage(validationError, 'error');
        return;
    }
    const users = getStoredUsers();
    if (users.some(u => normalizeEmail(u.email) === email)) {
        showAuthMessage('Email already registered. Please log in.', 'error');
        switchAuthMode('login');
        loginEmailInput.value = email;
        loginPasswordInput.value = '';
        loginPasswordInput.focus();
        return;
    }
    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    const session = { name: newUser.name, email: newUser.email };
    saveSession(session);
    showAuthMessage('Account created! Starting quiz...', 'success');
    setTimeout(() => enterQuiz(session), 500);
});

Array.from(document.querySelectorAll('.toggle-pass-btn')).forEach(button => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.getAttribute('data-target'));
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.innerText = isPassword ? 'Hide' : 'Show';
    });
});

logoutButton.addEventListener('click', () => {
    clearSession();
    leaveQuiz();
});

prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

finishButton.addEventListener('click', showScore);
restartButton.addEventListener('click', () => {
    resultContainer.classList.remove('result-entrance');
    startQuiz();
});

// ======================== KEYBOARD NAVIGATION ========================
document.addEventListener('keydown', (e) => {
    // Only handle during quiz (not auth, not result)
    if (quizShell.classList.contains('hidden')) return;
    if (!resultContainer.classList.contains('hidden')) return;

    // Number keys 1-4 to select answer
    if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1;
        const buttons = answerButtonsElement.querySelectorAll('.answer-btn');
        if (buttons[idx] && !buttons[idx].disabled) {
            buttons[idx].click();
        }
    }

    // Arrow keys for navigation
    if (e.key === 'ArrowLeft' && !prevButton.disabled) {
        prevButton.click();
    }
    if (e.key === 'ArrowRight') {
        if (!nextButton.classList.contains('hidden')) {
            nextButton.click();
        }
    }

    // Enter to finish
    if (e.key === 'Enter' && !finishButton.classList.contains('hidden')) {
        finishButton.click();
    }
});

// ======================== INIT ========================
const existingSession = getSession();
if (existingSession && existingSession.name && existingSession.email) {
    enterQuiz(existingSession);
} else {
    leaveQuiz();
}