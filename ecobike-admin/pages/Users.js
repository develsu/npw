import { t } from '../utils/i18n.js';
import { users } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';

export default function Users(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('users.title')}</h2>`;
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);

  function render(){
    users.list().then(list=>{
      tableDiv.innerHTML='';
      const rows=list.map(u=>({id:u.id,phone:u.phone,blocked:u.blocked? t('users.blocked'):''}));
      tableDiv.appendChild(Table([
        {key:'id',label:'id'},
        {key:'phone',label:t('forms.phone')},
        {key:'blocked',label:t('users.status')}
      ],rows));
    });
  }
  render();
  return wrap;
}
