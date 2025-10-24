const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalDesc = document.getElementById("modal-description");
const closeBtn = document.querySelector(".close-btn");

window.addEventListener("load", function () {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});

function openModal(title, img, desc) {
  modalTitle.textContent = title;
  modalImage.src = img;
  modalDesc.textContent = desc;
  modal.style.display = "block";
}

closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Hiệu ứng typing
const text = " Xin chào! Mình là Lê Duy Bằng ";
const typingElement = document.getElementById("typing-text");
let index = 0;

function typeEffect() {
  if (index < text.length) {
    typingElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 90); // tốc độ gõ
  } else {
    // Khi gõ xong thì ẩn dấu gạch nhấp nháy
    typingElement.style.borderRight = "none";
  }
}

window.onload = typeEffect;

document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60, // trừ phần header nếu cần
        behavior: "smooth",
      });
    }
  });
});

const tiltEl = document.getElementById("tilt");
if (tiltEl) {
  const img = tiltEl.querySelector("img");

  tiltEl.addEventListener("mousemove", (e) => {
    const rect = tiltEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const maxRotate = 14; // degrees
    const rotateY = ((x - cx) / cx) * maxRotate * -1;
    const rotateX = ((y - cy) / cy) * maxRotate;

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    tiltEl.classList.add("hovering");
  });

  tiltEl.addEventListener("mouseleave", () => {
    img.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    tiltEl.classList.remove("hovering");
  });

  tiltEl.addEventListener("mouseenter", () => {
    tiltEl.classList.add("hovering");
  });
}

const container = document.getElementById("infinity-bg");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  container.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});

document.addEventListener("mouseleave", () => {
  container.style.transform = `rotateY(0deg) rotateX(0deg)`;
});
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
  });
}

// Hiển thị slide đầu tiên
showSlide(currentSlideIndex);

// Tự động chuyển slide sau mỗi 3 giây
setInterval(() => {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
}, 3000);
