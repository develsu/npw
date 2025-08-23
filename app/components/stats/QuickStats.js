import { t } from '../../utils/i18n.js';

export default function QuickStats(data) {
  const wrap = document.createElement('div');
  wrap.className = 'quick-stats';
  const items = [
    { key: 'kmThisMonth', icon: 'km.svg', val: Math.round(data.kmMonth) },
    { key: 'co2Saved', icon: 'co2.svg', val: data.co2SavedKg.toFixed(1) },
    { key: 'swapsThisMonth', icon: 'swap.svg', val: Math.round(data.swapsMonth) },
    { key: 'ecoScore', icon: 'score.svg', val: Math.round(data.ecoScore) }
  ];
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'quick-stats__item';
    div.innerHTML = `<img src="assets/icons/${it.icon}" alt=""/><span class="quick-stats__value">${it.val}</span><span class="quick-stats__label">${t('dashboard.stats.'+it.key)}</span>`;
    wrap.appendChild(div);
  });
  return wrap;
}
