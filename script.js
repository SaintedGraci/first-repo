// ============================
// GENERAL LOGIC (all pages)
// ============================

// ----------------------------
// Mock accounts (fake accounts.txt)
// ----------------------------
const mockAccounts = [
  { name: "Test1", email: 'test1@gmail.com', password: 'test1234', role: 'admin' },
  { name: "Test2", email: 'test2@gmail.com', password: 'test5678', role: 'user' }
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
});




// ----------------------------
// Login function
// ----------------------------
function login(email, password) {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', user.email);
  localStorage.setItem('role', user.role);

  updateNavbar();

  alert(`Login successful! Role: ${user.role}`);

  // Redirect based on role
  if (user.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
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
  localStorage.clear();
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
    if (loginLink) loginLink.classList.add('d-none');
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
    if (loginLink) loginLink.classList.remove('d-none');
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
  if (window.location.pathname.endsWith('admin.html') && role !== 'admin') {
    alert('Access denied! Only admins can enter.');
    window.location.href = 'index.html';
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

    const newAccount = { name, email, password, role };
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
