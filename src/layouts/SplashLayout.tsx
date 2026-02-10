import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SplashScreen } from "../components/SplashScreen";
import { AuthContext } from "../context/AuthContext";

export const SplashLayout = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasVisited");
  });
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFinish = () => {
    sessionStorage.setItem("hasVisited", "true");
    setShowSplash(false);
  };

  useEffect(() => {
    // 스플래시가 끝나고, root 경로에 있을 때만 체크
    if (!showSplash && location.pathname === "/") {
      if (accessToken) {
        // 로그인이 되어 있으면 home으로 이동
        navigate("/home", { replace: true });
      }
    }
  }, [showSplash, accessToken, navigate, location.pathname]);

  if (showSplash) {
    return <SplashScreen onFinish={handleFinish} />;
  }

  // 스플래시가 끝나면 자식 라우트(Outlet)를 보여줌
  return <Outlet />;
};
