export default function Loader() {
  let el = null;
  return {
    show() {
      if (!el) {
        el = document.createElement('div');
        el.className = 'loader';
        document.body.appendChild(el);
      }
      el.classList.remove('hidden');
    },
    hide() {
      if (el) el.classList.add('hidden');
    }
  };
}
