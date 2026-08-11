// --- BUSINESS DIRECTORY LOGIC ---
let activeDirectoryCategory = 'All';

function renderDirectoryGrid() {
  const container = document.getElementById('directory-grid-container');
  if (!container) return;

  let filtered = directoryDb;

  // Search keyword
  const searchInput = document.getElementById('directory-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (searchVal) {
    filtered = filtered.filter(b => b.name.toLowerCase().includes(searchVal) || b.tagline.toLowerCase().includes(searchVal) || b.desc.toLowerCase().includes(searchVal));
  }

  // Location selector
  const wardSelect = document.getElementById('directory-ward-select');
  const wardVal = wardSelect ? wardSelect.value : 'All';
  if (wardVal !== 'All') {
    filtered = filtered.filter(b => b.ward === wardVal);
  }

  // Category filter
  if (activeDirectoryCategory !== 'All') {
    filtered = filtered.filter(b => b.category === activeDirectoryCategory);
  }

  const gridCount = document.getElementById('directory-grid-count');
  if (gridCount) gridCount.textContent = `${filtered.length} businesses listed`;
  
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <i class="fa-solid fa-store-slash text-4xl mb-3 text-slate-300"></i>
        <p>No verified businesses found matching your criteria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    container.innerHTML += `
      <div class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group cursor-pointer" onclick="openBusinessDetailModal(${item.id})">
        <div>
          <!-- Top Cover Banner -->
          <div class="relative w-full h-44 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${item.cover}" alt="${item.name}">
            <span class="absolute top-3 left-3 bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">FEATURED</span>
          </div>

          <!-- Content Block -->
          <div class="p-6 relative mt-6">
            <!-- Floating Circular Logo -->
            <div class="absolute -top-12 left-6 w-14 h-14 rounded-full border-2 border-white dark:border-[#1e293b] shadow-md bg-white overflow-hidden">
              <img class="w-full h-full object-cover" src="${item.logo}" alt="Logo">
            </div>

            <div class="flex items-center gap-2">
              <h4 class="text-xl font-bold font-headings uppercase hover:text-brandGold transition-colors">${item.name}</h4>
              <i class="fa-solid fa-circle-check text-brandGold text-sm" title="Verified Business"></i>
            </div>
            
            <div class="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1.5">
              <span><i class="fa-solid fa-map-pin mr-1.5 text-brandGold"></i>${item.ward}</span>
              <span>•</span>
              <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>${item.rating} (${item.reviewsCount} reviews)</span>
            </div>
            
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">${item.desc}</p>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <span class="text-brandGold font-semibold uppercase tracking-wider">${item.category}</span>
          <span class="text-slate-600 dark:text-brandGold font-bold group-hover:translate-x-1.5 transition-transform">View Listing <i class="fa-solid fa-chevron-right ml-1"></i></span>
        </div>
      </div>
    `;
  });
}

function searchDirectory() {
  renderDirectoryGrid();
}

// Add keypress listener to search inputs
const searchInput = document.getElementById('directory-search-input');
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchDirectory();
  });
}

const wardSelect = document.getElementById('directory-ward-select');
if (wardSelect) {
  wardSelect.addEventListener('change', searchDirectory);
}

function filterDirectoryCategory(category, buttonEl) {
  activeDirectoryCategory = category;
  
  // Highlight active button
  const buttons = document.querySelectorAll('.category-filter-btn');
  buttons.forEach(btn => {
    btn.className = "category-filter-btn px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:border-brandGold hover:text-brandGold text-xs font-semibold uppercase flex items-center gap-2 whitespace-nowrap";
  });
  buttonEl.className = "category-filter-btn px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:border-brandGold hover:text-brandGold text-xs font-semibold uppercase flex items-center gap-2 whitespace-nowrap active bg-brandBlue text-white dark:bg-brandGold dark:text-black";

  renderDirectoryGrid();
}


