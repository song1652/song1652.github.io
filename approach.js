(() => {
  'use strict';
  const page = document.querySelector('.approach-page');
  const section = document.getElementById('approach');
  if (!page || !section) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const board = section.querySelector('.quality-orbit');
  const cards = [...board.querySelectorAll('.quality-node')];
  const ending = document.querySelector('.approach-ending');
  page.classList.add('js-motion');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0 });
    observer.observe(section);
    observer.observe(ending);
  } else {
    section.classList.add('is-visible');
    ending.classList.add('is-visible');
  }
  let frame = 0;
  let position = null;
  function reset() {
    position = null;
    cancelAnimationFrame(frame);
    frame = 0;
    for (const card of cards) {
      card.style.setProperty('--float-x', '0px');
      card.style.setProperty('--float-y', '0px');
    }
  }
  board.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    position = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!position) return;
      const rect = board.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (position.x - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (position.y - rect.top) / rect.height * 2 - 1));
      cards.forEach((card, index) => {
        const depth = [5, 7, 6, 4][index];
        card.style.setProperty('--float-x', `${(x * depth).toFixed(2)}px`);
        card.style.setProperty('--float-y', `${(y * depth).toFixed(2)}px`);
      });
    });
  });
  board.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', reset);
  window.addEventListener('blur', reset);
})();
