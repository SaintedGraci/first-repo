// ============================
// GENERAL LOGIC (all pages)
// ============================

// ----------------------------
// Mock accounts (fake accounts.txt)
// ----------------------------
const mockAccounts = [
  { name: "Master Admin", email: 'master@admin.com', password: 'master123', role: 'master', verified: true, isMaster: true },
  { name: "Test1", email: 'test1@gmail.com', password: 'test1234', role: 'admin', verified: false },
  { name: "Test2", email: 'test2@gmail.com', password: 'test5678', role: 'user', verified: false }
];


// Save mock accounts to localStorage if not already there
if (!localStorage.getItem('accounts')) {
  localStorage.setItem('accounts', JSON.stringify(mockAccounts));
}



// ----------------------------
// INDEX.HTML SPECIFIC LOGIC
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Make sure navbar shows correct links
  updateNavbar();
  // If page was opened with #login hash (for redirect from protected pages), show the login modal
  if (window.location.hash === '#login') {
    const loginModalEl = document.getElementById('loginModal');
    if (loginModalEl) {
      const loginModal = new bootstrap.Modal(loginModalEl);
      loginModal.show();
      // remove hash so reopening the page doesn't reopen the modal unexpectedly
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
});




// ----------------------------
// Login function
// ----------------------------
function login(email, password) {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // 🔐 STRICT verification check - NEW LOGIC
  // Only master accounts can login without verification
  // All other accounts (including admins) must be verified
  if (!user.isMaster && user.verified !== true) {
    alert("Your account is not verified by the admin yet.");
    return;
  }

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', user.email);
  localStorage.setItem('role', user.role);

  updateNavbar();

  alert(`Login successful! Role: ${user.role}`);

  // Master and admin accounts go to admin dashboard
  if (user.role === 'master' || user.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    const loginModalEl = document.getElementById('loginModal');
    const loginModal =
      bootstrap.Modal.getInstance(loginModalEl) ||
      new bootstrap.Modal(loginModalEl);
    loginModal.hide();
  }
}

// ----------------------------
// Handle login button click in modal
// ----------------------------
function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
}

// ----------------------------
// Logout function
// ----------------------------
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('role');

  alert("Logged out successfully!");
  window.location.href = 'index.html';
}


// ----------------------------
// Update navbar based on login status and role
// ----------------------------
function updateNavbar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const role = localStorage.getItem('role');

  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const adminDropdown = document.getElementById('adminDropdown');
  const roleLink = document.getElementById('roleLink');

  if (isLoggedIn === 'true') {
    // If logged in as admin, show a direct link back to admin dashboard on the public index
    if (loginLink) {
      if (role === 'admin') {
        loginLink.classList.remove('d-none');
        loginLink.textContent = 'Back to Admin Dashboard';
        loginLink.setAttribute('href', 'admin.html');
        loginLink.removeAttribute('data-bs-toggle');
        loginLink.removeAttribute('data-bs-target');
      } else {
        loginLink.classList.add('d-none');
      }
    }

    if (registerLink) registerLink.classList.add('d-none');
    if (logoutLink) logoutLink.classList.remove('d-none');

    if (roleLink) {
      roleLink.textContent = role.toUpperCase();
      roleLink.classList.remove('d-none');
    }

    if (role === 'admin') {
      if (adminDropdown) adminDropdown.classList.remove('d-none');
    } else {
      if (adminDropdown) adminDropdown.classList.add('d-none');
    }
  } else {
    // Not logged in: restore original login/register visibility and modal behavior
    if (loginLink) {
      loginLink.classList.remove('d-none');
      loginLink.textContent = 'Login';
      loginLink.setAttribute('data-bs-toggle', 'modal');
      loginLink.setAttribute('data-bs-target', '#loginModal');
      loginLink.setAttribute('href', '#');
    }

    if (registerLink) registerLink.classList.remove('d-none');
    if (logoutLink) logoutLink.classList.add('d-none');
    if (roleLink) roleLink.classList.add('d-none');
    if (adminDropdown) adminDropdown.classList.add('d-none');
  }
}

