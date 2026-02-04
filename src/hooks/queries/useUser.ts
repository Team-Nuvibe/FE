import { useQuery } from "@tanstack/react-query";
import { getUserNickname, getUserProfileImage } from "@/apis/user";

export const useUserNickname = () => {
    return useQuery({
        queryKey: ["userNickname"],
        queryFn: getUserNickname,
    });
};

export const useUserProfileImage = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfileImage,
    });
};
