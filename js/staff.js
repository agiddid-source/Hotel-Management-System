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
  modalIds: ['add-staff-modal', 'edit-staff-modal'],

  roleLabels: {
    admin:           'Admin',
    manager:         'Manager',
    receptionist:    'Receptionist',
    housekeeper:     'Housekeeper',
    inventory_staff: 'Inventory Staff',
  },

  // ============================================
  // INITIALIZATION
  // ============================================

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
    const actionsEl = document.getElementById('page-actions');
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
    document.body.classList.toggle('modal-open', anyModalOpen);
  },

  /**
   * Close whichever Staff modal is currently visible (used for Escape key).
   */
  closeTopMostModal() {
    for (const modalId of ['edit-staff-modal', 'add-staff-modal']) {
      const modal = document.getElementById(modalId);
      if (modal && !modal.classList.contains('hidden')) {
        if (modalId === 'edit-staff-modal') this.closeEditStaffModal();
        if (modalId === 'add-staff-modal') this.closeAddStaffModal();
        return;
      }
    }
  },

  // ============================================
  // DATA LAYER (simulated REST API)
  // ============================================

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

  // ============================================
  // MAIN RENDER
  // ============================================

  render() {
    const content = document.getElementById('main-content');
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
            <input type="text" id="staff-search-input" placeholder="Search by name, email or role..."
              class="w-full bg-surface-card border border-outline rounded-lg pl-10 pr-4 py-2.5 min-h-[44px] text-sm text-content-main placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
            >
          </div>

          <select id="staff-role-filter"
            class="bg-surface-card border border-outline rounded-lg px-4 py-2.5 min-h-[44px] text-sm text-content-main focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="housekeeper">Housekeeper</option>
            <option value="inventory_staff">Inventory Staff</option>
          </select>

          <select id="staff-status-filter"
            class="bg-surface-card border border-outline rounded-lg px-4 py-2.5 min-h-[44px] text-sm text-content-main focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button id="staff-reset-demo-btn" type="button" title="Dev only: reset mock data to original seed"
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
            <tbody id="staff-table-body">
              ${this.renderStaffRows(this.data)}
            </tbody>
          </table>
        </div>

        <p id="staff-result-count" class="px-6 py-3 text-xs text-content-muted border-t border-outline"></p>

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

  // ============================================
  // TABLE RENDERING
  // ============================================

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
    const el = document.getElementById('staff-result-count');
    if (el) {
      el.textContent = count === 0
        ? ''
        : `Showing ${count} staff member${count !== 1 ? 's' : ''}`;
    }
  },

  // ============================================
  // SEARCH & FILTER
  // ============================================

  bindFilterEvents() {
    const searchInput  = document.getElementById('staff-search-input');
    const roleFilter    = document.getElementById('staff-role-filter');
    const statusFilter  = document.getElementById('staff-status-filter');

    const apply = () => this.applyFilters();

    if (searchInput)  searchInput.addEventListener('input', apply);
    if (roleFilter)   roleFilter.addEventListener('change', apply);
    if (statusFilter) statusFilter.addEventListener('change', apply);
  },

  applyFilters() {
    const term   = (document.getElementById('staff-search-input')?.value || '').toLowerCase().trim();
    const role   = document.getElementById('staff-role-filter')?.value || '';
    const status = document.getElementById('staff-status-filter')?.value || '';

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

    const tableBody = document.getElementById('staff-table-body');
    if (tableBody) tableBody.innerHTML = this.renderStaffRows(filtered);

    this.updateResultCount(filtered.length);
  },

  // ============================================
  // TOGGLE STATUS (PUT /staffs/:id)
  // ============================================

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

  // ============================================
  // MODAL MANAGEMENT
  // ============================================

  bindModalEvents() {
    if (!this.modalEventsBound) {

      const addStaffForm = document.getElementById('add-staff-form');
      if (addStaffForm) {
        addStaffForm.addEventListener('submit', (e) => this.handleAddStaffSubmit(e));
      }

      const editStaffForm = document.getElementById('edit-staff-form');
      if (editStaffForm) {
        editStaffForm.addEventListener('submit', (e) => this.handleEditStaffSubmit(e));
      }

      const addStaffPasswordToggle = document.getElementById('add-staff-password-toggle');
      if (addStaffPasswordToggle) {
        addStaffPasswordToggle.addEventListener('click', () => {
          const input = document.getElementById('add-staff-password');
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
    const btn = document.getElementById('staff-reset-demo-btn');
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

  // ============================================
  // ADD STAFF
  // ============================================

  openAddStaffModal() {
    const modal = document.getElementById('add-staff-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
      HMS.closeAllDropdowns();
    }
  },

  closeAddStaffModal() {
    const modal = document.getElementById('add-staff-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('add-staff-form')?.reset();
      this.refreshModalScrollLock();
    }
  },

  async handleAddStaffSubmit(event) {
    event.preventDefault();

    const fullName = document.getElementById('add-staff-name').value.trim();
    const email    = document.getElementById('add-staff-email').value.trim();
    const role     = document.getElementById('add-staff-role').value;
    const password = document.getElementById('add-staff-password').value;
    const status   = document.getElementById('add-staff-status').value;

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

    // POST /staffs (simulated)
    await this.saveStaffs(this.data);

    this.render();
    this.closeAddStaffModal();

    HMS.showToast({ message: `${fullName} added successfully`, variant: 'success' });
  },

  // ============================================
  // EDIT STAFF
  // ============================================

  openEditStaffModal(staffId) {
    const staff = this.data.find(s => String(s.id) === String(staffId));
    if (!staff) {
      HMS.showToast({ message: 'Staff record not found', variant: 'error' });
      return;
    }

    this.currentEditingStaffId = staffId;

    document.getElementById('edit-staff-name').value   = staff.name;
    document.getElementById('edit-staff-email').value  = staff.email;
    document.getElementById('edit-staff-role').value   = staff.role;
    document.getElementById('edit-staff-status').value = staff.status;

    const bannerAvatar = document.getElementById('edit-staff-avatar');
    const bannerName   = document.getElementById('edit-staff-banner-name');
    const bannerEmail  = document.getElementById('edit-staff-banner-email');

    if (bannerAvatar) bannerAvatar.innerHTML = HMS.createAvatar(staff.name, 'md');
    if (bannerName)   bannerName.textContent = staff.name;
    if (bannerEmail)  bannerEmail.textContent = staff.email;

    const modal = document.getElementById('edit-staff-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshModalScrollLock();
    }

    HMS.closeAllDropdowns();
  },

  closeEditStaffModal() {
    const modal = document.getElementById('edit-staff-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.getElementById('edit-staff-form')?.reset();
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

    const updatedName   = document.getElementById('edit-staff-name').value.trim();
    const updatedEmail  = document.getElementById('edit-staff-email').value.trim();
    const updatedRole   = document.getElementById('edit-staff-role').value;
    const updatedStatus = document.getElementById('edit-staff-status').value;

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

      // PUT /staffs/:id (simulated)
      await this.saveStaffs(this.data);

      this.render();
      this.closeEditStaffModal();

      HMS.showToast({ message: `${updatedName} updated successfully`, variant: 'success' });
    }
  },
};