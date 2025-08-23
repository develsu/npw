import { t, onLangChange } from '../../utils/i18n.js';

const pdfjsLib = window['pdfjsLib'] || {
  GlobalWorkerOptions: {},
  getDocument: () => ({ promise: Promise.reject(new Error('PDF.js not bundled')) }),
  renderTextLayer: () => {}
};
pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js';

const overlay = document.createElement('div');
overlay.className = 'pdf-viewer';
overlay.tabIndex = -1;

const toolbar = document.createElement('div');
toolbar.className = 'pdf-viewer__toolbar';

const titleEl = document.createElement('span');
titleEl.className = 'pdf-viewer__title';

const searchInput = document.createElement('input');
searchInput.type = 'search';

const searchPrev = document.createElement('button');
searchPrev.type = 'button';
searchPrev.textContent = '◀';

const searchNext = document.createElement('button');
searchNext.type = 'button';
searchNext.textContent = '▶';

const pagePrev = document.createElement('button');
pagePrev.type = 'button';
pagePrev.textContent = '◀';

const pageInfo = document.createElement('span');
pageInfo.className = 'pdf-viewer__page';

const pageNext = document.createElement('button');
pageNext.type = 'button';
pageNext.textContent = '▶';

const downloadBtn = document.createElement('a');
downloadBtn.className = 'pdf-viewer__download';

const closeBtn = document.createElement('button');
closeBtn.type = 'button';
closeBtn.className = 'pdf-viewer__close';

toolbar.append(titleEl, searchInput, searchPrev, searchNext, pagePrev, pageInfo, pageNext, downloadBtn, closeBtn);

const body = document.createElement('div');
body.className = 'pdf-viewer__body';
const pages = document.createElement('div');
pages.className = 'pdf-viewer__pages';
body.appendChild(pages);

overlay.append(toolbar, body);
document.body.appendChild(overlay);
overlay.style.display = 'none';

let pdfDoc = null;
let onEnd = null;
let matches = [];
let currentMatch = -1;
let currentQuery = '';

function updateTexts() {
  searchInput.placeholder = t('viewer.search');
  searchPrev.setAttribute('aria-label', t('viewer.prev'));
  searchNext.setAttribute('aria-label', t('viewer.next'));
  pagePrev.setAttribute('aria-label', t('viewer.prev'));
  pageNext.setAttribute('aria-label', t('viewer.next'));
  downloadBtn.textContent = t('viewer.download');
  closeBtn.textContent = t('viewer.close');
  pageInfo.setAttribute('aria-label', t('viewer.page'));
  if (pdfDoc) updatePageIndicator();
}

onLangChange(updateTexts);
updateTexts();

function clearMatches() {
  matches.forEach(m => m.classList.remove('pdf-match'));
  matches = [];
  currentMatch = -1;
}

function gatherMatches(q) {
  clearMatches();
  const spans = pages.querySelectorAll('.textLayer span');
  spans.forEach(sp => {
    if (sp.textContent.toLowerCase().includes(q)) {
      matches.push(sp);
    }
  });
}

function selectMatch(forward = true) {
  if (!matches.length) return;
  currentMatch = (currentMatch + (forward ? 1 : -1) + matches.length) % matches.length;
  matches.forEach(m => m.classList.remove('pdf-match'));
  const m = matches[currentMatch];
  m.classList.add('pdf-match');
  m.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function doSearch(forward = true) {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;
  if (q !== currentQuery) {
    currentQuery = q;
    gatherMatches(q);
  }
  selectMatch(forward);
}

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doSearch(true);
  }
});
searchNext.addEventListener('click', () => doSearch(true));
searchPrev.addEventListener('click', () => doSearch(false));

function updatePageIndicator() {
  if (!pdfDoc) return;
  const scroll = body.scrollTop;
  const pageElems = pages.children;
  let current = 1;
  for (let i = 0; i < pageElems.length; i++) {
    if (pageElems[i].offsetTop - 10 <= scroll) current = i + 1;
  }
  pageInfo.textContent = `${t('viewer.page')} ${current} / ${pdfDoc.numPages}`;
}

body.addEventListener('scroll', () => {
  updatePageIndicator();
  if (onEnd && body.scrollTop + body.clientHeight >= body.scrollHeight - 5) {
    onEnd();
    onEnd = null;
  }
});

function gotoPage(delta) {
  const pageElems = pages.children;
  if (!pageElems.length) return;
  const parts = pageInfo.textContent.replace(/^[^0-9]*/, '').split('/');
  let current = parseInt(parts[0]);
  const total = parseInt(parts[1]);
  current = Math.min(total, Math.max(1, current + delta));
  pageElems[current - 1].scrollIntoView({ behavior: 'smooth' });
  pageInfo.textContent = `${t('viewer.page')} ${current} / ${total}`;
}

pagePrev.addEventListener('click', () => gotoPage(-1));
pageNext.addEventListener('click', () => gotoPage(1));

function close() {
  overlay.style.display = 'none';
  pages.innerHTML = '';
  pdfDoc = null;
  clearMatches();
}

closeBtn.addEventListener('click', close);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) close();
});

overlay.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') gotoPage(1);
  if (e.key === 'ArrowLeft') gotoPage(-1);
  if (e.key === 'ArrowDown') doSearch(true);
  if (e.key === 'ArrowUp') doSearch(false);
});

async function renderPages(doc) {
  pages.innerHTML = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.3 });
    const pageDiv = document.createElement('div');
    pageDiv.className = 'pdf-page';
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    pageDiv.appendChild(canvas);
    const textLayer = document.createElement('div');
    textLayer.className = 'textLayer';
    pageDiv.appendChild(textLayer);
    pages.appendChild(pageDiv);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const textContent = await page.getTextContent();
    pdfjsLib.renderTextLayer({ textContent, container: textLayer, viewport });
  }
  pageInfo.textContent = `${t('viewer.page')} 1 / ${doc.numPages}`;
}

function open({ id, title, src, onViewedToEnd }) {
  overlay.style.display = 'flex';
  titleEl.textContent = title;
  downloadBtn.href = src;
  downloadBtn.setAttribute('download', `${id}.pdf`);
  onEnd = typeof onViewedToEnd === 'function' ? onViewedToEnd : null;
  searchInput.value = '';
  currentQuery = '';
  clearMatches();
  pdfjsLib.getDocument(src).promise.then((doc) => {
    pdfDoc = doc;
    renderPages(doc).then(() => {
      overlay.focus();
      updatePageIndicator();
    });
  }).catch((err) => {
    console.error('PDF load error', err);
  });
}

export default { open, close };
