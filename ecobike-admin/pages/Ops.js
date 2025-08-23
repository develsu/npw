import { t } from '../utils/i18n.js';
import { ops } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';

export default function Ops(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('ops.title')}</h2>`;
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);

  function render(){
    ops.list().then(list=>{
      tableDiv.innerHTML='';
      tableDiv.appendChild(Table([
        {key:'id',label:'id'},
        {key:'status',label:t('ops.status')}
      ],list));
    });
  }
  render();
  return wrap;
}
