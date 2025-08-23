import { t, onLangChange } from '../../utils/i18n.js';
import { verifyOtpMock, sendOtpMock } from '../../utils/net.js';
import Storage from '../../utils/storage.js';
import Toast from '../../components/ui/toast.js';

const storage = new Storage('eco');
const toast = Toast();

function nextRoute() {
  return storage.get('agreements.accepted', false) ? 'dashboard' : 'agreements';
}

export default function AuthOtp() {
  const phone = storage.get('auth.phone', '');
  if (!phone) {
    location.hash = '#/auth';
    return document.createElement('div');
  }

  const el = document.createElement('div');
  el.className = 'auth-otp';

  const h1 = document.createElement('h1');
  const info = document.createElement('p');
  info.className = 'auth-otp__info';

  const inputsWrap = document.createElement('div');
  inputsWrap.className = 'auth-otp__inputs';
  const inputs = [];
  for (let i = 0; i < 6; i++) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.maxLength = 1;
    inp.className = 'auth-otp__input';
    inp.addEventListener('input', () => {
      const v = inp.value.replace(/\D/g, '').slice(0, 1);
      inp.value = v;
      if (v && i < 5) inputs[i + 1].focus();
      updateConfirm();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
    });
    inputsWrap.appendChild(inp);
    inputs.push(inp);
  }

  const controls = document.createElement('div');
  controls.className = 'auth-otp__controls';
  const resend = document.createElement('button');
  resend.type = 'button';
  resend.className = 'auth-otp__resend';
  resend.disabled = true;
  const timerEl = document.createElement('span');
  timerEl.className = 'auth-otp__timer';
  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.className = 'auth-otp__confirm';
  confirm.disabled = true;
  controls.append(resend, timerEl, confirm);

  el.append(h1, info, inputsWrap, controls);

  setTimeout(() => inputs[0].focus(), 0);

  function updateConfirm() {
    const filled = inputs.every((inp) => inp.value.length === 1);
    confirm.disabled = !filled;
    confirm.setAttribute('aria-disabled', String(confirm.disabled));
  }

  confirm.addEventListener('click', async () => {
    const code = inputs.map((i) => i.value).join('');
    confirm.disabled = true;
    confirm.classList.add('loading');
    confirm.setAttribute('aria-disabled', 'true');
    // TODO: replace verifyOtpMock with Firebase confirmation result
    const res = await verifyOtpMock(phone, code);
    confirm.classList.remove('loading');
    if (res.ok) {
      storage.set('user.auth', true);
      storage.remove('auth.otpCooldown');
      location.hash = `#/${nextRoute()}`;
    } else {
      const key = res.code === 'ATTEMPTS_EXCEEDED' ? 'attempts' : 'invalidCode';
      toast.show(t(`auth.errors.${key}`));
      confirm.disabled = false;
      confirm.setAttribute('aria-disabled', 'false');
    }
  });

  resend.addEventListener('click', async () => {
    resend.disabled = true;
    resend.classList.add('loading');
    resend.setAttribute('aria-disabled', 'true');
    const res = await sendOtpMock(phone);
    resend.classList.remove('loading');
    if (res.ok) {
      cooldown = Date.now() + 60000;
      storage.set('auth.otpCooldown', cooldown);
      startTimer();
    } else {
      const key = res.code === 'SMS_LIMIT' ? 'smsLimit' : 'blocked';
      toast.show(t(`auth.errors.${key}`));
      updateTimer();
    }
  });

  let cooldown = storage.get('auth.otpCooldown', 0);
  let interval;
  function updateTimer() {
    const diff = Math.max(0, Math.ceil((cooldown - Date.now()) / 1000));
    if (diff > 0) {
      timerEl.textContent = t('auth.otp.resendIn', { s: diff });
      resend.disabled = true;
      resend.setAttribute('aria-disabled', 'true');
    } else {
      timerEl.textContent = '';
      resend.disabled = false;
      resend.setAttribute('aria-disabled', 'false');
      if (interval) clearInterval(interval);
    }
  }
  function startTimer() {
    updateTimer();
    if (cooldown > Date.now()) {
      if (interval) clearInterval(interval);
      interval = setInterval(updateTimer, 1000);
    }
  }
  startTimer();

  function updateTexts() {
    h1.textContent = t('auth.otp.title');
    info.textContent = t('auth.otp.sentTo', { phone });
    resend.textContent = t('auth.otp.resend');
    confirm.textContent = t('auth.otp.confirm');
    inputs.forEach((inp, idx) => inp.setAttribute('aria-label', t('auth.otp.digit', { n: idx + 1 })));
    updateTimer();
  }
  onLangChange(updateTexts);
  updateTexts();

  return el;
}
