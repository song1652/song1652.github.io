(() => {
  const section = document.querySelector('.quality-overview');
  if (!section) return;
  const cards = [...section.querySelectorAll('.quality-card')];
  const lines = [...section.querySelectorAll('.quality-connector')];
  const phrases = [...section.querySelectorAll('.quality-flow-phrase')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = [];
  const clear = () => [...cards,...phrases].forEach(el => el.classList.remove('is-active'));
  const finish = () => {
    timers.forEach(clearTimeout);
    [...cards,...lines].forEach(el => el.classList.add('is-visible'));
    clear();
  };
  const active = index => {
    clear();
    cards[index].classList.add('is-visible','is-active');
    phrases[index].classList.add('is-active');
  };
  if (!reduced.matches && 'IntersectionObserver' in window) {
    section.classList.add('is-sequence-ready');
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      [[120,()=>active(0)],[620,()=>lines[0].classList.add('is-visible')],
       [820,()=>active(1)],[1320,()=>lines[1].classList.add('is-visible')],
       [1520,()=>active(2)],[2420,finish]].forEach(([delay,action]) => timers.push(setTimeout(action,delay)));
    },{threshold:.25});
    observer.observe(section);
    reduced.addEventListener('change',e => { if (e.matches) {observer.disconnect();finish();} });
  }
  cards.forEach((card,index) => {
    card.addEventListener('mouseenter',()=>{clear();phrases[index].classList.add('is-active');});
    card.addEventListener('mouseleave',clear);
  });
})();
