export default function CardBase(className = '') {
  const el = document.createElement('div');
  el.className = `card ${className}`.trim();
  return el;
}
