// Firebase Messaging Service Worker for Push Notifications
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBcGKyZCbsspM4IHIV3q4xo919Uk16TRUk",
  authDomain: "optimistic-shape-lc9s2.firebaseapp.com",
  projectId: "optimistic-shape-lc9s2",
  storageBucket: "optimistic-shape-lc9s2.firebasestorage.app",
  messagingSenderId: "245250708106",
  appId: "1:245250708106:web:09d74cd08c236b83c59373"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background push notification:', payload);
  const notificationTitle = payload.notification?.title || '⚡ Novo Alerta ImobiPro';
  const notificationOptions = {
    body: payload.notification?.body || 'Você possui um novo lead ou agendamento de visita.',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

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
