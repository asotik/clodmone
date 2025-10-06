const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('.menu-item');
const cart = document.querySelector('.cart');
const orderBtn = document.querySelector('.btn-order');
const clearBtn = document.querySelector('.btn-clear');
const cartTotal = document.querySelector('.cart-total');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalClose = document.querySelector('.close');

let cartItems = [];

// Загрузка корзины из localStorage
function loadCart() {
  const saved = localStorage.getItem('cart');
  if(saved) {
    cartItems = JSON.parse(saved);
  }
}

// Сохранение корзины в localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if(tab.classList.contains('active')) return;
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    const category = tab.dataset.category;
    menuItems.forEach(item => {
      item.style.display = item.dataset.category === category ? 'flex' : 'none';
    });
  });
});

// Добавление в корзину
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', e => {
    const itemCard = e.target.closest('.menu-item');
    const title = itemCard.querySelector('strong').textContent;
    const priceText = itemCard.querySelector('.price').textContent;
    const imgSrc = itemCard.querySelector('img').src;
    const price = parseFloat(priceText.replace(/[^0-9\.]+/g,""));

    const existingIndex = cartItems.findIndex(x => x.title === title);
    if(existingIndex >= 0) {
      cartItems[existingIndex].quantity++;
    } else {
      cartItems.push({title,price,imgSrc,quantity:1});
    }
    renderCart();
    saveCart();
  });
});

// Быстрая инфо
document.querySelectorAll('.btn-info').forEach(btn => {
  btn.addEventListener('click', e => {
    const itemCard = e.target.closest('.menu-item');
    const name = itemCard.querySelector('strong').textContent;
    const desc = itemCard.childNodes[5].textContent.trim();
    modalText.innerHTML = `<b>${name}</b><br><br>${desc}`;
    modal.style.display = "flex";
  });
});
modalClose.onclick = () => { modal.style.display = "none"; }
window.onclick = (event) => { if(event.target === modal) modal.style.display = "none"; }

function renderCart(){
  cart.innerHTML = '';
  let sum = 0;
  if(cartItems.length === 0){
    cart.textContent = 'Корзина пуста';
    if(cartTotal) cartTotal.textContent = '';
    return;
  }
  cartItems.forEach(({title, price, imgSrc, quantity}, idx) => {
    sum += price * quantity;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${imgSrc}" alt="${title}">
      <div class="cart-item-info">
        <div>Название: ${title}</div>
        <div>Сумма: $${(price * quantity).toFixed(2)}</div>
      </div>
      <div class="quantity-controls">
        <button class="btn btn-minus" aria-label="Уменьшить количество" data-index="${idx}">-</button>
        <div class="quantity" aria-live="polite">${quantity}</div>
        <button class="btn btn-plus" aria-label="Увеличить количество" data-index="${idx}">+</button>
      </div>
    `;
    cart.appendChild(div);
  });
  if(cartTotal) cartTotal.textContent = `Итого: $${sum.toFixed(2)}`;
  saveCart();

  cart.querySelectorAll('.btn-plus').forEach(btn => btn.onclick = () => {
    const i = btn.dataset.index;
    cartItems[i].quantity++;
    renderCart();
  });

  cart.querySelectorAll('.btn-minus').forEach(btn => btn.onclick = () => {
    const i = btn.dataset.index;
    if(cartItems[i].quantity > 1) {
      cartItems[i].quantity--;
      renderCart();
    }
  });
}

// Переход на коризну
orderBtn.addEventListener('click', () => {
  if(cartItems.length === 0) {
    alert("Корзина пуста, добавьте товар");
    return;
  }
  window.location.href = 'korzina.html';
});

loadCart();
renderCart();
// Рендер корзины с обновлением localStorage
function renderCart(){
  cart.innerHTML = '';
  let sum = 0;
  if(cartItems.length === 0){
    cart.textContent = 'Корзина пуста';
    if(cartTotal) cartTotal.textContent = '';
    saveCart();
    return;
  }
  cartItems.forEach(({title, price, imgSrc, quantity}, idx) => {
    sum += price * quantity;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${imgSrc}" alt="${title}">
      <div class="cart-item-info">
        <div>Название: ${title}</div>
        <div>Сумма: $${(price * quantity).toFixed(2)}</div>
      </div>
      <div class="quantity-controls">
        <button class="btn btn-minus" aria-label="Уменьшить количество" data-index="${idx}">-</button>
        <div class="quantity" aria-live="polite">${quantity}</div>
        <button class="btn btn-plus" aria-label="Увеличить количество" data-index="${idx}">+</button>
      </div>
    `;
    cart.appendChild(div);
  });
  if(cartTotal) cartTotal.textContent = `Итого: $${sum.toFixed(2)}`;
  saveCart(); // Очень важно сохранять тут изменения

  cart.querySelectorAll('.btn-plus').forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      cartItems[i].quantity++;
      renderCart();
    };
  });

  cart.querySelectorAll('.btn-minus').forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      if(cartItems[i].quantity > 1) {
        cartItems[i].quantity--;
        renderCart();
      }
    };
  });
}
clearBtn.onclick = () => {
  cartItems = [];
  saveCart();            // Обязательно сохрани пустую корзину в localStorage
  renderCart();          // Обнови DOM корзины
};
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}