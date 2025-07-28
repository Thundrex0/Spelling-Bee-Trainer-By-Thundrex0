// ✅ Load username from localStorage
const username = localStorage.getItem("username") || "User";
document.getElementById("username").textContent = username;

// ✅ Profile dropdown stats setup
const profileIcon = document.querySelector(".profile-icon");
const dropdownStats = document.getElementById("profile-dropdown");

// Get real values from localStorage or fallback
const streak = localStorage.getItem("streak") || "0";
const accuracy = localStorage.getItem("accuracy") || "0%";
const timePlayed = localStorage.getItem("timePlayed") || "0h";

// Inject real stats into dropdown
dropdownStats.innerHTML = `
  <p><strong>${username}</strong></p>
  <hr>
  <p>🔥 Streak: ${streak}</p>
  <p>🎯 Accuracy: ${accuracy}</p>
  <p>⏱️ Time Played: ${timePlayed}</p>
`;

// ✅ Toggle dropdown on click
profileIcon.addEventListener("click", () => {
  dropdownStats.classList.toggle("show");
});

// ✅ Button redirects
const modeRedirects = {
  "Random Mode": "../Random Mode/index.html",
  "Section Mode": "../Section Mode/index.html",
  "Review Mistakes": "../Review Mistakes/index.html",
  "Streak Mode": "../Streak Mode/index.html",
  "leaderboards/random": "../Leaderboards/random.html",
  "leaderboards/section": "../Leaderboards/section.html",
  "leaderboards/review": "../Leaderboards/review.html",
  "leaderboards/streak": "../Leaderboards/streak.html",
};

// ✅ Listen to all buttons with data-mode
document.querySelectorAll(".dashboard-btn").forEach((button) => {
  const targetMode = button.getAttribute("data-mode");
  if (targetMode && modeRedirects[targetMode]) {
    button.addEventListener("click", () => {
      window.location.href = modeRedirects[targetMode];
    });
  }
});

// ✅ Logout button clears session
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});
