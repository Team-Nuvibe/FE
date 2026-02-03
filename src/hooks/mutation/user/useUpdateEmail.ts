import { useMutation } from "@tanstack/react-query";
import {
    sendEmailVerification,
    verifyEmailCode,
    updateEmail,
} from "@/apis/user";
import { useUserStore } from "@/hooks/useUserStore";
import type { EmailVerificationReq, VerifyCodeReq } from "@/types/user";

// 이메일 인증 코드 발송
export const useSendEmailVerification = () => {
    return useMutation({
        mutationFn: (request: EmailVerificationReq) =>
            sendEmailVerification(request),
    });
};

// 이메일 인증 코드 검증
export const useVerifyEmailCode = () => {
    return useMutation({
        mutationFn: (request: VerifyCodeReq) => verifyEmailCode(request),
    });
};

// 이메일 변경
export const useUpdateEmail = () => {
    const { setEmail } = useUserStore();

    return useMutation({
        mutationFn: (request: EmailVerificationReq) => updateEmail(request),
        onSuccess: (_, variables) => {
            // 이메일을 Zustand store에 저장
            setEmail(variables.email);
        },
    });
};
