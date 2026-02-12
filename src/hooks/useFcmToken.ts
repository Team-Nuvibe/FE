import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getMessagingIfSupported, VAPID_KEY } from '@/firebase/config';
import { registerFcmToken } from '@/apis/notification';
import { useQueryClient } from '@tanstack/react-query';

export const useFcmToken = (isAuthenticated: boolean) => {
    const [token, setToken] = useState<string | null>(null);
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if (!isAuthenticated) return;
        let unsubscribe: (() => void) | undefined;
        
        const initializeFCM = async () => {
            try {
                // 브라우저가 FCM을 지원하는지 확인
                const messaging = await getMessagingIfSupported();
                if (!messaging) return;

                // 알림 권한을 요청하고 FCM 토근을 발급받아 서버에 등록
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                // 등록한 SW를 명시적으로 가져와서 getToken에 넘김
                const swRegistration = await navigator.serviceWorker.ready;

                const currentToken = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: swRegistration,
                });
                if (currentToken) {
                    setToken(currentToken);
                    await registerFcmToken(currentToken);
                    console.log('✅ FCM Token successfully registered');
                }

                // 서버가 필터링해서 보낸 것을 갱신만 진행
                unsubscribe = onMessage(messaging, (payload) => {
                    console.log('실시간 알림 수신:', payload);
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
                });
            } catch (err) {
                console.error('FCM Error during initialization:', err);
            }
        };
        
        initializeFCM();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isAuthenticated, queryClient]);

    return { token };
};