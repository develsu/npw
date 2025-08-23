import { t, onLangChange } from '../utils/i18n.js';
import { fetchCities, fetchAgreementsMeta } from '../utils/net.js';
import Storage from '../utils/storage.js';

const storage = new Storage('eco');

function nextRoute() {
  if (storage.get('firstLaunch', true)) return 'onboarding';
  if (!storage.get('agreements.accepted', false)) return 'agreements';
  if (!storage.get('user.auth', false)) return 'auth';
  return 'dashboard';
}

export default function Splash() {
  const el = document.createElement('div');
  el.className = 'splash-screen';

  const logo = document.createElement('div');
  logo.className = 'splash-logo';
  const progress = document.createElement('div');
  progress.className = 'splash-progress';
  const bar = document.createElement('div');
  bar.className = 'splash-progress-bar';
  progress.appendChild(bar);
  const status = document.createElement('div');
  status.className = 'splash-status';
  el.append(logo, progress, status);

  let statusKey = 'splash.loading';

  function updateTexts() {
    logo.textContent = t('common.appName');
    status.textContent = t(statusKey);
  }
  onLangChange(updateTexts);
  updateTexts();

  const tasks = [
    async () => {
      const cities = await fetchCities();
      storage.set('cities', cities);
    },
    async () => {
      const meta = await fetchAgreementsMeta();
      storage.set('agreements.meta', meta);
    },
    async () => {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          if (reg.waiting) {
            statusKey = 'splash.updating';
            updateTexts();
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    }
  ];

  (async () => {
    for (let i = 0; i < tasks.length; i++) {
      await tasks[i]();
      bar.style.width = `${((i + 1) / tasks.length) * 100}%`;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        storage.set('location', {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      });
    }
    setTimeout(() => {
      location.hash = `#/${nextRoute()}`;
    }, 300);
  })();

  return el;
}
