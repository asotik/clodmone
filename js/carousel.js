document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.menu-items');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const menuItems = document.querySelectorAll('.menu-item');
  
  let currentIndex = 0;
  let isAnimating = false;
  const visibleItems = 3; // Сколько элементов видно одновременно
  const totalItems = menuItems.length;

  // Рассчитываем ширину одного элемента с отступом
  function getItemWidth() {
    const item = menuItems[0];
    const itemWidth = item.offsetWidth;
    const gap = 40; // как в CSS gap: 40px
    return itemWidth + gap;
  }

  // Инициализация карусели
  function initializeCarousel() {
    // Клонируем все элементы и добавляем их в конец для бесконечности
    const clones = [];
    menuItems.forEach(item => {
      const clone = item.cloneNode(true);
      clones.push(clone);
    });
    
    // Добавляем клоны в конец
    clones.forEach(clone => {
      carousel.appendChild(clone);
    });
  }

  function updateCarousel(animate = true) {
    if (animate) {
      carousel.style.transition = 'transform 0.5s ease-in-out';
    } else {
      carousel.style.transition = 'none';
    }
    
    const itemWidth = getItemWidth();
    const transformValue = -currentIndex * itemWidth;
    carousel.style.transform = `translateX(${transformValue}px)`;
  }

  function nextSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex++;
    
    // Если дошли до конца клонов, переходим к началу
    if (currentIndex >= totalItems) {
      setTimeout(() => {
        carousel.style.transition = 'none';
        currentIndex = 0;
        updateCarousel(false);
        setTimeout(() => {
          isAnimating = false;
        }, 50);
      }, 500);
    }
    
    updateCarousel();
    setTimeout(() => {
      if (currentIndex < totalItems) isAnimating = false;
    }, 500);
  }

  function prevSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex--;
    
    // Если дошли до начала, переходим к концу реальных элементов
    if (currentIndex < 0) {
      currentIndex = totalItems - 1;
      updateCarousel(false);
      setTimeout(() => {
        carousel.style.transition = 'transform 0.5s ease-in-out';
        currentIndex = totalItems - 1;
        updateCarousel();
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }, 50);
    } else {
      updateCarousel();
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
  }

  // Инициализация
  initializeCarousel();
  
  // Обработчики событий
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Автопрокрутка (опционально)
  let autoScroll = setInterval(nextSlide, 3000);
  
  // Останавливаем автопрокрутку при наведении
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoScroll);
  });
  
  carousel.addEventListener('mouseleave', () => {
    autoScroll = setInterval(nextSlide, 3000);
  });

  // Адаптация к изменению размера окна
  window.addEventListener('resize', () => {
    updateCarousel(false);
  });
});



