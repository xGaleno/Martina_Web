// ─────────────── 🦖 JUEGO DINOSAURIO ───────────────
// assets/js/juego.js — Lógica principal del mini-juego tipo "Chrome Dino"

// CONFIGURACIÓN INICIAL Y LOOP DEL JUEGO

let time = new Date();
let deltaTime = 0;

// Inicia el juego tan pronto como el DOM esté listo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(Init, 1);
} else {
  document.addEventListener('DOMContentLoaded', Init);
}

// Inicializa el juego y comienza el loop principal
function Init() {
  time = new Date();
  Start();
  Loop();
}

// Loop de animación principal (60 FPS aproximadamente)
function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  Update();
  requestAnimationFrame(Loop);
}

// VARIABLES DEL JUEGO

// Física del dinosaurio
const sueloY = 22;
let velY = 0;
const impulso = 900;
const gravedad = 2500;

let dinoPosX = 42;
let dinoPosY = sueloY;

// Escenario y velocidad
let sueloX = 0;
const velEscenario = 1280 / 3;
let gameVel = 1;
let score = 0;

// Estados del juego
let parado = false;
let saltando = false;

// Obstáculos (cactus)
let tiempoHastaObstaculo = 2;
const tiempoObstaculoMin = 0.7;
const tiempoObstaculoMax = 1.8;
const obstaculoPosY = 16;
let obstaculos = [];

// Nubes (decoración)
let tiempoHastaNube = 0.5;
const tiempoNubeMin = 0.7;
const tiempoNubeMax = 2.7;
const maxNubeY = 270;
const minNubeY = 100;
let nubes = [];
const velNube = 0.5;

// Referencias al DOM
let contenedor;
let dino;
let textoScore;
let suelo;
let gameOver;

// INICIALIZACIÓN Y MANEJO DE EVENTOS

// Configura referencias al DOM y escucha eventos de teclado
function Start() {
  gameOver = document.querySelector('.game-over');
  suelo = document.querySelector('.suelo');
  contenedor = document.querySelector('.contenedor-juego');
  textoScore = document.querySelector('.score');
  dino = document.querySelector('.dino');
  document.addEventListener('keydown', HandleKeyDown);
}

// Actualiza la lógica del juego en cada frame
function Update() {
  if (parado) return;

  MoverDinosaurio();
  MoverSuelo();
  DecidirCrearObstaculos();
  DecidirCrearNubes();
  MoverObstaculos();
  MoverNubes();
  DetectarColision();

  velY -= gravedad * deltaTime;
}

// Maneja la tecla de salto (ESPACIO)
function HandleKeyDown(ev) {
  if (ev.keyCode === 32) {
    Saltar();
  }
}

// COMPORTAMIENTO DEL DINOSAURIO

// Aplica impulso vertical al dinosaurio si está en el suelo
function Saltar() {
  if (dinoPosY === sueloY) {
    saltando = true;
    velY = impulso;
    dino.classList.remove('dino-corriendo');
  }
}

// Actualiza la posición vertical del dinosaurio con física de salto
function MoverDinosaurio() {
  dinoPosY += velY * deltaTime;
  if (dinoPosY < sueloY) {
    TocarSuelo();
  }
  dino.style.bottom = `${dinoPosY}px`;
}

// Restablece el estado del dinosaurio al tocar el suelo
function TocarSuelo() {
  dinoPosY = sueloY;
  velY = 0;
  if (saltando) {
    dino.classList.add('dino-corriendo');
  }
  saltando = false;
}

// ESCENARIO Y DECORACIÓN

// Mueve el suelo en bucle para simular desplazamiento
function MoverSuelo() {
  sueloX += CalcularDesplazamiento();
  suelo.style.left = `-${sueloX % contenedor.clientWidth}px`;
}

// Calcula cuánto se debe mover el escenario en este frame
function CalcularDesplazamiento() {
  return velEscenario * deltaTime * gameVel;
}

// Decide si es momento de crear un nuevo obstáculo
function DecidirCrearObstaculos() {
  tiempoHastaObstaculo -= deltaTime;
  if (tiempoHastaObstaculo <= 0) {
    CrearObstaculo();
  }
}

// Decide si es momento de crear una nueva nube
function DecidirCrearNubes() {
  tiempoHastaNube -= deltaTime;
  if (tiempoHastaNube <= 0) {
    CrearNube();
  }
}

