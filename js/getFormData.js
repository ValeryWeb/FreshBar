// Извлекаем данные из HTML-формы в модальном окне.
export const getFormData = (form) => {

  // Создаём объект FormData для работы с данными формы.
  const formData = new FormData(form);

  // Проходим по всем элементам в formData. Каждый элемент представляет пару ключ-значение.
  for (const [name, value] of formData.entries()) {

    // Если свойство data[name] существует, добавляем текущее значение к массиву с этим именем.
    // Если не существует, создаём его и присваиваем текущее значение.
    data[name] ? data[name].push(value) : data[name] = value;
  }

  // Возвращаем объект с извлечёнными данными.
  return data;
};