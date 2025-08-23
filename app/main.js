import { detectLanguage, setLanguage } from './translations.js';
import { populateCitySelect } from './cities.js';
import { registerSW } from './register-sw.js';

document.addEventListener('DOMContentLoaded', () => {
  const lang = detectLanguage();
  setLanguage(lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  populateCitySelect(document.getElementById('city'));
  registerSW();

const translations = {
  kz: { greeting: 'Сәлем, EcoBike!', cityLabel: 'Қаласыңызды таңдаңыз' },
  ru: { greeting: 'Привет, EcoBike!', cityLabel: 'Выберите ваш город' },
  en: { greeting: 'Hello, EcoBike!', cityLabel: 'Select your city' }
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
  document.getElementById('greeting').textContent = t.greeting;
  document.getElementById('city-label').textContent = t.cityLabel;
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

});
