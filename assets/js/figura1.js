function drawFigure1() {
  const canvas = document.getElementById('heart');
  const ctx = canvas.getContext('2d');

  // Ajustar tamaño del canvas al contenedor
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Variables del latido
  let time = 0;
  const pulseSpeed = 0.02;

  function drawHeart(x, y, size, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size, size);

    ctx.beginPath();
    ctx.moveTo(0, -0.2);
    ctx.bezierCurveTo(0.5, -0.5, 0.7, 0, 0, 0.7);
    ctx.bezierCurveTo(-0.7, 0, -0.5, -0.5, 0, -0.2);
    ctx.closePath();

    const pulseFactor = 1 + 0.1 * Math.sin(time);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(1, '#ff1493');

    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 15 * pulseFactor;
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += pulseSpeed;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseSize = Math.min(canvas.width, canvas.height) * 0.25;
    const pulseSize = baseSize * (1 + 0.1 * Math.sin(time));

    drawHeart(centerX, centerY, pulseSize, 0);

    requestAnimationFrame(animate);
  }

  animate();
}