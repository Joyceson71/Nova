
  const phrases = [
    "NOVA NEXUS HUB",
    "ENGINEERING TOMORROW",
    "INNOVATION • EXCELLENCE",
    "THE ECE TECH ECOSYSTEM"
  ];

  const typedText = document.getElementById("typed-text");
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      typedText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        gsap.delayedCall(1.5, () => isDeleting = true);
      }
    } else {
      // Deleting
      typedText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    gsap.delayedCall(isDeleting ? 0.05 : 0.08, typeLoop);
  }

  window.addEventListener("load", () => {
    gsap.from(".hero-content h1, .hero-content h2, .hero-content p, .hero-content a", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });

    typeLoop();
  });