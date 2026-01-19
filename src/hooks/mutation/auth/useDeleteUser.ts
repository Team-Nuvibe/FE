import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "@/apis/auth";
import { useAuth } from "@/context/AuthContext";

function useDeleteUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // 캐시된 모든 데이터 삭제
      console.log("회원탈퇴 성공");
      queryClient.clear();
      // AuthContext 상태 및 로컬 스토리지 정리
      clearSession();

      // 네비게이션 먼저
      navigate("/login", {
        state: { toastMessage: "계정이 성공적으로 삭제되었습니다." },
      });
    },
    onError: (error) => {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    },
  });
}

export default useDeleteUser;
