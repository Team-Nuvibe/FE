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
    // notification payload면 자동 알림이 뜰 수 있으니 여기서 또 띄우지 않기
    if (payload.notification) return;

    // data-only일 때만 직접 띄우기
    const notificationTitle = payload?.data?.title ?? "알림";
    const notificationOptions = {
        body: payload?.data?.body ?? "",
        icon: '/vite.svg',
        data: payload?.data ?? {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
