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
    start: 'Начать'
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
  updateSlide();
}

document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const onboarding = document.getElementById('onboarding');
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
      app.classList.remove('hidden');
    } else {
      updateSlide();
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});

let slideIndex = 0;

function updateSlide() {
  const t = translations[currentLang];
  const slide = t.slides[slideIndex];
  document.getElementById('slide-title').textContent = slide.title;
  document.getElementById('slide-desc').textContent = slide.desc;
  document.getElementById('next-btn').textContent =
    slideIndex === t.slides.length - 1 ? t.start : t.next;
}
