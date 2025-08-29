// assets/js/imagenes.js
document.addEventListener('DOMContentLoaded', () => {
  // Selecciona TODOS los sliders y contenidos
  const gallerySliders = document.querySelectorAll('.gallery-slider');
  const galleryContents = document.querySelectorAll('.gallery-content');

  gallerySliders.forEach((slider) => {
    let isDragging = false;
    let startX, scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      if (e.target === slider || e.target.closest('.gallery-slider')) {
        isDragging = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseleave', () => {
      isDragging = false;
      slider.style.cursor = 'grab';
    });
  });
});