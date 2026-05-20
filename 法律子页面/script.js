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

  // ── Active nav state ────────────────────────────────────────
  (() => {
    const p = location.pathname;
    const isHome      = p === '/' || p === '/index.html';
    const isMaster    = p.startsWith('/masternotes');
    const isContact   = p.startsWith('/contact');
    const isLegal     = p.includes('法律子页面') || p.includes('%E6%B3%95%E5%BE%8B%E5%AD%90%E9%A1%B5%E9%9D%A2');
    const isSupport   = p.startsWith('/support');

    // Desktop: plain links
    document.querySelectorAll('.nav-links .nav-link').forEach(el => {
      if (el.tagName !== 'A') return;
      const h = el.getAttribute('href') || '';
      if (isHome && (h.includes('/?skip') || h === '/')) el.classList.add('is-active');
      if (isContact && h.includes('/contact')) el.classList.add('is-active');
    });
    // Desktop: dropdown triggers
    const triggers = document.querySelectorAll('.nav-dropdown-trigger');
    triggers.forEach(btn => {
      const sec = btn.dataset.navSection;
      if (isMaster && sec === 'products') {
        btn.classList.add('is-active');
        btn.closest('.nav-dropdown')?.classList.add('is-active');
      }
      if ((isLegal || isSupport) && sec === 'resources') {
        btn.classList.add('is-active');
        btn.closest('.nav-dropdown')?.classList.add('is-active');
      }
    });
    // Desktop: sub-items
    document.querySelectorAll('a.nav-dd-item').forEach(a => {
      const h = a.getAttribute('href') || '';
      if (isMaster  && h.includes('masternotes'))  a.classList.add('is-active');
      if (isLegal   && (h.includes('法律子页面') || h.includes('%E6%B3%95'))) a.classList.add('is-active');
      if (isSupport && h.includes('support'))      a.classList.add('is-active');
    });
    // Mobile: plain links
    document.querySelectorAll('.mobile-nav-link').forEach(el => {
      if (el.tagName !== 'A') return;
      const h = el.getAttribute('href') || '';
      if (isHome    && (h.includes('/?skip') || h === '/')) el.classList.add('is-active');
      if (isContact && h.includes('/contact'))               el.classList.add('is-active');
    });
    // Mobile: sub-links + auto-open parent
    document.querySelectorAll('a.mobile-nav-sub-link').forEach(a => {
      const h = a.getAttribute('href') || '';
      let hit = false;
      if (isMaster  && h.includes('masternotes'))  hit = true;
      if (isLegal   && (h.includes('法律子页面') || h.includes('%E6%B3%95'))) hit = true;
      if (isSupport && h.includes('support'))      hit = true;
      if (hit) {
        a.classList.add('is-active');
        const grp = a.closest('.mobile-nav-group');
        grp?.classList.add('is-open');
        grp?.classList.add('is-active');
        const sub = grp?.querySelector('.mobile-nav-sub');
        if (sub) sub.style.height = sub.scrollHeight + 'px';
      }
    });
  })();

  // ── Mobile nav accordion ────────────────────────────────────
  document.querySelectorAll('.mobile-nav-group-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const group = btn.closest('.mobile-nav-group');
      const sub = group.querySelector('.mobile-nav-sub');
      const opening = !group.classList.contains('is-open');
      group.classList.toggle('is-open');
      sub.style.height = opening ? sub.scrollHeight + 'px' : '0';
    });
  });
  // Also close mobile-nav sub-links should close the nav
  document.querySelectorAll('a.mobile-nav-sub-link').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('mobile-nav')?.classList.remove('open');
    });
  });
})();
