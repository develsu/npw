/* EcoBike PWA v1.0.0-rc, build: 2025-08-23T12:11:33+00:00 */
import { t, initI18n, onLangChange } from './utils/i18n.js';
import { initRouter, rerender } from './router.js';
import Header from './components/ui/Header.js';
import { flushQueue } from './utils/offline.js';

function showUpdateToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = t('common.updateAvailable');
  const btn = document.createElement('button');
  btn.textContent = t('common.reload');
  btn.addEventListener('click', () => location.reload());
  toast.appendChild(btn);
  document.body.appendChild(toast);
}

window.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  flushQueue();
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
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data?.type === 'SW_UPDATED') showUpdateToast();
    });
  }
});
