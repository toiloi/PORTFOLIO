function openModal(title, image, description, githubLink) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-image").src = image;
  document.getElementById("modal-description").textContent = description;
  document.getElementById("modal-github").href = githubLink;
  document.getElementById("projectModal").style.display = "block";
}

// Đóng popup
document.querySelector(".close-btn").onclick = function () {
  document.getElementById("projectModal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target === document.getElementById("projectModal")) {
    document.getElementById("projectModal").style.display = "none";
  }
};
// Hiệu ứng typing
const text = "Hi ! I'm Le Duy Bang";
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
// --- Nút trở về đầu trang ---
const backToTop = document.getElementById("backToTop");

// Hiện nút khi cuộn xuống
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

// Cuộn mượt lên đầu khi nhấn
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const items = document.querySelectorAll(".timeline-item");
const line = document.querySelector(".timeline::before");

function revealTimeline() {
  const triggerBottom = window.innerHeight * 0.85;
  items.forEach((item) => {
    const boxTop = item.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealTimeline);
revealTimeline(); // chạy 1 lần đầu
