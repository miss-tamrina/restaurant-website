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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutTotalEl.textContent = `$${subtotal.toFixed(2)}`;

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

  cart = [];
  renderCart();
  checkoutForm.reset();
  closeCheckout();
});

// =====================================================
// ---- NEW: Menu Category → Dish Display ----
// =====================================================

// ---- Dish Data grouped by category ----
// Replace image URLs, prices, and descriptions with your real dishes
const dishData = {
  sides: [
    { id: 'garlic-bread', name: 'Garlic Bread', price: 8, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYdPrAOJBhzmcnFvMzVlWpDzYbv0Ty1I4exEGL3HsLrQ&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'fries', name: 'Truffle Fries', price: 10, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzutZ4CAkedt0ie-c4aH7PzdQnaKAXHaDgg3jwVv1EXA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'onion-rings', name: 'Onion Rings', price: 9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD9KJLviLJgElP7G3hB_v1rPHdZuJ5-4AlwiaOw2pwQA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'main-course': [
    { id: 'grilled-salmon', name: 'Grilled Salmon', price: 52, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShE9UPvrP3M0mEjcFFXH9FloDSXPvHtNOFGMdk00u3yw&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'lobster-thermidor', name: 'Lobster Thermidor', price: 75, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqs7UMHOXkQGTAkWQtdciSP1pxU3OC_hJDjiVQgjiIlA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'ribeye-steak', name: 'Ribeye Steak', price: 60, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR123kVp1qfLTjLdwsJBD4MmH2YO4ekXfDxDxlvvvjSQ&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  salads: [
    { id: 'greek-salad', name: 'Greek Salad', price: 18, image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5GtBGFky-8hhapI2vuHPrFlbmlZOgAezpyp9ezqMmaw&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'caesar-salad', name: 'Caesar Salad', price: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5hXaM_GL-g-dmi-Rx8e9w87H3SaBcfkIkIksfF286Qg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'greek-salad', name: 'Potato Salad', price: 18, image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSQbrnUUa1Gokh4n6tEIwrWozEuDzl_VfFtTiyjHN2Qg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'sea foods': [
    { id: 'shrimp-scampi', name: 'Shrimp Scampi', price: 34, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKM3cWTAzkU-Sk0kSEvxi56Ik0JByeQrp9Kzz-fYbhTA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'seared-tuna', name: 'Seared Tuna', price: 38, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUlDPQiKQ4nAMMvTkjs_wLtOkxomObL6s9mT-vBCK9IA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'parmesan-crusted-tilapia', name: 'Parmesan Crusted Tilapia', price: 38, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjg6X55qScvabAS834lpzRrYAYhE65T8mV6vAkRYXrOA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  soups: [
    { id: 'tomato-soup', name: 'Tomato Basil Soup', price: 12, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS11Ho_tpapfz6t_hiDuJi4pSdnk1VIf7B76aWvT11-Cg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'mushroom-soup', name: 'Mushroom Soup', price: 13, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQbDOiNzRnsOS6fOOzUyIH6WtyZWnoSBDCGMREGJT0QQ&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'grandma-chicken-noodle-soup', name: "Grandma's Chicken Noodle Soup", price: 13, image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQERGRsbgvUqry9t71u1xL-eD8ElJmoXCIGZ3akaeTpZw&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'pasta-noodles': [
    { id: 'carbonara', name: 'Carbonara', price: 24, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmSZfhvioLJKins9fhInNpMIX7oQTI1WgoHjQNV5XkZg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'pad-thai', name: 'Pad Thai', price: 22, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF6rltida8Zm-4MORhYqfe6pz9slyC1fvptcw5g-iPYA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'tomato-rigattoni-pasta', name: 'Tomato Rigattoni Pasta', price: 22, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpHpA4jNOLPJ1-7mdvExeXqDv_5Cdvm5VWMWg7UqD-tg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'desserts': [
    { id: 'fruit-ice-cream', name: 'Fruit Ice Cream', price: 14, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Y0_Q_UQ-pAW6D_o22Y2lAdhRZg7uCyQi8fsZRJ2GFA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'chocolate-cake', name: 'Chocolate Cake', price: 16, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8rvB_wNPoCPssHzTgrkIxLCulBbiXAIRGMm_C6ezUug&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'pistachio-pudding', name: 'Pistachio Pudding', price: 16, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw_XMQGMRWP1pB0fx4oT6TiJnk0beOVvVDdtsYmecapg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'drinks': [
    { id: 'lemonade', name: 'Fresh Lemonade', price: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnXSSNFYa6eRQRvwbdqIy8kbFHq5MBieeIKd6jjFEFrA&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'iced-tea', name: 'Iced Tea', price: 5, image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZ_AmpX58BV4ko7Tkqy6RAnKuXBKE3xpsA5wPy6RXOg&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'blueberry-smoothie', name: 'Blueberry Smoothie', price: 5, image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrVntQBPUSJPBbIX_Wgh6KQdI6XDKzG9RupctVfn7wZw&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ],
  'kids': [
    { id: 'mini-burger', name: 'Mini Burger', price: 11, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmok2DRL1ORZu9AKOJPch04O5dSAmUc2eo0eDYljReJQ&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'mac-cheese', name: 'Mac & Cheese', price: 10, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSNkOzEa0UgzXwPVEodvXSQ9xw36bUgX7IVddvxOXw8g&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' },
    { id: 'chicken-tenders', name: 'Chicken Tenders', price: 12, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpN4UVHOCNnDhljC2K_exR1AQ8C6SMVQCmVS6itghF3w&s=10', desc: 'Food provides essential nutrients for overall health and well-being.' }
  ]
};

// ---- Category label lookup (for the heading above the dishes) ----
const categoryLabels = {
  sides: 'Sides',
  'main-course': 'Main Course',
  salads: 'Salads',
  'sea foods': 'Sea Foods',
  soups: 'Soups',
  'pasta-noodles': 'Pasta & Noodles',
  desserts: 'Desserts',
  drinks: 'Drinks',
  kids: 'Kids Menu'
};

// ---- DOM References ----
const menuCards = document.querySelectorAll('.menu-card');
const dishesContainer = document.getElementById('dishes-container');
const dishesHeading = document.getElementById('dishes-heading');

// ---- Menu Card Click Handler ----
menuCards.forEach(card => {
  card.addEventListener('click', () => {
    menuCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const category = card.dataset.category;
    renderDishes(category);
  });
});

// ---- Render Dishes for Selected Category ----
function renderDishes(category) {
  const dishes = dishData[category] || [];
  dishesHeading.textContent = categoryLabels[category] || '';
  dishesContainer.innerHTML = '';

  dishes.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'dish-card';

    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <button class="dish-add-btn" onclick="handleAddDish('${dish.id}', '${category}')">+</button>
      <div class="dish-info">
        <h4>${dish.name}</h4>
        <p>${dish.desc}</p>
      </div>
    `;

    dishesContainer.appendChild(card);
  });
}

// ---- Add Dish to Cart ----
function handleAddDish(dishId, category) {
  const dish = dishData[category].find(d => d.id === dishId);
  if (!dish) return;

  addToCart({
    id: dish.id,
    name: dish.name,
    price: dish.price,
    image: dish.image
  });
}

// ---- Show "Sides" by default when page loads ----
renderDishes('sides');