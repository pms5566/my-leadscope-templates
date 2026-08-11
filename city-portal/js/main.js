// --- IMPORTS ---
import { newsDb, directoryDb, PILLARS_PREVIEWS } from './data.js';
import { state, navigateTo, updateHeaderStyle } from './navigation.js';
import { initBeforeAfterSlider, initHeroSlideshow } from './slider.js';
import { setTheme } from './theme.js';
import {
  renderNewsFeed,
  searchNews,
  applyNewsFilters,
  resetNewsFilters,
  toggleNewsLayout,
  openNewsDetailModal,
  closeNewsDetailModal,
  renderCommunityBuzz,
  sendBuzzMessage,
  initNewsFilters
} from './news.js';
import {
  renderDirectoryGrid,
  searchDirectory,
  filterDirectoryCategory,
  openBusinessDetailModal,
  closeBusinessDetailModal,
  initDirectoryListeners
} from './directory.js';
import {
  renderJobFeed,
  setActiveJob,
  renderJobDetails,
  applyJobFilters,
  resetJobFilters,
  toggleJobDrawer,
  submitJobDrawer
} from './jobs.js';
import {
  renderEvents,
  toggleEventsView,
  starEvent,
  applyEventFilters,
  changeCalendarMonth,
  openCalendarEventDetail
} from './events.js';
import {
  initiateSubmissionWizard,
  cancelSubmissionWizard,
  openContributeTab,
  navigateWizardStep,
  handleWizardSubmit
} from './wizard.js';

// --- EXPOSE HANDLERS TO WINDOW (Bridges HTML event attributes with ES6 modules) ---
window.navigateTo = navigateTo;
window.updateHeaderStyle = updateHeaderStyle;
window.setTheme = setTheme;

// Homepage items
window.changePillarPreview = changePillarPreview;
window.openCategoryInDirectory = openCategoryInDirectory;

// News items
window.searchNews = searchNews;
window.applyNewsFilters = applyNewsFilters;
window.resetNewsFilters = resetNewsFilters;
window.toggleNewsLayout = toggleNewsLayout;
window.openNewsDetailModal = openNewsDetailModal;
window.closeNewsDetailModal = closeNewsDetailModal;
window.sendBuzzMessage = sendBuzzMessage;
window.renderNewsFeed = renderNewsFeed;
window.renderCommunityBuzz = renderCommunityBuzz;

// Directory items
window.searchDirectory = searchDirectory;
window.filterDirectoryCategory = filterDirectoryCategory;
window.openBusinessDetailModal = openBusinessDetailModal;
window.closeBusinessDetailModal = closeBusinessDetailModal;
window.renderDirectoryGrid = renderDirectoryGrid;

// Jobs items
window.setActiveJob = setActiveJob;
window.applyJobFilters = applyJobFilters;
window.resetJobFilters = resetJobFilters;
window.toggleJobDrawer = toggleJobDrawer;
window.submitJobDrawer = submitJobDrawer;
window.renderJobFeed = renderJobFeed;
window.renderJobDetails = renderJobDetails;

// Events items
window.toggleEventsView = toggleEventsView;
window.starEvent = starEvent;
window.applyEventFilters = applyEventFilters;
window.changeCalendarMonth = changeCalendarMonth;
window.openCalendarEventDetail = openCalendarEventDetail;
window.renderEvents = renderEvents;

// Wizard items
window.initiateSubmissionWizard = initiateSubmissionWizard;
window.cancelSubmissionWizard = cancelSubmissionWizard;
window.openContributeTab = openContributeTab;
window.navigateWizardStep = navigateWizardStep;
window.handleWizardSubmit = handleWizardSubmit;

// --- APPLICATION INITIALIZATION & CORE EVENTS ---
window.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Hash SPA routing on load
  const pageId = window.location.hash ? window.location.hash.slice(1) : 'home';
  navigateTo(pageId);
  
  // 2. Initialize sub-components
  initBeforeAfterSlider();
  initHeroSlideshow();
  
  // 3. Initialize module specific listeners
  initNewsFilters();
  initDirectoryListeners();
});

// Render feeds helper for homepage previews
export function renderHomeFeeds() {
  // 1. News Preview (Most recent 2 items rendered as premium cards)
  const newsContainer = document.getElementById('home-news-grid');
  if (newsContainer) {
    newsContainer.innerHTML = '';
    newsDb.slice(0, 2).forEach(item => {
      newsContainer.innerHTML += `
        <article class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between" onclick="openNewsDetailModal(${item.id})">
          <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img class="w-full h-full object-cover transition-transform hover:scale-105" src="${item.image}" alt="${item.title}">
            <span class="absolute top-3 left-3 bg-brandBlue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">${item.category}</span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between text-black dark:text-white">
            <div class="space-y-2">
              <h3 class="text-base font-bold font-headings uppercase hover:text-brandGold transition-colors leading-tight line-clamp-2">${item.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${item.summary}</p>
            </div>
            <div class="text-[10px] text-slate-400 font-semibold border-t dark:border-slate-850 pt-3 mt-4 flex justify-between">
              <span>${item.date}</span>
              <span>${item.readTime}</span>
            </div>
          </div>
        </article>
      `;
    });
  }

  // 2. Events Preview (Most recent 3 items rendered as dynamic cards)
  const eventsContainer = document.getElementById('home-events-list');
  if (eventsContainer) {
    eventsContainer.innerHTML = '';
    eventsDb.slice(0, 3).forEach(item => {
      const parts = item.date.split(' ');
      const month = parts[0] || 'Aug';
      const day = parts[1] ? parts[1].replace(',', '') : '12';
      
      eventsContainer.innerHTML += `
        <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] flex gap-4 hover:shadow-md transition-all cursor-pointer" onclick="navigateTo('events')">
          <div class="w-16 h-16 rounded-lg bg-brandGold/10 flex flex-col items-center justify-center text-brandGold shrink-0 font-bold">
            <span class="text-[10px] uppercase leading-none text-slate-400 dark:text-slate-500 font-medium mb-1">${month}</span>
            <span class="text-xl leading-none font-headings">${day}</span>
          </div>
          <div class="flex-1 min-w-0 text-black dark:text-white flex flex-col justify-center">
            <span class="text-[8px] font-bold px-1.5 py-0.5 rounded bg-brandBlue/10 text-brandBlue uppercase self-start">${item.category}</span>
            <h4 class="font-bold text-sm truncate mt-1.5 font-headings uppercase hover:text-brandGold transition-colors">${item.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">${item.desc}</p>
          </div>
        </div>
      `;
    });
  }
}
window.renderHomeFeeds = renderHomeFeeds;

// Pillar Selection (Homepage Interactive Tabs)
export function changePillarPreview(index) {
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
export function openCategoryInDirectory(category) {
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
