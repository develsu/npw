import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';

const storage = new Storage('eco');

function nextRoute() {
  if (storage.get('firstLaunch', true)) return 'onboarding';
  if (!storage.get('agreements.accepted', false)) return 'agreements';
  if (!storage.get('user.auth', false)) return 'auth';
  return 'dashboard';
}

export default function Onboarding() {
  const el = document.createElement('div');
  el.className = 'onboarding';

  const slidesData = [
    { img: 'assets/illustrations/welcome.svg', title: 'onboarding.slide1.title', text: 'onboarding.slide1.text' },
    { img: 'assets/illustrations/how.svg', title: 'onboarding.slide2.title', text: 'onboarding.slide2.text' },
    { img: 'assets/illustrations/tariffs.svg', title: 'onboarding.slide3.title', text: 'onboarding.slide3.text', tariffs: true },
    { img: 'assets/illustrations/docs.svg', title: 'onboarding.slide4.title', text: 'onboarding.slide4.text' }
  ];

  const slidesEl = document.createElement('div');
  slidesEl.className = 'onboarding__slides';

  slidesData.forEach((s) => {
    const section = document.createElement('section');
    section.className = 'onboarding__slide';
    const img = document.createElement('img');
    img.src = s.img;
    img.alt = '';
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    section.append(img, h2, p);
    if (s.tariffs) {
      const tariffs = document.createElement('div');
      tariffs.className = 'onboarding__tariffs';
      ['Start', 'Standard', 'Enterprise'].forEach((name) => {
        const card = document.createElement('div');
        card.textContent = name;
        tariffs.appendChild(card);
      });
      section.appendChild(tariffs);
    }
    slidesEl.appendChild(section);
  });
  el.appendChild(slidesEl);

  const controls = document.createElement('div');
  controls.className = 'onboarding__controls';
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'onboarding__btn';
  const dots = document.createElement('div');
  dots.className = 'onboarding__dots';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'onboarding__btn';
  controls.append(backBtn, dots, nextBtn);
  el.appendChild(controls);

  slidesData.forEach(() => {
    const d = document.createElement('span');
    dots.appendChild(d);
  });

  let index = 0;

  function show(i) {
    if (i < 0 || i >= slidesData.length) return;
    index = i;
    slidesEl.style.transform = `translateX(-${i * 100}%)`;
    dots.childNodes.forEach((d, idx) => d.classList.toggle('active', idx === i));
    backBtn.style.visibility = i === 0 ? 'hidden' : 'visible';
    backBtn.textContent = t('buttons.back');
    nextBtn.textContent = i === slidesData.length - 1 ? t('onboarding.continue') : t('buttons.next');
    nextBtn.setAttribute('aria-label', nextBtn.textContent);
    backBtn.setAttribute('aria-label', t('buttons.back'));
  }

  function updateLang() {
    slidesData.forEach((s, idx) => {
      const slide = slidesEl.children[idx];
      slide.querySelector('h2').textContent = t(s.title);
      slide.querySelector('p').textContent = t(s.text);
    });
    show(index);
  }
  onLangChange(updateLang);
  updateLang();

  backBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => {
    if (index === slidesData.length - 1) {
      storage.set('firstLaunch', false);
      location.hash = `#/${nextRoute()}`;
    } else {
      show(index + 1);
    }
  });

  let startX = 0;
  slidesEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  slidesEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) show(index + 1);
      else show(index - 1);
    }
  });

  return el;
}
