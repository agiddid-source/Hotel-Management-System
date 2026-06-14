// ========================================
// HotelMS Staff Manager
// staffManager.js
//
// Handles the staff table, filters, stats,
// and the Add/Edit Staff modals.
// ========================================

const tableBody    = document.getElementById("staffTableBody");
const searchInput  = document.getElementById("searchInput");
const roleFilter   = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");
const resultCount  = document.getElementById("resultCount");
const statsRow     = document.getElementById("statsRow");

let allStaffs    = [];
let editStaffId  = null;


// Toast Notifications
const toast     = document.getElementById("toast");
const toastIcon = document.getElementById("toastIcon");
const toastText = document.getElementById("toastText");

function showToast(message, type = "success") {

  const styles = {
    success: { bg: "bg-successBg", text: "text-success", icon: "fa-circle-check" },
    error:   { bg: "bg-dangerBg",  text: "text-danger",  icon: "fa-circle-exclamation" },
  };

  const style = styles[type] || styles.success;

  toast.className =
    `flex fixed bottom-6 right-6 z-[60] items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium max-w-sm ${style.bg} ${style.text}`;

  toastIcon.className = `fa-solid ${style.icon} text-base`;
  toastText.textContent = message;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 3000);

}

// Loader Toast
function showLoader(message = "Saving...") {
  toast.className =
    `flex fixed bottom-6 right-6 z-[60] items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium max-w-sm bg-surface text-text border border-border`;
  toastIcon.className = "fa-solid fa-spinner fa-spin text-base text-secondary";
  toastText.textContent = message;
  clearTimeout(toast._timeout);
}

function simulateDelay() {
  const ms = Math.floor(Math.random() * 2000) + 1000; // 1000–3000ms
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

// Wire up all elements with data-modal-close
document.querySelectorAll("[data-modal-close]").forEach(el => {
  el.addEventListener("click", () => closeModal(el.dataset.modalClose));
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal("addStaffModal");
    closeModal("editStaffModal");
  }
});

// Inline Message Helper (for modal forms)
function showInlineError(el, text) {
  el.querySelector("span").textContent = text;
  el.classList.remove("hidden");
  el.classList.add("flex");
}

function hideInlineError(el) {
  el.classList.add("hidden");
  el.classList.remove("flex");
}

// Stats
function renderStats(staffs) {

  const total    = staffs.length;
  const active   = staffs.filter(s => s.status === "active").length;
  const inactive = total - active;
  const roles    = [...new Set(staffs.map(s => s.role))].length;

  const stats = [
    { label: "Total Staff",    value: total,    icon: "fa-users",         color: "text-secondary" },
    { label: "Active",         value: active,   icon: "fa-circle-check",  color: "text-success"   },
    { label: "Inactive",       value: inactive, icon: "fa-circle-xmark",  color: "text-danger"    },
    { label: "Roles Assigned", value: roles,    icon: "fa-shield-halved", color: "text-primary"   },
  ];

  statsRow.innerHTML = stats.map(stat => `
    <div class="bg-surface border border-border rounded-2xl px-5 py-4 flex items-center gap-4">
      <div class="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
        <i class="fa-solid ${stat.icon} ${stat.color} text-sm"></i>
      </div>
      <div>
        <p class="text-2xl font-bold text-text font-heading">${stat.value}</p>
        <p class="text-xs text-textTertiary">${stat.label}</p>
      </div>
    </div>
  `).join("");

}


// Role Label Helper
const roleLabels = {
  admin:           "Admin",
  manager:         "Manager",
  receptionist:    "Receptionist",
  housekeeper:     "Housekeeper",
  inventory_staff: "Inventory Staff",
};

function initials(name) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}


