// app.js (bản fix gọn, an toàn)
window.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const langBtn  = document.getElementById('langToggle');
  const yearEl   = document.getElementById('year');

  const KEY_THEME = 'theme-preference';
  const KEY_LANG  = 'lang-preference';

  // ------- Helpers
  const preferDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  const getTheme = () => localStorage.getItem(KEY_THEME) || (preferDark() ? 'dark' : 'light');
  const setTheme = (mode) => {
    if (mode === 'dark') root.setAttribute('data-theme','dark');
    else root.removeAttribute('data-theme');
    localStorage.setItem(KEY_THEME, mode);
    // đổi icon theo theme
    if (themeBtn) {
      themeBtn.innerHTML = (mode === 'dark')
        ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
    }
  };

  const getLang = () => localStorage.getItem(KEY_LANG) || (navigator.language?.startsWith('vi') ? 'vi' : 'en');
  const setLang = (lang) => { localStorage.setItem(KEY_LANG, lang); /* TODO: apply i18n nếu có */ };

  // ------- Init
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  setTheme(getTheme());        // áp theme & icon ngay khi load
  setLang(getLang());          // lưu ngôn ngữ hiện tại

  // ------- Events
  themeBtn?.addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    setTheme(next);
  });

  langBtn?.addEventListener('click', () => {
    const next = (getLang() === 'vi') ? 'en' : 'vi';
    setLang(next);
    // TODO: gọi applyI18n() nếu bạn có dictionary
  });

  // ------- Reveal on scroll
  const reveal = document.querySelectorAll('.reveal, .services .svc-card, .projects .proj-card, .cta-form');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  reveal.forEach(el => io.observe(el));

  // ------- Filter projects
const grid = document.getElementById('projectGrid');
const pills = document.querySelectorAll('.pill');

pills.forEach(p => p.addEventListener('click', () => {
  pills.forEach(x => x.classList.remove('active'));
  p.classList.add('active');

  const f = p.getAttribute('data-filter');
  const cards = grid.querySelectorAll('.proj-card');

  cards.forEach(card => {
    const tags = card.getAttribute('data-tags') || '';
    const show = f === 'all' || tags.includes(f);

    // Hiệu ứng ẩn hiện mượt
    if (show) {
      card.classList.remove('hide');
    } else {
      card.classList.add('hide');
    }
  });
}));

  // ------- Mobile menu
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    alert('Home · About · Services · Projects · Contact');
  });
});

// ===== Project Modal =====
(function(){
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const box   = modal.querySelector('.modal__box');
  const title = document.getElementById('pmTitle');
  const img   = document.getElementById('pmImg');
  const tags  = document.getElementById('pmTags');
  const desc  = document.getElementById('pmDesc');
  const link  = document.getElementById('pmLink');
  const closeBtn = modal.querySelector('.modal__close');

  // Helper: lấy mô tả & link từ data-attr nếu có
  function getDesc(card){
    return card.getAttribute('data-desc') || 'No description yet.';
  }
  function getLink(card){
    return card.getAttribute('data-link') || '#';
  }

  function openModalFrom(card){
    const nameEl = card.querySelector('.name-project');
    const imgEl  = card.querySelector('.thumb img');
    const tagEls = card.querySelectorAll('.tags li');

    title.textContent = nameEl ? nameEl.textContent.trim() : 'Project';
    img.src = imgEl ? imgEl.src : '';
    img.alt = title.textContent;

    tags.innerHTML = '';
    tagEls.forEach(li => {
      const item = document.createElement('li');
      item.textContent = li.textContent.trim();
      tags.appendChild(item);
    });

    desc.textContent = getDesc(card);
    link.href = getLink(card);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden','false');
  }

  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden','true');
  }

  // gắn sự kiện cho toàn bộ card
  document.querySelectorAll('.proj-card').forEach(card => {
    // hiệu ứng “click để xem chi tiết”
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModalFrom(card));
  });

  // đóng modal
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
})();





// Hiệu ứng từng chữ cho tên
const nameEl = document.querySelector('.animate-name .accent');
if (nameEl) {
  const text = nameEl.textContent;     
  nameEl.textContent = '';               
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.style.animationDelay = `${i * 0.08}s`;
    if (ch === ' ') {
      // hiển thị khoảng trắng đúng nghĩa
      span.className = 'gap';
      span.innerHTML = '&nbsp;';     
    } else {
      span.textContent = ch;
    }

    nameEl.appendChild(span);
  });
}