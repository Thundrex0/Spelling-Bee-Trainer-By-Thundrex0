// ✅ Check login
const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html";

// ✅ Initialize values
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
const startTime = Date.now();

// ✅ Initialize WordList with fallback
let WordList = window.WordList || [];
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

// === Letter selection and word filtering - DEBUG VERSION
function selectLetter(letter) {
  console.log("Letter clicked:", letter);
  console.log("WordList available:", Array.isArray(WordList));
  console.log("WordList length:", WordList ? WordList.length : 0);
  
  // Try multiple fallback options
  if (!Array.isArray(WordList) || WordList.length === 0) {
    console.log("WordList not found, trying fallbacks...");
    WordList = window.WordList || [];
    
    // If still not found, try to get from global scope
    if (!Array.isArray(WordList) || WordList.length === 0) {
      console.error("WordList is missing or not loaded!");
      heading.textContent = "Word list not loaded! Please refresh.";
      resetInfo();
      return;
    }
  }

  filteredWords = WordList.filter(word =>
    word.word && word.word.toLowerCase().startsWith(letter.toLowerCase())
  );

  console.log("Filtered words found:", filteredWords.length);
  console.log("First few filtered words:", filteredWords.slice(0, 3));

  if (filteredWords.length === 0) {
    heading.textContent = `No words found for "${letter}"`;
    resetInfo();
    feedback.textContent = `Try another letter. No words starting with "${letter}" found.`;
    feedback.style.color = "#ef4444";
    return;
  }

  currentIndex = 0;
  loadCurrentWord();
}

// === Load current word - DEBUG VERSION
function loadCurrentWord() {
  console.log("Loading current word...");
  console.log("filteredWords:", filteredWords);
  console.log("currentIndex:", currentIndex);
  
  if (!filteredWords || filteredWords.length === 0) {
    console.error("No filtered words available");
    heading.textContent = "No words loaded";
    return;
  }
  
  currentWord = filteredWords[currentIndex];
  console.log("Current word:", currentWord);
  
  if (!currentWord) {
    console.error("No current word at index:", currentIndex);
    heading.textContent = "Error loading word";
    return;
  }
  
  heading.textContent = `Spell the word! (${currentIndex + 1}/${filteredWords.length})`;
  input.value = "";
  feedback.textContent = "";
  meaningBox.textContent = currentWord.meaning || "---";
  posBox.textContent = currentWord.partOfSpeech || "---";
  
  console.log("Word loaded successfully:", currentWord.word);
}

// === Load next word
function loadNextWord() {
  if (!filteredWords.length) {
    feedback.textContent = "No words loaded. Select a letter first.";
    feedback.style.color = "#ef4444";
    return;
  }
  
  feedback.textContent = "";
  input.value = "";
  currentIndex = (currentIndex + 1) % filteredWords.length;
  loadCurrentWord();
}

// === Word check
function checkAnswer() {
  if (!currentWord) {
    feedback.textContent = "No word selected. Choose a letter first.";
    feedback.style.color = "#ef4444";
    return;
  }
  
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
    feedback.textContent = `❌ Incorrect! The correct spelling was "${currentWord.word}"`;
    feedback.style.color = "#ef4444";
    saveMistake(currentWord.word);
  }

  localStorage.setItem("streak", streak);
  const accuracy = Math.round((correctCount / totalAttempts) * 100);
  localStorage.setItem("accuracy", accuracy + "%");
}

// === Retry word
function retryWord() {
  if (!currentWord) {
    feedback.textContent = "No word to retry. Select a letter first.";
    feedback.style.color = "#ef4444";
    return;
  }
  feedback.textContent = "";
  input.value = "";
}

// === Show answer
function showAnswer() {
  if (!currentWord) {
    feedback.textContent = "No word selected. Choose a letter first.";
    feedback.style.color = "#ef4444";
    return;
  }
  feedback.textContent = `Answer: ${currentWord.word}`;
  feedback.style.color = "#f59e0b";
}

// === Play pronunciation
function playWord() {
  if (!currentWord || !currentWord.word) {
    feedback.textContent = "No word to pronounce. Select a letter first.";
    feedback.style.color = "#ef4444";
    return;
  }
  
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const utter = new SpeechSynthesisUtterance(currentWord.word);
  utter.lang = "en-US";
  utter.rate = 0.8;
  speechSynthesis.speak(utter);
}

// === Save data
function saveScore() {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;
  
  if (!users[username].scores) {
    users[username].scores = { section: 0 };
  }
  users[username].scores.section += 1;
  localStorage.setItem("users", JSON.stringify(users));
}

function saveMistake(word) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) return;

  if (!users[username].mistakes) {
    users[username].mistakes = [];
  }

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
