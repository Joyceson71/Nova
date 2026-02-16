// Main JavaScript for Nova Nexus Hub

document.addEventListener('DOMContentLoaded', function() {
  
  // ============ SCROLL PROGRESS BAR ============
  const scrollProgress = document.querySelector('.scroll-progress');
  
  window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
  });

  // ============ SCROLL TO TOP BUTTON ============
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============ HEADER SCROLL BEHAVIOR ============
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
  });

  // ============ SMOOTH SCROLL FOR NAVIGATION ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ============ ACTIVE NAV LINK ON SCROLL ============
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.center-section a, .mobile-nav a');
  
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Initial call

  // ============ REVEAL ANIMATIONS ============
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .fade-in');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally unobserve after revealing
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ============ CONTACT FORM HANDLING ============
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Here you would normally send the data to a server
      console.log('Form submitted:', data);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }

  // ============ LAZY LOADING IMAGES ============
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));

  // ============ PERFORMANCE OPTIMIZATION ============
  // Debounce function for scroll events
  function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ============ ACCESSIBILITY ENHANCEMENTS ============
  // Skip to main content
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link visually-hidden';
  skipLink.addEventListener('focus', function() {
    this.classList.remove('visually-hidden');
  });
  skipLink.addEventListener('blur', function() {
    this.classList.add('visually-hidden');
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  // ============ CONSOLE WELCOME MESSAGE ============
  console.log('%c👋 Welcome to Nova Nexus Hub!', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
  console.log('%cInterested in our code? Check out our GitHub!', 'font-size: 14px; color: #ff2e63;');
});