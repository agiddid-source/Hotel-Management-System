/**
 * ============================================
 * HMS Rooms Module
 * ============================================
 *
 * Handles the display and management of hotel rooms.
 * This module is responsible for:
 * - Fetching room data from local JSON.
 * - Rendering the list of rooms.
 * - Managing the "Add Room" modal.
 * - Handling form submissions for new rooms.
 *
 * Dependencies: components.js (HMS object), router.js (Router object)
 *
 * @author HMS Team
 */

const Rooms = {

  /** @type {Array} Stores all loaded room data */
  data: [],

  /** @type {Array} Stores all loaded room types */
  roomTypes: [],

  /** @type {string|null} Tracks the ID of the room currently being edited */
  currentEditingRoomId: null,

  /** @type {string|null} Tracks the ID of the room currently being reserved */
  currentReservationRoomId: null,

  /** @type {string} Tracks the active room type filter */
  currentFilterTypeId: 'all',

  /** @type {string} Tracks the active search query */
  currentSearchQuery: '',

  /** @type {boolean} Ensures shared modal listeners are attached once */
  modalEventsBound: false,

  /** @type {boolean} Ensures dropdown listeners are attached once */
  dropdownEventsBound: false,

  /** @type {boolean} Ensures the Escape key handler is attached once */
  escapeKeyBound: false,

  /** @type {Array<string>} Modal element IDs managed by this page */
  modalIds: ['ghst-add-room-modal', 'ghst-edit-room-modal', 'ghst-reservation-modal'],

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize the Rooms module.
   * Called by Router.navigate('rooms').
   * Loads data, then renders the page.
   */
  async init() {
    this.setPageActions();
    await this.loadData();
    this.render();
    this.bindModalEvents();
  },

  /**
   * Keep the page from scrolling while any modal is open.
   * The main app shell scrolls, so we lock the body and main container together.
   */
  refreshModalScrollLock() {
    const anyModalOpen = this.modalIds.some((modalId) => {
      const modal = document.getElementById(modalId);
      return modal && !modal.classList.contains('hidden');
    });

    document.body.classList.toggle('ghst-modal-open', anyModalOpen);
  },

  /**
   * Close whichever modal is currently visible.
   * This gives Escape-key behavior a single predictable path.
   */
  closeTopMostModal() {
    for (const modalId of ['ghst-reservation-modal', 'ghst-edit-room-modal', 'ghst-add-room-modal']) {
      const modal = document.getElementById(modalId);
      if (modal && !modal.classList.contains('hidden')) {
        if (modalId === 'ghst-reservation-modal') this.closeReservationModal();
        if (modalId === 'ghst-edit-room-modal') this.closeEditRoomModal();
        if (modalId === 'ghst-add-room-modal') this.closeAddRoomModal();
        return;
      }
    }
  },

  /**
   * Format a date object for use in an <input type="date"> field.
   * @param {Date} date
   * @returns {string}
   */
  formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Add a number of days to a date string in YYYY-MM-DD format.
   * @param {string} dateStr
   * @param {number} days
   * @returns {string}
   */
  shiftDateString(dateStr, days) {
    if (!dateStr) return this.getLocalDateString(days);

    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return this.getLocalDateString(days);

    date.setDate(date.getDate() + days);
    return this.formatDateInputValue(date);
  },

  /**
   * Set the action buttons in the page header.
   * Each page can customize these buttons.
   */
  setPageActions() {
    const actionsEl = document.getElementById('ghst-page-actions');
    if (actionsEl) {
      actionsEl.innerHTML = `
        ${HMS.createButton('Add Room', 'primary', { icon: 'plus-circle', onclick: 'Rooms.openAddRoomModal()' })}
      `;
    }
  },

  /**
   * Build the filtered room list using the active type filter and search query.
   * @returns {Array}
   */
  getVisibleRooms() {
    const roomsByType = this.currentFilterTypeId === 'all'
      ? this.data
      : this.data.filter((room) => room.roomType?.id === this.currentFilterTypeId);

    const query = this.currentSearchQuery.trim().toLowerCase();
    if (!query) return roomsByType;

    return roomsByType.filter((room) => {
      const searchableFields = [
        room.roomNumber,
        room.roomType?.name,
        room.status,
        room.currentGuest,
      ];

      return searchableFields.some((field) => String(field ?? '').toLowerCase().includes(query));
    });
  },

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Fetch all room data from local JSON files.
   */
  async loadData() {
    try {
      const [roomsData, roomTypesData] = await Promise.all([
        fetch('./data/rooms.json').then(r => r.json()),
        fetch('./data/room-types.json').then(r => r.json()),
      ]);
      this.roomTypes = roomTypesData;

      // Map existing room data to match the expected structure, using roomTypes
      this.data = roomsData.map(room => ({
        id: room.id,
        roomNumber: room.number,
        roomType: this.roomTypes.find(type => type.name === room.type) || { id: 'unknown', name: room.type, description: '' },
        price: room.pricePerNight,
        capacity: room.maxGuests,
        status: room.status,
        currentGuest: room.currentGuest,
        checkInDate: null, // Assuming these are not in the existing rooms.json
        checkOutDate: null, // Assuming these are not in the existing rooms.json
      }));

    } catch (err) {
      console.error('[Rooms] Failed to load data:', err);
    }
  },

  // ============================================
  // MAIN RENDER
  // ============================================

  /**
   * Render the full rooms layout.
   * Injects HTML into the #main-content container.
   */
  render() {
    const content = document.getElementById('ghst-main-content');
    if (!content) return;

    // Dynamically generate filter options from roomTypes
    const filterOptions = this.roomTypes.map(type => 
      ({ label: type.name, onclick: `Rooms.filterRooms('${type.id}')` })
    );
    filterOptions.unshift({ label: 'All Types', onclick: "Rooms.filterRooms('all')" });

    const visibleRooms = this.getVisibleRooms();

    content.innerHTML = `
      <div class="bg-surface-card border border-outline rounded-xl overflow-visible ghst-card-diffusion">
        <div class="flex items-center justify-between px-6 py-4 border-b border-outline">
          <div>
            <h3 class="text-base font-semibold text-content-main">All Rooms</h3>
            <p class="text-sm text-content-muted mt-0.5">${visibleRooms.length} matching room${visibleRooms.length === 1 ? '' : 's'}</p>
          </div>
          <div class="relative inline-block z-30">
            ${HMS.createDropdown('Filter by Type', filterOptions, { id: 'room-type-filter-dropdown', align: 'right' })}
          </div>
        </div>
        <div class="overflow-x-auto overflow-y-visible">
          <table class="w-full min-w-[700px]">
            <thead>
              <tr class="text-left">
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Room No.</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Price</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Capacity</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody id="ghst-rooms-table-body">
              ${this.renderRoomRows(visibleRooms)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Renders the table rows for rooms.
   * @param {Array} roomsToRender - The array of room objects to render.
   * @returns {string} HTML string of table rows.
   */
  renderRoomRows(roomsToRender) {
    if (roomsToRender.length === 0) {
      return `
        <tr>
          <td colspan="6" class="text-center py-10 text-content-muted">
            No rooms found. Add a new room to get started!
          </td>
        </tr>
      `;
    }
    return roomsToRender.map(room => {
      // Build onclick strings without nested template literals to avoid syntax conflicts
      const makeResOnclick = "Rooms.makeReservation('" + room.id + "')";
      const editOnclick = "Rooms.openEditRoomModal('" + room.id + "')";
      const deleteOnclick = "Rooms.deleteRoom('" + room.id + "')";
      
      return `
      <tr class="border-t border-outline hover:bg-surface-hover transition-colors duration-150">
        <td class="px-4 py-3.5 text-sm font-medium text-content-main">${room.roomNumber}</td>
        <td class="px-4 py-3.5 text-sm text-content-sec">${room.roomType.name}</td>
        <td class="px-4 py-3.5 text-sm text-content-sec">₦${room.price.toLocaleString()}</td>
        <td class="px-4 py-3.5 text-sm text-content-sec">${room.capacity}</td>
        <td class="px-4 py-3.5">
          ${HMS.getStatusBadge(room.status)}
        </td>
        <td class="px-4 py-3.5">
          <div class="flex justify-end">
            ${HMS.createDropdown(HMS.getIcon('moreVertical'), [
              // Show 'Make Reservation' only for available rooms
              ...(room.status === 'available' ? [{ label: 'Make Reservation', onclick: makeResOnclick, icon: 'plus-circle' }] : []),
              { label: 'Edit', onclick: editOnclick, icon: 'edit' },
              { label: 'Delete', onclick: deleteOnclick, icon: 'trash' },
            ], { align: 'right', id: 'room-actions-' + room.id, hideChevron: true })}
          </div>
        </td>
      </tr>
    `;
    }).join('');
  },

  /**
   * Placeholder function for making a reservation.
   * This would typically navigate to a reservation form or open a reservation modal.
   * 
   * @param {string} roomId - The ID of the room for which to make a reservation.
   */
  makeReservation(roomId) {
    const room = this.data.find(r => r.id === roomId);
    if (!room) {
      HMS.showToast({
        message: 'Room not found',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    if (room.status !== 'available') {
      HMS.showToast({
        message: `Room ${room.roomNumber} is not available for reservation`,
        variant: 'warning',
        duration: 3000,
      });
      return;
    }

    // Close any open room action menus before showing the modal.
    HMS.closeAllDropdowns();
    this.openReservationModal(roomId);
  },

  // ============================================
  // MODAL MANAGEMENT (Add Room)
  // ============================================

  /**
   * Binds event listeners related to the add and edit room modals.
   */
  bindModalEvents() {
    if (!this.modalEventsBound) {
      const addRoomForm = document.getElementById('ghst-add-room-form');
      if (addRoomForm) {
        addRoomForm.addEventListener('submit', (e) => this.handleAddRoomSubmit(e));
      }

      const editRoomForm = document.getElementById('ghst-edit-room-form');
      if (editRoomForm) {
        editRoomForm.addEventListener('submit', (e) => this.handleEditRoomSubmit(e));
      }

      const reservationForm = document.getElementById('ghst-reservation-form');
      if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => this.handleReservationSubmit(e));
      }

      // Close modal when clicking outside (on the overlay)
      const addRoomModal = document.getElementById('ghst-add-room-modal');
      if (addRoomModal) {
        addRoomModal.addEventListener('click', (e) => {
          if (e.target === addRoomModal) {
            this.closeAddRoomModal();
          }
        });
      }

      const editRoomModal = document.getElementById('ghst-edit-room-modal');
      if (editRoomModal) {
        editRoomModal.addEventListener('click', (e) => {
          if (e.target === editRoomModal) {
            this.closeEditRoomModal();
          }
        });
      }

      const reservationModal = document.getElementById('ghst-reservation-modal');
      if (reservationModal) {
        reservationModal.addEventListener('click', (e) => {
          if (e.target === reservationModal) {
            this.closeReservationModal();
          }
        });
      }

      ['ghst-reservation-checkin', 'ghst-reservation-checkout', 'ghst-reservation-adults', 'ghst-reservation-children'].forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('input', () => {
            this.syncReservationDateBounds();
            this.updateReservationSummary();
          });
          field.addEventListener('change', () => {
            this.syncReservationDateBounds();
            this.updateReservationSummary();
          });
        }
      });

      if (!this.escapeKeyBound) {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            this.closeTopMostModal();
          }
        });
        this.escapeKeyBound = true;
      }

      this.modalEventsBound = true;
    }

    // Re-bind dropdown events after rendering rooms
    this.bindDropdownEvents();
  },

  /**
   * Binds click-outside event listeners for dropdown menus.
   */
  bindDropdownEvents() {
    if (this.dropdownEventsBound) return;

    document.addEventListener('click', (event) => {
      // Check if the click is outside any dropdown trigger or menu
      if (!event.target.closest('.relative.inline-block')) {
        HMS.closeAllDropdowns();
      }
    });

    this.dropdownEventsBound = true;
  },

  /**
   * Populates the room type dropdown in the add room modal.
   */
  populateRoomTypeDropdown() {
    const roomTypeSelect = document.getElementById('ghst-room-type');
    if (roomTypeSelect) {
      roomTypeSelect.innerHTML = '<option value="">Select a room type</option>';
      this.roomTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        roomTypeSelect.appendChild(option);
      });
    }
  },

  /**
   * Populates the room type dropdown in the edit room modal.
   */
  populateEditRoomTypeDropdown() {
    const roomTypeSelect = document.getElementById('ghst-edit-room-type');
    if (roomTypeSelect) {
      roomTypeSelect.innerHTML = '<option value="">Select a room type</option>';
      this.roomTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        roomTypeSelect.appendChild(option);
      });

      // After populating, set the selected value if a room is being edited
      if (this.currentEditingRoomId) {
        const room = this.data.find(r => r.id === this.currentEditingRoomId);
        if (room && room.roomType && room.roomType.id) {
          roomTypeSelect.value = room.roomType.id;
        }
      }
    }
  },

  /**
   * Opens the add room modal.
   */
  openAddRoomModal() {
    const modal = document.getElementById('ghst-add-room-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.populateRoomTypeDropdown();
      this.refreshModalScrollLock();
      HMS.closeAllDropdowns();
    }
  },

  /**
   * Closes the add room modal.
   */
  closeAddRoomModal() {
    const modal = document.getElementById('ghst-add-room-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('ghst-add-room-form').reset(); // Clear form fields
      this.refreshModalScrollLock();
    }
  },

  /**
   * Opens the reservation modal and pre-fills room details.
   * @param {string} roomId - The ID of the room to reserve
   */
  openReservationModal(roomId) {
    const room = this.data.find(r => r.id === roomId);
    if (!room) return;

    this.currentReservationRoomId = roomId;

    const form = document.getElementById('ghst-reservation-form');
    if (form) {
      form.reset();
    }

    const checkInField = document.getElementById('ghst-reservation-checkin');
    const checkOutField = document.getElementById('ghst-reservation-checkout');
    const adultsField = document.getElementById('ghst-reservation-adults');
    const childrenField = document.getElementById('ghst-reservation-children');
    const roomIdField = document.getElementById('ghst-reservation-room-id');
    const guestNameField = document.getElementById('ghst-reservation-guest-name');
    const guestEmailField = document.getElementById('ghst-reservation-guest-email');
    const guestPhoneField = document.getElementById('ghst-reservation-guest-phone');
    const statusField = document.getElementById('ghst-reservation-status');
    const notesField = document.getElementById('ghst-reservation-notes');

    if (roomIdField) roomIdField.value = room.id;
    if (checkInField) checkInField.value = this.getLocalDateString(0);
    if (checkOutField) checkOutField.value = this.getLocalDateString(1);
    if (adultsField) {
      adultsField.value = Math.max(1, Math.min(2, room.capacity || 1));
      adultsField.max = String(room.capacity || 1);
    }
    if (childrenField) {
      childrenField.value = 0;
      childrenField.max = String(room.capacity || 1);
    }
    if (guestNameField) guestNameField.value = room.currentGuest || '';
    if (guestEmailField) guestEmailField.value = '';
    if (guestPhoneField) guestPhoneField.value = '';
    if (statusField) statusField.value = 'confirmed';
    if (notesField) notesField.value = '';

    this.syncReservationDateBounds();
    this.updateReservationSummary(room);

    const modal = document.getElementById('ghst-reservation-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
    }

    if (guestNameField) {
      setTimeout(() => guestNameField.focus(), 0);
    }

    HMS.closeAllDropdowns();
  },

  /**
   * Closes the reservation modal.
   */
  closeReservationModal() {
    const modal = document.getElementById('ghst-reservation-modal');
    if (modal) {
      modal.classList.add('hidden');
    }

    const form = document.getElementById('ghst-reservation-form');
    if (form) {
      form.reset();
    }

    const estimateEl = document.getElementById('ghst-reservation-estimate-total');
    if (estimateEl) estimateEl.textContent = '$0.00';

    this.currentReservationRoomId = null;
    this.refreshModalScrollLock();
  },

  /**
   * Keep the check-in/check-out inputs in a valid range.
   * Check-out is always forced to at least one night after check-in.
   */
  syncReservationDateBounds() {
    const checkInField = document.getElementById('ghst-reservation-checkin');
    const checkOutField = document.getElementById('ghst-reservation-checkout');

    if (!checkInField || !checkOutField) return;

    const minCheckIn = this.getLocalDateString(0);
    if (!checkInField.value || checkInField.value < minCheckIn) {
      checkInField.value = minCheckIn;
    }

    const minCheckOut = this.shiftDateString(checkInField.value, 1);
    checkOutField.min = minCheckOut;

    if (!checkOutField.value || checkOutField.value <= checkInField.value) {
      checkOutField.value = minCheckOut;
    }
  },

  /**
   * Update the reservation summary panel with the current form values.
   * @param {Object} [roomOverride] - Optional room object to use instead of the selected room
   */
  updateReservationSummary(roomOverride = null) {
    const room = roomOverride || this.data.find(r => r.id === this.currentReservationRoomId);
    if (!room) return;

    const checkIn = document.getElementById('ghst-reservation-checkin')?.value || this.getLocalDateString(0);
    const checkOut = document.getElementById('ghst-reservation-checkout')?.value || this.getLocalDateString(1);
    const adultsField = document.getElementById('ghst-reservation-adults');
    const childrenField = document.getElementById('ghst-reservation-children');
    const adults = parseInt(adultsField?.value || '1', 10);
    const children = parseInt(childrenField?.value || '0', 10);
    const nights = this.calculateNights(checkIn, checkOut);
    const estimatedTotal = nights > 0 ? nights * room.price : room.price;
    const totalGuests = adults + children;
    const roomCapacity = room.capacity || 1;

    if (adultsField) adultsField.max = String(roomCapacity);
    if (childrenField) childrenField.max = String(roomCapacity);

    if (totalGuests > roomCapacity) {
      const adjustedAdults = Math.max(1, Math.min(adults, roomCapacity));
      const adjustedChildren = Math.max(0, roomCapacity - adjustedAdults);
      if (adultsField) adultsField.value = String(adjustedAdults);
      if (childrenField) childrenField.value = String(adjustedChildren);
    }

    const roomNumberEl = document.getElementById('ghst-reservation-room-number');
    const roomTypeEl = document.getElementById('reservation-room-type');
    const roomRateEl = document.getElementById('ghst-reservation-room-rate');
    const roomCapacityEl = document.getElementById('ghst-reservation-room-capacity');
    const reservationNightsEl = document.getElementById('ghst-reservation-nights');
    const reservationGuestsEl = document.getElementById('ghst-reservation-guests');
    const estimateTotalEl = document.getElementById('ghst-reservation-estimate-total');
    const roomBadgeEl = document.getElementById('ghst-reservation-room-badge');

    if (roomNumberEl) roomNumberEl.textContent = `Room ${room.roomNumber}`;
    if (roomTypeEl) roomTypeEl.textContent = room.roomType?.name || 'Room';
    if (roomRateEl) roomRateEl.textContent = `₦${room.price.toLocaleString()} / night`;
    if (roomCapacityEl) roomCapacityEl.textContent = `Fixed room capacity: ${roomCapacity} guest${roomCapacity === 1 ? '' : 's'}`;
    if (reservationNightsEl) reservationNightsEl.textContent = `${Math.max(nights, 0)} night${Math.max(nights, 0) === 1 ? '' : 's'}`;
    if (reservationGuestsEl) reservationGuestsEl.textContent = `${Math.min(totalGuests, roomCapacity)} guest${Math.min(totalGuests, roomCapacity) === 1 ? '' : 's'}`;
    if (estimateTotalEl) estimateTotalEl.textContent = `$${estimatedTotal.toFixed(2)}`;
    if (roomBadgeEl) {
      roomBadgeEl.innerHTML = HMS.getStatusBadge(room.status);
    }

    const roomSummaryEl = document.getElementById('ghst-reservation-room-summary');
    if (roomSummaryEl) {
      roomSummaryEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
            ${HMS.getIcon('bed')}
          </div>
          <div>
            <p class="text-sm font-semibold text-content-main">${room.roomType?.name || 'Room'} · Room ${room.roomNumber}</p>
            <p class="text-xs text-content-muted">Floor ${room.floor || 'N/A'} · Fixed capacity ${room.capacity} guest${room.capacity === 1 ? '' : 's'}</p>
          </div>
        </div>
      `;
    }
  },

  /**
   * Calculate the number of nights between two dates.
   * @param {string} checkIn
   * @param {string} checkOut
   * @returns {number}
   */
  calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    const diffMs = end.getTime() - start.getTime();
    const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Number.isFinite(nights) ? nights : 0;
  },

  /**
   * Return a local YYYY-MM-DD string offset by a number of days.
   * @param {number} offsetDays
   * @returns {string}
   */
  getLocalDateString(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Handle the reservation form submission.
   * @param {Event} event
   */
  handleReservationSubmit(event) {
    event.preventDefault();

    const room = this.data.find(r => r.id === this.currentReservationRoomId);
    if (!room) {
      HMS.showToast({
        message: 'Please select a room to reserve',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    this.syncReservationDateBounds();

    const guestName = document.getElementById('ghst-reservation-guest-name')?.value.trim();
    const guestEmail = document.getElementById('ghst-reservation-guest-email')?.value.trim();
    const guestPhone = document.getElementById('ghst-reservation-guest-phone')?.value.trim();
    const checkIn = document.getElementById('ghst-reservation-checkin')?.value;
    const checkOut = document.getElementById('ghst-reservation-checkout')?.value;
    const adults = parseInt(document.getElementById('ghst-reservation-adults')?.value || '1', 10);
    const children = parseInt(document.getElementById('ghst-reservation-children')?.value || '0', 10);
    const reservationStatus = document.getElementById('ghst-reservation-status')?.value || 'confirmed';
    const notes = document.getElementById('ghst-reservation-notes')?.value.trim() || '';
    const totalGuests = adults + children;

    if (!guestName) {
      HMS.showToast({
        message: 'Guest name is required',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    const nights = this.calculateNights(checkIn, checkOut);
    if (nights <= 0) {
      HMS.showToast({
        message: 'Check-out date must be after the check-in date',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    if (totalGuests > room.capacity) {
      HMS.showToast({
        message: `Room ${room.roomNumber} accommodates up to ${room.capacity} guest${room.capacity === 1 ? '' : 's'}`,
        variant: 'warning',
        duration: 3000,
      });
      return;
    }

    const reservation = {
      id: `RSV-${Date.now()}`,
      guestName,
      room: `Room ${room.roomNumber}`,
      roomType: room.roomType?.name || 'Room',
      checkIn,
      checkOut,
      status: reservationStatus,
      amount: `$${(room.price * nights).toFixed(2)}`,
      guestEmail,
      guestPhone,
      adults,
      children,
      notes,
      roomId: room.id,
    };

    room.status = 'reserved';
    room.currentGuest = guestName;
    room.checkInDate = checkIn;
    room.checkOutDate = checkOut;

    if (typeof Reservations !== 'undefined' && Reservations.addReservation) {
      Reservations.addReservation(reservation);
    }

    this.render();
    this.closeReservationModal();

    HMS.showToast({
      message: `Reservation created for Room ${room.roomNumber}`,
      variant: 'success',
      duration: 3000,
    });
  },

  /**
   * Handles the submission of the add room form.
   * Creates a new room, adds it to the data, and provides feedback via toast.
   * 
   * @param {Event} event - The form submission event
   */
  handleAddRoomSubmit(event) {
    event.preventDefault();

    // Retrieve form values
    const roomNumber = document.getElementById('ghst-room-number').value;
    const roomTypeId = document.getElementById('ghst-room-type').value;
    const price = parseFloat(document.getElementById('ghst-room-price').value);
    const capacity = parseInt(document.getElementById('ghst-room-capacity').value);

    // Find the selected room type
    const roomType = this.roomTypes.find(type => type.id === roomTypeId);

    // Validate room type
    if (!roomType) {
      HMS.showToast({
        message: 'Invalid room type selected',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    // Create new room object
    const newRoom = {
      id: `RM-${Date.now()}`, // Generate unique ID using timestamp
      roomNumber: roomNumber,
      roomType: roomType,
      price: price,
      capacity: capacity,
      status: 'available', // New rooms default to available
      currentGuest: null,
      checkInDate: null,
      checkOutDate: null,
    };

    // Add the new room to the data array
    this.data.push(newRoom);
    
    // Re-render the rooms table with the new room
    this.render();
    
    // Close the add room modal
    this.closeAddRoomModal();
    
    // Display success toast
    HMS.showToast({
      message: `Room ${roomNumber} has been created successfully`,
      variant: 'success',
      duration: 3000,
    });

    console.log('New Room Added:', newRoom);
  },

  // ============================================
  // ROOM FILTERING
  // ============================================

  /**
   * Filters rooms based on their type and re-renders the table.
   * Supports filtering by a specific room type ID or displaying all rooms.
   * 
   * @param {string} typeId - The ID of the room type to filter by, or 'all' to show all rooms
   */
  filterRooms(typeId) {
    this.currentFilterTypeId = typeId || 'all';
    this.render();
    HMS.closeAllDropdowns();
  },

  /**
   * Search rooms by number, type, status, or guest name and re-render the page.
   * @param {string} query
   */
  searchRooms(query) {
    this.currentSearchQuery = query || '';
    this.render();
    HMS.closeAllDropdowns();
  },

  /**
   * Opens the edit room modal and pre-populates it with the selected room's current data.
   * Allows users to modify room details (number, type, price, capacity, status).
   * 
   * @param {string} roomId - The ID of the room to edit
   */
  openEditRoomModal(roomId) {
    // Find the room in the data array
    const room = this.data.find(r => r.id === roomId);
    if (!room) {
      HMS.showToast({
        message: 'Room not found',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    // Store the room ID being edited (used in form submission)
    this.currentEditingRoomId = roomId;

    // Pre-populate the form with current room data
    document.getElementById('ghst-edit-room-number').value = room.roomNumber;
    document.getElementById('ghst-edit-room-type').value = room.roomType.id;
    document.getElementById('ghst-edit-room-price').value = room.price;
    document.getElementById('ghst-edit-room-capacity').value = room.capacity;
    document.getElementById('ghst-edit-room-status').value = room.status;

    // Populate room type dropdown with available types
    this.populateEditRoomTypeDropdown();

    // Open the modal by removing the hidden class
    const modal = document.getElementById('ghst-edit-room-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
    }

    // Close any open dropdowns (action menu)
    HMS.closeAllDropdowns();
  },

  /**
   * Closes the edit room modal.
   */
  closeEditRoomModal() {
    const modal = document.getElementById('ghst-edit-room-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('ghst-edit-room-form').reset();
    }
    this.currentEditingRoomId = null;
    this.refreshModalScrollLock();
  },

  /**
   * Handles the submission of the edit room form.
   * Validates input, updates the room data, and provides feedback via toast.
   * 
   * @param {Event} event - The form submission event
   */
  handleEditRoomSubmit(event) {
    event.preventDefault();

    // Validate that a room is selected for editing
    if (!this.currentEditingRoomId) {
      HMS.showToast({
        message: 'No room selected for editing',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    // Retrieve form values
    const roomNumber = document.getElementById('ghst-edit-room-number').value;
    const roomTypeId = document.getElementById('ghst-edit-room-type').value;
    const price = parseFloat(document.getElementById('ghst-edit-room-price').value);
    const capacity = parseInt(document.getElementById('ghst-edit-room-capacity').value);
    const status = document.getElementById('ghst-edit-room-status').value;

    // Find the selected room type
    const roomType = this.roomTypes.find(type => type.id === roomTypeId);

    // Validate room type selection
    if (!roomType) {
      HMS.showToast({
        message: 'Invalid room type selected',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    // Find and update the room in the data array
    const roomIndex = this.data.findIndex(r => r.id === this.currentEditingRoomId);
    if (roomIndex !== -1) {
      const oldRoomNumber = this.data[roomIndex].roomNumber;
      
      // Update room with new values
      this.data[roomIndex] = {
        ...this.data[roomIndex],
        roomNumber: roomNumber,
        roomType: roomType,
        price: price,
        capacity: capacity,
        status: status,
      };

      // Re-render the rooms table to show updated data
      this.render();
      
      // Close the edit modal
      this.closeEditRoomModal();
      
      // Display success toast
      HMS.showToast({
        message: `Room ${oldRoomNumber} has been updated successfully`,
        variant: 'success',
        duration: 3000,
      });

      console.log('Room Updated:', this.data[roomIndex]);
    }
  },

  /**
   * Opens the confirmation dialog for deleting a room and handles the deletion.
   * If confirmed, removes the room from the data and displays a success toast.
   * 
   * @param {string} roomId - The ID of the room to delete
   */
  async deleteRoom(roomId) {
    // Find the room to get its number for the confirmation message
    const room = this.data.find(r => r.id === roomId);
    if (!room) {
      HMS.showToast({
        message: 'Room not found',
        variant: 'error',
        duration: 3000,
      });
      return;
    }

    // Show confirmation dialog
    const isConfirmed = await HMS.showConfirmDialog({
      title: 'Delete Room',
      message: `Are you sure you want to delete room ${room.roomNumber}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    // Handle confirmation result
    if (isConfirmed) {
      // Remove the room from the data array
      this.data = this.data.filter(r => r.id !== roomId);
      
      // Re-render the table to reflect changes
      this.render();
      
      // Display success toast
      HMS.showToast({
        message: `Room ${room.roomNumber} has been deleted successfully`,
        variant: 'success',
        duration: 3000,
      });
      
      console.log('Room Deleted:', roomId);
    } else {
      // User cancelled the deletion
      HMS.showToast({
        message: 'Room deletion cancelled',
        variant: 'info',
        duration: 2000,
      });
    }

    // Close any open dropdowns
    HMS.closeAllDropdowns();
  },
};
