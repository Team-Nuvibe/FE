import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserNickname } from "@/apis/user";
import { useUserStore } from "@/hooks/useUserStore";
import type { NicknameUpdateReq } from "@/types/user";

export const useUpdateNickname = () => {
    const queryClient = useQueryClient();
    const { setNickname } = useUserStore();

    return useMutation({
        mutationFn: (request: NicknameUpdateReq) => updateUserNickname(request),
        onSuccess: (response) => {
            // 닉네임을 Zustand store에 저장
            if (response.data.nickname) {
                setNickname(response.data.nickname);
            }
            // 프로필 쿼리 및 닉네임 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["userNickname"] });
        },
    });
};
