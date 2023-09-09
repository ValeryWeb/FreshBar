
// Извлекаем данные из HTML-формы в модальном окне "Собери сам".
export const getFormData = (form) => {
  // Создаём объект FormData для работы с данными формы.
  const formData = new FormData(form);
  const data = {};

  // Создаём объект FormData для работы с данными формы.
  // Проходим по всем элементам в formData. Каждый элемент это пара ключ-значение
  for (const [name, value] of formData.entries()) { 
    //Проверяем существует ли name в объекте data
    if (data[name]) { 
      //Проверяем массив это 
      if (!Array.isArray(data[name])) { 
        //Если не массив, то делает его массивом
        data[name] = [data[name]]; 
      }
      data[name].push(value); 
    } else {
      //Если name не существует, то создаем свойство с именем name в объекте data
      data[name] = value;
    }
  }
  return data;
};
