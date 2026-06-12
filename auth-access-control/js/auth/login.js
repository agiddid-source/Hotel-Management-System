// ========================================
// HotelMS Login Logic
// login.js
// ========================================

const loginForm    = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

function showError(text) {
  errorMessage.querySelector("span").textContent = text;
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("flex");
}

function hideError() {
  errorMessage.classList.add("hidden");
  errorMessage.classList.remove("flex");
}

loginForm.addEventListener("submit", (e) => {

  e.preventDefault();
  hideError();

  const email      = document.getElementById("email").value.trim();
  const password   = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  const user = users.find(u =>
    u.email === email && u.password === password
  );

  if (!user) {
    showError("Invalid email or password. Please try again.");
    return;
  }

  const sessionUser = {
    id:    user.id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  };

  createSession(sessionUser, rememberMe);

  window.location.href = "../dashboard.html";

});