// --- BUSINESS DETAILS MODAL ---
function openBusinessDetailModal(bizId) {
  const biz = directoryDb.find(b => b.id === parseInt(bizId));
  if (!biz) return;

  // Header Cover and Logo Overlap
  const headerContainer = document.getElementById('modal-business-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="w-full h-full bg-cover bg-center" style="background-image: url('${biz.cover}');">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
      <div class="absolute bottom-6 left-8 flex items-end gap-5 text-white">
        <div class="w-20 h-20 rounded-full border-4 border-white dark:border-[#1e293b] shadow-lg bg-white overflow-hidden shrink-0">
          <img class="w-full h-full object-cover" src="${biz.logo}" alt="${biz.name} Logo">
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="text-3xl font-extrabold font-headings uppercase">${biz.name}</h3>
            <i class="fa-solid fa-circle-check text-brandGold text-xl" title="Verified Listing"></i>
          </div>
          <p class="text-sm text-slate-300 font-light italic">${biz.tagline}</p>
          <div class="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
            <span><i class="fa-solid fa-location-dot mr-1.5 text-brandGold"></i>${biz.ward}</span>
            <span>•</span>
            <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>${biz.rating} (${biz.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>
    `;
  }

  // Body Content
  const modalBizDesc = document.getElementById('modal-business-desc');
  if (modalBizDesc) modalBizDesc.textContent = biz.desc;

  // Services list
  const servicesContainer = document.getElementById('modal-business-services');
  if (servicesContainer) {
    servicesContainer.innerHTML = '';
    biz.services.forEach(serv => {
      servicesContainer.innerHTML += `
        <div class="flex items-center gap-2 text-xs">
          <i class="fa-solid fa-check text-brandGold"></i>
          <span>${serv}</span>
        </div>
      `;
    });
  }

  // Gallery grid
  const galleryContainer = document.getElementById('modal-business-gallery');
  if (galleryContainer) {
    galleryContainer.innerHTML = '';
    biz.gallery.forEach(img => {
      galleryContainer.innerHTML += `
        <img class="w-full aspect-square rounded-lg object-cover border border-slate-200 dark:border-slate-800" src="${img}" alt="Gallery item">
      `;
    });
  }

  // Contacts Sidebar
  const modalBizContactList = document.getElementById('modal-business-contact-list');
  if (modalBizContactList) {
    modalBizContactList.innerHTML = `
      <li class="flex items-center gap-3"><i class="fa-solid fa-location-arrow w-4 text-brandGold text-center"></i><span>${biz.address}</span></li>
      <li class="flex items-center gap-3"><i class="fa-solid fa-phone w-4 text-brandGold text-center"></i><span>${biz.phone}</span></li>
      <li class="flex items-center gap-3"><i class="fa-solid fa-envelope w-4 text-brandGold text-center"></i><span>${biz.email}</span></li>
      <li class="flex items-center gap-3"><i class="fa-solid fa-globe w-4 text-brandGold text-center"></i><a href="https://${biz.website}" target="_blank" class="hover:underline text-brandBlue dark:text-brandGold font-semibold">${biz.website}</a></li>
    `;
  }

  // Main Call Button href
  const ctaBtn = document.getElementById('modal-business-cta');
  if (ctaBtn) ctaBtn.setAttribute('href', `tel:${biz.phone}`);

  // Mock Map container
  const modalBizMap = document.getElementById('modal-business-map');
  if (modalBizMap) {
    modalBizMap.innerHTML = `
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400'); opacity: 0.85;">
        <div class="absolute inset-0 bg-[#132c4c]/40 mix-blend-multiply"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brandGold flex items-center justify-center text-black border-2 border-white shadow-lg animate-bounce">
          <i class="fa-solid fa-map-pin"></i>
        </div>
      </div>
    `;
  }

  const modal = document.getElementById('business-detail-modal');
  if (modal) modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBusinessDetailModal() {
  const modal = document.getElementById('business-detail-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}
