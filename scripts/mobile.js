// Mobile Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (mobileMenuBtn && mobileNav) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Update ARIA attribute
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Prevent body scroll when menu is open
      if (mobileNav.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        if (mobileNav.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          mobileNav.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          body.style.overflow = '';
        }
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });

    // Close menu when clicking any navigation link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });
  }

  // Touch swipe to close menu
  let touchStartX = 0;
  let touchEndX = 0;

  mobileNav.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  mobileNav.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swiped left - close menu
      if (mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    }
  }
});