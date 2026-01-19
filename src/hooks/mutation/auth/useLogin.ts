import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LogInRequest } from "@/types/auth";
import { QUERY_KEY } from "@/constants/key";

function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (signinData: LogInRequest) => login(signinData),
    onSuccess: () => {
      // 로그인 후 최신 정보로 자동 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
      console.log("로그인 성공");
      // 로그인 성공 시 홈 페이지로 이동
      navigate("/home");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}

export default useLogin;
