import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "swiper";
import "swiper/swiper-bundle.css";

import { isSupported } from "firebase/messaging";

createRoot(document.getElementById("root")!).render(<App />);

// 4. 서비스워커 등록 (FCM 지원 브라우저에서만)
if ('serviceWorker' in navigator) {
	isSupported().then((supported) => {
		if (supported) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/firebase-messaging-sw.js')
					.then(registration => {
						console.log('Service Worker registered:', registration);
					})
					.catch(err => {
						console.log('Service Worker registration failed:', err);
					});
			});
		} else {
			console.log('FCM is not supported in this browser.');
		}
	});
}