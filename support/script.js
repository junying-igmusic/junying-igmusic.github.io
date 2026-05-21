/* ============================================================
   Support pages script — 炎上音樂科技
   Handles both index.html and masternotes.html
   ============================================================ */

(() => {
  /* ----------------------------------------------------------
     Detect page
     ---------------------------------------------------------- */
  const isFaqPage = !!document.getElementById('faqContent');

  /* ----------------------------------------------------------
     Language toggle
     ---------------------------------------------------------- */
  let currentLang = 'zh';

  const i18n = {
    zh: {
      /* index */
      'title-index': '支援 · 炎上音樂科技',
      'search-placeholder-index': '搜尋問題…',
      /* masternotes */
      'title-mn': 'Masternotes 支援 · 炎上音樂科技',
      'search-placeholder-mn': '搜尋 Masternotes 問題…',
      /* shared */
      'no-results': '找不到相關結果',
      'back': '← 返回結果',
    },
    en: {
      /* index */
      'title-index': 'Support · Ignition Musictech',
      'search-placeholder-index': 'Search for answers…',
      /* masternotes */
      'title-mn': 'Masternotes Support · Ignition Musictech',
      'search-placeholder-mn': 'Search Masternotes help…',
      /* shared */
      'no-results': 'No results found',
      'back': '← Back to results',
    },
  };

  const applyLang = (lang) => {
    currentLang = lang;

    /* Update all data-i18n-zh / data-i18n-en elements */
    document.querySelectorAll('[data-i18n-zh]').forEach((el) => {
      const val = lang === 'zh' ? el.dataset.i18nZh : el.dataset.i18nEn;
      if (val !== undefined) el.textContent = val;
    });

    /* Update page title */
    document.title = i18n[lang][isFaqPage ? 'title-mn' : 'title-index'];
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    /* Update search placeholders */
    document.querySelectorAll('[data-i18n-placeholder-zh]').forEach((el) => {
      el.placeholder = lang === 'zh'
        ? el.dataset.i18nPlaceholderZh
        : el.dataset.i18nPlaceholderEn;
    });

    /* Update lang pill label */
    const pill = document.getElementById('lang-pill');
    if (pill) pill.textContent = lang === 'zh' ? 'EN' : '繁體';

    /* Re-render FAQ if on FAQ page */
    if (isFaqPage) renderFaq(lang);

    /* Persist */
    try { localStorage.setItem('ig_lang', lang); } catch(e) {}
  };

  /* Bind lang pill */
  const pill = document.getElementById('lang-pill');
  if (pill) pill.addEventListener('click', () => applyLang(currentLang === 'zh' ? 'en' : 'zh'));

  /* Restore saved language */
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
     Mobile hamburger menu
     ---------------------------------------------------------- */
  const mobileNav  = document.getElementById('mobile-nav');
  const navMenuBtn = document.getElementById('nav-menu-btn');
  if (navMenuBtn && mobileNav) {
    navMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && e.target !== navMenuBtn)
        mobileNav.classList.remove('open');
    });
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(l =>
      l.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }

  /* ----------------------------------------------------------
     Active nav state IIFE
     ---------------------------------------------------------- */
  (() => {
    const p = location.pathname;
    const isHome    = p === '/' || p === '/index.html';
    const isMaster  = p.startsWith('/masternotes');
    const isContact = p.startsWith('/contact');
    const isLegal   = p.includes('legal') || p.includes('%E6%B3%95%E5%BE%8B%E5%AD%90%E9%A1%B5%E9%9D%A2');
    const isSupport = p.startsWith('/support') || p.includes('support页面') || p.includes('support%E9%A1%B5%E9%9D%A2');

    /* Desktop: plain links */
    document.querySelectorAll('.nav-links .nav-link').forEach(el => {
      if (el.tagName !== 'A') return;
      const h = el.getAttribute('href') || '';
      if (isHome && (h.includes('/?skip') || h === '/')) el.classList.add('is-active');
      if (isContact && h.includes('/contact')) el.classList.add('is-active');
    });

    /* Desktop: dropdown triggers */
    document.querySelectorAll('.nav-dropdown-trigger').forEach(btn => {
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

    /* Desktop: sub-items */
    document.querySelectorAll('a.nav-dd-item').forEach(a => {
      const h = a.getAttribute('href') || '';
      if (isMaster  && h.includes('masternotes'))  a.classList.add('is-active');
      if (isLegal   && (h.includes('legal') || h.includes('%E6%B3%95'))) a.classList.add('is-active');
      if (isSupport && h.includes('support'))      a.classList.add('is-active');
    });

    /* Mobile: plain links */
    document.querySelectorAll('.mobile-nav-link').forEach(el => {
      if (el.tagName !== 'A') return;
      const h = el.getAttribute('href') || '';
      if (isHome    && (h.includes('/?skip') || h === '/')) el.classList.add('is-active');
      if (isContact && h.includes('/contact'))               el.classList.add('is-active');
    });

    /* Mobile: sub-links + auto-open parent */
    document.querySelectorAll('a.mobile-nav-sub-link').forEach(a => {
      const h = a.getAttribute('href') || '';
      let hit = false;
      if (isMaster  && h.includes('masternotes'))  hit = true;
      if (isLegal   && (h.includes('legal') || h.includes('%E6%B3%95'))) hit = true;
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

  /* ----------------------------------------------------------
     Mobile nav accordion
     ---------------------------------------------------------- */
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

  document.querySelectorAll('a.mobile-nav-sub-link').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('mobile-nav')?.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     Dynamic copyright year
     ---------------------------------------------------------- */
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------
     Footer accordion (mobile)
     ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     FAQ rendering (masternotes page only) — two-level accordion
     ---------------------------------------------------------- */
  function renderFaq(lang) {
    const container = document.getElementById('faqContent');
    if (!container) return;

    /* Group by category, preserving order */
    const categoryOrder = ['general', 'subscription'];
    const groups = {};
    categoryOrder.forEach(cat => { groups[cat] = []; });

    faqData.forEach(item => {
      if (item.product !== 'masternotes') return;
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    container.innerHTML = '';

    categoryOrder.forEach(cat => {
      const items = groups[cat];
      if (!items || items.length === 0) return;

      /* ── Category wrapper ── */
      const catDiv = document.createElement('div');
      catDiv.className = 'faq-category';

      /* Category header (clickable) */
      const catHeader = document.createElement('button');
      catHeader.className = 'faq-category-header';
      catHeader.type = 'button';

      const catLabel = document.createElement('span');
      catLabel.className = 'faq-category-label';
      catLabel.textContent = lang === 'zh' ? items[0].categoryZh : items[0].categoryEn;
      catHeader.appendChild(catLabel);
      catHeader.insertAdjacentHTML('beforeend',
        '<svg class="faq-category-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">' +
        '<path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
      );

      /* Category body */
      const catBody = document.createElement('div');
      catBody.className = 'faq-category-body';
      catBody.style.height = '0'; /* starts collapsed */

      /* Category toggle logic */
      catHeader.addEventListener('click', () => {
        const isOpen = catDiv.classList.contains('is-open');
        if (isOpen) {
          catDiv.classList.remove('is-open');
          catBody.style.height = catBody.scrollHeight + 'px';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            catBody.style.height = '0';
          }));
        } else {
          catDiv.classList.add('is-open');
          catBody.style.height = '0';
          requestAnimationFrame(() => {
            catBody.style.height = catBody.scrollHeight + 'px';
            catBody.addEventListener('transitionend', () => {
              if (catDiv.classList.contains('is-open')) catBody.style.height = 'auto';
            }, { once: true });
          });
        }
      });

      /* ── FAQ items inside category body ── */
      items.forEach(faq => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.id = faq.id;

        const btn = document.createElement('button');
        btn.className = 'faq-question-btn';
        btn.type = 'button';

        const questionText = document.createElement('span');
        questionText.textContent = lang === 'zh' ? faq.questionZh : faq.questionEn;

        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'faq-toggle-icon';
        toggleIcon.textContent = '+';
        toggleIcon.setAttribute('aria-hidden', 'true');

        btn.appendChild(questionText);
        btn.appendChild(toggleIcon);

        const answer = document.createElement('div');
        answer.className = 'faq-answer';

        const answerInner = document.createElement('div');
        answerInner.className = 'faq-answer-inner';
        answerInner.textContent = lang === 'zh' ? faq.answerZh : faq.answerEn;
        answer.appendChild(answerInner);

        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          item.classList.toggle('is-open');
          if (isOpen) {
            answer.style.height = answer.scrollHeight + 'px';
            requestAnimationFrame(() => requestAnimationFrame(() => {
              answer.style.height = '0';
            }));
          } else {
            answer.style.height = answer.scrollHeight + 'px';
            answer.addEventListener('transitionend', () => {
              if (item.classList.contains('is-open')) answer.style.height = 'auto';
            }, { once: true });
          }
        });

        item.appendChild(btn);
        item.appendChild(answer);
        catBody.appendChild(item);
      });

      catDiv.appendChild(catHeader);
      catDiv.appendChild(catBody);
      container.appendChild(catDiv);
    });

    /* If there's a hash in the URL, open that item */
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains('faq-item')) {
        openFaqItem(target);
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    }
  }

  function openFaqItem(item) {
    if (!item || item.classList.contains('is-open')) return;
    item.classList.add('is-open');
    const answer = item.querySelector('.faq-answer');
    if (answer) {
      answer.style.height = answer.scrollHeight + 'px';
      answer.addEventListener('transitionend', () => {
        if (item.classList.contains('is-open')) answer.style.height = 'auto';
      }, { once: true });
    }
  }

  /* Initial render */
  if (isFaqPage) renderFaq(currentLang);

  /* ----------------------------------------------------------
     Search logic
     ---------------------------------------------------------- */
  const searchInput   = document.getElementById(isFaqPage ? 'faqSearch' : 'heroSearch');
  const resultsPanel  = document.getElementById('searchResults');

  if (!searchInput || !resultsPanel) return;

  /* Prevent input blur when clicking inside results panel */
  resultsPanel.addEventListener('mousedown', (e) => { e.preventDefault(); });

  /* Simplified → Traditional Chinese character map for search normalisation */
  const SIMP_TO_TRAD = {
    '订':'訂','阅':'閱','应':'應','装':'裝','语':'語','资':'資','对':'對',
    '账':'帳','隐':'隱','浏':'瀏','览':'覽','体':'體','欢':'歡','数':'數',
    '传':'傳','发':'發','关':'關','进':'進','阶':'階','费':'費','务':'務',
    '复':'複','还':'還','继':'繼','设':'設','备':'備','处':'處','详':'詳',
    '见':'見','历':'歷','当':'當','们':'們','来':'來','后':'後','于':'於',
    '页':'頁','间':'間','个':'個','这':'這','过':'過','为':'為','时':'時',
    '记':'記','问':'問','题':'題','购':'購','买':'買','试':'試','联':'聯',
    '总':'總','级':'級','专':'專','业':'業','种':'種','乐':'樂','话':'話',
    '说':'說','览':'覽','择':'擇','规':'規','则':'則','带':'帶','该':'該',
    '终':'終','结':'結','给':'給','请':'請','须':'須','样':'樣','转':'轉',
    '删':'刪','选':'選','删':'刪','点':'點','动':'動','长':'長','边':'邊',
    '针':'針','钱':'錢','储':'儲','联':'聯','联系':'聯繫',
  };

  function normQuery(str) {
    return str.split('').map(c => SIMP_TO_TRAD[c] || c).join('');
  }

  /* Filter dataset: on masternotes page only masternotes items; on index all */
  function getSearchPool() {
    return isFaqPage
      ? faqData.filter(f => f.product === 'masternotes')
      : faqData;
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      resultsPanel.hidden = true;
      return;
    }

    /* Also try with Simplified→Traditional conversion so both inputs match */
    const qTrad = normQuery(q);

    const pool = getSearchPool();
    const matches = pool.filter(faq => {
      const texts = [
        faq.questionZh.toLowerCase(),
        faq.questionEn.toLowerCase(),
        faq.answerZh.toLowerCase(),
        faq.answerEn.toLowerCase(),
      ];
      return texts.some(t => t.includes(q) || (qTrad !== q && t.includes(qTrad)));
    });

    resultsPanel.innerHTML = '';

    if (matches.length === 0) {
      const noRes = document.createElement('div');
      noRes.className = 'search-no-results';
      noRes.textContent = i18n[currentLang]['no-results'];
      resultsPanel.appendChild(noRes);
    } else {
      matches.forEach(faq => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        const qText = document.createElement('span');
        qText.className = 'search-result-question';
        qText.textContent = currentLang === 'zh' ? faq.questionZh : faq.questionEn;

        const catBadge = document.createElement('span');
        catBadge.className = 'search-result-cat';
        catBadge.textContent = currentLang === 'zh' ? faq.categoryZh : faq.categoryEn;

        item.appendChild(qText);
        item.appendChild(catBadge);

        const handleClick = () => {
          if (isFaqPage) {
            /* Scroll to item on same page */
            resultsPanel.hidden = true;
            searchInput.value = '';
            const target = document.getElementById(faq.id);
            if (target) {
              openFaqItem(target);
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }
          } else {
            /* Show answer inline in results panel */
            resultsPanel.innerHTML = '';

            const backBtn = document.createElement('button');
            backBtn.className = 'search-back-btn';
            backBtn.textContent = i18n[currentLang]['back'];
            backBtn.addEventListener('click', () => {
              performSearch(searchInput.value);
            });

            const answerView = document.createElement('div');
            answerView.className = 'search-answer-view';

            const questionEl = document.createElement('p');
            questionEl.className = 'search-answer-question';
            questionEl.textContent = currentLang === 'zh' ? faq.questionZh : faq.questionEn;

            const answerEl = document.createElement('p');
            answerEl.className = 'search-answer-text';
            answerEl.textContent = currentLang === 'zh' ? faq.answerZh : faq.answerEn;

            answerView.appendChild(questionEl);
            answerView.appendChild(answerEl);
            resultsPanel.appendChild(backBtn);
            resultsPanel.appendChild(answerView);
            resultsPanel.hidden = false;
          }
        };

        item.addEventListener('click', handleClick);
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); });

        resultsPanel.appendChild(item);
      });
    }

    resultsPanel.hidden = false;
  }

  searchInput.addEventListener('input', () => {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => { resultsPanel.hidden = true; }, 150);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      resultsPanel.hidden = false;
    }
  });

  /* Search button click just focuses input */
  const searchBtn = document.getElementById(isFaqPage ? 'faqSearchBtn' : 'heroSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchInput.focus();
      performSearch(searchInput.value);
    });
  }

})();
