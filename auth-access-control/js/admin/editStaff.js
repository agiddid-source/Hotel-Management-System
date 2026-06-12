// ========================================
// HotelMS Edit Staff
// editStaff.js
// ========================================

const editStaffForm  = document.getElementById("editStaffForm");
const successMessage = document.getElementById("successMessage");
const errorMessage   = document.getElementById("errorMessage");
const fullNameInput  = document.getElementById("fullName");
const emailInput     = document.getElementById("email");
const roleInput      = document.getElementById("role");
const statusInput    = document.getElementById("status");

const banner      = document.getElementById("staffBanner");
const avatar      = document.getElementById("staffAvatar");
const bannerName  = document.getElementById("bannerName");
const bannerEmail = document.getElementById("bannerEmail");

function showMessage(el, text) {
  el.querySelector("span").textContent = text;
  el.classList.remove("hidden");
  el.classList.add("flex");
}

function hideMessages() {
  [successMessage, errorMessage].forEach(el => {
    el.classList.add("hidden");
    el.classList.remove("flex");
  });
}

const params  = new URLSearchParams(window.location.search);
const staffId = Number(params.get("id"));

let staffs       = [];
let currentStaff = null;

// ========================================
// Load Staff (GET /staffs)
// ========================================

async function loadStaff() {

  staffs = await getStaffs();
  currentStaff = staffs.find(s => s.id === staffId);

  if (!currentStaff) {
    showMessage(errorMessage, "Staff record not found. Redirecting...");
    setTimeout(() => { window.location.href = "staff-list.html"; }, 1500);
    return;
  }

  // Populate form
  fullNameInput.value = currentStaff.name;
  emailInput.value    = currentStaff.email;
  roleInput.value     = currentStaff.role;
  statusInput.value   = currentStaff.status;

  // Populate identity banner
  const initials = currentStaff.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  avatar.textContent      = initials;
  bannerName.textContent  = currentStaff.name;
  bannerEmail.textContent = currentStaff.email;
  banner.classList.remove("hidden");
  banner.classList.add("flex");

}

loadStaff();

// ========================================
// Update Staff (PUT /staffs/:id)
// ========================================

editStaffForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  hideMessages();

  if (!currentStaff) return;

  const updatedName   = fullNameInput.value.trim();
  const updatedEmail  = emailInput.value.trim();
  const updatedRole   = roleInput.value;
  const updatedStatus = statusInput.value;

  if (!updatedName || !updatedEmail || !updatedRole) {
    showMessage(errorMessage, "Please fill in all required fields.");
    return;
  }

  const duplicate = staffs.find(
    s => s.id !== staffId &&
    s.email.toLowerCase() === updatedEmail.toLowerCase()
  );

  if (duplicate) {
    showMessage(errorMessage, "Another staff account already uses this email.");
    return;
  }

  currentStaff.name   = updatedName;
  currentStaff.email  = updatedEmail;
  currentStaff.role   = updatedRole;
  currentStaff.status = updatedStatus;

  await saveStaffs(staffs);

  showMessage(successMessage, "Staff updated successfully. Redirecting...");

  setTimeout(() => {
    window.location.href = "staff-list.html";
  }, 1500);

});