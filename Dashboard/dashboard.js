// ✅ Dynamically insert the username
const username = localStorage.getItem("username") || "User";
document.getElementById("username").textContent = username;


// ✅ Redirect buttons to correct mode pages
const modeButtons = {
  "Random Mode": "../Random Mode/",
  "Section A-Z": "../Section Mode/",
  "Review Mistakes": "../Review Mode/",
  "Streak Mode": "../Streak Mode/",
  "Random Leaderboard": "../Leaderboards/random.html",
  "Section Leaderboard": "../Leaderboards/section.html",
  "Review Leaderboard": "../Leaderboards/review.html",
  "Streak Leaderboard": "../Leaderboards/review.html"
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
