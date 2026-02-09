import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Icon_backbutton from "@/assets/icons/icon_chevron_left.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { NotificationResponse } from "@/types/notification";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { useGetNotifications } from "@/hooks/queries/useGetNotifications";
import { useReadNotification, useDeleteNotification } from "@/hooks/mutation/useNotificationMutations";
import useGetDropMission from "@/hooks/queries/useGetDropMission";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { mutate: readNoti } = useReadNotification();
  const { mutate: deleteNoti } = useDeleteNotification();

  // 드롭 미션 데이터 미리 불러오기
  const { data: dropMissionData } = useGetDropMission();

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
          // NOTI-05: 홈 화면으로 이동
            navigate("/home");
            break;

        case "MISSION_REMINDER": {
            // NOTI-06: 드랍 미션 상세 화면으로 이동
            const tagMatch = actionMessage.match(/#(\S+)/); // 정규표현식 (태그 찾아내기: '#' 찾고 그 뒤의 공백 아닌 태그 내용 묶어 기억)
            const tagFromMsg = tagMatch ? tagMatch[1] : null;

            const finalTag = tagFromMsg || dropMissionData?.data.tag;

            if (finalTag) {
              // 첫 글자 Capitalize 처리하여 이동
              const capitalizedTag = finalTag.charAt(0).toUpperCase() + finalTag.slice(1);
              navigate(`/tag/${capitalizedTag}`);
            } else {
              // 데이터가 아예 없다면 홈으로 이동
              navigate("/home");
            }
            break;
        }

        case "TAG_RECOMMENDATION": {
            // NOTI-07: 추천 태그 상세 화면으로 이동
            const tagMatch = actionMessage.match(/#(\S+)/); // 정규표현식 (태그 찾아내기: '#' 찾고 그 뒤의 공백 아닌 태그 내용 묶어 기억)
            const tag = tagMatch ? tagMatch[1] : null;

            if (tag) {
              // 첫 글자를 대문자로 변환 (Capitalize)
              const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
              // 태그 상세 화면으로 이동
              navigate(`/tag/${capitalizedTag}`);
            } else {
              // 데이터가 아예 없다면 홈으로 이동
              navigate("/home");
            }
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
        <header className="relative sticky top-0 z-20 mt-2 mb-[23.59px] flex h-[30px] items-center justify-between bg-black px-4">
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