(() => {
  const section = document.getElementById('work');
  const menu = section?.querySelector('.dossier-index');
  if (!menu) return;
  const tabs = [...menu.querySelectorAll('[data-product]')];
  const panels = new Map([...section.querySelectorAll('[data-case]')].map(panel => [panel.dataset.case, panel]));
  if (!tabs.length || tabs.some(tab => !panels.has(tab.dataset.product))) return;
  menu.setAttribute('role', 'tablist');
  menu.setAttribute('aria-orientation', 'horizontal');
  for (const tab of tabs) {
    const key = tab.dataset.product;
    const panel = panels.get(key);
    tab.id = 'product-tab-' + key;
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',tab.id);
    panel.tabIndex = 0;
  }
  function select(key) {
    for (const tab of tabs) {
      const current = tab.dataset.product === key;
      tab.setAttribute('aria-selected', String(current));
      tab.tabIndex = current ? 0 : -1;
      panels.get(tab.dataset.product).hidden = !current;
    }
  }
  function syncFromURL() {
    const key = location.hash.replace(/^#case-/, '');
    if (panels.has(key)) select(key);
  }
  function change(tab) {
    select(tab.dataset.product);
    if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click',event => {
      if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      change(tab);
    });
    tab.addEventListener('keydown',event => {
      const idx = {ArrowDown:(index+1)%tabs.length,ArrowUp:(index+tabs.length-1)%tabs.length,
        ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
      if (idx === undefined && event.key!==' ') return;
      event.preventDefault();
      const target=idx === undefined ? tab : tabs[idx];
      target.focus();
      change(target);
    });
  });
  select(tabs[0].dataset.product);
  syncFromURL();
  window.addEventListener('hashchange',syncFromURL);
  window.addEventListener('popstate',syncFromURL);
})();
