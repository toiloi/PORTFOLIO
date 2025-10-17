// Enhanced Portfolio Features
(function () {
  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
  }

  // Project data for modal
  const projectData = {
    dashboard: {
      title: "Website bán kim cương",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      description: "Ứng dụng web bán kim cương với giao diện trực quan và thông báo real-time.",
      tech: ["Django", "SSMS", "JavaScript", "HTML5", "CSS3", "Selenium"],
      features: [
      ],
      links: [
        { text: "Live Demo", url: "#", icon: "🌐" },
        { text: "GitHub", url: "https://github.com/Phap625/Diamond-Shop-System", icon: "💻" }
      ]
    },
    api: {
      title: "UTH Team Matchmaking ",
      image: "./img/uth2.png",
      description: "UTH Team Matchmaking API giúp kết nối sinh viên trong cùng đội nhóm dựa trên kỹ năng và sở thích chung.",
      tech: ["Spring Boot", "JWT", "Postman", "SSMS", "RESTTful API", "Docker"],
      features: [
        "🔐 Xác thực JWT bảo mật",
        "📝 CRUD operations đầy đủ",
        "🧪 Giúp kết nối sinh viên trong cùng đội nhóm",
        "📋 API documentation",
        "⚡ Middleware tối ưu"
      ],
      links: [
        { text: "Live Demo", url: "#", icon: "🌐" },
        { text: "GitHub", url: "https://github.com/toiloi/UTHTeamMatching", icon: "💻" }
      ]
    },
    ui: {
      title: "Traffic Sign Management",
      image: "./img/TFSign.png",
      description: "Bộ component UI tái sử dụng theo phong cách iOS glass với accessibility tốt.",
      tech: [".Net", "SSMS", "Docker", "CRUD", "RESTful API", "Microservices", "UI/UX Design", "API Gateway"],
      features: [
        "🎨 Thiết kế hệ thống linh hoạt",
        "♿ Tuân thủ tiêu chuẩn accessibility",
        "📱 Thiết kế ưu tiên di động",
        "🎭 Hỗ trợ chế độ tối/sáng",
        "🔧 AI thông báo biển báo"
      ],
      links: [
        { text: "Đang phát triển", url: "#", icon: "🚧" },
        { text: "GitHub", url: "https://github.com/hhoang205/TSL-SignMap.git", icon: "💻" }
      ]
    }
  };

  // Loading Screen Animation
  function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const loadingTitle = document.getElementById('loading-title');
    
    if (!loadingScreen) return;

    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Hide loading screen after completion
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 800);
        }, 500);
      }
      progressBar.style.width = progress + '%';
    }, 100);

    // Animate title
    if (window.anime && loadingTitle) {
      anime({
        targets: loadingTitle,
        scale: [0.8, 1.1, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
        delay: 200
      });
    }
  }

  // Advanced Cursor Trail Effect
  function initCursorTrail() {
    let mouseX = 0, mouseY = 0;
    let trailElements = [];

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create multiple trail elements for richer effect
      for (let i = 0; i < 3; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail-advanced';
        trail.style.left = mouseX - 10 + (i * 5) + 'px';
        trail.style.top = mouseY - 10 + (i * 3) + 'px';
        trail.style.animationDelay = (i * 0.1) + 's';
        
        document.body.appendChild(trail);
        trailElements.push(trail);
      }
      
      // Remove old trails
      if (trailElements.length > 30) {
        const oldTrail = trailElements.shift();
        if (oldTrail && oldTrail.parentNode) {
          oldTrail.parentNode.removeChild(oldTrail);
        }
      }
      
      // Remove trail after animation
      setTimeout(() => {
        trailElements.forEach(trail => {
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
        });
        trailElements = trailElements.filter(trail => trail.parentNode);
      }, 800);
    });
  }

  // Advanced Typing Effect with Enhanced Features
  function initTypingEffect() {
    if (!window.Typed) return;
    
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;

    new Typed('#typed-text', {
      strings: [
        '👋 Chào mừng đến với portfolio của mình!',
        '💻 Full-stack Developer',
        '🎨 UI/UX Enthusiast', 
        '🚀 Đam mê công nghệ',
        '📚 Luôn học hỏi và phát triển',
        '⚡ Tạo ra những sản phẩm có ý nghĩa',
        '🎯 Tập trung vào trải nghiệm người dùng',
        '🔧 Giải quyết vấn đề bằng code'
      ],
      typeSpeed: 40,
      backSpeed: 25,
      backDelay: 1500,
      loop: true,
      showCursor: false, // We'll use our custom cursor
      cursorChar: '|',
      fadeOut: true,
      fadeOutClass: 'typed-fade-out',
      fadeOutDelay: 500,
      onComplete: function() {
        // Add special effects when typing completes
        if (window.anime) {
          anime({
            targets: '.typing-cursor',
            scale: [1, 1.2, 1],
            duration: 300,
            easing: 'easeInOutQuad'
          });
        }
      }
    });
  }

  // Project Filter
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        
        projects.forEach(project => {
          const category = project.dataset.category;
          if (filter === 'all' || category === filter) {
            project.style.display = 'block';
            project.style.animation = 'fadeInUp 0.5s ease-out';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }

  // Project Modal
  function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const projectBtns = document.querySelectorAll('.project-detail-btn');
    let lastFocused = null;

    // Open modal
    projectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        const project = projectData[projectId];
        
        if (project) {
          document.getElementById('modal-title').textContent = project.title;
          document.getElementById('modal-image').src = project.image;
          document.getElementById('modal-image').alt = project.title;
          document.getElementById('modal-description').innerHTML = `<p>${project.description}</p>`;
          
          // Tech stack
          const techContainer = document.getElementById('modal-tech');
          techContainer.innerHTML = project.tech.map(tech => `<span>${tech}</span>`).join('');
          
          // Features
          const featuresContainer = document.getElementById('modal-features');
          featuresContainer.innerHTML = `
            <h4>Tính năng chính:</h4>
            <ul>${project.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
          `;
          
          // Links
          const linksContainer = document.getElementById('modal-links');
          linksContainer.innerHTML = `
            <h4>Liên kết:</h4>
            <div class="modal-links-buttons">
              ${project.links.map(link => 
                `<a href="${link.url}" class="btn primary" target="_blank">${link.icon} ${link.text}</a>`
              ).join('')}
            </div>
          `;
          
          modal.classList.add('active');
          // Accessibility: mark dialog open
          modal.setAttribute('aria-hidden', 'false');
          lastFocused = document.activeElement;
          // prevent body scroll
          document.body.style.overflow = 'hidden';
          // move focus to first focusable element inside modal
          focusFirstDescendant(modal);
        }
      });
    });

    // Close modal
    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
      // return focus to the element that opened the modal
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        e.preventDefault();
        closeModal();
        return;
      }

      // Focus trap: keep focus inside modal when open
      if (e.key === 'Tab' && modal.classList.contains('active')) {
        maintainFocus(e, modal);
      }
    });
  }

  /* --- Focus utility helpers --- */
  function focusableElements(root) {
    return Array.from(root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null || el.getAttribute('role') === 'document');
  }

  function focusFirstDescendant(root) {
    const focusables = focusableElements(root);
    if (focusables.length) {
      focusables[0].focus();
      return true;
    }
    // fallback to close button
    const closeBtn = root.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    return false;
  }

  function maintainFocus(e, root) {
    const focusables = focusableElements(root);
    if (!focusables.length) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) { // shift + tab
      if (active === first || active === root) {
        e.preventDefault();
        last.focus();
      }
    } else { // tab
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // 3D Tilt Effect
  function initTiltEffect() {
    if (!window.VanillaTilt) return;
    
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      VanillaTilt.init(card, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        scale: 1.02
      });
    });
  }

  // Enhanced EmailJS Form
  function initEmailJS() {
    const form = document.querySelector('form.contact');
    if (!form || !window.emailjs) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = '📤 Đang gửi...';
      
      // Get form data
      const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      };

      // Send email via EmailJS
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(() => {
          submitBtn.textContent = '✅ Đã gửi thành công!';
          form.reset();
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch(() => {
          submitBtn.textContent = '❌ Lỗi gửi email';
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  // Advanced Particle System
  function initParticleSystem() {
    const container = document.getElementById('particleContainer');
    if (!container) return;

    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random starting position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      
      // Random colors
      const colors = ['rgba(35,131,255,0.6)', 'rgba(255,107,129,0.6)', 'rgba(0,212,170,0.6)', 'rgba(255,215,0,0.6)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 15000);
    }

    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 200);
    }
  }

  // Scroll-triggered Animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all scroll-triggered elements
    const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in');
    scrollElements.forEach(el => observer.observe(el));
  }

  // Advanced Parallax Effect
  function initParallaxEffect() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(scrolled * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  }

  // Magnetic Effect for Interactive Elements
  function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = x * strength * 0.3;
          const moveY = y * strength * 0.3;
          
          element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`;
        } else {
          element.style.transform = 'translate(0, 0) scale(1)';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // Enhanced Loading Screen with advanced visuals, scroll lock, and fallback
  function initAdvancedLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const loadingTitle = document.getElementById('loading-title');
    if (!loadingScreen || !progressBar || !loadingTitle) return;

    // Lock scroll while loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Add pulse and percentage text
    loadingTitle.classList.add('loading-pulse');
    const percentageEl = document.createElement('small');
    percentageEl.setAttribute('aria-live', 'polite');
    loadingTitle.appendChild(percentageEl);

    // Simulated progressive loading with cap, then release on window 'load'
    let progress = 0;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tickMs = prefersReduced ? 220 : 150;
    const interval = setInterval(() => {
      const remaining = 100 - progress;
      const base = Math.random() * 8 + 2;
      const increment = Math.min(base, remaining);
      progress += increment;
      if (progress > 99) progress = 99; // hold at 99% until onload
      progressBar.style.width = progress + '%';
      percentageEl.textContent = ` ${Math.floor(progress)}%`;
    }, tickMs);

    function finishLoading() {
      clearInterval(interval);
      progress = 100;
      progressBar.style.width = '100%';
      percentageEl.textContent = ' 100%';

      const hide = () => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          document.body.style.overflow = originalOverflow || '';
        }, 800);
      };

      if (window.anime && !prefersReduced) {
        anime({
          targets: loadingTitle,
          scale: [1, 1.18, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .8)',
          complete: () => setTimeout(hide, 300)
        });
      } else {
        setTimeout(hide, 300);
      }
    }

    // Finish on window load
    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading, { once: true });
    }

    // Safety fallback in case 'load' never fires (e.g., third-party blocked)
    setTimeout(() => {
      if (loadingScreen && loadingScreen.style.display !== 'none') finishLoading();
    }, 8000);
  }

  // Initialize all features
  function init() {
    initAdvancedLoadingScreen();
    initCursorTrail();
    initTypingEffect();
    initProjectFilter();
    initProjectModal();
    initTiltEffect();
    initEmailJS();
    initParticleSystem();
    initScrollAnimations();
    initParallaxEffect();
    initMagneticEffect();
  }

  // Start initialization
  init();

// Theme toggle with localStorage persistence
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const key = 'portfolio-theme';

  function applyTheme(mode) {
    root.classList.remove('theme-light', 'theme-dark');
    if (mode === 'dark') root.classList.add('theme-dark');
    if (mode === 'light') root.classList.add('theme-light');
  }

  function currentPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const saved = localStorage.getItem(key);
  const initial = saved || (currentPrefersDark() ? 'dark' : 'light');
  applyTheme(initial);
  if (btn) btn.setAttribute('data-mode', initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = root.classList.contains('theme-dark');
      const next = isDark ? 'light' : 'dark';

      // animated theme transition using anime.js if available
      const run = () => {
        applyTheme(next);
        localStorage.setItem(key, next);
        btn.setAttribute('data-mode', next);
        btn.setAttribute('aria-label', next === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối');
      };

      if (window.anime) {
        anime({
          targets: document.body,
          opacity: [1, 0.2, 1],
          duration: 420,
          easing: 'easeInOutSine',
          begin: () => btn.classList.add('busy'),
          complete: () => { btn.classList.remove('busy'); }
        });
        // small icon flip
        anime({ targets: btn, rotateY: ['0deg','180deg'], duration: 320, easing: 'easeInOutQuad' });
        setTimeout(run, 160);
      } else {
        run();
      }
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });

  // Minimal form handler (mock)
  const form = document.querySelector('form.contact');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      console.log('Contact form submitted:', payload);
      form.reset();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Đã gửi ✓';
        setTimeout(() => { btn.disabled = false; btn.textContent = original; }, 1600);
      }
    });
  }
  
  // Init AOS animations with enhanced settings
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 100,
      anchorPlacement: 'top-bottom',
    });
  }

  // Init Swiper for projects with enhanced settings
  if (window.Swiper) {
    const swiper = new Swiper('.projects.swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      speed: 600,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: { 
        nextEl: '.swiper-button-next', 
        prevEl: '.swiper-button-prev' 
      },
      pagination: { 
        el: '.swiper-pagination', 
        clickable: true,
        dynamicBullets: true,
      },
      effect: 'slide',
      breakpoints: {
        640: { 
          slidesPerView: 1,
          spaceBetween: 16,
        },
        960: { 
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: { 
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }

  // Enhanced skill meters animation with staggered reveal
  const meters = document.querySelectorAll('.meter > span');
  const playMeters = () => {
    meters.forEach((el, index) => {
      const width = getComputedStyle(el).getPropertyValue('--p').trim();
      el.style.width = '0%';
      if (window.anime) {
        anime({ 
          targets: el, 
          width: [0, width], 
          duration: 1200, 
          easing: 'easeOutCubic', 
          delay: index * 150,
          begin: () => {
            el.style.opacity = '0';
          },
          update: (anim) => {
            el.style.opacity = anim.progress / 100;
          }
        });
      } else {
        el.style.width = width;
      }
    });
  };
  let metersPlayed = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !metersPlayed) {
        metersPlayed = true;
        playMeters();
      }
    });
  }, { threshold: 0.2 });
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);

  // Add parallax effect to hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.anime) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroSection.style.transform = `translateY(${rate}px)`;
    });
  }

  // Add typing effect to hero title
  const heroTitle = document.querySelector('.hero-text h1');
  if (heroTitle && window.anime) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    anime({
      targets: heroTitle,
      innerHTML: [text],
      duration: 2000,
      easing: 'easeOutExpo',
      delay: 500,
    });
  }

  // Enhanced tsParticles with more dynamic effects
  if (window.tsParticles) {
    tsParticles.load('tsparticles', {
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: false },
      particles: {
        number: { 
          value: 60, 
          density: { enable: true, area: 1000 } 
        },
        color: { 
          value: ['#2383ff', '#ff6b81', '#00d4aa', '#ffd700'] 
        },
        links: { 
          enable: true, 
          distance: 150, 
          color: '#ffffff', 
          opacity: 0.2, 
          width: 1.5 
        },
        move: { 
          enable: true, 
          speed: 0.8, 
          direction: 'none', 
          outModes: 'out',
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        },
        opacity: { 
          value: 0.4,
          animation: {
            enable: true,
            speed: 1,
            sync: false
          }
        },
        size: { 
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 2,
            sync: false
          }
        },
        shape: {
          type: 'circle'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          }
        }
      },
      detectRetina: true,
    });
  }

  // Add smooth scroll behavior for better UX
  document.documentElement.style.scrollBehavior = 'smooth';

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    if (window.anime) {
      anime({
        targets: document.body,
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => {
          document.body.style.opacity = '1';
        }
      });
    } else {
      document.body.style.opacity = '1';
    }
  });
})();

