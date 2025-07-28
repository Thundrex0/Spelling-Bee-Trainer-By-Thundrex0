// ✅ Dynamically insert the username
const storedUsername = localStorage.getItem("username") || "User";
document.getElementById("username").textContent = storedUsername;

// ✅ Fallbacks to avoid null stats
const streak = localStorage.getItem("streak") || "0";
const accuracy = localStorage.getItem("accuracy") || "0%";
const timePlayed = localStorage.getItem("timePlayed") || "0h";

// ✅ Profile Dropdown Data Injection
const dropdownStats = document.getElementById("dropdown-stats");
if (dropdownStats) {
  dropdownStats.innerHTML = `
    <p><strong>${storedUsername}</strong></p>
    <hr>
    <p>🔥 Streak: ${streak}</p>
    <p>🎯 Accuracy: ${accuracy}</p>
    <p>⏱️ Time Played: ${timePlayed}</p>
  `;
}

// ✅ Dropdown toggle
const profileIcon = document.querySelector(".profile-icon");
if (profileIcon) {
  profileIcon.addEventListener("click", () => {
    dropdownStats.classList.toggle("show");
  });
}

// ✅ Logout function
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}

// ✅ Redirection handler
function goTo(modeName) {
  const modeButtons = {
    "Random Mode": "../Random Mode/index.html",
    "Section Mode": "../Section Mode/index.html",
    "Review Mistakes": "../Review Mistakes/index.html",
    "Streak Mode": "../Streak Mode/index.html",
    "leaderboards/random": "../Leaderboards/random.html",
    "leaderboards/section": "../Leaderboards/section.html",
    "leaderboards/review": "../Leaderboards/review.html",
    "leaderboards/streak": "../Leaderboards/streak.html"
  };

  const url = modeButtons[modeName];
  if (url) {
    window.location.href = url;
  } else {
    console.error("No matching URL found for:", modeName);
  }
}
document.querySelector('.profile-section').addEventListener('click', () => {
  document.getElementById("profile-dropdown").classList.toggle("show");
});
// ✅ Event listener for the profile section
