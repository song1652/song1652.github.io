(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [];
  const observeGroup = (selector, stagger = 0) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index * stagger, 320)}ms`);
      elements.push(element);
    });
  };
  observeGroup('.career-grid>div:first-child,.dossier-section-head,.lc-intro,.lab-evidence-heading,.closing .wrap');
  observeGroup('.timeline article', 130);
  observeGroup('.dossier-index a', 65);
  observeGroup('.ai-context>div', 120);
  observeGroup('.org-company', 120);
  observeGroup('.principle-feature');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { threshold: .12, rootMargin: '0px 0px -20px 0px' });
  elements.forEach(element => observer.observe(element));
  reduced.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach(element => element.classList.add('is-revealed'));
  });
})();
