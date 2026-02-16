// Auto-scrolling Gallery with Smooth Infinite Loop

document.addEventListener('DOMContentLoaded', function() {
  const galleryTrack = document.querySelector('.gallery-track');
  
  if (!galleryTrack) return;

  let scrollPosition = 0;
  let isScrolling = true;
  let scrollSpeed = 0.5; // Pixels per frame
  let animationFrame;

  // Clone gallery items for seamless loop
  const galleryCards = Array.from(galleryTrack.children);
  galleryCards.forEach(card => {
    const clone = card.cloneNode(true);
    galleryTrack.appendChild(clone);
  });

  function autoScroll() {
    if (!isScrolling) return;
    
    scrollPosition += scrollSpeed;
    
    // Reset scroll position when first set of items has scrolled past
    const cardWidth = galleryCards[0].offsetWidth + 40; // Including gap
    const totalWidth = cardWidth * galleryCards.length;
    
    if (scrollPosition >= totalWidth) {
      scrollPosition = 0;
    }
    
    galleryTrack.style.transform = `translateX(-${scrollPosition}px)`;
    
    animationFrame = requestAnimationFrame(autoScroll);
  }

  // Start auto-scroll
  autoScroll();

  // Pause on hover
  galleryTrack.addEventListener('mouseenter', function() {
    isScrolling = false;
  });

  galleryTrack.addEventListener('mouseleave', function() {
    isScrolling = true;
    autoScroll();
  });

  // Pause on touch
  galleryTrack.addEventListener('touchstart', function() {
    isScrolling = false;
  });

  galleryTrack.addEventListener('touchend', function() {
    setTimeout(() => {
      isScrolling = true;
      autoScroll();
    }, 2000);
  });

  // Manual scroll with mouse drag
  let isDragging = false;
  let startX;
  let scrollLeft;

  galleryTrack.addEventListener('mousedown', function(e) {
    isDragging = true;
    isScrolling = false;
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = scrollPosition;
    galleryTrack.style.cursor = 'grabbing';
  });

  galleryTrack.addEventListener('mouseleave', function() {
    if (isDragging) {
      isDragging = false;
      isScrolling = true;
      galleryTrack.style.cursor = 'grab';
    }
  });

  galleryTrack.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      setTimeout(() => {
        isScrolling = true;
      }, 1000);
      galleryTrack.style.cursor = 'grab';
    }
  });

  galleryTrack.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 2;
    scrollPosition = scrollLeft - walk;
    
    // Keep within bounds
    const cardWidth = galleryCards[0].offsetWidth + 40;
    const totalWidth = cardWidth * galleryCards.length;
    
    if (scrollPosition < 0) scrollPosition = 0;
    if (scrollPosition > totalWidth) scrollPosition = totalWidth;
  });

  // Touch scroll
  let touchStartX = 0;
  let touchScrollLeft = 0;

  galleryTrack.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = scrollPosition;
  });

  galleryTrack.addEventListener('touchmove', function(e) {
    const x = e.touches[0].pageX;
    const walk = (touchStartX - x) * 2;
    scrollPosition = touchScrollLeft + walk;
    
    const cardWidth = galleryCards[0].offsetWidth + 40;
    const totalWidth = cardWidth * galleryCards.length;
    
    if (scrollPosition < 0) scrollPosition = 0;
    if (scrollPosition > totalWidth) scrollPosition = totalWidth;
  });

  // Adjust on window resize
  window.addEventListener('resize', function() {
    cancelAnimationFrame(animationFrame);
    scrollPosition = 0;
    galleryTrack.style.transform = 'translateX(0)';
    autoScroll();
  });

  // Pause when gallery is not in viewport
  const gallerySection = document.getElementById('gallery');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isDragging) {
          isScrolling = true;
          autoScroll();
        }
      } else {
        isScrolling = false;
        cancelAnimationFrame(animationFrame);
      }
    });
  }, { threshold: 0.1 });

  if (gallerySection) {
    galleryObserver.observe(gallerySection);
  }
});