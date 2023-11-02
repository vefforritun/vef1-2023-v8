import { createCartLine, showCartContent, updateCartLine } from './lib/ui.js';
import { validateInteger } from './lib/helpers.js';
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/** Bæta vöru í körfu */
function addProductToCart(product, quantity) {

  const cartTableBodyElement = document.querySelector('.cart table tbody');
  console.log('cartTableBodyElement :>> ', cartTableBodyElement);
  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart table');
    return;
  }
  

  // Finna cart line hlut sem er þegar í körfu og verið er að bæta við
  const existingCartLine = Array.from(cartTableBodyElement.children).find(
    (cartLine) => cartLine.dataset.cartProductId === product.id
  );

  if (existingCartLine) {
    // hlutur er í körfu, hækka quantity
    const existingQuantity =  Number.parseInt(existingCartLine.dataset.quantity, 10);
    const newQuantity = existingQuantity + quantity;
    updateCartLine(existingCartLine, product, newQuantity);
  } else {
    // hlutur ekki í körfu, bæta við nýju cartLine
    const cartLine = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(cartLine);
  }

  // Sýna innihald körfu og uppfæra
  showCartContent(true);
  updateCartLine(cartTableBodyElement, product, newQuantity);
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr')

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantityInputElement = parent.querySelector(
    'input[name="quantity"]',
  );
  if(!quantityInputElement) {
    console.warn('gat ekki fundið fjöldi input');
    return;
  }
  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantity = Number.parseInt(quantityInputElement.value ?? '', 10);
  if (!validateInteger(quantity, 1, 99)) {
    console.warn('Fjöldi ekki á bilinu [1, 99]');
    return;
  }
  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// TODO bæta við event handler á form sem submittar pöntun
