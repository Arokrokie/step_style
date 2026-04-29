// Firebase Authentication for Step Style

import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Switch between login and registration tabs
function switchTab(tab) {
  // Hide all forms
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('registerForm').classList.remove('active');

  // Remove active class from all tabs
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));

  // Show selected form and tab
  if (tab === 'login') {
    document.getElementById('loginForm').classList.add('active');
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
  } else {
    document.getElementById('registerForm').classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
  }
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Show alert message
function showAlert(message, type = 'error') {
  const alertDiv = document.getElementById('alertMessage');
  alertDiv.className = `alert-message ${type} show`;
  alertDiv.textContent = message;

  // Auto-hide after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
  }, 5000);
}

// Handle Login with Firebase
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showAlert('Please fill in all fields', 'error');
    return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.city,
        address: userData.address,
        gender: userData.gender
      }));
      localStorage.setItem('auth_token', user.uid);
      
      // If there is a pending order saved before login, complete it now
      const pending = localStorage.getItem('pending_order');
      if (pending) {
        try {
          const pendingCart = JSON.parse(pending);
          const stockKey = 'stepStyleStock';
          const stock = JSON.parse(localStorage.getItem(stockKey) || '{}');

          pendingCart.forEach((item) => {
            if (stock[item.id] !== undefined) {
              stock[item.id] -= item.quantity;
              if (stock[item.id] < 0) stock[item.id] = 0;
            }
          });

          localStorage.setItem(stockKey, JSON.stringify(stock));
          localStorage.removeItem('stepStyleCart');
          localStorage.removeItem('pending_order');

          showAlert('Login successful! Completing your order...', 'success');
          setTimeout(() => {
            window.location.href = './thanks.html';
          }, 1100);
        } catch (err) {
          console.error('Error completing pending order:', err);
          showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = './shop.html';
          }, 1200);
        }
      } else {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = './shop.html';
        }, 1500);
      }
    }
  } catch (error) {
    showAlert('Login failed: ' + error.message, 'error');
    console.error('Login error:', error);
  }
});

// Handle Registration with Firebase
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const city = document.getElementById('regCity').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const gender = document.getElementById('regGender').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;
  
  if (!firstName || !lastName || !email || !password || !city || !address || !gender) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }
  
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters', 'error');
    return;
  }
  
  if (!agreeTerms) {
    showAlert('Please agree to the Terms & Conditions', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showAlert('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    // Create user account with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email,
      address,
      city,
      gender,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    showAlert('Registration successful! Please log in.', 'success');
    
    document.getElementById('registerForm').reset();
    
    setTimeout(() => {
      switchTab('login');
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginEmail').focus();
    }, 2000);
  } catch (error) {
    showAlert('Registration failed: ' + error.message, 'error');
    console.error('Registration error:', error);
  }
});

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Check if user is already logged in
function checkAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Logout function
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('CART_KEY');
  localStorage.removeItem('STOCK_KEY');
  
  signOut(auth).then(() => {
    window.location.href = './login.html';
  }).catch((error) => {
    console.error('Logout error:', error);
  });
}

// Update UI for logged in users
function updateUserUI() {
  const user = checkAuth();
  if (user) {
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
      welcomeText.textContent = `Welcome, ${user.firstName}!`;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateUserUI);

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user && !checkAuth()) {
    getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('user', JSON.stringify({
          id: user.uid,
          email: user.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          city: userData.city,
          address: userData.address,
          gender: userData.gender
        }));
        localStorage.setItem('auth_token', user.uid);
      }
    });
  }
});

// Export functions for global use
window.switchTab = switchTab;
window.togglePassword = togglePassword;
window.logout = logout;
window.checkAuth = checkAuth;

console.log('Firebase Auth module loaded');
