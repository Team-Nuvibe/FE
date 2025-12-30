import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SplashScreen } from '../components/SplashScreen';

export const SplashLayout = () => {
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem('hasVisited');
    });

    const handleFinish = () => {
        sessionStorage.setItem('hasVisited', 'true');
        setShowSplash(false);
    };

    if (showSplash) {
        return <SplashScreen onFinish={handleFinish} />;
    }

    // 스플래시가 끝나면 자식 라우트(Outlet)를 보여줌
    return <Outlet />;
};