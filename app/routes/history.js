import { t } from '../utils/i18n.js';
export default function History(){
  const el=document.createElement('div');
  const h=document.createElement('h2');h.textContent=t('dashboard.actions.history');
  const p=document.createElement('p');p.textContent=t('dashboard.inProgress');
  el.append(h,p);return el;}
