import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { NotificationResponse } from "@/types/notification";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { useGetNotifications } from "@/hooks/queries/useGetNotifications";
import { useReadNotification, useDeleteNotification } from "@/hooks/mutation/useNotificationMutations";
import { startOfDay, isSameDay, subDays } from "date-fns";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { mutate: readNoti } = useReadNotification();
  const { mutate: deleteNoti } = useDeleteNotification();

  // 날짜별 그룹화 로직
  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(subDays(now, 1));

    const groups: { title: string; items: NotificationResponse[] }[] = [
      { title: "오늘", items: [] },
      { title: "어제", items: [] },
      { title: "이전 알림", items: [] },
    ];

    notifications.forEach((noti: NotificationResponse) => {
      const notiDate = startOfDay(new Date(noti.createdAt));
      if (isSameDay(notiDate, today)) {
        groups[0].items.push(noti);
      } else if (isSameDay(notiDate, yesterday)) {
        groups[1].items.push(noti);
      } else {
        groups[2].items.push(noti);
      }
    });

    return groups.filter((group) => group.items.length > 0);
  }, [notifications]);

  const handleDelete = (id: number) => {
    deleteNoti(id);
  };

  const handleClick = (notification: NotificationResponse) => {
    // 읽음 처리
    if (!notification.isRead) {
      readNoti(notification.notificationId);
    }

    // 페이지 이동 로직 (기능 명세 반영)
    const { category, mainMessage, relatedId } = notification;

    if (category === "채팅") {
      if (mainMessage.includes("열렸어요")) {
        // NOTI-01, 02: 비활성화 채팅목록
        navigate("/tribe-chat?tab=waiting");
      } else if (mainMessage.includes("새 바이브가 올라왔어요") || mainMessage.includes("종료가 1시간 남았어요")) {
        // NOTI-03, 05: 해당 채팅방
        navigate(`/tribe-chat/${relatedId}`);
      } else if (mainMessage.includes("반응했어요")) {
        // NOTI-04: 해당 채팅방 속 해당 이미지로 이동
        navigate(`/tribe-chat/${relatedId}?messageId=1`);
      }
    } else if (category === "미션") {
      if (mainMessage.includes("비어 있어요")) {
        // NOTI-07: 홈
        navigate("/home");
      } else if (mainMessage.includes("추천 태그")) {
        // NOTI-08: 바이브 드랍 화면 (추천 태그 고정)
        navigate("/quickdrop", { state: { tag: "Minimal" } });
      }
    } else if (category === "알림") {
      if (mainMessage.includes("종료되었어요")) {
        // NOTI-06: 홈
        navigate("/home");
      } else if (mainMessage.includes("이번 주의")) {
        // NOTI-09: 주간 리캡
        navigate("/archive-board/vibetone?tab=weekly");
      } else if (mainMessage.includes("전체 바이브톤")) {
        // NOTI-10: 전체 리캡
        navigate("/archive-board/vibetone?tab=all");
      } else if (mainMessage.includes("비밀번호") || mainMessage.includes("닉네임")) {
        // NOTI-11, 12: 프로필
        navigate("/profile");
      }
    } else {
      // 기본 폴백
      navigate("/home");
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center pt-[200px]">
              <p className="text-gray-500">불러오는 중...</p>
            </div>
          ) : notifications.length === 0 ? (
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
            <>
              {groupedNotifications.map((group) => (
                <div key={group.title} className="flex flex-col">
                  <div className="px-4 py-2 bg-black">
                    <h3 className="text-[14px] font-semibold text-gray-400">
                      {group.title}
                    </h3>
                  </div>
                  {group.items.map((it) => (
                    <NotificationItem
                      key={it.notificationId}
                      notification={it}
                      onDelete={handleDelete}
                      onClick={handleClick}
                    />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
