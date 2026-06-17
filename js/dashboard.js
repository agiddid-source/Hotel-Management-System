/**
 * ============================================
 * HMS Dashboard Module
 * ============================================
 *
 * Renders the dashboard overview page.
 * The layout is intentionally close to the submitted reference:
 * - compact page header actions
 * - 6 KPI cards
 * - occupancy panel + quick actions side by side
 * - recent reservations table
 *
 * Data sources:
 * - dashboard-kpis.json
 * - occupancy.json
 * - reservations.json
 * - quick-actions.json
 */

const Dashboard = {
  /** @type {Object} Dashboard data bundle */
  data: {
    kpis: [],
    occupancy: null,
    reservations: [],
    quickActions: [],
  },

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize the dashboard module.
   */
  async init() {
    this.setPageActions();
    await this.loadData();
    this.render();
    this.animateCounters();
  },

  /**
   * Inject dashboard-level actions into the page header.
   */
  setPageActions() {
    const actionsEl = document.getElementById('ghst-page-actions');
    if (!actionsEl) return;

    actionsEl.innerHTML = `
      <button class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-content-main bg-surface-elevated border border-outline rounded-lg hover:bg-surface-hover transition-colors ghst-btn-tactile">
        Export
      </button>
      <button onclick="Router.navigate('rooms')" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors shadow-sm shadow-brand/20 ghst-btn-tactile">
        New Reservation
      </button>
    `;
  },

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Load dashboard data from the local JSON files.
   */
  async loadData() {
    try {
      const [kpis, occupancy, reservations, quickActions] = await Promise.all([
        fetch('./data/dashboard-kpis.json').then((r) => r.json()),
        fetch('./data/occupancy.json').then((r) => r.json()),
        fetch('./data/reservations.json').then((r) => r.json()),
        fetch('./data/quick-actions.json').then((r) => r.json()),
      ]);

      this.data = { kpis, occupancy, reservations, quickActions };
    } catch (err) {
      console.error('[Dashboard] Failed to load data:', err);
      HMS.showToast({
        message: 'Dashboard data could not be loaded',
        variant: 'error',
        duration: 3000,
      });
    }
  },

  // ============================================
  // MAIN RENDER
  // ============================================

  /**
   * Render the dashboard layout into #main-content.
   */
  render() {
    const content = document.getElementById('ghst-main-content');
    if (!content) return;

    content.innerHTML = `
      <section class="space-y-8">
        <div class="space-y-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-heading font-semibold text-content-main">Overview</h2>
              <p class="mt-1 text-sm text-content-muted">Today's operational snapshot</p>
            </div>
            <span class="inline-flex items-center rounded-lg border border-outline bg-surface-card px-3 py-1.5 text-xs text-content-muted">
              Live · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            ${this.renderKPIs()}
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.95fr)_minmax(320px,0.95fr)] items-start">
          ${this.renderOccupancy()}
          ${this.renderQuickActions()}
        </div>

        ${this.renderReservations()}
      </section>
    `;
  },

  // ============================================
  // KPI CARDS
  // ============================================

  renderKPIs() {
    return (this.data.kpis || []).map((kpi, index) => {
      const isPrimary = kpi.id === 'revenue' || (index === 0 && !(this.data.kpis || []).some((item) => item.id === 'revenue'));
      const cardClasses = isPrimary
        ? 'bg-gradient-to-br from-brand to-brand/85 border-transparent text-white shadow-xl shadow-brand/20'
        : 'bg-surface-card border border-outline text-content-main';

      const labelColor = isPrimary ? 'text-white/90' : 'text-content-muted';
      const valueColor = isPrimary ? 'text-white' : 'text-content-main';
      const trendTextColor = isPrimary ? 'text-white/80' : 'text-content-muted';
      const trendPillBg = isPrimary
        ? 'bg-white/20 text-white'
        : kpi.trend?.direction === 'up'
          ? 'bg-emerald-500/10 text-emerald-500'
          : kpi.trend?.direction === 'down'
            ? 'bg-red-500/10 text-red-500'
            : 'bg-surface-elevated text-content-muted';

      const trendSign = kpi.trend?.direction === 'up' ? '+' : kpi.trend?.direction === 'down' ? '-' : '';

      return `
        <div class="bg-surface-card border border-outline rounded-xl p-5 hover:border-outline-hover transition-all duration-300 ghst-card-diffusion ghst-kpi-card relative overflow-hidden group" style="animation-delay: ${index * 80}ms">
          <div class="mb-5 flex items-center justify-between">
            <p class="text-sm font-medium ${labelColor}">${kpi.label}</p>
            <span class="text-lg ${labelColor}">${HMS.getIcon('moreVertical')}</span>
          </div>
          <div class="mb-4">
            <h3 class="text-3xl font-bold tracking-tight ${valueColor}">${kpi.value}</h3>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="rounded-full px-2.5 py-1 font-medium ${trendPillBg}">
              ${trendSign}${kpi.trend?.value || ''}
            </span>
            <span class="${trendTextColor}">${kpi.trend?.label || 'Than last month'}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  // ============================================
  // OCCUPANCY OVERVIEW
  // ============================================

  renderOccupancy() {
    const occ = this.data.occupancy;
    if (!occ) return '';

    const categories = (occ.categories || []).map((cat) => `
      <div class="py-2">
        <div class="flex items-center justify-between gap-3 text-sm">
          <div class="flex min-w-0 items-center gap-2.5">
            <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" style="background-color: ${cat.color}"></span>
            <span class="font-medium text-content-main">${cat.label}</span>
          </div>
          <div class="flex items-center gap-2 text-right">
            <span class="font-semibold text-content-main">${cat.count}</span>
            <span class="text-xs text-content-muted">${cat.percentage}%</span>
          </div>
        </div>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
          <div class="h-full bg-brand rounded-full ghst-occupancy-bar transition-all duration-1000 ease-out relative overflow-hidden" data-width="${cat.percentage}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="rounded-2xl border border-outline bg-surface-card p-6 card-diffusion">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-base font-semibold text-content-main">Occupancy Overview</h3>
            <p class="mt-1 text-sm text-content-muted">${occ.total} total rooms</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-content-main">${occ.occupancyRate}%</p>
            <p class="text-[11px] text-content-muted">Occupancy Rate</p>
          </div>
        </div>

        <div class="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div class="relative mx-auto flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 160 160" class="h-full w-full -rotate-90 transform">
              ${this.renderDonutChart(occ.categories || [], occ.total || 1)}
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-4xl font-bold text-content-main">${occ.occupancyRate}%</span>
              <span class="text-xs uppercase tracking-[0.18em] text-content-muted">Occupied</span>
            </div>
          </div>

          <div class="space-y-4">${categories}</div>
        </div>
      </div>
    `;
  },

  /**
   * Render the SVG donut chart segments.
   */
  renderDonutChart(categories, total) {
    const cx = 80;
    const cy = 80;
    const radius = 62;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (categories || []).map((cat, i) => {
      const fraction = total > 0 ? cat.count / total : 0;
      const dashLength = fraction * circumference;
      const gap = circumference - dashLength;
      const currentOffset = offset;
      offset += dashLength;

      return `
        <circle cx="${cx}" cy="${cy}" r="${radius}"
          fill="none" stroke="${cat.color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${dashLength} ${gap}"
          stroke-dashoffset="-${currentOffset}"
          stroke-linecap="round"
          style="animation: donutAppear 1s ease-out ${i * 200}ms both;" />
      `;
    }).join('');
  },

  // ============================================
  // QUICK ACTIONS
  // ============================================

  renderQuickActions() {
    const colors = {
      blue: { bg: 'bg-brand/10', text: 'text-brand', border: 'border-brand/20', hover: 'hover:bg-brand/15 hover:border-brand/30' },
      green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', hover: 'hover:bg-emerald-500/15 hover:border-emerald-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', hover: 'hover:bg-amber-500/15 hover:border-amber-500/30' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', hover: 'hover:bg-purple-500/15 hover:border-purple-500/30' },
    };

    const actionsHtml = (this.data.quickActions || []).map((action) => {
      const theme = colors[action.color] || colors.blue;
      return `
        <button onclick="Dashboard.handleQuickAction('${action.id}')" class="group flex w-full items-center gap-4 rounded-2xl border ${theme.border} ${theme.bg} px-5 py-4 text-left transition-all duration-200 btn-tactile ${theme.hover}">
          <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${theme.text}">
            ${HMS.getIcon(action.icon)}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-content-main">${action.label}</p>
            <p class="mt-0.5 text-xs text-content-muted">${action.description}</p>
          </div>
        </button>
      `;
    }).join('');

    return `
      <div class="rounded-2xl border border-outline bg-surface-card p-6 card-diffusion">
        <div class="mb-5">
          <h3 class="text-base font-semibold text-content-main">Quick Actions</h3>
          <p class="mt-1 text-sm text-content-muted">Common operations</p>
        </div>
        <div class="space-y-3">${actionsHtml}</div>
      </div>
    `;
  },

  /**
   * Handle quick action clicks from the dashboard.
   */
  handleQuickAction(actionId) {
    if (actionId === 'new-reservation' || actionId === 'add-room') {
      Router.navigate('rooms');
      return;
    }

    if (actionId === 'check-in' || actionId === 'check-out') {
      Router.navigate('rooms');
      HMS.showToast({
        message: 'Room operations are handled from the Rooms page in this build.',
        variant: 'info',
        duration: 2600,
      });
    }
  },

  // ============================================
  // RECENT RESERVATIONS
  // ============================================

  renderReservations() {
    const rows = (this.data.reservations || []).slice(0, 10).map((res) => `
      <tr class="border-t border-outline/80 transition-colors duration-150 hover:bg-surface-hover/60">
        <td class="px-4 py-4">
          <div class="flex items-center gap-3">
            ${HMS.createAvatar(res.guestName, 'sm')}
            <div>
              <p class="text-sm font-medium text-content-main">${res.guestName}</p>
              <p class="text-xs text-content-muted">${res.id}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-4">
          <p class="text-sm font-medium text-content-main">${res.room}</p>
          <p class="text-xs text-content-muted">${res.roomType}</p>
        </td>
        <td class="px-4 py-4 text-sm text-content-sec">${this.formatDate(res.checkIn)}</td>
        <td class="px-4 py-4 text-sm text-content-sec">${this.formatDate(res.checkOut)}</td>
        <td class="px-4 py-4">${HMS.getStatusBadge(res.status)}</td>
        <td class="px-4 py-4 text-sm font-semibold text-content-main">${res.amount}</td>
        <td class="px-4 py-4">
          <button class="p-1.5 text-content-muted hover:text-content-main hover:bg-surface-hover rounded-md transition-colors ghst-btn-tactile">
            ${HMS.getIcon('moreVertical')}
          </button>
        </td>
      </tr>
    `).join('');

    return `
      <div class="overflow-hidden rounded-2xl border border-outline bg-surface-card ghst-card-diffusion">
        <div class="flex items-center justify-between gap-4 border-b border-outline px-6 py-5">
          <div>
            <h3 class="text-base font-semibold text-content-main">Recent Reservations</h3>
            <p class="mt-1 text-sm text-content-muted">${this.data.reservations.length} reservations</p>
          </div>
          <button onclick="Router.navigate('rooms')" class="ghst-btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-brand transition-colors hover:text-brand-hover">
            View All →
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[840px]">
            <thead>
              <tr class="text-left">
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Guest</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Room</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Check In</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Check Out</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Status</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">Amount</th>
                <th class="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline/80">${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Format an ISO date string into a human-readable label.
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  // ============================================
  // ANIMATIONS
  // ============================================

  animateCounters() {
    setTimeout(() => {
      document.querySelectorAll('.ghst-occupancy-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 300);

    document.querySelectorAll('.ghst-kpi-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, 100 + index * 80);
    });
  },
};
