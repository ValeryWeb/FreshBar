import { cartDataControl } from "./cartControl.js";
import { price } from "./config.js";
import { getFormData } from "./getFormData.js";

// Функция для обработки отправки формы и добавления данных в корзину
export const formSubmit = (form, cb) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = getFormData(form);
    cartDataControl.add(data);

    if (cb) {
      cb();
    }
  });
};

// Функция для вычисления общей стоимости на основе данных из формы
export const calculateTotalPrice = (form, startPrice) => {
  let totalPrice = startPrice;

  const data = getFormData(form);

  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach((item) => {
      totalPrice += price[item] || 0;
    });
  } else {
    totalPrice += price[data.ingredients] || 0;
  }

  if (Array.isArray(data.topping)) {
    data.topping.forEach((item) => {
      totalPrice += price[item] || 0;
    });
  } else {
    totalPrice += price[data.topping] || 0;
  }

  totalPrice += price[data.cup] || 0;

  return totalPrice;
};

// Функция для расчета параметров и взаимодействия с модальным окном "Собери сам"
export const calculateMakeYourOwn = () => {
  const modalMakeOwn = document.querySelector('.modal__make-your-own');
  const formMakeOwn = modalMakeOwn.querySelector('.make__form_make-your-own');
  const makeInputTitle = modalMakeOwn.querySelector('.make__input-title');
  const makeInputPrice = modalMakeOwn.querySelector('.make__input_price');
  const makeTotalPrice = modalMakeOwn.querySelector('.make__total_price');
  const makeAddBtn = modalMakeOwn.querySelector('.make__add-btn');

  // Обработчик изменений в форме "Собери сам"
  const handlerChange = () => {
    const totalPrice = calculateTotalPrice(formMakeOwn, 150);
    const data = getFormData(formMakeOwn);
    if (data.ingredients) {
      const ingredients = Array.isArray(data.ingredients)
        ? data.ingredients.join(", ")
        : data.ingredients;

      makeInputTitle.value = `Конструктор: ${ingredients}`;
      makeAddBtn.disabled = false;
    } else {
      makeAddBtn.disabled = true;
    }

    makeInputPrice.value = totalPrice;
    makeTotalPrice.textContent = `${totalPrice} ₽`;
  };

  formMakeOwn.addEventListener("change", handlerChange);
  formSubmit(formMakeOwn, () => {
    modalMakeOwn.closeModal('close');
  });
  handlerChange();

  // Функция для сброса данных формы "Собери сам"
  const resetForm = () => {
    makeTotalPrice.textContent = '';
    makeAddBtn.disabled = true;
    formMakeOwn.reset();
  }
  return { resetForm };
};

// Функция для расчета параметров и взаимодействия с модальным окном "Добавь коктейль"
export const calculateAdd = () => {
  const modalAdd = document.querySelector('.modal_add');
  const formAdd = document.querySelector('.make__form_add');
  const makeTitle = modalAdd.querySelector('.make__title');
  const makeInputTitle = modalAdd.querySelector('.make__input-title');
  const makeTotalPrice = modalAdd.querySelector('.make__total_price');
  const makeInputStartPrice = modalAdd.querySelector('.make__input-start-price');
  const makeInputPrice = modalAdd.querySelector('.make__input_price');
  const makeTotalSize = modalAdd.querySelector('.make__total_size');
  const makeInputSize = modalAdd.querySelector('.make__input_size');

  // Обработчик изменений в форме "Добавь коктейль"
  const handlerChange = () => {
    const totalPrice = calculateTotalPrice(formAdd, +makeInputStartPrice.value);
    makeInputPrice.value = totalPrice;
    makeTotalPrice.textContent = `${totalPrice} ₽`;
  };

  formAdd.addEventListener('change', handlerChange);
  formSubmit(formAdd, () => {
    modalAdd.closeModal('close');
  });

  // Функция для заполнения данных формы "Добавь коктейль"
  const fillInForm = (data) => {
    makeTitle.textContent = data.title;
    makeInputTitle.value = data.title;
    makeTotalPrice.textContent = `${data.price} ₽`;
    makeInputStartPrice.value = data.price;
    makeInputPrice.value = data.price;
    makeTotalSize.textContent = data.size;
    makeInputSize.value = data.size;
    handlerChange();
  };

  // Функция для сброса данных формы "Добавь коктейль"
  const resetForm = () => {
    makeTitle.textContent = '';
    makeTotalPrice.textContent = '';
    makeTotalSize.textContent = '';
    formAdd.reset();
  };
  return { fillInForm, resetForm };
};