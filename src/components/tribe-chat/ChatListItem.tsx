import { motion, useAnimation, type PanInfo } from "framer-motion";
import { useState, useRef } from "react";
import IconChatListQuiet from "@/assets/icons/icon_chatlist_quiet.svg?react";
import IconChatSilent from "@/assets/icons/icon_chat_silent.svg?react";
import IconChatPin from "@/assets/icons/icon_chat_pin.svg?react";
import IconChatPinned from "@/assets/icons/icon_chat_pinned.svg?react";
import IconChatlineRead from "@/assets/icons/icon_chatline_read.svg?react";
import IconChatlineUnread from "@/assets/icons/icon_chatline_unread.svg?react";

import type { ChatRoom } from "@/types/tribeChat";
import { formatChatDate } from "@/utils/formatChatDate";
import { allTagImages } from "@/utils/imageMap";

interface ChatListItemProps {
  room: ChatRoom;
  isActiveTab: boolean; // 'active' tab vs 'inactive' tab
  onAction?: (action: "mute" | "pin" | "read" | "exit" | "enter") => void;
  onClick?: () => void;
}

export const ChatListItem = ({
  room,
  isActiveTab,
  onAction,
  onClick,
}: ChatListItemProps) => {
  const controls = useAnimation();
  const [swipedState, setSwipedState] = useState<"none" | "left" | "right">(
    "none",
  );

  /* Drag tracking to prevent onClick firing after swipe */
  const isDragging = useRef(false);

  // 태그에 해당하는 로컬 이미지 찾기
  // room.tags 배열 중에서 로컬 이미지가 존재하는 첫 번째 태그를 사용
  const localImage = room.tags?.find((tag) => allTagImages[tag.toLowerCase()])
    ? allTagImages[
        room.tags.find((tag) => allTagImages[tag.toLowerCase()])!.toLowerCase()
      ]
    : undefined;

  const displayImage = localImage || room.thumbnailUrl;

  // 비활성 탭 로직
  if (!isActiveTab) {
    const isEnterable = room.memberCount >= 5;

    return (
      <div
        className={`relative flex h-[124px] w-full items-center bg-black px-[10px] transition-colors ${!isEnterable ? "opacity-60" : ""} `}
        onClick={() => {
          if (!isEnterable) {
            onClick?.();
          } else {
            onAction?.("enter");
          }
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={room.title}
            className="mr-4 h-[100px] w-[75px] shrink-0 rounded-[5px] border border-gray-700 object-cover"
          />
        ) : (
          <div className="mr-4 h-[100px] w-[75px] shrink-0 rounded-[5px] border border-gray-700 bg-gray-200 shadow-[inset_0_0_20px_rgba(255,255,255,0.25)]" />
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-1">
            <span
              className={`H2 bg-gradient-to-r from-white to-[#F7F7F7]/30 bg-clip-text leading-[150%] tracking-[-0.5px] text-transparent ${isEnterable ? "" : "text-gray-400"} `}
            >
              {room.title}
            </span>
            {room.isPinned && <IconChatPinned className="h-[18px] w-[18px]" />}
          </div>
          <div
            className={`text-[12px] leading-[150%] font-normal tracking-[-0.025em] ${isEnterable ? "text-gray-400" : "text-gray-600"} `}
          >
            {room.memberCount} 명
          </div>
        </div>

        <div className="absolute top-1/2 right-[10px] -translate-y-1/2">
          {isEnterable ? (
            <button
              className="flex h-[28px] items-center justify-center rounded-[5px] bg-gray-200 px-[12px]"
              onClick={(e) => {
                e.stopPropagation();
                onAction?.("enter");
              }}
            >
              <span className="B2 leading-[150%] font-medium tracking-[-0.025em] text-gray-900">
                입장하기
              </span>
            </button>
          ) : (
            <div className="flex h-[28px] items-center justify-center rounded-[5px] bg-gray-700 px-[12px]">
              <span className="B2 leading-[150%] font-medium tracking-[-0.025em] text-gray-900">
                대기 중
              </span>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[361px] -translate-x-1/2">
          <IconChatlineRead className="w-full" />
        </div>
      </div>
    );
  }

  // 활성 탭 로직
  const activeSwipeWidth = 136;

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const threshold = activeSwipeWidth / 2;

    if (offset > threshold) {
      await controls.start({ x: activeSwipeWidth });
      setSwipedState("right");
    } else if (offset < -threshold) {
      await controls.start({ x: -activeSwipeWidth });
      setSwipedState("left");
    } else {
      await controls.start({ x: 0 });
      setSwipedState("none");
    }

    // Small delay to ensure onClick is blocked if it fires immediately after drag
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  return (
    <div className="relative h-[124px] w-full overflow-hidden bg-black select-none">
      <motion.div
        drag="x"
        dragConstraints={{ left: -activeSwipeWidth, right: activeSwipeWidth }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 flex h-full w-full items-center bg-black px-[10px]"
        onClickCapture={(e) => {
          // If dragging occurred, stop propagation to prevent parent clicks if any
          if (isDragging.current) {
            e.stopPropagation();
          }
        }}
        onClick={() => {
          if (isDragging.current) return;
          if (swipedState !== "none") {
            controls.start({ x: 0 });
            setSwipedState("none");
          } else {
            onClick?.();
          }
        }}
      >
        {/* 왼쪽에서 따라오는 버튼들 (오른쪽으로 스와이프 시 보임) */}
        <div
          className="absolute top-0 right-full flex h-full"
          style={{ width: activeSwipeWidth }}
        >
          <button
            className="flex h-full flex-1 items-center justify-center bg-gray-500 text-gray-100"
            onClick={() => {
              onAction?.("pin");
              controls.start({ x: 0 });
            }}
          >
            <IconChatPin width={24} height={24} />
          </button>
          <button
            className="flex h-full flex-1 items-center justify-center bg-gray-600 text-gray-100"
            onClick={() => {
              onAction?.("mute");
              controls.start({ x: 0 });
            }}
          >
            <IconChatSilent width={24} height={24} color="#e2e2e2" />
          </button>
        </div>

        {displayImage ? (
          <img
            src={displayImage}
            alt={room.title}
            className="mr-4 h-[100px] w-[75px] shrink-0 rounded-[5px] border border-gray-700 object-cover"
          />
        ) : (
          <div className="mr-4 h-[100px] w-[75px] shrink-0 rounded-[5px] border border-gray-700 bg-gray-200 shadow-[inset_0_0_20px_rgba(255,255,255,0.25)] transition-opacity active:opacity-80" />
        )}

        <div className="flex h-full min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-1">
            <span className="H2 bg-gradient-to-b from-white to-[#F7F7F7]/30 bg-clip-text leading-[150%] tracking-[-0.5px] text-transparent">
              {room.title}
            </span>
            {room.isPinned && <IconChatPinned className="h-[18px] w-[18px]" />}
            {room.isMuted && (
              <IconChatListQuiet className="h-[16px] w-[16px]" />
            )}
          </div>
          <div className="text-[12px] leading-[150%] font-normal tracking-[-0.025em] text-gray-400">
            {room.memberCount} 명
          </div>
        </div>

        <div className="absolute top-[40px] right-[10px] flex flex-col items-end">
          <span className="text-[10px] leading-[150%] font-[400] tracking-[-0.025em] text-gray-500">
            {formatChatDate(room.lastMessageTime ?? "")}
          </span>
        </div>

        {room.unreadCount && room.unreadCount > 0 ? (
          <div className="absolute top-[65px] right-[10px] flex h-[24px] items-center justify-center rounded-[5px] bg-gray-800 px-[8px]">
            <span className="B2 leading-[150%] tracking-[-0.025em] text-white">
              {room.unreadCount ?? 0}
            </span>
          </div>
        ) : null}

        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[361px] -translate-x-1/2">
          {(room.unreadCount ?? 0) > 0 ? (
            <IconChatlineUnread className="w-full" />
          ) : (
            <IconChatlineRead className="w-full" />
          )}
        </div>

        {/* 오른쪽에서 따라오는 버튼들 (왼쪽으로 스와이프 시 보임) */}
        <div
          className="absolute top-0 left-full ml-auto flex h-full"
          style={{ width: activeSwipeWidth }}
        >
          <button
            className="flex h-full flex-1 items-center justify-center bg-gray-700 text-gray-100"
            onClick={() => {
              onAction?.("read");
              controls.start({ x: 0 });
            }}
          >
            <span className="B2 leading-[150%] tracking-[-0.025em]">읽음</span>
          </button>
          <button
            className="flex h-full flex-1 items-center justify-center bg-gray-800 text-gray-100"
            onClick={() => {
              onAction?.("exit");
              controls.start({ x: 0 });
            }}
          >
            <span className="B2 leading-[150%] tracking-[-0.025em]">
              나가기
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
