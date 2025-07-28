// Get elements
const usernameSpan = document.getElementById("currentUser");
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
    <p><strong>${currentUser}</strong></p>
    <hr>
    <p>🔥 Streak: ${streak}</p>
    <p>🎯 Accuracy: ${accuracy}</p>
    <p>⏱️ Time Played: ${timePlayed}</p>
  `;
}
