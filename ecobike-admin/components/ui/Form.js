export default function Form(fields, data={}, onSubmit){
  const form=document.createElement('form');
  fields.forEach(f=>{
    const label=document.createElement('label');
    label.textContent=f.label;
    const input=document.createElement(f.type==='textarea'?'textarea':'input');
    input.type=f.type==='number'?'number':'text';
    input.name=f.name;
    input.value=data[f.name]||'';
    label.appendChild(input);
    form.appendChild(label);
  });
  const btn=document.createElement('button');
  btn.type='submit';
  btn.textContent='OK';
  form.appendChild(btn);
  form.addEventListener('submit',e=>{e.preventDefault();const out={};fields.forEach(f=>out[f.name]=form.querySelector(`[name="${f.name}"]`).value);onSubmit(out);});
  return form;
}
