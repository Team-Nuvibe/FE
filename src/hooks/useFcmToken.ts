import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, VAPID_KEY } from '@/firebase/config';
import { registerFcmToken } from '@/apis/notification';

export const useFcmToken = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const requestPermissionAndGetToken = async () => {
            try {
                // 브라우저 알림 권한 요청
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.log('Notification permission denied');
                    return;
                }

                // FCM 토큰 가져오기
                const currentToken = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                });

                if (currentToken) {
                    setToken(currentToken);
                    console.log('FCM Token generated:', currentToken);

                    // 백엔드 API로 토큰 전송
                    await registerFcmToken(currentToken);
                    console.log('FCM Token registered to backend');
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            } catch (err) {
                console.error('An error occurred while retrieving token. ', err);
            }
        };

        requestPermissionAndGetToken();

        // 포그라운드 메시지 수신 처리
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message received in foreground: ', payload);
            // 필요 시 토스트 메시지나 알림함 뱃지 갱신 로직 추가 가능
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { token };
};
