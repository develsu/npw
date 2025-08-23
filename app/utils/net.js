import Storage from './storage.js';
import { queueReport } from './offline.js';

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

export async function sendOtpMock(phone) {
  const delay = 800 + Math.random() * 400;
  await new Promise(r => setTimeout(r, delay));
  const digits = phone.replace(/\D/g, '');
  if (digits.endsWith('0000')) return { ok: false, code: 'SMS_LIMIT' };
  if (digits.endsWith('1111')) return { ok: false, code: 'BLOCKED' };
  return { ok: true };
}

export async function verifyOtpMock(phone, code) {
  const delay = 800 + Math.random() * 400;
  await new Promise(r => setTimeout(r, delay));
  if (code === '123456') return { ok: true };
  if (code === '000000') return { ok: false, code: 'ATTEMPTS_EXCEEDED' };
  return { ok: false, code: 'INVALID_CODE' };
}

const storage = new Storage('eco');

async function fetchWithCache(key, url) {
  const delay = 300 + Math.random() * 500;
  await new Promise(r => setTimeout(r, delay));
  try {
    if (!isOnline()) throw new Error('offline');
    const res = await fetch(url);
    const data = await res.json();
    storage.set(key, data);
    return { data, fromCache: false };
  } catch (e) {
    const data = storage.get(key, null);
    if (data) return { data, fromCache: true };
    throw e;
  }
}

export function fetchSubscription() {
  return fetchWithCache('subscription', './data/subscription.json');
}
export function fetchBike() {
  return fetchWithCache('bike', './data/bike.json');
}
export function fetchMaintenance() {
  return fetchWithCache('maintenance', './data/maintenance.json');
}
export function fetchQuickStats() {
  return fetchWithCache('quick', './data/stats.json');
}
export function fetchNews() {
  return fetchWithCache('news', './data/news.json');
}

export async function checkSubscriptionMock(uid) {
  const delay = 300 + Math.random() * 500;
  await new Promise(r => setTimeout(r, delay));
  return { ok: true, plan: 'Start', limitPerDay: 3, usedToday: 1 };
}

export async function checkDailyLimitMock(uid) {
  const delay = 300 + Math.random() * 500;
  await new Promise(r => setTimeout(r, delay));
  const sub = storage.get("subscription");
  if (!sub) return { ok: true, remaining: 0 };
  const today = new Date().toISOString().slice(0,10);
  if (sub.usedTodayDate !== today) { sub.usedToday = 0; sub.usedTodayDate = today; storage.set("subscription", sub); }
  const remaining = sub.limitPerDay === Infinity ? 1e9 : Math.max(0, sub.limitPerDay - sub.usedToday);
  return { ok: true, remaining };
}

export async function fetchStationMock(stationId) {
  const delay = 300 + Math.random() * 500;
  await new Promise(r => setTimeout(r, delay));
  try {
    const res = await fetch('./data/stations.json');
    const list = await res.json();
    const station = list.find(s => s.id === stationId);
    if (!station) return { ok: false };
    const free = Math.max(0, station.slots - station.charged);
    station.availableSlots = Array.from({ length: free }, (_, i) => i + 1);
    return { ok: true, station };
  } catch (e) {
    return { ok: false };
  }
}

export async function requestUnlockMock(stationId, slot) {
  const delay = 500 + Math.random() * 300;
  await new Promise(r => setTimeout(r, delay));
  const fail = Math.random() < 0.1;
  if (fail) return { ok: false };
  return { ok: true, opId: `${stationId}-${Date.now()}` };
}

export async function reportSwapMock(data) {
  if (!isOnline()) {
    await queueReport(data);
    return { ok: true, queued: true };
  }
  const delay = 500 + Math.random() * 300;
  await new Promise(r => setTimeout(r, delay));
  const sub = storage.get("subscription");
  if (sub) {
    const today = new Date().toISOString().slice(0,10);
    if (sub.usedTodayDate !== today) { sub.usedToday = 0; sub.usedTodayDate = today; }
    if (sub.limitPerDay === Infinity || sub.usedToday < sub.limitPerDay) { sub.usedToday++; }
    storage.set("subscription", sub);
  }
  storage.set("lastOperation", { tsISO: new Date().toISOString(), data });
  return { ok: true };
}

export default {
  fetchWithTimeout,
  isOnline,
  onNetworkChange,
  fetchCities,
  fetchAgreementsMeta,
  sendOtpMock,
  verifyOtpMock,
  fetchSubscription,
  fetchBike,
  fetchMaintenance,
  fetchQuickStats,
  fetchNews,
  checkSubscriptionMock,
  checkDailyLimitMock,
  fetchStationMock,
  requestUnlockMock,
  reportSwapMock
};
