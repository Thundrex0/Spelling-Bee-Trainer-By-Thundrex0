const username = localStorage.getItem("username");
if (!username) window.location.href = "../index.html"; // Ensure only logged-in users play
let correctCount = 0;
let totalAttempts = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let startTime = Date.now();

// Utility function to format date as YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Load user data or initialize
function loadStreakData() {
  const data = JSON.parse(localStorage.getItem("streakData")) || {
    lastDate: "",
    currentStreak: 0,
    bestStreak: 0,
    totalDays: 0
  };

  const today = getTodayDate();

  if (data.lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (data.lastDate === yesterdayStr) {
      // Continuing streak
      data.currentStreak += 1;
    } else {
      // Broken streak
      data.currentStreak = 1;
    }

    data.lastDate = today;
    data.totalDays += 1;

    if (data.currentStreak > data.bestStreak) {
      data.bestStreak = data.currentStreak;
    }

    localStorage.setItem("streakData", JSON.stringify(data));
  }

  return data;
}

// Set data to HTML
function displayStreakData(data) {
  document.getElementById("currentStreak").textContent = `${data.currentStreak} Day${data.currentStreak > 1 ? 's' : ''}`;
  document.getElementById("bestStreak").textContent = `${data.bestStreak} Day${data.bestStreak > 1 ? 's' : ''}`;
  document.getElementById("totalDays").textContent = data.totalDays;
}

// Set username from localStorage (if saved before)
function loadUsername() {
  const name = localStorage.getItem("username") || "User";
  document.getElementById("username").textContent = name;
}

// Run everything
document.addEventListener("DOMContentLoaded", () => {
  const streakData = loadStreakData();
  displayStreakData(streakData);
  loadUsername();
});
const endTime = Date.now();
const sessionMinutes = Math.floor((endTime - startTime) / 60000);

let totalTime = parseInt(localStorage.getItem("timePlayed")) || 0;
totalTime += sessionMinutes;

localStorage.setItem("timePlayed", totalTime + "m");
