import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readNotification, deleteNotification } from "@/apis/notification";

export const useReadNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => readNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => deleteNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
