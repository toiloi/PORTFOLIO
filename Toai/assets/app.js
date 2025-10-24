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
    function animateSkillBars(){
      if (window.__skillsAnimated) return;
      const bars = document.querySelectorAll('.about-skills .bar i');
      bars.forEach((i, idx) => {
        const target = getComputedStyle(i).getPropertyValue('--v').trim() || '0%';
        i.style.width = '0%';
        i.style.transition = 'width 1600ms cubic-bezier(.22,.61,.36,1)';
        setTimeout(() => { i.style.width = target; }, 200 * idx);
      });
      window.__skillsAnimated = true;
    }

    entries.forEach(e => { if (!e.isIntersecting) return; const el = e.target; el.classList.add('visible'); if (el.classList.contains('about-skills')) { try { animateSkillBars(); } catch(e){} } });
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
    const tagEls = card.querySelectorAll('.overlay-body .tags li');

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

// === Type-by-words utilities ===
(function(){
  // Gõ MỘT LẦN theo từng từ (không xóa), hỗ trợ mảng từ + separator
  function typeWordsOnce(targetEl, words, {separator = ' ', wordDelay = 1000, onDone} = {}) {
    if (!targetEl) return;
    let i = 0;
    const caret = targetEl.nextElementSibling?.classList.contains('caret') ? targetEl.nextElementSibling : null;

    function step(){
      if (i < words.length){
        // chèn từ + separator (trừ từ cuối)
        targetEl.textContent += (i === 0 ? '' : separator) + words[i];
        i++;
        setTimeout(step, wordDelay);
      } else {
        // xong: giữ caret nhấp nháy
        if (typeof onDone === 'function') onDone();
      }
    }
    // bắt đầu “rỗng”
    targetEl.textContent = '';
    // đảm bảo caret hiển thị
    if (caret) caret.style.visibility = 'visible';
    step();
  }

  // Gõ từng từ cho 1 đoạn văn dài (chuỗi → tách theo khoảng trắng)
  function typeParagraphByWords(targetEl, fullText, {wordDelay = 1000, onDone} = {}) {
    if (!targetEl) return;
    // caret nằm trong p -> lấy caret cuối
    const caret = targetEl.querySelector('.caret') || targetEl.nextElementSibling;
    const words = (fullText || '').split(/\s+/).filter(Boolean);
    let i = 0;

    // reset nội dung (chừa caret nếu ở bên trong)
    if (caret && targetEl.contains(caret)) {
      targetEl.innerHTML = ''; // xóa hết trước
      targetEl.appendChild(caret); // thêm lại caret vào cuối
    } else {
      targetEl.textContent = '';
    }

    function step(){
      if (i < words.length){
        // chèn khoảng trắng trước các từ từ thứ 2 trở đi
        const space = (i === 0) ? '' : ' ';
        // nếu caret là phần tử con -> chèn text trước caret
        if (caret && targetEl.contains(caret)) {
          caret.insertAdjacentText('beforebegin', space + words[i]);
        } else {
          targetEl.textContent += space + words[i];
        }
        i++;
        setTimeout(step, wordDelay);
      } else {
        if (typeof onDone === 'function') onDone();
      }
    }
    if (caret) caret.style.visibility = 'visible';
    step();
  }

  // === Slogan: "Discipline - Dynamic - Creative" ===
  document.addEventListener('DOMContentLoaded', () => {
    const sloganEl = document.getElementById('sloganTyper');
    if (sloganEl) {
      const arr = (() => {
        try { return JSON.parse(sloganEl.getAttribute('data-words') || '[]'); }
        catch { return []; }
      })();
      const sep = sloganEl.getAttribute('data-sep') || ' - ';
      typeWordsOnce(sloganEl, arr, { separator: sep, wordDelay: 55 });
    }

    // === Paragraph info ===
    const bioEl = document.getElementById('bioTyper');
    if (bioEl) {
      const text = bioEl.getAttribute('data-text') || bioEl.textContent || '';
      typeParagraphByWords(bioEl, text, { wordDelay: 55 });
    }
  });
})();


