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

// DOM
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

// === Letter Buttons
function generateLetterButtons() {
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => selectLetter(letter));
    letterGrid.appendChild(btn);
  }
}

function selectLetter(letter) {
  filteredWords = WordList2.filter(word =>
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
  currentIndex = (currentIndex + 1) % filteredWords.length;
  loadCurrentWord();
}

// === Word Check
function checkAnswer() {
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
    feedback.textContent = "❌ Incorrect!";
    feedback.style.color = "#ef4444";
    saveMistake(currentWord.word);
  }

  // Save stats
  localStorage.setItem("streak", streak);
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

// === Save User Score
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

function resetInfo() {
  meaningBox.textContent = "---";
  posBox.textContent = "---";
  input.value = "";
  feedback.textContent = "";
}

// === Track Time Played
window.addEventListener("beforeunload", () => {
  const endTime = Date.now();
  const sessionMinutes = Math.floor((endTime - startTime) / 60000);
  const updatedTime = totalTime + sessionMinutes;
  localStorage.setItem("timePlayed", updatedTime + "m");
});
// === Keyboard Shortcuts & Audio Integration (Number-Based Version) ===
// Works instantly even when input is focused

/*
   ✅ Shortcut keys:
   Enter → Check Answer
   1 → Next Word
   2 → Retry Word
   3 → Show Answer
   4 → Play Sound
*/

// === Main Shortcut Handler ===
document.addEventListener("keydown", function (event) {
  // ✅ Enter key (works anywhere, even inside input)
  if (event.key === "Enter") {
    checkAnswer();
    event.preventDefault();
    return;
  }

  // ✅ Number shortcuts
  switch (event.key) {
    case "1":
      highlightButton("next-btn");
      loadNextWord();
      break;

    case "2":
      highlightButton("retry-btn");
      retryWord();
      break;

    case "3":
      highlightButton("show-answer-btn");
      showAnswer();
      break;

    case "4":
      highlightButton("play-sound");
      playWord();
      break;
  }
});

// === Visual Feedback ===
function highlightButton(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.classList.add("active-key");
  setTimeout(() => btn.classList.remove("active-key"), 200);
}

// === Play Word Function ===
function playWord() {
  if (!currentWord || !currentWord.word) return;
  if (speechSynthesis.speaking) return;

  const utter = new SpeechSynthesisUtterance(currentWord.word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// === Minimal CSS (add this to your stylesheet) ===
/*
.active-key {
  transform: scale(0.95);
  background-color: #4ade80;
  box-shadow: 0 0 10px #4ade80aa;
  transition: all 0.2s ease;
}
*/
