import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { NotificationResponse } from "@/types/notification";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { getNotifications, deleteNotification, readNotification } from "@/apis/notification";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClick = async (notification: NotificationResponse) => {
    try {
      // 읽음 처리 (API 호출)
      if (!notification.isRead) {
        await readNotification(notification.notificationId);
        // UI 업데이트 (읽음 상태 반영)
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
          )
        );
      }

      // 페이지 이동 로직
      const { category, relatedId } = notification;
      if (relatedId) {
        if (category === "채팅") {
          navigate(`/tribe-chat/${relatedId}`);
        } else if (category === "미션") {
          // 미션 관련 페이지 (예: 홈 또는 미션 탭)
          navigate("/");
        } else if (category === "알림") {
          // 아카이브/게시글 관련 알림일 수 있음 (추후 구체화 필요)
          navigate(`/archive/${relatedId}`);
        } else {
          // 기본 이동
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Failed to process notification click:", error);
    }
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      <div className="flex-1 touch-auto overflow-y-auto pb-24">
        {/* Header */}
        <header className="relative sticky top-0 z-20 mt-[20px] mb-[20px] flex h-[30px] items-center justify-between bg-black px-4">
          <Icon_backbutton
            className="cursor-pointer text-white"
            onClick={() => navigate(-1)}
          />
          <h1 className="H2 absolute left-1/2 -translate-x-1/2 text-center leading-[150%] tracking-[-0.025em] text-gray-200">
            알림
          </h1>
        </header>

        {/* Notification List */}
        <div className="flex flex-col">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-[200px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center mb-[12px]">
                <img
                  src={DefaultProfileImage}
                  alt="no notifications"
                  className="h-full w-full opacity-40"
                />
              </div>
              <p className="text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-gray-500">
                새로운 알림이 없습니다.
              </p>
            </div>
          ) : (
            notifications.map((it) => (
              <NotificationItem
                key={it.notificationId}
                notification={it}
                onDelete={handleDelete}
                onClick={handleClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
