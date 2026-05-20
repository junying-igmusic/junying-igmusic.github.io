/* ============================================================
   聯繫我們 standalone page
   ============================================================ */

(() => {
  /* ----------------------------------------------------------
     Language toggle
     ---------------------------------------------------------- */
  let currentLang = 'zh';

  const i18n = {
    zh: {
      title: '聯繫我們 · 炎上音樂科技',
      'contact-topic-placeholder': '請選擇主題',
      'label-title-req': '標題 *',
      'label-title-opt': '標題',
      'label-message-req': '訊息 *',
      'label-message-opt': '訊息',
      'ph-name': '您的姓名',
      'ph-title': '請簡述您的查詢標題',
      'ph-message': '請輸入您的訊息內容…',
      'ph-trial': '跟我們說說你自己吧～介紹得越詳細，越容易取得試用名額哦',
      'fl-name': '姓名 *',
      'fl-name-opt': '姓名',
      'fl-email': '電子郵件 *',
      'fl-topic': '主題',
      'fl-product': '產品 *',
      'btn-submit': '發送訊息',
      'form-success': '已收到您的訊息，我們將盡快回覆。♪',
    },
    en: {
      title: 'Contact · Ignition Musictech',
      'contact-topic-placeholder': 'Select a topic',
      'label-title-req': 'Subject *',
      'label-title-opt': 'Subject',
      'label-message-req': 'Message *',
      'label-message-opt': 'Message',
      'ph-name': 'Your name',
      'ph-title': 'Brief subject of your inquiry',
      'ph-message': 'Your message…',
      'ph-trial': 'Tell us a bit about yourself — the more detail, the better your chances of getting beta access!',
      'fl-name': 'Name *',
      'fl-name-opt': 'Name',
      'fl-email': 'Email *',
      'fl-topic': 'Topic',
      'fl-product': 'Product *',
      'btn-submit': 'Send Message',
      'form-success': 'Message received — we\'ll be in touch soon. ♪',
    },
  };

  const applyLang = (lang) => {
    currentLang = lang;

    document.querySelectorAll('[data-i18n-zh]').forEach((el) => {
      const val = lang === 'zh' ? el.dataset.i18nZh : el.dataset.i18nEn;
      if (el.tagName === 'SPAN' && el.closest('.contact-headline')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    document.title = i18n[lang].title;
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    // Update select dropdown option labels
    document.querySelectorAll('.custom-select-option').forEach((o) => {
      const val = lang === 'zh' ? o.dataset.i18nZh : o.dataset.i18nEn;
      if (val) o.textContent = val;
    });

    // Update placeholder text if no topic selected
    const selectHidden = document.getElementById('contact-topic');
    if (selectHidden && !selectHidden.value) {
      const textEl = document.getElementById('contact-topic-text');
      if (textEl) textEl.textContent = i18n[lang]['contact-topic-placeholder'];
    }

    // Update input labels
    const flName = document.getElementById('fl-name');
    const flEmail = document.getElementById('fl-email');
    const flTopic = document.getElementById('fl-topic');
    if (flName) flName.textContent = i18n[lang]['fl-name'];
    if (flEmail) flEmail.textContent = i18n[lang]['fl-email'];
    if (flTopic) flTopic.textContent = i18n[lang]['fl-topic'];

    // Update input placeholders
    const inputName = document.getElementById('input-name');
    const inputTitle = document.getElementById('contact-title');
    const inputMessage = document.getElementById('contact-message');
    if (inputName) inputName.placeholder = i18n[lang]['ph-name'];
    if (inputTitle) inputTitle.placeholder = i18n[lang]['ph-title'];

    // Reapply topic mode to refresh placeholders + labels
    applyTopicMode(selectHidden ? selectHidden.value : '');

    // Product label
    const flProduct = document.getElementById('fl-product');
    if (flProduct) flProduct.textContent = i18n[lang]['fl-product'];

    // Product chip "Coming Soon" tag
    document.querySelectorAll('.product-chip-tag').forEach(tag => {
      tag.textContent = lang === 'zh' ? '即將推出' : 'Coming Soon';
    });

    // Submit button
    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit && !btnSubmit.disabled) btnSubmit.textContent = i18n[lang]['btn-submit'];

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
     Navbar scroll deepening
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const onScrollHeader = () => {
    if (navbar) navbar.style.background = window.scrollY > 8
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(255,255,255,0.72)';
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------------------------------------------------------
     Custom select
     ---------------------------------------------------------- */
  const selectWrap     = document.getElementById('contact-topic-wrap');
  const selectTrigger  = document.getElementById('contact-topic-trigger');
  const selectText     = document.getElementById('contact-topic-text');
  const selectHidden   = document.getElementById('contact-topic');

  if (selectTrigger) {
    selectTrigger.addEventListener('click', () => {
      selectWrap.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (selectWrap && !selectWrap.contains(e.target)) {
      selectWrap.classList.remove('open');
    }
  });

  const setTopic = (value, label) => {
    if (selectHidden) selectHidden.value = value;
    if (selectText) {
      selectText.textContent = label || i18n[currentLang]['contact-topic-placeholder'];
      selectText.classList.toggle('placeholder', !value);
    }
    document.querySelectorAll('.custom-select-option').forEach((o) => {
      o.classList.toggle('selected', o.dataset.value === value);
    });
    if (selectWrap) selectWrap.classList.remove('open');
    applyTopicMode(value);
  };

  document.querySelectorAll('.custom-select-option').forEach((option) => {
    option.addEventListener('click', () => {
      setTopic(option.dataset.value, option.textContent);
    });
  });

  // Product chip selection
  document.querySelectorAll('.product-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.product-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      const productInput = document.getElementById('contact-product');
      if (productInput) productInput.value = chip.dataset.value;
    });
  });

  /* ----------------------------------------------------------
     Trial mode: hides title / converts message to intro field
     ---------------------------------------------------------- */
  const nameInput    = document.getElementById('input-name');
  const titleInput   = document.getElementById('contact-title');
  const messageArea  = document.getElementById('contact-message');
  const labelTitle   = document.getElementById('label-title');
  const labelMessage = document.getElementById('label-message');

  function applyTopicMode(topic) {
    const t = i18n[currentLang];
    const nameOpt    = topic === 'feature' || topic === 'general' || topic === 'trial';
    const titleOpt   = topic === 'feature' || topic === 'general' || topic === 'trial';
    const messageOpt = topic === 'trial';
    if (nameInput)  nameInput.required  = !nameOpt;
    if (titleInput) titleInput.required = !titleOpt;
    if (messageArea) {
      messageArea.required    = !messageOpt;
      messageArea.placeholder = topic === 'trial' ? t['ph-trial'] : t['ph-message'];
    }
    const flName = document.getElementById('fl-name');
    if (flName) flName.textContent = nameOpt ? t['fl-name-opt'] : t['fl-name'];
    if (labelTitle)   labelTitle.textContent   = titleOpt   ? t['label-title-opt']   : t['label-title-req'];
    if (labelMessage) labelMessage.textContent = messageOpt ? t['label-message-opt'] : t['label-message-req'];

    // Product selector: only visible for trial topic
    const productGroup = document.getElementById('form-group-product');
    const productInput = document.getElementById('contact-product');
    if (productGroup) {
      if (topic === 'trial') {
        productGroup.classList.add('is-visible');
      } else {
        productGroup.classList.remove('is-visible');
        // Reset selection when hiding
        if (productInput) productInput.value = '';
        document.querySelectorAll('.product-chip').forEach(c => c.classList.remove('is-selected'));
      }
    }
  }

  /* ----------------------------------------------------------
     Form submission
     ---------------------------------------------------------- */
  const form    = document.querySelector('.contact-form');
  const success = document.getElementById('form-success');
  const btnSubmit = document.getElementById('btn-submit');

  function shakeInvalid() {
    const fields = [
      document.getElementById('input-name'),
      document.getElementById('input-email'),
      document.getElementById('contact-title'),
      document.getElementById('contact-message'),
    ];
    let invalid = false;
    fields.forEach(el => {
      if (el && el.required && !el.value.trim()) {
        invalid = true;
        el.classList.remove('field-shake');
        void el.offsetWidth;
        el.classList.add('field-shake');
        el.addEventListener('animationend', () => el.classList.remove('field-shake'), { once: true });
      }
    });
    // Validate product when topic is trial
    const topicVal = document.getElementById('contact-topic')?.value;
    if (topicVal === 'trial') {
      const productInput = document.getElementById('contact-product');
      if (!productInput || !productInput.value) {
        invalid = true;
        const chips = document.getElementById('product-chips');
        if (chips) {
          chips.classList.remove('field-shake');
          void chips.offsetWidth;
          chips.classList.add('field-shake');
          chips.addEventListener('animationend', () => chips.classList.remove('field-shake'), { once: true });
        }
      }
    }
    return invalid;
  }

  if (form && btnSubmit) {
    btnSubmit.addEventListener('click', async () => {
      if (shakeInvalid()) return;
      const nameVal    = nameInput ? nameInput.value.trim() : '';
      const emailVal   = document.getElementById('input-email').value.trim();
      const titleVal   = titleInput ? titleInput.value.trim() : '';
      const messageVal = messageArea ? messageArea.value.trim() : '';
      btnSubmit.disabled = true;
      btnSubmit.textContent = currentLang === 'zh' ? '發送中…' : 'Sending…';
      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: (selectHidden && selectHidden.value === 'business')
              ? '067991a0-63f0-4869-98dd-30f815926e5e'
              : '614529d3-920b-4df1-a9e7-40d8e639bcd6',
            name: nameVal, email: emailVal,
            topic: selectHidden ? selectHidden.value : '',
            product: document.getElementById('contact-product')?.value || '',
            subject: titleVal, message: messageVal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          btnSubmit.textContent = currentLang === 'zh' ? '已發送 ✓' : 'Sent ✓';
          if (success) {
            success.textContent = i18n[currentLang]['form-success'];
            success.hidden = false;
          }
        } else {
          btnSubmit.disabled = false;
          btnSubmit.textContent = i18n[currentLang]['btn-submit'];
        }
      } catch(e) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = i18n[currentLang]['btn-submit'];
      }
    });
  }

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

// ── Dynamic copyright year ──────────────────────────────────
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ── Footer accordion (mobile) ───────────────────────────────
document.querySelectorAll('.footer-col-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    const col = btn.closest('.footer-col');
    const links = col.querySelector('.footer-col-links');
    const isOpen = col.classList.contains('is-open');
    col.classList.toggle('is-open');
    links.style.height = isOpen ? '0' : links.scrollHeight + 'px';
  });
});
