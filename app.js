// Shared layout & helpers
(function(){
  const ICONS = {
    home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>',
    users:'<path d="M16 14a4 4 0 1 0-8 0"/><circle cx="12" cy="7" r="4"/><path d="M2 21a8 8 0 0 1 20 0"/>',
    userPlus:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M19 8v6M16 11h6"/>',
    box:'<path d="M3 7 12 3l9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    receipt:'<path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    bed:'<path d="M3 18V6"/><path d="M3 12h18v6"/><path d="M21 18V11a3 3 0 0 0-3-3h-7v4"/><circle cx="7" cy="11" r="2"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    arrowLeft:'<path d="M19 12H5M12 19l-7-7 7-7"/>',
    edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'
  };
  function icon(name,cls='w-5 h-5',stroke=2){
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
  }

  function navItem(href,iconName,label,key,activeKey){
    const active=key===activeKey?'active':'';
    return `<a href="${href}" class="nav-link ${active}">${icon(iconName,'w-[18px] h-[18px]')}<span>${label}</span></a>`;
  }

  function sidebar(active){
    return `
    <aside class="sidebar w-[260px] shrink-0 bg-white border-r border-[#E8E8E8] flex flex-col h-screen sticky top-0">
      <div class="px-5 py-5 border-b border-[#E8E8E8] flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-[#4A90E2] flex items-center justify-center text-white font-display font-bold">H</div>
        <div>
          <div class="font-display font-bold text-[15px] text-[#202020] leading-none">HotelMS</div>
          <div class="text-[11px] text-[#7A7A7A] mt-1">Front Office Suite</div>
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <div class="nav-group-title">Overview</div>
        ${navItem('index.html','home','Dashboard','dashboard',active)}

        <div class="nav-group-title">Guests</div>
        ${navItem('guests.html','users','Guest List','guests',active)}
        ${navItem('add-guest.html','userPlus','Add Guest','add-guest',active)}

        <div class="nav-group-title">Inventory</div>
        ${navItem('inventory.html','box','Inventory List','inventory',active)}
        ${navItem('add-item.html','plus','Add Item','add-item',active)}

        <div class="nav-group-title">Payments</div>
        ${navItem('payments.html','card','Payment Dashboard','payments',active)}
        ${navItem('payment-history.html','receipt','Payment History','history',active)}
      </nav>
      <div class="p-3 border-t border-[#E8E8E8]">
        <div class="flex items-center gap-3 px-2 py-2">
          <div class="w-9 h-9 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-sm font-semibold">JI</div>
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-semibold text-[#202020] truncate">Jessica Idama.</div>
            <div class="text-[11px] text-[#7A7A7A] truncate">Front Desk Manager</div>
          </div>
        </div>
      </div>
    </aside>`;
  }

  function topbar(title,subtitle,actions=''){
    return `
    <header class="bg-white border-b border-[#E8E8E8] px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
      <button id="hms-menu" class="md:hidden btn btn-ghost !p-2">${icon('menu','w-5 h-5')}</button>
      <div class="flex-1 min-w-0">
        <h1 class="font-display text-[22px] font-bold text-[#202020] leading-tight truncate">${title}</h1>
        ${subtitle?`<p class="text-[13px] text-[#7A7A7A] mt-0.5 truncate">${subtitle}</p>`:''}
      </div>
      <div class="hidden md:flex items-center gap-2">${actions}</div>
      <button class="relative btn btn-ghost !p-2" aria-label="Notifications">${icon('bell','w-5 h-5')}<span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4A90E2]"></span></button>
    </header>`;
  }

  window.HMSUI = {
    icon, sidebar, topbar,
    mount(active,title,subtitle,bodyHTML,topActions=''){
      const root=document.getElementById('app');
      root.innerHTML = `
        <div class="flex min-h-screen">
          ${sidebar(active)}
          <div class="flex-1 min-w-0 flex flex-col">
            ${topbar(title,subtitle,topActions)}
            <main class="flex-1 p-6 lg:p-8">${bodyHTML}</main>
          </div>
        </div>
        <div class="modal-backdrop" id="hms-modal"><div class="modal" id="hms-modal-body"></div></div>
      `;
      const menuBtn=document.getElementById('hms-menu');
      const sb=document.querySelector('.sidebar');
      if(menuBtn) menuBtn.addEventListener('click',()=>sb.classList.toggle('open'));
    },
    statusPill(status){
      const map={
        'Checked-in':'pill-green','Checked-out':'pill-gray','Reserved':'pill-blue',
        'Completed':'pill-green','Pending':'pill-amber','Refunded':'pill-red',
        'In Stock':'pill-green','Low Stock':'pill-amber','Out of Stock':'pill-red'
      };
      return `<span class="pill ${map[status]||'pill-gray'}"><span class="dot"></span>${status}</span>`;
    },
    showModal(html){
      const m=document.getElementById('hms-modal');
      document.getElementById('hms-modal-body').innerHTML=html;
      m.classList.add('open');
      m.addEventListener('click',(e)=>{if(e.target===m) m.classList.remove('open');},{once:true});
    },
    closeModal(){document.getElementById('hms-modal').classList.remove('open');},
    async withSkeleton(target, skeletonHTML, work, delay=600){
      target.innerHTML = skeletonHTML;
      await new Promise(r=>setTimeout(r,delay));
      target.innerHTML = await work();
    }
  };
})();
