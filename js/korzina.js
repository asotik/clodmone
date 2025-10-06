let cartItems = [];
const saved = localStorage.getItem('cart');
if(saved) { cartItems = JSON.parse(saved); }

const container = document.getElementById('items-container');
const cityInput = document.getElementById('city');
const streetInput = document.getElementById('street');
const kvInput = document.getElementById('kv');
const domInput = document.getElementById('dom');
const leaveDoorCheckbox = document.getElementById('leave-door');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function renderCart() {
  container.innerHTML = '';
  if(cartItems.length === 0){
    container.textContent = 'Корзина пуста';
    return;
  }
  cartItems.forEach(({title, price, imgSrc, quantity}, idx) => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.dataset.index = idx;
    div.innerHTML = `
      <img src="${imgSrc}" alt="${title}" />
      <div class="item-info">
        <div>Название: ${title}</div>
        <div>Сумма: ${price * quantity}</div>
      </div>
      <div class="quantity-controls">
        <button class="btn btn-minus">-</button>
        <div class="quantity">${quantity}</div>
        <button class="btn btn-plus">+</button>
      </div>
    `;
    container.appendChild(div);

    const minusBtn = div.querySelector('.btn-minus');
    const plusBtn = div.querySelector('.btn-plus');
    const qtyDisplay = div.querySelector('.quantity');

    minusBtn.addEventListener('click', () => {
      if(cartItems[idx].quantity > 1) {
        cartItems[idx].quantity--;
        renderCart();
        saveCart();
      }
    });
    plusBtn.addEventListener('click', () => {
      cartItems[idx].quantity++;
      renderCart();
      saveCart();
    });
  });
}

function loadAddress() {
  const addr = localStorage.getItem('address');
  if(addr) {
    const {city, street, kv, dom, leaveDoor} = JSON.parse(addr);
    cityInput.value = city || '';
    streetInput.value = street || '';
    kvInput.value = kv || '';
    domInput.value = dom || '';
    leaveDoorCheckbox.checked = !!leaveDoor;
  }
}

function saveAddress() {
  const addr = {
    city: cityInput.value,
    street: streetInput.value,
    kv: kvInput.value,
    dom: domInput.value,
    leaveDoor: leaveDoorCheckbox.checked,
  };
  localStorage.setItem('address', JSON.stringify(addr));
}

cityInput.addEventListener('input', saveAddress);
streetInput.addEventListener('input', saveAddress);
kvInput.addEventListener('input', saveAddress);
domInput.addEventListener('input', saveAddress);
leaveDoorCheckbox.addEventListener('change', saveAddress);

loadAddress();
renderCart();

