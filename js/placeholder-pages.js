function createPlaceholderPage(config) {
  return {
    async init() {
      this.setPageActions();
      this.render();
    },

    setPageActions() {
      const actionsEl = document.getElementById('ghst-page-actions');
      if (!actionsEl) return;

      actionsEl.innerHTML = '';
    },

    render() {
      const content = document.getElementById('ghst-main-content');
      if (!content) return;

      content.innerHTML = `
        <section class="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <div class="text-center">
            <h2 class="text-2xl font-heading font-semibold text-content-main tracking-tight">${config.title}</h2>
            <p class="mt-2 text-sm text-content-muted">To be implemented later</p>
          </div>
        </section>
      `;
    },
  };
}

const Reservations = createPlaceholderPage({
  title: 'Reservations',
});

const Guests = createPlaceholderPage({
  title: 'Guests',
});

const Payments = createPlaceholderPage({
  title: 'Payments',
});

const Inventory = createPlaceholderPage({
  title: 'Inventory',
});

const Settings = createPlaceholderPage({
  title: 'Settings',
});
