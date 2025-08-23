export async function fetchWithTimeout(url, options = {}, timeout = 8000, retries = 0) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(res.statusText);
      return res;
    } catch (e) {
      clearTimeout(id);
      if (attempt === retries) throw e;
    }
  }
}

export function isOnline() {
  return navigator.onLine;
}

export function onNetworkChange(handler) {
  window.addEventListener('online', () => handler(true));
  window.addEventListener('offline', () => handler(false));
}

export async function fetchCities() {
  await new Promise(r => setTimeout(r, 300));
  const res = await fetch('./data/cities.json');
  return res.json();
}

export async function fetchAgreementsMeta() {
  await new Promise(r => setTimeout(r, 300));
  return [
    { key: 'terms', titleKey: 'agreements.meta.terms' },
    { key: 'privacy', titleKey: 'agreements.meta.privacy' }
  ];
}

export default {
  fetchWithTimeout,
  isOnline,
  onNetworkChange,
  fetchCities,
  fetchAgreementsMeta
};
