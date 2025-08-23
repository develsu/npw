import { t, onLangChange } from '../../utils/i18n.js';
import { requestUnlockMock } from '../../utils/net.js';
import Storage from '../../utils/storage.js';
import Toast from '../ui/toast.js';

function loadStyles() {
  if (!document.querySelector('link[href="components/exchange/ExchangeWizard.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'components/exchange/ExchangeWizard.css';
    document.head.appendChild(link);
  }
}

export default function ExchangeWizard({ station, sub }) {
  loadStyles();
  const el = document.createElement('div');
  el.className = 'exchange-wizard';
  const toast = Toast();
  const storage = new Storage('eco');
  let step = 0;
  let slot = null;
  let beforePhoto = null;
  let afterPhoto = null;
  let opId = null;

  function render() {
    el.innerHTML = '';
    if (step === 0) renderInfo();
    else if (step === 1) renderSlot();
    else if (step === 2) renderPhotoBefore();
    else if (step === 3) renderUnlock();
    else if (step === 4) renderTake();
    else if (step === 5) renderPhotoAfter();
    else renderReceipt();
  }

  function renderInfo() {
    const h = document.createElement('h2');
    h.textContent = t('exchange.stationInfoTitle');
    const name = document.createElement('div');
    name.textContent = station.name;
    const addr = document.createElement('div');
    addr.textContent = station.addr;
    const avail = document.createElement('div');
    avail.textContent = t('exchange.availableBatteries', { n: station.charged });
    const btn = document.createElement('button');
    btn.textContent = t('buttons.next');
    btn.addEventListener('click', () => { step = 1; render(); });
    el.append(h, name, addr, avail, btn);
  }

  function renderSlot() {
    const h = document.createElement('h2');
    h.textContent = t('exchange.selectSlot');
    const list = document.createElement('div');
    station.availableSlots.forEach(s => {
      const b = document.createElement('button');
      b.textContent = s;
      b.addEventListener('click', () => { slot = s; step = 2; render(); });
      list.appendChild(b);
    });
    el.append(h, list);
  }

  function renderPhotoBefore() {
    const h = document.createElement('h2');
    h.textContent = t('exchange.photoBefore');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    const img = document.createElement('img');
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { beforePhoto = reader.result; img.src = beforePhoto; };
      reader.readAsDataURL(file);
    });
    const btn = document.createElement('button');
    btn.textContent = t('buttons.next');
    btn.addEventListener('click', () => { if (beforePhoto) { step = 3; render(); } });
    el.append(h, input, img, btn);
  }

  function renderUnlock() {
    const btn = document.createElement('button');
    btn.textContent = t('exchange.confirmUnlock');
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = t('exchange.unlocking');
      const res = await requestUnlockMock(station.id, slot);
      if (res.ok) {
        opId = res.opId;
        step = 4; render();
      } else {
        toast.show('Error');
        btn.disabled = false;
        btn.textContent = t('exchange.confirmUnlock');
      }
    });
    el.append(btn);
  }

  function renderTake() {
    const p = document.createElement('p');
    p.textContent = t('exchange.takeBattery');
    const btn = document.createElement('button');
    btn.textContent = t('exchange.done');
    btn.addEventListener('click', () => { step = 5; render(); });
    el.append(p, btn);
  }

  function renderPhotoAfter() {
    const h = document.createElement('h2');
    h.textContent = t('exchange.photoAfter');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    const img = document.createElement('img');
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { afterPhoto = reader.result; img.src = afterPhoto; };
      reader.readAsDataURL(file);
    });
    const btn = document.createElement('button');
    btn.textContent = t('buttons.next');
    btn.addEventListener('click', () => { if (afterPhoto) { step = 6; render(); } });
    el.append(h, input, img, btn);
  }

  function renderReceipt() {
    const h = document.createElement('h2');
    h.textContent = t('exchange.receiptTitle');
    const info = document.createElement('div');
    info.innerHTML = `<p>${station.name}</p><p>${t('exchange.selectSlot')}: ${slot}</p><p>${new Date().toLocaleString()}</p>`;
    const print = document.createElement('button');
    print.textContent = t('exchange.print');
    print.addEventListener('click', () => window.print());
    const save = document.createElement('button');
    save.textContent = t('exchange.saveToHistory');
    save.addEventListener('click', () => {
      const hist = storage.get('history', []);
      const entry = { id: opId, tsISO: new Date().toISOString(), stationId: station.id, stationName: station.name, slot, cityId: station.cityId, plan: sub.plan, lang: storage.get('lang', 'kz'), photos: { before: beforePhoto, after: afterPhoto } };
      hist.push(entry);
      storage.set('history', hist);
      storage.set('lastOperation', entry);
      toast.show(t('exchange.saved'));
      save.disabled = true;
    });
    el.append(h, info, print, save);
  }

  onLangChange(render);
  render();
  return el;
}
