// ========================================
// HotelMS Add Staff
// addStaff.js
// ========================================

const addStaffForm   = document.getElementById("addStaffForm");
const successMessage = document.getElementById("successMessage");
const errorMessage   = document.getElementById("errorMessage");

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

addStaffForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  hideMessages();

  const fullName = document.getElementById("fullName").value.trim();
  const email    = document.getElementById("email").value.trim();
  const role     = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const status   = document.getElementById("status").value;

  if (!fullName || !email || !role || !password) {
    showMessage(errorMessage, "Please fill in all required fields.");
    return;
  }

  if (password.length < 8) {
    showMessage(errorMessage, "Password must be at least 8 characters.");
    return;
  }

  const staffs = await getStaffs();

  const duplicate = staffs.find(
    s => s.email.toLowerCase() === email.toLowerCase()
  );

  if (duplicate) {
    showMessage(errorMessage, "A staff account with this email already exists.");
    return;
  }

  const newStaff = {
    id: Date.now(),
    name: fullName,
    email,
    role,
    status,
  };

  staffs.push(newStaff);

  // POST /staffs (simulated)
  await saveStaffs(staffs);

  showMessage(successMessage, "Staff account created successfully. Redirecting...");
  addStaffForm.reset();

  setTimeout(() => {
    window.location.href = "staff-list.html";
  }, 1500);

});