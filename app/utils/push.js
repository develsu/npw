import { initFirebase, getMessagingOrNull } from './firebase.js';
import { subscribeTopicMock } from './functions.js';

async function loadEnv() {
  if (loadEnv.cache) return loadEnv.cache;
  try {
    loadEnv.cache = await import('../config/env.js');
  } catch (e) {
    loadEnv.cache = await import('../config/env.sample.js');
  }
  return loadEnv.cache;
}

export async function requestPushPermission() {
  try {
    return await Notification.requestPermission();
  } catch (e) {
    console.error('Notification permission error', e);
    return 'denied';
  }
}

export async function registerMessagingSW() {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('/app/firebase-messaging-sw.js');
  }
  return null;
}

export async function getFcmTokenIfPossible() {
  await initFirebase();
  const messaging = getMessagingOrNull();
  if (!messaging) return null;
  const { ENV } = await loadEnv();
  try {
    return await messaging.getToken({ vapidKey: ENV.FIREBASE?.vapidKey || 'TODO' });
  } catch (e) {
    console.error('FCM token error', e);
    return null;
  }
}

export function subscribeCityTopic(cityId) {
  return subscribeTopicMock(cityId);
}
