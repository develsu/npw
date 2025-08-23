import { t } from '../utils/i18n.js';
import { stations, cities } from '../utils/admin_api.js';
import Table from '../components/ui/Table.js';
import Form from '../components/ui/Form.js';
import Modal from '../components/ui/Modal.js';
import MapPicker from '../components/map/MapPicker.js';

export default function Stations(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('stations.title')}</h2>`;
  const add=document.createElement('button');add.textContent=t('actions.create');wrap.appendChild(add);
  const tableDiv=document.createElement('div');wrap.appendChild(tableDiv);

  function render(){
    stations.list().then(list=>{
      tableDiv.innerHTML='';
      tableDiv.appendChild(Table([
        {key:'id',label:'id'},{key:'name',label:t('forms.name')},{key:'lat',label:'lat'},{key:'lng',label:'lng'}
      ],list));
    });
  }

  add.addEventListener('click',async()=>{
    const form=Form([
      {name:'id',label:'id'},
      {name:'name',label:t('forms.name')},
      {name:'lat',label:'lat'},
      {name:'lng',label:'lng'}
    ],{},async data=>{await stations.create({...data,lat:+data.lat,lng:+data.lng});modal.close();render();});
    const pickBtn=document.createElement('button');pickBtn.type='button';pickBtn.textContent=t('stations.pick');
    form.appendChild(pickBtn);
    pickBtn.addEventListener('click',async()=>{
      const mp=await MapPicker(43.22,76.85,(p)=>{form.querySelector('[name="lat"]').value=p.lat;form.querySelector('[name="lng"]').value=p.lng;});
      Modal(mp);
    });
    const modal=Modal(form);
  });

  render();
  return wrap;
}
