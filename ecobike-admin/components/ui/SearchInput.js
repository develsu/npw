export default function SearchInput(onSearch){
  const input=document.createElement('input');
  input.type='search';
  input.placeholder='search';
  input.addEventListener('input',()=>onSearch(input.value));
  return input;
}
