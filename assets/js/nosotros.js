// ─────────────── 🖱️ GESTIÓN DE DESPLAZAMIENTO ───────────────
// assets/js/nosotros.js — Scroll horizontal por arrastre en galerías de la página "Nosotros"

document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las galerías y sus contenedores internos
  const gallerySliders = document.querySelectorAll('.gallery-slider');

  // Configura el comportamiento de arrastre para cada galería
  gallerySliders.forEach((slider) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Inicia el arrastre al hacer clic dentro del área del slider
    slider.addEventListener('mousedown', (e) => {
      // Verifica que el clic ocurra en el slider o en sus descendientes directos
      if (e.target === slider || e.target.closest('.gallery-slider') === slider) {
        isDragging = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft; // Posición relativa al contenedor
        scrollLeft = slider.scrollLeft;       // Punto de partida del scroll
        e.preventDefault();                   // Evita selección de texto
      }
    });

    // Mueve la galería mientras se arrastra
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Factor de sensibilidad (2x)
      slider.scrollLeft = scrollLeft - walk;
    });

    // Finaliza el arrastre al soltar el botón del mouse
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        slider.style.cursor = 'grab';
      }
    });

    // Cancela el arrastre si el puntero sale del área del slider
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