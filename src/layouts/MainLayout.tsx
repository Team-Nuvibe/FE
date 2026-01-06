import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import QuickDropButton from "../components/common/QuickDropButton";
import { useNavbarInfo } from "../hooks/useNavbarStore"; 

const MainLayout = () => {
  const isNavbarVisible = useNavbarInfo();

  return (
    <div className="relative w-full h-full min-h-screen bg-[var(--color-black)] text-white overflow-hidden">
      {/* 페이지 내용 */}
      <main className="w-full h-full overflow-y-auto overscroll-y-none scrollbar-hide">
        <Outlet />
      </main>

      {/* 하단 공통 컴포넌트 */}
      {isNavbarVisible && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-0 z-50 overflow-visible pointer-events-none">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
            <Navbar />
            <QuickDropButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;