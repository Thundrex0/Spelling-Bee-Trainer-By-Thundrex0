// ✅ Redirect if user not logged in
const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html";

// ✅ Initial values from localStorage
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
const startTime = Date.now();

let currentWord = null;
let usedIndexes = [];

const input = document.getElementById("user-input");
const meaningBox = document.getElementById("word-meaning");
const posBox = document.getElementById("word-pos");
const heading = document.getElementById("word-heading");
const feedback = document.getElementById("feedback-text");

// ✅ Event Listeners
document.getElementById("check-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", loadRandomWord);
document.getElementById("retry-btn").addEventListener("click", retryWord);
document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
document.getElementById("play-sound").addEventListener("click", playWord);
document.getElementById("logout-btn").addEventListener("click", logout);

// ✅ Load First Word
loadRandomWord();

// ✅ Load random word
function loadRandomWord() {
  feedback.textContent = "";
  input.value = "";

  if (usedIndexes.length >= wordList2.length) usedIndexes = [];

  let index;
  do {
    index = Math.floor(Math.random() * wordList2.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);
  currentWord = wordList2[index];

  heading.textContent = "Spell the word!";
  meaningBox.textContent = currentWord.meaning;
  posBox.textContent = currentWord.partOfSpeech;
}

// ✅ Check answer
function checkAnswer() {
  const userInput = input.value.trim().toLowerCase();
  const correct = currentWord.word.toLowerCase();

  if (!userInput) {
    feedback.textContent = "Please type a word!";
    feedback.style.color = "#ef4444";
    return;
  }

  totalAttempts++;
  if (userInput === correct) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#10b981";
    correctCount++;
    streak++;
    saveScore();
  } else {
    feedback.textContent = "❌ Incorrect!";
    feedback.style.color = "#ef4444";
    streak = 0;
    saveMistake(currentWord.word);
  }

  // Update accuracy and streak
  localStorage.setItem("streak", streak);
  const accuracy = Math.round((correctCount / totalAttempts) * 100);
  localStorage.setItem("accuracy", accuracy + "%");
}

// ✅ Retry same word
function retryWord() {
  feedback.textContent = "";
  input.value = "";
}

// ✅ Show correct answer
function showAnswer() {
  feedback.textContent = `The correct spelling is: ${currentWord.word}`;
  feedback.style.color = "#f59e0b";
}

// ✅ Play word audio
function playWord() {
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// ✅ Save score
function saveScore() {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;

  users[username].scores.random += 1;
  localStorage.setItem("users", JSON.stringify(users));
}

// ✅ Save mistake
function saveMistake(word) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;

  if (!users[username].mistakes.includes(word)) {
    users[username].mistakes.push(word);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// ✅ Logout
function logout() {
  localStorage.removeItem("username");
  window.location.href = "../index.html";
}

// ✅ Track time played automatically on unload
window.addEventListener("beforeunload", () => {
  const endTime = Date.now();
  const sessionMinutes = Math.floor((endTime - startTime) / 60000);
  const updatedTime = totalTime + sessionMinutes;
  localStorage.setItem("timePlayed", updatedTime + "m");
});
