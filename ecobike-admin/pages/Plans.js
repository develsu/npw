import { t } from '../utils/i18n.js';
import { plans } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';
import Form from '../components/ui/Form.js';
import Modal from '../components/ui/Modal.js';

export default function Plans(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('plans.title')}</h2>`;
  const add=document.createElement('button');add.textContent=t('actions.create');wrap.appendChild(add);
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);

  function render(){
    plans.list().then(list=>{
      tableDiv.innerHTML='';
      tableDiv.appendChild(Table([
        {key:'id',label:'id'},{key:'price',label:t('plans.price')},{key:'limitPerDay',label:t('plans.limit')}
      ],list));
    });
  }

  add.addEventListener('click',()=>{
    const form=Form([
      {name:'id',label:'id'},
      {name:'price',label:t('plans.price')},
      {name:'limitPerDay',label:t('plans.limit')}
    ],{},async data=>{await plans.create({id:data.id,price:+data.price,limitPerDay:+data.limitPerDay});modal.close();render();});
    const modal=Modal(form);
  });

  render();
  return wrap;
}
