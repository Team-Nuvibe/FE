import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettings } from "@/apis/user";
import type { UserSettingReq } from "@/types/user";

export const useUpdateUserSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UserSettingReq) => updateUserSettings(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
        },
    });
};
