import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { daysLeft } from '../utils/billing.js';
import { formatDate, formatMoneyKZT } from '../utils/format.js';
import { pollStatusMock } from '../utils/payments.js';
import Loader from '../components/ui/loader.js';
import Toast from '../components/ui/toast.js';

const storage = new Storage('eco');
const loader = Loader();
const toast = Toast();

export default function Billing() {
  const el = document.createElement('div');
  el.className = 'billing-page';

  const title = document.createElement('h2');
  title.textContent = t('billing.title');
  el.appendChild(title);

  const pending = document.createElement('div');
  pending.className = 'billing-pending hidden';
  el.appendChild(pending);

  const card = document.createElement('div');
  card.className = 'billing-card';
  el.appendChild(card);
  const actions = document.createElement('div');
  actions.className = 'billing-actions';
  card.appendChild(actions);

  const extra = document.createElement('div');
  el.appendChild(extra);

  const history = document.createElement('div');
  const last = storage.get('lastOperation');
  if (last) {
    const link = document.createElement('a');
    link.href = '#/documents';
    link.textContent = t('billing.historyLink');
    history.appendChild(link);
  }
  el.appendChild(history);

  function render() {
    card.innerHTML = '';
    actions.innerHTML = '';
    const sub = storage.get('subscription');
    if (sub) {
      const h3 = document.createElement('h3');
      h3.textContent = t(`plans.${sub.plan.toLowerCase()}`);
      card.appendChild(h3);
      const d = document.createElement('p');
      d.textContent = t('billing.daysLeft', { days: daysLeft(sub) });
      card.appendChild(d);
      const use = document.createElement('p');
      use.textContent = sub.limitPerDay === Infinity ? t('billing.unlimited') : t('billing.usedOf', { used: sub.usedToday, limit: sub.limitPerDay });
      card.appendChild(use);
      ['renew','upgrade','changeMethod','cancelAutoRenew'].forEach(key => {
        const b = document.createElement('button');
        b.textContent = t(`billing.${key}`);
        actions.appendChild(b);
      });
    }
    extra.innerHTML = '';
    const rent = storage.get('rental');
    if (rent) {
      const p = document.createElement('p');
      p.textContent = t('billing.rentalStatus', { date: formatDate(rent.endsISO) });
      extra.appendChild(p);
    }
    const lease = storage.get('leasing');
    if (lease) {
      const p = document.createElement('p');
      p.textContent = t('billing.leasingStatus', { date: formatDate(lease.endsISO), weeks: lease.weeks });
      extra.appendChild(p);
      const b = document.createElement('button');
      b.textContent = t('billing.buyout', { price: formatMoneyKZT(lease.buyoutKZT) });
      extra.appendChild(b);
    }
  }
  render();

  onLangChange(() => {
    title.textContent = t('billing.title');
    pending.textContent = t('billing.pendingPayment');
    render();
  });

  const pend = storage.get('billing.pending');
  if (pend) {
    pending.textContent = t('billing.pendingPayment');
    pending.classList.remove('hidden');
    loader.show();
    poll(pend.sessionId);
  }

  async function poll(id) {
    let status = 'pending';
    while (status === 'pending') {
      const res = await pollStatusMock(id);
      status = res.status;
      if (status === 'pending') await new Promise(r => setTimeout(r, 1000));
    }
    loader.hide();
    pending.classList.add('hidden');
    storage.remove('billing.pending');
    if (status === 'paid') {
      toast.show(t('payments.paid'));
      render();
    } else {
      toast.show(t('payments.failed'));
    }
  }

  return el;
}
