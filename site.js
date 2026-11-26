(() => {
  'use strict';
  const products = window.BB_PRODUCTS;
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  let language = read('bb-language', 'en') === 'zh' ? 'zh' : 'en';
  const storedSaved = read('bb-saved', []);
  let saved = new Set((Array.isArray(storedSaved) ? storedSaved : []).filter(id => products.some(p => p.id === id)));
  let filter = 'all';
  let toastTimer;
  const icons = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg>'
  };
  const copy = {
    en: {
      notice: 'HOME ESSENTIALS & EVERYDAY ACCESSORIES', collection: 'Collection', story: 'Our story', care: 'Care & information', language: 'Switch to Chinese', menu: 'Open navigation', close: 'Close', saved: 'Your favorites', home: 'Home essentials', women: 'Personal accessories', all: 'All products', items: 'products', details: 'Explore details', save: 'Save to favorites', remove: 'Remove from favorites', savedButton: 'Saved to favorites', added: 'Added to your favorites', removed: 'Removed from your favorites', downloaded: 'Favorites list downloaded', storageWarning: 'Saved for this visit only; browser storage is unavailable.',
      heroEyebrow: 'HOME, WITH A PERSONAL TOUCH', heroCopy: 'A little order. A little beauty.<br>Everyday essentials, beautifully together.', explore: 'Explore the collection', lineOne: 'For your home.', lineTwo: 'For your everyday.', collectionEyebrow: 'THE BEAUTY OF USEFUL THINGS', collectionTitle: 'Meet your everyday favorites.', collectionCopy: 'Home essentials and personal little luxuries.<br>One considered collection.', storyEyebrow: 'THE BEAUTY BAZAAR POINT OF VIEW', storyTitle: 'Life happens in<br>the little things.', storyCopy: "A calmer shelf. A favorite hair tie. A bag that keeps the small things together. Beauty Bazaar brings home essentials and women's accessories into one thoughtful everyday collection.", discoverWomen: 'Discover personal accessories', momentsEyebrow: 'TWO SIDES OF YOUR DAY', momentsTitle: 'At home. On the go.', momentHomeTitle: 'A place for the little things.', momentWomenTitle: 'Your daily finishing touches.', browseHome: 'Browse home essentials', browseWomen: 'Browse personal accessories', careEyebrow: 'A LITTLE EXTRA CARE', careTitle: 'Good habits.<br>Everyday care.',
      tagline: 'A little beauty in the everyday.', footerNote: 'Collection concepts shown with AI-generated imagery. Final products, materials, sizes and availability are subject to confirmation. This website is a brand showcase, not an online store.', copyright: 'Beauty Bazaar. Brand collection showcase.', emptyTitle: 'A little space for your favorites.', emptyCopy: 'Save a few things you love as you explore the collection.', continue: 'Explore the collection', download: 'Download list', clear: 'Clear list', savedNote: 'Favorites are stored in this browser only. This list is not an order or a reservation.', preview: 'Collection preview', design: 'Design details', color: 'Color palette', form: 'Design', occasion: 'Suggested setting', productCode: 'Reference', careProduct: 'Care & use', note: 'AI-generated design preview. Final materials, sizes, pricing and availability have not been confirmed.', related: 'A few more favorites.', relatedEyebrow: 'MADE FOR YOUR EVERYDAY', back: 'Collection', questionOne: 'How do I care for these everyday pieces?', answerOne: 'Always follow the instructions supplied with the actual product. Let cleaned items dry before storing them, and use separate cloths for different household areas.', questionTwo: 'Can I purchase products on this website?', answerTwo: 'This website introduces the brand collection. Checkout, live stock and direct ordering are not available. Saving a favorite does not create an order.', questionThree: 'What do the collection previews show?', answerThree: 'The collection and brand imagery are AI-generated design concepts. Product specifications, prices, certifications and sales channels are not represented as verified facts.',
      altHero: "Beauty Bazaar home and women's accessories on a sunlit vanity", altBag: 'Beauty Bazaar signature green zip pouch', altHome: 'White branded home storage boxes', altCase: 'Beauty Bazaar burgundy jewelry case', notFound: 'Product not found'
    },
    zh: {
      notice: '家居日用与女性日常配件', collection: '产品系列', story: '品牌故事', care: '护理与说明', language: '切换至英文', menu: '打开导航', close: '关闭', saved: '我的收藏', home: '家居日用', women: '女性配件', all: '全部产品', items: '款产品', details: '查看详情', save: '加入收藏', remove: '取消收藏', savedButton: '已加入收藏', added: '已加入我的收藏', removed: '已取消收藏', downloaded: '收藏清单已下载', storageWarning: '浏览器存储不可用，仅在本次访问中保留。',
      heroEyebrow: '为家，也为每一个日常', heroCopy: '一点秩序，一点美好。<br>让实用好物，融入每天的生活。', explore: '探索产品系列', lineOne: '为你的家。', lineTwo: '为你的每一天。', collectionEyebrow: '实用之中，发现美好', collectionTitle: '遇见日常里的心头好。', collectionCopy: '从家居整理，到随身小物。<br>让每一天，都有喜欢的细节。', storyEyebrow: 'BEAUTY BAZAAR 的生活主张', storyTitle: '生活的美好，<br>藏在小事里。', storyCopy: '整洁一点的置物架，喜欢的一只发圈，把零碎小物装好的收纳包。Beauty Bazaar 将家居日用与女性配件带入同一个日常系列，让普通的生活细节多一份用心。', discoverWomen: '发现女性日常配件', momentsEyebrow: '日常的两种模样', momentsTitle: '居家自在，出行从容。', momentHomeTitle: '让小物，各有所属。', momentWomenTitle: '为日常，添一点喜欢。', browseHome: '浏览家居日用', browseWomen: '浏览女性配件', careEyebrow: '多一点用心', careTitle: '照顾好物，<br>也照顾日常。',
      tagline: '日常之中，自有美好。', footerNote: '本站展示的系列为设计概念，图片由 AI 生成。实际产品、材质、尺寸及供货情况需另行确认。本站为品牌展示网站，不提供在线交易。', copyright: 'Beauty Bazaar 品牌系列展示。', emptyTitle: '留一点空间，给喜欢的好物。', emptyCopy: '浏览产品系列，将喜欢的产品保存到这里。', continue: '探索产品系列', download: '下载清单', clear: '清空收藏', savedNote: '收藏仅保存在当前浏览器中，不代表下单、预订或库存承诺。', preview: '系列设计预览', design: '设计细节', color: '配色', form: '设计形式', occasion: '适用场景灵感', productCode: '参考编号', careProduct: '护理与使用', note: '本图为 AI 生成的设计预览，实物材质、尺寸、价格及供货情况尚未确认。', related: '还有这些日常好物。', relatedEyebrow: '为日常而来', back: '产品系列', questionOne: '如何护理这些日常用品？', answerOne: '请始终以实物附带的使用与护理说明为准。清洁后充分晾干再收纳，不同区域使用的清洁巾应分开使用。', questionTwo: '可以在这个网站直接购买吗？', answerTwo: '本站用于介绍品牌系列，不提供支付、实时库存或直接下单。加入收藏不会创建订单。', questionThree: '系列预览中的信息代表什么？', answerThree: '本站系列及品牌图片为 AI 生成的设计概念，不将产品参数、价格、认证或销售渠道描述为已经核实的事实。',
      altHero: 'Beauty Bazaar 家居与女性配件陈列于阳光下的梳妆台', altBag: 'Beauty Bazaar 墨绿品牌收纳包', altHome: '带品牌标识的白色家居收纳盒', altCase: 'Beauty Bazaar 酒红色首饰盒', notFound: '未找到该产品'
    }
  };
  const t = key => copy[language][key] || key;
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const dialog = document.getElementById('saved-dialog');
  const isProduct = Boolean(document.body.dataset.product);
  const homeLink = isProduct ? 'index.html' : '';
  function renderHeader() {
    const nav = `<a href="${homeLink}#collection">${t('collection')}</a><a href="${homeLink}#story">${t('story')}</a><a href="${homeLink}#care">${t('care')}</a>`;
    header.innerHTML = `<div class="notice">${t('notice')}</div><header class="site-header"><div class="header-row wrap"><a class="brand" href="index.html" aria-label="Beauty Bazaar"><img src="assets/logo.png" width="2172" height="724" alt="Beauty Bazaar"></a><nav class="desktop-nav" aria-label="${language === 'zh' ? '主导航' : 'Main navigation'}">${nav}</nav><div class="header-tools"><button class="language-button" data-language aria-label="${t('language')}">${language === 'en' ? '中文' : 'EN'}</button><button class="icon-button" data-open-saved title="${t('saved')}" aria-label="${t('saved')} (${saved.size})">${icons.heart}<span class="saved-count" ${saved.size ? '' : 'hidden'}>${saved.size}</span></button><button class="icon-button menu-toggle" data-menu title="${t('menu')}" aria-label="${t('menu')}" aria-expanded="false" aria-controls="mobile-nav">${icons.menu}</button></div></div><nav id="mobile-nav" class="mobile-nav" aria-label="${language === 'zh' ? '移动端导航' : 'Mobile navigation'}" hidden>${nav}</nav></header>`;
  }
  function renderFooter() {
    footer.innerHTML = `<footer class="site-footer wrap"><div class="footer-main"><div class="footer-brand"><a href="index.html"><img src="assets/logo.png" width="2172" height="724" alt="Beauty Bazaar" loading="lazy"></a><p>${t('tagline')}</p></div><nav class="footer-links" aria-label="${language === 'zh' ? '页脚导航' : 'Footer navigation'}"><a href="${homeLink}#collection">${t('collection')}</a><a href="${homeLink}#story">${t('story')}</a><a href="${homeLink}#care">${t('care')}</a></nav></div><div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} ${t('copyright')}</p><p>${t('footerNote')}</p></div></footer>`;
  }
  function saveButton(p) {
    const active = saved.has(p.id);
    return `<button class="save-button" data-save="${p.id}" aria-pressed="${active}" title="${active ? t('remove') : t('save')}" aria-label="${active ? t('remove') : t('save')}: ${p[language].name}">${icons.heart}</button>`;
  }
  function card(p) {
    const d = p[language];
    return `<article class="product-card"><a class="product-image" href="${p.page}"><img src="assets/${p.image}" width="1254" height="1254" alt="${d.name} - Beauty Bazaar" loading="lazy"></a>${saveButton(p)}<div class="product-info"><p class="kind">${d.type}</p><h3><a href="${p.page}">${d.name}</a></h3><p>${d.subtitle}</p><a class="text-link" href="${p.page}">${t('details')}</a></div></article>`;
  }
  function renderGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    document.getElementById('filters').innerHTML = ['all', 'home', 'women'].map(key => `<button class="filter" data-filter="${key}" aria-pressed="${filter === key}">${t(key)}</button>`).join('');
    const visible = products.filter(p => filter === 'all' || p.category === filter);
    grid.innerHTML = visible.map(card).join('');
    document.getElementById('results-count').textContent = `${visible.length} ${t('items')}`;
  }
  function renderProduct() {
    if (!isProduct) return;
    const p = products.find(p => p.id === document.body.dataset.product);
    const main = document.getElementById('main');
    if (!p) { main.innerHTML = `<div class="wrap section"><h1>${t('notFound')}</h1><a href="index.html">${t('back')}</a></div>`; return; }
    const d = p[language];
    document.title = `${d.name} | Beauty Bazaar`;
    main.innerHTML = `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Beauty Bazaar</a><span>/</span><a href="index.html#collection">${t('back')}</a><span>/</span><span aria-current="page">${d.name}</span></nav><section class="product-detail"><div class="detail-image"><img src="assets/${p.image}" width="1254" height="1254" alt="${d.name} - Beauty Bazaar" fetchpriority="high"></div><div class="detail-copy"><span class="preview-label">${t('preview')}</span><p class="eyebrow">${d.type}</p><h1>${d.name}</h1><p class="subtitle">${d.subtitle}</p><p class="description">${d.description}</p><ul class="detail-features">${d.features.map(f => `<li>${f}</li>`).join('')}</ul><button class="button primary" data-save-detail="${p.id}" aria-pressed="${saved.has(p.id)}">${saved.has(p.id) ? t('savedButton') : t('save')}</button><p class="detail-note">${t('note')}</p></div></section><section class="specs-layout"><div><h2>${t('design')}</h2><dl class="spec-list"><div><dt>${t('productCode')}</dt><dd>${p.code}</dd></div><div><dt>${t('color')}</dt><dd>${d.color}</dd></div><div><dt>${t('form')}</dt><dd>${d.design}</dd></div><div><dt>${t('occasion')}</dt><dd>${d.occasion}</dd></div></dl></div><div><h2>${t('careProduct')}</h2><p>${d.care}</p><a class="text-link" href="index.html#care">${t('care')}</a></div></section><section class="section"><div class="section-heading"><div><p class="eyebrow">${t('relatedEyebrow')}</p><h2>${t('related')}</h2></div></div><div class="product-grid">${products.filter(x => x.id !== p.id).sort((a,b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0,3).map(card).join('')}</div></section></div>`;
  }
  function renderDialog() {
    const list = products.filter(p => saved.has(p.id));
    dialog.innerHTML = `<div class="dialog-head"><h2 id="saved-title">${t('saved')}</h2><button class="icon-button" data-close-saved aria-label="${t('close')}" title="${t('close')}">${icons.close}</button></div>${list.length ? `<div class="saved-list">${list.map(p => `<div class="saved-item"><a href="${p.page}"><img src="assets/${p.image}" width="74" height="74" alt="${p[language].name}"></a><div><h3><a href="${p.page}">${p[language].name}</a></h3><p>${p.code}</p></div><button class="icon-button" data-remove="${p.id}" title="${t('remove')}" aria-label="${t('remove')}: ${p[language].name}">${icons.close}</button></div>`).join('')}</div><div class="dialog-foot"><button class="button primary" data-download>${icons.download}${t('download')}</button><button class="button secondary" data-clear>${t('clear')}</button></div>` : `<div class="empty-state"><h3>${t('emptyTitle')}</h3><p>${t('emptyCopy')}</p><a class="button primary" href="${homeLink}#collection" data-close-saved>${t('continue')}</a></div>`}<p class="saved-disclaimer">${t('savedNote')}</p>`;
  }
  function render() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    const questions = document.getElementById('care-questions');
    if (questions) questions.innerHTML = ['One', 'Two', 'Three'].map(s => `<details><summary>${t('question' + s)}</summary><p>${t('answer' + s)}</p></details>`).join('');
    const altKeys = [['.hero-photo','altHero'], ['.story-image img','altBag'], ['.moment:first-child img','altHome'], ['.moment:last-child img','altCase']];
    altKeys.forEach(([selector, key]) => { const el = document.querySelector(selector); if(el) el.alt = t(key); });
    renderHeader(); renderFooter(); renderGrid(); renderProduct(); renderDialog();
  }
  function toast(message) {
    const box = document.getElementById('toast');
    box.textContent = message; box.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('show'), 2800);
  }
  function persistSaved() { return write('bb-saved', [...saved]); }
  function updateSaveUI() {
    document.querySelectorAll('[data-save]').forEach(button => {
      const active = saved.has(button.dataset.save);
      const p = products.find(p => p.id === button.dataset.save);
      button.setAttribute('aria-pressed', String(active));
      button.title = active ? t('remove') : t('save');
      button.setAttribute('aria-label', `${button.title}: ${p[language].name}`);
    });
    const detailButton = document.querySelector('[data-save-detail]');
    if (detailButton) { const active = saved.has(detailButton.dataset.saveDetail); detailButton.textContent = active ? t('savedButton') : t('save'); detailButton.setAttribute('aria-pressed', String(active)); }
    const count = document.querySelector('.saved-count');
    count.textContent = saved.size; count.hidden = !saved.size;
    document.querySelector('[data-open-saved]').setAttribute('aria-label', `${t('saved')} (${saved.size})`);
    renderDialog();
  }
  function toggleSave(id) {
    if (!products.some(p => p.id === id)) return;
    const had = saved.has(id);
    if (had) saved.delete(id); else saved.add(id);
    const persisted = persistSaved(); updateSaveUI();
    toast(persisted ? t(had ? 'removed' : 'added') : t('storageWarning'));
  }
  function download() {
    const lines = ['Beauty Bazaar', t('saved'), '', ...products.filter(p => saved.has(p.id)).map(p => `${p.code} | ${p[language].name}\n${new URL(p.page, location.href).href}`), '', t('savedNote'), t('footerNote')];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\r\n')], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'beauty-bazaar-favorites.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast(t('downloaded'));
  }
  document.addEventListener('click', event => {
    const languageButton = event.target.closest('[data-language]');
    if (languageButton) { language = language === 'en' ? 'zh' : 'en'; write('bb-language', language); render(); document.querySelector('[data-language]').focus(); return; }
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) { filter = filterButton.dataset.filter; renderGrid(); document.querySelector(`[data-filter="${filter}"]`).focus(); return; }
    const filterLink = event.target.closest('[data-filter-link]');
    if (filterLink) { filter = filterLink.dataset.filterLink; renderGrid(); }
    const menu = event.target.closest('[data-menu]');
    if (menu) { const nav = document.getElementById('mobile-nav'); nav.hidden = !nav.hidden; menu.setAttribute('aria-expanded', String(!nav.hidden)); menu.setAttribute('aria-label', t(nav.hidden ? 'menu' : 'close')); return; }
    if (event.target.closest('.mobile-nav a')) { document.getElementById('mobile-nav').hidden = true; document.querySelector('[data-menu]').setAttribute('aria-expanded', 'false'); }
    if (event.target.closest('[data-open-saved]')) { renderDialog(); dialog.showModal(); return; }
    if (event.target.closest('[data-close-saved]')) { dialog.close(); return; }
    const save = event.target.closest('[data-save], [data-save-detail]');
    if (save) { toggleSave(save.dataset.save || save.dataset.saveDetail); return; }
    const remove = event.target.closest('[data-remove]');
    if (remove) { saved.delete(remove.dataset.remove); persistSaved(); updateSaveUI(); dialog.querySelector('[data-close-saved]').focus(); return; }
    if (event.target.closest('[data-clear]')) { saved.clear(); persistSaved(); updateSaveUI(); dialog.querySelector('[data-close-saved]').focus(); return; }
    if (event.target.closest('[data-download]')) download();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }
  });
  document.addEventListener('keydown', event => { if(event.key === 'Escape') { const menu = document.querySelector('[data-menu]'); const nav = document.getElementById('mobile-nav'); if(nav && !nav.hidden) {nav.hidden = true; menu.setAttribute('aria-expanded','false'); menu.focus();} } });
  window.addEventListener('storage', event => { if(event.key === 'bb-saved') { const values = read('bb-saved', []); saved = new Set((Array.isArray(values) ? values : []).filter(id => products.some(p => p.id === id))); updateSaveUI(); } });
  render();
})();
