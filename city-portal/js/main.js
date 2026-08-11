// --- APPLICATION INITIALIZATION & CORE EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Hash SPA routing on load
  const pageId = window.location.hash ? window.location.hash.slice(1) : 'home';
  navigateTo(pageId);
  
  // 2. Initialize sub-components
  initBeforeAfterSlider();
  initHeroSlideshow();
});

window.addEventListener('hashchange', () => {
  const pageId = window.location.hash ? window.location.hash.slice(1) : 'home';
  navigateTo(pageId);
});

// Render feeds helper for homepage previews
function renderHomeFeeds() {
  // 1. News Preview (Most recent 3 items)
  const newsContainer = document.getElementById('home-news-feed');
  if (newsContainer) {
    newsContainer.innerHTML = '';
    newsDb.slice(0, 3).forEach(item => {
      newsContainer.innerHTML += `
        <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] flex gap-4 hover:shadow-md transition-shadow cursor-pointer" onclick="openNewsDetailModal(${item.id})">
          <img class="w-20 h-20 rounded-lg object-cover" src="${item.image}" alt="${item.title}">
          <div class="flex-1 min-w-0">
            <span class="text-[9px] font-bold px-2 py-0.5 rounded ${item.badgeClass}">${item.category}</span>
            <h4 class="font-bold text-sm text-slate-800 dark:text-white mt-1 hover:text-brandGold transition-colors truncate font-headings uppercase">${item.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">${item.summary}</p>
          </div>
        </div>
      `;
    });
  }

  // 2. Directory Preview (Top 2 featured listings)
  const dirContainer = document.getElementById('home-dir-feed');
  if (dirContainer) {
    dirContainer.innerHTML = '';
    directoryDb.slice(0, 2).forEach(item => {
      dirContainer.innerHTML += `
        <div class="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] flex gap-4 hover:shadow-md transition-shadow cursor-pointer" onclick="openBusinessDetailModal(${item.id})">
          <img class="w-14 h-14 rounded-full border object-cover" src="${item.logo}" alt="${item.name}">
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm text-slate-800 dark:text-white hover:text-brandGold transition-colors truncate font-headings uppercase">${item.name}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">${item.tagline}</p>
            <div class="text-[10px] text-brandGold font-semibold mt-2"><i class="fa-solid fa-map-pin mr-1"></i>${item.ward} • <i class="fa-solid fa-star mr-1"></i>${item.rating}</div>
          </div>
        </div>
      `;
    });
  }
}

// Pillar Selection (Homepage Interactive Tabs)
function changePillarPreview(index) {
  const preview = PILLARS_PREVIEWS[index];
  if (!preview) return;

  // Highlight active pillar button
  const buttons = document.querySelectorAll('.pillar-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active', 'bg-brandBlue', 'text-white', 'dark:bg-brandGold', 'dark:text-black');
  });
  const currentBtn = document.getElementById(`pillar-btn-${index}`);
  if (currentBtn) {
    currentBtn.classList.add('active', 'bg-brandBlue', 'text-white', 'dark:bg-brandGold', 'dark:text-black');
  }

  // Fade preview transition
  const wrapper = document.getElementById('pillar-preview-box');
  if (wrapper) {
    wrapper.classList.remove('opacity-100');
    wrapper.classList.add('opacity-0');
    
    setTimeout(() => {
      const badge = document.getElementById('pillar-preview-badge');
      const title = document.getElementById('pillar-preview-title');
      const desc = document.getElementById('pillar-preview-desc');
      const image = document.getElementById('pillar-preview-image');

      if (badge) badge.textContent = preview.badge;
      if (title) title.textContent = preview.title;
      if (desc) desc.textContent = preview.desc;
      if (image) image.style.backgroundImage = `url('${preview.image}')`;
      
      wrapper.classList.remove('opacity-0');
      wrapper.classList.add('opacity-100');
    }, 200);
  }
}

// Redirect quick filters from home to directory page
function openCategoryInDirectory(category) {
  navigateTo('directory');
  const buttons = document.querySelectorAll('.category-filter-btn');
  let matchedBtn = null;
  buttons.forEach(btn => {
    if (btn.textContent.includes(category)) {
      matchedBtn = btn;
    }
  });
  
  if (matchedBtn) {
    filterDirectoryCategory(category, matchedBtn);
  } else {
    activeDirectoryCategory = category;
    renderDirectoryGrid();
  }
}
