import { API_URL } from "./config.js";

// Функция createCard(item) создает и возвращает HTML-элемент карточки товара на основе переданных данных.
const createCard = (item) => {
  const cocktail = document.createElement("article");
  cocktail.classList.add("cocktail");

  cocktail.innerHTML = `
    <img 
      class="cocktail__img" 
      src="${API_URL}${item.image}"
      alt="Коктейл ${item.title}"
    >

    <div class="cocktail__content">
      <div class="cocktail__text">
        <h3 class="cocktail__title">${item.title}</h3>
        <p class="cocktail__price text-red">${item.price} ₽</p>
        <p class="cocktail__size">${item.size}</p>
      </div>

      <button class="btn cocktail__btn cocktail__btn_add" data-id="${item.id}">Добавить</button>
    </div>
  `;

  return cocktail;
};

// Функция renderCardList отображает список карточек товаров в указанном элементе.
export const renderCardList = (goodsListElem, data) => {
  // Создаем массив карточек товаров из данных.
  const cartsCocktail = data.map((item) => {
    // Создаем элемент списка для каждого товара.
    const li = document.createElement('li');
    li.classList.add('goods__item');
    // Создаем и добавляем карточку товара с помощью функции createCard(item).
    li.append(createCard(item));
    return li;
  });

  // Добавляем карточки в список.
  goodsListElem.append(...cartsCocktail);
};
