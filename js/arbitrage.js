(() => {
  const app = document.querySelector('.arbitrage-app');
  if (!app) return;

  const nav = app.querySelector('#strategyNav');
  const viewer = app.querySelector('#strategyViewer');
  const name = app.querySelector('#strategyName');
  const open = app.querySelector('#openStrategy');

  nav.addEventListener('click', event => {
    const card = event.target.closest('.strategy-card');
    if (!card) return;

    nav.querySelectorAll('.strategy-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
    viewer.src = card.dataset.src;
    viewer.title = `${card.dataset.name}策略内容`;
    name.textContent = card.dataset.name;
    open.href = card.dataset.src;

    if (window.innerWidth <= 900) {
      app.querySelector('.strategy-reader').scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
