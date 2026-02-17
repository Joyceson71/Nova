
class AnimatedBackground2D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.lines = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    
    // Device detection
    this.isMobile = window.innerWidth < 768;
    
    // Configuration based on device
    this.config = {
      particleCount: this.isMobile ? 30 : 60,
      lineCount: this.isMobile ? 8 : 15,
      maxDistance: this.isMobile ? 100 : 150,
      colors: {
        primary: '#3b82f6',    // hero-blue
        secondary: '#ff2e63',  // power-pink
        tertiary: '#fcd34d',   // cyber-yellow
        accent: '#8b5cf6'      // purple
      }
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createLines();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // ============ PARTICLES ============
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(new Particle(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        this.config.colors,
        this.canvas
      ));
    }
  }

  drawParticles() {
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });
  }

  // ============ CONNECTING LINES ============
  connectParticles() {
    const maxDistance = this.config.maxDistance;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  // ============ MOUSE INTERACTION ============
  handleMouseInteraction() {
    if (this.mouse.x === null || this.mouse.y === null) return;

    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const opacity = 1 - distance / this.mouse.radius;
        
        // Draw connection to mouse
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 46, 99, ${opacity * 0.5})`;
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();

        // Push particle away gently
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 0.2;
        particle.vy -= Math.sin(angle) * force * 0.2;
      }
    });

    // Draw mouse glow
    const gradient = this.ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, this.mouse.radius
    );
    gradient.addColorStop(0, 'rgba(255, 46, 99, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 46, 99, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // ============ ANIMATED LINES ============
  createLines() {
    this.lines = [];
    
    for (let i = 0; i < this.config.lineCount; i++) {
      this.lines.push(new AnimatedLine(
        this.canvas.width,
        this.canvas.height,
        this.config.colors
      ));
    }
  }

  drawLines() {
    this.lines.forEach(line => {
      line.update(this.canvas.width, this.canvas.height);
      line.draw(this.ctx);
    });
  }

  // ============ GRADIENT BACKGROUND ============
  drawGradientBackground() {
    const gradient = this.ctx.createLinearGradient(
      0, 0,
      this.canvas.width, this.canvas.height
    );
    
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 46, 99, 0.05)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // ============ GRID OVERLAY ============
  drawGrid() {
    const gridSize = this.isMobile ? 40 : 30;
    const opacity = 0.03;

    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  // ============ EVENT LISTENERS ============
  setupEventListeners() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Mouse leave
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    this.isMobile = window.innerWidth < 768;
    this.config.particleCount = this.isMobile ? 30 : 60;
    this.config.lineCount = this.isMobile ? 8 : 15;
    this.config.maxDistance = this.isMobile ? 100 : 150;
    
    this.resize();
    this.createParticles();
    this.createLines();
  }

  // ============ ANIMATION LOOP ============
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw layers
    this.drawGradientBackground();
    this.drawGrid();
    this.drawLines();
    this.drawParticles();
    this.connectParticles();
    this.handleMouseInteraction();

    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  // ============ CONTROLS ============
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }

  destroy() {
    this.pause();
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    console.log('AnimatedBackground2D destroyed');
  }
}

// ============ PARTICLE CLASS ============
class Particle {
  constructor(x, y, colors, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.colors = colors;
    
    // Random color from palette
    const colorKeys = Object.keys(colors);
    this.color = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
    
    // Size
    this.baseSize = Math.random() * 3 + 1;
    this.size = this.baseSize;
    
    // Velocity
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    
    // Pulsing effect
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    // Move particle
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

    // Keep within bounds
    this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height, this.y));

    // Apply friction
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Pulsing effect
    this.pulsePhase += this.pulseSpeed;
    this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.5;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ============ ANIMATED LINE CLASS ============
class AnimatedLine {
  constructor(canvasWidth, canvasHeight, colors) {
    this.reset(canvasWidth, canvasHeight);
    this.colors = colors;
    
    // Random color
    const colorKeys = Object.keys(colors);
    this.color = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
    
    // Animation properties
    this.speed = Math.random() * 0.5 + 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.length = Math.random() * 200 + 100;
    this.thickness = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  reset(canvasWidth, canvasHeight) {
    // Random starting position
    const side = Math.floor(Math.random() * 4);
    
    switch(side) {
      case 0: // Top
        this.x = Math.random() * canvasWidth;
        this.y = -50;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2 + 1;
        break;
      case 1: // Right
        this.x = canvasWidth + 50;
        this.y = Math.random() * canvasHeight;
        this.vx = -(Math.random() * 2 + 1);
        this.vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // Bottom
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + 50;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -(Math.random() * 2 + 1);
        break;
      case 3: // Left
        this.x = -50;
        this.y = Math.random() * canvasHeight;
        this.vx = Math.random() * 2 + 1;
        this.vy = (Math.random() - 0.5) * 2;
        break;
    }
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.angle += 0.01;

    // Reset if out of bounds
    if (
      this.x < -100 || this.x > canvasWidth + 100 ||
      this.y < -100 || this.y > canvasHeight + 100
    ) {
      this.reset(canvasWidth, canvasHeight);
    }
  }

  draw(ctx) {
    const endX = this.x + Math.cos(this.angle) * this.length;
    const endY = this.y + Math.sin(this.angle) * this.length;

    // Gradient line
    const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
    gradient.addColorStop(0, this.hexToRgba(this.color, 0));
    gradient.addColorStop(0.5, this.hexToRgba(this.color, this.opacity));
    gradient.addColorStop(1, this.hexToRgba(this.color, 0));

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
  const bg = new AnimatedBackground2D('bg-canvas');
  window.animatedBackground2D = bg;
  
  console.log('✨ 2D Animated Background initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimatedBackground2D;
}