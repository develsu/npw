let firebaseApp = null;

async function loadEnv() {
  if (loadEnv.cache) return loadEnv.cache;
  try {
    loadEnv.cache = await import('../config/env.js');
  } catch (e) {
    loadEnv.cache = await import('../config/env.sample.js');
  }
  return loadEnv.cache;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function initFirebase(env) {
  if (firebaseApp) return firebaseApp;
  if (!env) {
    const { ENV } = await loadEnv();
    env = ENV.FIREBASE;
  }
  if (!env || env.apiKey === 'TODO') {
    console.warn('Firebase config missing, skipped init');
    return null;
  }
  const base = 'https://www.gstatic.com/firebasejs/10.11.0/';
  await loadScript(base + 'firebase-app-compat.js');
  await Promise.all([
    loadScript(base + 'firebase-auth-compat.js'),
    loadScript(base + 'firebase-firestore-compat.js'),
    loadScript(base + 'firebase-storage-compat.js'),
    env.messagingSenderId ? loadScript(base + 'firebase-messaging-compat.js') : Promise.resolve()
  ]);
  firebaseApp = firebase.initializeApp(env);
  return firebaseApp;
}

export function getApp() {
  return firebaseApp;
}

export function getAuth() {
  return firebase.auth();
}

export function getDb() {
  return firebase.firestore();
}

export function getStorage() {
  return firebase.storage();
}

export function getMessagingOrNull() {
  try {
    return firebase.messaging && firebase.messaging.isSupported && firebase.messaging.isSupported() ? firebase.messaging() : null;
  } catch (e) {
    return null;
  }
}

export async function signInWithPhoneMock(phone) {
  await initFirebase();
  return new Promise(res => setTimeout(() => res({ user: { uid: 'mock-' + phone, phoneNumber: phone } }), 300));
}

export async function dbGet(path) {
  await initFirebase();
  const doc = await getDb().doc(path).get();
  return doc.exists ? doc.data() : null;
}

export async function dbSet(path, data) {
  await initFirebase();
  return getDb().doc(path).set(data);
}

export async function dbUpdate(path, data) {
  await initFirebase();
  return getDb().doc(path).update(data);
}

export async function uploadFile(path, file) {
  await initFirebase();
  const ref = getStorage().ref(path);
  if (typeof file === 'string') {
    return ref.putString(file, 'data_url');
  }
  return ref.put(file);
}
