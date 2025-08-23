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
    invalidNumber: 'Нөмір қате',
    agreementsTitle: 'Бастамас бұрын',
    read: 'Толық оқу',
    continue: 'Жалғастыру',
    agreements: [
      {
        title: 'Пайдаланушы келісімі',
        desc: 'Қолдану шарттары',
        accept: 'Шарттармен келісемін'
      },
      {
        title: 'Құпиялылық саясаты',
        desc: 'Деректерді пайдалану',
        accept: 'Деректерді өңдеуге келісемін'
      },
      {
        title: 'Қауіпсіздік ережелері',
        desc: 'Қауіпсіз жүру қағидалары',
        accept: 'Ережелермен таныстым'
      }
    ]
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
    invalidNumber: 'Неверный номер',
    agreementsTitle: 'Перед началом работы',
    read: 'Читать полностью',
    continue: 'Продолжить',
    agreements: [
      {
        title: 'Пользовательское соглашение',
        desc: 'Основные условия',
        accept: 'Принимаю условия'
      },
      {
        title: 'Политика конфиденциальности',
        desc: 'Обработка персональных данных',
        accept: 'Согласен на обработку данных'
      },
      {
        title: 'Правила безопасности',
        desc: 'Требования по эксплуатации',
        accept: 'Ознакомлен с правилами'
      }
    ]
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
    invalidNumber: 'Invalid number',
    agreementsTitle: 'Before you start',
    read: 'Read full',
    continue: 'Continue',
    agreements: [
      {
        title: 'User Agreement',
        desc: 'Terms of use',
        accept: 'I accept the terms'
      },
      {
        title: 'Privacy Policy',
        desc: 'Personal data processing',
        accept: 'I agree to data processing'
      },
      {
        title: 'Safety Rules',
        desc: 'Safe riding guidelines',
        accept: 'I have read the rules'
      }
    ]
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
  document.getElementById('agreements-title').textContent = t.agreementsTitle;
  document.getElementById('agreements-continue').textContent = t.continue;
  updateAgreementsText();
  updateCodeSentText();
  updateSlide();
}

document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const onboarding = document.getElementById('onboarding');
  const auth = document.getElementById('auth');
  const phoneScreen = document.getElementById('phone-screen');
  const otpScreen = document.getElementById('otp-screen');
  const agreements = document.getElementById('agreements');
  const app = document.getElementById('app');
  const phoneInput = document.getElementById('phone');
  const getCodeBtn = document.getElementById('get-code-btn');
  const otpInputs = document.querySelectorAll('.otp-inputs input');

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

  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const doc = btn.parentElement.dataset.doc;
      alert('open ' + doc);
    });
  });

  const agreementChecks = document.querySelectorAll('#agreements input[type="checkbox"]');
  agreementChecks.forEach(ch => {
    ch.addEventListener('change', () => {
      const allChecked = Array.from(agreementChecks).every(c => c.checked);
      document.getElementById('agreements-continue').disabled = !allChecked;
    });
  });

  document.getElementById('agreements-continue').addEventListener('click', () => {
    agreements.classList.add('hidden');
    app.classList.remove('hidden');
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

function updateAgreementsText() {
  const t = translations[currentLang].agreements;
  document.getElementById('user-agreement-title').textContent = t[0].title;
  document.getElementById('user-agreement-desc').textContent = t[0].desc;
  document.getElementById('user-agreement-accept').textContent = t[0].accept;
  document.getElementById('privacy-title').textContent = t[1].title;
  document.getElementById('privacy-desc').textContent = t[1].desc;
  document.getElementById('privacy-accept').textContent = t[1].accept;
  document.getElementById('safety-title').textContent = t[2].title;
  document.getElementById('safety-desc').textContent = t[2].desc;
  document.getElementById('safety-accept').textContent = t[2].accept;
  document.querySelectorAll('.agreement .read-btn').forEach(btn => {
    btn.textContent = translations[currentLang].read;
  });
}

function verifyOtp() {
  const code = Array.from(document.querySelectorAll('.otp-inputs input'))
    .map(i => i.value)
    .join('');
  if (code.length === 6) {
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('agreements').classList.remove('hidden');
  }
}
