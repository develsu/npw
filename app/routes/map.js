import { t, onLangChange } from '../utils/i18n.js';
import Storage from '../utils/storage.js';
import { distanceKm } from '../utils/geo.js';
import { loadJson } from '../utils/json.js';

const storage = new Storage('eco');

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (!document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadStyles() {
  if (!document.querySelector('link[href="routes/map.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'routes/map.css';
    document.head.appendChild(link);
  }
}

export default function Map() {
  loadStyles();
  const el = document.createElement('div');
  el.className = 'map-screen';

  const top = document.createElement('div');
  top.className = 'map-top';
  const title = document.createElement('h2');
  const locBtn = document.createElement('button');
  locBtn.dataset.testid = 'myLocation';
  const availLabel = document.createElement('label');
  const availInput = document.createElement('input');
  availInput.type = 'checkbox';
  availInput.dataset.testid = 'onlyAvailable';
  const availSpan = document.createElement('span');
  availLabel.append(availInput, availSpan);
  top.append(title, locBtn, availLabel);
  el.appendChild(top);

  const mapDiv = document.createElement('div');
  mapDiv.id = 'eb-map';
  el.appendChild(mapDiv);

  let map;
  const markers = [];
  let myPos = null;
  let myMarker = null;
  let accuracyCircle = null;
  let onlyAvail = false;
  let cities = [];
  let stations = [];

  function markerColor(st) {
    if (st.status === 'down') return '#777';
    if (st.charged > 5) return '#2e7d32';
    if (st.charged > 0) return '#ff9800';
    return '#f44336';
  }

  function buildPopup(st) {
    const wrap = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = st.name;
    const addr = document.createElement('div');
    addr.textContent = st.addr;
    const cap = document.createElement('div');
    cap.textContent = t('map.chargedSlots', { c: st.charged, s: st.slots });
    const status = document.createElement('div');
    status.textContent = t(`status.${st.status}`);
    const distEl = document.createElement('div');
    const etaEl = document.createElement('div');
    const routeBtn = document.createElement('button');
    routeBtn.type = 'button';
    routeBtn.textContent = t('map.route');
    routeBtn.addEventListener('click', () => {
      if (!myPos) {
        alert(t('map.offlineHint'));
        return;
      }
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${myPos.lat},${myPos.lng};${st.lat},${st.lng}`;
      window.open(url, '_blank');
    });
    wrap.append(name, addr, cap, status, distEl, etaEl, routeBtn);
    function update() {
      if (myPos) {
        const d = distanceKm(myPos, st);
        distEl.textContent = t('map.distanceKm', { km: d.toFixed(2) });
        const walk = Math.round((d / 4.8) * 60);
        const bike = Math.round((d / 15) * 60);
        etaEl.textContent = `${t('map.etaWalk', { min: walk })} · ${t('map.etaBike', { min: bike })}`;
      } else {
        distEl.textContent = t('map.offlineHint');
        etaEl.textContent = '';
      }
    }
    update();
    return { el: wrap, update };
  }

  function applyFilter() {
    markers.forEach(({ marker, data }) => {
      const show = !onlyAvail || (data.charged > 0 && data.status !== 'down');
      if (show) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }

  function initMap() {
    const city = storage.get('profile.city') || cities.find((c) => c.id === 'almaty');
    map = L.map(mapDiv).setView([city.lat, city.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    stations.forEach((st) => {
      const marker = L.circleMarker([st.lat, st.lng], {
        radius: 8,
        color: markerColor(st),
        fillColor: markerColor(st),
        fillOpacity: 1,
      });
      const { el: popupEl, update } = buildPopup(st);
      marker.bindPopup(popupEl);
      marker.__update = update;
      markers.push({ marker, data: st });
      marker.addTo(map);
    });
    applyFilter();
  }

  availInput.addEventListener('change', () => {
    onlyAvail = availInput.checked;
    applyFilter();
  });

  locBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert(t('map.offlineHint'));
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      myPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const acc = pos.coords.accuracy;
      if (!myMarker) {
        myMarker = L.marker([myPos.lat, myPos.lng]).addTo(map);
        accuracyCircle = L.circle([myPos.lat, myPos.lng], { radius: acc }).addTo(map);
      } else {
        myMarker.setLatLng([myPos.lat, myPos.lng]);
        accuracyCircle.setLatLng([myPos.lat, myPos.lng]);
        accuracyCircle.setRadius(acc);
      }
      map.setView([myPos.lat, myPos.lng], 15);
      markers.forEach((m) => m.marker.__update());
    }, () => {
      alert(t('map.offlineHint'));
    });
  });

  function updateTexts() {
    title.textContent = t('map.title');
    locBtn.textContent = t('map.myLocation');
    availSpan.textContent = t('map.onlyAvailable');
    markers.forEach((m) => {
      const { el: popupEl, update } = buildPopup(m.data);
      m.marker.bindPopup(popupEl);
      m.marker.__update = update;
    });
  }

  onLangChange(updateTexts);
  updateTexts();

  async function bootstrap() {
    const [c, s] = await Promise.all([
      loadJson(new URL('../data/cities.json', import.meta.url).href),
      loadJson(new URL('../data/stations.json', import.meta.url).href)
    ]);
    cities = c;
    stations = s;
    await loadLeaflet();
    initMap();
  }

  bootstrap();

  return el;
}
