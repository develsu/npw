import { t, onLangChange, getLang } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import PdfViewer from '../components/pdf/Viewer.js';
import { CURRENT_VERSIONS, getAcceptedVersions, setAcceptedVersions } from '../utils/agreements.js';

const REQUIRE_SCROLL = true;

export default function Agreements() {
  const storage = new Storage('eco');
  const accepted = getAcceptedVersions() || {};

  const el = document.createElement('div');
  el.className = 'agreements';

  const title = document.createElement('h1');
  el.appendChild(title);

  const list = document.createElement('div');
  list.className = 'agreements__list';
  el.appendChild(list);

  const docs = [
    { id: 'terms' },
    { id: 'privacy' },
    { id: 'safety' }
  ];

  const state = { accepted: {}, viewed: {} };

  function updateContinue() {
    const all = docs.every(d => state.accepted[d.id]);
    continueBtn.disabled = !all;
    continueBtn.setAttribute('aria-disabled', String(!all));
  }

  async function getDocSrc(id) {
    const lang = getLang();
    const order = [lang, 'ru', 'en'];
    for (const l of order) {
      const path = `docs/${l}/${id}_v1.pdf`;
      try {
        const res = await fetch(path, { method: 'HEAD' });
        if (res.ok) return path;
      } catch (e) {}
    }
    return `docs/en/${id}_v1.pdf`;
  }

  docs.forEach((d) => {
    const card = document.createElement('div');
    card.className = 'agreements__card';

    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    const actions = document.createElement('div');
    actions.className = 'agreements__actions';

    const readBtn = document.createElement('button');
    readBtn.type = 'button';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `chk-${d.id}`;
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;

    actions.append(readBtn, checkbox, label);
    card.append(h2, p, actions);
    list.appendChild(card);

    function updateTexts() {
      h2.textContent = t(`agreements.${d.id}.title`);
      p.textContent = t(`agreements.${d.id}.desc`);
      readBtn.textContent = t('agreements.read');
      readBtn.setAttribute('aria-label', `${t('agreements.read')} ${t(`agreements.${d.id}.title`)}`);
      label.textContent = t('agreements.accept');
      checkbox.setAttribute('aria-label', t('agreements.accept'));
    }
    onLangChange(updateTexts);
    updateTexts();

    if (accepted[d.id] === CURRENT_VERSIONS[d.id]) {
      checkbox.checked = true;
      state.accepted[d.id] = true;
    }

    if (REQUIRE_SCROLL && !state.accepted[d.id]) {
      checkbox.disabled = true;
    }

    checkbox.addEventListener('change', () => {
      state.accepted[d.id] = checkbox.checked;
      updateContinue();
    });

    readBtn.addEventListener('click', async () => {
      const src = await getDocSrc(d.id);
      PdfViewer.open({
        id: d.id,
        title: t(`agreements.${d.id}.title`),
        src,
        onViewedToEnd: () => {
          state.viewed[d.id] = true;
          if (REQUIRE_SCROLL) {
            checkbox.disabled = false;
          }
        }
      });
    });
  });

  const continueBtn = document.createElement('button');
  continueBtn.type = 'button';
  continueBtn.className = 'agreements__continue';
  continueBtn.disabled = true;
  el.appendChild(continueBtn);

  continueBtn.addEventListener('click', () => {
    const versions = {};
    docs.forEach(d => versions[d.id] = CURRENT_VERSIONS[d.id]);
    setAcceptedVersions(versions);
    storage.set('agreements.accepted', true);
    const next = storage.get('user.auth', false) ? 'dashboard' : 'auth';
    location.hash = `#/${next}`;
  });

  function updateTexts() {
    title.textContent = t('agreements.screenTitle');
    continueBtn.textContent = t('buttons.continue');
    continueBtn.setAttribute('aria-label', t('buttons.continue'));
  }
  onLangChange(updateTexts);
  updateTexts();
  updateContinue();

  return el;
}
