import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/apis/notification";

export const useGetNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await getNotifications();
            return response.data;
        },
    });
};
