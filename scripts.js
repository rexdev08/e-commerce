import { storage } from "./storage.js";

//declaracion de variables y funciones

let shoppingCart = [];

const getId = (element) => document.getElementById(element);
const $btnShoppingCart = getId("btn-shopping-cart");
const $modal = getId("modal");
const $productsContainer = getId("products-container");
const $btnMenu = getId("btn-menu");
const $headerMenu = getId("header-menu");
const $sofas = getId("sofas");
const $veladores = getId("veladores");
const $btnClose = getId("btn-close");
const $modalItems = getId("modal-items");
const showModal = () => $modal.classList.toggle("modal--active");
const showMenu = () => $headerMenu.classList.toggle("header__menu--active");

function renderProduct(obj) {
  return `<div class="item" id="${obj.id}">
            <img loading="lazy" src="${obj.image}" alt="" class="item__image">
            <h3 class="item__h3">${obj.product}</h3>
            <span class="item__span">$${obj.price.toLocaleString()}</span>
            <button data-key="${obj.id}" id="product-${
    obj.id
  }" class="item__button">anadir al carrito</button>
          </div>`;
}

const renderItem = (obj) => {
  return ` 
  <div class="item__split item__split--left">
    <img src="${obj.image}" alt="producto" class="item__image">
    <span class="item__btn-delete">eliminar</span>
  </div>
  <div class="item__split item__split--right">
    <h3 class="item__description">${obj.product}</h3>
    <span class="item__price">$${obj.price.toLocaleString()}</span>
    <div class="item__buttons">

      <button id="btn-left" class="item__button item__button--left">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
        </svg></button>
      <span data-identifier="${obj.id}" id="quantity" class="item__quantity">${
    obj.quantity
  }</span>
      <button id="btn-right" class="item__button item__button--right"><svg xmlns="http://www.w3.org/2000/svg"
          fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg></button>
    </div>
  </div>
 `;
};

function updateTotal() {
  const $total = document.getElementById("total");
  const total = shoppingCart
    .map((obj) => {
      return obj.price * obj.quantity;
    })
    .reduce((value, nextValue) => {
      return value + nextValue;
    }, 0)
    .toLocaleString();
  $total.innerText = total;
  const $headerCounter = document.getElementById("header-counter");

  const itemsTotal = shoppingCart
    .map((obj) => {
      return obj.quantity;
    })
    .reduce((value, nextValue) => {
      return value + nextValue;
    }, 0);

  $headerCounter.innerText = itemsTotal;

  $headerCounter.innerText > 0
    ? $headerCounter.classList.add("header__counter--active")
    : $headerCounter.classList.remove("header__counter--active");
}

function updateCar() {
  $modalItems.innerHTML = "";
  shoppingCart.forEach((product) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = product.id;
    div.innerHTML = renderItem(product);
    $modalItems.append(div);
  });
}

function filterProducts(element = "sofa") {
  const selection = storage.filter((obj) => obj.category === element);

  $productsContainer.innerHTML = selection
    .map((product) => renderProduct(product))
    .join("");

  const $btnAdd = document.querySelectorAll(".item__button");
  $btnAdd.forEach((boton) => {
    boton.addEventListener("click", () => {
      const product = storage.find((obj) => obj.id == boton.dataset.key);
      if (!shoppingCart.includes(product)) {
        shoppingCart.push(product);

        updateTotal();
      }

      updateCar();

      const btnsRemove = $modalItems.querySelectorAll(".item__btn-delete");
      btnsRemove.forEach((btn) => {
        btn.addEventListener("click", () => {
          btn.parentElement.parentElement.remove();
          shoppingCart = shoppingCart.filter(
            (obj) => obj.id != btn.parentElement.parentElement.dataset.id
          );
          storage.find(
            (obj) => obj.id == btn.parentElement.parentElement.dataset.id
          ).quantity = 1;

          updateTotal();
        });
      });

      const btnMinus = $modalItems.querySelectorAll("#btn-left");
      btnMinus.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId =
            btn.parentElement.parentElement.parentElement.dataset.id;
          const qty = $modalItems.querySelector(
            `[data-identifier="${productId}"]`
          );
          const product = storage.filter(
            (obj) => obj.id === parseInt(productId)
          );
          if (product[0].quantity > 1) {
            product[0].quantity--;
          }
          qty.textContent = product[0].quantity;

          updateTotal();
        });
      });

      const btnPlus = $modalItems.querySelectorAll("#btn-right");
      btnPlus.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId =
            btn.parentElement.parentElement.parentElement.dataset.id;
          const qty = $modalItems.querySelector(
            `[data-identifier="${productId}"]`
          );
          const product = storage.filter(
            (obj) => obj.id === parseInt(productId)
          );
          product[0].quantity++;
          qty.textContent = product[0].quantity;

          updateTotal();
        });
      });
    });
  });
}

// logica

$btnShoppingCart.addEventListener("click", showModal);
$btnClose.addEventListener("click", showModal);
$btnMenu.addEventListener("click", showMenu);
$sofas.addEventListener("click", () => {
  filterProducts("sofa");
  $headerMenu.classList.remove("header__menu--active");
});
$veladores.addEventListener("click", () => {
  filterProducts("velador");
  $headerMenu.classList.remove("header__menu--active");
});
filterProducts();
