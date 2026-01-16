// ============================
// AUTH CHECK (ADMIN ONLY)
// ============================
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "admin") {
  alert("Access denied. Admins only.");
  window.location.href = "index.html";
}

// ============================
// SHOW ADMIN DROPDOWN
// ============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminDropdown").classList.remove("d-none");
  loadDepartments();
});

// ============================
// STORAGE HELPERS
// ============================
function getDepartments() {
  return JSON.parse(localStorage.getItem("departments")) || [];
}

function saveDepartments(departments) {
  localStorage.setItem("departments", JSON.stringify(departments));
}

// ============================
// LOAD TABLE
// ============================
function loadDepartments() {
  const departments = getDepartments();
  const table = document.getElementById("departmentsTable");
  table.innerHTML = "";

  if (departments.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">
          No departments added
        </td>
      </tr>
    `;
    return;
  }

  departments.forEach((dept, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${dept.name}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editDepartment(${index})">
            Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteDepartment(${index})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// ============================
// ADD / EDIT
// ============================
function saveDepartment() {
  const departments = getDepartments();
  const index = document.getElementById("editIndex").value;
  const name = document.getElementById("departmentName").value.trim();

  if (!name) {
    alert("Department name is required");
    return;
  }

  if (index === "") {
    // ADD
    const exists = departments.some(d => d.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("Department already exists");
      return;
    }

    departments.push({ name });
  } else {
    // EDIT
    departments[index].name = name;
  }

  saveDepartments(departments);
  loadDepartments();

  bootstrap.Modal.getInstance(
    document.getElementById("departmentModal")
  ).hide();
}

// ============================
// EDIT
// ============================
function editDepartment(index) {
  const dept = getDepartments()[index];

  document.getElementById("modalTitle").textContent = "Edit Department";
  document.getElementById("editIndex").value = index;
  document.getElementById("departmentName").value = dept.name;

  new bootstrap.Modal(
    document.getElementById("departmentModal")
  ).show();
}

// ============================
// DELETE
// ============================
function deleteDepartment(index) {
  if (!confirm("Are you sure you want to delete this department?")) return;

  const departments = getDepartments();
  departments.splice(index, 1);

  saveDepartments(departments);
  loadDepartments();
}

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
