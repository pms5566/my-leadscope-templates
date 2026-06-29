/* ==========================================================================
   Dr. Rohan Sharma - Skincare Website Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --------------------------------------------------------------------------
     1. Navigation, Header Scroll & Mobile Menu
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Shrink header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile menu toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      
      // Hamburger animation
      const bars = menuToggle.querySelectorAll('.bar');
      bars[0].style.transform = mainNav.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
      bars[1].style.opacity = mainNav.classList.contains('active') ? '0' : '1';
      bars[2].style.transform = mainNav.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
    });
  }

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      // Reset hamburger
      const bars = menuToggle.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    });
  });

  // Active navigation link highlighting on scroll
  function updateActiveNavLink() {
    let scrollPos = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Before & After Image Comparison Sliders
     -------------------------------------------------------------------------- */
  const sliders = document.querySelectorAll('.comparison-slider-container');

  sliders.forEach(container => {
    const sliderInput = container.querySelector('.slider-bar');
    
    // Update clip-path and handle position dynamically on range input change
    sliderInput.addEventListener('input', (e) => {
      const value = e.target.value;
      container.style.setProperty('--position', `${value}%`);
    });
    
    // Support mouse drag/move interactions
    let isDragging = false;
    
    container.addEventListener('mousedown', () => { isDragging = true; });
    container.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mouseleave', () => { isDragging = false; });
    
    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      let percentage = (x / rect.width) * 100;
      
      // Constrain within 0 and 100
      percentage = Math.max(0, Math.min(100, percentage));
      
      sliderInput.value = percentage;
      container.style.setProperty('--position', `${percentage}%`);
    });

    // Touch support for mobile devices
    container.addEventListener('touchmove', (e) => {
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      percentage = Math.max(0, Math.min(100, percentage));
      
      sliderInput.value = percentage;
      container.style.setProperty('--position', `${percentage}%`);
    });
  });

  /* --------------------------------------------------------------------------
     3. Chamber Schedule Switcher (Tabs)
     -------------------------------------------------------------------------- */
  const chamberTabs = document.querySelectorAll('.chamber-tab');
  const displayCard = document.getElementById('chamberDisplayCard');
  
  const displayImg = document.getElementById('displayChamberImg');
  const displayName = document.getElementById('displayChamberName');
  const displayAddress = document.getElementById('displayChamberAddress');
  const displayHours = document.getElementById('displayChamberHours');
  const displayPhone1 = document.getElementById('displayChamberPhone1');
  const displayPhone2 = document.getElementById('displayChamberPhone2');

  const chambersData = {
    'shah-skin': {
      name: 'Shah Skin & Laser Center',
      address: 'Medical College Rd, Gazipur, Dhaka - 1711',
      hours: 'Thursday - Friday | 5:00 PM - 8:00 PM',
      phone1: '001 2345 6789',
      phone2: '012 3456 7890',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
    },
    'city-cosmetic': {
      name: 'City Skin & Cosmetic Clinic',
      address: 'Rafi Ahmed Kidwai Road, Park Street area, Kolkata - 700016',
      hours: 'Monday - Wednesday | 4:00 PM - 7:00 PM',
      phone1: '+91 33 2456 7890',
      phone2: '+91 98300 12345',
      image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e902a?auto=format&fit=crop&w=800&q=80'
    },
    'apex-aesthetic': {
      name: 'Apex Aesthetic Chamber',
      address: 'Linking Road, Santa Cruz West, Mumbai - 400054',
      hours: 'Saturday - Sunday | 11:00 AM - 3:00 PM',
      phone1: '+91 22 6543 2100',
      phone2: '+91 98200 54321',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    }
  };

  chamberTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const chamberKey = tab.getAttribute('data-chamber');
      const data = chambersData[chamberKey];
      
      if (!data) return;

      // Active state on tabs
      chamberTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Swap displaying information with a smooth fade effect
      displayCard.classList.add('fade-out');
      
      setTimeout(() => {
        displayImg.src = data.image;
        displayImg.alt = data.name;
        displayName.textContent = data.name;
        displayAddress.textContent = data.address;
        displayHours.textContent = data.hours;
        displayPhone1.textContent = data.phone1;
        displayPhone2.textContent = data.phone2;
        
        displayCard.classList.remove('fade-out');
      }, 250);
    });
  });

  /* --------------------------------------------------------------------------
     4. Services "View All" Drawer Toggle
     -------------------------------------------------------------------------- */
  const viewAllServicesBtn = document.getElementById('viewAllServicesBtn');
  const expandedServices = document.getElementById('expandedServices');

  if (viewAllServicesBtn && expandedServices) {
    viewAllServicesBtn.addEventListener('click', () => {
      expandedServices.classList.toggle('show');
      
      if (expandedServices.classList.contains('show')) {
        viewAllServicesBtn.innerHTML = 'SHOW LESS SERVICES <i class="fa-solid fa-chevron-up"></i>';
      } else {
        viewAllServicesBtn.innerHTML = 'VIEW ALL SERVICES <i class="fa-solid fa-table-cells"></i>';
        
        // Scroll back to main services section if drawer collapses
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Shopping Cart Drawer System (Add/Remove & Quantities)
     -------------------------------------------------------------------------- */
  let cart = [];
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCountBadge = document.querySelector('.cart-count');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  
  // Add to cart listeners
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering any parent actions
      const productCard = btn.closest('.product-card');
      const id = productCard.getAttribute('data-product-id');
      const name = productCard.getAttribute('data-name');
      const price = parseFloat(productCard.getAttribute('data-price'));
      const img = productCard.getAttribute('data-img');

      addToCart(id, name, price, img);
      
      // Auto open cart sidebar when item is added
      cartSidebar.classList.add('active');
    });
  });

  // Toggle Cart Drawer
  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
  if (cartBackdrop) cartBackdrop.addEventListener('click', () => cartSidebar.classList.remove('active'));

  const shopCtaBtn = document.getElementById('shopCtaBtn');
  if (shopCtaBtn) {
    shopCtaBtn.addEventListener('click', () => {
      cartSidebar.classList.add('active');
    });
  }

  const continueShoppingLink = document.getElementById('continueShopping');
  if (continueShoppingLink) {
    continueShoppingLink.addEventListener('click', (e) => {
      e.preventDefault();
      cartSidebar.classList.remove('active');
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cart Functions
  function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, img, quantity: 1 });
    }
    updateCartUI();
    triggerCartAnimation();
  }

  function updateCartUI() {
    // Update badge quantity
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalQty;
    
    if (cart.length === 0) {
      // Show Empty Message
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="fa-solid fa-bag-shopping empty-icon"></i>
          <p>Your skincare bag is empty.</p>
          <a href="#shop" class="btn btn-primary continue-shopping-btn" id="continueShoppingInner">Browse Skincare Products</a>
        </div>
      `;
      cartFooter.style.display = 'none';

      // Re-attach listener on the inner empty-state button
      const continueShoppingInner = document.getElementById('continueShoppingInner');
      if (continueShoppingInner) {
        continueShoppingInner.addEventListener('click', (e) => {
          e.preventDefault();
          cartSidebar.classList.remove('active');
          document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    // Render cart items list
    cartFooter.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="item-price">$${item.price.toFixed(2)}</span>
          <div class="item-quantity-controls">
            <button class="qty-btn minus-qty" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn plus-qty" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>
      `;

      cartItemsContainer.appendChild(itemEl);
    });

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    // Attach listeners to items quantity and remove buttons
    const minusButtons = cartItemsContainer.querySelectorAll('.minus-qty');
    const plusButtons = cartItemsContainer.querySelectorAll('.plus-qty');
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item-btn');

    minusButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateQuantity(id, -1);
      });
    });

    plusButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateQuantity(id, 1);
      });
    });

    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function triggerCartAnimation() {
    cartCountBadge.classList.add('animate-bounce');
    setTimeout(() => {
      cartCountBadge.classList.remove('animate-bounce');
    }, 1000);
  }

  // Simulated Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('🛒 Simulating Checkout: Your clinical order has been submitted. Check details in prescriptions.');
      cart = [];
      updateCartUI();
      cartSidebar.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     6. Booking Appointment Modal & Form Validation
     -------------------------------------------------------------------------- */
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingModal = document.getElementById('closeBookingModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingSuccessScreen = document.getElementById('bookingSuccessScreen');
  const bookModalTriggers = document.querySelectorAll('.book-modal-trigger');
  const selectChamber = document.getElementById('bookingChamber');
  const selectDate = document.getElementById('bookingDate');

  // Set min date to today's date for appointment selector
  if (selectDate) {
    const today = new Date().toISOString().split('T')[0];
    selectDate.min = today;
  }

  // Open booking modal
  bookModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      bookingModal.classList.add('active');
      bookingSuccessScreen.classList.remove('active');
      appointmentForm.style.display = 'flex';
      
      // Auto select chamber location if clicked from specific chamber card
      const parentChamber = trigger.closest('.chamber-display-card');
      if (parentChamber && selectChamber) {
        const chamberTitle = parentChamber.querySelector('h3').textContent;
        if (chamberTitle.includes('Shah Skin')) selectChamber.value = 'shah-skin';
        else if (chamberTitle.includes('City Skin')) selectChamber.value = 'city-cosmetic';
        else if (chamberTitle.includes('Apex Aesthetic')) selectChamber.value = 'apex-aesthetic';
      }
    });
  });

  // Close booking modal
  const hideBookingModal = () => bookingModal.classList.remove('active');
  if (closeBookingModal) closeBookingModal.addEventListener('click', hideBookingModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', hideBookingModal);
  
  // Close modal when clicking backdrop
  const bookingBackdrop = bookingModal?.querySelector('.modal-backdrop');
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', hideBookingModal);

  // Submit appointment form
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Submit animation / processing
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'PROCESSING REQUEST <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        // Hide form, show success screen
        appointmentForm.style.display = 'none';
        bookingSuccessScreen.classList.add('active');
        
        // Reset submit button and form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        appointmentForm.reset();
      }, 1500);
    });
  }

  /* --------------------------------------------------------------------------
     7. Contact Direct Message Modal
     -------------------------------------------------------------------------- */
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');
  const closeContactSuccessBtn = document.getElementById('closeContactSuccessBtn');
  const contactBtn = document.getElementById('contactBtn');
  const directMessageForm = document.getElementById('directMessageForm');
  const contactSuccessScreen = document.getElementById('contactSuccessScreen');

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal.classList.add('active');
      contactSuccessScreen.classList.remove('active');
      directMessageForm.style.display = 'flex';
    });
  }

  const hideContactModal = () => contactModal.classList.remove('active');
  if (closeContactModal) closeContactModal.addEventListener('click', hideContactModal);
  if (closeContactSuccessBtn) closeContactSuccessBtn.addEventListener('click', hideContactModal);
  
  const contactBackdrop = contactModal?.querySelector('.modal-backdrop');
  if (contactBackdrop) contactBackdrop.addEventListener('click', hideContactModal);

  if (directMessageForm) {
    directMessageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = directMessageForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'SENDING MESSAGE <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        directMessageForm.style.display = 'none';
        contactSuccessScreen.classList.add('active');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        directMessageForm.reset();
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     8. Newsletter Sign Up Form
     -------------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      
      button.disabled = true;
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        newsletterForm.style.display = 'none';
        newsletterSuccess.style.display = 'flex';
        input.value = '';
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';

        // Auto restore form after 4 seconds
        setTimeout(() => {
          newsletterSuccess.style.display = 'none';
          newsletterForm.style.display = 'flex';
        }, 4000);
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     9. Testimonials Slider Carousel
     -------------------------------------------------------------------------- */
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const readAllReviewsBtn = document.querySelector('.read-all-reviews-btn');
  
  let currentSlide = 0;

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    const updateSlider = () => {
      const cardWidth = cards[0].offsetWidth;
      const gap = 30; // Matches track gap in CSS
      const distance = currentSlide * (cardWidth + gap);
      track.style.transform = `translateX(-${distance}px)`;
      
      // Update arrows state
      prevBtn.style.opacity = currentSlide === 0 ? '0.4' : '1';
      prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
      
      nextBtn.style.opacity = currentSlide >= cards.length - 2 ? '0.4' : '1';
      nextBtn.style.pointerEvents = currentSlide >= cards.length - 2 ? 'none' : 'auto';
    };

    nextBtn.addEventListener('click', () => {
      if (currentSlide < cards.length - 2) {
        currentSlide++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    // Handle viewport changes dynamically
    window.addEventListener('resize', updateSlider);
    
    // Initial Setup
    updateSlider();
  }

  if (readAllReviewsBtn) {
    readAllReviewsBtn.addEventListener('click', () => {
      alert('🌟 Simulated Review Portal: Loading all 248 patient testimonials and clinical feedback profiles...');
    });
  }

  /* --------------------------------------------------------------------------
     10. Simulated Patient Stories Video Player Modal
     -------------------------------------------------------------------------- */
  const videoModal = document.getElementById('videoModal');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const videoCards = document.querySelectorAll('.video-card');
  const videoPlayerBg = document.getElementById('videoPlayerBg');
  const videoPlayerTitle = document.getElementById('videoPlayerTitle');
  const videoStatusText = videoModal?.querySelector('.video-status-text');
  const videoProgress = videoModal?.querySelector('.video-progress');
  const timeDisplay = videoModal?.querySelector('.time-display');

  let videoTimer = null;
  let progressPercent = 15;
  let secondsCount = 12;

  const videoDetails = {
    'allergy-recovery': {
      title: 'From Misery to Relief: Eczema Allergy Recovery Journey',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    'acne-freedom': {
      title: 'I\'m Finally Free: Advanced Cystic Acne Treatment Success Story',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    }
  };

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-video-id');
      const details = videoDetails[id];
      
      if (!details || !videoModal) return;

      // Setup video player preview
      videoPlayerBg.src = details.image;
      videoPlayerTitle.textContent = details.title;
      videoModal.classList.add('active');
      
      // Initialize/reset simulated playback
      progressPercent = 5;
      secondsCount = 5;
      if (videoProgress) videoProgress.style.width = '5%';
      if (timeDisplay) timeDisplay.textContent = '0:05 / 2:45';
      if (videoStatusText) {
        videoStatusText.style.display = 'flex';
        videoStatusText.querySelector('span').textContent = 'Connecting with secure clinical stream...';
      }

      // Start Simulation
      videoTimer = setInterval(() => {
        progressPercent += 1.5;
        secondsCount += 3;
        
        if (progressPercent >= 100) {
          progressPercent = 100;
          clearInterval(videoTimer);
        }

        if (videoProgress) videoProgress.style.width = `${progressPercent}%`;
        
        // Convert seconds to mm:ss format
        const mins = Math.floor(secondsCount / 60);
        const secs = secondsCount % 60;
        const formattedSecs = secs < 10 ? `0${secs}` : secs;
        
        if (timeDisplay) timeDisplay.textContent = `${mins}:${formattedSecs} / 2:45`;

        // Hide connecting notification after 2 seconds
        if (secondsCount > 10 && videoStatusText) {
          videoStatusText.style.opacity = '0';
          setTimeout(() => { videoStatusText.style.display = 'none'; }, 500);
        }
      }, 1000);
    });
  });

  const stopVideoSimulation = () => {
    if (videoModal) videoModal.classList.remove('active');
    clearInterval(videoTimer);
  };

  if (closeVideoModal) closeVideoModal.addEventListener('click', stopVideoSimulation);
  
  const videoBackdrop = videoModal?.querySelector('.modal-backdrop');
  if (videoBackdrop) videoBackdrop.addEventListener('click', stopVideoSimulation);

  /* --------------------------------------------------------------------------
     11. Scroll Fade-in-up Entry Animations (Intersection Observer)
     -------------------------------------------------------------------------- */
  // Create intersection observer for scroll reveal effects
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-animated');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering view
  });

  // Attach animations styles programmatically to avoid style clutter
  const elementsToAnimate = [
    '.hero-content', '.hero-image-wrapper',
    '.social-post-card', '.about-bio-col',
    '.comparison-card', '.video-card',
    '.chamber-details-column', '.chamber-selector-column',
    '.services-info-column', '.service-card',
    '.product-card', '.testimonial-card',
    '.promo-banner-container'
  ];

  // Insert base scroll css styles dynamically
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .scroll-reveal-item {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .scroll-animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleEl);

  // Query elements and observe
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('scroll-reveal-item');
      scrollObserver.observe(el);
    });
  });
});
