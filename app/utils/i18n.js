import Storage from './storage.js';

const storage = new Storage('ecobike');
const SUPPORTED = ['kz', 'ru', 'en'];
let currentLang = 'kz';
let dict = {};

function detect() {
  const nav = navigator.language?.slice(0,2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : 'kz';
}

export async function setLanguage(lang) {
  if (!SUPPORTED.includes(lang)) lang = 'kz';
  const res = await fetch(`./i18n/${lang}.json`);
  dict = await res.json();
  currentLang = lang;
  storage.set('lang', lang);
  document.documentElement.lang = lang;
}

export async function initI18n() {
  const saved = storage.get('lang');
  await setLanguage(saved || detect());
}

export function t(path) {
  return path.split('.').reduce((o,p) => o?.[p], dict) || path;
}

export function getLang() {
  return currentLang;
}

export default { initI18n, setLanguage, t, getLang };
