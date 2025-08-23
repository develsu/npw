import { t } from './utils/i18n.js';
import { formatMoneyKZT } from './utils/format.js';
import Splash from './routes/splash.js';
import Onboarding from './routes/onboarding.js';
import AuthPhone from './routes/auth/phone.js';
import AuthOtp from './routes/auth/otp.js';
import Agreements from './routes/agreements.js';
import City from './routes/city.js';
import Register from './routes/register.js';
import Dashboard from './routes/dashboard.js';
import History from './routes/history.js';
import Documents from './routes/documents.js';
import Support from './routes/support.js';
import Map from './routes/map.js';
import QR from './routes/qr.js';
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
  city: City,
  register: Register,
  dashboard: Dashboard,
  history: History,
  documents: Documents,
  support: Support,
  map: Map,
  qr: QR
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
  const profile = storage.get('profile', {});
  if (!isAllAccepted() && hash !== 'agreements' && hash !== 'splash' && hash !== 'onboarding') {
    hash = 'agreements';
  } else if (!profile?.city && hash !== 'city' && hash !== 'splash' && hash !== 'onboarding') {
    hash = 'city';
  } else if (profile?.city && !profile?.fio && hash !== 'register' && hash !== 'city' && hash !== 'splash' && hash !== 'onboarding') {
    hash = 'register';
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
