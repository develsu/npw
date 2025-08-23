export function downloadJSON(name,data){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.click();
}
export function parseCSV(text){
  const [head,...rows]=text.trim().split(/\r?\n/);
  const keys=head.split(',');
  return rows.map(r=>{
    const vals=r.split(',');
    return Object.fromEntries(keys.map((k,i)=>[k,vals[i]]));
  });
}
