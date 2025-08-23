/* EcoBike PWA v1.0.0-rc, build: 2025-08-23T12:11:33+00:00 */
import { t, initI18n, onLangChange } from './utils/i18n.js';
import { initRouter, rerender } from './router.js';
import Header from './components/ui/Header.js';
import { flushQueue } from './utils/offline.js';

// QA hooks
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('eco-offline', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('swapReports', { autoIncrement: true });
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

window.__qa = {
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  clear() { localStorage.clear(); },
  goto(hash) { location.hash = hash; },
  qrScan(text) { window.dispatchEvent(new CustomEvent('qa:qr', { detail: { text } })); },
  async listQueue() { const db = await openDB(); const tx = db.transaction('swapReports'); const store = tx.objectStore('swapReports'); return store.getAll(); },
  flushQueue
};

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
