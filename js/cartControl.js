import { sentData } from "./apiService.js";
import { API_URL } from "./config.js";
import { getFormData } from "./getFormData.js";

// Получаем необходимые элементы DOM
const modalOrder = document.querySelector('.modal__order');
const orderCount = modalOrder.querySelector('.order__count');
const orderList = modalOrder.querySelector('.order__list');
const orderTotalPrice = modalOrder.querySelector('.order__total-price');
const orderForm = modalOrder.querySelector('.order__form');

// Объявляем объект для управления данными корзины
export const cartDataControl = {
  // Метод для получения данных из локального хранилища
  get() {
    return JSON.parse(localStorage.getItem('freshyBarCart') || '[]');
  },
  // Метод для добавления товара в корзину
  add(item) {
    const cartData = this.get();
    // Генерируем уникальный ID для товара
    item.idls = Math.random().toString(36).substring(2, 8);
    cartData.push(item);
    localStorage.setItem("freshyBarCart", JSON.stringify(cartData));
    // Обновляем отображение количества товаров в корзине
    renderCountCart(cartData.length);
  },
  // Метод для удаления товара из корзины по ID
  remove(idls) {
    const cartData = this.get();
    const index = cartData.findIndex((item) => item.idls === idls);
    if (index !== -1) {
      cartData.splice(index, 1);
    }
    localStorage.setItem("freshyBarCart", JSON.stringify(cartData));
    // Обновляем отображение количества товаров в корзине
    renderCountCart(cartData.length);
  },
  // Метод для очистки корзины
  clear() {
    localStorage.removeItem("freshyBarCart");
    // Обновляем отображение количества товаров в корзине
    renderCountCart(0);
  },
};

// Функция для отображения количества товаров в корзине
const renderCountCart = (count) => {
  const headerBtnOrder = document.querySelector(".header__btn-order");
  // Если не передано количество товаров, используем длину из корзины
  headerBtnOrder.dataset.count = count || cartDataControl.get().length;
};
renderCountCart();

// Функция для создания элемента списка в корзине на основе товара и данных
const createCartItem = (item, data) => {
  const img = data.find((cocktail) => cocktail.title === item.title)?.image;
  const li = document.createElement('li');
  li.classList.add('order__item');
  li.innerHTML = `
    <img class="order__img" src="${img ? `${API_URL}${img}` : "img/make-your-own.jpg"}"
    alt="${item.title}">
    <div class="order__info">
      <h3 class="order__name">${item.title}</h3>
      <ul class="order__topping-list">
        <li class="order__topping-item">${item.size}</li>
        <li class="order__topping-item">${item.cup}</li>
        ${item.topping
          ? Array.isArray(item.topping)
            ? item.topping
              .map(
                (topping) =>
                  `<li class="order__topping-item">${topping}</li>`
              )
              .toString()
              .replace(",", "")
            : `<li class="order__topping-item">${item.topping}</li>`
          : ""
        }
      </ul>
    </div>
    <button class="order__item-delete" data-idls="${item.idls}"
    aria-label="Удалить коктейль из корзины"></button>
    <p class="order__item-price">${item.price}&nbsp;₽</p>
  `;
  return li;
};

// Функция для отрисовки списка товаров в корзине
const renderCartList = (data) => {
  const orderListData = cartDataControl.get();
  orderList.textContent = '';
  orderCount.textContent = `(${orderListData.length})`;
  // Добавляем каждый товар из корзины в список
  orderListData.forEach((item) => {
    orderList.append(createCartItem(item, data));
  });
  // Подсчитываем и отображаем общую стоимость товаров в корзине
  orderTotalPrice.textContent = `${orderListData.reduce(
    (acc, item) => acc + +item.price,
    0,
  )} ₽`;
};

// Обработчик события отправки формы
const handlerSubmit = async (e) => {
  const orderListData = cartDataControl.get();
  e.preventDefault();
  if (!orderListData.length) {
    console.log("Корзина пустая");
    orderForm.reset();
    modalOrder.closeModal("close");
    return;
  }
  // Получаем данные из формы
  const data = getFormData(orderForm);
  // Отправляем данные на сервер вместе с товарами в корзине
  const response = await sentData({
    ...data,
    products: orderListData,
  });
  const { message } = await response.json();
  alert(message);
  // Очищаем корзину и закрываем модальное окно с корзиной
  cartDataControl.clear();
  orderForm.reset();
  modalOrder.closeModal('close');
};

// Функция для отображения корзины
export const renderCart = (data) => {
  // Отображаем список товаров в корзине
  renderCartList(data);
  // Добавляем обработчик события отправки формы
  orderForm.addEventListener("submit", handlerSubmit);
  // Добавляем обработчик события удаления товара из корзины
  orderList.addEventListener("click", (e) => {
    if (e.target.classList.contains("order__item-delete")) {
      // Удаляем товар из корзины по его ID
      cartDataControl.remove(e.target.dataset.idls);
      // Перерисовываем список товаров в корзине
      renderCartList(data);
    }
  });
};