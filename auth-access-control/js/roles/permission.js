// ========================================
// HotelMS Role Permissions
// permissions.js
// ========================================

const permissions = {

    admin: [
        "dashboard",
        "staff_management",
        "reservations",
        "inventory",
        "reports",
        "room_management",
        "guest_management"
    ],

    manager: [
        "dashboard",
        "reservations",
        "inventory",
        "reports",
        "room_management"
    ],

    receptionist: [
        "dashboard",
        "reservations",
        "guest_management",
        "check_in",
        "check_out"
    ],

    housekeeper: [
        "dashboard",
        "room_status",
        "cleaning_schedule"
    ],

    inventory_staff: [
        "dashboard",
        "inventory"
    ]
};