/**
 * HMS Component Library
 * Reusable UI components for the Hotel Management System
 */

const HMS = {
  // ============================================
  // ICONS - SVG icon map (inline SVGs)
  // ============================================
  icons: {
    // Navigation icons
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    rooms: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"/><path d="M21 7L12 2 3 7"/><path d="M9 22V12h6v10"/></svg>',
    reservations: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    guests: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    payments: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    inventory: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    
    // KPI icons
    building: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>',
    bed: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2-2v2"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    login: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    dollar: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    
    // Trend icons
    'trend-up': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'trend-down': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    'trend-neutral': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="15 8 19 12 15 16"/></svg>',
    
    // Action icons
    'plus-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    'arrow-right-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    'arrow-left-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg>',
    'plus-square': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    
    // UI icons
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    moreVertical: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  },

  // ============================================
  // GET ICON - returns SVG string
  // ============================================
  getIcon(name) {
    return this.icons[name] || '';
  },

  // ============================================
  // BADGE COMPONENT
  // ============================================
  createBadge(text, variant = 'neutral') {
    const variants = {
      success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      info: 'bg-brand/10 text-brand dark:text-brand border-brand/20',
      neutral: 'bg-surface-elevated text-content-sec border-outline',
    };
    const classes = variants[variant] || variants.neutral;
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}">${text}</span>`;
  },

  // ============================================
  // STATUS to Badge mapping
  // ============================================
  getStatusBadge(status) {
    const map = {
      'confirmed': { text: 'Confirmed', variant: 'info' },
      'checked-in': { text: 'Checked In', variant: 'success' },
      'checked-out': { text: 'Checked Out', variant: 'neutral' },
      'pending': { text: 'Pending', variant: 'warning' },
      'cancelled': { text: 'Cancelled', variant: 'danger' },
    };
    const config = map[status] || { text: status, variant: 'neutral' };
    return this.createBadge(config.text, config.variant);
  },

  // ============================================
  // AVATAR COMPONENT
  // ============================================
  createAvatar(name, size = 'md', imgSrc = null) {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-11 h-11 text-sm',
      lg: 'w-12 h-12 text-base',
    };
    const sizeClass = sizes[size] || sizes.md;
    
    if (imgSrc) {
      return `<img src="${imgSrc}" alt="${name}" class="${sizeClass} rounded-full object-cover border-2 border-outline" />`;
    }
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `<div class="${sizeClass} rounded-full flex items-center justify-center font-semibold bg-surface-elevated text-content-sec border border-outline">${initials}</div>`;
  },

  // ============================================
  // BUTTON COMPONENT
  // ============================================
  createButton(text, variant = 'primary', opts = {}) {
    const { icon, size = 'md', disabled = false, id = '', fullWidth = false, onclick = '' } = opts;
    
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-bg ghst-btn-tactile';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs min-h-[44px]',
      md: 'px-4 py-2.5 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[44px]',
    };
    
    const variantClasses = {
      primary: 'bg-brand hover:bg-brand-hover text-white focus:ring-brand shadow-lg shadow-brand/20',
      secondary: 'bg-surface-elevated hover:bg-surface-hover text-content-main border border-outline focus:ring-outline',
      ghost: 'hover:bg-surface-hover text-content-sec hover:text-content-main focus:ring-outline',
      destructive: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 focus:ring-red-500',
    };
    
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
    const widthClass = fullWidth ? 'w-full' : '';
    const idAttr = id ? `id="${id}"` : '';
    const onclickAttr = onclick ? `onclick="${onclick}"` : '';
    
    const iconHtml = icon ? `<span class="flex-shrink-0">${this.getIcon(icon)}</span>` : '';
    
    return `<button ${idAttr} class="${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClass}" ${disabled ? 'disabled' : ''} ${onclickAttr}>${iconHtml}${text}</button>`;
  },

  // ============================================
  // INPUT COMPONENT
  // ============================================
  createInput(opts = {}) {
    const { label, placeholder = '', type = 'text', id = '', helperText = '', error = '', disabled = false, icon = '' } = opts;
    
    const stateClasses = error 
      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-outline focus:border-brand focus:ring-brand/20';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    let html = '';
    if (label) {
      html += `<label class="block text-sm font-medium text-content-sec mb-1.5" ${id ? `for="${id}"` : ''}>${label}</label>`;
    }
    
    html += `<div class="relative">`;
    if (icon) {
      html += `<span class="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">${this.getIcon(icon)}</span>`;
    }
    html += `<input type="${type}" ${id ? `id="${id}"` : ''} placeholder="${placeholder}" class="w-full bg-surface-card border ${stateClasses} rounded-lg px-4 py-2.5 min-h-[44px] text-sm text-content-main placeholder:text-content-muted focus:outline-none focus:ring-2 transition-all duration-200 ${icon ? 'pl-10' : ''} ${disabledClasses}" ${disabled ? 'disabled' : ''} />`;
    html += `</div>`;
    
    if (error) {
      html += `<p class="mt-1.5 text-xs text-red-400">${error}</p>`;
    } else if (helperText) {
      html += `<p class="mt-1.5 text-xs text-content-muted">${helperText}</p>`;
    }
    
    return html;
  },

  // ============================================
  // CARD COMPONENT
  // ============================================
  createCard(content, opts = {}) {
    const { variant = 'standard', className = '', id = '' } = opts;
    
    const variantClasses = {
      standard: 'bg-surface-card border border-outline ghst-card-diffusion',
      elevated: 'bg-surface-elevated border border-outline ghst-card-diffusion',
      kpi: 'bg-surface-card border border-outline hover:border-outline-hover transition-all duration-300 ghst-card-diffusion ghst-kpi-card',
    };
    
    const idAttr = id ? `id="${id}"` : '';
    return `<div ${idAttr} class="rounded-xl p-5 ${variantClasses[variant] || variantClasses.standard} ${className}">${content}</div>`;
  },

  // ============================================
  // DROPDOWN COMPONENT
  // ============================================
  createDropdown(triggerText, items, opts = {}) {
    const { id = 'dropdown-' + Math.random().toString(36).slice(2), align = 'left', hideChevron = false } = opts;
    const alignClass = align === 'right' ? 'right-0' : 'left-0';
    
    let itemsHtml = items.map(item => {
      if (item.divider) return '<div class="border-t border-outline my-1"></div>';
      // Pass the event object to the onclick function to stop propagation
      return `<button class="w-full flex items-center gap-2 text-left px-3 py-3 min-h-[44px] text-sm text-content-sec hover:text-content-main hover:bg-surface-hover rounded-md transition-colors duration-150" onclick="event.stopPropagation(); ${item.onclick || ''}">${item.icon ? `<span class="flex-shrink-0">${this.getIcon(item.icon)}</span>` : ''}<span>${item.label}</span></button>`;
    }).join('');
    
    const chevron = hideChevron ? '' : this.getIcon('chevronDown');
    
    return `
      <div class="relative inline-block" id="${id}">
        <button class="flex items-center gap-1.5 text-sm text-content-sec hover:text-content-main transition-colors ghst-btn-tactile min-h-[44px] px-2" onclick="event.stopPropagation(); HMS.toggleDropdown('${id}-menu')">
          ${triggerText}${chevron}
        </button>
        <div id="${id}-menu" class="hidden absolute ${alignClass} mt-2 w-48 bg-surface-card border border-outline rounded-xl shadow-xl p-1 z-50 origin-top-right ghst-animate-scale-in-dropdown">
          ${itemsHtml}
        </div>
      </div>`;
  },

  /**
   * Toggles the visibility of a dropdown menu.
   * @param {string} menuId - The ID of the dropdown menu to toggle.
   */
  toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    if (menu) {
      // Close other dropdowns first
      this.closeAllDropdowns(menuId);
      menu.classList.toggle('hidden');
    }
  },

  /**
   * Closes all currently open dropdown menus, optionally excluding one.
   * @param {string} [excludeMenuId] - The ID of a menu to exclude from closing.
   */
  closeAllDropdowns(excludeMenuId = null) {
    document.querySelectorAll('[id$="-menu"]').forEach(menu => {
      if (menu.id !== excludeMenuId && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
      }
    });
  },

  // ============================================
  // CONFIRMATION DIALOG COMPONENT
  // ============================================
  /**
   * Display a styled confirmation dialog for user actions.
   * Returns a Promise that resolves to true (confirmed) or false (cancelled).
   * 
   * @param {Object} config - Dialog configuration
   * @param {string} config.title - Dialog title
   * @param {string} config.message - Dialog message/description
   * @param {string} [config.confirmText='Confirm'] - Text for confirm button
   * @param {string} [config.cancelText='Cancel'] - Text for cancel button
   * @param {string} [config.variant='warning'] - Dialog variant (warning, danger, info, success)
   * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled
   */
  showConfirmDialog(config = {}) {
    const {
      title = 'Confirm Action',
      message = 'Are you sure?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'warning',
    } = config;

    return new Promise((resolve) => {
      // Create dialog overlay
      const dialogOverlay = document.createElement('div');
      dialogOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4';
      
      // Determine variant-specific styles
      const variantStyles = {
        warning: {
          bgIcon: 'bg-amber-500/10',
          textIcon: 'text-amber-600 dark:text-amber-400',
          buttonVariant: 'primary',
        },
        danger: {
          bgIcon: 'bg-red-500/10',
          textIcon: 'text-red-600 dark:text-red-400',
          buttonVariant: 'primary',
        },
        info: {
          bgIcon: 'bg-brand/10',
          textIcon: 'text-brand',
          buttonVariant: 'primary',
        },
        success: {
          bgIcon: 'bg-emerald-500/10',
          textIcon: 'text-emerald-600 dark:text-emerald-400',
          buttonVariant: 'primary',
        },
      };

      const styles = variantStyles[variant] || variantStyles.warning;

      // Create dialog content
      dialogOverlay.innerHTML = `
        <div class="relative bg-surface-card border border-outline rounded-xl shadow-xl w-full max-w-md p-6 ghst-card-diffusion">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.bgIcon}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${styles.textIcon}">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-content-main">${title}</h3>
              <p class="text-sm text-content-muted mt-1">${message}</p>
            </div>
          </div>
          
          <div class="flex gap-3 justify-end pt-4">
            <button class="ghst-dialog-cancel-btn px-4 py-2.5 text-sm font-medium bg-surface-elevated hover:bg-surface-hover text-content-main border border-outline rounded-lg transition-all min-h-[44px] ghst-btn-tactile">
              ${cancelText}
            </button>
            <button class="ghst-dialog-confirm-btn px-4 py-2.5 text-sm font-medium bg-brand hover:bg-brand-hover text-white rounded-lg shadow-lg shadow-brand/20 transition-all min-h-[44px] ghst-btn-tactile">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      // Add to DOM
      document.body.appendChild(dialogOverlay);

      // Event listeners
      const confirmBtn = dialogOverlay.querySelector('.ghst-dialog-confirm-btn');
      const cancelBtn = dialogOverlay.querySelector('.ghst-dialog-cancel-btn');

      const cleanup = () => {
        dialogOverlay.remove();
      };

      confirmBtn.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });

      cancelBtn.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      // Close on overlay click
      dialogOverlay.addEventListener('click', (e) => {
        if (e.target === dialogOverlay) {
          cleanup();
          resolve(false);
        }
      });

      // Close on Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', handleEscape);
          cleanup();
          resolve(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  },

  // ============================================
  // TOAST NOTIFICATION COMPONENT
  // ============================================
  /**
   * Display a toast notification for brief, non-blocking feedback.
   * Automatically dismisses after a set duration.
   * 
   * @param {Object} config - Toast configuration
   * @param {string} config.message - Message to display
   * @param {string} [config.variant='info'] - Toast variant (success, error, warning, info)
   * @param {number} [config.duration=3000] - Duration in milliseconds before auto-dismiss
   */
  showToast(config = {}) {
    const {
      message = 'Action completed',
      variant = 'info',
      duration = 3000,
    } = config;

    // Define toast styles based on variant
    const toastStyles = {
      success: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      },
      error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-600 dark:text-red-400',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      },
      warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      },
      info: {
        bg: 'bg-brand/10',
        border: 'border-brand/20',
        text: 'text-brand',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      },
    };

    const styles = toastStyles[variant] || toastStyles.info;

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('ghst-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'ghst-toast-container';
      toastContainer.className = 'fixed top-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `${styles.bg} ${styles.border} ${styles.text} border rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg ghst-animate-slide-in-right pointer-events-auto min-h-[44px] backdrop-blur-sm`;
    toastEl.innerHTML = `
      <div class="flex-shrink-0">${styles.icon}</div>
      <div class="flex-1 text-sm font-medium">${message}</div>
      <button class="ghst-toast-close flex-shrink-0 p-1 hover:opacity-75 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    toastContainer.appendChild(toastEl);

    // Close button handler
    const closeBtn = toastEl.querySelector('.ghst-toast-close');
    const removeToast = () => {
      toastEl.classList.remove('ghst-animate-slide-in-right');
      toastEl.classList.add('ghst-animate-slide-out-right');
      setTimeout(() => toastEl.remove(), 300);
    };

    closeBtn.addEventListener('click', removeToast);

    // Auto-dismiss after duration
    setTimeout(removeToast, duration);
  },
};

// Global click event listener to close dropdowns when clicking outside
document.addEventListener('click', (event) => {
  // Check if the click is outside any dropdown trigger or menu
  if (!event.target.closest('.relative.inline-block')) {
    HMS.closeAllDropdowns();
  }
});
