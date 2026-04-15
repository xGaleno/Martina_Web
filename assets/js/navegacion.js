// ─────────────── 🧭 NAVEGACIÓN ───────────────
// assets/js/navegacion.js — Maneja navegación sin inline JS (mejora CSP)

document.addEventListener('DOMContentLoaded', () => {
  const btnRegalos = document.getElementById('btn-regalos');
  if (btnRegalos) {
    btnRegalos.addEventListener('click', () => {
      window.location.href = 'pages/regalos.html';
    });
  }
});
