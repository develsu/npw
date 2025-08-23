import { canView } from './utils/roles.js';
import { t } from './utils/i18n.js';

const routes = {
  login: () => import('./pages/Login.js'),
  dashboard: () => import('./pages/Dashboard.js'),
  cities: () => import('./pages/Cities.js'),
  stations: () => import('./pages/Stations.js'),
  users: () => import('./pages/Users.js'),
  plans: () => import('./pages/Plans.js'),
  ops: () => import('./pages/Ops.js'),
  audit: () => import('./pages/Audit.js'),
  settings: () => import('./pages/Settings.js'),
};

export async function handleRoute(root) {
  const hash = location.hash.replace('#/admin/', '') || 'dashboard';
  const admin = JSON.parse(localStorage.getItem('eco.admin') || '{}');
  if (!admin.role && hash !== 'login') {
    location.hash = '#/admin/login';
    return;
  }
  if (admin.role && hash === 'login') {
    location.hash = '#/admin/dashboard';
    return;
  }
  if (hash !== 'login' && !canView(hash, admin.role)) {
    root.innerHTML = `<p>${t('errors.forbidden')}</p>`;
    return;
  }
  const mod = await routes[hash]();
  root.innerHTML = '';
  root.appendChild(mod.default());
}

export function initRouter(root) {
  window.addEventListener('hashchange', () => handleRoute(root));
  handleRoute(root);
}
