// ===============================
// PURE CSS ANIMATED BACKGROUND
// Alternative to Three.js (lighter weight)
// ===============================

// This file creates a CSS-based animated background
// If you prefer CSS over Three.js, use this instead

(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Remove the canvas and replace with CSS animated divs
  canvas.style.display = 'none';
  
  // Create gradient background container
  const bgContainer = document.createElement('div');
  bgContainer.className = 'css-bg-container';
  bgContainer.innerHTML = `
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <div class="gradient-orb orb-4"></div>
    <div class="stars-container"></div>
  `;
  
  document.body.insertBefore(bgContainer, document.body.firstChild);
  
  // Create stars
  const starsContainer = bgContainer.querySelector('.stars-container');
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    starsContainer.appendChild(star);
  }
  
  // Inject CSS styles
  const styles = `
    <style>
      .css-bg-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
        background: linear-gradient(180deg, #0a0e27 0%, #050810 100%);
      }
      
      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float 20s infinite ease-in-out;
      }
      
      .orb-1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #0066ff 0%, transparent 70%);
        top: -10%;
        left: -10%;
        animation-delay: 0s;
      }
      
      .orb-2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #00d9ff 0%, transparent 70%);
        top: 50%;
        right: -10%;
        animation-delay: -5s;
        animation-duration: 25s;
      }
      
      .orb-3 {
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
        bottom: -10%;
        left: 30%;
        animation-delay: -10s;
        animation-duration: 30s;
      }
      
      .orb-4 {
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, #0066ff 0%, transparent 70%);
        top: 30%;
        left: 50%;
        animation-delay: -15s;
        animation-duration: 22s;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(50px, -50px) scale(1.1);
        }
        50% {
          transform: translate(-30px, 30px) scale(0.9);
        }
        75% {
          transform: translate(30px, 50px) scale(1.05);
        }
      }
      
      .stars-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        animation: twinkle 3s infinite;
      }
      
      @keyframes twinkle {
        0%, 100% {
          opacity: 0.2;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
        }
      }
      
      /* Animated mesh overlay */
      .css-bg-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(90deg, transparent 0%, rgba(0, 102, 255, 0.05) 50%, transparent 100%),
          linear-gradient(0deg, transparent 0%, rgba(0, 217, 255, 0.05) 50%, transparent 100%);
        background-size: 100px 100px;
        animation: meshMove 20s linear infinite;
      }
      
      @keyframes meshMove {
        0% {
          background-position: 0 0, 0 0;
        }
        100% {
          background-position: 100px 100px, -100px -100px;
        }
      }
      
      /* Mobile optimization */
      @media (max-width: 768px) {
        .gradient-orb {
          filter: blur(60px);
        }
        
        .orb-1, .orb-2, .orb-3, .orb-4 {
          width: 300px;
          height: 300px;
        }
        
        .star:nth-child(n+50) {
          display: none;
        }
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', styles);
  
  // Mouse parallax effect
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    
    document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
      const speed = (index + 1) * 0.3;
      orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
  });
  
  console.log('CSS animated background loaded successfully');
})();
