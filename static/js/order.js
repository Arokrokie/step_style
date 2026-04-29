const CART_KEY = "stepStyleCart";
const STOCK_KEY = "stepStyleStock";
const CURRENCY_SYMBOL = "UGX";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getStock() {
  const stock = localStorage.getItem(STOCK_KEY);
  return stock ? JSON.parse(stock) : {};
}

function saveStock(stock) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
}

function getTotalCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalAmount(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateStockDisplay() {
  const stock = getStock();

  Object.keys(stock).forEach((id) => {
    const el = document.getElementById(`stock-${id}`);
    if (el) {
      el.textContent = stock[id];

      const btn = document.querySelector(`[data-id="${id}"]`);
      if (btn && stock[id] <= 0) {
        btn.disabled = true;
        btn.textContent = "Out of Stock";
      }
    }
  });
}

function initializeStockFromDOM() {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  let stock = getStock();

  buttons.forEach((btn) => {
    const id = btn.dataset.id;
    const initialStock = parseInt(btn.dataset.stock, 10) || 0;

    if (id && !(id in stock)) {
      stock[id] = initialStock;
    }
  });

  saveStock(stock);
}

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = getTotalCount(getCart());
  badge.textContent = count;
}

function addProductToCart(product) {
  const cart = getCart();
  const stock = getStock();
  const availableStock = stock[product.id] ?? product.stock;
  const existing = cart.find((item) => item.id === product.id);

  if (availableStock <= 0) {
    alert("This item is out of stock.");
    return;
  }

  if (existing) {
    if (existing.quantity < availableStock) {
      existing.quantity += 1;
      existing.price = product.price;
    } else {
      alert("This item is out of stock.");
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);

  if (!stock[product.id]) {
    stock[product.id] = product.stock;
    saveStock(stock);
  }

  updateCartBadge();
  alert(`${product.name} added to cart.`);
}

function setupShopPage() {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  if (addButtons.length === 0) return;

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        stock: parseInt(button.dataset.stock, 10) || 0,
      };
      addProductToCart(product);
    });
  });
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartTable();
  updateCartBadge();
}

function renderCartTable() {
  const tableBody = document.getElementById("cartTableBody");
  if (!tableBody) return;

  const totalItemsEl = document.getElementById("totalItems");
  const totalAmountEl = document.getElementById("totalAmount");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const cart = getCart();

  if (cart.length === 0) {
    tableBody.innerHTML = `\n      <tr>\n        <td colspan="5" class="text-center text-muted py-4">No items in cart yet.</td>\n      </tr>\n    `;
    if (totalItemsEl) totalItemsEl.textContent = "0";
    if (totalAmountEl) totalAmountEl.textContent = `${CURRENCY_SYMBOL} 0.00`;
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  tableBody.innerHTML = "";
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${CURRENCY_SYMBOL} ${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>${CURRENCY_SYMBOL} ${subtotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">
          Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  if (totalItemsEl) totalItemsEl.textContent = getTotalCount(cart).toString();
  if (totalAmountEl) totalAmountEl.textContent = `${CURRENCY_SYMBOL} ${getTotalAmount(cart).toFixed(2)}`;
  if (placeOrderBtn) placeOrderBtn.disabled = false;

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.id));
  });
}

function setupPlaceOrder() {
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    // If user is not logged in, save pending order and redirect to login
    const isLoggedIn = (window.checkAuth && window.checkAuth()) ? true : false;
    if (!isLoggedIn) {
      localStorage.setItem('pending_order', JSON.stringify(cart));
      // redirect to login page in the same folder
      window.location.href = 'login.html';
      return;
    }

    let stock = getStock();

    cart.forEach((item) => {
      if (stock[item.id] !== undefined) {
        stock[item.id] -= item.quantity;

        if (stock[item.id] < 0) {
          stock[item.id] = 0;
        }
      }
    });

    saveStock(stock);

    localStorage.removeItem(CART_KEY);

    window.location.href = "thanks.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeStockFromDOM();
  updateCartBadge();
  setupShopPage();
  renderCartTable();
  setupPlaceOrder();
  updateStockDisplay(); 
});
