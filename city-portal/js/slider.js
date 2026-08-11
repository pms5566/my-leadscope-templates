// --- BEFORE/AFTER SLIDER LOGIC ---
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-slider');
  const handle = document.getElementById('slider-handle');
  const overlay = document.getElementById('slider-overlay');
  let isDragging = false;

  if (!container || !handle || !overlay) return;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let position = ((xPos - rect.left) / rect.width) * 100;
    
    // Contain boundaries
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    handle.style.left = `${position}%`;
    overlay.style.width = `${position}%`;
    
    // Adjust nested image width overlay to keep aspect ratio scaling
    const innerImg = overlay.querySelector('img');
    if (innerImg) {
      innerImg.style.width = `${rect.width}px`;
    }
  }

  // Mouse / Touch Start
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);

  // Mouse Move
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      updateSlider(e.touches[0].clientX);
    }
  });

  // Re-sync image sizes on window resize
  window.addEventListener('resize', () => {
    const rect = container.getBoundingClientRect();
    const innerImg = overlay.querySelector('img');
    if (innerImg) {
      innerImg.style.width = `${rect.width}px`;
    }
  });
}

// --- HERO SLIDESHOW MARQUEE LOGIC ---
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  setInterval(() => {
    // Fade out current slide
    slides[currentSlide].classList.remove('opacity-100');
    slides[currentSlide].classList.add('opacity-0');
    if (bgSlides.length > currentSlide) {
      bgSlides[currentSlide].classList.remove('opacity-100');
      bgSlides[currentSlide].classList.add('opacity-0');
    }
    
    // Increment slide index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Fade in next slide
    slides[currentSlide].classList.remove('opacity-0');
    slides[currentSlide].classList.add('opacity-100');
    if (bgSlides.length > currentSlide) {
      bgSlides[currentSlide].classList.remove('opacity-0');
      bgSlides[currentSlide].classList.add('opacity-100');
    }
  }, 4500); // Transition every 4.5 seconds
}
