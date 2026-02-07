import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { NotificationResponse } from "@/types/notification";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { useGetNotifications } from "@/hooks/queries/useGetNotifications";
import { useReadNotification, useDeleteNotification } from "@/hooks/mutation/useNotificationMutations";
export const NotificationPage = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { mutate: readNoti } = useReadNotification();
  const { mutate: deleteNoti } = useDeleteNotification();

  // 시간순(최신순) 정렬만 적용
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    const { type, relatedId, tribeId, actionMessage } = notification;

    switch (type) {
        case "TRIBE_CHAT_JOINED":
            // NOTI-01: 비활성화 채팅목록으로 이동
            navigate("/tribe-chat?tab=waiting");
            break;

        case "TRIBE_CHAT_IMAGE_UPLOADED":
        case "TRIBE_CHAT_CLOSING":
            // NOTI-02, 04: 해당 채팅방 화면으로 이동
            navigate(`/tribe-chat/${relatedId}`);
            break;

        case "IMAGE_REACTION":
            // NOTI-03: 해당 채팅방 속 해당 이미지로 이동
            navigate(`/tribe-chat/${tribeId}?target=${relatedId}`);
            break;

        case "TRIBE_CHAT_CLOSED":
        case "MISSION_REMINDER":
            // NOTI-05, 06: 홈 화면으로 이동
            navigate("/home");
            break;

        case "TAG_RECOMMENDATION": {
            // NOTI-07: 바이브 드랍 화면으로 이동 (태그 추출)
            const tagMatch = actionMessage.match(/#(\S+)/); // 정규표현식 (태그 찾아내기: '#' 찾고 그 뒤의 공백 아닌 태그 내용 묶어 기억)
            const tag = tagMatch ? tagMatch[1] : "Minimal"; // 태그를 잘 찾으면 그걸 쓰고, 못 찾으면 기본 태그 사용 (현재는 minimal로 해둠, 백엔드 협의 필요)
            navigate("/quickdrop", { state: { tag } }); // 사진 선택 화면으로 보내면서 state에 태그 전달
            break;
        }

        case "WEEKLY_RECAP_CREATED":
            // NOTI-08: 주간 리캡 화면
            navigate("/archive-board/vibetone?tab=weekly");
            break;

        case "FULL_RECAP_UPDATED":
            // NOTI-09: 전체 리캡 화면
            navigate("/archive-board/vibetone?tab=all");
            break;

        case "PASSWORD_CHANGED":
        case "NICKNAME_CHANGED":
            // NOTI-10, 11: 프로필 화면으로 이동
            navigate("/profile");
            break;

        default:
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
              {sortedNotifications.map((it) => (
                <NotificationItem
                  key={it.notificationId}
                  notification={it}
                  onDelete={handleDelete}
                  onClick={handleClick}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
