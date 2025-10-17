// app.js (smooth filter + stable reorder + keep theme/modal/reveal)
window.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const langBtn  = document.getElementById('langToggle');
  const yearEl   = document.getElementById('year');

  const KEY_THEME = 'theme-preference';
  const KEY_LANG  = 'lang-preference';

  // ---- Theme
  const preferDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  const getTheme = () => localStorage.getItem(KEY_THEME) || (preferDark() ? 'dark' : 'light');
  const setTheme = (mode) => {
    mode === 'dark' ? root.setAttribute('data-theme','dark') : root.removeAttribute('data-theme');
    localStorage.setItem(KEY_THEME, mode);
    if (themeBtn) themeBtn.innerHTML = (mode === 'dark')
      ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
  };

  // ---- Lang (placeholder)
  const getLang = () => localStorage.getItem(KEY_LANG) || (navigator.language?.startsWith('vi') ? 'vi' : 'en');
  const setLang = (lang) => localStorage.setItem(KEY_LANG, lang);

  // ---- Init
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  setTheme(getTheme());
  setLang(getLang());

  themeBtn?.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  langBtn?.addEventListener('click', () => setLang(getLang() === 'vi' ? 'en' : 'vi'));

  // ---- Reveal on scroll
  const reveal = document.querySelectorAll('.reveal, .services .svc-card, .projects .proj-card, .cta-form');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  reveal.forEach(el => io.observe(el));

  // ==== Smooth Project Filter with FLIP ====
(() => {
  const grid  = document.getElementById('projectGrid');
  const pills = document.querySelectorAll('.pill');
  if (!grid || !pills.length) return;

  const cards = Array.from(grid.querySelectorAll('.proj-card'));

  // Lấy vị trí hiện tại của 1 node
  const rect = el => el.getBoundingClientRect();

  // Animate FLIP cho 1 node (từ before -> after)
  function flip(el, before, after) {
    const dx = before.left - after.left;
    const dy = before.top  - after.top;

    // Invert
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'none';
    // Force reflow
    el.getBoundingClientRect();
    // Play
    el.style.transition = '';
    el.style.transform = '';
  }

  function applyFilter(filter) {
    const f = (filter || 'all').toLowerCase();

    // 1) BEFORE: đo vị trí hiện tại của các thẻ sẽ còn hiển thị (match hoặc đang hiển thị)
    const beforeMap = new Map();
    cards.forEach(c => {
      const tags = (c.getAttribute('data-tags') || '').toLowerCase();
      const isMatch = (f === 'all' || tags.includes(f));
      // thẻ đang hiển thị hoặc sẽ hiển thị
      if (!c.classList.contains('is-gone') && isMatch) {
        beforeMap.set(c, rect(c));
      }
    });

    // 2) Gắn trạng thái ẩn/hiện (chưa reorder DOM)
    cards.forEach(c => {
      const tags = (c.getAttribute('data-tags') || '').toLowerCase();
      const isMatch = (f === 'all' || tags.includes(f));
      if (isMatch) {
        // nếu trước đó bị ẩn -> sẽ xuất hiện như "mới"
        if (c.classList.contains('is-gone')) {
          c.classList.remove('is-gone');
          c.classList.add('is-new'); // opacity 0, scale .96
          c.style.display = '';      // cần có trong flow để tính after
        }
      } else {
        // ẩn mượt (chưa display:none ngay)
        c.classList.add('is-hiding');
      }
    });

    // 3) REORDER: đưa thẻ match lên trước (DOM append) – làm sau một tick
    requestAnimationFrame(() => {
      const match = cards.filter(c => {
        const tags = (c.getAttribute('data-tags') || '').toLowerCase();
        return (f === 'all' || tags.includes(f));
      });
      const rest  = cards.filter(c => !match.includes(c));

      match.forEach(c => grid.appendChild(c));
      rest.forEach(c  => grid.appendChild(c));

      // 4) AFTER: đo vị trí mới của các thẻ còn hiển thị
      const afterMap = new Map();
      match.forEach(c => afterMap.set(c, rect(c)));

      // 5) PLAY FLIP: animate di chuyển mượt tới vị trí mới
      match.forEach(c => {
        const before = beforeMap.get(c);
        const after  = afterMap.get(c);
        if (before && after) flip(c, before, after);
      });

      // 6) Hoàn tất trạng thái ẩn/hiện
      //    - thẻ "mới" fade-in
      match.forEach(c => {
        if (c.classList.contains('is-new')) {
          // force reflow để transition chạy
          c.getBoundingClientRect();
          c.classList.remove('is-new');
        }
      });

      //    - thẻ không khớp: sau khi fade-out xong thì display:none
      setTimeout(() => {
        cards.forEach(c => {
          if (c.classList.contains('is-hiding')) {
            c.classList.remove('is-hiding');
            c.classList.add('is-gone'); // loại khỏi layout
          }
        });
      }, 320); // khớp với transition .28–.38s
    });
  }

  // Bind UI
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(x => x.classList.remove('active'));
      pill.classList.add('active');
      applyFilter(pill.getAttribute('data-filter') || 'all');
    });
  });

  // Init
  applyFilter('all');
})();


  // ---- Mobile menu (optional)
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    alert('Home · About · Services · Projects · Contact');
  });
});

// ===== Project Modal =====
(function(){
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const title = document.getElementById('pmTitle');
  const img   = document.getElementById('pmImg');
  const tags  = document.getElementById('pmTags');
  const desc  = document.getElementById('pmDesc');
  const link  = document.getElementById('pmLink');

  const closeBtn = modal.querySelector('.modal__close');

  const getDesc = (card) => card.getAttribute('data-desc') || 'No description yet.';
  const getLink = (card) => card.getAttribute('data-link') || '#';

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
  }

  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.proj-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModalFrom(card));
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

// ==== Hero: split letters for name (keeps spaces) ====
(() => {
  const nameEl = document.querySelector('.animate-name .accent');
  if (!nameEl) return;
  const text = nameEl.textContent;
  nameEl.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.style.animationDelay = `${i * 0.08}s`;
    if (ch === ' ') { span.className = 'gap'; span.innerHTML = '&nbsp;'; }
    else { span.textContent = ch; }
    nameEl.appendChild(span);
  });
})();
