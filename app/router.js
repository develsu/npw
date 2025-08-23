const routes = {
  splash: () => render('Splash'),
  onboarding: () => render('Onboarding'),
  auth: () => render('Auth'),
  agreements: () => render('Agreements'),
  city: () => render('City'),
  dashboard: () => render('Dashboard'),
  map: () => render('Map'),
  qr: () => render('QR'),
  documents: () => render('Documents')
};

function render(text) {
  const el = document.getElementById('view');
  if (el) el.textContent = text;
}

function handleRoute() {
  const hash = location.hash.replace(/^#\//, '');
  const route = routes[hash] || routes.splash;
  route();
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function navigate(path) {
  location.hash = `#/${path}`;
}

export { routes };
