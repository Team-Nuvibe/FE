importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCvK5fqq7muFLzWjBbAXqdFBD3iDXR0gzc",
    authDomain: "nuvibe-web.firebaseapp.com",
    projectId: "nuvibe-web",
    storageBucket: "nuvibe-web.firebasestorage.app",
    messagingSenderId: "125862706035",
    appId: "1:125862706035:web:da0bd441d38d65988c6306"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
