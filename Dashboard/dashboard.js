// 🧠 Show the current user's name
const currentUser = localStorage.getItem("currentUser");
const userNameSpan = document.getElementById("user-name");

if (!currentUser) {
  // If no user is logged in, send back to login page
  window.location.href = "../Homepage/index.html";
} else {
  userNameSpan.textContent = currentUser;
}

// 🚪 Logout function
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../Homepage/index.html";
});

// 🎮 Navigate to game modes
function goToMode(modeFolder) {
  window.location.href = `../${modeFolder}/index.html`;
}

// 🏆 Navigate to leaderboard pages
function goToLeaderboard(type) {
  window.location.href = `../Leaderboards/${type}.html`;
}
