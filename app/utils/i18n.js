import Storage from './storage.js';
import loadJson from './loadJson.js';

const storage = new Storage('eco');
const SUPPORTED = ['kz', 'ru', 'en'];
let currentLang = 'kz';
let dict = {};

const bus = new EventTarget();

function resolve(path, obj) {
  return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
}

function interpolate(str, params) {
  return Object.keys(params).reduce((s, k) => s.replace(new RegExp(`{${k}}`, 'g'), params[k]), str);
}

async function load(lang) {
  dict = await loadJson(`./i18n/${lang}.json`);
  currentLang = lang;
  storage.set('lang', lang);
  document.documentElement.lang = lang;
}

export async function setLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = 'kz';
  await load(lang);
  bus.dispatchEvent(new Event('i18n:changed'));
}

export function getLang() {
  return currentLang;
}

export function t(path, params = {}) {
  const val = resolve(path, dict);
  if (!val) return path;
  return interpolate(val, params);
}

export async function initI18n() {
  let lang = storage.get('lang');
  if (!lang) {
    const nav = navigator.language?.slice(0, 2).toLowerCase();
    if (nav === 'ru' || nav === 'en') lang = nav; else lang = 'kz';
  }
  await setLang(lang);
}

export function onLangChange(handler) {
  bus.addEventListener('i18n:changed', handler);
}

export default { t, setLang, getLang, initI18n, onLangChange };
