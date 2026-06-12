// ========================================
// HotelMS Role Guard
// roleGuard.js
//
// Relies on AUTH_BASE (see session.js) to
// redirect to 403.html correctly regardless
// of the page's folder depth.
// ========================================

function hasPermission(permission) {

  const user = getCurrentUser();

  if (!user) return false;

  const rolePermissions = permissions[user.role] || [];

  return rolePermissions.includes(permission);

}

function requirePermission(permission) {

  // If the user isn't authenticated, requireAuth() has already
  // queued a redirect to login.html — don't override it with 403.
  if (!isAuthenticated()) return;

  if (!hasPermission(permission)) {
    const base = typeof AUTH_BASE !== "undefined" ? AUTH_BASE : "";
    window.location.href = base + "403.html";
  }

}