// === Hero Icons FX: dense, small, outlined study-tool icons drifting within hero ===
(function(){
  const ORANGE = '#ff6900';

  function initHeroFX(){
    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('heroFX');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas(){
      const rect = hero.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const iconNames = ['pencil','book','ruler','calculator','flask','backpack','compass','magnifier','laptop'];
    const atlas = {};
    function makeIcon(draw, size=26){
      const c = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.height = size * dpr;
      const g = c.getContext('2d');
      g.scale(dpr, dpr);
      g.clearRect(0,0,size,size);
      g.strokeStyle = ORANGE;
      g.lineWidth = 1.8;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      draw(g, size);
      return c;
    }
    const icons = {
      pencil: (g,s)=>{ g.beginPath(); g.moveTo(s*.15,s*.78); g.lineTo(s*.78,s*.15); g.stroke();
                       g.beginPath(); g.moveTo(s*.80,s*.13); g.lineTo(s*.87,s*.20); g.lineTo(s*.78,s*.22); g.closePath(); g.stroke();
                       g.strokeRect(s*.12, s*.72, s*.12, s*.12); },
      book: (g,s)=>{ g.beginPath(); g.moveTo(s*.22,s*.25); g.lineTo(s*.22,s*.78); g.lineTo(s*.48,s*.68); g.lineTo(s*.76,s*.78); g.lineTo(s*.76,s*.25); g.closePath(); g.stroke();
                     g.beginPath(); g.moveTo(s*.48,s*.32); g.lineTo(s*.48,s*.70); g.stroke(); },
      ruler:(g,s)=>{ g.strokeRect(s*.22,s*.38,s*.56,s*.26);
                     for(let i=0;i<9;i++){ const x=s*(.24+i*(.56/8)); g.beginPath(); g.moveTo(x,s*.38); g.lineTo(x,s*(i%2?.31:.28)); g.stroke();} },
      calculator:(g,s)=>{ g.strokeRect(s*.26,s*.22,s*.48,s*.54);
                          g.strokeRect(s*.31,s*.27,s*.38,s*.12);
                          for(let r=0;r<3;r++) for(let c=0;c<3;c++) g.strokeRect(s*(.31+c*.12), s*(.45+r*.12), s*.09, s*.09); },
      flask:(g,s)=>{ g.beginPath(); g.moveTo(s*.45,s*.22); g.lineTo(s*.55,s*.22); g.lineTo(s*.55,s*.42);
                     g.quadraticCurveTo(s*.76,s*.70,s*.70,s*.80); g.lineTo(s*.30,s*.80);
                     g.quadraticCurveTo(s*.24,s*.70,s*.45,s*.42); g.closePath(); g.stroke(); },
      backpack:(g,s)=>{ g.beginPath(); g.moveTo(s*.34,s*.38); g.quadraticCurveTo(s*.50,s*.20,s*.66,s*.38); g.lineTo(s*.66,s*.74); g.quadraticCurveTo(s*.50,s*.84,s*.34,s*.74); g.closePath(); g.stroke();
                        g.strokeRect(s*.42,s*.56,s*.16,s*.12); },
      compass:(g,s)=>{ g.beginPath(); g.arc(s*.5,s*.38,s*.08,0,Math.PI*2); g.stroke();
                       g.beginPath(); g.moveTo(s*.5,s*.46); g.lineTo(s*.34,s*.78); g.moveTo(s*.5,s*.46); g.lineTo(s*.66,s*.78); g.stroke();
                       g.beginPath(); g.moveTo(s*.42,s*.62); g.lineTo(s*.58,s*.62); g.stroke(); },
      magnifier:(g,s)=>{ g.beginPath(); g.arc(s*.45,s*.45,s*.16,0,Math.PI*2); g.stroke();
                         g.beginPath(); g.moveTo(s*.56,s*.56); g.lineTo(s*.78,s*.78); g.stroke(); },
      laptop:(g,s)=>{ g.strokeRect(s*.28,s*.32,s*.44,s*.26);
                      g.beginPath(); g.moveTo(s*.22,s*.62); g.lineTo(s*.78,s*.62); g.lineTo(s*.70,s*.72); g.lineTo(s*.30,s*.72); g.closePath(); g.stroke(); }
    };
    iconNames.forEach(n => { atlas[n] = makeIcon(icons[n], 24); });

    let nodes = [];
    function resetNodes(){
      const area = w * h;
      // fill hero densely with small icons; area/7000 is dense, clamp to 80..360
      const target = Math.max(80, Math.min(360, Math.floor(area / 7000)));
      nodes = Array.from({length: target}).map(() => {
        const name = iconNames[(Math.random()*iconNames.length)|0];
        return {
          name,
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(), // depth factor 0..1
          s: 0.55 + Math.random()*0.6, // scale 0.55..1.15
          vx: (Math.random() * 0.5 - 0.25), // px/frame
          vy: (Math.random() * 0.5 - 0.25),
          rot: (Math.random()*0.02 - 0.01),
          a: 0.65 + Math.random()*0.25,
          r: Math.random()*Math.PI*2
        };
      });
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      for (const it of nodes){
        it.x += it.vx * (0.5 + it.z*0.7);
        it.y += it.vy * (0.5 + it.z*0.7);
        it.r += it.rot;

        if (it.x > w+20) it.x = -20;
        if (it.x < -20) it.x = w+20;
        if (it.y > h+20) it.y = -20;
        if (it.y < -20) it.y = h+20;

        const img = atlas[it.name];
        const size = (18 * it.s) * (0.7 + it.z*0.6);
        const half = size/2;
        ctx.save();
        ctx.globalAlpha = it.a * (0.9 - it.z*0.3);
        ctx.translate(it.x, it.y);
        ctx.rotate(it.r);
        ctx.drawImage(img, -half, -half, size, size);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }

    sizeCanvas();
    resetNodes();
    window.addEventListener('resize', () => { sizeCanvas(); resetNodes(); }, {passive:true});
    setTimeout(() => { sizeCanvas(); resetNodes(); }, 300);
    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initHeroFX, {once:true});
  } else {
    initHeroFX();
  }
})();


// === Page Icons FX: dense, small, outlined study-tool icons drifting across viewport ===
(function(){
  const ORANGE = '#ff6900';

  function initPageFX(){
    // Create/attach canvas to body if missing
    let canvas = document.getElementById('pageFX');
    if (!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'pageFX';
      document.body.prepend(canvas);
    }
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas(){
      w = Math.max(1, Math.floor(window.innerWidth));
      h = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const iconNames = ['pencil','book','ruler','calculator','flask','backpack','compass','magnifier','laptop'];
    const atlas = {};
    function makeIcon(draw, size=26){
      const c = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.height = size * dpr;
      const g = c.getContext('2d');
      g.scale(dpr, dpr);
      g.clearRect(0,0,size,size);
      g.strokeStyle = ORANGE;
      g.lineWidth = 1.8;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      draw(g, size);
      return c;
    }
    const icons = {
      pencil: (g,s)=>{ g.beginPath(); g.moveTo(s*.15,s*.78); g.lineTo(s*.78,s*.15); g.stroke();
                       g.beginPath(); g.moveTo(s*.80,s*.13); g.lineTo(s*.87,s*.20); g.lineTo(s*.78,s*.22); g.closePath(); g.stroke();
                       g.strokeRect(s*.12, s*.72, s*.12, s*.12); },
      book: (g,s)=>{ g.beginPath(); g.moveTo(s*.22,s*.25); g.lineTo(s*.22,s*.78); g.lineTo(s*.48,s*.68); g.lineTo(s*.76,s*.78); g.lineTo(s*.76,s*.25); g.closePath(); g.stroke();
                     g.beginPath(); g.moveTo(s*.48,s*.32); g.lineTo(s*.48,s*.70); g.stroke(); },
      ruler:(g,s)=>{ g.strokeRect(s*.22,s*.38,s*.56,s*.26);
                     for(let i=0;i<9;i++){ const x=s*(.24+i*(.56/8)); g.beginPath(); g.moveTo(x,s*.38); g.lineTo(x,s*(i%2?.31:.28)); g.stroke();} },
      calculator:(g,s)=>{ g.strokeRect(s*.26,s*.22,s*.48,s*.54);
                          g.strokeRect(s*.31,s*.27,s*.38,s*.12);
                          for(let r=0;r<3;r++) for(let c=0;c<3;c++) g.strokeRect(s*(.31+c*.12), s*(.45+r*.12), s*.09, s*.09); },
      flask:(g,s)=>{ g.beginPath(); g.moveTo(s*.45,s*.22); g.lineTo(s*.55,s*.22); g.lineTo(s*.55,s*.42);
                     g.quadraticCurveTo(s*.76,s*.70,s*.70,s*.80); g.lineTo(s*.30,s*.80);
                     g.quadraticCurveTo(s*.24,s*.70,s*.45,s*.42); g.closePath(); g.stroke(); },
      backpack:(g,s)=>{ g.beginPath(); g.moveTo(s*.34,s*.38); g.quadraticCurveTo(s*.50,s*.20,s*.66,s*.38); g.lineTo(s*.66,s*.74); g.quadraticCurveTo(s*.50,s*.84,s*.34,s*.74); g.closePath(); g.stroke();
                        g.strokeRect(s*.42,s*.56,s*.16,s*.12); },
      compass:(g,s)=>{ g.beginPath(); g.arc(s*.5,s*.38,s*.08,0,Math.PI*2); g.stroke();
                       g.beginPath(); g.moveTo(s*.5,s*.46); g.lineTo(s*.34,s*.78); g.moveTo(s*.5,s*.46); g.lineTo(s*.66,s*.78); g.stroke();
                       g.beginPath(); g.moveTo(s*.42,s*.62); g.lineTo(s*.58,s*.62); g.stroke(); },
      magnifier:(g,s)=>{ g.beginPath(); g.arc(s*.45,s*.45,s*.16,0,Math.PI*2); g.stroke();
                         g.beginPath(); g.moveTo(s*.56,s*.56); g.lineTo(s*.78,s*.78); g.stroke(); },
      laptop:(g,s)=>{ g.strokeRect(s*.28,s*.32,s*.44,s*.26);
                      g.beginPath(); g.moveTo(s*.22,s*.62); g.lineTo(s*.78,s*.62); g.lineTo(s*.70,s*.72); g.lineTo(s*.30,s*.72); g.closePath(); g.stroke(); }
    };
    iconNames.forEach(n => { atlas[n] = makeIcon(icons[n], 24); });

    let nodes = [];
    function resetNodes(){
      const area = w * h;
      const target = Math.max(100, Math.min(420, Math.floor(area / 6500))); // slightly denser for page
      nodes = Array.from({length: target}).map(() => {
        const name = iconNames[(Math.random()*iconNames.length)|0];
        return {
          name,
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          s: 0.55 + Math.random()*0.6,
          vx: (Math.random() * 0.5 - 0.25),
          vy: (Math.random() * 0.5 - 0.25),
          rot: (Math.random()*0.02 - 0.01),
          a: 0.55 + Math.random()*0.25,
          r: Math.random()*Math.PI*2
        };
      });
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      for (const it of nodes){
        it.x += it.vx * (0.5 + it.z*0.7);
        it.y += it.vy * (0.5 + it.z*0.7);
        it.r += it.rot;

        if (it.x > w+20) it.x = -20;
        if (it.x < -20) it.x = w+20;
        if (it.y > h+20) it.y = -20;
        if (it.y < -20) it.y = h+20;

        const img = atlas[it.name];
        const size = (18 * it.s) * (0.7 + it.z*0.6);
        const half = size/2;
        ctx.save();
        ctx.globalAlpha = it.a * (0.9 - it.z*0.3);
        ctx.translate(it.x, it.y);
        ctx.rotate(it.r);
        ctx.drawImage(img, -half, -half, size, size);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }

    sizeCanvas();
    resetNodes();
    window.addEventListener('resize', () => { sizeCanvas(); resetNodes(); }, {passive:true});
    setTimeout(() => { sizeCanvas(); resetNodes(); }, 300);
    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPageFX, {once:true});
  } else {
    initPageFX();
  }
})();

// === Tilt cards with mouse position for glow ===
(function(){
  const TILT_SEL = '.tilt';
  const els = Array.from(document.querySelectorAll(TILT_SEL));
  const lerp = (a,b,t)=>a+(b-a)*t;
  function onMove(e){
    const el = e.currentTarget;
    const r  = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', (x*100)+'%');
    el.style.setProperty('--my', (y*100)+'%');
    const rx = lerp(5,-5,y);
    const ry = lerp(-6,6,x);
    el.style.transform = `translateY(-6px) scale(1.02) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function onLeave(e){ e.currentTarget.style.transform = ''; }
  els.forEach(el => {
    el.addEventListener('mousemove', onMove, {passive: true});
    el.addEventListener('mouseleave', onLeave, {passive: true});
  });
})();

// === Rich Hover FX: ripple, parallax image, magnetic icons ===
(function(){
  const cards = document.querySelectorAll('.fx-rich');
  const projCards = document.querySelectorAll('.proj-card');
  // inject sparkles layer once
  cards.forEach(c => { if (!c.querySelector('.sparkles')) { const s = document.createElement('i'); s.className = 'sparkles'; c.appendChild(s); } });
  // ripple on pointerdown
  function ripple(e){
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const span = document.createElement('span');
    span.className = 'ripple';
    const d = Math.max(r.width, r.height);
    span.style.width = span.style.height = d + 'px';
    span.style.left = (x - d/2) + 'px';
    span.style.top  = (y - d/2) + 'px';
    el.appendChild(span);
    setTimeout(()=> span.remove(), 600);
  }
  cards.forEach(c => c.addEventListener('pointerdown', ripple));
  // parallax image follow mouse
  function parallaxImg(e){
    const card = e.currentTarget;
    const img = card.querySelector('.thumb img');
    if (!img) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    img.style.transform = `scale(1.06) translate(${x*8}px, ${y*6}px)`;
  }
  function resetImg(e){
    const img = e.currentTarget.querySelector('.thumb img');
    if (img) img.style.transform = '';
  }
  projCards.forEach(c => {
    c.addEventListener('mousemove', parallaxImg, {passive: true});
    c.addEventListener('mouseleave', resetImg, {passive: true});
  });
  // magnetic service icon
  function magnet(e){
    const icon = e.currentTarget.querySelector('.svc-ico');
    if (!icon) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    icon.style.transform = `translate(${x*10}px, ${y*8}px)`;
  }
  function magnetOff(e){
    const icon = e.currentTarget.querySelector('.svc-ico');
    if (icon) icon.style.transform = '';
  }
  document.querySelectorAll('.svc-card').forEach(c => {
    c.addEventListener('mousemove', magnet, {passive: true});
    c.addEventListener('mouseleave', magnetOff, {passive: true});
  });
})();


// === Preloader ===
(function(){
  function done(){ document.body.classList.add('is-loaded'); }
  if (document.readyState === 'complete') { setTimeout(done, 200); }
  else { window.addEventListener('load', () => setTimeout(done, 200), {once:true}); }
})();

// === Smooth scroll for nav links ===
(function(){
  const header = document.querySelector('.site-header');
  const offset = () => (header ? header.getBoundingClientRect().height : 0) + 8;
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`) || document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// === Scrollspy (highlight nav link on section in view) ===
(function(){
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const map = new Map(links.map(a => [ (a.getAttribute('href')||'').slice(1), a ]));
  const sections = ['top','about','services','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach(l => l.classList.remove('active'));
      const a = map.get(id);
      if (a) a.classList.add('active');
    });
  }, { threshold: 0.6 });

  sections.forEach(s => io.observe(s));
})();


// === Scrollspy (highlight nav link based on section in view)
(function(){
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id) || document.querySelector(`[id="${id}"]`);
    if (sec) map.set(sec, a);
  });
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(ent => {
      const a = map.get(ent.target);
      if (!a) return;
      if (ent.isIntersecting) {
        links.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });
  map.forEach((_, sec)=> io.observe(sec));
  // click -> close mobile nav? optional
})();


