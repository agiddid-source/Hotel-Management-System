// ========================================
// HotelMS Session Manager
// session.js
//
// Pages must define AUTH_BASE before loading
// this script — the relative path back to the
// project root, where login.html and 403.html
// live.
//
//   Root-level pages   (login.html, etc.):
//     <script>const AUTH_BASE = "";</script>
//
//   One level deep     (admin/add-staff.html):
//     <script>const AUTH_BASE = "../";</script>
// ========================================

const SESSION_KEY = "hotelms_user";
const _BASE = typeof AUTH_BASE !== "undefined" ? AUTH_BASE : "";

// ========================================
// Read Session
// ========================================

function getCurrentUser() {

  const stored =
    localStorage.getItem(SESSION_KEY) ||
    sessionStorage.getItem(SESSION_KEY);

  return stored ? JSON.parse(stored) : null;

}

function isAuthenticated() {
  return getCurrentUser() !== null;
}

// ========================================
// Create Session
// ========================================

function createSession(user, rememberMe = false) {

  clearSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(SESSION_KEY, JSON.stringify(user));

}

// ========================================
// Clear Session
// ========================================

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

// ========================================
// Logout
// ========================================

function logout() {
  clearSession();
  window.location.href = _BASE + "login.html";
}

// ========================================
// Route Guards
// ========================================

function requireAuth() {

  if (!isAuthenticated()) {
    window.location.href = _BASE + "login.html";
  }

}

function requireRole(allowedRoles) {

  const user = getCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    window.location.href = _BASE + "403.html";
  }

}