import { scrollService } from "./scrollService.js";

// Функция для управления модальными окнами
export const modalController = ({
  modal,
  btnOpen,
  time = 300,
  open,
  close,
}) => {
  // Получаем все кнопки для открытия модальных окон
  const buttonElems = document.querySelectorAll(btnOpen);
  // Получаем элемент модального окна
  const modalElem = document.querySelector(modal);
  // Настройки стиля модального окна при инициализации
  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out;
  `;

  // Функция для закрытия модального окна
  const closeModal = (event) => {
    const target = event.target;
    const code = event.code;

    // Проверяем, можно ли закрыть модальное окно
    if (event === "close" || target === modalElem || code === "Escape") {
      // Устанавливаем нулевую прозрачность для плавного закрытия
      modalElem.style.opacity = 0;

      setTimeout(() => {
        // Скрываем модальное окно и включаем скролл на странице
        modalElem.style.visibility = "hidden";
        scrollService.enabledScroll();

        // Если есть функция для закрытия, вызываем ее
        if (close) {
          close();
        }
      }, time);

      // Удаляем обработчик события нажатия клавиши Esc
      window.removeEventListener("keydown", closeModal);
    }
  };

  // Функция для открытия модального окна
  const openModal = (e) => {
    // Если есть функция для открытия, вызываем ее и передаем кнопку, которая открыла окно
    if (open) {
      open({ btn: e.target });
    }
    // Устанавливаем видимость и полную прозрачность для плавного открытия
    modalElem.style.visibility = "visible";
    modalElem.style.opacity = 1;
    // Добавляем обработчик события нажатия клавиши Esc для закрытия
    window.addEventListener("keydown", closeModal);
    // Отключаем скролл на странице
    scrollService.disabledScroll();
  };

  // Добавляем обработчики событий для кнопок открытия модальных окон
  buttonElems.forEach((buttonElem) => {
    buttonElem.addEventListener("click", openModal);
  });

  // Добавляем обработчик события для закрытия модального окна при клике на него
  modalElem.addEventListener("click", closeModal);

  // Добавляем методы closeModal и openModal к элементу модального окна
  modalElem.closeModal = closeModal;
  modalElem.openModal = openModal;

  // Возвращаем объект с методами для управления модальными окнами
  return { openModal, closeModal };
};
