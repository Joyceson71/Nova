/* ============================================================================
   NOVA NEXUS HUB - GALLERY AUTO-SLIDING SCRIPT
   Cinematic infinite auto-scroll with pause on hover
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector(".gallery-track");
  const cards = document.querySelectorAll(".gallery-card");
  
  if (!track || cards.length === 0) {
    console.warn('Gallery elements not found');
    return;
  }

  // Duplicate cards for seamless infinite loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Calculate total width for seamless loop
  const totalWidth = track.scrollWidth / 2;

  // Cinematic infinite auto-scroll animation
  const animation = gsap.to(track, {
    x: -totalWidth,
    duration: 25, // Adjust speed: lower = faster (e.g., 15 for faster, 35 for slower)
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    }
  });

  // Smooth pause on hover
  track.addEventListener("mouseenter", () => {
    gsap.to(animation, {
      timeScale: 0, // Pause
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Smooth resume when mouse leaves
  track.addEventListener("mouseleave", () => {
    gsap.to(animation, {
      timeScale: 1, // Resume
      duration: 0.5,
      ease: "power2.in"
    });
  });

  // Mobile touch support - pause on touch
  let isPaused = false;

  track.addEventListener("touchstart", () => {
    gsap.to(animation, {
      timeScale: 0,
      duration: 0.3
    });
    isPaused = true;
  });

  track.addEventListener("touchend", () => {
    // Resume after 1 second delay
    setTimeout(() => {
      if (isPaused) {
        gsap.to(animation, {
          timeScale: 1,
          duration: 0.5
        });
        isPaused = false;
      }
    }, 1000);
  });
});