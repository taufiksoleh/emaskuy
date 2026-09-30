/* EmasKuy service worker add-on (loaded with importScripts): a click on a
   price-alert notification focuses an open EmasKuy tab, or opens one. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const open = clients.find((c) => c.url.startsWith(self.location.origin));
      return open ? open.focus() : self.clients.openWindow(target);
    }),
  );
});
