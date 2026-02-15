 const slider = document.getElementById("gallerySlider");
  const nextBtn = document.querySelector(".gallery-btn.next");
  const prevBtn = document.querySelector(".gallery-btn.prev");

  const slideAmount = 380;

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: slideAmount, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -slideAmount, behavior: "smooth" });
  });