import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import QuickDropButton from "../components/common/QuickDropButton";
import { useNavbarInfo } from "../hooks/useNavbarStore";
import { useAuth } from "@/context/AuthContext";
import { useFcmToken } from "@/hooks/useFcmToken";

const MainLayout = () => {
  const { accessToken, refreshToken } = useAuth();
  const isAuthenticated = !!(accessToken || refreshToken);

  useFcmToken(isAuthenticated);
  const isNavbarVisible = useNavbarInfo();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  // AccessToken이 없더라도 RefreshToken이 있다면 갱신 시도를 위해 리다이렉트 보류
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden bg-[var(--color-black)] text-white">
      {/* 페이지 내용 */}
      <main className="scrollbar-hide h-full w-full overflow-y-auto overscroll-y-none">
        <Outlet />
      </main>

      {/* 하단 공통 컴포넌트 */}
      {isNavbarVisible && (
        <div className="pointer-events-none fixed bottom-0 left-1/2 z-50 h-0 w-full max-w-[430px] -translate-x-1/2 overflow-visible">
          <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <Navbar />
            <QuickDropButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
