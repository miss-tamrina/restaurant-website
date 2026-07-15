// ---- Cart Data ----
// Each item: id, name, price, image, quantity
let cart = [];

// ---- DOM References ----
const cartIconBtn = document.getElementById('cart-icon-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

// ---- Open / Close Drawer ----
cartIconBtn.addEventListener('click', () => {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('active');
});

cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('active');
}

// ---- Add Item to Cart ----
// Call this from your menu "Add to Cart" buttons, e.g.:
// addToCart({ id: 'salmon', name: 'Grilled Salmon', price: 52, image: 'images/salmon.jpg' });
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  renderCart();
}

// ---- Increase / Decrease Quantity ----
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
  }
}

// ---- Remove Item ----
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ---- Render Cart ----
function renderCart() {
  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';

    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <div class="qty-controls">
          <button onclick="changeQuantity('${item.id}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑</button>
    `;

    cartItemsContainer.appendChild(itemEl);
  });

  updateTotals();
}

// ---- Update Subtotal / Total (no tax) ----
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = itemCount;
}

// ---- DOM References for Checkout ----
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutTotalEl = document.getElementById('checkout-total');
const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

// ---- Open Checkout Modal ----
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Pull the current subtotal straight from the cart total already shown
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutTotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Close cart drawer, open checkout modal
  closeCart();
  checkoutModal.classList.add('open');
  checkoutOverlay.classList.add('active');
});

// ---- Close Checkout Modal ----
function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutOverlay.classList.remove('active');
}

cancelCheckoutBtn.addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// ---- Handle Place Order ----
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const orderDetails = {
    fullName: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('delivery-address').value,
    cardNumber: document.getElementById('card-number').value,
    total: checkoutTotalEl.textContent,
    items: cart
  };

  console.log('Order placed:', orderDetails);
  alert(`Order placed successfully! Total: ${orderDetails.total}`);

  // Reset everything
  cart = [];
  renderCart();
  checkoutForm.reset();
  closeCheckout();
});