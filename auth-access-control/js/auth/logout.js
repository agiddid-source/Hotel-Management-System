// ========================================
// HotelMS Logout
// logout.js
// ========================================

const confirmState     = document.getElementById("confirmState");
const loggedOutState   = document.getElementById("loggedOutState");
const confirmText      = document.getElementById("confirmText");
const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
const cancelLogoutBtn  = document.getElementById("cancelLogoutBtn");

// ========================================
// Guard: nothing to log out of
// ========================================

if (!isAuthenticated()) {

  confirmText.textContent = "You're not currently signed in.";
  confirmLogoutBtn.classList.add("hidden");
  cancelLogoutBtn.textContent = "Go to Login";
  cancelLogoutBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

}

// ========================================
// Cancel: go back to where the user came from
// ========================================

cancelLogoutBtn.addEventListener("click", () => {

  if (document.referrer && !document.referrer.includes("logout.html")) {
    window.location.href = document.referrer;
  } else {
    window.location.href = "../dashboard.html";
  }

});

// ========================================
// Confirm: clear session and show logged-out state
// ========================================

confirmLogoutBtn.addEventListener("click", () => {

  clearSession();

  confirmState.classList.add("hidden");
  loggedOutState.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1800);

});