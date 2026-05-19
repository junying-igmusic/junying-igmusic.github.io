/* ============================================================
   Legal Pages — shared script
   ============================================================ */

(() => {
  let currentLang = 'zh';

  const applyLang = (lang) => {
    currentLang = lang;

    document.querySelectorAll('[data-i18n-zh]').forEach((el) => {
      const val = lang === 'zh' ? el.dataset.i18nZh : el.dataset.i18nEn;
      if (val !== undefined) el.innerHTML = val;
    });

    // Bilingual long-form doc sections
    document.querySelectorAll('.doc-content').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    const pill = document.getElementById('lang-pill');
    if (pill) pill.textContent = lang === 'zh' ? 'EN' : '繁體';

    const titleZh = document.documentElement.dataset.titleZh;
    const titleEn = document.documentElement.dataset.titleEn;
    if (titleZh && titleEn) document.title = lang === 'zh' ? titleZh : titleEn;

    try { localStorage.setItem('ig_lang', lang); } catch(e) {}
  };

  const pill = document.getElementById('lang-pill');
  if (pill) pill.addEventListener('click', () => applyLang(currentLang === 'zh' ? 'en' : 'zh'));

  // Mobile hamburger
  const mobileNav  = document.getElementById('mobile-nav');
  const navMenuBtn = document.getElementById('nav-menu-btn');
  if (navMenuBtn && mobileNav) {
    navMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); mobileNav.classList.toggle('open'); });
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && e.target !== navMenuBtn) mobileNav.classList.remove('open');
    });
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // Navbar scroll deepening
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (navbar) navbar.style.background = window.scrollY > 8
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(255,255,255,0.72)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Restore saved language
  try {
    const saved = localStorage.getItem('ig_lang');
    if (saved && saved !== 'zh') applyLang(saved);
  } catch(e) {}

  // Accordion toggle
  document.querySelectorAll('.accordion__header').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accordion = btn.closest('.accordion');
      const isOpen = accordion.dataset.open === 'true';
      accordion.dataset.open = isOpen ? 'false' : 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
