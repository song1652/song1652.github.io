(() => {
  'use strict';
  const section = document.querySelector('.lab-casebook');
  if (!section) return;
  const nav = section.querySelector('.lc-nav');
  const tabs = Array.from(nav.querySelectorAll('[data-lc-key]'));
  const panels = tabs.map(tab => section.querySelector(tab.getAttribute('href')));
  nav.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
      panels[i].hidden = i !== index;
      if (i !== index) panels[i].querySelectorAll('video').forEach(video => video.pause());
    });
  }
  function indexFromHash() {
    return panels.findIndex(panel => '#' + panel.id === location.hash);
  }
  const initial = indexFromHash();
  select(initial >= 0 ? initial : 0);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(index);
      history.replaceState(history.state, '', tab.getAttribute('href'));
    });
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });
  panels.forEach((panel, i) => {
    if (i + 1 === panels.length) return;
    const actions = document.createElement('div');
    actions.className = 'lc-stepactions';
    const advance = document.createElement('button');
    advance.type = 'button';
    advance.textContent = '다음 · ' + tabs[i + 1].textContent.replace(/^\d{2}/, '').trim() + ' →';
    advance.addEventListener('click', () => {
      tabs[i + 1].click();
      tabs[i + 1].focus({preventScroll:true});
      nav.scrollIntoView({block:'start'});
    });
    actions.append(advance);
    panel.append(actions);
  });
  window.addEventListener('hashchange', () => {
    const i = indexFromHash();
    if (i < 0) return;
    select(i);
    nav.scrollIntoView({block:'start'});
  });
  function openAppEvidence(){
    const target=section.querySelector('#lc-app-evidence');
    if(!target || location.hash !== '#lc-app-evidence') return;
    select(tabs.findIndex(tab=>tab.dataset.lcKey === 'evidence'));
    if(target.tagName === 'DETAILS') target.open=true;
    requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }
  openAppEvidence();
  window.addEventListener('hashchange',openAppEvidence);
  const zoom = section.querySelector('#lc-zoom');
  const zoomImage = zoom.querySelector('img');
  const zoomLabel = zoom.querySelector('strong');
  section.querySelectorAll('a[data-lc-zoom]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !zoom.showModal) return;
    event.preventDefault();
    const caption = link.dataset.caption || link.querySelector('img')?.alt || '원본 화면';
    zoomLabel.textContent = caption;
    zoomImage.alt = caption;
    zoomImage.src = link.href;
    zoom.showModal();
  }));
  zoom.querySelector('button').addEventListener('click', () => zoom.close());
  zoom.addEventListener('click', event => {
    if (event.target !== zoom) return;
    const r = zoom.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) zoom.close();
  });
})();
