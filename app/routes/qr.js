import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { parseQr } from '../utils/qr.js';
import { checkSubscriptionMock, checkDailyLimitMock, fetchStationMock } from '../utils/net.js';
import Toast from '../components/ui/toast.js';
import Scanner from '../components/qr/Scanner.js';
import ExchangeWizard from '../components/exchange/ExchangeWizard.js';

function loadStyles() {
  if (!document.querySelector('link[href="routes/qr.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'routes/qr.css';
    document.head.appendChild(link);
  }
}

export default function QR() {
  loadStyles();
  const el = document.createElement('div');
  el.className = 'qr-screen';
  const title = document.createElement('h2');
  el.appendChild(title);
  const content = document.createElement('div');
  content.className = 'qr-content';
  el.appendChild(content);
  const toast = Toast();
  const storage = new Storage('eco');

  function updateTexts() {
    title.textContent = t('qr.title');
  }
  onLangChange(updateTexts);
  updateTexts();

  function startScanner() {
    content.innerHTML = '';
    const sc = Scanner({ onResult: handleScan });
    content.appendChild(sc);
  }

  async function handleScan(text) {
    const parsed = parseQr(text);
    if (!parsed) {
      toast.show(t('qr.invalidQr'));
      startScanner();
      return;
    }
    const uid = storage.get('user.id', 'demo');
    const sub = await checkSubscriptionMock(uid);
    if (!sub.ok) { toast.show(t('exchange.limitExceeded')); startScanner(); return; }
    const lim = await checkDailyLimitMock(uid);
    if (!lim.ok) { toast.show(t('exchange.limitExceeded')); startScanner(); return; }
    const st = await fetchStationMock(parsed.stationId);
    if (!st.ok) { toast.show(t('exchange.stationDown')); startScanner(); return; }
    if (st.station.status === 'down') { toast.show(t('exchange.stationDown')); startScanner(); return; }
    if (st.station.charged === 0) { toast.show(t('exchange.noCharged')); startScanner(); return; }
    content.innerHTML = '';
    const wizard = ExchangeWizard({ station: st.station, sub });
    content.appendChild(wizard);
  }

  startScanner();
  return el;
}
