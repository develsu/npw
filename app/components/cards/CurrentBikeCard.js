import CardBase from './CardBase.js';
import { t } from '../../utils/i18n.js';

export default function CurrentBikeCard(bike) {
  const el = CardBase('bike-card');

  const img = document.createElement('img');
  img.className = 'bike-card__img';
  img.src = 'assets/placeholders/bike.svg';
  img.alt = 'bike';
  el.appendChild(img);

  const imei = document.createElement('p');
  imei.textContent = `IMEI: ${bike.imei}`;
  el.appendChild(imei);

  const serial = document.createElement('p');
  serial.textContent = `SN: ${bike.serial}`;
  el.appendChild(serial);

  const status = document.createElement('p');
  status.className = 'bike-card__status';
  status.textContent = t(`dashboard.bike.status.${bike.status}`);
  el.appendChild(status);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'bike-card__find';
  btn.textContent = t('dashboard.bike.find');
  btn.addEventListener('click', () => {
    if (bike.lastPos) {
      const { lat, lng } = bike.lastPos;
      location.hash = `#/map?center=${lat},${lng}&select=bike`;
    } else {
      location.hash = '#/map';
    }
  });
  el.appendChild(btn);

  return el;
}
