// ============================
// EMPLOYEES PAGE LOGIC
// ============================

// Check logged-in user
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
  loadEmployees();
});

// ============================
// GET EMPLOYEES FROM STORAGE
// ============================
function getEmployees() {
  return JSON.parse(localStorage.getItem("employees")) || [];
}

// ============================
// SAVE EMPLOYEES
// ============================
function saveEmployees(employees) {
  localStorage.setItem("employees", JSON.stringify(employees));
}

// ============================
// LOAD EMPLOYEES INTO TABLE
// ============================
function loadEmployees() {
  const employees = getEmployees();
  const tbody = document.querySelector("#employeesTable tbody");
  tbody.innerHTML = "";

  employees.forEach((emp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${emp.name}</td>
      <td>${emp.position}</td>
      <td>${emp.department}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editEmployee(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ============================
// ADD EMPLOYEE
// ============================
document.getElementById("employeeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("empName").value.trim();
  const position = document.getElementById("empPosition").value.trim();
  const department = document.getElementById("empDept").value.trim();

  if (!name || !position || !department) {
    alert("All fields are required");
    return;
  }

  const employees = getEmployees();

  employees.push({
    name,
    position,
    department
  });

  saveEmployees(employees);
  loadEmployees();

  this.reset();
});

// ============================
// EDIT EMPLOYEE
// ============================
function editEmployee(index) {
  const employees = getEmployees();
  const emp = employees[index];

  document.getElementById("editIndex").value = index;
  document.getElementById("editName").value = emp.name;
  document.getElementById("editPosition").value = emp.position;
  document.getElementById("editDept").value = emp.department;

  const modal = new bootstrap.Modal(
    document.getElementById("editEmployeeModal")
  );
  modal.show();
}

// ============================
// SAVE EDIT
// ============================
function saveEdit() {
  const index = document.getElementById("editIndex").value;
  const employees = getEmployees();

  employees[index].name = document.getElementById("editName").value.trim();
  employees[index].position = document.getElementById("editPosition").value.trim();
  employees[index].department = document.getElementById("editDept").value.trim();

  saveEmployees(employees);
  loadEmployees();

  bootstrap.Modal.getInstance(
    document.getElementById("editEmployeeModal")
  ).hide();
}

// ============================
// DELETE EMPLOYEE
// ============================
function deleteEmployee(index) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  const employees = getEmployees();
  employees.splice(index, 1);

  saveEmployees(employees);
  loadEmployees();
}

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
