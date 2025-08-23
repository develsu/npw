import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { onNetworkChange, fetchSubscription, fetchBike, fetchMaintenance, fetchQuickStats, fetchNews } from '../utils/net.js';
import SubscriptionCard from '../components/cards/SubscriptionCard.js';
import CurrentBikeCard from '../components/cards/CurrentBikeCard.js';
import MaintenanceCard from '../components/cards/MaintenanceCard.js';
import ActionGrid from '../components/actions/ActionGrid.js';
import QuickStats from '../components/stats/QuickStats.js';
import NewsCarousel from '../components/news/NewsCarousel.js';

const storage = new Storage('eco');

export default function Dashboard() {
  const el = document.createElement('div');
  el.className = 'dashboard';

  const offlineBanner = document.createElement('div');
  offlineBanner.className = 'offline-banner hidden';
  offlineBanner.textContent = t('dashboard.offline');
  el.appendChild(offlineBanner);

  const header = document.createElement('div');
  header.className = 'dash-head';
  const greet = document.createElement('h2');
  header.appendChild(greet);
  const controls = document.createElement('div');
  controls.className = 'dash-head__controls';
  const notif = document.createElement('button');
  notif.className = 'dash-head__notif';
  notif.innerHTML = '<img src="assets/icons/bell.svg" alt=""/><span class="badge">1</span>';
  controls.appendChild(notif);
  const cityBtn = document.createElement('button');
  cityBtn.className = 'dash-head__city';
  cityBtn.addEventListener('click', () => { location.hash = '#/city'; });
  controls.appendChild(cityBtn);
  const supBtn = document.createElement('button');
  supBtn.className = 'dash-head__support';
  supBtn.textContent = t('dashboard.actions.support');
  supBtn.addEventListener('click', () => { location.hash = '#/support'; });
  controls.appendChild(supBtn);
  header.appendChild(controls);
  el.appendChild(header);

  const statusWrap = document.createElement('div');
  statusWrap.className = 'status-cards';
  el.appendChild(statusWrap);

  const actionsWrap = ActionGrid();
  el.appendChild(actionsWrap);

  const statsWrap = document.createElement('div');
  el.appendChild(statsWrap);

  const newsWrap = document.createElement('div');
  el.appendChild(newsWrap);

  function updateGreeting() {
    const hour = new Date().getHours();
    let key = 'day';
    if (hour < 12) key = 'morning'; else if (hour >= 18) key = 'evening';
    const name = storage.get('user.name', t('dashboard.friend'));
    greet.textContent = t(`dashboard.greetings.${key}`, { name });
    const city = storage.get('profile.city', {});
    cityBtn.textContent = city?.name || '';
  }

  async function load() {
    statusWrap.innerHTML = t('splash.loading');
    statsWrap.innerHTML = t('splash.loading');
    newsWrap.innerHTML = t('splash.loading');
    offlineBanner.classList.add('hidden');
    let offline = false;
    try {
      const { data, fromCache } = await fetchSubscription();
      offline ||= fromCache; statusWrap.innerHTML = ''; statusWrap.appendChild(SubscriptionCard(data));
    } catch(e) {}
    try {
      const { data, fromCache } = await fetchBike();
      offline ||= fromCache; statusWrap.appendChild(CurrentBikeCard(data));
    } catch(e) {}
    try {
      const { data, fromCache } = await fetchMaintenance();
      offline ||= fromCache; statusWrap.appendChild(MaintenanceCard(data));
    } catch(e) {}
    try {
      const { data, fromCache } = await fetchQuickStats();
      offline ||= fromCache; statsWrap.innerHTML = ''; statsWrap.appendChild(QuickStats(data));
    } catch(e) {}
    try {
      const { data, fromCache } = await fetchNews();
      offline ||= fromCache; newsWrap.innerHTML = ''; newsWrap.appendChild(NewsCarousel(data));
    } catch(e) {}
    offlineBanner.classList.toggle('hidden', !offline);
  }

  updateGreeting();
  onLangChange(updateGreeting);
  load();
  onNetworkChange((online) => { if (online) load(); });

  return el;
}
