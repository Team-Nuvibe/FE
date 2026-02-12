import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogInRequest } from "@/types/auth";
import { QUERY_KEY } from "@/constants/key";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (signinData: LogInRequest) => login(signinData),
    onSuccess: () => {
      // 로그인 후 최신 정보로 자동 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
      console.log("로그인 성공");
      navigate("/home");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}

export default useLogin;
