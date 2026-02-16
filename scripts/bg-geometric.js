// Geometric Background Animation

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('bg-canvas');
  
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Particle system
  const particles = [];
  const particleCount = 50;
  const colors = ['#3b82f6', '#ff2e63', '#fcd34d', '#8b5cf6'];
  
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = -10;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
      this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Reset particle when it goes off screen
      if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      switch(this.shape) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 1: // Square
          ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
          break;
          
        case 2: // Triangle
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
  }
  
  // Initialize particles
  function init() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.save();
          ctx.globalAlpha = (1 - distance / 150) * 0.1;
          ctx.strokeStyle = particles[i].color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  // Handle resize
  window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });
  
  // Initialize and start animation
  init();
  animate();
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  
  canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create temporary particles near mouse
    if (Math.random() < 0.3) {
      const tempParticle = new Particle();
      tempParticle.x = mouseX + (Math.random() - 0.5) * 50;
      tempParticle.y = mouseY + (Math.random() - 0.5) * 50;
      tempParticle.speedY *= 0.5;
      particles.push(tempParticle);
      
      // Remove excess particles
      if (particles.length > particleCount * 2) {
        particles.shift();
      }
    }
  });
  
  // Reduce particles on mobile for performance
  if (window.innerWidth < 768) {
    particleCount = 25;
    init();
  }
});