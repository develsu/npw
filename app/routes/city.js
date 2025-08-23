import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { nearestCity } from '../utils/geo.js';
import cities from '../data/cities.json' assert { type: 'json' };

const storage = new Storage('eco');

export default function City() {
  const el = document.createElement('div');
  el.className = 'city-screen';

  const h1 = document.createElement('h1');
  const grid = document.createElement('div');
  grid.className = 'city-screen__grid';
  const gpsBtn = document.createElement('button');
  gpsBtn.type = 'button';
  gpsBtn.className = 'city-screen__gps';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'city-screen__next';
  nextBtn.disabled = true;

  el.append(h1, grid, gpsBtn, nextBtn);

  let selected = storage.get('profile.city')?.id || cities[0].id;

  function renderGrid() {
    grid.innerHTML = '';
    cities.forEach((c) => {
      const item = document.createElement('div');
      item.className = 'city-screen__item';
      item.dataset.id = c.id;
      item.tabIndex = 0;
      item.innerHTML = `<span>${c.name}</span>`;
      if (c.id === selected) item.classList.add('selected');
      item.addEventListener('click', () => select(c.id));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(c.id);
        }
      });
      grid.appendChild(item);
    });
  }

  function select(id) {
    selected = id;
    grid.querySelectorAll('.city-screen__item').forEach((i) => {
      i.classList.toggle('selected', i.dataset.id === id);
    });
    nextBtn.disabled = false;
    nextBtn.setAttribute('aria-disabled', 'false');
  }

  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    gpsBtn.disabled = true;
    gpsBtn.textContent = t('city.detecting');
    navigator.geolocation.getCurrentPosition((pos) => {
      const city = nearestCity({ lat: pos.coords.latitude, lng: pos.coords.longitude }, cities);
      if (city) {
        selected = city.id;
        renderGrid();
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
      gpsBtn.textContent = t('city.gps');
      gpsBtn.disabled = false;
    }, () => {
      gpsBtn.textContent = t('city.gps');
      gpsBtn.disabled = false;
    });
  });

  nextBtn.addEventListener('click', () => {
    const city = cities.find((c) => c.id === selected);
    storage.set('profile.city', city);
    location.hash = '#/register';
  });

  function updateTexts() {
    h1.textContent = t('city.title');
    gpsBtn.textContent = t('city.gps');
    nextBtn.textContent = t('city.confirm');
  }
  onLangChange(updateTexts);
  updateTexts();
  renderGrid();

  return el;
}