// Render Table
function renderStaffs(staffList) {

  tableBody.innerHTML = "";

  resultCount.textContent =
    staffList.length === 0
      ? ""
      : `Showing ${staffList.length} staff member${staffList.length !== 1 ? "s" : ""}`;

  if (staffList.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-16 text-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-surfaceMuted flex items-center justify-center">
              <i class="fa-solid fa-users-slash text-textTertiary"></i>
            </div>
            <p class="font-medium text-text text-sm">No staff members found</p>
            <p class="text-textTertiary text-xs">Try adjusting your search or filters.</p>
          </div>
        </td>
      </tr>
    `;

    return;
  }

  staffList.forEach(staff => {

    const statusClass =
      staff.status === "active"
        ? "bg-successBg text-success"
        : "bg-dangerBg text-danger";

    const statusDot =
      staff.status === "active"
        ? "bg-success"
        : "bg-danger";

    const row = `
      <tr class="hover:bg-surfaceMuted transition">

        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              ${initials(staff.name)}
            </div>
            <span class="font-medium text-text text-sm">${staff.name}</span>
          </div>
        </td>

        <td class="px-6 py-4 text-sm text-textSecondary">${staff.email}</td>

        <td class="px-6 py-4">
          <span class="text-sm text-text">${roleLabels[staff.role] || staff.role}</span>
        </td>

        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
            <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
            ${staff.status === "active" ? "Active" : "Inactive"}
          </span>
        </td>

        <td class="px-6 py-4">
          <div class="flex items-center gap-4">

            <button onclick="openEditModal(${staff.id})"
              class="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:underline"
            >
              <i class="fa-solid fa-pen-to-square text-xs"></i>
              Edit
            </button>

            <button onclick="toggleStatus(${staff.id})"
              class="inline-flex items-center gap-1.5 text-sm text-textTertiary hover:text-text transition"
            >
              <i class="fa-solid fa-power-off text-xs"></i>
              ${staff.status === "active" ? "Deactivate" : "Activate"}
            </button>

          </div>
        </td>

      </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);

  });

}


// Filter Logic
function getFilteredStaffs() {

  const term   = searchInput.value.toLowerCase().trim();
  const role   = roleFilter.value;
  const status = statusFilter.value;

  return allStaffs.filter(staff => {

    const matchesSearch =
      !term ||
      staff.name.toLowerCase().includes(term)  ||
      staff.email.toLowerCase().includes(term) ||
      staff.role.toLowerCase().includes(term);

    const matchesRole   = !role   || staff.role   === role;
    const matchesStatus = !status || staff.status === status;

    return matchesSearch && matchesRole && matchesStatus;

  });

}

function applyFilters() {
  renderStaffs(getFilteredStaffs());
}

searchInput.addEventListener("input",  applyFilters);
roleFilter.addEventListener("change",  applyFilters);
statusFilter.addEventListener("change", applyFilters);


// Toggle Status (PUT /staffs/:id)
async function toggleStatus(staffId) {

  const staff = allStaffs.find(s => s.id === staffId);

  if (!staff) return;

  const action = staff.status === "active" ? "deactivate" : "activate";

  if (!confirm(`Are you sure you want to ${action} ${staff.name}'s account?`)) return;

  staff.status = staff.status === "active" ? "inactive" : "active";

  await saveStaffs(allStaffs);

  renderStats(allStaffs);
  applyFilters();

  showToast(`${staff.name} ${action}d successfully.`);

}

// Add Staff Modal
const addStaffForm   = document.getElementById("addStaffForm");
const addErrorMessage = document.getElementById("addErrorMessage");

const toggleAddPassword = document.getElementById("toggleAddPassword");
const addPasswordInput  = document.getElementById("addPassword");

