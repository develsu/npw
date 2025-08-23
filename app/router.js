import { t } from './utils/i18n.js';
import { formatMoneyKZT } from './utils/format.js';
import Splash from './routes/splash.js';
import Onboarding from './routes/onboarding.js';
import AuthPhone from './routes/auth/phone.js';
import AuthOtp from './routes/auth/otp.js';
import Agreements from './routes/agreements.js';
import { isAllAccepted } from './utils/agreements.js';
import Storage from './utils/storage.js';

let headerEl;
let current = 'splash';
const storage = new Storage('eco');

const routes = {
  splash: Splash,
  onboarding: Onboarding,
  auth: AuthPhone,
  'auth/otp': AuthOtp,
  agreements: Agreements,
  dashboard() {
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = t('common.appName');
    const p = document.createElement('p');
    p.textContent = formatMoneyKZT(12345);
    div.append(h1, p);
    return div;
  }
};

function render(name) {
  const view = document.getElementById('view');
  view.innerHTML = '';
  view.appendChild(routes[name]());
  headerEl.style.display = name === 'splash' ? 'none' : 'flex';
  current = name;
}

function handleRoute() {
  let hash = location.hash.replace(/^#\//, '');
  if (!routes[hash]) hash = 'splash';
  if (!isAllAccepted() && hash !== 'agreements' && hash !== 'splash' && hash !== 'onboarding') {
    hash = 'agreements';
  } else if (!storage.get('user.auth', false) && hash === 'dashboard') {
    hash = 'auth';
  }
  render(hash);
}

export function initRouter(header) {
  headerEl = header;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function rerender() {
  render(current);
}
