import { loadJson } from '../../app/utils/json.js';
const SUPPORTED = ['kz','ru','en'];
let current = 'kz';
let dict = {};
const bus = new EventTarget();

function resolve(path,obj){
  return path.split('.').reduce((o,p)=>o&&o[p]!==undefined?o[p]:undefined,obj);
}
export function t(path, params={}){
  const val = resolve(path, dict) || path;
  return Object.keys(params).reduce((s,k)=>s.replace(new RegExp(`{${k}}`,'g'), params[k]), val);
}
export async function setLang(lang){
  if(!SUPPORTED.includes(lang)) lang='kz';
  const url = new URL(`../i18n/${lang}.json`, import.meta.url);
  dict = await loadJson(url.href);
  current = lang;
  document.documentElement.lang = lang;
  bus.dispatchEvent(new Event('lang'));
}
export async function initI18n(){
  await setLang('kz');
}
export function onLangChange(fn){ bus.addEventListener('lang', fn); }
