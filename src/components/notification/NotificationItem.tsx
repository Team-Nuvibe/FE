import { motion, useAnimation, type PanInfo } from "framer-motion";
import { useState } from "react";
import Icon_rightarrow from "@/assets/icons/icon_rightarrow.svg?react";
import IconChatlineRead from "@/assets/icons/icon_chatline_read.svg?react";
import IconChatlineUnread from "@/assets/icons/icon_chatline_unread.svg?react";
import IconNotificationDelete from "@/assets/icons/icon_notification_delete.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
    notification: Notification;
    onDelete: (id: number) => void;
}

export const NotificationItem = ({ notification, onDelete }: NotificationItemProps) => {
    const controls = useAnimation();
    const [swipedState, setSwipedState] = useState<"none" | "left">("none");
    const swipeWidth = 68;

    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset.x;
        const threshold = swipeWidth / 2;

        if (offset < -threshold) {
            await controls.start({ x: -swipeWidth });
            setSwipedState("left");
        } else {
            await controls.start({ x: 0 });
            setSwipedState("none");
        }
    };

    return (
        <div className={`relative w-[361px] mx-auto h-[89px] select-none overflow-hidden ${notification.isRead ? "opacity-60" : ""}`}>
            {/* 삭제 버튼 배경 */}
            <div className="absolute inset-0 flex justify-end bg-black">
                <button
                    className="flex h-full w-[68px] items-center justify-center p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                >
                    <IconNotificationDelete className="h-full w-full" />
                </button>
            </div>

            {/* 알림 컨텐츠 (스와이프 가능) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -swipeWidth, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative flex h-full w-full bg-black items-center gap-5 px-[10px] transition-colors active:bg-gray-900/50 z-10 cursor-grab active:cursor-grabbing"
                onClick={(e) => {
                    if (swipedState !== "none") {
                        e.stopPropagation();
                        controls.start({ x: 0 });
                        setSwipedState("none");
                    }
                }}
            >
                {/* 프로필 기본 이미지 */}
                <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
                    <img src={DefaultProfileImage} alt="profile" className="h-full w-full" />
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col gap-[2px]">
                    {/* 카테고리 태그 */}
                    <div className="flex">
                        <span className="inline-flex py-[2px] px-[8px] items-center justify-center rounded-[5px] bg-gray-900">
                            <span className="text-[12px] font-medium leading-[150%] tracking-[-0.025em] text-gray-300">
                                {notification.category}
                            </span>
                        </span>
                    </div>
                    {/* 제목 */}
                    <p className="text-[16px] font-semibold leading-[150%] tracking-[-0.025em] text-gray-100 mt-0.5">
                        {notification.title}
                    </p>
                    {/* 설명 (태그 포함) */}
                    <p className="text-[10px] font-normal leading-[150%] tracking-[-0.025em] text-gray-100">
                        {notification.description}
                    </p>
                </div>

                {/* 바로가기 버튼 */}
                <Icon_rightarrow className="h-6 w-6 shrink-0 text-gray-600" />

                {/* 하단 구분선 (읽음/안읽음 상태에 따라 다른 아이콘) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[361px] pointer-events-none">
                    {!notification.isRead ? (
                        <IconChatlineUnread className="w-full" />
                    ) : (
                        <IconChatlineRead className="w-full" />
                    )}
                </div>
            </motion.div>
        </div>
    );
};
