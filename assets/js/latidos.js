/* FAST Heart Particles — Optimized for mobile/GPUs
   - Pre-rendered sprites (sharp + glow)
   - Capped DPR
   - Fewer particles by default
   - Added strong, automatic heartbeat pulse
*/
(() => {
    // === Variables globales y referencias ===
    const cnv = document.getElementById('heart');
    const ctx = cnv.getContext('2d', { alpha: false });
    const heroSection = document.querySelector('.hero');
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    
    // Estado de la página: 'heart' o 'gift'
    let currentView = 'heart';

    // === Rendimiento y Constantes ===
    const DPR_CAP = 1.25;
    const COUNT = 850;
    const REPULSE_RADIUS = 120;
    const RETURN_SPRING = 0.06;
    const FRICTION = 0.86;
    const REVEAL_SPEED = 0.014;
    const THICKNESS = 0.03;
    const PULSE_INTERVAL = 800;
    const PULSE_DURATION = 150;

    const COLOR = '#8a2be2';
    const COLOR_SOFT = '#9326f8ff';
    const BG = '#000';

    let DPR = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    let dotSprite, glowSprite;
    let bgFill = null;

    let particles = [];
    let pointer = { x: 0, y: 0, down: false, inside: false };
    let pulse = 0, revealT = 0;
    let lastPulseTime = 0;

    let animationId = null;
    let isRunning = false;

    // === Funciones auxiliares ===

    // Crear sprite de partícula (con o sin glow)
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

    // Puntos del corazón (ecuación paramétrica)
    function heartPoint(t, scale, cx, cy) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return { x: cx + (x * scale), y: cy - (y * scale) };
    }

    // Re-construir canvas y partículas
    function rebuildHeart() {
        const w = cnv.width / DPR;
        const h = cnv.height / DPR;

        const g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.1, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
        g.addColorStop(0, BG);
        g.addColorStop(1, BG);
        bgFill = g;

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

    // Resize responsive
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

        if (currentView === 'heart') {
            rebuildHeart();
        }
    }

    // Manejo del puntero
    function onPointer(e) {
        pointer.down = e.type === 'pointerdown' ? true :
            e.type === 'pointerup' ? false : pointer.down;

        if (e.type === 'pointerenter') pointer.inside = true;
        if (e.type === 'pointerleave') { pointer.inside = false; pointer.down = false; }

        if (['pointermove', 'pointerdown', 'pointerup'].includes(e.type)) {
            const rect = cnv.getBoundingClientRect();
            pointer.x = (e.clientX - rect.left);
            pointer.y = (e.clientY - rect.top);
        }

        if (e.type === 'click' || e.type === 'pointerdown') {
            pulse = 1;
        }
    }

    // Bucle principal de animación
    function step() {
        const now = performance.now();
        const w = cnv.width / DPR;
        const h = cnv.height / DPR;
        const cx = w * 0.5;
        const cy = h * 0.55;

        if (now - lastPulseTime > PULSE_INTERVAL) {
            pulse = 1;
            lastPulseTime = now;
        }

        if (pulse > 0) {
            const elapsed = now - lastPulseTime;
            if (elapsed < PULSE_DURATION) {
                pulse = 1;
            } else {
                pulse = Math.max(0, pulse - 0.045 * ((elapsed - PULSE_DURATION) / 16));
            }
        }

        ctx.fillStyle = bgFill;
        ctx.fillRect(0, 0, w, h);

        if (revealT < 1) {
            revealT = Math.min(1, revealT + REVEAL_SPEED);
        }

        const pulseFactor = 1 + pulse * 1.2;
        const spring = RETURN_SPRING * (1 + pulse * 0.6);
        const repulseBoost = pulse * 0.8;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.order <= revealT) {
                p.vx += (p.tx - p.x) * spring;
                p.vy += (p.ty - p.y) * spring;
            }

            const dxCenter = p.x - cx;
            const dyCenter = p.y - cy;
            const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            if (distCenter < 200) {
                const force = (120 * repulseBoost) / (distCenter + 10);
                p.vx += (dxCenter / distCenter) * force;
                p.vy += (dyCenter / distCenter) * force;
            }

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

            p.vx *= FRICTION;
            p.vy *= FRICTION;
            p.x += p.vx;
            p.y += p.vy;
        }

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
    
    // --- 🎁 NUEVAS FUNCIONES PARA LOS VIDEOS 🎁 ---
    
    // Función para detener la animación del corazón
    function stopHeartAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            isRunning = false;
        }
    }

    // Función que crea y muestra los videos
    function showGift() {
        stopHeartAnimation();
        cnv.style.display = 'none';

        // Eliminar cualquier video anterior
        const oldGift = document.getElementById('gift-video-container');
        if (oldGift) oldGift.remove();

        // Crear el contenedor principal para los videos
        const videoContainer = document.createElement('div');
        videoContainer.id = 'gift-video-container';
        videoContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 5;
            pointer-events: none;
        `;
        
        // Crear el video de fondo (flores.mp4)
        const floresVideo = document.createElement('video');
        floresVideo.autoplay = true;
        floresVideo.loop = true;
        floresVideo.muted = true;
        floresVideo.playsInline = true;
        floresVideo.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        `;
        floresVideo.innerHTML = `<source src="../assets/video/flores.mp4" type="video/mp4">`;
        videoContainer.appendChild(floresVideo);

        // Crear el video de superposición (nina.mp4)
        const ninaVideo = document.createElement('video');
        ninaVideo.autoplay = true;
        ninaVideo.loop = true;
        ninaVideo.muted = true;
        ninaVideo.playsInline = true;
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
        ninaVideo.innerHTML = `<source src="../assets/video/nina.mp4" type="video/mp4">`;
        videoContainer.appendChild(ninaVideo);

        // Insertar el contenedor en el DOM
        heroSection.appendChild(videoContainer);
        currentView = 'gift';
    }

    // --- 🎛 Control de navegación ---

    document.addEventListener('DOMContentLoaded', () => {
        // Flecha derecha → Mostrar regalo
        rightArrow.addEventListener('click', showGift);

        // Flecha izquierda → Volver al corazón
        leftArrow.addEventListener('click', () => {
            currentView = 'heart';
            const giftVideoContainer = document.getElementById('gift-video-container');
            if (giftVideoContainer) {
                giftVideoContainer.remove();
            }
            cnv.style.display = 'block';
            rebuildHeart();
            step();
        });
    });

    // --- 🚀 Inicialización y Eventos ---
    resize();
    step();

    window.addEventListener('resize', resize);
    cnv.addEventListener('pointerenter', onPointer);
    cnv.addEventListener('pointerleave', onPointer);
    cnv.addEventListener('pointermove', onPointer);
    cnv.addEventListener('pointerdown', onPointer);
    cnv.addEventListener('pointerup', onPointer);
    cnv.addEventListener('click', onPointer);
    cnv.addEventListener('touchstart', e => { e.preventDefault(); }, { passive: false });
})();
