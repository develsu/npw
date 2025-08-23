import Modal from './Modal.js';

export function confirm(msg){
  return new Promise(res=>{
    const content=document.createElement('div');
    const p=document.createElement('p');p.textContent=msg;content.appendChild(p);
    const ok=document.createElement('button');ok.textContent='OK';
    const cancel=document.createElement('button');cancel.textContent='Cancel';
    content.append(ok,cancel);
    const m=Modal(content);
    ok.addEventListener('click',()=>{m.close();res(true);});
    cancel.addEventListener('click',()=>{m.close();res(false);});
  });
}
