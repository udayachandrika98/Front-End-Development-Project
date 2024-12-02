let settings = {
    numQuestions: 6,
    minRange: 1,
    maxRange: 10,
    operations: ["add"],
    timerDuration: 60,
    showAnswers: false,
};

let currentQuestion = 0;
let correctAnswers = 0;
let totalTimeTaken = 0;
let startTime;
let timerInterval;

// Page Elements
const settingsPage = document.getElementById("settings");
const quizPage = document.getElementById("quiz");
const resultsPage = document.getElementById("results");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitAnswerBtn = document.getElementById("submitAnswer");
const nextQuestionBtn = document.getElementById("nextQuestion");
const progress = document.getElementById("progress");
const timerDisplay = document.getElementById("timerDisplay");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("score");
const percentageScore = document.getElementById("percentageScore");
const timeSpentText = document.getElementById("timeSpent");
const restartQuizBtn = document.getElementById("restartQuiz");

document.getElementById("startQuiz").addEventListener("click", startQuiz);
submitAnswerBtn.addEventListener("click", submitAnswer);
nextQuestionBtn.addEventListener("click", nextQuestion);
restartQuizBtn.addEventListener("click", restartQuiz);

function startQuiz() {
    settings.numQuestions = parseInt(document.getElementById("numQuestions").value);
    settings.minRange = parseInt(document.getElementById("minRange").value);
    settings.maxRange = parseInt(document.getElementById("maxRange").value);
    settings.operations = Array.from(document.querySelectorAll(".operation:checked")).map(el => el.value);
    settings.timerDuration = parseInt(document.getElementById("timer").value);
    settings.showAnswers = document.getElementById("showAnswer").checked;

    settingsPage.classList.add("hidden");
    quizPage.classList.remove("hidden");

    currentQuestion = 0;
    correctAnswers = 0;
    totalTimeTaken = 0;
    generateQuestion();
}

function generateQuestion() {
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];
    const num1 = Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange;
    const num2 = Math.floor(Math.random() * (settings.maxRange - settings.minRange + 1)) + settings.minRange;

    questionText.textContent = `${num1} ${getOperationSymbol(operation)} ${num2}`;
    answerInput.value = "";
    feedback.classList.add("hidden");
    progress.textContent = `${currentQuestion + 1} / ${settings.numQuestions}`;
    
    startTime = Date.now();

    if (settings.timerDuration > 0) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function getOperationSymbol(operation) {
    switch (operation) {
        case "add": return "+";
        case "sub": return "-";
        case "mul": return "*";
        case "div": return "/";
    }
}

function updateTimer() {
    const timeLeft = settings.timerDuration - Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        nextQuestionBtn.classList.remove("hidden");
    }
}

function submitAnswer() {
    const answer = parseFloat(answerInput.value);
    const [num1, operation, num2] = questionText.textContent.split(" ");
    let correctAnswer;

    switch (operation) {
        case "+":
            correctAnswer = parseFloat(num1) + parseFloat(num2);
            break;
        case "-":
            correctAnswer = parseFloat(num1) - parseFloat(num2);
            break;
        case "*":
            correctAnswer = parseFloat(num1) * parseFloat(num2);
            break;
        case "/":
            correctAnswer = parseFloat(num1) / parseFloat(num2);
            break;
    }

    if (answer === correctAnswer) {
        correctAnswers++;
        feedback.textContent = "Correct!";
        feedback.classList.remove("hidden");
    } else {
        feedback.textContent = `Incorrect! The correct answer was ${correctAnswer}`;
        feedback.classList.remove("hidden");
    }

    nextQuestionBtn.classList.remove("hidden");
    submitAnswerBtn.classList.add("hidden");
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < settings.numQuestions) {
        generateQuestion();
        submitAnswerBtn.classList.remove("hidden");
        nextQuestionBtn.classList.add("hidden");
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timerInterval);
    quizPage.classList.add("hidden");
    resultsPage.classList.remove("hidden");

    scoreText.textContent = `You got ${correctAnswers} out of ${settings.numQuestions} questions correct.`;
    percentageScore.textContent = `Your score: ${(correctAnswers / settings.numQuestions) * 100}%`;

    const timeSpent = (Date.now() - startTime) / 1000;
    timeSpentText.textContent = `Time spent: ${timeSpent.toFixed(2)} seconds`;

    // Chart generation (placeholder logic)
    const chart = new Chart(document.getElementById("chart"), {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [correctAnswers, settings.numQuestions - correctAnswers],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        },
    });
}

function restartQuiz() {
    resultsPage.classList.add("hidden");
    settingsPage.classList.remove("hidden");
}