toggleAddPassword.addEventListener("click", () => {
  const icon = toggleAddPassword.querySelector("i");
  if (addPasswordInput.type === "password") {
    addPasswordInput.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    addPasswordInput.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
});

document.getElementById("openAddStaffBtn").addEventListener("click", () => {
  addStaffForm.reset();
  hideInlineError(addErrorMessage);
  openModal("addStaffModal");
});

addStaffForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  hideInlineError(addErrorMessage);

  const fullName = document.getElementById("addFullName").value.trim();
  const email    = document.getElementById("addEmail").value.trim();
  const role     = document.getElementById("addRole").value;
  const password = document.getElementById("addPassword").value;
  const status   = document.getElementById("addStatus").value;

  if (!fullName || !email || !role || !password) {
    showInlineError(addErrorMessage, "Please fill in all required fields.");
    return;
  }

  if (password.length < 8) {
    showInlineError(addErrorMessage, "Password must be at least 8 characters.");
    return;
  }

  const duplicate = allStaffs.find(
    s => s.email.toLowerCase() === email.toLowerCase()
  );

  if (duplicate) {
    showInlineError(addErrorMessage, "A staff account with this email already exists.");
    return;
  }

  const newStaff = {
    id: Date.now(),
    name: fullName,
    email,
    role,
    status,
  };

  allStaffs.push(newStaff);

  showLoader("Creating staff account...");
  await simulateDelay();

  // POST /staffs (simulated)
  await saveStaffs(allStaffs);

  renderStats(allStaffs);
  applyFilters();

  closeModal("addStaffModal");
  showToast(`${fullName} added successfully.`);

});

// Edit Staff Modal
const editStaffForm   = document.getElementById("editStaffForm");
const editErrorMessage = document.getElementById("editErrorMessage");

const editFullNameInput = document.getElementById("editFullName");
const editEmailInput    = document.getElementById("editEmail");
const editRoleInput     = document.getElementById("editRole");
const editStatusInput   = document.getElementById("editStatus");

const editAvatar      = document.getElementById("editStaffAvatar");
const editBannerName  = document.getElementById("editBannerName");
const editBannerEmail = document.getElementById("editBannerEmail");

function openEditModal(staffId) {

  const staff = allStaffs.find(s => s.id === staffId);

  if (!staff) {
    showToast("Staff record not found.", "error");
    return;
  }

  editStaffId = staffId;

  editFullNameInput.value = staff.name;
  editEmailInput.value    = staff.email;
  editRoleInput.value     = staff.role;
  editStatusInput.value   = staff.status;

  editAvatar.textContent      = initials(staff.name);
  editBannerName.textContent  = staff.name;
  editBannerEmail.textContent = staff.email;

  hideInlineError(editErrorMessage);
  openModal("editStaffModal");

}

editStaffForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  hideInlineError(editErrorMessage);

  const currentStaff = allStaffs.find(s => s.id === editStaffId);
  if (!currentStaff) return;

  const updatedName   = editFullNameInput.value.trim();
  const updatedEmail  = editEmailInput.value.trim();
  const updatedRole   = editRoleInput.value;
  const updatedStatus = editStatusInput.value;

  if (!updatedName || !updatedEmail || !updatedRole) {
    showInlineError(editErrorMessage, "Please fill in all required fields.");
    return;
  }

  const duplicate = allStaffs.find(
    s => s.id !== editStaffId &&
    s.email.toLowerCase() === updatedEmail.toLowerCase()
  );

  if (duplicate) {
    showInlineError(editErrorMessage, "Another staff account already uses this email.");
    return;
  }

  currentStaff.name   = updatedName;
  currentStaff.email  = updatedEmail;
  currentStaff.role   = updatedRole;
  currentStaff.status = updatedStatus;

  showLoader("Saving changes...");
  await simulateDelay();

  await saveStaffs(allStaffs);

  renderStats(allStaffs);
  applyFilters();

  closeModal("editStaffModal");
  showToast(`${updatedName} updated successfully.`);

});

// DEV ONLY: Reset Demo Data Button
const resetDataBtn = document.getElementById("resetDataBtn");

resetDataBtn.addEventListener("click", async () => {

  if (!confirm("Reset demo data back to its original state? This will discard all changes.")) return;

  resetStaffs();

  allStaffs = await getStaffs();

  searchInput.value  = "";
  roleFilter.value   = "";
  statusFilter.value = "";

  renderStats(allStaffs);
  renderStaffs(allStaffs);

  showToast("Demo data reset.");

});


// Init (GET /staffs)
async function init() {

  allStaffs = await getStaffs();

  renderStats(allStaffs);
  renderStaffs(allStaffs);

}

init();