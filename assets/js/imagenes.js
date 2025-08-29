// assets/js/imagenes.js
document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todos los contenedores .gallery-slider
  const gallerySliders = document.querySelectorAll('.gallery-slider');

  gallerySliders.forEach((slider) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Iniciar arrastre
    slider.addEventListener('mousedown', (e) => {
      // Solo activa el arrastre si haces clic directamente en el slider o dentro de él
      if (e.target === slider || e.target.closest('.gallery-slider') === slider) {
        isDragging = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX; // ✅ Quitamos - slider.offsetLeft
        scrollLeft = slider.scrollLeft;
        e.preventDefault(); // Previene selección de texto
      }
    });

    // Mover (drag)
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX; // ✅ Quitamos - slider.offsetLeft
      const walk = (x - startX) * 2; // Velocidad del desplazamiento
      slider.scrollLeft = scrollLeft - walk;
    });

    // Soltar (fin del arrastre)
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
      }
    });

    // Salir del área del slider
    slider.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
      }
    });

    // Aseguramos que el cursor inicial sea 'grab'
    slider.style.cursor = 'grab';
  });
});