(function (root) {
  'use strict';
  const CACHE_KEY = 'leon-works-kary2999-v1';
  const TTL = 30 * 60 * 1000;
  const selected = ['monitor-swap', 'exchange-asset-report', 'markdownShow', 'prd-forge', 'quant-tool', 'go-skill', 'code-ferry', 'monitor', 'mini-bar', 'PerfMon', 'WebJudge', 'LazyCat', 'purr-swap', 'atool', 'P2P-Ws'];
  const rank = name => selected.findIndex(item => item.toLowerCase() === String(name).toLowerCase());
  function select(repos) {
    return repos.filter(r => r && r.private === false && rank(r.name) >= 0)
      .sort((a, b) => (Number(b.stargazers_count) || 0) - (Number(a.stargazers_count) || 0) || rank(a.name) - rank(b.name));
  }
  async function load(fetcher) {
    const repos = [];
    for (let page = 1; ; page++) {
      const response = await fetcher(`https://api.github.com/users/kary2999/repos?type=owner&sort=pushed&per_page=100&page=${page}`, {
        headers: {Accept: 'application/vnd.github+json'}, signal: AbortSignal.timeout(15000), credentials: 'omit'
      });
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error('Invalid GitHub response');
      repos.push(...batch);
      if (batch.length < 100) return repos;
    }
  }
  root.LeonWorks = {select, load, selected};
  if (typeof document === 'undefined') return;
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function link(text, url) {
    const el = node('a', text);
    el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer';
    return el;
  }
  async function init() {
    const host = document.getElementById('leon-works');
    if (!host || host.dataset.initialized) return;
    host.dataset.initialized = 'true';
    const grid = host.querySelector('#works-grid');
    const status = host.querySelector('#works-status');
    let repos = [], notice = '', timestamp = 0;
    function render() {
      grid.replaceChildren();
      const visible = select(repos);
      for (const repo of visible) {
        const card = node('article', '', 'work-card');
        const url = `https://github.com/kary2999/${encodeURIComponent(repo.name)}`;
        const heading = node('h2'); heading.append(link(repo.name, url)); card.append(heading);
        const description = node('p', repo.description || '暂未填写项目简介，可前往 GitHub 查看。', 'work-description');
        description.title = description.textContent;
        card.append(description);
        const tags = node('div', '', 'work-tags');
        const labels = [repo.language, repo.fork ? 'Fork' : null, repo.archived ? '已归档' : null, ...(Array.isArray(repo.topics) ? repo.topics.slice(0, 5) : [])];
        labels.filter(Boolean).forEach(label => tags.append(node('span', label)));
        card.append(tags);
        const footer = node('div', '', 'work-footer');
        const github = link('GitHub ↗', url);
        github.className = 'work-github';
        const stats = node('span', '', 'work-stats');
        for (const [icon, label, value] of [['far fa-star', 'Star 收藏数', repo.stargazers_count], ['fas fa-code-branch', 'Fork 数', repo.forks_count]]) {
          const stat = node('span'); stat.title = label; stat.setAttribute('aria-label', `${label}：${Number(value) || 0}`);
          const symbol = node('i', '', icon); symbol.setAttribute('aria-hidden', 'true');
          stat.append(symbol, document.createTextNode(` ${Number(value) || 0}`)); stats.append(stat);
        }
        footer.append(github, stats);
        card.append(footer);
        grid.append(card);
      }
      status.textContent = `${notice} · 精选项目 ${visible.length} / ${selected.length} · 按 Star 收藏数排序${timestamp ? ` · 数据更新：${new Date(timestamp).toLocaleString('zh-CN')}` : ''}${visible.length < selected.length ? ' · 部分项目暂未从公开接口获取' : ''}`;
    }
    let cache;
    try {
      cache = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!Array.isArray(cache?.repos) || !Number.isFinite(cache.time)) cache = null;
    } catch (_) { cache = null; }
    if (cache) {
      repos = cache.repos; timestamp = cache.time; notice = '本地缓存'; render();
      if (Date.now() - timestamp >= 0 && Date.now() - timestamp < TTL) return;
    }
    try {
      repos = await load(root.fetch.bind(root)); timestamp = Date.now(); notice = '已同步 GitHub';
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({time: timestamp, repos})); } catch (_) { /* Storage may be unavailable. */ }
      render();
    } catch (_) {
      if (cache) { notice = 'GitHub 暂不可用，显示上次缓存。'; render(); }
      else { status.textContent = '暂时无法加载，可能是网络问题或 GitHub 接口限流。请稍后刷新，或通过上方 GitHub 链接查看项目。'; }
    }
  }
  init();
  document.addEventListener('pjax:complete', init);
})(globalThis);
