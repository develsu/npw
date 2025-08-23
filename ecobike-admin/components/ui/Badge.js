export default function Badge(text,color='gray'){
  const span=document.createElement('span');
  span.className='badge';
  span.style.background=color;
  span.textContent=text;
  return span;
}
