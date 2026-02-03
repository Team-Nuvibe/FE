import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/apis/user";
import { useUserStore } from "@/hooks/useUserStore";

export const useUpdateProfileImage = () => {
    const queryClient = useQueryClient();
    const { setProfileImage } = useUserStore();

    return useMutation({
        mutationFn: updateProfileImage,
        onSuccess: (response) => {
            // 프로필 이미지 URL을 Zustand store에 저장
            if (response.data) {
                setProfileImage(response.data);
            }
            // 프로필 쿼리 무효화하여 재조회
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};
