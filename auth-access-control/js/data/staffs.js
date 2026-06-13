// ========================================
// HotelMS Staff Data Layer
// staffs.js
//
// Simulates a REST API using a static JSON
// file for GET, and console-logged request
// payloads for POST/PUT/DELETE.
//
// localStorage is used only as a temporary
// "mock database" so changes persist across
// page reloads during development. Once the
// real backend is ready, swap the fetch URLs
// for the live API endpoints and remove the
// localStorage fallback.
// ========================================

const STAFF_ENDPOINT  = "../data/staffs.json"; // GET (mock API)
const STAFF_CACHE_KEY = "hotelms_staffs";       // mock DB cache


// GET /staffs
async function getStaffs() {

  // Return cached/mock-DB copy if it exists
  const cached = localStorage.getItem(STAFF_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  // Otherwise, fetch the seed data (simulated GET request)
  try {

    const response = await fetch(STAFF_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Failed to fetch staffs: ${response.status}`);
    }

    const staffs = await response.json();

    // Seed the mock DB
    localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(staffs));

    return staffs;

  } catch (error) {

    console.error("getStaffs() error:", error);
    return [];

  }

}

// ========================================
// POST /staffs  (create)
// PUT  /staffs/:id  (update)
//
// No real backend yet, so we log the request
// that *would* be sent, and persist to the
// mock DB so the UI reflects the change.
// ========================================

async function saveStaffs(staffs) {

  console.log("PUT /staffs (mock request body):", staffs);

  localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(staffs));

  // Example of what the real call will look like:
  //
  // return fetch("/api/staffs", {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(staffs),
  // });

  return Promise.resolve(staffs);

}

// ========================================
// DEV ONLY: Reset Mock Database
//
// Clears the localStorage cache so getStaffs()
// re-fetches the original seed data from
// staffs.json on next call. Remove this once
// a real backend is connected.
// ========================================

function resetStaffs() {
  localStorage.removeItem(STAFF_CACHE_KEY);
}