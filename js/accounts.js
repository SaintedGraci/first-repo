// ============================
// ACCOUNTS PAGE LOGIC
// ============================

// Check logged in user
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Block access if not admin
if (!loggedInUser || loggedInUser.role !== "admin") {
  alert("Access denied. Admins only.");
  window.location.href = "index.html";
}

// ============================
// SHOW ADMIN DROPDOWN
// ============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminDropdown").classList.remove("d-none");
  loadAccounts();
});

// ============================
// STORAGE HELPERS
// ============================
function getAccounts() {
  return JSON.parse(localStorage.getItem("accounts")) || [];
}

function saveAccounts(accounts) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

// ============================
// LOAD ACCOUNTS TABLE
// ============================
function loadAccounts() {
  const accounts = getAccounts();
  const table = document.getElementById("accountsTable");
  table.innerHTML = "";

  accounts.forEach((acc, index) => {
    table.innerHTML += `
      <tr>
        <td>${acc.name}</td>
        <td>${acc.email}</td>
        <td>${acc.role}</td>
        <td>
          <span class="badge ${acc.verified ? "bg-success" : "bg-warning"}">
            ${acc.verified ? "Verified" : "Pending"}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editAccount(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAccount(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ============================
// OPEN ADD ACCOUNT MODAL
// ============================
function openAddAccount() {
  document.getElementById("modalTitle").textContent = "Add Account";
  document.getElementById("editIndex").value = "";

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("role").value = "user";

  // 🔒 FORCE UNVERIFIED ON CREATE
  document.getElementById("verified").checked = false;
  document.getElementById("verified").disabled = true;
}

// ============================
// SAVE ACCOUNT (ADD / EDIT)
// ============================
function saveAccount() {
  const accounts = getAccounts();
  const index = document.getElementById("editIndex").value;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const verifiedCheckbox = document.getElementById("verified");

  if (!firstName || !lastName || !email || !password) {
    alert("All fields are required");
    return;
  }

  const fullName = `${firstName} ${lastName}`;

  // ============================
  // ADD ACCOUNT
  // ============================
  if (index === "") {
    const emailExists = accounts.some(acc => acc.email === email);
    if (emailExists) {
      alert("Email already exists");
      return;
    }

    accounts.push({
      name: fullName,
      email,
      password,
      role,
      verified: false // 🔒 ALWAYS FALSE ON CREATE
    });
  }
  // ============================
  // EDIT ACCOUNT
  // ============================
  else {
    if (accounts[index].email === loggedInUser.email && role !== "admin") {
      alert("You cannot remove your own admin role.");
      return;
    }

    accounts[index] = {
      ...accounts[index],
      name: fullName,
      email,
      password,
      role,
      verified: verifiedCheckbox.checked // allowed ONLY on edit
    };
  }

  saveAccounts(accounts);
  loadAccounts();

  bootstrap.Modal.getInstance(
    document.getElementById("accountModal")
  ).hide();
}

// ============================
// EDIT ACCOUNT
// ============================
function editAccount(index) {
  const acc = getAccounts()[index];

  document.getElementById("modalTitle").textContent = "Edit Account";
  document.getElementById("editIndex").value = index;

  const names = acc.name.split(" ");
  document.getElementById("firstName").value = names[0];
  document.getElementById("lastName").value = names.slice(1).join(" ");
  document.getElementById("email").value = acc.email;
  document.getElementById("password").value = acc.password;
  document.getElementById("role").value = acc.role;

  // 🔓 ALLOW VERIFY ON EDIT
  document.getElementById("verified").checked = acc.verified;
  document.getElementById("verified").disabled = false;

  new bootstrap.Modal(
    document.getElementById("accountModal")
  ).show();
}

// ============================
// DELETE ACCOUNT
// ============================
function deleteAccount(index) {
  const accounts = getAccounts();
  const accountToDelete = accounts[index];
  
  // store here the acc for index to use in confirm delete 
  window.deleteAccountIndex = index;
  window.deleteAccountEmail = accountToDelete.email;

 
  // find the index of the current user 
  const currentUserIndex = accounts.findIndex(
    acc => acc.email === loggedInUser.email
  );
  
  if (index === currentUserIndex) {
    alert("You cannot delete your own account.");
    return;
  }

  //prevemt deletion of the last admin account
  if (accountToDelete.role === "admin") {
    const adminCount = accounts.filter(acc => acc.role === "admin").length;
    
    if (adminCount === 2) {
      alert(
        "Cannot delete this account you choose. " +
        accountToDelete.email +
        " is the last admin in the system beside you. " +
        "Promote another user to admin before deleting this account."
      );
      return;
    }
  }

  // Show Bootstrap confirmation modal
  document.getElementById("deleteConfirmEmail").textContent = accountToDelete.email;
  new bootstrap.Modal(
    document.getElementById("deleteConfirmModal")
  ).show();
}

// ============================
// CONFIRM DELETE ACCOUNT
// ============================
function confirmDeleteAccount() {
  const accounts = getAccounts();
  const index = window.deleteAccountIndex;

  accounts.splice(index, 1);
  saveAccounts(accounts);
  loadAccounts();

  // Close modal
  bootstrap.Modal.getInstance(
    document.getElementById("deleteConfirmModal")
  ).hide();

  // Clear stored values
  window.deleteAccountIndex = null;
  window.deleteAccountEmail = null;
}

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
