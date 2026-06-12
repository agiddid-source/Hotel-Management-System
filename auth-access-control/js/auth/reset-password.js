// ========================================
// HotelMS Reset Password Logic
// reset-password.js
// ========================================

const form           = document.getElementById("resetPasswordForm");
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

form.addEventListener("submit", (e) => {

  e.preventDefault();
  hideMessages();

  const newPassword     = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!newPassword || !confirmPassword) {
    showMessage(errorMessage, "Please fill in both password fields.");
    return;
  }

  if (newPassword.length < 6) {
    showMessage(errorMessage, "Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage(errorMessage, "Passwords do not match. Please try again.");
    return;
  }

  showMessage(successMessage, "Password updated successfully. Redirecting to login...");

  form.reset();

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);

});