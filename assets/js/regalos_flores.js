// === Módulo: Regalo con videos (flores + nina) ===
document.addEventListener('DOMContentLoaded', () => {
    const heartModule = window.HeartAnimation;
    if (!heartModule) return;

    const { cnv, heroSection } = heartModule.getElements();
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');

    let currentView = 'heart';

    function showGift() {
        heartModule.stop();
        currentView = 'gift';

        // Eliminar contenedor anterior si existe
        const oldGift = document.getElementById('gift-video-container');
        if (oldGift) oldGift.remove();

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

        heroSection.appendChild(videoContainer);
    }

    function showHeart() {
        const giftVideoContainer = document.getElementById('gift-video-container');
        if (giftVideoContainer) {
            giftVideoContainer.remove();
        }
        currentView = 'heart';
        heartModule.restart();
    }

    // Eventos de navegación
    rightArrow?.addEventListener('click', showGift);
    leftArrow?.addEventListener('click', showHeart);

    // Iniciar animación del corazón
    heartModule.init();
});