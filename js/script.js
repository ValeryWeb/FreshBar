import { getData } from "./apiService.js";
import { renderCart } from "./cartControl.js";
import { calculateAdd, calculateMakeYourOwn } from "./formControl.js";
import { renderCardList } from "./goodsService.js";
import { modalController } from "./modalController.js";

const init = async () => {
  // Загружаем данные с сервера
  const data = await getData();
  // Отрисовываем список товаров на странице
  renderCardList(document.querySelector(".goods__list"), data);

  // Контроллер модального окна для оформления заказа
  modalController({
    modal: ".modal__order",
    btnOpen: ".header__btn-order",
    open() {
      // Перед открытием модального окна корзины, обновляем ее содержимое
      renderCart(data);
    },
  });

  // Рассчетный контроллер для создания собственного коктейля
  const { resetForm: resetFormMakeYourOwn } = calculateMakeYourOwn();

  // Контроллер модального окна для создания собственного коктейля
  modalController({
    modal: ".modal__make-your-own",
    btnOpen: ".cocktail__btn_make",
    close: resetFormMakeYourOwn,
  });

  // Рассчетный контроллер для добавления товара в корзину
  const { fillInForm: fillInFormAdd, resetForm: resetFormAdd } = calculateAdd();

  // Контроллер модального окна для добавления товара в корзину
  modalController({
    modal: ".modal_add",
    btnOpen: ".cocktail__btn_add",
    open({ btn }) {
      // Перед открытием модального окна добавления товара,
      // определяем товар, который будет добавлен в корзину
      const id = btn.dataset.id;
      const item = data.find((item) => item.id.toString() === id);
      // Заполняем форму данными о товаре
      fillInFormAdd(item);
    },
    close: resetFormAdd,
  });
};

// Инициализируем приложение
init();
