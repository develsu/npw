import { t } from '../../utils/i18n.js';

const actions = [
  { key: 'nearestStations', icon: 'map.svg', route: '#/map' },
  { key: 'history', icon: 'history.svg', route: '#/history' },
  { key: 'myDocuments', icon: 'docs.svg', route: '#/documents' },
  { key: 'support', icon: 'support.svg', route: '#/support' }
];

export default function ActionGrid() {
  const wrap = document.createElement('div');
  wrap.className = 'action-grid';

  const scan = document.createElement('button');
  scan.type = 'button';
  scan.className = 'action-grid__scan';
  scan.innerHTML = `<img src="assets/icons/qr.svg" alt=""/>${t('dashboard.actions.scanQR')}`;
  scan.addEventListener('click', () => { location.hash = '#/qr'; });
  wrap.appendChild(scan);

  const grid = document.createElement('div');
  grid.className = 'action-grid__grid';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-grid__item';
    btn.innerHTML = `<img src="assets/icons/${a.icon}" alt=""/><span>${t('dashboard.actions.'+a.key)}</span>`;
    btn.addEventListener('click', () => { location.hash = a.route; });
    grid.appendChild(btn);
  });
  wrap.appendChild(grid);

  return wrap;
}
