import { t } from '../../utils/i18n.js';
import { formatMoneyKZT } from '../../utils/format.js';

export default function PlanCard(plan, onSelect) {
  const el = document.createElement('div');
  el.className = 'plan-card';

  const title = document.createElement('h3');
  title.textContent = t(`plans.${plan.id.toLowerCase()}`);
  el.appendChild(title);

  const price = document.createElement('div');
  price.className = 'plan-card__price';
  price.textContent = t('plans.perMonth', { price: formatMoneyKZT(plan.pricePerMonth) });
  el.appendChild(price);

  const perDay = document.createElement('div');
  perDay.className = 'plan-card__perday';
  perDay.textContent = t('plans.perDay', { price: formatMoneyKZT(plan.pricePerDay) });
  el.appendChild(perDay);

  const features = document.createElement('ul');
  features.className = 'plan-card__features hidden';
  plan.features.forEach(f => {
    const li = document.createElement('li');
    const key = typeof f === 'object' ? f.key : f;
    const val = typeof f === 'object' ? f.val : null;
    let text;
    if (key === 'swapsPerDay') {
      const v = val === Infinity ? t('plans.unlimited') : val;
      text = t(`plans.features.${key}`, { n: v });
    } else {
      text = t(`plans.features.${key}`);
    }
    li.textContent = text;
    features.appendChild(li);
  });
  el.appendChild(features);

  const btnRow = document.createElement('div');
  btnRow.className = 'plan-card__actions';

  const choose = document.createElement('button');
  choose.textContent = t('plans.choose');
  choose.addEventListener('click', () => onSelect && onSelect());
  choose.dataset.testid = 'plan' + plan.id;
  btnRow.appendChild(choose);

  const details = document.createElement('button');
  details.textContent = t('plans.details');
  details.addEventListener('click', () => features.classList.toggle('hidden'));
  btnRow.appendChild(details);

  el.appendChild(btnRow);

  return el;
}
