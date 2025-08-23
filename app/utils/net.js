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

export default { fetchWithTimeout, isOnline, onNetworkChange };
