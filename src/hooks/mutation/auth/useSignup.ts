import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/apis/auth";
import type { SignUpRequest } from "@/types/auth";

function useSignup() {
  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: () => {
      console.log("회원가입 성공");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
    },
  });
}

export default useSignup;
