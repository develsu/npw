import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { isNameValid, isEmailValid, isIINValid, isAdult, isAddressValid } from '../utils/validators.js';
import Uploader from '../components/kyc/Uploader.js';
import { isAllAccepted } from '../utils/agreements.js';

const storage = new Storage('eco');

export default function Register() {
  const city = storage.get('profile.city');
  if (!city) {
    location.hash = '#/city';
    return document.createElement('div');
  }

  const el = document.createElement('div');
  el.className = 'register-screen';

  const h1 = document.createElement('h1');

  const form = document.createElement('form');
  form.className = 'register-screen__form';

  function makeInput(type = 'text') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');
    input.type = type;
    label.append(span, input);
    return { label, span, input };
  }

  const fio = makeInput('text');
  const iin = makeInput('text');
  const dob = makeInput('date');
  const email = makeInput('email');
  const region = makeInput('text');
  const street = makeInput('text');
  const apt = makeInput('text');

  const kycWrap = document.createElement('div');
  kycWrap.className = 'register-screen__kyc';
  const idFront = Uploader();
  const idBack = Uploader();
  const selfie = Uploader({ capture: 'user' });
  kycWrap.append(idFront, idBack, selfie);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'register-screen__submit';
  submit.disabled = true;

  form.append(
    fio.label,
    iin.label,
    dob.label,
    email.label,
    region.label,
    street.label,
    apt.label,
    kycWrap,
    submit
  );
  el.append(h1, form);

  const stored = storage.get('profile', {});
  if (stored.fio) fio.input.value = stored.fio;
  if (stored.iin) iin.input.value = stored.iin;
  if (stored.dob) dob.input.value = stored.dob;
  if (stored.email) email.input.value = stored.email;
  if (stored.address) {
    region.input.value = stored.address.region || '';
    street.input.value = stored.address.street || '';
    apt.input.value = stored.address.apt || '';
  }

  function validate() {
    const fioValid = isNameValid(fio.input.value.trim());
    const iinValid = isIINValid(iin.input.value.trim(), dob.input.value);
    const adult = isAdult(dob.input.value);
    const emailValid = !email.input.value || isEmailValid(email.input.value.trim());
    const address = { region: region.input.value.trim(), street: street.input.value.trim(), apt: apt.input.value.trim() };
    const addressValid = isAddressValid(address);
    const photosValid = idFront.getData() && idBack.getData() && selfie.getData();
    const ok = fioValid && iinValid && adult && emailValid && addressValid && photosValid;
    submit.disabled = !ok;
    submit.setAttribute('aria-disabled', String(submit.disabled));
  }

  [fio.input, iin.input, dob.input, email.input, region.input, street.input, apt.input].forEach((inp) => {
    inp.addEventListener('input', validate);
  });
  [idFront, idBack, selfie].forEach((u) => u.addEventListener('change', validate));
  validate();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const profile = {
      fio: fio.input.value.trim(),
      iin: iin.input.value.trim(),
      dob: dob.input.value,
      email: email.input.value.trim() || null,
      address: {
        region: region.input.value.trim(),
        street: street.input.value.trim(),
        apt: apt.input.value.trim() || null
      },
      city
    };
    storage.set('profile', profile);
    const kyc = {
      idFront: idFront.getData(),
      idBack: idBack.getData(),
      selfie: selfie.getData()
    };
    storage.set('kyc', kyc);
    // TODO: upload to backend
    location.hash = `#/${isAllAccepted() ? 'dashboard' : 'agreements'}`;
  });

  function updateTexts() {
    h1.textContent = t('register.title');
    fio.span.textContent = t('register.fio');
    fio.input.setAttribute('aria-label', t('register.fio'));
    iin.span.textContent = t('register.iin');
    iin.input.setAttribute('aria-label', t('register.iin'));
    dob.span.textContent = t('register.dob');
    dob.input.setAttribute('aria-label', t('register.dob'));
    email.span.textContent = t('register.email');
    email.input.setAttribute('aria-label', t('register.email'));
    region.span.textContent = t('register.region');
    street.span.textContent = t('register.street');
    apt.span.textContent = t('register.apt');
    idFront.setLabel('register.idFront');
    idBack.setLabel('register.idBack');
    selfie.setLabel('register.selfie');
    submit.textContent = t('register.submit');
    submit.setAttribute('aria-label', t('register.submit'));
  }
  onLangChange(updateTexts);
  updateTexts();

  return el;
}
