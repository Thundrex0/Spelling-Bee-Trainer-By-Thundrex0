// ✅ Dynamically insert the username
const storedUsername = localStorage.getItem("username") || "User";
document.getElementById("username").textContent = storedUsername;

// ✅ Redirect buttons to correct mode pages
const modeButtons = {
  "Random Mode": "../Random Mode/index.html",
  "Section A-Z": "../Section Mode/index.html",
  "Review Mistakes": "../Review Mistakes/index.html",
  "Streak Mode": "../Streak Mode/index.html",
  "Random Leaderboard": "../Leaderboards/random.html",
  "Section Leaderboard": "../Leaderboards/section.html",
  "Review Leaderboard": "../Leaderboards/review.html",
  "Streak Leaderboard": "../Leaderboards/streak.html"
};


// Add event listeners to mode buttons
document.querySelectorAll(".dashboard-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.textContent.trim();
    const target = modeButtons[mode];
    if (target) window.location.href = `./${target}`;
  });
});

// ✅ Logout button clears session
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

// ✅ Toggle profile dropdown
const profileSection = document.querySelector(".profile-section");
profileSection.addEventListener("click", () => {
  profileSection.classList.toggle("active");
});

const usernameSpan = document.getElementById("username");
const dropdownStats = document.getElementById("dropdown-stats");
const profileIcon = document.querySelector(".profile-icon");

// Retrieve data from localStorage (or use fallback)
const username = localStorage.getItem("username") || "Guest";
const streak = localStorage.getItem("streak") || 0;
const accuracy = localStorage.getItem("accuracy") || "0%";
const timePlayed = localStorage.getItem("timePlayed") || "0h";

// Update welcome text
if (usernameSpan) {
  usernameSpan.textContent = username;
}

// Toggle dropdown
if (profileIcon && dropdownStats) {
  profileIcon.addEventListener("click", () => {
    dropdownStats.classList.toggle("show");
  });
}

// Inject stats
if (dropdownStats) {
  dropdownStats.innerHTML = `
    <p><strong>${username}</strong></p>
    <hr>
    <p>🔥 Streak: ${streak}</p>
    <p>🎯 Accuracy: ${accuracy}</p>
    <p>⏱️ Time Played: ${timePlayed}</p>
  `;
}
