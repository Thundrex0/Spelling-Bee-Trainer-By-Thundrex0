// Load username from localStorage or default
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem('username') || "User";
  document.getElementById('username').textContent = username;

  // Optional: Setup event listeners for buttons
  setupButtons();
});

function setupButtons() {
  const buttons = document.querySelectorAll('.dashboard-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const label = btn.innerText.trim().toLowerCase();

      if (label.includes('random')) {
        window.location.href = "random.html"; // Replace with actual paths
      } else if (label.includes('section')) {
        window.location.href = "section.html";
      } else if (label.includes('review')) {
        window.location.href = "review.html";
      } else if (label.includes('streak')) {
        window.location.href = "streak.html";
      } else if (label.includes('view all')) {
        alert("Leaderboard feature coming soon! 🚀");
      }
    });
  });

  // Logout button logic
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem('username');
    window.location.href = "../index.html"; // Or your login/home page
  });
}
