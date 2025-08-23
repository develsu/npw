import { t } from './utils/i18n.js';
import { formatMoneyKZT } from './utils/format.js';
import Splash from './routes/splash.js';
import Onboarding from './routes/onboarding.js';
import AuthPhone from './routes/auth/phone.js';
import AuthOtp from './routes/auth/otp.js';

let headerEl;
let current = 'splash';

const routes = {
  splash: Splash,
  onboarding: Onboarding,
  auth: AuthPhone,
  'auth/otp': AuthOtp,
  agreements() {
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = t('agreements.title');
    const btn = document.createElement('button');
    btn.textContent = t('agreements.accept');
    div.append(h1, btn);
    return div;
  },
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
  const hash = location.hash.replace(/^#\//, '');
  const name = routes[hash] ? hash : 'splash';
  render(name);
}

export function initRouter(header) {
  headerEl = header;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function rerender() {
  render(current);
}
