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
		if (!supported) {
			console.log ("FCM is not supported in this browser.");
			return;
		}

		window.addEventListener("load", async() => {
			try {
				// 이미 동일 SW가 등록되어 있으면 재등록하지 않기
				const regs = await navigator.serviceWorker.getRegistrations();
				const already = regs.find((r) =>
				r.active?.scriptURL?.includes("/firebase-messaging-sw.js"),
				);
			
				if (already) {
					console.log("Service Worker already registered:", already);
					return;
				}

				// scope를 루트로 고정
				const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js",
					{ scope: "/" },
				);
				console.log("Service Worker registered:", registration);
			} catch (err) {
				console.log("Service Worker registration failed:", err);
			}
		});
	});
}