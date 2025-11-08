// ─────────────── 🎁 ESCENA DE REGALO CON VIDEOS ───────────────
// assets/js/regalos_flores.js — Alterna entre corazón animado y escena de flores + niña

document.addEventListener('DOMContentLoaded', () => {

  // REFERENCIAS Y VALIDACIÓN INICIAL

  const heartModule = window.HeartAnimation;
  if (!heartModule) return; // Salir si el módulo de corazón no está disponible

  const { cnv, heroSection } = heartModule.getElements();
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrow = document.querySelector('.nav-arrow.right');

  let currentView = 'heart'; // Estado actual: 'heart' o 'gift'

  // FUNCIONES DE CONTROL DE VISTAS

  // Muestra la escena de regalo con videos de fondo y central
  function showGift() {
    heartModule.stop();
    currentView = 'gift';

    // Eliminar contenedor anterior si existe
    const oldGift = document.getElementById('gift-video-container');
    if (oldGift) oldGift.remove();

    // Crear contenedor principal con animación de aparecimiento
    const videoContainer = document.createElement('div');
    videoContainer.id = 'gift-video-container';
    videoContainer.classList.add('fade-in-up'); // ← Animación suave desde regalos_menu.css

    // Video de fondo: flores
    const floresVideo = document.createElement('video');
    floresVideo.id = 'flores-video';
    floresVideo.src = '../assets/video/flores.mp4'; // ✅ Carga directa y confiable
    floresVideo.autoplay = true;
    floresVideo.loop = true;
    floresVideo.muted = true;
    floresVideo.playsInline = true;
    floresVideo.preload = 'auto';
    floresVideo.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    `;
    videoContainer.appendChild(floresVideo);

    // Video central: niña (con estilo neón)
    const ninaVideo = document.createElement('video');
    ninaVideo.id = 'nina-video';
    ninaVideo.src = '../assets/video/nina.mp4'; // ✅ Carga directa y confiable
    ninaVideo.autoplay = true;
    ninaVideo.loop = true;
    ninaVideo.muted = true;
    ninaVideo.playsInline = true;
    ninaVideo.preload = 'metadata';
    ninaVideo.style.cssText = `
      width: 50%;
      height: auto;
      border-radius: 50%;
      border: 2px solid #8a2be2;
      box-shadow: 
        0 0 8px rgba(138, 43, 226, 0.6),
        0 0 15px rgba(138, 43, 226, 0.4);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    `;
    videoContainer.appendChild(ninaVideo);

    // Añadir al DOM
    heroSection.appendChild(videoContainer);

    // Reproducir explícitamente para evitar pantallas negras
    requestAnimationFrame(() => {
      floresVideo.play().catch(e => console.warn('Flores video autoplay falló:', e));
      ninaVideo.play().catch(e => console.warn('Niña video autoplay falló:', e));
    });
  }

  // Regresa a la vista del corazón animado
  function showHeart() {
    const giftVideoContainer = document.getElementById('gift-video-container');
    if (giftVideoContainer) {
      giftVideoContainer.remove();
    }
    currentView = 'heart';
    heartModule.restart();
  }

  // INICIALIZACIÓN Y EVENTOS

  // Asignar eventos a las flechas de navegación (con verificación de existencia)
  rightArrow?.addEventListener('click', showGift);
  leftArrow?.addEventListener('click', showHeart);

  // Iniciar la animación del corazón al cargar la página
  heartModule.init();
});