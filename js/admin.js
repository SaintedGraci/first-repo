// ============================
// ADMIN PAGE LOGIC
// ============================

// Get logged in user
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// If no user OR not admin → redirect
if (!loggedInUser || loggedInUser.role !== "admin") {
  alert("Access denied. Admins only.");
  window.location.href = "index.html";
}

// ============================
// SHOW ADMIN DROPDOWN
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const adminDropdown = document.getElementById("adminDropdown");

  if (loggedInUser && loggedInUser.role === "admin") {
    adminDropdown.classList.remove("d-none");
  }

  // ============================
  // LOAD PROFILE DATA
  // ============================
  document.getElementById("profileName").textContent =
    "Name: " + loggedInUser.name;

  document.getElementById("profileEmail").textContent =
    loggedInUser.email;

  document.getElementById("profileRole").textContent =
    loggedInUser.role.toUpperCase();
});

// ============================
// LOGOUT FUNCTION
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
