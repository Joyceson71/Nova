// ===============================
// GALLERY SLIDER - ADVANCED
// ===============================

class GallerySlider {
  constructor() {
    this.slider = document.getElementById('gallerySlider');
    this.slides = this.slider ? this.slider.querySelectorAll('.gallery-slide') : [];
    this.prevBtn = document.querySelector('.gallery-btn.prev');
    this.nextBtn = document.querySelector('.gallery-btn.next');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.autoplayInterval = null;
    this.autoplayDelay = 4000; // Auto-slide every 4 seconds
    this.autoplayEnabled = true; // Enable autoplay by default
    
    // Touch/swipe variables
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.isDragging = false;
    
    if (this.slider && this.totalSlides > 0) {
      this.init();
    }
  }
  
  init() {
    // Set initial position
    this.updateSlider(false);
    
    // Add event listeners
    this.addEventListeners();
    
    // Create navigation dots
    this.createDots();
    
    // Preload images
    this.preloadImages();
    
    // Start autoplay after a short delay
    setTimeout(() => {
      this.startAutoplay();
    }, 500);
    
    console.log(`Gallery initialized with ${this.totalSlides} slides - Autoplay enabled`);
  }
  
  addEventListeners() {
    // Button navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Touch events
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Mouse drag events
    this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.slider.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.slider.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Pause autoplay on hover
    this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
    this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    
    // Pause autoplay on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }
  
  // Navigation methods
  nextSlide() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlider();
  }
  
  prevSlide() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }
  
  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateSlider();
  }
  
  updateSlider(animate = true) {
    if (animate) {
      this.isAnimating = true;
    }
    
    const offset = -this.currentIndex * 100;
    
    if (animate) {
      this.slider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      this.slider.style.transition = 'none';
    }
    
    this.slider.style.transform = `translateX(${offset}%)`;
    
    // Update active states
    this.updateActiveStates();
    
    // Reset animation flag
    if (animate) {
      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }
    
    // Restart autoplay
    this.restartAutoplay();
  }
  
  updateActiveStates() {
    // Update slides
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
      }
    });
    
    // Update button states
    this.updateButtonStates();
  }
  
  updateButtonStates() {
    // For infinite loop, buttons are always enabled
    // But we can add visual feedback
    if (this.prevBtn) {
      this.prevBtn.style.opacity = '1';
    }
    if (this.nextBtn) {
      this.nextBtn.style.opacity = '1';
    }
  }
  
  // Touch handling
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
    this.stopAutoplay();
  }
  
  handleTouchMove(e) {
    // Prevent vertical scroll if horizontal swipe is detected
    const touchX = e.changedTouches[0].screenX;
    const touchY = e.changedTouches[0].screenY;
    const diffX = Math.abs(touchX - this.touchStartX);
    const diffY = Math.abs(touchY - this.touchStartY);
    
    if (diffX > diffY) {
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.handleSwipe();
    this.startAutoplay();
  }
  
  handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = Math.abs(this.touchStartY - this.touchEndY);
    const threshold = 50;
    
    // Only register horizontal swipes
    if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        // Swipe left - next slide
        this.nextSlide();
      } else {
        // Swipe right - previous slide
        this.prevSlide();
      }
    }
  }
  
  // Mouse drag handling
  handleMouseDown(e) {
    this.isDragging = true;
    this.touchStartX = e.clientX;
    this.slider.style.cursor = 'grabbing';
    this.stopAutoplay();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.touchEndX = e.clientX;
    this.slider.style.cursor = 'grab';
    this.handleSwipe();
    this.startAutoplay();
  }
  
  // Keyboard navigation
  handleKeyboard(e) {
    // Only handle if gallery is in viewport
    const rect = this.slider.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isInViewport) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        break;
    }
  }
  
  // Autoplay
  startAutoplay() {
    if (!this.autoplayEnabled) return;
    
    this.stopAutoplay();
    
    console.log('Gallery autoplay started');
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
    
    // Add visual indicator for autoplay
    this.addAutoplayIndicator();
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
      console.log('Gallery autoplay stopped');
    }
  }
  
  restartAutoplay() {
    if (!this.autoplayEnabled) return;
    this.stopAutoplay();
    this.startAutoplay();
  }
  
  toggleAutoplay() {
    this.autoplayEnabled = !this.autoplayEnabled;
    
    if (this.autoplayEnabled) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
    
    this.updateAutoplayButton();
  }
  
  addAutoplayIndicator() {
    const wrapper = this.slider.closest('.gallery-slider-wrapper');
    if (!wrapper) return;
    
    let indicator = wrapper.querySelector('.autoplay-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'autoplay-indicator';
      indicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
      wrapper.appendChild(indicator);
      
      // Add click to pause
      indicator.addEventListener('click', () => this.toggleAutoplay());
      indicator.style.cursor = 'pointer';
      indicator.title = 'Click to pause autoplay';
    }
  }
  
  updateAutoplayButton() {
    const indicator = document.querySelector('.autoplay-indicator');
    if (!indicator) return;
    
    if (this.autoplayEnabled) {
      indicator.innerHTML = '<i class="fas fa-play"></i> Auto-playing';
      indicator.title = 'Click to pause autoplay';
    } else {
      indicator.innerHTML = '<i class="fas fa-pause"></i> Paused';
      indicator.title = 'Click to resume autoplay';
    }
  }
  
  // Navigation dots
  createDots() {
    const wrapper = this.slider.closest('.gallery-slider-wrapper');
    if (!wrapper) return;
    
    // Check if dots already exist
    let dotsContainer = wrapper.querySelector('.gallery-dots');
    
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'gallery-dots';
      wrapper.appendChild(dotsContainer);
    } else {
      dotsContainer.innerHTML = '';
    }
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      
      if (i === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      }
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // Image preloading
  preloadImages() {
    this.slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', () => {
          slide.classList.add('loaded');
        });
        
        // Add loading placeholder
        slide.classList.add('loading');
      } else {
        slide.classList.add('loaded');
      }
    });
  }
  
  // Handle window resize
  handleResize() {
    // Ensure correct position after resize
    this.updateSlider(false);
  }
  
  // Destroy method for cleanup
  destroy() {
    this.stopAutoplay();
    // Remove event listeners if needed
  }
}

