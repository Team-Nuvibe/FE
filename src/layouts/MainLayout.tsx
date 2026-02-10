import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import QuickDropButton from "../components/common/QuickDropButton";
import { useNavbarInfo } from "../hooks/useNavbarStore";
import { useAuth } from "@/context/AuthContext";
import { useFcmToken } from "@/hooks/useFcmToken";
import { useUserStore } from "@/hooks/useUserStore";

const MainLayout = () => {
  const { accessToken, refreshToken } = useAuth();
  const isAuthenticated = !!(accessToken || refreshToken);

  useFcmToken(isAuthenticated);
  const isNavbarVisible = useNavbarInfo();
  const { provider, nickname } = useUserStore();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  // 소셜 로그인 유저인데 닉네임이 없는 경우 (가입 미완료) 추가 정보 입력 페이지로 리다이렉트
  if (provider && !nickname) {
    return <Navigate to="/oauth/signup-complete" replace />;
  }

  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden bg-black text-white">
      {/* 페이지 내용 */}
      <main className="scrollbar-hide h-full w-full overflow-y-auto overscroll-y-none">
        <Outlet />
      </main>

      {/* 하단 공통 컴포넌트 */}
      {isNavbarVisible && (
        <>
          <div className="pointer-events-none fixed bottom-0 left-1/2 z-40 h-46.75 w-full max-w-107.5 -translate-x-1/2"
            style={{
              background: `linear-gradient(0deg, #121212 0%, rgba(18, 18, 18, 0.00) 100%)`
            }}
          />
          <div className="pointer-events-none fixed bottom-0 left-1/2 z-50 h-0 w-full max-w-107.5 -translate-x-1/2 overflow-visible">
            <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <Navbar />
              <QuickDropButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout;
