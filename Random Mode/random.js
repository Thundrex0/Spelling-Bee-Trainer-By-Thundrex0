const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html"; // Ensure only logged-in users play
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let startTime = Date.now();

// === GLOBAL VARIABLES ===
let currentWord = null;
let currentIndex = null;
let usedIndexes = [];
let user = localStorage.getItem("username");

const input = document.getElementById("user-input");
const meaningBox = document.getElementById("word-meaning");
const posBox = document.getElementById("word-pos");
const heading = document.getElementById("word-heading");
const feedback = document.getElementById("feedback-text");

// === EVENT LISTENERS ===
document.getElementById("check-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", loadRandomWord);
document.getElementById("retry-btn").addEventListener("click", retryWord);
document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
document.getElementById("play-sound").addEventListener("click", playWord);
document.getElementById("logout-btn").addEventListener("click", logout);

// === INIT ON LOAD ===
if (!user) window.location.href = "../Homepage/index.html";
else loadRandomWord();

function logout() {
  localStorage.removeItem("username");
  window.location.href = "../Homepage/index.html";
}

// === MAIN FUNCTIONS ===

function loadRandomWord() {
  feedback.textContent = "";
  input.value = "";

  if (usedIndexes.length >= wordList.length) {
    usedIndexes = []; // reset after all words are shown once
  }

  do {
    currentIndex = Math.floor(Math.random() * wordList.length);
  } while (usedIndexes.includes(currentIndex));

  currentWord = wordList[currentIndex];
  usedIndexes.push(currentIndex);

  heading.textContent = "Spell the word!";
  meaningBox.textContent = currentWord.meaning;
  posBox.textContent = currentWord.partOfSpeech;
}

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

// === USER DATA STORAGE ===

function saveScore() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user]) return;

  users[user].scores.random += 1;
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
const endTime = Date.now();
const sessionMinutes = Math.floor((endTime - startTime) / 60000);

let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
totalTime += sessionMinutes;

localStorage.setItem("timePlayed", totalTime + "m");
