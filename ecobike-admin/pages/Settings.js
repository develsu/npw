import { t } from '../utils/i18n.js';
import { settings } from '../utils/admin_api.js';
import Form from '../components/ui/Form.js';

export default function Settings(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('settings.title')}</h2>`;
  const formDiv=document.createElement('div');wrap.appendChild(formDiv);
  settings.get().then(data=>{
    const form=Form([
      {name:'featureFlags',label:'featureFlags'},
      {name:'alertThreshold',label:'alertThreshold'}
    ],data,async d=>{await settings.set(d);});
    formDiv.appendChild(form);
  });
  return wrap;
}
