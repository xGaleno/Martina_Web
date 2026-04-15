// ─────────────── 🧭 NAVEGACIÓN ───────────────
// assets/js/navegacion.js — Maneja navegación sin inline JavaScript (mejora CSP)

document.addEventListener('DOMContentLoaded', () => {
  const btnRegalos = document.getElementById('btn-regalos');
  if (btnRegalos) {
    btnRegalos.addEventListener('click', () => {
      window.location.href = 'pages/regalos.html';
    });
  }
});
