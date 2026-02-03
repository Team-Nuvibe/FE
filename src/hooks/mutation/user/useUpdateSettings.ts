import { useMutation } from "@tanstack/react-query";
import { updateUserSettings } from "@/apis/user";
import type { UserSettingReq } from "@/types/user";

export const useUpdateSettings = () => {
    return useMutation({
        mutationFn: (request: UserSettingReq) => updateUserSettings(request),
    });
};
