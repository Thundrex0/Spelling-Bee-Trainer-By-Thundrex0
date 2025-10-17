// ✅ Check login
const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html";

// ✅ Initialize values
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
const startTime = Date.now();

let filteredWords = [];
let currentWord = null;
let currentIndex = 0;

// DOM elements
const letterGrid = document.getElementById("letter-grid");
const input = document.getElementById("user-input");
const meaningBox = document.getElementById("word-meaning");
const posBox = document.getElementById("word-pos");
const heading = document.getElementById("word-heading");
const feedback = document.getElementById("feedback-text");

// === INIT
generateLetterButtons();

// === Event Listeners
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

document.getElementById("check-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", loadNextWord);
document.getElementById("retry-btn").addEventListener("click", retryWord);
document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
document.getElementById("play-sound").addEventListener("click", playWord);

// === Generate Letter Buttons
function generateLetterButtons() {
  letterGrid.innerHTML = ""; // clear old buttons
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.classList.add("letter-btn");
    btn.addEventListener("click", () => selectLetter(letter));
    letterGrid.appendChild(btn);
  }
}

// === Letter selection and word filtering
function selectLetter(letter) {
  if (!Array.isArray(wordList)) {
    console.error("wordList is missing or not loaded!");
    return;
  }

  filteredWords = wordList.filter(word =>
    word.word.toLowerCase().startsWith(letter.toLowerCase())
  );

  if (filteredWords.length === 0) {
    heading.textContent = `No words found for ${letter}`;
    resetInfo();
    return;
  }

  currentIndex = 0;
  loadCurrentWord();
}

// === Load current word
function loadCurrentWord() {
  currentWord = filteredWords[currentIndex];
  if (!currentWord) return;
  heading.textContent = "Spell the word!";
  input.value = "";
  feedback.textContent = "";
  meaningBox.textContent = currentWord.meaning || "---";
  posBox.textContent = currentWord.partOfSpeech || "---";
}

// === Load next word
function loadNextWord() {
  if (!filteredWords.length) return;
  feedback.textContent = "";
  input.value = "";
  currentIndex = (currentIndex + 1) % filteredWords.length;
  loadCurrentWord();
}

// === Word check
function checkAnswer() {
  if (!currentWord) return;
  const userInput = input.value.trim().toLowerCase();
  const correct = currentWord.word.toLowerCase();

  if (!userInput) {
    feedback.textContent = "Please type a word!";
    feedback.style.color = "#ef4444";
    return;
  }

  const isCorrect = userInput === correct;
  totalAttempts++;

  if (isCorrect) {
    correctCount++;
    streak++;
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#10b981";
    saveScore();
  } else {
    streak = 0;
    feedback.textContent = `❌ Incorrect! The correct spelling was ${currentWord.word}`;
    feedback.style.color = "#ef4444";
    saveMistake(currentWord.word);
  }

  localStorage.setItem("streak", streak);
  const accuracy = Math.round((correctCount / totalAttempts) * 100);
  localStorage.setItem("accuracy", accuracy + "%");
}

// === Retry word
function retryWord() {
  feedback.textContent = "";
  input.value = "";
}

// === Show answer
function showAnswer() {
  if (!currentWord) return;
  feedback.textContent = `Answer: ${currentWord.word}`;
  feedback.style.color = "#f59e0b";
}

// === Play pronunciation
function playWord() {
  if (!currentWord || !currentWord.word) return;
  if (speechSynthesis.speaking) return;

  const utter = new SpeechSynthesisUtterance(currentWord.word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// === Save data
function saveScore() {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;
  users[username].scores.section += 1;
  localStorage.setItem("users", JSON.stringify(users));
}

function saveMistake(word) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;

  if (!users[username].mistakes.includes(word)) {
    users[username].mistakes.push(word);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// === Reset info boxes
function resetInfo() {
  meaningBox.textContent = "---";
  posBox.textContent = "---";
  input.value = "";
  feedback.textContent = "";
}

// === Track time played
window.addEventListener("beforeunload", () => {
  const endTime = Date.now();
  const sessionMinutes = Math.floor((endTime - startTime) / 60000);
  const updatedTime = totalTime + sessionMinutes;
  localStorage.setItem("timePlayed", updatedTime + "m");
});
