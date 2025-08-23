import { setLanguage } from '../../utils/i18n.js';

const FLAGS = { kz: '🇰🇿', ru: '🇷🇺', en: '🇬🇧' };
const LANGS = ['kz','ru','en'];

export default function Header() {
  const el = document.createElement('header');
  LANGS.forEach(lang => {
    const btn = document.createElement('button');
    btn.textContent = FLAGS[lang];
    btn.addEventListener('click', () => setLanguage(lang));
    el.appendChild(btn);
  });
  return el;
}
