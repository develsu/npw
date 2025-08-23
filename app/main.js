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
});
