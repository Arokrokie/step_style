const CART_KEY = "stepStyleCart";
//const CURRENCY_SYMBOL = "UGX";

//GET CART FROM LS*(LOCAL STORAGE)
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

//SAVE CART TO LS
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

//TOTAL COUNT OF ITEMS IN CART
function getTotalCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

//TOTAL AMOUNT OF CART
function getTotalAmount(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

//UPDATE CART BADGE IN NAVBAR
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = getTotalCount(getCart());
  badge.textContent = count;
}

//ADD PRODUCT TO CART
function addProductToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    if (existing.quantity < existing.stock) {
        existing.quantity += 1;
        existing.price = product.price; // Update price in case it has changed
    } else {
      alert("This item is out of stock.");
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  alert(`${product.name} added to cart.`);
}

//SETUP SHOP PAGE- ADD TO CART BUTTONS
function setupShopPage() {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  if (addButtons.length === 0) return;

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        stock: parseInt(button.dataset.stock, 10),
      };
      addProductToCart(product);
    });
  });
}

//REMOVE ITEM FROM CART
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartTable();
  updateCartBadge();
}

//RENDER CART TABLE IN CART PAGE
function renderCartTable() {
  const tableBody = document.getElementById("cartTableBody");
  if (!tableBody) return;

  const totalItemsEl = document.getElementById("totalItems");
  const totalAmountEl = document.getElementById("totalAmount");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const cart = getCart();

    //EMPTY CART STATE
  if (cart.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">No items in cart yet.</td>
      </tr>
    `;
    totalItemsEl.textContent = "0";
    totalAmountEl.textContent = "UGX 0.00";
    placeOrderBtn.disabled = true;
    return;
  }

    //RENDER CART ITEMS(FILL THE TABLE)
  tableBody.innerHTML = "";
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">
          Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalItemsEl.textContent = getTotalCount(cart).toString();
  totalAmountEl.textContent = `$${getTotalAmount(cart).toFixed(2)}`;
  placeOrderBtn.disabled = false;

    //REMOVE BUTTONS
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.id));
  });
}

//PLACE ORDER- CLEAR CART AND REDIRECT TO THANK YOU PAGE
function setupPlaceOrder() {
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener("click", () => {
    const cart = getCart();
      if (cart.length === 0) return;
      
    //CLEAR CART
    localStorage.removeItem(CART_KEY);
      
    // REDIRECT TO THANK YOU PAGE 
    window.location.href = "/html/thankyou.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setupShopPage();
  renderCartTable();
  setupPlaceOrder();
});