// === Build Project Flip Cards (front image / back info + blurred img) ===
(function(){
  document.querySelectorAll('.proj-card').forEach(card => {
    if (card.querySelector('.card-3d')) return; // already built

    const thumb = card.querySelector('.thumb');
    const imgEl = thumb?.querySelector('img');
    const tags  = card.querySelector('.tags');
    const name  = card.querySelector('.name-project');

    const wrap = document.createElement('div');
    wrap.className = 'card-3d';

    // FRONT (image only)
    const front = document.createElement('div');
    front.className = 'face front';
    if (thumb) front.appendChild(thumb); // move thumb (ok)

    // BACK (clone title/tags to avoid breaking other logic)
    const back = document.createElement('div');
    back.className = 'face back';
    const bg = document.createElement('div'); bg.className = 'back__bg';
    if (imgEl) bg.style.backgroundImage = `url(${imgEl.src})`;
    const cover = document.createElement('div'); cover.className = 'back__cover';
    const body = document.createElement('div'); body.className = 'back__content';

    if (name){
      const nameCln = name.cloneNode(true);
      body.appendChild(nameCln);
    }
    if (tags){
      const tagsCln = tags.cloneNode(true);
      body.appendChild(tagsCln);
    }
    

    back.appendChild(bg); back.appendChild(cover); back.appendChild(body);

    // Assemble into card: keep original name/tags in DOM for other scripts (e.g., modal)
    wrap.appendChild(front);
    wrap.appendChild(back);
    card.appendChild(wrap);
  });
})();


