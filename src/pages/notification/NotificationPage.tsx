import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import Img_3 from "@/assets/images/img_3.png";
import type { Notification } from "@/types/notification";
import { NotificationItem } from "@/components/notification/NotificationItem";

const dummyNotifications: Notification[] = [
  {
    id: 1,
    category: "채팅",
    type: "TRIBE_CHAT_OPENED",
    tribeName: "비싼",
    image: Img_3,
    title: "트라이브챗이 열렸어요",
    description: "#비싼 | 지금 입장해보세요!",
    isRead: false,
    createdAt: "2026-02-03T18:00:00Z",
  },
  {
    id: 2,
    category: "미션",
    type: "MISSION_COMPLETED",
    image: Img_3,
    title: "미션이 달성되었어요",
    description: "보상을 확인하세요!",
    isRead: true,
    createdAt: "2026-02-03T17:30:00Z",
  },
  {
    id: 3,
    category: "알림",
    type: "ARCHIVE_COMMENT",
    image: Img_3,
    title: "아이디어에 댓글이 달렸어요",
    description: "지금 확인해보세요!",
    isRead: true,
    createdAt: "2026-02-03T16:00:00Z",
  },
  {
    id: 4,
    category: "채팅",
    type: "TRIBE_CHAT_CLOSING",
    tribeName: "Grain",
    image: Img_3,
    title: "트라이브챗이 1시간 후 종료돼요",
    description: "#Grain | 마지막 대화를 나눠보세요",
    isRead: true,
    createdAt: "2026-02-03T15:00:00Z",
  },
  {
    id: 5,
    category: "알림",
    type: "ACCOUNT_NICKNAME",
    image: Img_3,
    title: "닉네임이 변경되었어요",
    description: "새로운 닉네임을 확인하세요",
    isRead: true,
    createdAt: "2026-02-03T14:00:00Z",
  },
];

export const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
                <img src={DefaultProfileImage} alt="no notifications" className="h-full w-full opacity-40" />
              </div>
              <p className="text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-gray-500">
                새로운 알림이 없습니다.
              </p>
            </div>
          ) : (
            notifications.map((it) => <NotificationItem key={it.id} notification={it} onDelete={handleDelete} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
