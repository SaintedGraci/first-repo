// ============================
// INDEX PAGE LOGIC
// ============================

// Ensure default admin exists
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

const adminExists = accounts.some(acc => acc.email === "admin@gmail.com");

if (!adminExists) {
  accounts.push({
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    verified: true
  });
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

// ============================
// LOGIN FUNCTION
// ============================
function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  // Find user
  const user = accounts.find(
    acc => acc.email === email && acc.password === password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // Verification check
  if (!user.verified) {
    alert(
      "Your account isn't verified.\n" +
      "You can't login yet.\n" +
      "Please wait until the admin verifies your registration."
    );
    return;
  }

  // Save logged-in user
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  alert(`Welcome, ${user.name}!`);

  // Close login modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("loginModal")
  );
  modal.hide();

  // Redirect based on role
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    // For now, redirect to index.html for regular users
    // since user.html doesn't exist yet
    window.location.href = "user.html";
  }
}

// ============================
// NAVBAR UPDATE AFTER LOGIN
// ============================
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    document.getElementById("loginItem").style.display = "none";
    document.getElementById("registerItem").style.display = "none";
    document.getElementById("logoutItem").classList.remove("d-none");
  }
}

// ============================
// LOGOUT FUNCTION
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", updateNavbar);