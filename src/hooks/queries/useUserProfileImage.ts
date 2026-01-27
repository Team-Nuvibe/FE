import { useQuery } from "@tanstack/react-query";
import { getUserProfileImage } from "@/apis/user";

export const useUserProfileImage = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfileImage,
    });
};
