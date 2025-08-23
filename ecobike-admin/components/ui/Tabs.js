export default function Tabs(items, onChange){
  const wrap=document.createElement('div');
  wrap.className='tabs';
  items.forEach((it,i)=>{
    const btn=document.createElement('button');
    btn.textContent=it.label;
    btn.addEventListener('click',()=>onChange(it.value));
    wrap.appendChild(btn);
    if(i===0) btn.classList.add('active');
  });
  return wrap;
}
