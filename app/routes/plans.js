import { t, onLangChange } from '../utils/i18n.js';
import PlanCard from '../components/plans/PlanCard.js';
import LeaseConfigurator from '../components/plans/LeaseConfigurator.js';
import { PLANS, pricePerDay, applyPlan, applyRental, applyLeasing, RENTAL_PRICE_WEEK } from '../utils/billing.js';
import { formatMoneyKZT } from '../utils/format.js';
import { createSessionMock, pollStatusMock, openCheckout } from '../utils/payments.js';
import Loader from '../components/ui/loader.js';
import Toast from '../components/ui/toast.js';
import Storage from '../utils/storage.js';

const storage = new Storage('eco');
const loader = Loader();
const toast = Toast();

export default function Plans() {
  const el = document.createElement('div');
  el.className = 'plans-page';

  const title = document.createElement('h2');
  title.textContent = t('plans.title');
  el.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'plan-grid';
  PLANS.forEach(p => {
    p.pricePerDay = pricePerDay(p);
    const card = PlanCard(p, () => startPlan(p.id));
    grid.appendChild(card);
  });
  el.appendChild(grid);

  const rental = document.createElement('div');
  rental.className = 'rental-block';
  const rentTitle = document.createElement('h3');
  rentTitle.textContent = t('plans.rental.title');
  rental.appendChild(rentTitle);
  const rentDesc = document.createElement('p');
  rentDesc.textContent = t('plans.rental.desc');
  rental.appendChild(rentDesc);
  const rentPrice = document.createElement('p');
  rentPrice.textContent = t('plans.rental.pricePerWeek', { price: formatMoneyKZT(RENTAL_PRICE_WEEK) });
  rental.appendChild(rentPrice);
  const rentBtn = document.createElement('button');
  rentBtn.textContent = t('plans.rental.selectOneWeek');
  rentBtn.addEventListener('click', () => startRental());
  rental.appendChild(rentBtn);
  el.appendChild(rental);

  const leasing = document.createElement('div');
  leasing.className = 'leasing-block';
  const leaseTitle = document.createElement('h3');
  leaseTitle.textContent = t('plans.leasing.title');
  leasing.appendChild(leaseTitle);
  const configurator = LeaseConfigurator(weeks => startLeasing(weeks));
  leasing.appendChild(configurator);
  el.appendChild(leasing);

  function refreshText() {
    title.textContent = t('plans.title');
    rentTitle.textContent = t('plans.rental.title');
    rentDesc.textContent = t('plans.rental.desc');
    rentPrice.textContent = t('plans.rental.pricePerWeek', { price: formatMoneyKZT(RENTAL_PRICE_WEEK) });
    rentBtn.textContent = t('plans.rental.selectOneWeek');
    leaseTitle.textContent = t('plans.leasing.title');
  }
  onLangChange(refreshText);

  async function handlePayment(planId, applyFn, extra) {
    loader.show();
    const { ok, sessionId, checkoutUrl } = await createSessionMock({ planId, amountKZT: 0 });
    loader.hide();
    if (!ok) return;
    openCheckout(checkoutUrl);
    storage.set('billing.pending', { sessionId });
    toast.show(t('payments.openWindowHint'));
    loader.show();
    let status = 'pending';
    while (status === 'pending') {
      const res = await pollStatusMock(sessionId);
      status = res.status;
      if (status === 'pending') await new Promise(r => setTimeout(r, 1000));
    }
    loader.hide();
    storage.remove('billing.pending');
    if (status === 'paid') {
      applyFn(extra);
      toast.show(t('payments.paid'));
      location.hash = '#/billing';
    } else {
      toast.show(t('payments.failed'));
    }
  }

  function startPlan(id) {
    handlePayment(id, () => applyPlan(id));
  }
  function startRental() {
    handlePayment('rental', () => applyRental(1));
  }
  function startLeasing(weeks) {
    handlePayment('leasing', w => applyLeasing(w), weeks);
  }

  return el;
}
