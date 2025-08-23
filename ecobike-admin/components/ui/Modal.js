export default function Modal(content){
  const wrap=document.createElement('div');
  wrap.className='modal-wrap';
  const box=document.createElement('div');
  box.className='modal-box';
  box.appendChild(content);
  wrap.appendChild(box);
  wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove();});
  document.body.appendChild(wrap);
  return {close:()=>wrap.remove()};
}
