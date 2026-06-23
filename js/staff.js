/**
 * ============================================
 * HMS Staff Module
 * ============================================
 *
 * Handles staff account management: listing, search/filter,
 * adding, editing, and activating/deactivating staff.
 *
 * Data layer simulates a REST API:
 * - GET    -> fetch('./data/staffs.json'), cached in localStorage
 * - POST   -> saveStaffs() logs the request body, persists to the
 *             localStorage mock DB
 *
 * Dependencies: components.js (HMS object), router.js (Router object)
 *
 * @author Code Nexus
 */

const STAFF_ENDPOINT  = './data/staffs.json';
const STAFF_CACHE_KEY = 'hms_dashboard_staffs';

const Staff = {

  /** @type {Array} All staff records currently loaded */
  data: [],

  /** @type {string|null} ID of the staff member currently being edited */
  currentEditingStaffId: null,

  /** @type {boolean} Ensures shared modal listeners are attached once */
  modalEventsBound: false,

  /** @type {boolean} Ensures the Escape key handler is attached once */
  escapeKeyBound: false,

  /** @type {Array<string>} Modal element IDs managed by this page */
  modalIds: ['cn-add-staff-modal', 'cn-edit-staff-modal'],

  roleLabels: {
    admin:           'Admin',
    manager:         'Manager',
    receptionist:    'Receptionist',
    housekeeper:     'Housekeeper',
    inventory_staff: 'Inventory Staff',
  },

  
  // INITIALIZATION

  /**
   * Initialize the Staff module. Called by Router.navigate('staff').
   */
  async init() {
    // Defense-in-depth: even if Router's permission check is bypassed,
    // refuse to render for an unauthorized user. requirePermission()
    // redirects to 403.html internally if the check fails.
    if (typeof requirePermission === 'function') {
      requirePermission('staff_management');
    }

    this.setPageActions();
    await this.loadData();
    this.render();
    this.bindModalEvents();
  },

  /**
   * Set the action buttons in the page header.
   */
  setPageActions() {
    const actionsEl = document.getElementById('ghst-page-actions');
    if (actionsEl) {
      actionsEl.innerHTML = `
        ${HMS.createButton('Add Staff', 'primary', { icon: 'plus-circle', onclick: 'Staff.openAddStaffModal()' })}
      `;
    }
  },

  /**
   * Keep the page from scrolling while any modal is open.
   */
  refreshModalScrollLock() {
    const anyModalOpen = this.modalIds.some((modalId) => {
      const modal = document.getElementById(modalId);
      return modal && !modal.classList.contains('hidden');
    });
    document.body.classList.toggle('ghst-modal-open', anyModalOpen);
  },

  /**
   * Close whichever Staff modal is currently visible (used for Escape key).
   */
  closeTopMostModal() {
    for (const modalId of ['cn-edit-staff-modal', 'cn-add-staff-modal']) {
      const modal = document.getElementById(modalId);
      if (modal && !modal.classList.contains('hidden')) {
        if (modalId === 'cn-edit-staff-modal') this.closeEditStaffModal();
        if (modalId === 'cn-add-staff-modal') this.closeAddStaffModal();
        return;
      }
    }
  },

  
  // DATA LAYER (simulated REST API)

  /**
   * GET /staffs — fetch from local JSON, cached in localStorage as a
   * mock database so edits persist across navigations.
   */
  async getStaffs() {
    const cached = localStorage.getItem(STAFF_CACHE_KEY);
    if (cached) return JSON.parse(cached);

    try {
      const response = await fetch(STAFF_ENDPOINT);
      if (!response.ok) throw new Error(`Failed to fetch staffs: ${response.status}`);
      const staffs = await response.json();
      localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(staffs));
      return staffs;
    } catch (err) {
      console.error('[Staff] getStaffs() error:', err);
      return [];
    }
  },

  /**
   * PUT /staffs — logs the simulated request body, persists to the
   * localStorage mock DB.
   */
  async saveStaffs(staffs) {
    console.log('PUT /staffs (mock request body):', staffs);
    localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(staffs));
    return Promise.resolve(staffs);
  },

  /**
   * DEV ONLY: clears the mock DB cache so the next getStaffs() call
   * re-fetches the original seed data from staffs.json.
   */
  resetStaffs() {
    localStorage.removeItem(STAFF_CACHE_KEY);
  },

  async loadData() {
    this.data = await this.getStaffs();
  },

  
  // MAIN RENDER

  render() {
    const content = document.getElementById('ghst-main-content');
    if (!content) return;

    const total    = this.data.length;
    const active   = this.data.filter(s => s.status === 'active').length;
    const inactive = total - active;
    const roles    = [...new Set(this.data.map(s => s.role))].length;

    content.innerHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        ${this.renderStatCard('Total Staff', total, 'guests', 'text-brand')}
        ${this.renderStatCard('Active', active, 'plus-circle', 'text-emerald-500')}
        ${this.renderStatCard('Inactive', inactive, 'x', 'text-red-500')}
        ${this.renderStatCard('Roles Assigned', roles, 'settings', 'text-brand')}
      </div>

      <div class="bg-surface-card border border-outline rounded-xl overflow-visible card-diffusion">

        <div class="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-outline">

          <div class="relative flex-1 max-w-sm">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">${HMS.getIcon('search')}</span>
            <input type="text" id="cn-staff-search-input" placeholder="Search by name, email or role..."
              class="w-full bg-surface-card border border-outline rounded-lg pl-10 pr-4 py-2.5 min-h-[44px] text-sm text-content-main placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
            >
          </div>

          <select id="cn-staff-role-filter"
            class="bg-surface-card border border-outline rounded-lg px-4 py-2.5 min-h-[44px] text-sm text-content-main focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="housekeeper">Housekeeper</option>
            <option value="inventory_staff">Inventory Staff</option>
          </select>

          <select id="cn-staff-status-filter"
            class="bg-surface-card border border-outline rounded-lg px-4 py-2.5 min-h-[44px] text-sm text-content-main focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button id="cn-staff-reset-demo-btn" type="button" title="Dev only: reset mock data to original seed"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium bg-surface-elevated hover:bg-surface-hover text-content-sec border border-outline rounded-lg transition-all btn-tactile"
          >
            Reset Demo Data
          </button>

        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead>
              <tr class="text-left">
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Role</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody id="cn-staff-table-body">
              ${this.renderStaffRows(this.data)}
            </tbody>
          </table>
        </div>

        <p id="cn-staff-result-count" class="px-6 py-3 text-xs text-content-muted border-t border-outline"></p>

      </div>
    `;

    this.bindFilterEvents();
    this.bindResetButton();
    this.updateResultCount(this.data.length);
  },

  renderStatCard(label, value, icon, colorClass) {
    return HMS.createCard(`
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center flex-shrink-0 ${colorClass}">
          ${HMS.getIcon(icon)}
        </div>
        <div>
          <p class="text-2xl font-bold text-content-main font-heading">${value}</p>
          <p class="text-xs text-content-muted">${label}</p>
        </div>
      </div>
    `, { variant: 'kpi' });
  },


  // TABLE RENDERING

  renderStaffRows(staffList) {
    if (staffList.length === 0) {
      return `
        <tr>
          <td colspan="5" class="text-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-content-muted">
                ${HMS.getIcon('guests')}
              </div>
              <p class="font-medium text-content-main text-sm">No staff members found</p>
              <p class="text-content-muted text-xs">Try adjusting your search or filters.</p>
            </div>
          </td>
        </tr>
      `;
    }

    return staffList.map(staff => {
      const toggleOnclick = `Staff.toggleStatus('${staff.id}')`;
      const editOnclick   = `Staff.openEditStaffModal('${staff.id}')`;
      const statusVariant = staff.status === 'active' ? 'success' : 'danger';
      const statusLabel   = staff.status === 'active' ? 'Active' : 'Inactive';

      return `
        <tr class="border-t border-outline hover:bg-surface-hover transition-colors duration-150">

          <td class="px-4 py-3.5">
            <div class="flex items-center gap-3">
              ${HMS.createAvatar(staff.name, 'sm')}
              <span class="text-sm font-medium text-content-main">${staff.name}</span>
            </div>
          </td>

          <td class="px-4 py-3.5 text-sm text-content-sec">${staff.email}</td>

          <td class="px-4 py-3.5 text-sm text-content-sec">${this.roleLabels[staff.role] || staff.role}</td>

          <td class="px-4 py-3.5">${HMS.createBadge(statusLabel, statusVariant)}</td>

          <td class="px-4 py-3.5">
            <div class="flex justify-end">
              ${HMS.createDropdown(HMS.getIcon('moreVertical'), [
                { label: 'Edit', onclick: editOnclick },
                { label: staff.status === 'active' ? 'Deactivate' : 'Activate', onclick: toggleOnclick },
              ], { align: 'right', id: 'staff-actions-' + staff.id, hideChevron: true })}
            </div>
          </td>

        </tr>
      `;
    }).join('');
  },

  updateResultCount(count) {
    const el = document.getElementById('cn-staff-result-count');
    if (el) {
      el.textContent = count === 0
        ? ''
        : `Showing ${count} staff member${count !== 1 ? 's' : ''}`;
    }
  },

  // SEARCH & FILTER

  bindFilterEvents() {
    const searchInput  = document.getElementById('cn-staff-search-input');
    const roleFilter    = document.getElementById('cn-staff-role-filter');
    const statusFilter  = document.getElementById('cn-staff-status-filter');

    const apply = () => this.applyFilters();

    if (searchInput)  searchInput.addEventListener('input', apply);
    if (roleFilter)   roleFilter.addEventListener('change', apply);
    if (statusFilter) statusFilter.addEventListener('change', apply);
  },

  applyFilters() {
    const term   = (document.getElementById('cn-staff-search-input')?.value || '').toLowerCase().trim();
    const role   = document.getElementById('cn-staff-role-filter')?.value || '';
    const status = document.getElementById('cn-staff-status-filter')?.value || '';

    const filtered = this.data.filter(staff => {
      const matchesSearch =
        !term ||
        staff.name.toLowerCase().includes(term) ||
        staff.email.toLowerCase().includes(term) ||
        staff.role.toLowerCase().includes(term);

      const matchesRole   = !role || staff.role === role;
      const matchesStatus = !status || staff.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });

    const tableBody = document.getElementById('cn-staff-table-body');
    if (tableBody) tableBody.innerHTML = this.renderStaffRows(filtered);

    this.updateResultCount(filtered.length);
  },

  // TOGGLE STATUS (PUT /staffs/:id)

  async toggleStatus(staffId) {
    const staff = this.data.find(s => String(s.id) === String(staffId));
    if (!staff) {
      HMS.showToast({ message: 'Staff record not found', variant: 'error' });
      return;
    }

    const action = staff.status === 'active' ? 'deactivate' : 'activate';

    const isConfirmed = await HMS.showConfirmDialog({
      title: action === 'deactivate' ? 'Deactivate Staff' : 'Activate Staff',
      message: `Are you sure you want to ${action} ${staff.name}'s account?`,
      confirmText: action === 'deactivate' ? 'Deactivate' : 'Activate',
      cancelText: 'Cancel',
      variant: action === 'deactivate' ? 'danger' : 'info',
    });

    if (!isConfirmed) {
      HMS.closeAllDropdowns();
      return;
    }

    staff.status = staff.status === 'active' ? 'inactive' : 'active';

    await this.saveStaffs(this.data);
    this.render();

    HMS.showToast({
      message: `${staff.name} ${action}d successfully`,
      variant: 'success',
    });

    HMS.closeAllDropdowns();
  },

  // MODAL MANAGEMENT

  bindModalEvents() {
    if (!this.modalEventsBound) {

      const addStaffForm = document.getElementById('cn-add-staff-form');
      if (addStaffForm) {
        addStaffForm.addEventListener('submit', (e) => this.handleAddStaffSubmit(e));
      }

      const editStaffForm = document.getElementById('cn-edit-staff-form');
      if (editStaffForm) {
        editStaffForm.addEventListener('submit', (e) => this.handleEditStaffSubmit(e));
      }

      const addStaffPasswordToggle = document.getElementById('cn-add-staff-password-toggle');
      if (addStaffPasswordToggle) {
        addStaffPasswordToggle.addEventListener('click', () => {
          const input = document.getElementById('cn-add-staff-password');
          input.type = input.type === 'password' ? 'text' : 'password';
        });
      }

      if (!this.escapeKeyBound) {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') this.closeTopMostModal();
        });
        this.escapeKeyBound = true;
      }

      this.modalEventsBound = true;
    }
  },

  bindResetButton() {
    const btn = document.getElementById('cn-staff-reset-demo-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const isConfirmed = await HMS.showConfirmDialog({
        title: 'Reset Demo Data',
        message: 'This will discard all changes and restore the original seed data. Continue?',
        confirmText: 'Reset',
        cancelText: 'Cancel',
        variant: 'warning',
      });

      if (!isConfirmed) return;

      this.resetStaffs();
      this.data = await this.getStaffs();
      this.render();

      HMS.showToast({ message: 'Demo data reset', variant: 'info' });
    });
  },

  
  // ADD STAFF

  openAddStaffModal() {
    const modal = document.getElementById('cn-add-staff-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
      HMS.closeAllDropdowns();
    }
  },

  closeAddStaffModal() {
    const modal = document.getElementById('cn-add-staff-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('cn-add-staff-form')?.reset();
      this.refreshModalScrollLock();
    }
  },

  
  // LOADING TOAST HELPER
  // Shows a spinner toast while a save operation is in progress,
  // then removes it so the success/error toast can follow cleanly.
  

  showLoadingToast(message = 'Saving...') {
    const existing = document.getElementById('cn-staff-loading-toast');
    if (existing) existing.remove();

    let toastContainer = document.getElementById('ghst-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'ghst-toast-container';
      toastContainer.className = 'fixed top-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.id = 'cn-staff-loading-toast';
    toastEl.className = [
      'bg-surface-card border border-outline text-content-main',
      'rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg',
      'ghst-animate-slide-in-right pointer-events-auto min-h-[44px]',
      'backdrop-blur-sm',
    ].join(' ');

    toastEl.innerHTML = `
      <div class="flex-shrink-0 text-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          style="animation: spin 1s linear infinite;">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
      <div class="flex-1 text-sm font-medium">${message}</div>
    `;

    if (!document.getElementById('cn-spin-style')) {
      const style = document.createElement('style');
      style.id = 'cn-spin-style';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    toastContainer.appendChild(toastEl);
  },

  hideLoadingToast() {
    const el = document.getElementById('cn-staff-loading-toast');
    if (el) el.remove();
  },

  simulateDelay() {
    return new Promise(resolve =>
      setTimeout(resolve, Math.floor(Math.random() * 1000) + 2000)
    );
  },

  async handleAddStaffSubmit(event) {
    event.preventDefault();

    const fullName = document.getElementById('cn-add-staff-name').value.trim();
    const email    = document.getElementById('cn-add-staff-email').value.trim();
    const role     = document.getElementById('cn-add-staff-role').value;
    const password = document.getElementById('cn-add-staff-password').value;
    const status   = document.getElementById('cn-add-staff-status').value;

    if (!fullName || !email || !role || !password) {
      HMS.showToast({ message: 'Please fill in all required fields', variant: 'error' });
      return;
    }

    if (password.length < 8) {
      HMS.showToast({ message: 'Password must be at least 8 characters', variant: 'error' });
      return;
    }

    const duplicate = this.data.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      HMS.showToast({ message: 'A staff account with this email already exists', variant: 'error' });
      return;
    }

    const newStaff = {
      id: `STF-${Date.now()}`,
      name: fullName,
      email,
      role,
      status,
    };

    this.data.push(newStaff);

    // Show loading toast while simulating the POST /staffs request
    this.showLoadingToast('Creating staff account...');
    await this.simulateDelay();
    await this.saveStaffs(this.data);
    this.hideLoadingToast();

    this.render();
    this.closeAddStaffModal();

    HMS.showToast({ message: `${fullName} added successfully`, variant: 'success' });
  },

  
  // EDIT STAFF

  openEditStaffModal(staffId) {
    const staff = this.data.find(s => String(s.id) === String(staffId));
    if (!staff) {
      HMS.showToast({ message: 'Staff record not found', variant: 'error' });
      return;
    }

    this.currentEditingStaffId = staffId;

    document.getElementById('cn-edit-staff-name').value   = staff.name;
    document.getElementById('cn-edit-staff-email').value  = staff.email;
    document.getElementById('cn-edit-staff-role').value   = staff.role;
    document.getElementById('cn-edit-staff-status').value = staff.status;

    const bannerAvatar = document.getElementById('cn-edit-staff-avatar');
    const bannerName   = document.getElementById('cn-edit-staff-banner-name');
    const bannerEmail  = document.getElementById('cn-edit-staff-banner-email');

    if (bannerAvatar) bannerAvatar.innerHTML = HMS.createAvatar(staff.name, 'md');
    if (bannerName)   bannerName.textContent = staff.name;
    if (bannerEmail)  bannerEmail.textContent = staff.email;

    const modal = document.getElementById('cn-edit-staff-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
    }

    HMS.closeAllDropdowns();
  },

  closeEditStaffModal() {
    const modal = document.getElementById('cn-edit-staff-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('cn-edit-staff-form')?.reset();
    }
    this.currentEditingStaffId = null;
    this.refreshModalScrollLock();
  },

  async handleEditStaffSubmit(event) {
    event.preventDefault();

    if (!this.currentEditingStaffId) {
      HMS.showToast({ message: 'No staff selected for editing', variant: 'error' });
      return;
    }

    const updatedName   = document.getElementById('cn-edit-staff-name').value.trim();
    const updatedEmail  = document.getElementById('cn-edit-staff-email').value.trim();
    const updatedRole   = document.getElementById('cn-edit-staff-role').value;
    const updatedStatus = document.getElementById('cn-edit-staff-status').value;

    if (!updatedName || !updatedEmail || !updatedRole) {
      HMS.showToast({ message: 'Please fill in all required fields', variant: 'error' });
      return;
    }

    const duplicate = this.data.find(
      s => String(s.id) !== String(this.currentEditingStaffId) &&
      s.email.toLowerCase() === updatedEmail.toLowerCase()
    );

    if (duplicate) {
      HMS.showToast({ message: 'Another staff account already uses this email', variant: 'error' });
      return;
    }

    const staffIndex = this.data.findIndex(s => String(s.id) === String(this.currentEditingStaffId));
    if (staffIndex !== -1) {
      this.data[staffIndex] = {
        ...this.data[staffIndex],
        name: updatedName,
        email: updatedEmail,
        role: updatedRole,
        status: updatedStatus,
      };

      // Show loading toast while simulating the PUT /staffs/:id request
      this.showLoadingToast('Saving changes...');
      await this.simulateDelay();
      await this.saveStaffs(this.data);
      this.hideLoadingToast();

      this.render();
      this.closeEditStaffModal();

      HMS.showToast({ message: `${updatedName} updated successfully`, variant: 'success' });
    }
  },
};