// ========================================
// HotelMS Forgot Password
// forgot-password.js
// ========================================

const form           = document.getElementById("forgotPasswordForm");
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

  const email = document.getElementById("email").value.trim();

  if (!email) {
    showMessage(errorMessage, "Please enter your email address.");
    return;
  }

  showMessage(
    successMessage,
    `Reset instructions sent to ${email}. Check your inbox.`
  );

  form.reset();

});