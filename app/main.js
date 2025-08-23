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

    registrationTitle: 'Тіркелу',
    chooseCity: 'Қаласыңызды таңдаңыз',
    detectCity: 'GPS арқылы анықтау',
    fullName: 'Аты-жөні',
    iin: 'ЖСН',
    dob: 'Туған күні',
    email: 'Email (міндетті емес)',
    region: 'Аудан/шағын аудан',
    street: 'Көше және үй',
    apt: 'Пәтер (міндетті емес)',
    register: 'Тіркелу',
    selectCityError: 'Алдымен қалаңызды таңдаңыз',
    invalidIIN: 'ЖСН 12 саннан тұруы керек',
    ageError: 'Тек 18 жастан бастап',
    fillRequired: 'Міндетті өрістерді толтырыңыз',

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

    ],
    viewTariffs: 'Тарифтер',
    tariffsTitle: 'Тарифтік жоспарлар',
    close: 'Жабу',
    tariffs: [
      {
        name: 'Start',
        price: '10 000₸/ай (~333₸/күн)',
        features: [
          'Күніне 2 аккумулятор ауыстыру',
          'Айына бір рет станцияда тегін ТО',
          'Қолдау қызметі (9:00-18:00)',
          'Батареяға 6 ай кепілдік',
          'Стандартты қызмет келісімі'
        ]
      },
      {
        name: 'Standard',
        price: '15 000₸/ай (~500₸/күн)',
        features: [
          'Күніне 5 аккумулятор ауыстыру',
          'Әр екі аптада бір рет тегін выездной ТО',
          'GPS мониторингі қосылған',
          'Қолдау қызметі (24/7)',
          'Батареяға 12 ай кепілдік',
          'Кеңейтілген қызмет келісімі'
        ]
      },
      {
        name: 'Enterprise',
        price: '25 000₸/ай (~833₸/күн)',
        features: [
          'Шексіз ауыстырулар',
          'Сұрау бойынша приоритетті выездной ТО',
          'GPS мониторингі + аналитика',
          'Жеке менеджер',
          '24/7 қолдау + телефон',
          'Батареяға 24 ай кепілдік',
          'VIP қызмет келісімі'
        ]
      },
      {
        name: 'Аренда',
        price: '35 000₸/апта (минимум 1 апта)',
        features: [
          'Start тарифі қосылған (күніне 2 ауыстыру)',
          'Апта сайын алдын ала төлем',
          'Велосипедке кепілдік пен құжаттарсыз',
          'Тек станцияда ТО',
          'Қысқа мерзімді аренда келісімі',
          'Выкуп жоқ',
          'Аренда мерзіміне кепілдік'
        ]
      },
      {
        name: 'Лизинг',
        price: '35 000₸/апта × 12-52 апта',
        features: [
          'Standard тарифі қосылған (күніне 5 ауыстыру)',
          'Мерзімі: 3-12 ай',
          'Выкуп: аяқталғаннан кейін 55 000₸',
          'GPS мониторингі қосылған',
          'Выездной ТО қосылған',
          'Толық лизинг келісімі',
          'Велосипед сақтандыру',
          'Ерте выкуп құқығы'
        ]
      }
    ]

    ]

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
    invalidNumber: 'Неверный номер',
    agreementsTitle: 'Перед началом работы',
    read: 'Читать полностью',
    continue: 'Продолжить',

    registrationTitle: 'Регистрация',
    chooseCity: 'Выберите ваш город',
    detectCity: 'Определить по GPS',
    fullName: 'ФИО',
    iin: 'ИИН',
    dob: 'Дата рождения',
    email: 'Email (опционально)',
    region: 'Район/микрорайон',
    street: 'Улица и дом',
    apt: 'Квартира (опционально)',
    register: 'Зарегистрироваться',
    selectCityError: 'Сначала выберите город',
    invalidIIN: 'ИИН должен состоять из 12 цифр',
    ageError: 'Доступно только с 18 лет',
    fillRequired: 'Заполните обязательные поля',

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

    ],
    viewTariffs: 'Тарифы',
    tariffsTitle: 'Тарифные планы',
    close: 'Закрыть',
    tariffs: [
      {
        name: 'Start',
        price: '10 000₸/мес (~333₸/день)',
        features: [
          '2 замены аккумуляторов в день',
          'Бесплатное ТО на станции (раз в месяц)',
          'Техподдержка в приложении (9:00-18:00)',
          'Гарантия на батарею 6 месяцев',
          'Стандартный договор обслуживания'
        ]
      },
      {
        name: 'Standard',
        price: '15 000₸/мес (~500₸/день)',
        features: [
          '5 замен аккумуляторов в день',
          'Бесплатное выездное ТО (раз в 2 недели)',
          'GPS мониторинг включен',
          'Техподдержка в приложении (24/7)',
          'Гарантия на батарею 12 месяцев',
          'Расширенный договор обслуживания'
        ]
      },
      {
        name: 'Enterprise',
        price: '25 000₸/мес (~833₸/день)',
        features: [
          'Безлимитные замены',
          'Приоритетное выездное ТО (по требованию)',
          'GPS мониторинг + аналитика',
          'Персональный менеджер',
          'Техподдержка 24/7 + телефон',
          'Гарантия на батарею 24 месяца',
          'VIP договор обслуживания'
        ]
      },
      {
        name: 'Аренда',
        price: '35 000₸/неделя (минимум 1 неделя)',
        features: [
          'Тариф Start включен (2 замены/день)',
          'Оплата по неделям вперед',
          'Без залога и документов на велосипед',
          'Только ТО на станции',
          'Договор краткосрочной аренды',
          'Выкуп невозможен',
          'Гарантия на период аренды'
        ]
      },
      {
        name: 'Лизинг',
        price: '35 000₸/неделя × 12-52 недели',
        features: [
          'Тариф Standard включен (5 замен/день)',
          'Срок: от 3 до 12 месяцев',
          'Выкуп: 55 000₸ после завершения',
          'GPS мониторинг включен',
          'Выездное ТО включено',
          'Полный лизинговый договор',
          'Страхование велосипеда',
          'Право досрочного выкупа'
        ]
      }
    ]

    ]

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
    invalidNumber: 'Invalid number',
    agreementsTitle: 'Before you start',
    read: 'Read full',
    continue: 'Continue',

    registrationTitle: 'Registration',
    chooseCity: 'Select your city',
    detectCity: 'Detect via GPS',
    fullName: 'Full name',
    iin: 'IIN',
    dob: 'Date of birth',
    email: 'Email (optional)',
    region: 'District',
    street: 'Street and house',
    apt: 'Apartment (optional)',
    register: 'Register',
    selectCityError: 'Please select a city',
    invalidIIN: 'IIN must be 12 digits',
    ageError: '18+ only',
    fillRequired: 'Fill required fields',

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

    ],
    viewTariffs: 'Plans',
    tariffsTitle: 'Tariff plans',
    close: 'Close',
    tariffs: [
      {
        name: 'Start',
        price: '10,000₸/month (~333₸/day)',
        features: [
          '2 battery swaps per day',
          'Free station maintenance (once a month)',
          'In-app support (9am-6pm)',
          '6-month battery warranty',
          'Standard service contract'
        ]
      },
      {
        name: 'Standard',
        price: '15,000₸/month (~500₸/day)',
        features: [
          '5 battery swaps per day',
          'Free on-site maintenance (every 2 weeks)',
          'GPS tracking included',
          'In-app support (24/7)',
          '12-month battery warranty',
          'Extended service contract'
        ]
      },
      {
        name: 'Enterprise',
        price: '25,000₸/month (~833₸/day)',
        features: [
          'Unlimited swaps',
          'Priority on-site maintenance (on demand)',
          'GPS tracking + analytics',
          'Personal manager',
          '24/7 support + phone line',
          '24-month battery warranty',
          'VIP service contract'
        ]
      },
      {
        name: 'Rent',
        price: '35,000₸/week (min 1 week)',
        features: [
          'Start plan included (2 swaps/day)',
          'Pay weekly in advance',
          'No deposit or bike documents',
          'Station maintenance only',
          'Short-term rental agreement',
          'No buyout option',
          'Warranty for rental period'
        ]
      },
      {
        name: 'Leasing',
        price: '35,000₸/week × 12-52 weeks',
        features: [
          'Standard plan included (5 swaps/day)',
          'Term: 3 to 12 months',
          'Buyout: 55,000₸ after completion',
          'GPS tracking included',
          'On-site maintenance included',
          'Full leasing contract',
          'Bike insurance',
          'Early buyout option'
        ]
      }
    ]

    ]

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

  document.getElementById('agreements-title').textContent = t.agreementsTitle;
  document.getElementById('agreements-continue').textContent = t.continue;
  document.getElementById('registration-title').textContent = t.registrationTitle;
  document.getElementById('city-grid-title').textContent = t.chooseCity;
  document.getElementById('detect-city').textContent = t.detectCity;
  document.getElementById('full-name-label').textContent = t.fullName;
  document.getElementById('iin-label').textContent = t.iin;
  document.getElementById('dob-label').textContent = t.dob;
  document.getElementById('email-label').textContent = t.email;
  document.getElementById('region-label').textContent = t.region;
  document.getElementById('street-label').textContent = t.street;
  document.getElementById('apt-label').textContent = t.apt;
  document.getElementById('register-btn').textContent = t.register;
  document.getElementById('view-tariffs').textContent = t.viewTariffs;
  renderTariffs();
  updateAgreementsText();


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

  const registration = document.getElementById('registration');
  const cityGrid = document.getElementById('city-grid');
  const detectCityBtn = document.getElementById('detect-city');
  const regForm = document.getElementById('reg-form');

  const auth = document.getElementById('auth');
  const phoneScreen = document.getElementById('phone-screen');
  const otpScreen = document.getElementById('otp-screen');

  const app = document.getElementById('app');
  const phoneInput = document.getElementById('phone');
  const getCodeBtn = document.getElementById('get-code-btn');
  const otpInputs = document.querySelectorAll('.otp-inputs input');

  const tariffsSection = document.getElementById('tariffs');
  const viewTariffsBtn = document.getElementById('view-tariffs');
  const closeTariffsBtn = document.getElementById('close-tariffs');
  const appMain = document.querySelector('#app main');

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


  viewTariffsBtn.addEventListener('click', () => {
    appMain.classList.add('hidden');
    tariffsSection.classList.remove('hidden');
  });

  closeTariffsBtn.addEventListener('click', () => {
    tariffsSection.classList.add('hidden');
    appMain.classList.remove('hidden');
  });

  document.getElementById('agreements-continue').addEventListener('click', () => {
    agreements.classList.add('hidden');
    registration.classList.remove('hidden');
  });

  cityGrid.addEventListener('click', e => {
    if (e.target.classList.contains('city-btn')) {
      document.querySelectorAll('.city-btn').forEach(btn => btn.classList.remove('selected'));
      e.target.classList.add('selected');
      selectedCity = e.target.dataset.city;
    }
  });

  detectCityBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        selectedCity = 'almaty';
        document.querySelectorAll('.city-btn').forEach(btn => {
          btn.classList.toggle('selected', btn.dataset.city === selectedCity);
        });
      });
    }
  });

  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const t = translations[currentLang];
    const fullName = document.getElementById('full-name').value.trim();
    const iin = document.getElementById('iin').value.trim();
    const dob = document.getElementById('dob').value;
    const region = document.getElementById('region').value.trim();
    const street = document.getElementById('street').value.trim();
    if (!selectedCity) {
      alert(t.selectCityError);
      return;
    }
    if (!/^\d{12}$/.test(iin)) {
      alert(t.invalidIIN);
      return;
    }
    if (!isAdult(dob)) {
      alert(t.ageError);
      return;
    }
    if (!fullName || !region || !street) {
      alert(t.fillRequired);
      return;
    }
    registration.classList.add('hidden');
    app.classList.remove('hidden');
    document.getElementById('city').value = selectedCity;
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
let selectedCity = '';


let codeSentPhone = '';


let codeSentPhone = '';



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


function renderTariffs() {
  const t = translations[currentLang];
  document.getElementById('tariffs-title').textContent = t.tariffsTitle;
  document.getElementById('close-tariffs').textContent = t.close;
  const plansContainer = document.getElementById('plans');
  plansContainer.innerHTML = '';
  t.tariffs.forEach(plan => {
    const div = document.createElement('div');
    div.className = 'plan-card';
    div.innerHTML = `<h3>${plan.name}</h3><p class="price">${plan.price}</p><ul>${plan.features
      .map(f => `<li>${f}</li>`)
      .join('')}</ul>`;
    plansContainer.appendChild(div);
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

function isAdult(dob) {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;


    document.getElementById('agreements').classList.remove('hidden');

    document.getElementById('app').classList.remove('hidden');

  }

}
