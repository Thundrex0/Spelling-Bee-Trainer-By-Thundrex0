// 🔐 REGISTER NEW USER
function register() {
  const username = document.getElementById("currentUser").value.trim().toLowerCase();
  const pin = document.getElementById("pin").value.trim();
  const message = document.getElementById("message");

  if (!username || !pin || pin.length !== 4 || isNaN(pin)) {
    message.textContent = "Enter a valid username and 4-digit PIN.";
    message.className = "message error";
    return;
  }

  // Get current user list from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    message.textContent = "Username already exists. Try logging in.";
    message.className = "message error";
    return;
  }

  // Create new user
  users[username] = {
    pin: pin,
    scores: {
      random: 0,
      section: 0,
      review: 0,
      streak: 0
    },
    mistakes: []
  };

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", username);

  message.textContent = `Welcome, ${currentUser}! Redirecting...`;
  message.className = "message success";

  setTimeout(() => {
    window.location.href =  "https://thundrex0.github.io/Spelling-Bee-Trainer-By-Thundrex0/Dashboard/";
  }, 1000);
}

// 🔓 LOGIN EXISTING USER
function login() {
  const username = document.getElementById("currentUser").value.trim().toLowerCase();
  const pin = document.getElementById("pin").value.trim();
  const message = document.getElementById("message");

  let users = JSON.parse(localStorage.getItem("users")) || {};

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

  localStorage.setItem("currentUser", username);

  message.textContent = `Welcome back, ${username}! Redirecting...`;
  message.className = "message success";

  setTimeout(() => {
    window.location.href =  "https://thundrex0.github.io/Spelling-Bee-Trainer-By-Thundrex0/Dashboard/";
  }, 1000);
}
