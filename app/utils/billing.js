import Storage from './storage.js';
import { formatMoneyKZT } from './format.js';

export const PLANS = [
  {
    id: 'Start',
    pricePerMonth: 10000,
    limitPerDay: 2,
    features: [
      { key: 'swapsPerDay', val: 2 },
      { key: 'stationMaintenance' },
      { key: 'support' }
    ]
  },
  {
    id: 'Standard',
    pricePerMonth: 15000,
    limitPerDay: 5,
    features: [
      { key: 'swapsPerDay', val: 5 },
      { key: 'fieldMaintenance' },
      { key: 'gps' },
      { key: 'vipSupport' }
    ]
  },
  {
    id: 'Enterprise',
    pricePerMonth: 25000,
    limitPerDay: Infinity,
    features: [
      { key: 'swapsPerDay', val: Infinity },
      { key: 'fieldMaintenance' },
      { key: 'gps' },
      { key: 'analytics' },
      { key: 'manager' },
      { key: 'vipSupport' }
    ]
  }
];

export const RENTAL_PRICE_WEEK = 35000;
export const LEASING_WEEKLY_PRICE = 35000;
export const LEASING_MIN_WEEKS = 12;
export const LEASING_MAX_WEEKS = 52;
export const LEASING_BUYOUT = 55000;

const storage = new Storage('eco');

export function getPlan(id) {
  return PLANS.find(p => p.id === id);
}

export function pricePerDay(plan) {
  return Math.floor(plan.pricePerMonth / 30);
}

function baseSubscription(planId, days) {
  const plan = getPlan(planId);
  const now = new Date();
  return {
    plan: plan.id,
    activeFromISO: now.toISOString(),
    activeUntilISO: new Date(now.getTime() + days * 86400000).toISOString(),
    limitPerDay: plan.limitPerDay,
    usedToday: 0,
    usedTodayDate: now.toISOString().slice(0,10)
  };
}

export function applyPlan(planId) {
  const sub = baseSubscription(planId, 30);
  storage.set('subscription', sub);
  storage.remove('rental');
  storage.remove('leasing');
  return sub;
}

export function applyRental(weeks = 1) {
  const days = weeks * 7;
  const sub = baseSubscription('Start', days);
  const now = new Date();
  storage.set('subscription', sub);
  storage.set('rental', {
    weeks,
    startedISO: now.toISOString(),
    endsISO: new Date(now.getTime() + days * 86400000).toISOString()
  });
  storage.remove('leasing');
  return sub;
}

export function applyLeasing(weeks) {
  const days = weeks * 7;
  const sub = baseSubscription('Standard', days);
  const now = new Date();
  storage.set('subscription', sub);
  storage.set('leasing', {
    weeks,
    startedISO: now.toISOString(),
    endsISO: new Date(now.getTime() + days * 86400000).toISOString(),
    buyoutKZT: LEASING_BUYOUT
  });
  storage.remove('rental');
  return sub;
}

export function daysLeft(sub) {
  const diff = new Date(sub.activeUntilISO) - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function resetDailyCounter(sub) {
  const today = new Date().toISOString().slice(0,10);
  if (sub.usedTodayDate !== today) {
    sub.usedToday = 0;
    sub.usedTodayDate = today;
    storage.set('subscription', sub);
  }
}

export function remainingToday(sub) {
  if (!sub) return 0;
  resetDailyCounter(sub);
  if (sub.limitPerDay === Infinity) return Infinity;
  return Math.max(0, sub.limitPerDay - sub.usedToday);
}

export function formatPlanPrice(plan) {
  return formatMoneyKZT(plan.pricePerMonth);
}
