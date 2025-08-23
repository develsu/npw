import { t } from './utils/i18n.js';
import { formatPhoneKZ, formatMoneyKZT } from './utils/format.js';
import Splash from './routes/splash.js';
import Onboarding from './routes/onboarding.js';

let headerEl;
let current = 'splash';

const routes = {
  splash: Splash,
  onboarding: Onboarding,
  auth() {
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = t('auth.title');
    const label = document.createElement('label');
    label.textContent = t('auth.phone');
    const input = document.createElement('input');
    input.type = 'tel';
    input.placeholder = '+7 000 000 00 00';
    input.addEventListener('blur', () => {
      const val = formatPhoneKZ(input.value);
      if (val) input.value = val;
    });
    label.appendChild(input);
    const btn = document.createElement('button');
    btn.textContent = t('auth.login');
    div.append(h1, label, btn);
    return div;
  },
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
