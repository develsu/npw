import { t } from '../utils/i18n.js';
import { showToast } from '../components/ui/Toast.js';

export default function Login(){
  const wrap=document.createElement('div');
  const form=document.createElement('form');
  const u=document.createElement('input');u.placeholder='login';
  const p=document.createElement('input');p.type='password';p.placeholder='password';
  const role=document.createElement('select');['admin','operator','support','viewer'].forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;role.appendChild(o);});
  const btn=document.createElement('button');btn.type='submit';btn.textContent=t('login.signIn');
  form.append(u,p,role,btn);wrap.appendChild(form);
  form.addEventListener('submit',e=>{e.preventDefault();if(u.value==='admin'&&p.value==='admin'){localStorage.setItem('eco.admin',JSON.stringify({id:'1',name:'admin',role:role.value}));location.hash='#/admin/dashboard';}else{showToast(t('login.invalid'));}});
  return wrap;
}
