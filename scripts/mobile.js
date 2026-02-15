// ===============================
// MOBILE NAVIGATION
// ===============================

(function() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
  const header = document.querySelector('header');
  
  if (!menuBtn || !mobileNav) return;
  
  // Toggle mobile menu
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileNav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && 
        !mobileNav.contains(e.target) && 
        !menuBtn.contains(e.target)) {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Header scroll effect
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Smooth scroll for all navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just '#'
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Active navigation highlighting
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.center-section a');
  
  function highlightNavigation() {
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop nav
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        
        // Mobile nav
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavigation);
  highlightNavigation(); // Initial call
  
  // Gallery slider functionality
  const gallerySlider = document.getElementById('gallerySlider');
  const prevBtn = document.querySelector('.gallery-btn.prev');
  const nextBtn = document.querySelector('.gallery-btn.next');
  
  if (gallerySlider && prevBtn && nextBtn) {
    let currentSlide = 0;
    const slides = gallerySlider.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    
    function showSlide(index) {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      
      const offset = -currentSlide * 100;
      gallerySlider.style.transform = `translateX(${offset}%)`;
    }
    
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
    
    // Auto-slide every 5 seconds
    let autoSlide = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
    
    // Pause auto-slide on hover
    gallerySlider.addEventListener('mouseenter', () => {
      clearInterval(autoSlide);
    });
    
    gallerySlider.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallerySlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    gallerySlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        showSlide(currentSlide + 1);
      }
      if (touchEndX > touchStartX + 50) {
        showSlide(currentSlide - 1);
      }
    }
  }
  
  // Form submission handler
  const contactForm = document.querySelector('#contact form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const message = contactForm.querySelector('textarea').value;
      
      // You can add your form submission logic here
      // For now, just show a success message
      alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Add animation on scroll for elements without AOS
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements that need animation
  document.querySelectorAll('.event-card, .highlight-card, .vision-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();