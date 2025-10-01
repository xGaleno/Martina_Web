
# Martina Web — _hacker minimal_

> “Código simple. Emoción pura. Sin ruido.”

![banner](assets/img/martina.png)

---

## ⚡ Demo local

```bash
# 1) Clona
git clone https://github.com/<tu-usuario>/Martina_Web.git
cd Martina_Web

# 2) Abre index.html (doble clic) o sirve estático
#   Opción A (VS Code): instala la extensión "Live Server" y clic en "Go Live"
#   Opción B (Python 3):
python -m http.server 8080
#   luego visita: http://localhost:8080/
```

> Entrada principal: `index.html`  
> Páginas: `pages/historia.html`, `pages/juego.html`, `pages/latidos.html`  
> Estilos: `assets/css/…` | JS: `assets/js/…` | Imágenes/Video/Audio: `assets/img`, `assets/video`, `assets/audio`

---

## 🚀 Deploy (sin drama)

### GitHub Pages (100% estático)
1. Sube el repo a GitHub.
2. En **Settings → Pages**:  
   - **Source**: `Deploy from a branch`  
   - **Branch**: `main` → carpeta raíz `/`  
3. Guarda. Tu sitio quedará en `https://<tu-usuario>.github.io/<repo>/`.

### Netlify
- Arrastra el repo o conecta Git → Build command: _none_ | Publish directory: `/`.

### Vercel
- Importa el repo → Framework preset: _None_ → Build & Output Settings: _Static_ → Output: `/`.

> Este proyecto es **estático** (HTML/CSS/JS puro). No necesita backend ni build step.

---

## 🧰 Tech stack (ligero, directo al punto)

- **HTML5** + **CSS3** (layouts, animaciones sutiles).
- **JavaScript vanilla** para interacciones y un mini-juego (`assets/js/juego.js`).
- Multimedia: `assets/audio/*.mp3`, `assets/video/*.mp4`.
- Icono: `favicon.ico`.

### Estructura relevante
```
.
├── index.html
├── ninadash.html
├── pages/
│   ├── historia.html
│   ├── juego.html
│   └── latidos.html
├── assets/
│   ├── css/    # index.css, animaciones.css, historia.css, imagenes.css, juego.css, latidos.css
│   ├── js/     # imagenes.js, nosotros.js, musica.js, juego.js, etc.
│   ├── img/    # banners, fotos, dino, cactus, etc.
│   ├── audio/  # Musica.mp3, Humbe.mp3
│   └── video/  # fondo.mp4, flores.mp4, etc.
└── .gitignore, .gitattributes
```

---

## 🏷️ Badges (estilo hacker minimal)
Inserta lo que te sirva (usa <https://img.shields.io>):

```md
![Static](https://img.shields.io/badge/site-static-black)
![Status](https://img.shields.io/badge/status-online-black)
![Made%20with](https://img.shields.io/badge/made_with-♥-black)
```

> Consejo: mantener todo **en negro/gris** para conservar la vibra minimal.

---

## 🖼️ Banners + Social Preview

### Banner superior en el README
Puedes usar cualquier imagen del proyecto o externa:
```md
![banner](assets/img/martina.png)
```
> Recomendado: 1200×400px aprox. (ligero).

### Social preview (la imagen que muestra GitHub al compartir)
1. Ve a **Settings → General → Social preview**.
2. Sube una imagen 1280×640px (o similar).  
3. _Tip_: usa el mismo banner en monocromo para consistencia.

---

## 🎮 Mini‑juego (pages/juego.html)
- Lógica en `assets/js/juego.js`.
- Si ajustás física/velocidad, mutá constantes al inicio del archivo.
- Mantiene el look **retro** con paleta sobria.

---

## 🔊 Audio / Autoplay
El `<audio>` viene con `muted` + `autoplay` para evitar bloqueos de navegador:
```html
<audio id="background-music" loop autoplay muted>
  <source src="assets/audio/Musica.mp3" type="audio/mpeg">
</audio>
```
- Para permitir sonido desde el inicio en móviles, se requiere interacción del usuario. Podés **quitar `muted`** si lo deseás, asumiendo el riesgo de bloqueo.

---

## 🧪 Checklist de calidad (breve)
- [ ] Pesos de imágenes optimizados (usa `.webp` donde puedas).
- [ ] Videos comprimidos (bitrate bajo, sin perder mucho detalle).
- [ ] `alt` en imágenes para accesibilidad.
- [ ] CSS y JS minificados para deploy (opcional).

---

## 🤝 Clonar / contribuir (si te pinta)
```bash
git clone https://github.com/<tu-usuario>/Martina_Web.git
git checkout -b feature/tu-mejora
# …código…
git commit -m "feat: mejora sutil"
git push origin feature/tu-mejora
```

---

## 🧘 Filosofía
> _“Hacer por hobby. Mantenerlo simple. Sorprender con poco.”_

Si algo cruje, lo arreglo. Si algo distrae, lo quito. Si algo enamora, lo dejo.

---

## © Licencia
Este proyecto es personal. Si querés reutilizar, pedí permiso o dejá crédito. _Play nice._