// ============================
// ADMIN.HTML LOGIC
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const currentEmail = localStorage.getItem('currentUser');
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(acc => acc.email === currentEmail);
  const role = localStorage.getItem('role');

  // Protect admin page
  if (window.location.pathname.endsWith('admin.html') && role !== 'admin' && role !== 'master') {
    alert('Access denied! Only admins can enter. login first.');
    // Redirect back to index and open the login modal
    window.location.href = 'index.html#login';
    return;
  }

  // Populate profile if elements exist
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const roleEl = document.getElementById('profileRole');

  if (user) {
    if (nameEl) nameEl.textContent = `Name: ${user.name || "N/A"}`;
    if (emailEl) emailEl.textContent = user.email;
    if (roleEl) roleEl.textContent = user.role.toUpperCase();
  }

  // Show admin dropdown only if logged in as admin
  const adminDropdown = document.getElementById('adminDropdown');
  const roleLink = document.getElementById('roleLink');
  if (role === 'admin' && adminDropdown) {
    adminDropdown.classList.remove('d-none');
    if (roleLink) roleLink.textContent = role.toUpperCase();
  }

  // Update navbar on page load
  updateNavbar();
});

// Show alert or redirect to edit page when Edit Profile button is clicked
const editProfileBtn = document.getElementById('editProfileBtn');
if (editProfileBtn) {
  editProfileBtn.addEventListener('click', () => {
    // Option 1: redirect to a separate edit profile page
    // window.location.href = 'edit-profile.html';

    // Option 2: alert (temporary, you can later show a modal)
    alert("You can now implement edit profile functionality here!");
  });
}








// ============================
// REGISTER.HTML LOGIC
// ============================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    if (accounts.some(acc => acc.email === email)) {
      alert("Email is already registered!");
      return;
    }

    // Check if this is the first account being created
    const existingAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const isFirstAccount = existingAccounts.length === 0;

    const newAccount = {
      name,
      email,
      password,
      role,
      verified: false,
      isMaster: isFirstAccount && role === 'admin' // First admin becomes master
    };

    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    alert("Registration successful!");
    window.location.href = 'index.html';
  });
}







