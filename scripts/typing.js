// ===============================
// TYPING ANIMATION FOR HERO SECTION
// ===============================

(function() {
  const typedTextElement = document.getElementById('typed-text');
  const cursorElement = document.querySelector('.cursor');
  
  if (!typedTextElement) return;
  
  // Array of texts to type
  const textArray = [
    ' Welcome to Nova Nexus Club', 
    'Innovation Hub',
    'Technical Excellence',
    'Future Engineers',
    'Problem Solvers',
    'Tech Leaders'
  ];
  
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 150;
  let erasingDelay = 100;
  let newTextDelay = 2000; // Delay between current and next text
  
  function type() {
    const currentText = textArray[textArrayIndex];
    
    if (isDeleting) {
      // Remove character
      typedTextElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = erasingDelay;
    } else {
      // Add character
      typedTextElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 150;
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentText.length) {
      // Wait before starting to delete
      typingDelay = newTextDelay;
      isDeleting = true;
    } 
    // If word is completely deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next text
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      typingDelay = 500;
    }
    
    setTimeout(type, typingDelay);
  }
  
  // Start typing animation when page loads
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000); // Wait 1 second before starting
  });
  
  // Alternative: Start immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(type, 1000);
  }
})();

// ===============================
// GSAP ANIMATIONS (Optional Enhancement)
// ===============================

// If you want to use GSAP for additional animations
if (typeof gsap !== 'undefined') {
  // Animate hero content on load
  gsap.from('.hero-content img', {
    duration: 1,
    opacity: 0,
    scale: 0.5,
    ease: 'back.out(1.7)',
    delay: 0.2
  });
  
  gsap.from('.hero-content h1', {
    duration: 1,
    opacity: 0,
    y: 50,
    ease: 'power3.out',
    delay: 0.5
  });
  
  gsap.from('.hero-content h2', {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: 'power3.out',
    delay: 0.7
  });
  
  gsap.from('.hero-content h3', {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: 'power3.out',
    delay: 0.9
  });
  
  gsap.from('.hero-content > p', {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: 'power3.out',
    delay: 1.1
  });
  
  gsap.from('.hero-content > a', {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: 'power3.out',
    delay: 1.3
  });
  
  // Parallax effect for hero section
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }
  
  // Animate cards on scroll
  gsap.utils.toArray('.event-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      y: 50,
      delay: index * 0.2,
      ease: 'power3.out'
    });
  });
  
  gsap.utils.toArray('.highlight-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      scale: 0.8,
      delay: index * 0.15,
      ease: 'back.out(1.7)'
    });
  });
  
  gsap.utils.toArray('.vision-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50,
      delay: index * 0.1,
      ease: 'power3.out'
    });
  });
  
  // Number counter animation for vision cards
  const visionNumbers = document.querySelectorAll('.vision-num');
  visionNumbers.forEach(num => {
    gsap.from(num, {
      scrollTrigger: {
        trigger: num,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 1,
      opacity: 0,
      scale: 0,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

// ===============================
// ADDITIONAL INTERACTIVE FEATURES
// ===============================

// Particle effect on mouse move in hero section
(function() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.opacity = 1;
      this.color = Math.random() > 0.5 ? '#0066ff' : '#00d9ff';
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.01;
      if (this.size > 0.1) this.size -= 0.05;
    }
    
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  // Create canvas for particles
  const particleCanvas = document.createElement('canvas');
  particleCanvas.style.position = 'absolute';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100%';
  particleCanvas.style.height = '100%';
  particleCanvas.style.pointerEvents = 'none';
  particleCanvas.style.zIndex = '0';
  heroSection.appendChild(particleCanvas);
  
  const ctx = particleCanvas.getContext('2d');
  
  function resizeCanvas() {
    particleCanvas.width = heroSection.offsetWidth;
    particleCanvas.height = heroSection.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Create new particles
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  });
  
  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles = particles.filter(particle => particle.opacity > 0);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
})();

// Progress indicator
(function() {
  const progressBar = document.createElement('div');
  progressBar.style.position = 'fixed';
  progressBar.style.top = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '3px';
  progressBar.style.background = 'linear-gradient(to right, #0066ff, #00d9ff)';
  progressBar.style.width = '0%';
  progressBar.style.zIndex = '9999';
  progressBar.style.transition = 'width 0.1s ease';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
})();