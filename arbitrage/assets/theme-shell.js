(() => {
  const embedded = window.self !== window.top;
  document.body.classList.toggle('is-embedded', embedded);
  document.documentElement.classList.toggle('is-embedded-root', embedded);

  const items = [
    ['⌕', '搜索', '/#search-button'],
    ['⌂', '首页', '/'],
    ['▣', '归档', '/archives/'],
    ['◆', '标签', '/tags/'],
    ['∞', '友链', '/link/'],
    ['⚙', '代表作品', '/works/'],
    ['⌁', '量化套利', '/arbitrage/', 'page'],
    ['●', '关于', '/about/']
  ];

  const nav = document.createElement('nav');
  nav.className = 'arbitrage-site-nav';
  nav.setAttribute('aria-label', 'Leon Blog 主导航');
  nav.innerHTML = `
    <a class="site-name" href="/" target="_top">Leon Blog</a>
    <button class="menu-toggle" type="button" aria-label="展开导航" aria-expanded="false">☰</button>
    <div class="site-menu">
      ${items.map(([icon, label, href, current]) =>
        `<a href="${href}" target="_top"${current ? ' aria-current="page"' : ''}><span aria-hidden="true">${icon}</span> ${label}</a>`
      ).join('')}
    </div>`;

  nav.querySelector('.menu-toggle').addEventListener('click', event => {
    const open = nav.classList.toggle('menu-open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.body.prepend(nav);

  if (!embedded) {
    const ribbon = document.createElement('script');
    ribbon.id = 'ribbon';
    ribbon.src = 'https://cdn.jsdelivr.net/npm/butterfly-extsrc@1.1.6/dist/canvas-ribbon.min.js';
    ribbon.defer = true;
    ribbon.setAttribute('size', '150');
    ribbon.setAttribute('alpha', '0.6');
    ribbon.setAttribute('zIndex', '0');
    ribbon.setAttribute('mobile', 'false');
    ribbon.setAttribute('data-click', 'false');
    document.body.append(ribbon);
  }
})();
