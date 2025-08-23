export default function Modal() {
  const wrapper = document.createElement('div');
  wrapper.className = 'modal hidden';
  const content = document.createElement('div');
  content.className = 'modal-content';
  wrapper.appendChild(content);
  document.body.appendChild(wrapper);
  return {
    show(html) {
      content.innerHTML = html;
      wrapper.classList.remove('hidden');
    },
    hide() {
      wrapper.classList.add('hidden');
    }
  };
}
