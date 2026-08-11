import { jobsDb } from './data.js';

// --- STATE MANAGEMENT OBJECT ---
export const state = {
  activeJobId: jobsDb[0] ? jobsDb[0].id : null,
  currentEventView: 'schedules', // 'schedules' | 'calendar'
  currentCalendarMonth: 7, // August
  currentCalendarYear: 2026,
  currentWizardType: '', // 'news' | 'business' | 'job' | 'event'
  currentWizardStep: 1
};

// --- PAGE NAVIGATION ENGINE (SPA) ---
export function navigateTo(pageId) {
  // Hide all pages
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.classList.remove('active');
    setTimeout(() => {
      if (!v.classList.contains('active')) {
        v.style.display = 'none';
      }
    }, 400); // Wait for transition
  });

  // Highlight Nav Link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(l => {
    if (l.getAttribute('href') === `#${pageId}`) {
      l.classList.add('text-brandGold', 'active');
    } else {
      l.classList.remove('text-brandGold', 'active');
    }
  });

  // Highlight Sticky Mobile Bottom Nav Tab
  const bottomTabs = document.querySelectorAll('.mobile-nav-tab');
  bottomTabs.forEach(t => {
    if (t.getAttribute('href') === `#${pageId}`) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  // Close Mobile Menu if open
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  if (hamburgerBtn) hamburgerBtn.classList.remove('open');

  // Show selected page
  const activeView = document.getElementById(`${pageId}-view`);
  if (activeView) {
    activeView.style.display = 'block';
    setTimeout(() => {
      activeView.classList.add('active');
    }, 50);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update header text colors and solid/scrolled state
  updateHeaderStyle(pageId);

  // Load section specific renders
  if (pageId === 'home') {
    if (typeof window.renderHomeFeeds === 'function') window.renderHomeFeeds();
  } else if (pageId === 'news') {
    if (typeof window.renderNewsFeed === 'function') window.renderNewsFeed();
    if (typeof window.renderCommunityBuzz === 'function') window.renderCommunityBuzz();
  } else if (pageId === 'directory') {
    if (typeof window.renderDirectoryGrid === 'function') window.renderDirectoryGrid();
  } else if (pageId === 'jobs') {
    if (typeof window.renderJobFeed === 'function') window.renderJobFeed();
    if (typeof window.renderJobDetails === 'function') window.renderJobDetails();
  } else if (pageId === 'events') {
    if (typeof window.renderEvents === 'function') window.renderEvents();
  }
}

// --- HEADER THEME & SCROLL COORDINATION ---
export function updateHeaderStyle(activePage = null) {
  const header = document.getElementById('main-header');
  const logoText = document.getElementById('header-logo-text');
  const logoSub = document.getElementById('header-logo-sub');
  const nav = document.querySelector('nav');
  const hamburger = document.getElementById('hamburger-btn');
  
  if (!header || !logoText || !nav || !hamburger) return;

  const currentPage = activePage || state.currentPage;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Preserve header visibility transition state
  const isHidden = header.classList.contains('header-hidden');

  if (currentPage === 'home' && scrollTop <= 30) {
    // 1. Transparent style at top of Homepage
    header.className = `fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent transition-all duration-300 py-6${isHidden ? ' header-hidden' : ''}`;
    
    logoText.className = "text-lg font-black tracking-widest font-headings leading-none text-white transition-colors";
    if (logoSub) logoSub.className = "text-[9px] tracking-wider uppercase font-semibold mt-1 text-slate-300 transition-colors";
    nav.className = "hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase text-white/90";
    hamburger.className = "lg:hidden flex flex-col justify-between w-6 h-4 text-white";
  } else {
    // 2. Solid styling on scroll or on other sub-pages
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      header.className = `fixed top-0 left-0 right-0 z-50 shadow-md border-b bg-[#0f172a]/95 dark:bg-[#0f172a]/95 border-slate-800 transition-all duration-300 py-4${isHidden ? ' header-hidden' : ''}`;
      
      logoText.className = "text-lg font-black tracking-widest font-headings leading-none text-white transition-colors";
      if (logoSub) logoSub.className = "text-[9px] tracking-wider uppercase font-semibold mt-1 text-slate-400 transition-colors";
      nav.className = "hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase text-slate-300";
      hamburger.className = "lg:hidden flex flex-col justify-between w-6 h-4 text-white";
    } else {
      header.className = `fixed top-0 left-0 right-0 z-50 shadow-md border-b bg-white border-slate-200 transition-all duration-300 py-4${isHidden ? ' header-hidden' : ''}`;
      
      logoText.className = "text-lg font-black tracking-widest font-headings leading-none text-[#0f172a] transition-colors";
      if (logoSub) logoSub.className = "text-[9px] tracking-wider uppercase font-semibold mt-1 text-slate-500 transition-colors";
      nav.className = "hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase text-slate-700";
      hamburger.className = "lg:hidden flex flex-col justify-between w-6 h-4 text-[#0f172a]";
    }
  }
}

// Scroll Event with Auto-Hiding Sticky Header
let lastScrollTop = 0;
const scrollThreshold = 8;

window.addEventListener('scroll', () => {
  updateHeaderStyle();
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.getElementById('main-header');
  if (!header) return;

  if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold) {
    return;
  }

  if (scrollTop > lastScrollTop && scrollTop > 80) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }
  
  lastScrollTop = scrollTop;
});

// Setup Mobile Footer Accordions Toggle based on viewport
function setupMobileFooterAccordions() {
  if (window.innerWidth < 768) {
    document.querySelectorAll('footer details').forEach(detail => {
      detail.removeAttribute('open');
    });
  } else {
    document.querySelectorAll('footer details').forEach(detail => {
      detail.setAttribute('open', '');
    });
  }
}

window.addEventListener('DOMContentLoaded', setupMobileFooterAccordions);
window.addEventListener('resize', setupMobileFooterAccordions);

// --- HAMBURGER MENU DRAWER ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerBtn.classList.toggle('open');
  });
}
