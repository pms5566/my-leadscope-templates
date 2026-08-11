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

  if (currentPage === 'home' && scrollTop <= 30) {
    // Transparent style at top of Homepage
    header.classList.remove('bg-white', 'dark:bg-[#1e293b]', 'bg-[#0f172a]/95', 'dark:bg-[#0f172a]/95', 'shadow-md', 'border-slate-200', 'dark:border-slate-800', 'py-4');
    header.classList.add('bg-transparent', 'border-transparent', 'shadow-none', 'py-6');
    
    logoText.classList.remove('text-[#0f172a]', 'dark:text-white');
    logoText.classList.add('text-white');
    if (logoSub) {
      logoSub.classList.remove('text-slate-500', 'dark:text-slate-400');
      logoSub.classList.add('text-slate-300');
    }
    
    nav.classList.remove('text-slate-700', 'dark:text-slate-300');
    nav.classList.add('text-white/90');
    
    hamburger.classList.remove('text-[#0f172a]', 'dark:text-white');
    hamburger.classList.add('text-white');
  } else {
    // Solid styling on scroll or on other sub-pages
    header.classList.add('shadow-md', 'py-4');
    header.classList.remove('bg-transparent', 'border-transparent', 'shadow-none', 'py-5', 'py-6');
    
    if (document.documentElement.classList.contains('dark')) {
      header.classList.add('bg-[#0f172a]/95', 'dark:bg-[#0f172a]/95', 'border-slate-800');
      header.classList.remove('bg-white', 'border-slate-200');
      
      logoText.classList.remove('text-[#0f172a]', 'text-white');
      logoText.classList.add('text-white');
      if (logoSub) {
        logoSub.classList.remove('text-slate-300', 'text-slate-500');
        logoSub.classList.add('text-slate-400');
      }
      
      nav.classList.remove('text-slate-700', 'text-white/90');
      nav.classList.add('text-slate-300');
    } else {
      header.classList.add('bg-white', 'border-slate-200');
      header.classList.remove('bg-[#0f172a]/95', 'dark:bg-[#0f172a]/95', 'border-slate-800');
      
      logoText.classList.remove('text-white', 'dark:text-white');
      logoText.classList.add('text-[#0f172a]');
      if (logoSub) {
        logoSub.classList.remove('text-slate-300', 'dark:text-slate-400');
        logoSub.classList.add('text-slate-500');
      }
      
      nav.classList.remove('text-white/90', 'dark:text-slate-300');
      nav.classList.add('text-slate-700');
    }
    
    hamburger.classList.remove('text-white');
    hamburger.classList.add('text-[#0f172a]', 'dark:text-white');
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
