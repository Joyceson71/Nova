/* ================= MOBILE MENU ================= */
const hamburger = document.getElementById("hamburger");
const menu = document.querySelector(".center-section");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});

menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  });
});

/* ================= DISABLE GPU ON MOBILE ================= */
const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

if (isMobile) {
  const canvas = document.getElementById("bg-canvas");
  if (canvas) canvas.style.display = "none";

  const hero = document.getElementById("hero");
  hero.style.background =
    "radial-gradient(circle at top, #1a1446, #050816 70%)";
}
