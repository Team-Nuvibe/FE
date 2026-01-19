import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 캐시된 모든 데이터 삭제 (로그아웃 시 개인정보 등 제거)
      queryClient.clear();
      navigate("/login", { state: { toastMessage: "로그아웃 되었습니다." } });
      console.log("로그아웃 성공");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
}

export default useLogout;
