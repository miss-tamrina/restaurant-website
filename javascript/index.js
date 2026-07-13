const cartDot = document.querySelector('.cart-dot');
const buyButtons = document.querySelectorAll('.btn-cart');

let cartCount = 0;

function updateCartBadge() {
  if (cartCount > 0) {
    cartDot.classList.add('active');
    cartDot.textContent = cartCount;
  } else {
    cartDot.classList.remove('active');
    cartDot.textContent = '';
  }
}

buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    cartCount += 1;
    updateCartBadge();
  });
});

updateCartBadge();
