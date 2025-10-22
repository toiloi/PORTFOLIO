// Fade-in on scroll
const faders = document.querySelectorAll(".fade-in");
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

const skillBars = document.querySelectorAll(".skill-bar div");
window.addEventListener("scroll", () => {
  skillBars.forEach((bar) => {
    const barPos = bar.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;
    if (barPos < screenPos) {
      bar.style.width = bar.getAttribute("data-width");
    }
  });
});

const navLinks = document.querySelectorAll("nav ul li a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80; // khoảng cách trừ đi chiều cao header
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const colToggles = document.querySelectorAll(".col-toggle");
function openContent(btn, content) {
  btn.setAttribute("aria-expanded", "true");
  content.classList.add("open");

  content.style.maxHeight = content.scrollHeight + "px";
  const onEnd = () => {
    if (btn.getAttribute("aria-expanded") === "true") {
      content.style.maxHeight = "none";
    }
    content.removeEventListener("transitionend", onEnd);
  };
  content.addEventListener("transitionend", onEnd);
}

function closeContent(btn, content) {
  btn.setAttribute("aria-expanded", "false");
  const currentHeight = content.scrollHeight;
  content.style.maxHeight = currentHeight + "px";
  content.offsetHeight;
  content.style.maxHeight = "0px";
  content.classList.remove("open");
}

colToggles.forEach((btn) => {
  const content = btn.nextElementSibling;
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeContent(btn, content);
    } else {
      openContent(btn, content);
    }
  });
  window.addEventListener("resize", () => {
    if (btn.getAttribute("aria-expanded") === "true") {
      content.style.maxHeight = content.scrollHeight + "px";
      setTimeout(() => {
        content.style.maxHeight = "none";
      }, 350);
    }
  });
});

const aboutSection = document.getElementById("about");
if (aboutSection) {
  const aboutObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const contents = aboutSection.querySelectorAll(".col-content");
        contents.forEach((c, i) => {
          const btn = c.previousElementSibling;
          if (btn && btn.getAttribute("aria-expanded") !== "true") {
            setTimeout(() => {
              openContent(btn, c);
            }, i * 150);
          }
        });
        obs.unobserve(aboutSection);
      });
    },
    { threshold: 0.25 }
  );
  aboutObserver.observe(aboutSection);
}

const hero = document.getElementById("hero");
if (hero) {
  const heroObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hero.classList.add("show");
        obs.unobserve(hero);
      });
    },
    { threshold: 0.15 }
  );
  heroObserver.observe(hero);
}

function createRipple(e) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = e.clientX - rect.left - size / 2 + "px";
  ripple.style.top = e.clientY - rect.top - size / 2 + "px";
  target.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

const logoLink = document.querySelector(".logo-link");
if (logoLink) logoLink.addEventListener("click", createRipple);
document
  .querySelectorAll("nav ul li a")
  .forEach((a) => a.addEventListener("click", createRipple));

//Nut cuon len dau trang
window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollToTopBtn");
  if (window.scrollY > 200) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});
document
  .getElementById("scrollToTopBtn")
  .addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

//lat the
document.querySelectorAll(".about-card-container").forEach((container) => {
  const images = container.querySelectorAll(".img-slider img");
  const inner = container.querySelector(".about-card-inner");
  const nextBtn = container.querySelector(".next");
  const prevBtn = container.querySelector(".prev");
  let index = 0;
  let autoSlide;

  function showImage(newIndex) {
    const oldIndex = index;
    index = (newIndex + images.length) % images.length;

    images[oldIndex].classList.remove("active");
    images[oldIndex].style.transform = "translateX(-100%)";
    images[oldIndex].style.opacity = "0";

    images[index].style.display = "block";
    images[index].style.transition = "none";
    images[index].style.transform = "translateX(100%)";
    images[index].style.opacity = "0";

    setTimeout(() => {
      images[index].style.transition = "transform 0.8s ease, opacity 0.8s ease";
      images[index].style.transform = "translateX(0)";
      images[index].style.opacity = "1";
      images[index].classList.add("active");
    }, 50);
  }

  function startAutoSlide() {
    autoSlide = setInterval(() => {
      showImage(index + 1);
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
    images.forEach((img) => {
      img.classList.remove("active");
      img.style.opacity = "0";
      img.style.transform = "translateX(100%)";
    });
    images[0].classList.add("active");
    images[0].style.opacity = "1";
    images[0].style.transform = "translateX(0)";
    index = 0;
  }

  container.addEventListener("mouseenter", () => {
    container.classList.add("flipped");
    startAutoSlide();
  });

  container.addEventListener("mouseleave", () => {
    container.classList.remove("flipped");
    stopAutoSlide();
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearInterval(autoSlide);
      showImage(index + 1, "right");
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearInterval(autoSlide);
      showImage(index - 1, "left");
      startAutoSlide();
    });
  }
});
