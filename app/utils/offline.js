/* EcoBike PWA v1.0.0-rc, build: 2025-08-23T12:11:33+00:00 */
const DB_NAME = 'eco-offline';
const STORE = 'swapReports';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { autoIncrement: true });
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

export async function resizeImageFile(file, maxWidth = 720) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function queueReport(data) {
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).add(data);
  return tx.complete;
}

export async function flushQueue() {
  if (!navigator.onLine) return;
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const items = await store.getAll();
  if (items.length) {
    const net = await import('./net.js');
    for (const item of items) {
      await net.reportSwapMock(item);
    }
    await store.clear();
  }
}

window.addEventListener('online', flushQueue);

export default { queueReport, flushQueue, resizeImageFile };
