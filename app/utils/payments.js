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

export async function createSessionMock({ planId, amountKZT }) {
  const { ENV } = await loadEnv();
  await delay(200);
  return {
    ok: true,
    sessionId: `sess_${Date.now()}`,
    checkoutUrl: `${ENV.KASPI.checkoutBase}/mock/${planId}`
  };
}

export async function pollStatusMock(sessionId) {
  await delay(200);
  const states = pollStatusMock._states || (pollStatusMock._states = {});
  if (!states[sessionId]) {
    states[sessionId] = 'pending';
  } else if (states[sessionId] === 'pending') {
    states[sessionId] = Math.random() > 0.5 ? 'paid' : 'failed';
  }
  return { ok: true, status: states[sessionId] };
}

export function openCheckout(url) {
  window.open(url, '_blank');
}
