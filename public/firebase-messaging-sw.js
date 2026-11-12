// Firebase Messaging Service Worker for Push Notifications
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

try {
  firebase.initializeApp({
    apiKey: "AIzaSyCyLGQ5727yrR6gT-PpvbKHk4lQoAZmbjs",
    authDomain: "site-joelsantana-imoveis.firebaseapp.com",
    projectId: "site-joelsantana-imoveis",
    storageBucket: "site-joelsantana-imoveis.firebasestorage.app",
    messagingSenderId: "45418617795",
    appId: "1:45418617795:web:d4c3c5d517695e45297b76"
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || '⚡ Novo Alerta ImobiPro';
    const notificationOptions = {
      body: payload.notification?.body || 'Você possui um novo lead ou agendamento de visita.',
      icon: '/images/logo_joel_santana.svg',
      badge: '/images/logo_joel_santana.svg',
      data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  // Gracefully handle unconfigured FCM or offline mode in Edge/Safari
  console.info('[FCM ServiceWorker] Offline/local fallback mode:', err);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
