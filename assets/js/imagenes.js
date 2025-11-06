// ─────────────── 🖱️ GESTIÓN DE DESPLAZAMIENTO ───────────────
// assets/js/imagenes.js — Scroll horizontal por arrastre en galerías

document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las galerías con clase .gallery-slider
  const gallerySliders = document.querySelectorAll('.gallery-slider');

  // Configura el comportamiento de arrastre para cada galería
  gallerySliders.forEach((slider) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Inicia el arrastre al hacer clic dentro del contenedor de la galería
    slider.addEventListener('mousedown', (e) => {
      // Verifica que el clic ocurra directamente en el slider o en sus hijos
      if (e.target === slider || e.target.closest('.gallery-slider') === slider) {
        isDragging = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX; // Posición inicial del puntero
        scrollLeft = slider.scrollLeft; // Punto de partida del scroll
        e.preventDefault(); // Evita selección de texto durante el arrastre
      }
    });

    // Maneja el movimiento del puntero para desplazar la galería
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.pageX;
      const walk = (x - startX) * 2; // Factor de velocidad (2x más sensible)
      slider.scrollLeft = scrollLeft - walk;
    });

    // Finaliza el arrastre al soltar el botón del mouse
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
      }
    });

    // Cancela el arrastre si el puntero sale del área de la galería
    slider.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
      }
    });

    // Establece el cursor inicial para indicar que es arrastrable
    slider.style.cursor = 'grab';
  });
});