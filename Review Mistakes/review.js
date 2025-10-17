const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html";

let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
let startTime = Date.now();

let mistakeWords = [];
let currentWord = null;
let currentIndex = 0;

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
loadMistakeWords();

function logout() {
  localStorage.removeItem("username");
  window.location.href = "../Homepage/index.html";
}

function loadMistakeWords() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[username] || users[username].mistakes.length === 0) {
    heading.textContent = "No mistakes to review!";
    resetInfo();
    return;
  }

  mistakeWords = wordList.filter(word =>
    users[username].mistakes.includes(word.word)
  );

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
  }

  // Save stats
  localStorage.setItem("streak", streak);
  const accuracy = Math.round((correctCount / totalAttempts) * 100);
  localStorage.setItem("accuracy", accuracy + "%");
}

function nextWord() {
  feedback.textContent = "";
  input.value = "";

  currentIndex = (currentIndex + 1) % mistakeWords.length;
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
  if (!users[username]) return;

  const index = users[username].mistakes.indexOf(currentWord.word);
  if (index !== -1) {
    users[username].mistakes.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
  }

  mistakeWords.splice(currentIndex, 1);
  if (mistakeWords.length === 0) {
    heading.textContent = "🎉 All mistakes reviewed!";
    resetInfo();
    return;
  }

  currentIndex = currentIndex % mistakeWords.length;
  loadCurrentWord();
}

function saveScore() {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[username]) return;

  users[username].scores.review += 1;
  localStorage.setItem("users", JSON.stringify(users));
}

function resetInfo() {
  meaningBox.textContent = "---";
  posBox.textContent = "---";
  input.value = "";
  feedback.textContent = "";
}

// ✅ Save time played when user leaves
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
    case "ArrowRight":
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
