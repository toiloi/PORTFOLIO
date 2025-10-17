// Lucide icons
lucide.createIcons();

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle with persistence
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const THEME_KEY = 'theme-preference';

function applyTheme(mode, opts={}) {
  const { persist=true } = opts;
  root.classList.toggle('dark', mode === 'dark');
  root.style.colorScheme = mode;
  if (persist) localStorage.setItem(THEME_KEY, mode);
  // Update button icon + state
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    themeBtn.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="${mode==='dark' ? 'sun' : 'moon'}"></i><span class="hidden sm:inline">Theme</span></span>`;
    lucide.createIcons();
  }
}

function getPref() {
  return localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

// Initialize without persisting (preflight already set class)
applyTheme(getPref(), { persist: false });

// Toggle with no-transition to avoid flicker
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.add('notransition');
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    setTimeout(() => root.classList.remove('notransition'), 150);
  });
}

// Search & role filter
const searchInput = document.getElementById('searchInput');
const roleChips = document.querySelectorAll('.role-chip');
const cards = Array.from(document.querySelectorAll('#members .card'));
let activeRole = 'all';

function applyFilter() {
  const q = (searchInput?.value || '').toLowerCase().trim();
  cards.forEach((card) => {
    const role = (card.getAttribute('data-role') || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    const matchText = q === '' || text.includes(q);
    const matchRole = activeRole === 'all' || role.includes(activeRole.toLowerCase());
    card.style.display = matchText && matchRole ? '' : 'none';
  });
}

if (searchInput) searchInput.addEventListener('input', applyFilter);
roleChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    roleChips.forEach(c => c.classList.remove('bg-slate-900','text-white','dark:bg-white','dark:text-slate-900'));
    chip.classList.add('bg-slate-900','text-white','dark:bg-white','dark:text-slate-900');
    activeRole = chip.dataset.role || 'all';
    applyFilter();
  })
});

// Mouse glow per-card
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    card.style.setProperty('--mx', x + '%');
  });
});

// Keyboard press feedback on CTA links
document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      el.classList.add('scale-95');
      setTimeout(() => el.classList.remove('scale-95'), 140);
    }
  });
});
