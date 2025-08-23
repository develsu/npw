import { t } from '../utils/i18n.js';
import { auditLog } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';

export default function Audit(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('audit.title')}</h2>`;
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);
  auditLog.list().then(list=>{
    tableDiv.appendChild(Table([
      {key:'tsISO',label:'ts'},
      {key:'action',label:t('audit.action')},
      {key:'entityId',label:'id'}
    ],list));
  });
  return wrap;
}
