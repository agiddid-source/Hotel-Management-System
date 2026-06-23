/**
 * ============================================
 * HMS Sidebar Module
 * ============================================
 * 
 * Handles the sidebar navigation, mobile responsiveness,
 * and active-state management.
 * 
 * HOW IT WORKS:
 * - On desktop (≥1024px): Sidebar is always visible.
 * - On mobile (<1024px): Sidebar slides in/out with an overlay.
 * - Clicking a nav link calls Router.navigate() to swap page content.
 * 
 * Dependencies: components.js (HMS object), router.js (Router object)
 * 
 * @author HMS Team
 */

const Sidebar = {

  /** @type {string} Path to the JSON nav configuration scaffold */
  navConfigPath: './data/sidebar-nav.json',

  /** @type {Object} Fallback navigation structure used when JSON is unavailable */
  fallbackNavConfig: {
    brand: {
      name: 'HMS',
      subtitle: 'Hotel Manager',
    },
    sections: [
      {
        label: 'Main Menu',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
          { id: 'rooms', label: 'Rooms', icon: 'rooms' },
          { id: 'reservations', label: 'Reservations', icon: 'reservations' },
          { id: 'guests', label: 'Guests', icon: 'guests' },
          { id: 'payments', label: 'Payments', icon: 'payments' },
          { id: 'inventory', label: 'Inventory', icon: 'inventory' },
        ],
      },
      {
        label: 'System',
        items: [
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ],
      },
    ],
    profile: {
      name: 'Marcus Reed',
      role: 'Hotel Manager',
    },
  },

  /** @type {Object} Resolved navigation config */
  navConfig: null,

  /** @type {string} Currently active page ID */
  currentPage: 'dashboard',

  /** @type {boolean} Whether the mobile sidebar is currently open */
  isOpen: false,

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize the Sidebar module.
   * Renders the sidebar HTML, binds event listeners,
   * and highlights the default active page.
   */
  async init() {
    await this.loadNavConfig();
    this.render();
    this.bindEvents();
    this.setActive(this.currentPage);
  },

  /**
   * Load the sidebar navigation from JSON when available.
   * The fallback keeps the UI functional until the JSON file is
   * expanded by another collaborator.
   */
  async loadNavConfig() {
    try {
      const response = await fetch(this.navConfigPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const config = await response.json();
      if (!config || !Array.isArray(config.sections)) {
        throw new Error('Invalid sidebar navigation config');
      }

      this.navConfig = {
        ...this.fallbackNavConfig,
        ...config,
        sections: config.sections,
      };
    } catch (err) {
      console.warn('[Sidebar] Using fallback navigation config:', err);
      this.navConfig = this.fallbackNavConfig;
    }
  },

  // ============================================
  // RENDERING
  // ============================================

  /**
   * Render the complete sidebar HTML.
   * Includes: Logo, Navigation Links, and User Profile.
   */
  render() {
    const sidebar = document.getElementById('ghst-sidebar');
    if (!sidebar) return;

    const sections = this.navConfig?.sections || this.fallbackNavConfig.sections;
    const brand = this.navConfig?.brand || this.fallbackNavConfig.brand;
    const profile = this.navConfig?.profile || this.fallbackNavConfig.profile;

    const navHtml = sections.map((section, sectionIndex) => {
      const itemsHtml = section.items.map((item) => `
        <a href="#${item.id}" id="ghst-nav-${item.id}" 
           class="ghst-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-content-sec hover:bg-surface-hover hover:text-content-main group"
           data-page="${item.id}"
           data-source="${item.source || ''}"
           onclick="Router.navigate('${item.id}'); Sidebar.onNavClick(); return false;">
          <span class="ghst-nav-icon flex-shrink-0 text-content-muted group-hover:text-content-sec transition-colors duration-200">${HMS.getIcon(item.icon)}</span>
          <span class="flex-1">${item.label}</span>
          ${item.badge ? `<span class="rounded-full border border-outline bg-surface-elevated px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-content-muted">${item.badge}</span>` : ''}
        </a>
      `).join('');

      const sectionLabel = section.label
        ? `<p class="px-4 mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-content-muted">${section.label}</p>`
        : '';

      return `
        <div class="${sectionIndex > 0 ? 'mt-5' : ''}">
          ${sectionLabel}
          <div class="space-y-1">${itemsHtml}</div>
        </div>
      `;
    }).join('');

    // Assemble the full sidebar
    sidebar.innerHTML = `
      <!-- Logo Section -->
      <div class="px-6 py-6 border-b border-outline">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm shadow-brand/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <h1 class="text-base font-bold text-content-main tracking-tight">${brand.name}</h1>
              <p class="text-[10px] font-medium text-content-muted uppercase tracking-[0.22em]">${brand.subtitle}</p>
            </div>
          </div>
          <button id="ghst-sidebar-close" class="md:hidden p-2 rounded-lg text-content-muted hover:bg-surface-hover hover:text-content-main transition-colors ghst-btn-tactile" aria-label="Close menu">${HMS.getIcon('x')}</button>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto ghst-hide-scrollbar py-4 px-3 flex flex-col gap-1">
        ${navHtml}
      </nav>

      <!-- Bottom Section: User Profile -->
      <div class="px-3 py-4 border-t border-outline">
        <div class="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-surface-card border border-outline">
          ${HMS.createAvatar(profile.name, 'sm')}
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-content-main truncate">${profile.name}</p>
            <p class="text-xs text-content-muted truncate">${profile.role}</p>
          </div>
        </div>
      </div>
    `;
  },

  // ============================================
  // ACTIVE STATE MANAGEMENT
  // ============================================

  /**
   * Set the visual active state on a navigation item.
   * Removes active styling from all items, then applies it
   * to the selected one.
   * 
   * @param {string} pageId - The page ID to mark as active
   */
  setActive(pageId) {
    // Step 1: Remove active state from ALL nav items
    document.querySelectorAll('.ghst-nav-item').forEach(el => {
      el.classList.remove('bg-brand', 'text-white', 'shadow-md', 'shadow-brand/20');
      el.classList.add('text-content-sec');

      const icon = el.querySelector('.ghst-nav-icon');
      if (icon) {
        icon.classList.remove('text-white');
        icon.classList.add('text-content-muted');
      }
    });

    // Step 2: Apply active state to the selected nav item
    const activeLink = document.getElementById(`ghst-nav-${pageId}`);
    if (activeLink) {
      activeLink.classList.remove('text-content-sec');
      activeLink.classList.add('bg-brand', 'text-white', 'shadow-md', 'shadow-brand/20');

      const icon = activeLink.querySelector('.ghst-nav-icon');
      if (icon) {
        icon.classList.remove('text-content-muted', 'group-hover:text-content-sec');
        icon.classList.add('text-white');
      }
    }

    this.currentPage = pageId;
  },

  // ============================================
  // NAVIGATION HELPERS
  // ============================================

  /**
   * Called when a nav link is clicked.
   * On mobile, this closes the sidebar after navigation.
   */
  onNavClick() {
    if (window.innerWidth < 1024) {
      this.close();
    }
  },

  // ============================================
  // MOBILE SIDEBAR OPEN/CLOSE
  // ============================================

  /**
   * Open the mobile sidebar with a slide-in animation.
   */
  open() {
    this.isOpen = true;
    const sidebar = document.getElementById('ghst-sidebar');
    const overlay = document.getElementById('ghst-sidebar-overlay');

    if (sidebar) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
    }
    if (overlay) {
      overlay.classList.remove('hidden', 'opacity-0');
      overlay.classList.add('opacity-100');
    }
    document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
  },

  /**
   * Close the mobile sidebar with a slide-out animation.
   */
  close() {
    this.isOpen = false;
    const sidebar = document.getElementById('ghst-sidebar');
    const overlay = document.getElementById('ghst-sidebar-overlay');

    if (sidebar) {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('-translate-x-full');
    }
    if (overlay) {
      overlay.classList.add('opacity-0');
      // Wait for the CSS transition to finish before hiding
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
  },

  // ============================================
  // EVENT BINDING
  // ============================================

  /**
   * Bind all event listeners for sidebar interactions.
   */
  bindEvents() {
    // Mobile hamburger menu button
    const toggleBtn = document.getElementById('ghst-menu-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.open());
    }
    
    // Close button inside the sidebar
    const closeBtn = document.getElementById('ghst-sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Clicking the dark overlay closes the sidebar
    const overlay = document.getElementById('ghst-sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }
    
    // Handle window resize:
    // - Desktop: always show sidebar
    // - Mobile: hide sidebar if not explicitly opened
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        const sidebar = document.getElementById('ghst-sidebar');
        if (sidebar) {
          sidebar.classList.remove('-translate-x-full');
          sidebar.classList.add('translate-x-0');
        }
        const overlay = document.getElementById('ghst-sidebar-overlay');
        if (overlay) overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else if (!this.isOpen) {
        const sidebar = document.getElementById('ghst-sidebar');
        if (sidebar) {
          sidebar.classList.remove('translate-x-0');
          sidebar.classList.add('-translate-x-full');
        }
      }
    });
  },
};
