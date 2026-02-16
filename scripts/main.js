/**
 * ===============================
 * MAIN UI INTERACTIONS & ANIMATIONS
 * ===============================
 */

(function() {
  'use strict';

  // ============ UTILITY FUNCTIONS ============
  const Utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    // Smooth scroll to element
    smoothScrollTo: (element) => {
      if (!element) return;
      
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ============ HEADER SCROLL EFFECT ============
  class HeaderController {
    constructor() {
      this.header = document.querySelector('header');
      this.scrollProgress = document.querySelector('.scroll-progress');
      this.lastScroll = 0;
      
      this.init();
    }

    init() {
      if (!this.header) return;
      
      window.addEventListener('scroll', Utils.throttle(() => {
        this.handleScroll();
      }, 100));
    }

    handleScroll() {
      const currentScroll = window.pageYOffset;
      
      // Add scrolled class
      if (currentScroll > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      // Update scroll progress bar
      if (this.scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (currentScroll / windowHeight) * 100;
        this.scrollProgress.style.width = `${scrolled}%`;
      }

      this.lastScroll = currentScroll;
    }
  }

  // ============ MOBILE NAVIGATION ============
  class MobileNavigation {
    constructor() {
      this.menuBtn = document.querySelector('.mobile-menu-btn');
      this.mobileNav = document.querySelector('.mobile-nav');
      this.navLinks = document.querySelectorAll('.mobile-nav a');
      
      this.init();
    }

    init() {
      if (!this.menuBtn || !this.mobileNav) return;
      
      // Toggle menu
      this.menuBtn.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close menu when clicking a link
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.mobileNav.classList.contains('active') &&
            !this.mobileNav.contains(e.target) &&
            !this.menuBtn.contains(e.target)) {
          this.closeMenu();
        }
      });
    }

    toggleMenu() {
      this.menuBtn.classList.toggle('active');
      this.mobileNav.classList.toggle('active');
      document.body.style.overflow = this.mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
      this.menuBtn.classList.remove('active');
      this.mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ============ SMOOTH SCROLL FOR NAVIGATION ============
  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      // Handle all anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          
          // Skip if it's just "#"
          if (href === '#') {
            e.preventDefault();
            return;
          }

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            Utils.smoothScrollTo(target);
          }
        });
      });
    }
  }

  // ============ SCROLL TO TOP BUTTON ============
  class ScrollToTop {
    constructor() {
      this.button = document.querySelector('.scroll-to-top');
      this.init();
    }

    init() {
      if (!this.button) return;

      // Show/hide button on scroll
      window.addEventListener('scroll', Utils.throttle(() => {
        if (window.pageYOffset > 300) {
          this.button.classList.add('visible');
        } else {
          this.button.classList.remove('visible');
        }
      }, 200));

      // Scroll to top on click
      this.button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ============ REVEAL ANIMATIONS ON SCROLL ============
  class RevealOnScroll {
    constructor() {
      this.revealElements = document.querySelectorAll('.reveal, .reveal-scale');
      this.init();
    }

    init() {
      if (this.revealElements.length === 0) return;

      // Initial check
      this.checkElements();

      // Check on scroll
      window.addEventListener('scroll', Utils.throttle(() => {
        this.checkElements();
      }, 100));
    }

    checkElements() {
      this.revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.85) {
          element.classList.add('active');
        }
      });
    }
  }

  // ============ SKILL BARS ANIMATION ============
  class SkillBars {
    constructor() {
      this.skillBars = document.querySelectorAll('.skill-bar');
      this.animated = false;
      this.init();
    }

    init() {
      if (this.skillBars.length === 0) return;

      window.addEventListener('scroll', Utils.throttle(() => {
        this.animateBars();
      }, 200));
    }

    animateBars() {
      if (this.animated) return;

      this.skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (barTop < windowHeight * 0.8) {
          const fill = bar.querySelector('.skill-bar-fill');
          const percentage = fill.getAttribute('data-percentage');
          
          if (fill && percentage) {
            fill.style.width = `${percentage}%`;
            this.animated = true;
          }
        }
      });
    }
  }

  // ============ GALLERY SLIDER ============
  class GallerySlider {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.slides = this.container.querySelectorAll('.gallery-slide');
      this.prevBtn = this.container.querySelector('.gallery-btn.prev');
      this.nextBtn = this.container.querySelector('.gallery-btn.next');
      this.currentIndex = 0;

      this.init();
    }

    init() {
      if (this.slides.length === 0) return;

      // Show first slide
      this.showSlide(0);

      // Button event listeners
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.previousSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      });

      // Touch swipe support
      this.setupTouchEvents();
    }

    showSlide(index) {
      this.slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
    }

    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(this.currentIndex);
    }

    previousSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.showSlide(this.currentIndex);
    }

    setupTouchEvents() {
      let touchStartX = 0;
      let touchEndX = 0;

      this.container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      this.container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      });
    }

    handleSwipe(startX, endX) {
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }
  }

  // ============ FORM VALIDATION ============
  class FormValidator {
    constructor(formSelector) {
      this.form = document.querySelector(formSelector);
      if (!this.form) return;
      
      this.init();
    }

    init() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (this.validateForm()) {
          this.submitForm();
        }
      });

      // Real-time validation
      const inputs = this.form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    }

    validateForm() {
      let isValid = true;
      const inputs = this.form.querySelectorAll('input[required], textarea[required]');

      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      return isValid;
    }

    validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      
      // Remove previous error
      this.removeError(field);

      // Check if empty
      if (field.hasAttribute('required') && value === '') {
        this.showError(field, 'This field is required');
        return false;
      }

      // Email validation
      if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showError(field, 'Please enter a valid email');
          return false;
        }
      }

      // Success state
      field.style.borderColor = '#10b981';
      return true;
    }

    showError(field, message) {
      field.style.borderColor = '#ef4444';
      
      const error = document.createElement('span');
      error.className = 'error-message';
      error.style.color = '#ef4444';
      error.style.fontSize = '0.875rem';
      error.style.marginTop = '0.25rem';
      error.style.display = 'block';
      error.textContent = message;

      field.parentNode.insertBefore(error, field.nextSibling);
    }

    removeError(field) {
      const error = field.parentNode.querySelector('.error-message');
      if (error) {
        error.remove();
      }
      field.style.borderColor = '';
    }

    submitForm() {
      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      console.log('Form submitted:', data);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        border: 3px solid #000;
        box-shadow: 6px 6px 0 #000;
        z-index: 10000;
        font-weight: 700;
        animation: slideDown 0.5s ease;
      `;
      successMessage.textContent = '✓ Message sent successfully!';
      
      document.body.appendChild(successMessage);

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 300);
      }, 3000);

      // Reset form
      this.form.reset();
      
      // Remove success borders
      const inputs = this.form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.style.borderColor = '';
      });
    }
  }

  // ============ LAZY LOADING IMAGES ============
  class LazyLoader {
    constructor() {
      this.images = document.querySelectorAll('img[data-src]');
      this.init();
    }

    init() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });

        this.images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for browsers without IntersectionObserver
        this.images.forEach(img => {
          img.src = img.dataset.src;
        });
      }
    }
  }

  // ============ TYPING EFFECT ============
  class TypingEffect {
    constructor(elementSelector, texts, speed = 100) {
      this.element = document.querySelector(elementSelector);
      if (!this.element) return;

      this.texts = texts;
      this.speed = speed;
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;

      this.init();
    }

    init() {
      this.type();
    }

    type() {
      const currentText = this.texts[this.textIndex];
      
      if (this.isDeleting) {
        this.element.textContent = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.element.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let typeSpeed = this.speed;

      if (this.isDeleting) {
        typeSpeed /= 2;
      }

      if (!this.isDeleting && this.charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        typeSpeed = 500; // Pause before starting new text
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  }

  // ============ PERFORMANCE OPTIMIZATION ============
  class PerformanceOptimizer {
    constructor() {
      this.init();
    }

    init() {
      // Reduce animations on low-end devices
      if (this.isLowEndDevice()) {
        document.body.classList.add('low-performance');
        this.disableHeavyAnimations();
      }

      // Pause animations when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAnimations();
        } else {
          this.resumeAnimations();
        }
      });
    }

    isLowEndDevice() {
      return navigator.hardwareConcurrency <= 2 || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    }

    disableHeavyAnimations() {
      const style = document.createElement('style');
      style.textContent = `
        .low-performance * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }

    pauseAnimations() {
      document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
      document.body.style.animationPlayState = 'running';
    }
  }

  // ============ INITIALIZE ALL MODULES ============
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    // Initialize all components
    new HeaderController();
    new MobileNavigation();
    new SmoothScroll();
    new ScrollToTop();
    new RevealOnScroll();
    new SkillBars();
    new GallerySlider('.gallery-container');
    new FormValidator('.contact-card form, form.contact-form');
    new LazyLoader();
    new PerformanceOptimizer();

    // Optional: Typing effect (uncomment if needed)
    // new TypingEffect('.typing-text', [
    //   'Web Developer',
    //   'UI/UX Designer',
    //   'Creative Coder'
    // ]);

    console.log('🎌 All modules initialized successfully!');
  }

  // Start initialization
  init();

})();