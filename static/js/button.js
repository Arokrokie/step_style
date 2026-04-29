// Authentication check
function isUserLoggedIn() {
  return localStorage.getItem("user") !== null && localStorage.getItem("auth_token") !== null;
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Function for the button
function handlePlaceOrder(event) {
  if (event) {
    event.preventDefault();
  }

  if (!isUserLoggedIn()) {
    alert("Please sign in before placing an order.");
    window.location.href = "login.html";
    return;
  }

  alert("LET'S GO!!💪🏻💪🏻");
  window.location.href = "shop.html";
}

// Update welcome message
function updateWelcomeMessage() {
  const user = getCurrentUser();
  const heading = document.getElementById("welcomeText");

  if (!heading) return;

  if (user) {
    heading.textContent = `Welcome back, ${user.firstName}!`;
  } else {
    heading.textContent = "Welcome to our store";
  }
}

// Logout function
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("CART_KEY");
  localStorage.removeItem("STOCK_KEY");
  window.location.href = "login.html";
}

// Initialization on page load
document.addEventListener("DOMContentLoaded", function () {
  updateWelcomeMessage();

  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", handlePlaceOrder);
  }

  // Add logout button functionality if exists
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});

