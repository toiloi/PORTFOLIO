const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalDesc = document.getElementById("modal-description");
const closeBtn = document.querySelector(".close-btn");

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
const text = " Nơi lưu giữ hành trình phát triển của tôi";
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