// Initialize gallery when DOM is ready
let galleryInstance;

function initGallery() {
  galleryInstance = new GallerySlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}

// ===============================
// GALLERY LIGHTBOX (Optional Enhancement)
// ===============================

class GalleryLightbox {
  constructor() {
    this.slides = document.querySelectorAll('.gallery-slide');
    this.lightbox = null;
    this.currentLightboxIndex = 0;
    
    if (this.slides.length > 0) {
      this.createLightbox();
      this.attachClickHandlers();
    }
  }
  
  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'gallery-lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
        <button class="lightbox-next" aria-label="Next image">&#10095;</button>
        <div class="lightbox-image-container">
          <img src="" alt="" class="lightbox-image">
          <div class="lightbox-caption"></div>
        </div>
        <div class="lightbox-counter"></div>
      </div>
    `;
    
    document.body.appendChild(this.lightbox);
    
    // Add event listeners
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }
  
  attachClickHandlers() {
    this.slides.forEach((slide, index) => {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', () => this.open(index));
    });
  }
  
  open(index) {
    this.currentLightboxIndex = index;
    this.updateLightbox();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  prev() {
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.slides.length) % this.slides.length;
    this.updateLightbox();
  }
  
  next() {
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.slides.length;
    this.updateLightbox();
  }
  
  updateLightbox() {
    const currentSlide = this.slides[this.currentLightboxIndex];
    const img = currentSlide.querySelector('img');
    const overlay = currentSlide.querySelector('.gallery-overlay');
    
    const lightboxImg = this.lightbox.querySelector('.lightbox-image');
    const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = this.lightbox.querySelector('.lightbox-counter');
    
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    
    if (overlay) {
      const title = overlay.querySelector('h3')?.textContent || '';
      const desc = overlay.querySelector('p')?.textContent || '';
      lightboxCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    }
    
    lightboxCounter.textContent = `${this.currentLightboxIndex + 1} / ${this.slides.length}`;
  }
}

// Initialize lightbox (optional - uncomment to enable)
// let lightboxInstance;
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => {
//     lightboxInstance = new GalleryLightbox();
//   });
// } else {
//   lightboxInstance = new GalleryLightbox();
// }

// ===============================
// ADDITIONAL GALLERY STYLES (Add to CSS)
// ===============================

// Add these styles dynamically if not in CSS file
const galleryStyles = `
  /* Gallery Dots */
  .gallery-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .gallery-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }
  
  .gallery-dot:hover {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.2);
  }
  
  .gallery-dot.active {
    background: #0066ff;
    width: 30px;
    border-radius: 6px;
  }
  
  /* Autoplay Indicator */
  .autoplay-indicator {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 102, 255, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  }
  
  .autoplay-indicator:hover {
    background: #0066ff;
    transform: scale(1.05);
  }
  
  .autoplay-indicator i {
    font-size: 0.9rem;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(0, 102, 255, 0);
    }
  }
  
  /* Gallery Slider Cursor */
  .gallery-slider {
    cursor: grab;
  }
  
  .gallery-slider:active {
    cursor: grabbing;
  }
  
  /* Loading State */
  .gallery-slide.loading {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .gallery-slide.loaded {
    animation: none;
  }
  
  /* Progress Bar for Autoplay */
  .gallery-slider-wrapper {
    position: relative;
  }
  
  .gallery-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(to right, #0066ff, #00d9ff);
    z-index: 10;
    transition: width linear;
  }
  
  /* Lightbox Styles */
  .gallery-lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .gallery-lightbox.active {
    display: flex;
    opacity: 1;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-image-container {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 10px;
  }
  
  .lightbox-caption {
    margin-top: 20px;
    color: white;
  }
  
  .lightbox-caption h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .lightbox-caption p {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .lightbox-close,
  .lightbox-prev,
  .lightbox-next {
    position: absolute;
    background: rgba(0, 102, 255, 0.8);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-close:hover,
  .lightbox-prev:hover,
  .lightbox-next:hover {
    background: #0066ff;
    transform: scale(1.1);
  }
  
  .lightbox-close {
    top: 20px;
    right: 20px;
    font-size: 2.5rem;
    line-height: 1;
  }
  
  .lightbox-prev {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .lightbox-next {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .lightbox-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 102, 255, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .autoplay-indicator {
      top: 10px;
      left: 10px;
      padding: 6px 12px;
      font-size: 0.75rem;
    }
    
    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
    }
    
    .lightbox-close {
      top: 10px;
      right: 10px;
    }
    
    .lightbox-prev {
      left: 10px;
    }
    
    .lightbox-next {
      right: 10px;
    }
  }
`;

// Inject styles if they don't exist
if (!document.querySelector('#gallery-dynamic-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'gallery-dynamic-styles';
  styleSheet.textContent = galleryStyles;
  document.head.appendChild(styleSheet);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GallerySlider, GalleryLightbox };
}