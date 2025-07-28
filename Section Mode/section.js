const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html"; // Ensure only logged-in users play
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let startTime = Date.now();

// === GLOBAL STATE ===
let filteredWords = [];
let currentWord = null;
let currentIndex = 0;
let user = localStorage.getItem("currentUser");

// DOM ELEMENTS
const letterGrid = document.getElementById("letter-grid");
const input = document.getElementById("user-input");
const meaningBox = document.getElementById("word-meaning");
const posBox = document.getElementById("word-pos");
const heading = document.getElementById("word-heading");
const feedback = document.getElementById("feedback-text");

// === INITIAL LOAD ===
if (!user) {
  window.location.href = "../Homepage/index.html";
} else {
  generateLetterButtons();
}

// === LOGOUT ===
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../Homepage/index.html";
});

// === BUTTON ACTIONS ===
document.getElementById("check-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", loadNextWord);
document.getElementById("retry-btn").addEventListener("click", retryWord);
document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
document.getElementById("play-sound").addEventListener("click", playWord);

// === GENERATE A–Z BUTTONS ===
function generateLetterButtons() {
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => selectLetter(letter));
    letterGrid.appendChild(btn);
  }
}

// === FILTER AND LOAD ===
function selectLetter(letter) {
  filteredWords = wordList.filter(word => word.word.toLowerCase().startsWith(letter.toLowerCase()));
  if (filteredWords.length === 0) {
    heading.textContent = `No words found for ${letter}`;
    resetInfo();
    return;
  }
  currentIndex = 0;
  loadCurrentWord();
}

function loadCurrentWord() {
  currentWord = filteredWords[currentIndex];
  heading.textContent = "Spell the word!";
  input.value = "";
  feedback.textContent = "";

  meaningBox.textContent = currentWord.meaning;
  posBox.textContent = currentWord.partOfSpeech;
}

function loadNextWord() {
  feedback.textContent = "";
  input.value = "";

  currentIndex++;
  if (currentIndex >= filteredWords.length) currentIndex = 0;

  loadCurrentWord();
}

// === CHECK, RETRY, ANSWER ===
function checkAnswer() {
  const userInput = input.value.trim().toLowerCase();
  const correct = currentWord.word.toLowerCase();

  if (!userInput) {
    feedback.textContent = "Please type a word!";
    feedback.style.color = "#ef4444";
    return;
  }

  if (userInput === correct) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#10b981";
    saveScore();
  } else {
    feedback.textContent = "❌ Incorrect!";
    feedback.style.color = "#ef4444";
    saveMistake(currentWord.word);
  }
  // Replace these conditions with your real logic
const isCorrect = userInput.toLowerCase() === correctAnswer.toLowerCase();

totalAttempts++;
if (isCorrect) {
  correctCount++;
  streak++;
} else {
  streak = 0;
}

// Save updated streak
localStorage.setItem("streak", streak);

// Update accuracy
const accuracy = Math.round((correctCount / totalAttempts) * 100);
localStorage.setItem("accuracy", accuracy + "%");

}

function retryWord() {
  feedback.textContent = "";
  input.value = "";
}

function showAnswer() {
  feedback.textContent = `The correct spelling is: ${currentWord.word}`;
  feedback.style.color = "#f59e0b";
}

function playWord() {
  const utter = new SpeechSynthesisUtterance(currentWord.word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// === STORAGE FUNCTIONS ===
function saveScore() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user]) return;

  users[user].scores.section += 1;
  localStorage.setItem("users", JSON.stringify(users));
}

function saveMistake(word) {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user]) return;

  if (!users[user].mistakes.includes(word)) {
    users[user].mistakes.push(word);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function resetInfo() {
  meaningBox.textContent = "---";
  posBox.textContent = "---";
  input.value = "";
  feedback.textContent = "";
}
const endTime = Date.now();
const sessionMinutes = Math.floor((endTime - startTime) / 60000);

let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
totalTime += sessionMinutes;

localStorage.setItem("timePlayed", totalTime + "m");
