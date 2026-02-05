import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, VAPID_KEY } from '@/firebase/config';
import { registerFcmToken } from '@/apis/notification';
import { useQueryClient } from '@tanstack/react-query';

export const useFcmToken = (isAuthenticated: boolean) => {
    const [token, setToken] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAuthenticated) return;

        const requestPermissionAndGetToken = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                const currentToken = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                });

                if (currentToken) {
                    setToken(currentToken);
                    await registerFcmToken(currentToken);
                    console.log('✅ FCM Token successfully registered');
                }
            } catch (err) {
                console.error('❌ FCM Error during registration:', err);
            }
        };

        requestPermissionAndGetToken();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('🔔 Foreground message received:', payload);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });

        return () => {
            unsubscribe();
        };
    }, [isAuthenticated, queryClient]);

    return { token };
};
