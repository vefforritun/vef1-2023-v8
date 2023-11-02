import { formatPrice } from './helpers.js';

/**
 * Eyða línu úr körfu
 *
 **/
function removeCartLineHandler(e) {
  e.preventDefault();
  if (!e.submitter) {
    console.warn('fann ekki submitter');
    return;
  }
  // fjarlægja línu úr körfu
  const cartLine = e.submitter.closest('tr');
  if (cartLine) {
    cartLine.remove();
  }
  const cartTable = document.querySelector('.cart table');
  if (!cartTable) {
    console.warn('fann ekki cart table');
    return;
  }
  const cartTableLineElement = cartTable.querySelectorAll('.cart table');
  if (cartTableLineElement.length == 0) {
    emptyCart();
  } else {
    updateCartTotal(cartTable);
  }
}

/**
 * Búa til línu í cart töflu
 * @param {import('../main.js').Product} product
 * @param {number} quantity
 * @returns HTMLElement
 */
function createCartLineRemove() {
  const cartLineRemoveFrom = document.createElement('form');
  cartLineRemoveFrom.classList.add('remove');
  cartLineRemoveFrom.method = 'post';
  cartLineRemoveFrom.addEventListener('submit', removeCartLineHandler);

  const cartLineRemoveButtonElement = document.createElement('button');
  cartLineRemoveButtonElement.textContent = 'Eyða hlut';
  cartLineRemoveFrom.appendChild(cartLineRemoveButtonElement);

  return cartLineRemoveFrom;
}

export function emptyCart() {
  const cartTableElement = document.querySelector('.cart table');
  if (!cartTableElement) {
    console.warn('fann ekki cart table');
    return;
  }
  const cartTableBodyElement = document.querySelector('.cart table tbody');

  if (!cartTableBodyElement) {
    console.warn('fann ekki cart table body');
    return;
  }
  emptyElement(cartTableBodyElement);
  updateCartTotal(cartTableElement);
  showCartContent(false);
}

/**
 * Búa til línu í cart töflu
 * @param {import('../main.js').Product} product
 * @param {number} quantity
 * @returns HTMLElement
 */
export function updateCartLine(cartLine, product, quantity) {
  if (!cartLine) {
    return;
  }
  const quantityElement = cartLine.querySelector('.quantity');
  const totalElement = cartLine.querySelector('.total');

  if (!quantityElement || !totalElement) {
    console.warn('fann hvorki quantity eða total');
    return;
  }

  const currentQuantity = Number.parseInt(quantityElement.textContent ?? '1', 10);

  const newQuantity = currentQuantity + quantity;
  cartLine.dataset.quantity = newQuantity.toString();
  quantityElement.textContent = newQuantity.toString();

  const newTotal = newQuantity * product.price;
  totalElement.textContent = formatPrice(newTotal);
}

/**
 * Búa til línu í körfu
 * @param {import('../main.js').Product} product
 * @param {number} quantity
 * @returns HTMLElement
 */
export function createCartLine(product, quantity) {
  const cartLineElement = document.createElement('tr');

  cartLineElement.dataset.cartProductId = product.number;
  cartLineElement.dataset.price = product.price;
  cartLineElement.dataset.quantity = quantity;

  const titleElement = document.createElement('td');
  titleElement.textContent = product.title;
  cartLineElement.appendChild(titleElement);

  const quantityElement = document.createElement('td');
  quantityElement.textContent = quantity;
  cartLineElement.appendChild(quantityElement);

  const priceElement = document.createElement('td');
  priceElement.textContent = formatPrice(product.price);
  cartLineElement.appendChild(priceElement);

  const totalElement = document.createElement('td');
  totalElement.textContent = formatPrice(product.price * quantity);
  cartLineElement.appendChild(totalElement);

  const removeButton = createCartLineRemove();
  const removeCell = document.createElement('td');
  removeCell.appendChild(removeButton);
  cartLineElement.appendChild(removeCell);

  return cartLineElement;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.cart-content');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}
