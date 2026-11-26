/* The site shell already owns the local React runtime. Load the exhibits on demand. */
(() => {
  const host = () => document.querySelector('[data-view]:not([hidden]) [data-dx-mount]');
  let pending;
  function script(path) {
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.src = path;
      element.onload = resolve;
      element.onerror = () => { element.remove(); reject(new Error(path)); };
      document.head.appendChild(element);
    });
  }
  function render() {
    const el = host();
    if (window.RuopanDemo && window.RuopanDemoArt) {
      window.RuopanDemo.renderPage(el);
      return;
    }
    if (!el) return;
    if (!window.ReactDOM && document.readyState !== 'complete') return;
    if (!window.ReactDOM) { failed(el); return; }
    if (!pending) pending = (async () => {
      if (!window.RuopanDemoArt) await script('./demos/illustrations.js');
      await script('./demos/interactive.js');
    })().catch(() => { pending = null; throw new Error('demo load failed'); });
    pending.then(() => window.RuopanDemo.renderPage(host())).catch(() => { if (host()) failed(host()); });
  }
  function failed(el) {
    el.replaceChildren();
    const button = document.createElement('button');
    button.textContent = document.documentElement.lang.startsWith('en') ? 'Reload demo' : '重新加载演示';
    button.addEventListener('click', () => window.ReactDOM ? render() : location.reload());
    el.appendChild(button);
  }
  document.addEventListener('ruopan:view', render);
  window.addEventListener('load', render, {once:true});
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  render();
})();
