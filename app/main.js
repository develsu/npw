const translations = {
  kz: {
    greeting: 'Сәлем, EcoBike!',
    cityLabel: 'Қаласыңызды таңдаңыз',
    slides: [
      { title: 'EcoBike-қа қош келдіңіз', desc: 'Қаланы кезіп жүріңіз' },
      { title: 'Қалай жұмыс істейді', desc: 'Сканерлеу → Ауыстыру → Жүру' },
      { title: 'Тарифті таңдаңыз', desc: '2 ауыстырудан шексізге дейін' },
    ],
    next: 'Келесі',

    start: 'Бастау',
    authTitle: 'Телефон нөмірін енгізіңіз',
    getCode: 'Код алу',
    codeSent: 'Код жіберілді: {phone}',
    resend: 'Қайта жіберу',
    changeNumber: 'Нөмірді өзгерту',
    help: 'Көмек',
    invalidNumber: 'Нөмір қате'
    start: 'Бастау'

  },
  ru: {
    greeting: 'Привет, EcoBike!',
    cityLabel: 'Выберите ваш город',
    slides: [
      { title: 'Добро пожаловать в EcoBike', desc: 'Свобода передвижения по городу' },
      { title: 'Как это работает', desc: 'Сканируй → Меняй → Катайся' },
      { title: 'Выбери тариф', desc: 'От 2 замен в день до безлимита' },
    ],
    next: 'Далее',
    start: 'Начать',
    authTitle: 'Введите номер телефона',
    getCode: 'Получить код',
    codeSent: 'Код отправлен на {phone}',
    resend: 'Отправить снова',
    changeNumber: 'Изменить номер',
    help: 'Помощь',
    invalidNumber: 'Неверный номер'

  },
  en: {
    greeting: 'Hello, EcoBike!',
    cityLabel: 'Select your city',
    slides: [
      { title: 'Welcome to EcoBike', desc: 'Ride freely around the city' },
      { title: 'How it works', desc: 'Scan → Swap → Ride' },
      { title: 'Choose your plan', desc: 'From 2 swaps a day to unlimited' },
    ],
    next: 'Next',

    start: 'Start',
    authTitle: 'Enter phone number',
    getCode: 'Get code',
    codeSent: 'Code sent to {phone}',
    resend: 'Resend',
    changeNumber: 'Change number',
    help: 'Help',
    invalidNumber: 'Invalid number'

    start: 'Start'

  }
};

const languages = ['kz', 'ru', 'en'];

function detectLanguage() {
  const lang = navigator.language.slice(0, 2).toLowerCase();
  return languages.includes(lang) ? lang : 'kz';
}

let currentLang = detectLanguage();

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.getElementById('greeting').textContent = t.greeting;
  document.getElementById('city-label').textContent = t.cityLabel;

  document.getElementById('auth-title').textContent = t.authTitle;
  document.getElementById('get-code-btn').textContent = t.getCode;
  document.getElementById('help-btn').textContent = t.help;
  document.getElementById('resend-btn').textContent = t.resend;
  document.getElementById('change-number-btn').textContent = t.changeNumber;
  updateCodeSentText();
  updateSlide();
}

document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const onboarding = document.getElementById('onboarding');

  const auth = document.getElementById('auth');
  const phoneScreen = document.getElementById('phone-screen');
  const otpScreen = document.getElementById('otp-screen');
  const app = document.getElementById('app');
  const phoneInput = document.getElementById('phone');
  const getCodeBtn = document.getElementById('get-code-btn');
  const otpInputs = document.querySelectorAll('.otp-inputs input');
  const app = document.getElementById('app');

  setLanguage(currentLang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  setTimeout(() => {
    splash.classList.add('hidden');
    onboarding.classList.remove('hidden');
  }, 2000);

  document.getElementById('next-btn').addEventListener('click', () => {
    slideIndex++;
    if (slideIndex >= translations[currentLang].slides.length) {
      onboarding.classList.add('hidden');

      auth.classList.remove('hidden');
      app.classList.remove('hidden');

    } else {
      updateSlide();
    }
  });


  phoneInput.addEventListener('input', maskPhoneInput);

  getCodeBtn.addEventListener('click', () => {
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length !== 11) {
      alert(translations[currentLang].invalidNumber);
      return;
    }
    codeSentPhone = formatDisplay(digits);
    phoneScreen.classList.add('hidden');
    otpScreen.classList.remove('hidden');
    updateCodeSentText();
    otpInputs[0].focus();
  });

  otpInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1) {
        if (idx < otpInputs.length - 1) {
          otpInputs[idx + 1].focus();
        } else {
          verifyOtp();
        }
      }
    });
  });

  document.getElementById('change-number-btn').addEventListener('click', () => {
    otpInputs.forEach(i => (i.value = ''));
    otpScreen.classList.add('hidden');
    phoneScreen.classList.remove('hidden');
  });

  document.getElementById('resend-btn').addEventListener('click', () => {
    updateCodeSentText();
  });

  document.getElementById('help-btn').addEventListener('click', () => {
    alert('support@ecobike.kz');
  });


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});

let slideIndex = 0;

let codeSentPhone = '';


function updateSlide() {
  const t = translations[currentLang];
  const slide = t.slides[slideIndex];
  document.getElementById('slide-title').textContent = slide.title;
  document.getElementById('slide-desc').textContent = slide.desc;
  document.getElementById('next-btn').textContent =
    slideIndex === t.slides.length - 1 ? t.start : t.next;
}


function maskPhoneInput(e) {
  let digits = e.target.value.replace(/\D/g, '');
  if (!digits.startsWith('7')) {
    digits = '7' + digits;
  }
  digits = digits.slice(0, 11);
  e.target.value = formatDisplay(digits);
}

function formatDisplay(digits) {
  const d = digits.slice(-10);
  return `+7 ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
}

function updateCodeSentText() {
  if (codeSentPhone) {
    document.getElementById('code-sent-text').textContent =
      translations[currentLang].codeSent.replace('{phone}', codeSentPhone);
  }
}

function verifyOtp() {
  const code = Array.from(document.querySelectorAll('.otp-inputs input'))
    .map(i => i.value)
    .join('');
  if (code.length === 6) {
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  }
}
