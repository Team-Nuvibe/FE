import { motion, useAnimation, type PanInfo } from "framer-motion";
import { useState } from "react";
import Icon_rightarrow from "@/assets/icons/icon_rightarrow.svg?react";
import IconChatlineRead from "@/assets/icons/icon_chatline_read.svg?react";
import IconChatlineUnread from "@/assets/icons/icon_chatline_unread.svg?react";
import IconNotificationDelete from "@/assets/icons/icon_notification_delete.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import type { NotificationResponse } from "@/types/notification";

interface NotificationItemProps {
    notification: NotificationResponse;
    onDelete: (id: number) => void;
    onClick: (notification: NotificationResponse) => void;
}

export const NotificationItem = ({ notification, onDelete, onClick }: NotificationItemProps) => {
    const controls = useAnimation();
    const [swipedState, setSwipedState] = useState<"none" | "left">("none");
    const swipeWidth = 68;
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = async (_: any, info: PanInfo) => {
        setIsDragging(false); // 드래그 종료 시 상태 리셋
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
        <div className={`relative w-90.25 mx-auto h-22.25 select-none overflow-hidden ${notification.isRead ? "opacity-60" : ""}`}>
            {/* 알림 컨텐츠 (스와이프 가능) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -swipeWidth, right: 0 }}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative flex h-full w-full bg-black items-center gap-5 px-2.5 transition-colors active:bg-gray-900/50 z-10 cursor-grab active:cursor-grabbing"
                onTap={() => {
                    // 드래그 중이었다면 클릭 로직 전체 무시
                    if (isDragging) return;

                    if (swipedState !== "none") {
                        controls.start({ x: 0 });
                        setSwipedState("none");
                    } else {
                        onClick(notification);
                    }
                }}
            >
                {/* 프로필 기본 이미지 */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <img src={DefaultProfileImage} alt="profile" className="h-full w-full" />
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col gap-0.5">
                    {/* 카테고리 태그 */}
                    <div className="flex">
                        <span className="inline-flex py-0.5 px-2 items-center justify-center rounded-[5px] bg-gray-900">
                            <span className="text-[12px] font-medium leading-[150%] tracking-[-0.025em] text-gray-300">
                                {notification.category}
                            </span>
                        </span>
                    </div>
                    {/* 제목 (메인 메시지) */}
                    <p className="text-[16px] font-semibold leading-[150%] tracking-[-0.025em] text-gray-100 mt-0.5">
                        {notification.mainMessage}
                    </p>
                    {/* 설명 (액션 메시지) */}
                    <p className="text-[10px] font-normal leading-[150%] tracking-[-0.025em] text-gray-100">
                        {notification.actionMessage}
                    </p>
                </div>

                {/* 바로가기 버튼 */}
                <Icon_rightarrow className="h-6 w-6 shrink-0 text-gray-600" />

                {/* 하단 구분선 (읽음/안읽음 상태에 따라 다른 아이콘) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-90.25 pointer-events-none">
                    {!notification.isRead ? (
                        <IconChatlineUnread className="w-full" />
                    ) : (
                        <IconChatlineRead className="w-full" />
                    )}
                </div>

                {/* 오른쪽에서 따라오는 삭제 버튼 */}
                <div className="absolute top-0 -right-17 h-full w-17 bg-black flex items-center justify-center">
                    <button
                        className="flex h-full w-full items-center justify-center p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notification.notificationId);
                        }}
                    >
                        <IconNotificationDelete className="h-full w-full" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

