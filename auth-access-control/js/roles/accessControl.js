
// HotelMS Access Control accessControl.js
function showElement(elementId) {

  const el = document.getElementById(elementId);
  if (el) el.classList.remove("hidden");

}

function hideElement(elementId) {

  const el = document.getElementById(elementId);
  if (el) el.classList.add("hidden");

}

function controlAccess(elementId, permission) {

  if (hasPermission(permission)) {
    showElement(elementId);
  } else {
    hideElement(elementId);
  }

}