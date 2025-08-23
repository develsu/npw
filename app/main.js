import { initI18n } from './utils/i18n.js';
import { initRouter } from './router.js';
import Header from './components/ui/header.js';

export const bus = new EventTarget();

window.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  const root = document.getElementById('root');
  root.appendChild(Header());
  const view = document.createElement('main');
  view.id = 'view';
  root.appendChild(view);
  initRouter();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
