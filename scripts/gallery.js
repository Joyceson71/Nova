// ===============================
// HORIZONTAL SCROLL GALLERY WITH AUTO-SLIDE
// ===============================

class HorizontalGallery {
  constructor() {
    this.wrapper = document.getElementById('galleryScrollWrapper');
    this.slides = this.wrapper ? this.wrapper.querySelectorAll('.gallery-slide-item') : [];
    this.prevBtn = document.querySelector('.gallery-nav-btn.prev');
    this.nextBtn = document.querySelector('.gallery-nav-btn.next');
    this.dotsContainer = document.getElementById('galleryDots');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoplayInterval = null;
    this.autoplayDelay = 4000; // 4 seconds
    this.isAutoplayEnabled = true;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    
    if (this.wrapper && this.totalSlides > 0) {
      this.init();
    }
  }
  
  init() {
    this.createDots();
    this.attachEventListeners();
    this.updateActiveDot();
    this.startAutoplay();
    this.addAutoplayIndicator();
    
    console.log(`Horizontal Gallery initialized with ${this.totalSlides} slides`);
  }
  
  attachEventListeners() {
    // Button navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToPrev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToNext());
    }
    
    // Mouse drag scrolling
    this.wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.wrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.wrapper.addEventListener('mouseup', () => this.handleMouseUp());
    this.wrapper.addEventListener('mouseleave', () => this.handleMouseUp());
    
    // Touch scrolling
    this.wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.wrapper.addEventListener('touchend', () => this.handleTouchEnd());
    
    // Scroll event to update active dot
    this.wrapper.addEventListener('scroll', () => this.handleScroll());
    
    // Pause autoplay on hover
    this.wrapper.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.wrapper.addEventListener('mouseleave', () => this.resumeAutoplay());
    
    // Pause on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    });
  }
  
  // Navigation methods
  scrollToNext() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.scrollToSlide(this.currentIndex);
  }
  
  scrollToPrev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.scrollToSlide(this.currentIndex);
  }
  
  scrollToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    
    const slide = this.slides[index];
    const scrollLeft = slide.offsetLeft - (this.wrapper.offsetWidth / 2) + (slide.offsetWidth / 2);
    
    this.wrapper.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
    
    this.currentIndex = index;
    this.updateActiveDot();
    this.restartAutoplay();
  }
  
  // Mouse drag handlers
  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.pageX - this.wrapper.offsetLeft;
    this.scrollLeft = this.wrapper.scrollLeft;
    this.wrapper.style.cursor = 'grabbing';
    this.pauseAutoplay();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - this.wrapper.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.wrapper.scrollLeft = this.scrollLeft - walk;
  }
  
  handleMouseUp() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.wrapper.style.cursor = 'grab';
    this.snapToClosestSlide();
    this.resumeAutoplay();
  }
  
  // Touch handlers
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX;
    this.scrollLeft = this.wrapper.scrollLeft;
    this.pauseAutoplay();
  }
  
  handleTouchMove(e) {
    const x = e.touches[0].pageX;
    const walk = (this.startX - x) * 2;
    this.wrapper.scrollLeft = this.scrollLeft + walk;
  }
  
  handleTouchEnd() {
    this.snapToClosestSlide();
    this.resumeAutoplay();
  }
  
  // Scroll handler
  handleScroll() {
    // Update current index based on scroll position
    const scrollLeft = this.wrapper.scrollLeft;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(this.wrapper).gap);
    
    const newIndex = Math.round(scrollLeft / (slideWidth + gap));
    
    if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.totalSlides) {
      this.currentIndex = newIndex;
      this.updateActiveDot();
    }
  }
  
  snapToClosestSlide() {
    const scrollLeft = this.wrapper.scrollLeft;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(this.wrapper).gap);
    
    const index = Math.round(scrollLeft / (slideWidth + gap));
    this.scrollToSlide(index);
  }
  
  // Dots
  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'gallery-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.scrollToSlide(i));
      
      this.dotsContainer.appendChild(dot);
    }
  }
  
  updateActiveDot() {
    const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
    
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Autoplay
  startAutoplay() {
    if (!this.isAutoplayEnabled) return;
    
    this.pauseAutoplay();
    
    this.autoplayInterval = setInterval(() => {
      this.scrollToNext();
    }, this.autoplayDelay);
    
    console.log('Gallery autoplay started');
  }
  
  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  
  resumeAutoplay() {
    if (this.isAutoplayEnabled) {
      this.startAutoplay();
    }
  }
  
  restartAutoplay() {
    this.pauseAutoplay();
    this.resumeAutoplay();
  }
  
  toggleAutoplay() {
    this.isAutoplayEnabled = !this.isAutoplayEnabled;
    
    if (this.isAutoplayEnabled) {
      this.startAutoplay();
    } else {
      this.pauseAutoplay();
    }
    
    this.updateAutoplayIndicator();
  }
  
  addAutoplayIndicator() {
    const container = document.querySelector('.gallery-container');
    if (!container) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'gallery-autoplay-indicator';
    indicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
    indicator.addEventListener('click', () => this.toggleAutoplay());
    
    container.appendChild(indicator);
    this.autoplayIndicator = indicator;
  }
  
  updateAutoplayIndicator() {
    if (!this.autoplayIndicator) return;
    
    if (this.isAutoplayEnabled) {
      this.autoplayIndicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
    } else {
      this.autoplayIndicator.innerHTML = '<i class="fas fa-pause"></i> Paused';
    }
  }
  
  destroy() {
    this.pauseAutoplay();
  }
}

// Initialize gallery
let galleryInstance;

function initHorizontalGallery() {
  galleryInstance = new HorizontalGallery();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHorizontalGallery);
} else {
  initHorizontalGallery();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!galleryInstance || !galleryInstance.wrapper) return;
  
  // Check if gallery is in viewport
  const rect = galleryInstance.wrapper.getBoundingClientRect();
  const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
  
  if (!isInViewport) return;
  
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    galleryInstance.scrollToPrev();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    galleryInstance.scrollToNext();
  }
});