// === Scrollspy Fallback: compute active on scroll (also on load/resize)
(function(){
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function setActiveByScroll(){
    const y = window.scrollY + window.innerHeight * 0.35; // pick a scanline at ~35% from top
    let active = sections[0];
    for (const sec of sections){
      const top = sec.offsetTop, bot = top + sec.offsetHeight;
      if (y >= top && y < bot){ active = sec; break; }
    }
    links.forEach(a => a.classList.remove('active'));
    const link = links.find(a => a.getAttribute('href') === '#' + active.id);
    if (link) link.classList.add('active');
  }
  window.addEventListener('scroll', setActiveByScroll, {passive:true});
  window.addEventListener('resize', setActiveByScroll, {passive:true});
  window.addEventListener('load', setActiveByScroll, {once:true});
  setActiveByScroll();
})();


// === Scrollspy Combo (IO + fallback + click highlight) ===
(function(){
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function setActive(id){
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  // Click highlight immediately
  links.forEach(a => a.addEventListener('click', () => {
    const id = a.getAttribute('href').slice(1);
    setActive(id);
  }));

  // IO observer
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(ent => {
      if (!ent.isIntersecting) return;
      const id = ent.target.id;
      if (id) setActive(id);
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });
  secs.forEach(sec => io.observe(sec));

  // Fallback on scroll
  function setActiveByScroll(){
    const y = window.scrollY + window.innerHeight * 0.35;
    let chosen = secs[0];
    for (const sec of secs){
      const top = sec.offsetTop, bot = top + sec.offsetHeight;
      if (y >= top && y < bot){ chosen = sec; break; }
    }
    if (chosen && chosen.id) setActive(chosen.id);
  }
  window.addEventListener('scroll', setActiveByScroll, {passive:true});
  window.addEventListener('resize', setActiveByScroll, {passive:true});
  window.addEventListener('load', setActiveByScroll, {once:true});
  setActiveByScroll();
})();
