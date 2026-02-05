import { axiosInstance } from "./axios";
import type { ApiResponse } from "@/types/common";
import type { NotificationResponse } from "@/types/notification";

// FcmTokenRequest 타입 정의
interface FcmTokenRequest {
    token: string;
}

// 알림 목록 조회
export const getNotifications = async () => {
    const { data } = await axiosInstance.get<ApiResponse<NotificationResponse[]>>(
        "/api/notifications"
    );
    return data;
};

// 알림 읽음 처리
export const readNotification = async (notificationId: number) => {
    const { data } = await axiosInstance.patch<ApiResponse<null>>(
        `/api/notifications/${notificationId}/read`
    );
    return data;
};

// 알림 삭제
export const deleteNotification = async (notificationId: number) => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/api/notifications/${notificationId}`
    );
    return data;
};

// FCM 토큰 등록
export const registerFcmToken = async (token: string) => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(
        "/api/notifications/fcm-token",
        { token }
    );
    return data;
};
