function register() {
  const username = document.getElementById("usernameInput").value.trim().toLowerCase();
  const pin = document.getElementById("pin").value.trim();
  const message = document.getElementById("message");

  if (!username || !pin || pin.length !== 4 || isNaN(pin)) {
    message.textContent = "Enter a valid username and 4-digit PIN.";
    message.className = "message error";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    message.textContent = "Username already exists. Try logging in.";
    message.className = "message error";
    return;
  }

  users[username] = {
    pin,
    scores: {
      random: 0,
      section: 0,
      review: 0,
      streak: 0
    },
    mistakes: []
  };

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("username", username); // current session user

  // Default stats if not already saved
  if (!localStorage.getItem("accuracy")) localStorage.setItem("accuracy", "0%");
  if (!localStorage.getItem("streak")) localStorage.setItem("streak", "0");
  if (!localStorage.getItem("timePlayed")) localStorage.setItem("timePlayed", "0h");

  message.textContent = `Welcome, ${username}! Redirecting...`;
  message.className = "message success";

  setTimeout(() => {
    window.location.href = "https://thundrex0.github.io/Spelling-Bee-Trainer-By-Thundrex0/Dashboard/";
  }, 1000);
}

function login() {
  const username = document.getElementById("usernameInput").value.trim().toLowerCase();
  const pin = document.getElementById("pin").value.trim();
  const message = document.getElementById("message");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username]) {
    message.textContent = "User not found. Please register first.";
    message.className = "message error";
    return;
  }

  if (users[username].pin !== pin) {
    message.textContent = "Incorrect PIN.";
    message.className = "message error";
    return;
  }

  localStorage.setItem("username", username); // session user

  message.textContent = `Welcome back, ${username}! Redirecting...`;
  message.className = "message success";

  setTimeout(() => {
    window.location.href = "https://thundrex0.github.io/Spelling-Bee-Trainer-By-Thundrex0/Dashboard/";
  }, 1000);
}
