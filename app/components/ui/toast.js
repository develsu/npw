export default function Toast() {
  let el = null;
  return {
    show(message, duration = 3000) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'toast';
        document.body.appendChild(el);
      }
      el.textContent = message;
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('hidden'), duration);
    }
  };
}
