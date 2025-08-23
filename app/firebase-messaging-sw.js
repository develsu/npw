self.addEventListener('push', e => {
  let data = {};
  if (e.data) {
    try {
      data = e.data.json();
    } catch (err) {
      data = { title: e.data.text() };
    }
  }
  const title = data.title || 'EcoBike';
  const options = {
    body: data.body || '',
    icon: data.icon || '/app/icons/icon-192.svg',
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus();
          if (url) client.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url || '/');
      }
    })
  );
});
