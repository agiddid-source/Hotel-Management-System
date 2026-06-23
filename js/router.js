/**
 * ============================================
 * HMS Router Module
 * ============================================
 * 
 * A lightweight Single Page Application (SPA) router for the HMS.
 * 
 * HOW IT WORKS:
 * 1. Each "page" is a JavaScript module (e.g., Dashboard, Rooms).
 * 2. When a user clicks a sidebar link, the Router swaps the content
 *    inside the <main> area WITHOUT reloading the browser page.
 * 3. The URL hash (#dashboard, #rooms, etc.) is updated so users can
 *    bookmark or share links to specific pages.
 * 
 * ADDING A NEW PAGE:
 * 1. Create a new JS file in /js/ (e.g., js/mypage.js).
 * 2. The module must have an `init()` method.
 * 3. Register it in the `routes` object below.
 * 4. Add the <script> tag in index.html.
 * 5. Add the nav item in sidebar.js.
 * 
 * Dependencies: None (standalone module)
 * 
 * @author HMS Team
 */

const Router = {

  // ============================================
  // ROUTE REGISTRY
  // Each key is a page ID that maps to a page config.
  // ============================================
  routes: {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of hotel performance and room status.', module: () => Dashboard },
    rooms: { title: 'Rooms', subtitle: 'Manage hotel rooms, availability, and reservations.', module: () => Rooms },
    reservations: { title: 'Reservations', subtitle: 'Track arrivals, departures, and stay details.', module: () => Reservations },
    guests: { title: 'Guests', subtitle: 'Review guest profiles and visit history.', module: () => Guests },
    payments: { title: 'Payments', subtitle: 'Monitor invoices, balances, and transactions.', module: () => Payments },
    inventory: { title: 'Inventory', subtitle: 'Manage hotel supplies and stock levels.', module: () => Inventory },
    staff: { title: 'Staff', subtitle: 'Manage staff accounts and role assignments.', module: () => Staff, permission: 'staff_management' },
    settings: { title: 'Settings', subtitle: 'Configure hotel preferences and system controls.', module: () => Settings },
  },

  /** @type {string} The currently active page ID */
  currentPage: 'dashboard',

  /**
   * Initialize the Router.
   * Reads the URL hash to determine the starting page,
   * then navigates to it.
   */
  async init() {
    console.log('[Router] Initializing...');
    // Check the URL hash for a starting page.
    const hash = window.location.hash.replace('#', '');
    const startPage = this.routes[hash] ? hash : 'dashboard';

    // Listen for browser back/forward navigation
    window.addEventListener('hashchange', () => {
      const newPage = window.location.hash.replace('#', '');
      if (this.routes[newPage] && newPage !== this.currentPage) {
        this.navigate(newPage);
      }
    });

    // Navigate to the starting page
    await this.navigate(startPage);
    console.log(`[Router] Initial page: ${startPage}`);
  },

  /**
   * Navigate to a specific page.
   * This is the main method called by sidebar links.
   *
   * @param {string} pageId - The page identifier (for example, 'rooms').
   */
  async navigate(pageId) {
    console.log(`[Router] Navigating to: ${pageId}`);
    const route = this.routes[pageId];
    if (!route) {
      console.warn(`[Router] Unknown page: "${pageId}"`);
      return;
    }

    // RBAC guard: block direct hash navigation to a page the current
    // user doesn't have permission for (e.g. typing #staff in the URL
    // bar even if the sidebar link is hidden). Relies on hasPermission()
    // from auth-access-control/js/roles/roleGuard.js, loaded before
    // this script in dashboard.html.
    if (
      route.permission &&
      (typeof hasPermission !== 'function' || !hasPermission(route.permission))
    ) {
      console.warn(`[Router] Access denied to "${pageId}" — redirecting to 403.`);
      window.location.href = (typeof AUTH_BASE !== 'undefined' ? AUTH_BASE : '') + '403.html';
      return;
    }

    // Update the current page tracker
    this.currentPage = pageId;

    // Update the URL hash (without triggering hashchange again)
    window.location.hash = pageId;

    // Update the page header
    this.updatePageHeader(route.title, route.subtitle);

    // Update the sidebar active state
    Sidebar.setActive(pageId);

    // Clear the content area and show a loading skeleton
    const contentArea = document.getElementById('ghst-main-content');
    if (contentArea) {
      contentArea.innerHTML = this.renderSkeleton();
      console.log('[Router] Skeleton rendered.');
    }

    // Initialize the page module
    // Each module's init() is async — it fetches data, then renders.
    try {
      const pageModule = route.module();
      console.log(`[Router] Initializing module for ${pageId}...`);
      await pageModule.init();
    } catch (err) {
      console.error(`[Router] Failed to initialize page "${pageId}":`, err);
      if (contentArea) {
        contentArea.innerHTML = this.renderError(pageId);
      }
    }
  },

  /**
   * Update the page header section (title + subtitle).
   * Also updates the <title> tag for browser tabs.
   * 
   * @param {string} title - Page title (e.g., "Rooms")
   * @param {string} subtitle - Page subtitle description
   */
  updatePageHeader(title, subtitle) {
    // Update the header breadcrumb title
    const pageTitleEl = document.getElementById('ghst-page-title');
    if (pageTitleEl) {
      pageTitleEl.textContent = title;
    }

    // Update the hero section (large title + subtitle)
    const heroTitleEl = document.getElementById('ghst-hero-title');
    const heroSubtitleEl = document.getElementById('ghst-hero-subtitle');

    if (heroTitleEl) heroTitleEl.textContent = title;
    if (heroSubtitleEl) heroSubtitleEl.textContent = subtitle;

    // Update the browser tab title
    document.title = `HMS — ${title}`;
  },

  /**
   * Render a loading skeleton while page data is being fetched.
   * This provides visual feedback so the UI doesn't feel empty.
   * 
   * @returns {string} HTML string of skeleton loaders
   */
  renderSkeleton() {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="ghst-skeleton h-[100px]"></div>
        <div class="ghst-skeleton h-[100px]"></div>
        <div class="ghst-skeleton h-[100px]"></div>
        <div class="ghst-skeleton h-[100px]"></div>
      </div>
      <div class="ghst-skeleton h-[400px]"></div>
    `;
  },

  /**
   * Render an error message when a page fails to load.
   * 
   * @param {string} pageId - The page that failed
   * @returns {string} HTML string of error UI
   */
  renderError(pageId) {
    return `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-content-main mb-1">Page Load Error</h3>
        <p class="text-sm text-content-muted">Failed to load the "${pageId}" module. Check the console for details.</p>
        <button onclick="Router.navigate('dashboard')" class="mt-4 px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors ghst-btn-tactile">
          Return to Dashboard
        </button>
      </div>
    `;
  },
};