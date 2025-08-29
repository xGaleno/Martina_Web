document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".video-background video");

  if (video) {
    video.addEventListener("canplaythrough", function () {
      video.classList.add("fade-in");
    });

    setTimeout(() => {
      if (!video.classList.contains("fade-in")) {
        video.classList.add("fade-in");
      }
    }, 500);
  }
});