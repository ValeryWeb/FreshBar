export const scrollService = {
  scrollPosition: 0,
  
  // Блокирует скролл страницы и сохраняет текущую позицию
  disabledScroll() {
    this.scrollPosition = window.scrollY;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Добавляем стили для блокировки скролла и предотвращения смещения страницы
    document.body.style.cssText = `   
      overflow: hidden;
      position: fixed;
      top: -${this.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;
  },
  
  // Восстанавливает скролл и позицию после закрытия модального окна
  enabledScroll() {
    document.body.style.cssText = ''; 
    window.scroll({ top: this.scrollPosition });
    document.documentElement.style.scrollBehavior = '';
  },
};
