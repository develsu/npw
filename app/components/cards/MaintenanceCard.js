import CardBase from './CardBase.js';
import { t } from '../../utils/i18n.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

export default function MaintenanceCard(m) {
  const el = CardBase('maintenance-card');

  const last = document.createElement('p');
  last.textContent = `${t('dashboard.maintenance.last')}: ${formatDate(m.lastDateISO)}`;
  el.appendChild(last);

  const next = document.createElement('p');
  next.textContent = `${t('dashboard.maintenance.next')}: ${formatDate(m.nextDateISO)}`;
  el.appendChild(next);

  const status = document.createElement('p');
  status.className = 'maintenance-card__status';
  status.textContent = t(`dashboard.maintenanceStatus.${m.status}`);
  el.appendChild(status);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'maintenance-card__book';
  btn.textContent = t('dashboard.maintenance.book');
  btn.addEventListener('click', () => alert('TODO'));
  el.appendChild(btn);

  return el;
}
