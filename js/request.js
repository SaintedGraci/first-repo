// ============================
// AUTH CHECK
// ============================
const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
  alert("Please login first.");
  window.location.href = "index.html";
}

// ============================
// NAVBAR VISIBILITY
// ============================
document.addEventListener("DOMContentLoaded", () => {
  if (currentUser.role === "admin") {
    document.getElementById("adminDropdown").classList.remove("d-none");
  }

  loadRequests();
});

// ============================
// LOAD REQUESTS (USER ONLY)
// ============================
function loadRequests() {
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  const table = document.getElementById("requestsTable");
  table.innerHTML = "";

  // Show only requests of the logged-in user
  const myRequests = requests.filter(
    req => req.employeeEmail === currentUser.email
  );

  if (myRequests.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          No requests found
        </td>
      </tr>
    `;
    return;
  }

  myRequests.forEach(req => {
    const itemsText = req.items
      .map(item => `${item.name} (x${item.qty})`)
      .join(", ");

    let badgeClass = "warning";
    if (req.status === "Approved") badgeClass = "success";
    if (req.status === "Rejected") badgeClass = "danger";

    table.innerHTML += `
      <tr>
        <td>${req.date}</td>
        <td>${req.type}</td>
        <td>${itemsText}</td>
        <td>
          <span class="badge bg-${badgeClass}">
            ${req.status}
          </span>
        </td>
      </tr>
    `;
  });
}

// ============================
// ADD ITEM FIELD
// ============================
function addItemField() {
  const container = document.getElementById("itemsContainer");

  const div = document.createElement("div");
  div.className = "row g-2 mb-2 item-row";

  div.innerHTML = `
    <div class="col-md-6">
      <input type="text" class="form-control item-name" placeholder="Item name">
    </div>
    <div class="col-md-3">
      <input type="number" class="form-control item-qty" placeholder="Qty" min="1">
    </div>
    <div class="col-md-3">
      <button type="button" class="btn btn-danger w-100 remove-item">×</button>
    </div>
  `;

  container.appendChild(div);

  // Remove button
  div.querySelector(".remove-item").addEventListener("click", () => {
    div.remove();
  });
}

// ============================
// SUBMIT REQUEST
// ============================
function submitRequest() {
  const type = document.getElementById("requestType").value;
  const names = document.querySelectorAll(".item-name");
  const qtys = document.querySelectorAll(".item-qty");

  if (!type) {
    alert("Please select a request type");
    return;
  }

  let items = [];

  names.forEach((nameInput, index) => {
    const qtyInput = qtys[index];

    if (nameInput.value.trim() && qtyInput.value) {
      items.push({
        name: nameInput.value.trim(),
        qty: Number(qtyInput.value)
      });
    }
  });

  if (items.length === 0) {
    alert("Please add at least one item");
    return;
  }

  const requests = JSON.parse(localStorage.getItem("requests")) || [];

  requests.push({
    type,
    items,
    status: "Pending",
    date: new Date().toLocaleDateString(),
    employeeEmail: currentUser.email
  });

  localStorage.setItem("requests", JSON.stringify(requests));

  alert("Request submitted successfully!");

  // Reset form
  document.getElementById("itemsContainer").innerHTML = "";
  document.getElementById("requestType").value = "";

  bootstrap.Modal.getInstance(
    document.getElementById("requestModal")
  ).hide();

  loadRequests();
}

// ============================
// BUTTON EVENTS
// ============================
document.getElementById("addItemBtn").addEventListener("click", e => {
  e.preventDefault();
  addItemField();
});

document.getElementById("submitRequestBtn").addEventListener("click", e => {
  e.preventDefault();
  submitRequest();
});

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
