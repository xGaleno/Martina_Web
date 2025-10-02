/**
 * ======================================================================
 * ANIMACIÓN DE CORAZÓN PARTICULADO INTERACTIVO
 * Archivo: regalos_corazon.js
 * Propósito: Renderizar un corazón hecho de partículas con interacción
 *            por puntero y pulsos automáticos/interactivos.
 * ======================================================================
 */

window.HeartAnimation = (() => {
  // ────────────────────────────────────────────────────────────────────
  // REFERENCIAS Y VALIDACIÓN INICIAL
  // ────────────────────────────────────────────────────────────────────

  const cnv = document.getElementById('heart');
  if (!cnv) return null; // Salir silenciosamente si no hay canvas

  const ctx = cnv.getContext('2d', { alpha: false });
  const heroSection = document.querySelector('.hero');

  // ────────────────────────────────────────────────────────────────────
  // CONSTANTES DE CONFIGURACIÓN
  // ────────────────────────────────────────────────────────────────────

  const DPR_CAP = 1.25;               // Límite de pixel ratio para rendimiento
  const COUNT = 850;                  // Número de partículas
  const REPULSE_RADIUS = 120;         // Radio de repulsión al pasar el puntero
  const RETURN_SPRING = 0.06;         // Fuerza de retorno al corazón
  const FRICTION = 0.86;              // Fricción para suavizar movimiento
  const REVEAL_SPEED = 0.014;         // Velocidad de formación inicial
  const THICKNESS = 0.03;             // Grosor del trazo del corazón
  const PULSE_INTERVAL = 800;         // Intervalo entre pulsos automáticos (ms)
  const PULSE_DURATION = 150;         // Duración del efecto de pulso (ms)

  const COLOR = '#8a2be2';            // Color principal (morado neón)
  const COLOR_SOFT = '#9326f8ff';     // Color con brillo para sombra
  const BG = '#000';                  // Fondo del canvas

  // ────────────────────────────────────────────────────────────────────
  // ESTADO INTERNO
  // ────────────────────────────────────────────────────────────────────

  let DPR = Math.min(DPR_CAP, window.devicePixelRatio || 1);
  let dotSprite, glowSprite;
  let bgFill = null;
  let particles = [];
  let pointer = { x: 0, y: 0, down: false, inside: false };
  let pulse = 0;
  let revealT = 0;
  let lastPulseTime = 0;
  let animationId = null;

  // ────────────────────────────────────────────────────────────────────
  // FUNCIONES AUXILIARES
  // ────────────────────────────────────────────────────────────────────

  /**
   * Crea un sprite circular con o sin efecto de brillo
   * @param {number} radius - Radio del punto
   * @param {boolean} glow - Si incluye sombra brillante
   * @returns {HTMLCanvasElement} - Sprite listo para dibujar
   */
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

  /**
   * Calcula un punto en la curva paramétrica de un corazón
   * @param {number} t - Parámetro de la curva (0 a 2π)
   * @param {number} scale - Escala del corazón
   * @param {number} cx - Centro X
   * @param {number} cy - Centro Y
   * @returns {{x: number, y: number}} - Coordenadas del punto
   */
  function heartPoint(t, scale, cx, cy) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t);
    return { x: cx + x * scale, y: cy - y * scale };
  }

  /**
   * Reconstruye la forma del corazón y reinicia las partículas
   */
  function rebuildHeart() {
    const w = cnv.width / DPR;
    const h = cnv.height / DPR;

    // Degradado de fondo
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.1, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
    g.addColorStop(0, BG);
    g.addColorStop(1, BG);
    bgFill = g;

    // Sprites para renderizado eficiente
    dotSprite = makeDot(1.8, false);
    glowSprite = makeDot(1.8, true);

    // Parámetros del corazón
    const scale = Math.min(w, h) * 0.02;
    const cx = w * 0.5;
    const cy = h * 0.55;

    // Generar partículas distribuidas en la forma del corazón
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
        vx: 0,
        vy: 0,
        tx,
        ty,
        order: i / COUNT,
        size: 1 + Math.random() * 1.2
      });
    }

    revealT = 0; // Reiniciar animación de revelado
  }

  /**
   * Ajusta el canvas al tamaño del contenedor y actualiza DPR
   */
  function resize() {
    DPR = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    const rect = cnv.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    cnv.width = Math.floor(w * DPR);
    cnv.height = Math.floor(h * DPR);
    cnv.style.width = `${w}px`;
    cnv.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    rebuildHeart();
  }

  /**
   * Maneja eventos de puntero (mouse/touch)
   * @param {PointerEvent} e - Evento de puntero
   */
  function onPointer(e) {
    pointer.down = e.type === 'pointerdown' ? true :
                   e.type === 'pointerup' ? false : pointer.down;

    if (e.type === 'pointerenter') pointer.inside = true;
    if (e.type === 'pointerleave') {
      pointer.inside = false;
      pointer.down = false;
    }

    if (['pointermove', 'pointerdown', 'pointerup'].includes(e.type)) {
      const rect = cnv.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    // Activar pulso al hacer clic o tocar
    if (e.type === 'click' || e.type === 'pointerdown') {
      pulse = 1;
    }
  }

  /**
   * Bucle principal de animación
   */
  function step() {
    const now = performance.now();
    const w = cnv.width / DPR;
    const h = cnv.height / DPR;
    const cx = w * 0.5;
    const cy = h * 0.55;

    // Pulso automático periódico
    if (now - lastPulseTime > PULSE_INTERVAL) {
      pulse = 1;
      lastPulseTime = now;
    }

    // Decaimiento suave del efecto de pulso
    if (pulse > 0) {
      const elapsed = now - lastPulseTime;
      if (elapsed < PULSE_DURATION) {
        pulse = 1;
      } else {
        pulse = Math.max(0, pulse - 0.045 * ((elapsed - PULSE_DURATION) / 16));
      }
    }

    // Limpiar y dibujar fondo
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, w, h);

    // Revelar corazón progresivamente al inicio
    if (revealT < 1) {
      revealT = Math.min(1, revealT + REVEAL_SPEED);
    }

    // Parámetros dinámicos durante el pulso
    const spring = RETURN_SPRING * (1 + pulse * 0.6);
    const repulseBoost = pulse * 0.8;

    // Actualizar física de partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Retorno al corazón (solo si ya fue revelado)
      if (p.order <= revealT) {
        p.vx += (p.tx - p.x) * spring;
        p.vy += (p.ty - p.y) * spring;
      }

      // Repulsión desde el centro durante el pulso
      const dxCenter = p.x - cx;
      const dyCenter = p.y - cy;
      const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
      if (distCenter < 200) {
        const force = (120 * repulseBoost) / (distCenter + 10);
        p.vx += (dxCenter / distCenter) * force;
        p.vy += (dyCenter / distCenter) * force;
      }

      // Repulsión por puntero cercano
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

      // Aplicar fricción y actualizar posición
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;
    }

    // Renderizado: primero el brillo, luego los puntos
    const k = 1 + pulse * 1.4;
    const glowAlpha = 0.7 + pulse * 0.3;

    ctx.globalAlpha = glowAlpha;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const gw = glowSprite.width;
      const gh = glowSprite.height;
      ctx.drawImage(glowSprite, p.x - gw / 2, p.y - gh / 2);
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const s = p.size * k;
      const dw = dotSprite.width * (s / 1.8);
      const dh = dotSprite.height * (s / 1.8);
      ctx.drawImage(dotSprite, p.x - dw / 2, p.y - dh / 2, dw, dh);
    }

    animationId = requestAnimationFrame(step);
  }

  // ────────────────────────────────────────────────────────────────────
  // API PÚBLICA
  // ────────────────────────────────────────────────────────────────────

  return {
    /**
     * Inicializa la animación y sus eventos
     */
    init() {
      resize();
      step();
      window.addEventListener('resize', resize);
      cnv.addEventListener('pointerenter', onPointer);
      cnv.addEventListener('pointerleave', onPointer);
      cnv.addEventListener('pointermove', onPointer);
      cnv.addEventListener('pointerdown', onPointer);
      cnv.addEventListener('pointerup', onPointer);
      cnv.addEventListener('click', onPointer);
      cnv.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    },

    /**
     * Detiene la animación y oculta el canvas
     */
    stop() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      cnv.style.display = 'none';
    },

    /**
     * Reinicia y muestra nuevamente la animación
     */
    restart() {
      cnv.style.display = 'block';
      rebuildHeart();
      step();
    },

    /**
     * Devuelve referencias a elementos del DOM
     * @returns {{ cnv: HTMLCanvasElement, heroSection: HTMLElement }}
     */
    getElements() {
      return { cnv, heroSection };
    }
  };
})();