
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
import { initializeApp } from 'https://xqcdfwguvwvxeuqhfakq.supabase.co';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================
// LOCAL STORAGE SIMULATION (For demonstration)
// ============================================

class AuthSystem {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  loadUsers() {
    const stored = localStorage.getItem('novanexus_users');
    return stored ? JSON.parse(stored) : [];
  }

  saveUsers() {
    localStorage.setItem('novanexus_users', JSON.stringify(this.users));
  }

  loadCurrentUser() {
    const stored = localStorage.getItem('novanexus_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  saveCurrentUser(user) {
    localStorage.setItem('novanexus_current_user', JSON.stringify(user));
    this.currentUser = user;
  }

  clearCurrentUser() {
    localStorage.removeItem('novanexus_current_user');
    this.currentUser = null;
  }

  register(userData) {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if roll number already exists
    const existingRoll = this.users.find(u => u.rollno === userData.rollno);
    if (existingRoll) {
      throw new Error('Roll number already registered');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      registeredAt: new Date().toISOString(),
      verified: false,
      role: 'member'
    };

    this.users.push(newUser);
    this.saveUsers();

    return newUser;
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Don't save password in current user
    const { password: _, ...userWithoutPassword } = user;
    this.saveCurrentUser(userWithoutPassword);

    return userWithoutPassword;
  }

  logout() {
    this.clearCurrentUser();
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Initialize Auth System
const authSystem = new AuthSystem();

// ============================================
// FORM SWITCHING
// ============================================

function initFormSwitching() {
  const switchButtons = document.querySelectorAll('.switch-form');
  const loginCard = document.getElementById('loginCard');
  const signupCard = document.getElementById('signupCard');

  switchButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const target = button.dataset.target;

      if (target === 'login') {
        signupCard.classList.remove('active');
        setTimeout(() => {
          loginCard.classList.add('active');
        }, 100);
      } else if (target === 'signup') {
        loginCard.classList.remove('active');
        setTimeout(() => {
          signupCard.classList.add('active');
        }, 100);
      }

      // Scroll to form
      document.querySelector('.auth-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    });
  });
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// ============================================
// PASSWORD STRENGTH CHECKER
// ============================================

function initPasswordStrength() {
  const passwordInput = document.getElementById('signup-password');
  const strengthBar = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

  if (!passwordInput) return;

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);

    strengthBar.className = 'strength-fill';
    
    if (strength.score === 0) {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Password Strength';
    } else if (strength.score <= 2) {
      strengthBar.classList.add('weak');
      strengthText.textContent = 'Weak';
    } else if (strength.score <= 3) {
      strengthBar.classList.add('medium');
      strengthText.textContent = 'Medium';
    } else {
      strengthBar.classList.add('strong');
      strengthText.textContent = 'Strong';
    }
  });
}

function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return { score };
}

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRollNumber(rollno) {
  const rollRegex = /^[0-9]{2}ECE[0-9]{3}$/;
  return rollRegex.test(rollno);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

function validatePassword(password) {
  return password.length >= 8;
}

// ============================================
// LOGIN FORM HANDLER
// ============================================

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Validation
    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!password) {
      showError('Please enter your password');
      return;
    }

    // Show loading
    const submitBtn = loginForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const user = authSystem.login(email, password);

      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('novanexus_remember', 'true');
      }

      // Success
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
      
      setTimeout(() => {
        showSuccess(`Welcome back, ${user.firstname}!`);
        
        // Redirect to dashboard or home
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }, 500);

    } catch (error) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showError(error.message);
    }
  });
}

// ============================================
// SIGNUP FORM HANDLER
// ============================================

function initSignupForm() {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const firstname = document.getElementById('signup-firstname').value.trim();
    const lastname = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const rollno = document.getElementById('signup-rollno').value.trim().toUpperCase();
    const year = document.getElementById('signup-year').value;
    const phone = document.getElementById('signup-phone').value.trim();
    const domain = document.getElementById('signup-domain').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;

    // Validation
    if (!firstname || !lastname) {
      showError('Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid college email address');
      return;
    }

    if (!email.includes('kingsec.edu.in') && !email.includes('@gmail.com')) {
      showError('Please use your college email (@kingsec.edu.in)');
      return;
    }

    if (!validateRollNumber(rollno)) {
      showError('Invalid roll number format. Use YYECEXXX (e.g., 21ECE123)');
      return;
    }

    if (!year) {
      showError('Please select your year of study');
      return;
    }

    if (!validatePhone(phone)) {
      showError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!domain) {
      showError('Please select your area of interest');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      showError('Please accept the Terms & Conditions');
      return;
    }

    // Show loading
    const submitBtn = signupForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const userData = {
        firstname,
        lastname,
        email,
        rollno,
        year,
        phone,
        domain,
        password // In production, this should be hashed
      };

      const user = authSystem.register(userData);

      // Success
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
      
      setTimeout(() => {
        showSuccess('Registration Successful!');
        
        // Reset form
        signupForm.reset();
        
        // Switch to login after 2 seconds
        setTimeout(() => {
          document.querySelector('[data-target="login"]').click();
        }, 2000);
      }, 500);

    } catch (error) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showError(error.message);
    }
  });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showSuccess(message) {
  const modal = document.getElementById('successModal');
  const messageElement = modal.querySelector('p');
  messageElement.textContent = message;
  modal.classList.add('active');
}

function showError(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('errorMessage');
  messageElement.textContent = message;
  modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// ============================================
// REVEAL ANIMATIONS
// ============================================

function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animationDelay = `${index * 0.1}s`;
          entry.target.style.opacity = '1';
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(reveal => {
    reveal.style.opacity = '0';
    revealObserver.observe(reveal);
  });
}

// ============================================
// AUTO-LOGIN CHECK
// ============================================

function checkAutoLogin() {
  if (authSystem.isLoggedIn()) {
    const user = authSystem.getCurrentUser();
    console.log('User already logged in:', user.email);
    
    // You can redirect or show a different view here
    // For now, we'll just show a welcome message
    const banner = document.querySelector('.banner-subtitle');
    if (banner) {
      banner.textContent = `Welcome back, ${user.firstname}!`;
    }
  }
}

// ============================================
// REAL-TIME VALIDATION FEEDBACK
// ============================================

function initRealtimeValidation() {
  const emailInput = document.getElementById('signup-email');
  const rollnoInput = document.getElementById('signup-rollno');
  const phoneInput = document.getElementById('signup-phone');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');
  const passwordInput = document.getElementById('signup-password');

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !validateEmail(emailInput.value)) {
        emailInput.style.borderColor = '#ff4444';
      } else {
        emailInput.style.borderColor = '';
      }
    });
  }

  if (rollnoInput) {
    rollnoInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });

    rollnoInput.addEventListener('blur', () => {
      if (rollnoInput.value && !validateRollNumber(rollnoInput.value)) {
        rollnoInput.style.borderColor = '#ff4444';
      } else {
        rollnoInput.style.borderColor = '';
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value && !validatePhone(phoneInput.value)) {
        phoneInput.style.borderColor = '#ff4444';
      } else {
        phoneInput.style.borderColor = '';
      }
    });
  }

  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordInput.style.borderColor = '#ff4444';
      } else {
        confirmPasswordInput.style.borderColor = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Nova Nexus Join Page Loaded');
  
  initFormSwitching();
  initPasswordToggle();
  initPasswordStrength();
  initLoginForm();
  initSignupForm();
  initRevealAnimations();
  initRealtimeValidation();
  checkAutoLogin();
});

// Export for use in other files
window.NovaAuthSystem = authSystem;