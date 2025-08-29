/* FAST Heart Particles — Optimized for mobile/GPUs
   - Pre-rendered sprites (sharp + glow)
   - Capped DPR
   - Fewer particles by default
   - Added strong, automatic heartbeat pulse
*/
(() => {
  const cnv = document.getElementById('heart');
  const ctx = cnv.getContext('2d', { alpha: false });

  // === Performance knobs ===
  const DPR_CAP = 1.25;           // Limita escala en pantallas altas
  const COUNT = 850;               // Densidad de partículas
  const REPULSE_RADIUS = 120;      // Radio de repulsión del puntero
  const RETURN_SPRING = 0.06;      // Velocidad de regreso a posición
  const FRICTION = 0.86;           // Amortiguación del movimiento
  const REVEAL_SPEED = 0.014;      // Velocidad con la que aparece el corazón
  const THICKNESS = 0.03;          // Grosor del trazo del corazón

  // === Latido automático ===
  const PULSE_INTERVAL = 800;      // ms entre latidos (75 BPM)
  const PULSE_DURATION = 150;      // Duración del pico (sístole)
  let lastPulseTime = 0;

  const COLOR = '#8a2be2';         // Color principal
  const COLOR_SOFT = '#9326f8ff';  // Color del glow
  const BG = '#000';               // Fondo

  let DPR = Math.min(DPR_CAP, window.devicePixelRatio || 1);

  // Sprites pre-renderizados
  let dotSprite, glowSprite;

  // Fondo cacheado
  let bgFill = null;

  // Partículas y estado
  let particles = [];
  let pointer = { x: 0, y: 0, down: false, inside: false };
  let pulse = 0, revealT = 0;

  // === Crear sprite de partícula (con o sin glow) ===
  function makeDot(radius = 2, glow = false) {
    const s = Math.ceil((radius + (glow ? 16 : 0)) * 2);
    const off = document.createElement('canvas');
    off.width = off.height = s;
    const c = off.getContext('2d');

    c.translate(s / 2, s / 2);
    if (glow) {
      c.shadowColor = COLOR_SOFT;
      c.shadowBlur = 16;
    }
    c.fillStyle = COLOR;
    c.beginPath();
    c.arc(0, 0, radius, 0, Math.PI * 2);
    c.fill();

    return off;
  }

  // === Puntos del corazón (ecuación paramétrica) ===
  function heartPoint(t, scale, cx, cy) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: cx + (x * scale), y: cy - (y * scale) };
  }

  // === Re-construir canvas y partículas ===
  function rebuild() {
    const w = cnv.width / DPR;
    const h = cnv.height / DPR;

    // Fondo radial (cacheado)
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.1, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
    g.addColorStop(0, BG);
    g.addColorStop(1, BG);
    bgFill = g;

    // Sprites
    dotSprite = makeDot(1.8, false);
    glowSprite = makeDot(1.8, true);

    const scale = Math.min(w, h) * 0.02;
    const cx = w * 0.5;
    const cy = h * 0.55;

    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.003;
      const p = heartPoint(t, scale, cx, cy);
      const angle = t + Math.PI / 2;
      const r = (Math.random() * 2 - 1) * THICKNESS * Math.min(w, h);
      const tx = p.x + Math.cos(angle) * r;
      const ty = p.y + Math.sin(angle) * r;

      particles.push({
        x: cx + (Math.random() - 0.5) * 10,
        y: cy + (Math.random() - 0.5) * 10,
        vx: 0, vy: 0,
        tx, ty,
        order: i / COUNT,
        size: 1 + Math.random() * 1.2
      });
    }
    revealT = 0;
  }

  // === Resize responsive ===
  function resize() {
    DPR = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    const { innerWidth: w, innerHeight: h } = window;
    cnv.width = Math.floor(w * DPR);
    cnv.height = Math.floor(h * DPR);
    cnv.style.width = w + 'px';
    cnv.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    rebuild();
  }

  // === Manejo del puntero ===
  function onPointer(e) {
    pointer.down = e.type === 'pointerdown' ? true :
                   e.type === 'pointerup'   ? false : pointer.down;

    if (e.type === 'pointerenter') pointer.inside = true;
    if (e.type === 'pointerleave') { pointer.inside = false; pointer.down = false; }

    if (['pointermove', 'pointerdown', 'pointerup'].includes(e.type)) {
      const rect = cnv.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left);
      pointer.y = (e.clientY - rect.top);
    }

    if (e.type === 'click' || e.type === 'pointerdown') {
      pulse = 1; // activa pulso manual
    }
  }

  // === Bucle principal de animación ===
  function step() {
    const now = performance.now();
    const w = cnv.width / DPR;
    const h = cnv.height / DPR;
    const cx = w * 0.5;
    const cy = h * 0.55;

    // === Latido automático ===
    if (now - lastPulseTime > PULSE_INTERVAL) {
      pulse = 1;
      lastPulseTime = now;
    }

    // Control del pulso: pico rápido, caída lenta
    if (pulse > 0) {
      const elapsed = now - lastPulseTime;
      if (elapsed < PULSE_DURATION) {
        pulse = 1;
      } else {
        pulse = Math.max(0, pulse - 0.045 * ((elapsed - PULSE_DURATION) / 16));
      }
    }

    // Fondo
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, w, h);

    // Revelado inicial
    if (revealT < 1) {
      revealT = Math.min(1, revealT + REVEAL_SPEED);
    }

    // === Fuerzas sobre partículas ===
    const pulseFactor = 1 + pulse * 1.2;
    const spring = RETURN_SPRING * (1 + pulse * 0.6);
    const repulseBoost = pulse * 0.8; // repulsión desde el centro del corazón

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Regreso al camino del corazón
      if (p.order <= revealT) {
        p.vx += (p.tx - p.x) * spring;
        p.vy += (p.ty - p.y) * spring;
      }

      // Repulsión desde el centro del corazón (efecto de expansión en latido)
      const dxCenter = p.x - cx;
      const dyCenter = p.y - cy;
      const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
      if (distCenter < 200) {
        const force = (120 * repulseBoost) / (distCenter + 10);
        p.vx += (dxCenter / distCenter) * force;
        p.vy += (dyCenter / distCenter) * force;
      }

      // Repulsión del puntero
      if (pointer.inside) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        const R2 = REPULSE_RADIUS * REPULSE_RADIUS;
        if (d2 < R2) {
          const dist = Math.max(12, Math.sqrt(d2));
          const force = (1100 / (dist * dist)) * (1 + pulse * 0.5);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Fricción y actualización
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;
    }

    // === Renderizado con efecto de pulso ===
    const k = 1 + pulse * 1.4; // Escala de partículas
    const glowAlpha = 0.7 + pulse * 0.3; // Brillo del glow

    // Glow (con alpha ajustado)
    ctx.globalAlpha = glowAlpha;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const gw = glowSprite.width;
      const gh = glowSprite.height;
      ctx.drawImage(glowSprite, p.x - gw / 2, p.y - gh / 2);
    }
    ctx.globalAlpha = 1;

    // Punto nítido
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const s = p.size * k;
      const dw = dotSprite.width * (s / 1.8);
      const dh = dotSprite.height * (s / 1.8);
      ctx.drawImage(dotSprite, p.x - dw / 2, p.y - dh / 2, dw, dh);
    }

    requestAnimationFrame(step);
  }

  // === Eventos ===
  window.addEventListener('resize', resize);
  cnv.addEventListener('pointerenter', onPointer);
  cnv.addEventListener('pointerleave', onPointer);
  cnv.addEventListener('pointermove', onPointer);
  cnv.addEventListener('pointerdown', onPointer);
  cnv.addEventListener('pointerup', onPointer);
  cnv.addEventListener('click', onPointer);
  cnv.addEventListener('touchstart', e => { e.preventDefault(); }, { passive: false });

  // === Inicialización ===
  resize();
  requestAnimationFrame(step);
})();