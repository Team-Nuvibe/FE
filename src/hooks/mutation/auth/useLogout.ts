import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/apis/auth";

function useLogout() {
  const { clearSession } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      // 캐시된 모든 데이터 삭제
      queryClient.clear();

      // 페이지 이동을 먼저 수행하여 MainLayout의 리다이렉트(state 없음)보다 우선순위를 가짐
      navigate("/login", {
        state: {
          toastMessage: "성공적으로 로그아웃 되었습니다.",
          isLogout: true,
        },
      });

      // 세션 클리어는 네비게이션이 확실히 시작된 후 수행 (MainLayout 리렌더링 방지)
      setTimeout(() => {
        clearSession();
      }, 50);
      console.log("로그아웃 성공");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      // API 실패 시에도 로컬 로그아웃 처리는 수행
      queryClient.clear();
      navigate("/login", {
        state: {
          toastMessage: "성공적으로 로그아웃 되었습니다.",
          isLogout: true,
        },
      });
      setTimeout(() => {
        clearSession();
      }, 50);
    },
  });
}

export default useLogout;