// ----------------------------
// EMPLOYEES LOGIC
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const empForm = document.getElementById('employeeForm');
  const empTableBody = document.querySelector('#employeesTable tbody');

  let employees = JSON.parse(localStorage.getItem('employees')) || [];

  // Render employees table
  function renderEmployees() {
    empTableBody.innerHTML = '';
    employees.forEach((emp, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${emp.name}</td>
        <td>${emp.position}</td>
        <td>${emp.department}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEditModal(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${index})">Delete</button>
        </td>
      `;
      empTableBody.appendChild(tr);
    });
  }

  renderEmployees();

  // Add new employee
  empForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('empName').value.trim();
    const position = document.getElementById('empPosition').value.trim();
    const department = document.getElementById('empDept').value.trim();

    if (!name || !position || !department) return;

    employees.push({ name, position, department });
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    empForm.reset();
  });

  // Open Edit Modal
  window.openEditModal = function(index) {
    const emp = employees[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editName').value = emp.name;
    document.getElementById('editPosition').value = emp.position;
    document.getElementById('editDept').value = emp.department;

    const editModal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
    editModal.show();
  }

  // Save changes from modal
  window.saveEdit = function() {
    const index = document.getElementById('editIndex').value;
    employees[index].name = document.getElementById('editName').value.trim();
    employees[index].position = document.getElementById('editPosition').value.trim();
    employees[index].department = document.getElementById('editDept').value.trim();

    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();

    const editModalEl = document.getElementById('editEmployeeModal');
    const modalInstance = bootstrap.Modal.getInstance(editModalEl);
    modalInstance.hide();
  }

  // Delete employee
  window.deleteEmployee = function(index) {
    if (confirm("Are you sure you want to delete this employee?")) {
      employees.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(employees));
      renderEmployees();
    }
  }
});







// ============================
// ACCOUNTS.HTML LOGIC
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const accountsTable = document.getElementById('accountsTable');
  if (!accountsTable) return; // run only on accounts.html

  let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const currentUserEmail = localStorage.getItem('currentUser');

  renderAccounts();

  // ----------------------------
  // Render accounts table
  // ----------------------------
  function renderAccounts() {
    accountsTable.innerHTML = '';

    accounts.forEach((acc, index) => {
      const tr = document.createElement('tr');
      const roleDisplay = acc.isMaster ? 'MASTER' : acc.role.toUpperCase();
      const verifiedDisplay = acc.isMaster ? '✔ (Master)' : (acc.verified ? '✔' : '—');
      
      tr.innerHTML = `
        <td>${acc.name || acc.firstName + ' ' + acc.lastName}</td>
        <td>${acc.email}</td>
        <td>${roleDisplay}</td>
        <td>${verifiedDisplay}</td>
        <td>
          ${acc.isMaster ? '' : '<button class="btn btn-sm btn-warning me-1" onclick="editAccount(' + index + ')">Edit</button>'}
          ${acc.isMaster ? '' : '<button class="btn btn-sm btn-info me-1" onclick="resetAccountPassword(' + index + ')">Reset PW</button>'}
          ${acc.isMaster ? '<button class="btn btn-sm btn-secondary" disabled>Protected</button>' : '<button class="btn btn-sm btn-danger" onclick="deleteAccount(' + index + ')">Delete</button>'}
        </td>
      `;
      accountsTable.appendChild(tr);
    });
  }

  // ----------------------------
  // Open Add Account modal
  // ----------------------------
  window.openAddAccount = function () {
    document.getElementById('modalTitle').textContent = 'Add Account';
    document.getElementById('editIndex').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('role').value = 'user';
    document.getElementById('verified').checked = false;
  };

  // ----------------------------
  // Save (Add / Edit) account
  // ----------------------------
  window.saveAccount = function () {
    const index = document.getElementById('editIndex').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const verified = document.getElementById('verified').checked;

    if (!firstName || !lastName || !email) {
      alert('Please fill all fields');
      return;
    }

    if (index === '') {
      if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      accounts.push({
        name: `${firstName} ${lastName}`,
        email,
        password,
        role,
        verified,
        isMaster: false // New accounts are never master
      });
    } else {
      // Don't allow editing master account properties
      if (accounts[index].isMaster) {
        alert('Master account cannot be edited');
        return;
      }

      accounts[index].name = `${firstName} ${lastName}`;
      accounts[index].email = email;
      accounts[index].role = role;
      accounts[index].verified = verified;

      if (password) {
        if (password.length < 6) {
          alert('Password must be at least 6 characters');
          return;
        }
        accounts[index].password = password;
      }
    }

    localStorage.setItem('accounts', JSON.stringify(accounts));
    renderAccounts();

    const modal = bootstrap.Modal.getInstance(document.getElementById('accountModal'));
    modal.hide();
  };

  // ----------------------------
  // Edit account
  // ----------------------------
  window.editAccount = function (index) {
    const acc = accounts[index];
    const [first, last] = acc.name.split(' ');

    document.getElementById('modalTitle').textContent = 'Edit Account';
    document.getElementById('editIndex').value = index;
    document.getElementById('firstName').value = first || '';
    document.getElementById('lastName').value = last || '';
    document.getElementById('email').value = acc.email;
    document.getElementById('password').value = '';
    document.getElementById('role').value = acc.role;
    document.getElementById('verified').checked = acc.verified;

    new bootstrap.Modal(document.getElementById('accountModal')).show();
  };

  // ----------------------------
  // Reset password
  // ----------------------------
  window.resetAccountPassword = function (index) {
    const newPass = prompt('Enter new password (min 6 chars)');
    if (!newPass) return;

    if (newPass.length < 6) {
      alert('Password too short');
      return;
    }

    accounts[index].password = newPass;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('Password reset successful');
  };

  // ----------------------------
  // Delete account (no self delete, no master delete)
  // ----------------------------
  window.deleteAccount = function (index) {
    if (accounts[index].email === currentUserEmail) {
      alert('You cannot delete your own account');
      return;
    }

    if (accounts[index].isMaster) {
      alert('You cannot delete the master account');
      return;
    }

    if (!confirm('Are you sure you want to delete this account?')) return;

    accounts.splice(index, 1);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    renderAccounts();
  };
});
