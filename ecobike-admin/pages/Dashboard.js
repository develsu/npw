import { t } from '../utils/i18n.js';
import { cities, stations, users, ops } from '../utils/admin_api.js';

export default function Dashboard(){
  const wrap=document.createElement('div');
  wrap.innerHTML=`<h2>${t('dashboard.title')}</h2>`;
  Promise.all([cities.list(),stations.list(),users.list(),ops.list()]).then(([c,s,u,o])=>{
    const ul=document.createElement('ul');
    ul.innerHTML=`<li>${t('dashboard.cities')}: ${c.length}</li>`+
      `<li>${t('dashboard.stations')}: ${s.length}</li>`+
      `<li>${t('dashboard.users')}: ${u.length}</li>`+
      `<li>${t('dashboard.ops')}: ${o.length}</li>`;
    wrap.appendChild(ul);
  });
  return wrap;
}
