// --- DARK / LIGHT MODE ENGINE ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('myrajpura_theme', theme);
  
  if (theme === 'dark') {
    if (themeIcon) themeIcon.className = "fa-solid fa-sun text-lg";
    document.documentElement.classList.add('dark');
  } else {
    if (themeIcon) themeIcon.className = "fa-solid fa-moon text-lg";
    document.documentElement.classList.remove('dark');
  }
  
  if (typeof window.updateHeaderStyle === 'function') {
    window.updateHeaderStyle();
  }
}

// Check saved theme
const savedTheme = localStorage.getItem('myrajpura_theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}
