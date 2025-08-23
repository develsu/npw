import { t } from '../utils/i18n.js';
import { cities } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';
import Form from '../components/ui/Form.js';
import Modal from '../components/ui/Modal.js';

export default function Cities(){
  const wrap=document.createElement('div');
  const title=document.createElement('h2');title.textContent=t('cities.title');
  const addBtn=document.createElement('button');addBtn.textContent=t('actions.create');
  wrap.append(title,addBtn);
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);

  function render(){
    cities.list().then(list=>{
      tableDiv.innerHTML='';
      tableDiv.appendChild(Table([
        {key:'id',label:'id'},
        {key:'name',label:t('forms.name')},
        {key:'lat',label:'lat'},{key:'lng',label:'lng'}
      ],list));
    });
  }

  addBtn.addEventListener('click',()=>{
    const form=Form([
      {name:'id',label:'id'},
      {name:'name',label:t('forms.name')},
      {name:'lat',label:'lat'},
      {name:'lng',label:'lng'}
    ],{},async data=>{await cities.create({...data,lat:+data.lat,lng:+data.lng});modal.close();render();});
    const modal=Modal(form);
  });

  render();
  return wrap;
}
