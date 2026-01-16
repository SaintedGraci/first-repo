document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  // Check duplicate email
  const exists = accounts.some(acc => acc.email === email);
  if (exists) {
    alert("Email already registered");
    return;
  }

  // 🚨 ALWAYS USER + UNVERIFIED
  const newAccount = {
    name,
    email,
    password,
    role: "user",
    verified: false
  };

  accounts.push(newAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));

  alert(
    "Registration successful!\n" +
    "Please wait for admin verification before logging in."
  );

  window.location.href = "index.html";
});
