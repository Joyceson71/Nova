// Typing Animation Effect

document.addEventListener('DOMContentLoaded', function() {
  const typedTextElement = document.getElementById('typed-text');
  
  if (!typedTextElement) return;

  const texts = [
    'Welcome to Nova Nexus',
    'Empowering ECE Excellence',
    'Innovation Meets Engineering',
    'Building Tomorrow\'s Engineers'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDelay = 2000;

  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      // Remove characters
      typedTextElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = deletingSpeed;
      
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before typing next text
      }
    } else {
      // Add characters
      typedTextElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
      
      if (charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = pauseDelay; // Pause before deleting
      }
    }
    
    setTimeout(type, typingSpeed);
  }

  // Start typing animation
  setTimeout(type, 1000);
});