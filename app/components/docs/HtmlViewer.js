import { t, onLangChange, getLang } from '../../utils/i18n.js';

if (!document.querySelector('link[href="components/docs/HtmlViewer.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'components/docs/HtmlViewer.css';
  document.head.appendChild(link);
}

const overlay = document.createElement('div');
overlay.className = 'html-viewer';
overlay.tabIndex = -1;

const toolbar = document.createElement('div');
toolbar.className = 'html-viewer__toolbar';

const titleEl = document.createElement('span');
titleEl.className = 'html-viewer__title';

const searchInput = document.createElement('input');
searchInput.type = 'search';

const prevBtn = document.createElement('button');
prevBtn.type = 'button';
const nextBtn = document.createElement('button');
nextBtn.type = 'button';

const tocWrap = document.createElement('div');
tocWrap.className = 'html-viewer__toc';

const printBtn = document.createElement('button');
printBtn.type = 'button';

const downloadBtn = document.createElement('button');
downloadBtn.type = 'button';

const closeBtn = document.createElement('button');
closeBtn.type = 'button';

toolbar.append(titleEl, searchInput, prevBtn, nextBtn, printBtn, downloadBtn, closeBtn);

const body = document.createElement('div');
body.className = 'html-viewer__body';
const content = document.createElement('div');
content.className = 'html-viewer__content';
body.append(tocWrap, content);

overlay.append(toolbar, body);
document.body.appendChild(overlay);
overlay.style.display = 'none';

let matches = [];
let currentMatch = -1;
let currentQuery = '';
let onClose;

function updateTexts() {
  searchInput.placeholder = t('documents.viewer.searchPlaceholder');
  prevBtn.textContent = t('documents.viewer.prev');
  nextBtn.textContent = t('documents.viewer.next');
  printBtn.textContent = t('documents.buttons.print');
  downloadBtn.textContent = t('documents.buttons.download');
  closeBtn.textContent = t('documents.buttons.close');
}

onLangChange(updateTexts);
updateTexts();

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const f = overlay.querySelectorAll('button, [href], input');
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function clearMarks() {
  matches.forEach(m => {
    const parent = m.parentNode;
    parent.replaceChild(m.firstChild, m);
    parent.normalize();
  });
  matches = [];
  currentMatch = -1;
}

function highlight(q) {
  clearMarks();
  if (!q) return;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const idx = node.data.toLowerCase().indexOf(q);
    if (idx >= 0) {
      const mark = document.createElement('mark');
      const part = node.splitText(idx);
      part.splitText(q.length);
      mark.appendChild(part.cloneNode(true));
      part.parentNode.replaceChild(mark, part);
      matches.push(mark);
    }
  }
}

function selectMatch(dir = 1) {
  if (!matches.length) return;
  currentMatch = (currentMatch + dir + matches.length) % matches.length;
  matches.forEach(m => m.classList.remove('html-viewer__match'));
  const m = matches[currentMatch];
  m.classList.add('html-viewer__match');
  m.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function doSearch(dir) {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;
  if (q !== currentQuery) { currentQuery = q; highlight(q); }
  selectMatch(dir);
}

searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(1); });
nextBtn.addEventListener('click', () => doSearch(1));
prevBtn.addEventListener('click', () => doSearch(-1));

printBtn.addEventListener('click', () => window.print());

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([content.innerHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${titleEl.textContent}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
});

function close() {
  overlay.style.display = 'none';
  content.innerHTML = '';
  tocWrap.innerHTML = '';
  clearMarks();
  if (onClose) onClose();
}

closeBtn.addEventListener('click', close);
overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); trapFocus(e); });

function buildToc() {
  tocWrap.innerHTML = '';
  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;
  const ul = document.createElement('ul');
  headings.forEach(h => {
    if (!h.id) h.id = 'h-' + Math.random().toString(36).slice(2);
    const li = document.createElement('li');
    li.className = 'toc-' + h.tagName.toLowerCase();
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(h.id).scrollIntoView({ behavior: 'smooth' });
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  tocWrap.appendChild(ul);
}

function open({ title, src, signature, onClosed }) {
  overlay.style.display = 'flex';
  titleEl.textContent = title;
  onClose = onClosed;
  content.innerHTML = t('splash.loading');
  fetch(src).then(r => r.text()).then(html => {
    content.innerHTML = html;
    if (signature && signature.dataURL) {
      const sigBox = document.createElement('div');
      sigBox.className = 'html-viewer__signature';
      const img = document.createElement('img');
      img.src = signature.dataURL;
      img.alt = 'signature';
      img.width = 120;
      const info = document.createElement('span');
      const date = new Date(signature.tsISO).toLocaleDateString();
      info.textContent = t('documents.status.signedOn', { date });
      sigBox.append(img, info);
      content.prepend(sigBox);
    }
    buildToc();
    overlay.focus();
  }).catch(() => {
    content.textContent = t('documents.viewer.noResults');
  });
}

export default { open, close };
