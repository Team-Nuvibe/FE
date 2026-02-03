import { useMutation } from "@tanstack/react-query";
import { reissuePassword } from "@/apis/user";
import type { ReissuePasswordReq } from "@/types/user";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (request: ReissuePasswordReq) => reissuePassword(request),
    });
};
