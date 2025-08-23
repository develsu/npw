export const translations = {
  kz: { greeting: 'Сәлем, EcoBike!', cityLabel: 'Қаласыңызды таңдаңыз' },
  ru: { greeting: 'Привет, EcoBike!', cityLabel: 'Выберите ваш город' },
  en: { greeting: 'Hello, EcoBike!', cityLabel: 'Select your city' }
};

const languages = Object.keys(translations);

export function detectLanguage() {
  const lang = navigator.language.slice(0, 2).toLowerCase();
  return languages.includes(lang) ? lang : 'kz';
}

export function setLanguage(lang) {
  const t = translations[lang];
  document.getElementById('greeting').textContent = t.greeting;
  document.getElementById('city-label').textContent = t.cityLabel;
}
