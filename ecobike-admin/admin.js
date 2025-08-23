import { initI18n, t, onLangChange } from './utils/i18n.js';
import { initRouter } from './router.js';
import { canView } from './utils/roles.js';

const LINKS = [
  { hash: 'dashboard', key: 'sidebar.dashboard' },
  { hash: 'cities', key: 'sidebar.cities' },
  { hash: 'stations', key: 'sidebar.stations' },
  { hash: 'users', key: 'sidebar.users' },
  { hash: 'plans', key: 'sidebar.plans' },
  { hash: 'ops', key: 'sidebar.ops' },
  { hash: 'audit', key: 'sidebar.audit' },
  { hash: 'settings', key: 'sidebar.settings' }
];

async function bootstrap() {
  await initI18n();
  const app = document.getElementById('app');
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  const mainWrap = document.createElement('div');
  mainWrap.className = 'main';
  const header = document.createElement('header');
  header.textContent = t('sidebar.title');
  const main = document.createElement('main');
  main.id = 'view';
  mainWrap.append(header, main);
  app.append(sidebar, mainWrap);

  function renderLinks() {
    sidebar.innerHTML = '';
    const admin = JSON.parse(localStorage.getItem('eco.admin') || '{}');
    LINKS.forEach(l => {
      if (!admin.role || !canView(l.hash, admin.role)) return;
      const a = document.createElement('a');
      a.href = `#/admin/${l.hash}`;
      a.textContent = t(l.key);
      a.dataset.hash = l.hash;
      sidebar.appendChild(a);
    });
    const exit = document.createElement('a');
    exit.href = '#/admin/login';
    exit.textContent = t('actions.logout');
    exit.addEventListener('click', () => localStorage.removeItem('eco.admin'));
    sidebar.appendChild(exit);
  }

  onLangChange(() => {
    header.textContent = t('sidebar.title');
    renderLinks();
  });

  renderLinks();
  initRouter(main);
}

bootstrap();