// Crea un nuevo obstáculo (cactus) y lo añade al DOM
function CrearObstaculo() {
  const obstaculo = document.createElement('div');
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add('cactus');
  if (Math.random() > 0.5) obstaculo.classList.add('cactus2');
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = `${contenedor.clientWidth}px`;
  obstaculos.push(obstaculo);
  tiempoHastaObstaculo =
    tiempoObstaculoMin + (Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

// Crea una nueva nube decorativa y la añade al DOM
function CrearNube() {
  const nube = document.createElement('div');
  contenedor.appendChild(nube);
  nube.classList.add('nube');
  nube.posX = contenedor.clientWidth;
  nube.style.left = `${contenedor.clientWidth}px`;
  nube.style.bottom = `${minNubeY + Math.random() * (maxNubeY - minNubeY)}px`;
  nubes.push(nube);
  tiempoHastaNube =
    tiempoNubeMin + (Math.random() * (tiempoNubeMax - tiempoNubeMin)) / gameVel;
}

// MOVIMIENTO DE OBJETOS

// Mueve los obstáculos y elimina los que salen de pantalla
function MoverObstaculos() {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
      obstaculos[i].parentNode.removeChild(obstaculos[i]);
      obstaculos.splice(i, 1);
      GanarPuntos();
    } else {
      obstaculos[i].posX -= CalcularDesplazamiento();
      obstaculos[i].style.left = `${obstaculos[i].posX}px`;
    }
  }
}

// Mueve las nubes (más lentas que los obstáculos)
function MoverNubes() {
  for (let i = nubes.length - 1; i >= 0; i--) {
    if (nubes[i].posX < -nubes[i].clientWidth) {
      nubes[i].parentNode.removeChild(nubes[i]);
      nubes.splice(i, 1);
    } else {
      nubes[i].posX -= CalcularDesplazamiento() * velNube;
      nubes[i].style.left = `${nubes[i].posX}px`;
    }
  }
}

// PUNTUACIÓN Y PROGRESIÓN

// Incrementa la puntuación y ajusta la dificultad
function GanarPuntos() {
  score++;
  textoScore.innerText = score;

  // Aumentar velocidad y cambiar ambiente según puntuación
  if (score === 5) {
    gameVel = 1.5;
    contenedor.classList.add('mediodia');
  } else if (score === 10) {
    gameVel = 2;
    contenedor.classList.add('tarde');
  } else if (score === 20) {
    gameVel = 3;
    contenedor.classList.add('noche');
  }

  // Ajustar animación del suelo según velocidad
  suelo.style.animationDuration = `${3 / gameVel}s`;
}

// COLISIONES Y FIN DEL JUEGO

// Detecta colisiones entre el dinosaurio y los obstáculos
function DetectarColision() {
  for (let i = 0; i < obstaculos.length; i++) {
    // Optimización: si el obstáculo está muy adelante, no hay colisión posible
    if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
      break;
    }
    // Verifica colisión con márgenes personalizados
    if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
      GameOver();
    }
  }
}

// Verifica si dos elementos colisionan con márgenes ajustables
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - paddingBottom < bRect.top ||
    aRect.top + paddingTop > bRect.top + bRect.height ||
    aRect.left + aRect.width - paddingRight < bRect.left ||
    aRect.left + paddingLeft > bRect.left + bRect.width
  );
}

// Maneja el estado de "Game Over"
function GameOver() {
  Estrellarse();
  gameOver.style.display = 'block';

  // Dejar de escuchar saltos
  document.removeEventListener('keydown', HandleKeyDown);

  // Escuchar ESPACIO para reiniciar
  function onKeyPress(ev) {
    if (ev.keyCode === 32) {
      ReiniciarJuego();
      document.removeEventListener('keydown', onKeyPress);
    }
  }
  document.addEventListener('keydown', onKeyPress);
}

// Aplica efecto visual al dinosaurio al chocar
function Estrellarse() {
  dino.classList.remove('dino-corriendo');
  dino.classList.add('dino-estrellado');
  parado = true;
}

// REINICIO DEL JUEGO

// Restablece todas las variables y el DOM al estado inicial
function ReiniciarJuego() {
  // Ocultar mensaje de Game Over
  gameOver.style.display = 'none';

  // Resetear variables de juego
  score = 0;
  gameVel = 1;
  velY = 0;
  dinoPosY = sueloY;
  parado = false;
  saltando = false;
  tiempoHastaObstaculo = 2;
  tiempoHastaNube = 0.5;

  // Eliminar obstáculos y nubes del DOM
  [...obstaculos, ...nubes].forEach((el) => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });

  // Vaciar arrays
  obstaculos = [];
  nubes = [];

  // Resetear interfaz
  textoScore.innerText = '0';
  contenedor.className = 'contenedor-juego'; // Elimina clases de ambiente
  dino.className = 'dino'; // Restaura clase base
  dino.classList.add('dino-corriendo');

  // Repositionar suelo
  sueloX = 0;
  suelo.style.left = '0px';

  // Volver a escuchar saltos
  document.addEventListener('keydown', HandleKeyDown);

  // Soporte táctil para salto (funciona en móvil sin cambios en HTML)
  document.addEventListener('touchstart', () => {
    if (typeof saltando !== 'undefined' && dinoPosY === sueloY) {
      Saltar();
    }
  }, { passive: true });
}
