import { newsDb, buzzDb, saveDatabasesToLocalStorage } from './data.js';

// --- NEWS PORTAL STATE & LOGIC ---
export let newsLayout = 'grid'; // 'grid' | 'list'
export let selectedNewsFilters = [];

export function renderNewsFeed() {
  const container = document.getElementById('news-feed-container');
  const leadContainer = document.getElementById('news-lead-story');
  
  if (!container) return;

  // 1. Load lead story (the most recent article)
  const leadItem = newsDb[0];
  if (leadItem && leadContainer) {
    leadContainer.innerHTML = `
      <img class="absolute inset-0 w-full h-full object-cover" src="${leadItem.image}" alt="${leadItem.title}">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
      <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
        <span class="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider">FEATURED STORY</span>
        <h3 class="text-2xl md:text-3xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase">${leadItem.title}</h3>
        <p class="text-sm text-slate-300 font-light line-clamp-2 max-w-xl">${leadItem.summary}</p>
        <div class="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-2">
          <span><i class="fa-solid fa-clock mr-1 text-brandGold"></i>${leadItem.date}</span>
          <span>${leadItem.readTime}</span>
        </div>
      </div>
    `;
  }

  // 2. Filter news database
  let filtered = newsDb;
  
  // Keyword Search
  const searchInput = document.getElementById('news-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (query) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(query) || item.summary.toLowerCase().includes(query));
  }

  // Category Checkboxes
  if (selectedNewsFilters.length > 0) {
    filtered = filtered.filter(item => selectedNewsFilters.includes(item.category));
  }

  // Update counts
  const feedCount = document.getElementById('news-feed-count');
  if (feedCount) feedCount.textContent = `${filtered.length} articles`;

  // Render news feed
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i class="fa-solid fa-folder-open text-3xl mb-3 text-slate-300"></i>
        <p>No news articles match your filter criteria.</p>
      </div>
    `;
    return;
  }

  // Set grid/list styles
  if (newsLayout === 'list') {
    container.className = "flex flex-col gap-4 w-full col-span-full";
  } else {
    container.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
  }

  filtered.forEach(item => {
    if (newsLayout === 'list') {
      container.innerHTML += `
        <article class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow cursor-pointer w-full" onclick="openNewsDetailModal(${item.id})">
          <img class="w-full md:w-48 h-40 object-cover" src="${item.image}" alt="${item.title}">
          <div class="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-brandBlue text-white'}">${item.category}</span>
              <h3 class="text-xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase">${item.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${item.summary}</p>
            </div>
            <div class="text-[10px] text-slate-400 font-semibold flex justify-between">
              <span>${item.date}</span>
              <span>${item.readTime}</span>
            </div>
          </div>
        </article>
      `;
    } else {
      container.innerHTML += `
        <article class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer" onclick="openNewsDetailModal(${item.id})">
          <img class="w-full h-48 object-cover" src="${item.image}" alt="${item.title}">
          <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-brandBlue text-white'}">${item.category}</span>
              <h3 class="text-xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase leading-tight">${item.title}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">${item.summary}</p>
            </div>
            <div class="text-xs text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
              <span>${item.date}</span>
              <span>${item.readTime}</span>
            </div>
          </div>
        </article>
      `;
    }
  });
}

export function searchNews() {
  renderNewsFeed();
}

export function applyNewsFilters() {
  const checkboxes = document.querySelectorAll('.news-filter-checkbox');
  selectedNewsFilters = [];
  checkboxes.forEach(c => {
    if (c.checked) selectedNewsFilters.push(c.value);
  });
  
  // Uncheck 'All' if specific filters checked
  const newsAllCheckbox = document.getElementById('filter-news-all');
  if (newsAllCheckbox) newsAllCheckbox.checked = selectedNewsFilters.length === 0;
  
  renderNewsFeed();
}

export function resetNewsFilters() {
  const newsAllCheckbox = document.getElementById('filter-news-all');
  if (newsAllCheckbox) newsAllCheckbox.checked = true;
  document.querySelectorAll('.news-filter-checkbox').forEach(c => c.checked = false);
  const searchInput = document.getElementById('news-search-input');
  if (searchInput) searchInput.value = '';
  selectedNewsFilters = [];
  renderNewsFeed();
}

// Bind news filter check box change logic
export function initNewsFilters() {
  const filterNewsAll = document.getElementById('filter-news-all');
  if (filterNewsAll) {
    filterNewsAll.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.querySelectorAll('.news-filter-checkbox').forEach(c => c.checked = false);
        selectedNewsFilters = [];
        renderNewsFeed();
      }
    });
  }
}

export function toggleNewsLayout(layout) {
  newsLayout = layout;
  const gridBtn = document.getElementById('btn-news-grid');
  const listBtn = document.getElementById('btn-news-list');
  
  if (!gridBtn || !listBtn) return;
  
  if (layout === 'list') {
    listBtn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    listBtn.classList.remove('text-slate-400');
    gridBtn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    gridBtn.classList.add('text-slate-400');
  } else {
    gridBtn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    gridBtn.classList.remove('text-slate-400');
    listBtn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    listBtn.classList.add('text-slate-400');
  }
  renderNewsFeed();
}

// --- NEWS DETAIL MODAL ---
export function openNewsDetailModal(newsId) {
  const item = newsDb.find(n => n.id === parseInt(newsId));
  if (!item) return;

  const modalImg = document.getElementById('modal-news-image');
  if (modalImg) modalImg.style.backgroundImage = `url('${item.image}')`;

  const modalMeta = document.getElementById('modal-news-meta');
  if (modalMeta) {
    modalMeta.innerHTML = `
      <span class="bg-brandGold text-black font-bold px-2 py-0.5 rounded uppercase">${item.category}</span>
      <span>•</span>
      <span>Published: ${item.date}</span>
      <span>•</span>
      <span>${item.readTime}</span>
    `;
  }
  
  const modalTitle = document.getElementById('modal-news-title');
  if (modalTitle) modalTitle.textContent = item.title;

  const modalContent = document.getElementById('modal-news-content');
  if (modalContent) modalContent.innerHTML = item.content;

  const modal = document.getElementById('news-detail-modal');
  if (modal) modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock scroll
}

export function closeNewsDetailModal() {
  const modal = document.getElementById('news-detail-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}


// --- LIVE NOTICE BOARD (BUZZ CHAT) ---
export function renderCommunityBuzz() {
  const container = document.getElementById('community-buzz-stream');
  if (!container) return;
  
  container.innerHTML = '';
  
  buzzDb.forEach(chat => {
    const isSentClass = chat.isSent ? 'flex-row-reverse' : '';
    const bubbleClass = chat.isSent ? 'chat-bubble-sent ml-auto' : 'chat-bubble-received';
    
    container.innerHTML += `
      <div class="flex gap-2.5 items-start ${isSentClass}">
        ${!chat.isSent ? `<div class="w-7 h-7 rounded-full bg-brandGold flex items-center justify-center font-bold text-[10px] text-black shrink-0">${chat.sender[0]}</div>` : ''}
        <div class="space-y-1 max-w-[80%]">
          <div class="flex items-center gap-2 text-[9px] text-slate-500 font-semibold ${chat.isSent ? 'justify-end' : ''}">
            <span>${chat.sender}</span>
            <span>•</span>
            <span>${chat.time}</span>
          </div>
          <div class="chat-bubble ${bubbleClass} text-[11px] leading-relaxed shadow-sm">
            ${chat.message}
          </div>
        </div>
      </div>
    `;
  });
  
  container.scrollTop = container.scrollHeight;
}

export function sendBuzzMessage(event) {
  event.preventDefault();
  const input = document.getElementById('buzz-input');
  if (!input) return;
  
  const messageText = input.value.trim();
  if (!messageText) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Append sent message
  const newMsg = {
    sender: "You (Citizen)",
    time: timeString,
    message: messageText,
    isSent: true
  };
  
  buzzDb.push(newMsg);
  input.value = '';
  
  renderCommunityBuzz();
  saveDatabasesToLocalStorage();

  // Simulate administrative/neighbor reply after 2.5 seconds
  setTimeout(() => {
    const replies = [
      "Thanks for sharing! Adding this to our notice log.",
      "Is that near the railway underpass? I was planning to head that way.",
      "Good warning, thanks. The municipal workers were active there yesterday too.",
      "Agree! Ward councils need to look into this soon.",
      "Indeed. Thanks for notifying the portal community."
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    buzzDb.push({
      sender: "Sarabjit M.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: randomReply,
      isSent: false
    });
    
    renderCommunityBuzz();
    saveDatabasesToLocalStorage();
  }, 2500);
}
