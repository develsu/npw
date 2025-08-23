import { initI18n, onLangChange } from './utils/i18n.js';
import { initRouter, rerender } from './router.js';
import Header from './components/ui/Header.js';

window.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  const root = document.getElementById('root');
  const header = Header();
  root.appendChild(header);
  const view = document.createElement('main');
  view.id = 'view';
  root.appendChild(view);
  initRouter(header);
  onLangChange(() => {
    rerender();
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
