/**
 * ======================================================================
 * GESTIÓN DE MÚSICA DE FONDO
 * Archivo: musica.js
 * Propósito: Activar la reproducción de audio al primer clic del usuario
 * (requerido por políticas de navegadores modernos)
 * ======================================================================
 */

// ──────────────────────────────────────────────────────────────────────
// REFERENCIAS Y CONFIGURACIÓN INICIAL
// ──────────────────────────────────────────────────────────────────────

const audio = document.getElementById('background-music');

// ──────────────────────────────────────────────────────────────────────
// ACTIVACIÓN DE AUDIO
// ──────────────────────────────────────────────────────────────────────

/**
 * Habilita el audio al primer clic en cualquier parte de la página.
 * Esto cumple con las políticas de reproducción automática de los navegadores,
 * que requieren interacción explícita del usuario para reproducir sonido.
 */
document.body.addEventListener(
  'click',
  () => {
    audio.muted = false;
  },
  { once: true } // Ejecuta el listener solo una vez
);