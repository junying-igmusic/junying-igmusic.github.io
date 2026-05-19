/* ============================================================
   Masternotes · 大師說
   ============================================================ */

(() => {
  /* ----------------------------------------------------------
     Language toggle  (zh = 繁中, en = English)
     ---------------------------------------------------------- */
  let currentLang = 'zh';

  const i18n = {
    zh: {
      'lang-btn':        'EN',
      'waitlist-cta':    '加入等待名單',
      'waitlist-submit': '通知我',
      'waitlist-success':'已收到，敬請期待 ♪',
      'more-link':       '了解更多 →',
      'join-waitlist':   '加入等待名單',
    },
    en: {
      'lang-btn':        '繁中',
      'waitlist-cta':    'Join Waitlist',
      'waitlist-submit': 'Notify Me',
      'waitlist-success':'Got it — stay tuned ♪',
      'more-link':       'Learn more →',
      'join-waitlist':   'Join Waitlist',
    },
  };

  const applyLang = (lang) => {
    currentLang = lang;

    // Swap every element carrying data-i18n-zh / data-i18n-en
    document.querySelectorAll('[data-i18n-zh]').forEach((el) => {
      el.textContent = lang === 'zh'
        ? el.dataset.i18nZh
        : el.dataset.i18nEn;
    });

    // page <title>
    document.title = lang === 'zh'
      ? '大師說 · Masternotes'
      : 'Masternotes · Classical Music AI';

    // <html lang>
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    // Update pill to show the OTHER language
    const pill = document.getElementById('lang-pill');
    if (pill) pill.textContent = lang === 'zh' ? 'EN' : '繁體';

    // Persist choice
    try { localStorage.setItem('ig_lang', lang); } catch(e) {}
  };

  const pill = document.getElementById('lang-pill');
  if (pill) pill.addEventListener('click', () => applyLang(currentLang === 'zh' ? 'en' : 'zh'));

  // Mobile hamburger menu
  const mobileNav  = document.getElementById('mobile-nav');
  const navMenuBtn = document.getElementById('nav-menu-btn');
  if (navMenuBtn && mobileNav) {
    navMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); mobileNav.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!mobileNav.contains(e.target) && e.target !== navMenuBtn) mobileNav.classList.remove('open'); });
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // Restore saved language on load
  try {
    const saved = localStorage.getItem('ig_lang');
    if (saved && saved !== 'zh') applyLang(saved);
  } catch(e) {}

  /* ----------------------------------------------------------
     Sticky iPhone — calculate exact top so there's no jump
     The iPhone's natural starting position == its sticky position
     ---------------------------------------------------------- */
  const stageInner = document.querySelector('.stage__inner');
  const stage      = document.querySelector('.stage');

  const calibrateStickyTop = () => {
    if (!stageInner || !stage) return;
    if (window.matchMedia('(max-width: 960px)').matches) return;

    // Measure where the stage column naturally begins in the viewport
    // (at scroll = 0, this is the column's distance from viewport top)
    const savedScroll = window.scrollY;
    window.scrollTo({ top: 0, behavior: 'instant' });

    const naturalTop = stage.getBoundingClientRect().top;

    window.scrollTo({ top: savedScroll, behavior: 'instant' });

    // Center the iPhone within the remaining viewport height below naturalTop
    const iPhoneH   = stageInner.querySelector('.iphone')?.offsetHeight || 620;
    const available = window.innerHeight - naturalTop;
    const centeredTop = naturalTop + Math.max(0, (available - iPhoneH) / 2);

    document.documentElement.style.setProperty(
      '--sticky-top', `${Math.round(centeredTop)}px`
    );
  };

  // Run after layout is ready, and again on resize
  requestAnimationFrame(() => {
    calibrateStickyTop();
    window.addEventListener('resize', calibrateStickyTop, { passive: true });
  });

  /* ----------------------------------------------------------
     Navbar — deepen background after any scroll
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const onScrollHeader = () => {
    if (navbar) navbar.style.background = window.scrollY > 8
      ? 'rgba(255, 255, 255, 0.92)'
      : 'rgba(255, 255, 255, 0.72)';
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------------------------------------------------------
     Desktop: scroll-driven iPhone screen switching

     Strategy: on every scroll tick, find which .feature is
     closest to the vertical centre of the viewport and show
     the matching screen.
     ---------------------------------------------------------- */
  const features = Array.from(document.querySelectorAll('.feature[data-screen]'));
  const desktopScreens = Array.from(
    document.querySelectorAll('#iphoneDesktop .screen')
  );

  let activeScreenNum = 1;

  const setActiveScreen = (n) => {
    if (n === activeScreenNum) return;
    activeScreenNum = n;
    desktopScreens.forEach((s) => {
      const isActive = Number(s.dataset.screen) === n;
      s.classList.toggle('is-active', isActive);
      const v = s.querySelector('video');
      if (v) {
        if (isActive) v.play().catch(() => {});
        else { v.pause(); v.currentTime = 0; }
      }
    });
  };

  // Switch screen based on which feature is closest to the viewport centre
  const updateScreenOnScroll = () => {
    if (!desktopScreens.length || !features.length) return;

    const mid = window.innerHeight / 2;
    let best = features[0];
    let bestDist = Infinity;

    features.forEach((f) => {
      const rect = f.getBoundingClientRect();
      const featureMid = rect.top + rect.height / 2;
      const dist = Math.abs(featureMid - mid);
      if (dist < bestDist) { bestDist = dist; best = f; }
    });

    setActiveScreen(Number(best.dataset.screen));
  };

  window.addEventListener('scroll', updateScreenOnScroll, { passive: true });
  updateScreenOnScroll();

  /* ----------------------------------------------------------
     Mobile: build horizontal "peek" carousel
     ---------------------------------------------------------- */
  const mobileCarousel = document.getElementById('mobileCarousel');

  const buildMobileCarousel = () => {
    if (!mobileCarousel || mobileCarousel.dataset.built) return;
    mobileCarousel.dataset.built = 'true';

    const track = document.createElement('div');
    track.className = 'mobile-carousel__track';

    desktopScreens.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'mobile-carousel__slide';
      if (idx === 0) slide.classList.add('is-active');

      const phone = document.createElement('div');
      phone.className = 'mobile-carousel__iphone';

      const notch = document.createElement('div');
      notch.className = 'iphone__notch';
      phone.appendChild(notch);

      const wrap = document.createElement('div');
      wrap.className = 'mobile-carousel__screen';

      const media = src.querySelector('img, video');
      if (media) {
        const clone = media.cloneNode(true);
        if (clone.tagName === 'VIDEO') {
          clone.autoplay = true;
          clone.loop = true;
          clone.muted = true;
          clone.playsInline = true;
        }
        wrap.appendChild(clone);
      }

      phone.appendChild(wrap);
      slide.appendChild(phone);
      track.appendChild(slide);
    });

    // Arrow buttons
    const prev = document.createElement('button');
    prev.className = 'mobile-carousel__btn mobile-carousel__btn--prev';
    prev.setAttribute('aria-label', 'Previous');
    prev.textContent = '‹';

    const next = document.createElement('button');
    next.className = 'mobile-carousel__btn mobile-carousel__btn--next';
    next.setAttribute('aria-label', 'Next');
    next.textContent = '›';

    mobileCarousel.appendChild(track);
    mobileCarousel.appendChild(prev);
    mobileCarousel.appendChild(next);

    const slides = () => track.querySelectorAll('.mobile-carousel__slide');

    const getActiveIdx = () => {
      const cx = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      slides().forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - cx);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    };

    const scrollTo = (idx) => {
      const all = slides();
      if (all[idx]) {
        all[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };

    prev.addEventListener('click', () => scrollTo(Math.max(0, getActiveIdx() - 1)));
    next.addEventListener('click', () => {
      scrollTo(Math.min(slides().length - 1, getActiveIdx() + 1));
    });

    let t;
    track.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const idx = getActiveIdx();
        slides().forEach((s, i) => s.classList.toggle('is-active', i === idx));
      }, 80);
    }, { passive: true });

    // Scroll first slide into view
    requestAnimationFrame(() => scrollTo(0));
  };

  const mq = window.matchMedia('(max-width: 960px)');
  const onMqChange = () => { if (mq.matches) buildMobileCarousel(); };
  mq.addEventListener ? mq.addEventListener('change', onMqChange) : mq.addListener(onMqChange);
  onMqChange();

  /* ----------------------------------------------------------
     Waitlist form
     ---------------------------------------------------------- */
  const form    = document.getElementById('waitlistForm');
  const success = document.getElementById('waitlistSuccess');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.focus();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = currentLang === 'zh' ? '送出中…' : 'Sending…'; }
      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: '614529d3-920b-4df1-a9e7-40d8e639bcd6',
            email,
            subject: 'Masternotes Waitlist',
          }),
        });
        const data = await res.json();
        if (data.success) {
          form.hidden = true;
          if (success) {
            success.hidden = false;
            success.textContent = i18n[currentLang]['waitlist-success'];
          }
        } else {
          if (btn) { btn.disabled = false; btn.textContent = i18n[currentLang]['waitlist-submit']; }
        }
      } catch(e) {
        if (btn) { btn.disabled = false; btn.textContent = i18n[currentLang]['waitlist-submit']; }
      }
    });
  }
})();
