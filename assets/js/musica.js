const audio = document.getElementById("background-music");

// Al hacer clic en cualquier lado, activar sonido
document.body.addEventListener("click", function () {
  audio.muted = false;
}, { once: true });