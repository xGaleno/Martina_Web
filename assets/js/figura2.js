function drawFigure2() {
  const canvas = document.getElementById('heart');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let rotation = 0;
  const rotationSpeed = 0.02;

  function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    // Degradado dorado/rosado
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius);
    gradient.addColorStop(0, '#ffeb3b');
    gradient.addColorStop(0.5, '#ff9800');
    gradient.addColorStop(1, '#ff1493');

    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ffeb3b';
    ctx.shadowBlur = 20;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rotation += rotationSpeed;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.3;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    drawStar(0, 0, 5, size, size * 0.4);
    ctx.restore();

    requestAnimationFrame(animate);
  }

  animate();
}