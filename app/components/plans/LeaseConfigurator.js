import { t } from '../../utils/i18n.js';
import { formatMoneyKZT } from '../../utils/format.js';
import { LEASING_WEEKLY_PRICE, LEASING_BUYOUT, LEASING_MIN_WEEKS, LEASING_MAX_WEEKS } from '../../utils/billing.js';

export default function LeaseConfigurator(onSubmit) {
  const wrap = document.createElement('div');
  wrap.className = 'lease-config';

  const label = document.createElement('label');
  label.textContent = t('plans.leasing.selectWeeks');
  wrap.appendChild(label);

  const range = document.createElement('input');
  range.type = 'range';
  range.min = LEASING_MIN_WEEKS;
  range.max = LEASING_MAX_WEEKS;
  range.value = LEASING_MIN_WEEKS;
  range.className = 'lease-config__range';
  wrap.appendChild(range);

  const weeksLbl = document.createElement('div');
  wrap.appendChild(weeksLbl);
  const priceLbl = document.createElement('div');
  wrap.appendChild(priceLbl);

  function update() {
    weeksLbl.textContent = t('plans.leasing.weeks', { w: range.value });
    const total = LEASING_WEEKLY_PRICE * range.value;
    priceLbl.textContent = `${t('plans.leasing.weeklyPrice', { price: formatMoneyKZT(LEASING_WEEKLY_PRICE) })} = ${formatMoneyKZT(total)}`;
  }
  range.addEventListener('input', update);
  update();

  const btnRow = document.createElement('div');
  btnRow.className = 'lease-config__actions';

  const submit = document.createElement('button');
  submit.textContent = t('plans.choose');
  submit.addEventListener('click', () => onSubmit && onSubmit(Number(range.value)));
  btnRow.appendChild(submit);

  const buyout = document.createElement('button');
  buyout.textContent = t('plans.leasing.buyout', { price: formatMoneyKZT(LEASING_BUYOUT) });
  buyout.addEventListener('click', () => alert(t('plans.leasing.info')));
  btnRow.appendChild(buyout);

  wrap.appendChild(btnRow);

  return wrap;
}
