let mistakeWords = [];
let currentWord = null;
let currentIndex = 0;
const user = localStorage.getItem("username");

// DOM Elements
const heading = document.getElementById("word-heading");
const meaningBox = document.getElementById("word-meaning");
const posBox = document.getElementById("word-pos");
const input = document.getElementById("user-input");
const feedback = document.getElementById("feedback-text");

// Button Listeners
document.getElementById("check-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", nextWord);
document.getElementById("retry-btn").addEventListener("click", retryWord);
document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
document.getElementById("play-sound").addEventListener("click", playWord);
document.getElementById("remove-btn").addEventListener("click", removeWord);
document.getElementById("logout-btn").addEventListener("click", logout);

// Init
if (!user) {
  window.location.href = "../Homepage/index.html";
} else {
  loadMistakeWords();
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "../Homepage/index.html";
}

function loadMistakeWords() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user] || users[user].mistakes.length === 0) {
    heading.textContent = "No mistakes to review!";
    return;
  }

  // Filter actual word data
  mistakeWords = wordList.filter(word => users[user].mistakes.includes(word.word));
  currentIndex = 0;
  loadCurrentWord();
}

function loadCurrentWord() {
  currentWord = mistakeWords[currentIndex];
  heading.textContent = "Spell the word!";
  input.value = "";
  feedback.textContent = "";

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
  }
}

function nextWord() {
  feedback.textContent = "";
  input.value = "";

  currentIndex++;
  if (currentIndex >= mistakeWords.length) currentIndex = 0;

  loadCurrentWord();
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

function removeWord() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user]) return;

  const indexInMistakes = users[user].mistakes.indexOf(currentWord.word);
  if (indexInMistakes > -1) {
    users[user].mistakes.splice(indexInMistakes, 1);
    localStorage.setItem("users", JSON.stringify(users));
  }

  mistakeWords.splice(currentIndex, 1);
  if (mistakeWords.length === 0) {
    heading.textContent = "🎉 All mistakes reviewed!";
    meaningBox.textContent = "---";
    posBox.textContent = "---";
    input.value = "";
    feedback.textContent = "";
    return;
  }

  if (currentIndex >= mistakeWords.length) currentIndex = 0;
  loadCurrentWord();
}

function saveScore() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[user]) return;

  users[user].scores.review += 1;
  localStorage.setItem("users", JSON.stringify(users));
}
