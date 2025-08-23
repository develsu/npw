import { t } from '../utils/i18n.js';
export default function Support(){
  const el=document.createElement('div');
  const h=document.createElement('h2');h.textContent=t('dashboard.actions.support');
  const p=document.createElement('p');p.textContent=t('dashboard.inProgress');
  el.append(h,p);return el;}
