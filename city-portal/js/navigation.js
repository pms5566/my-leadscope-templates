// --- STATE MANAGEMENT VARS ---
let activeJobId = jobsDb[0] ? jobsDb[0].id : null;
let currentEventView = 'schedules'; // 'schedules' | 'calendar'
let currentCalendarMonth = 7; // August
let currentCalendarYear = 2026;

// Wizard State (Contribute)
let currentWizardType = ''; // 'news' | 'business' | 'job' | 'event'
let currentWizardStep = 1;

// --- PAGE NAVIGATION ENGINE (SPA) ---
function navigateTo(pageId) {
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
    if (typeof renderHomeFeeds === 'function') renderHomeFeeds();
  } else if (pageId === 'news') {
    if (typeof renderNewsFeed === 'function') renderNewsFeed();
    if (typeof renderCommunityBuzz === 'function') renderCommunityBuzz();
  } else if (pageId === 'directory') {
    if (typeof renderDirectoryGrid === 'function') renderDirectoryGrid();
  } else if (pageId === 'jobs') {
    if (typeof renderJobFeed === 'function') renderJobFeed();
    if (typeof renderJobDetails === 'function') renderJobDetails();
  } else if (pageId === 'events') {
    if (typeof renderEvents === 'function') renderEvents();
  }
}

// --- HEADER THEME & SCROLL COORDINATION ---
function updateHeaderStyle(activePage = null) {
  const header = document.getElementById('main-header');
  const logoText = document.getElementById('header-logo-text');
  const nav = document.querySelector('nav');
  const hamburger = document.getElementById('hamburger-btn');
  
  if (!header || !logoText || !nav || !hamburger) return;

  header.classList.add('shadow-md');
  header.classList.add('bg-white', 'dark:bg-[#1e293b]');
  
  logoText.classList.remove('text-white');
  logoText.classList.add('text-[#0f172a]', 'dark:text-white');
  
  nav.classList.remove('text-slate-200');
  nav.classList.add('text-slate-700', 'dark:text-slate-300');
  
  hamburger.classList.remove('text-white');
  hamburger.classList.add('text-[#0f172a]', 'dark:text-white');
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
    // Scroll Down - hide header
    header.classList.add('header-hidden');
  } else {
    // Scroll Up - show header
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
