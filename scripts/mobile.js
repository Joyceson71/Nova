 
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const navLinks = document.querySelectorAll(".mobile-nav .nav-link");

let menuOpen = false;

/* GSAP timeline */
const navTL = gsap.timeline({ paused: true });
navTL.to(mobileNav, {
  y: "-19%",
  duration: 0.3,
  ease: "power3.out"
});

/* Toggle menu */
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  menuOpen ? navTL.reverse() : navTL.play();
  menuOpen = !menuOpen;
});

/* Close on link click */
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navTL.reverse();
    menuBtn.classList.remove("active");
    menuOpen = false;
  });
});

/* ACTIVE LINK ON SCROLL */
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});
