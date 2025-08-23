import { t, setLang, getLang, onLangChange } from '../../utils/i18n.js';

const LANGS = ['kz', 'ru', 'en'];

export default function Header() {
  const el = document.createElement('header');
  el.className = 'header';

  const logo = document.createElement('div');
  logo.className = 'header__logo';
  logo.textContent = t('common.appName');
  el.appendChild(logo);

  const langs = document.createElement('div');
  langs.className = 'header__langs';
  LANGS.forEach((lang) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header__lang';
    btn.dataset.lang = lang;
    btn.setAttribute('aria-label', `${t('header.language')}: ${lang.toUpperCase()}`);
    const img = document.createElement('img');
    img.src = `assets/icons/flags/${lang}.svg`;
    img.alt = lang;
    btn.appendChild(img);
    btn.addEventListener('click', () => setLang(lang));
    langs.appendChild(btn);
  });
  el.appendChild(langs);

  const help = document.createElement('button');
  help.type = 'button';
  help.className = 'header__help';
  help.textContent = t('header.help');
  help.setAttribute('aria-label', t('header.help'));
  el.appendChild(help);

  function update() {
    logo.textContent = t('common.appName');
    help.textContent = t('header.help');
    help.setAttribute('aria-label', t('header.help'));
    const current = getLang();
    el.querySelectorAll('.header__lang').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === current);
      btn.setAttribute('aria-label', `${t('header.language')}: ${btn.dataset.lang.toUpperCase()}`);
    });
  }

  update();
  onLangChange(update);

  return el;
}
