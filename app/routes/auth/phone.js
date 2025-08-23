import { t, onLangChange } from '../../utils/i18n.js';
import { formatPhoneKZ } from '../../utils/format.js';
import { sendOtpMock } from '../../utils/net.js';
import Storage from '../../utils/storage.js';
import Toast from '../../components/ui/toast.js';

const storage = new Storage('eco');
const toast = Toast();

function maskPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let res = '+7';
  if (digits.length > 0) res += ' ' + digits.slice(0, 3);
  if (digits.length > 3) res += ' ' + digits.slice(3, 6);
  if (digits.length > 6) res += ' ' + digits.slice(6, 8);
  if (digits.length > 8) res += ' ' + digits.slice(8, 10);
  return res;
}

export default function AuthPhone() {
  const el = document.createElement('div');
  el.className = 'auth-phone';

  const h1 = document.createElement('h1');

  const form = document.createElement('form');
  form.className = 'auth-phone__form';

  const label = document.createElement('label');
  const span = document.createElement('span');
  const input = document.createElement('input');
  input.type = 'tel';
  input.inputMode = 'tel';
  input.placeholder = '+7 000 000 00 00';
  label.append(span, input);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.disabled = true;

  const help = document.createElement('a');
  help.href = '#';
  help.className = 'auth-phone__help';

  form.append(label, btn);
  el.append(h1, form, help);

  function updateTexts() {
    h1.textContent = t('auth.title');
    span.textContent = t('auth.phone');
    input.placeholder = t('auth.phonePlaceholder');
    input.setAttribute('aria-label', t('auth.phone'));
    btn.textContent = t('auth.getCode');
    btn.setAttribute('aria-label', t('auth.getCode'));
    help.textContent = t('auth.smsHelp');
  }
  onLangChange(updateTexts);
  updateTexts();

  const stored = storage.get('auth.phone', '');
  if (stored) {
    input.value = stored;
  }
  function onInput() {
    input.value = maskPhone(input.value);
    const valid = !!formatPhoneKZ(input.value);
    btn.disabled = !valid;
    btn.setAttribute('aria-disabled', String(btn.disabled));
  }
  input.addEventListener('input', onInput);
  onInput();

  help.addEventListener('click', (e) => e.preventDefault());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = formatPhoneKZ(input.value);
    if (!phone) {
      toast.show(t('auth.errors.invalidPhone'));
      return;
    }
    btn.disabled = true;
    btn.classList.add('loading');
    btn.setAttribute('aria-disabled', 'true');
    // TODO: replace sendOtpMock with Firebase signInWithPhoneNumber
    const res = await sendOtpMock(phone);
    btn.classList.remove('loading');
    if (res.ok) {
      storage.set('auth.phone', phone);
      storage.set('auth.otpCooldown', Date.now() + 60000);
      location.hash = '#/auth/otp';
    } else {
      const key = res.code === 'SMS_LIMIT' ? 'smsLimit' : 'blocked';
      toast.show(t(`auth.errors.${key}`));
      btn.disabled = false;
      btn.setAttribute('aria-disabled', 'false');
    }
  });

  return el;
}
