async function loadEnv() {
  if (loadEnv.cache) return loadEnv.cache;
  try {
    loadEnv.cache = await import('../config/env.js');
  } catch (e) {
    loadEnv.cache = await import('../config/env.sample.js');
  }
  return loadEnv.cache;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function callCF(baseURL, name, payload = {}, method = 'POST') {
  if (!baseURL || baseURL === 'TODO') {
    await delay(300 + Math.random() * 300);
    return { ok: true, data: { mock: true } };
  }
  try {
    const res = await fetch(`${baseURL}/${name}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data || res.statusText };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function swapBattery({ stationId, slot, userId }) {
  const { ENV } = await loadEnv();
  const base = ENV.CF_BASE_URL;
  if (!base || base === 'TODO') {
    await delay(300 + Math.random() * 300);
    return { ok: true, data: { opId: `mock_${Date.now()}` } };
  }
  return callCF(base, 'swapBattery', { stationId, slot, userId });
}

export async function reportSwapSuccess({ opId, stationId, slot, userId }) {
  const { ENV } = await loadEnv();
  const base = ENV.CF_BASE_URL;
  if (!base || base === 'TODO') {
    await delay(300 + Math.random() * 300);
    return { ok: true, data: { success: true } };
  }
  return callCF(base, 'reportSwapSuccess', { opId, stationId, slot, userId });
}

export async function getStationCommand({ stationId }) {
  const { ENV } = await loadEnv();
  const base = ENV.CF_BASE_URL;
  if (!base || base === 'TODO') {
    await delay(300 + Math.random() * 300);
    return { ok: true, data: { command: null } };
  }
  return callCF(base, 'getStationCommand', { stationId });
}

export async function subscribeTopicMock(cityId) {
  await delay(300 + Math.random() * 300);
  return { ok: true, cityId };
}
