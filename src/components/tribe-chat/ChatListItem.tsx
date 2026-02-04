import { motion, useAnimation, type PanInfo } from 'framer-motion';
import { useState } from 'react';
import IconChatListQuiet from '@/assets/icons/icon_chatlist_quiet.svg?react';
import IconChatSilent from '@/assets/icons/icon_chat_silent.svg?react';
import IconChatPin from '@/assets/icons/icon_chat_pin.svg?react';
import IconChatPinned from '@/assets/icons/icon_chat_pinned.svg?react';
import IconChatlineRead from '@/assets/icons/icon_chatline_read.svg?react';
import IconChatlineUnread from '@/assets/icons/icon_chatline_unread.svg?react';

import type { ChatRoom } from '@/types/tribeChat';
import { formatChatDate } from '@/utils/formatChatDate';

interface ChatListItemProps {
    room: ChatRoom;
    isActiveTab: boolean; // 'active' tab vs 'inactive' tab
    onAction?: (action: 'mute' | 'pin' | 'read' | 'exit' | 'enter') => void;
    onClick?: () => void;
}

export const ChatListItem = ({ room, isActiveTab, onAction, onClick }: ChatListItemProps) => {
    const controls = useAnimation();
    const [swipedState, setSwipedState] = useState<'none' | 'left' | 'right'>('none');

    // 비활성 탭 로직
    if (!isActiveTab) {
        const isEnterable = room.memberCount >= 5;

        return (
            <div
                className={`relative w-full h-[124px] flex items-center px-[10px] transition-colors bg-black
          ${!isEnterable ? 'opacity-40' : ''}
        `}
                onClick={() => {
                    if (!isEnterable) {
                        onClick?.();
                    } else {
                        onAction?.('enter');
                    }
                }}
            >
                {room.thumbnailUrl ? (
                    <img
                        src={room.thumbnailUrl}
                        alt={room.title}
                        className="w-[75px] h-[100px] rounded-[5px] mr-4 shrink-0 border border-gray-700 object-cover"
                    />
                ) : (
                    <div className="w-[75px] h-[100px] bg-gray-200 rounded-[5px] mr-4 shrink-0 border border-gray-700 shadow-[inset_0_0_20px_rgba(255,255,255,0.25)]" />
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1 mb-1">
                        <span className={`H2 leading-[150%] tracking-[-0.025em] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#F7F7F7]/30
                ${isEnterable ? '' : 'text-gray-400'}
            `}>
                            {room.title}
                        </span>
                        {room.isPinned && <IconChatPinned className="w-[18px] h-[18px]" />}
                    </div>
                    <div className={`text-[12px] font-normal leading-[150%] tracking-[-0.025em]
             ${isEnterable ? 'text-gray-400' : 'text-gray-600'}
          `}>
                        {room.memberCount} 명
                    </div>
                </div>

                <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    {isEnterable ? (
                        <button
                            className="h-[28px] px-[12px] bg-gray-200 rounded-[5px] flex items-center justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction?.('enter');
                            }}
                        >
                            <span className="text-gray-900 B2 font-medium leading-[150%] tracking-[-0.025em]">입장하기</span>
                        </button>
                    ) : (
                        <div className="h-[28px] px-[12px] bg-gray-700 rounded-[5px] flex items-center justify-center">
                            <span className="text-gray-500 B2 font-medium leading-[150%] tracking-[-0.025em]">대기 중</span>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[361px] pointer-events-none">
                    <IconChatlineRead className="w-full" />
                </div>
            </div>
        );
    }

    // 활성 탭 로직
    const activeSwipeWidth = 136;
    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset.x;
        const threshold = activeSwipeWidth / 2;

        if (offset > threshold) {
            await controls.start({ x: activeSwipeWidth });
            setSwipedState('right');
        } else if (offset < -threshold) {
            await controls.start({ x: -activeSwipeWidth });
            setSwipedState('left');
        } else {
            await controls.start({ x: 0 });
            setSwipedState('none');
        }
    };

    return (
        <div className="relative w-full h-[124px] select-none overflow-hidden bg-black">

            <motion.div
                drag="x"
                dragConstraints={{ left: -activeSwipeWidth, right: activeSwipeWidth }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative w-full h-full bg-black flex items-center px-[10px] z-10"
                onClick={() => {
                    if (swipedState !== 'none') {
                        controls.start({ x: 0 });
                        setSwipedState('none');
                    } else {
                        onClick?.();
                    }
                }}
            >
                {/* 왼쪽에서 따라오는 버튼들 (오른쪽으로 스와이프 시 보임) */}
                <div className="absolute top-0 right-full h-full flex" style={{ width: activeSwipeWidth }}>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-500 text-gray-100"
                        onClick={() => { onAction?.('pin'); controls.start({ x: 0 }); }}
                    >
                        <IconChatPin width={24} height={24} />
                    </button>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-600 text-gray-100"
                        onClick={() => { onAction?.('mute'); controls.start({ x: 0 }); }}
                    >
                        <IconChatSilent width={24} height={24} color="#e2e2e2" />
                    </button>
                </div>

                {room.thumbnailUrl ? (
                    <img
                        src={room.thumbnailUrl}
                        alt={room.title}
                        className="w-[75px] h-[100px] rounded-[5px] mr-4 shrink-0 border border-gray-700 object-cover"
                    />
                ) : (
                    <div className="w-[75px] h-[100px] bg-gray-200 rounded-[5px] mr-4 shrink-0 border border-gray-700 shadow-[inset_0_0_20px_rgba(255,255,255,0.25)] transition-opacity active:opacity-80" />
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="H2 text-transparent bg-clip-text bg-gradient-to-b from-white to-[#F7F7F7]/30 leading-[150%] tracking-[-0.025em]">
                            {room.title}
                        </span>
                        {room.isPinned && <IconChatPinned className="w-[18px] h-[18px]" />}
                        {room.isMuted && <IconChatListQuiet className="w-[16px] h-[16px]" />}
                    </div>
                    <div className="text-[12px] font-normal text-gray-400 leading-[150%] tracking-[-0.025em]">
                        {room.memberCount} 명
                    </div>
                </div>

                <div className="absolute right-[10px] top-[40px] flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-[400] leading-[150%] tracking-[-0.025em]">
                        {formatChatDate(room.lastMessageTime ?? '')}
                    </span>
                </div>

                {room.unreadCount && room.unreadCount > 0 ? (
                    <div className="absolute right-[10px] top-[65px] h-[24px] px-[8px] bg-gray-800 rounded-[5px] flex items-center justify-center">
                        <span className="B2 text-white leading-[150%] tracking-[-0.025em]">
                            {room.unreadCount ?? 0}
                        </span>
                    </div>
                ) : null}

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[361px] pointer-events-none">
                    {(room.unreadCount ?? 0) > 0 ? (
                        <IconChatlineUnread className="w-full" />
                    ) : (
                        <IconChatlineRead className="w-full" />
                    )}
                </div>

                {/* 오른쪽에서 따라오는 버튼들 (왼쪽으로 스와이프 시 보임) */}
                <div className="absolute top-0 left-full h-full flex ml-auto" style={{ width: activeSwipeWidth }}>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-700 text-gray-100"
                        onClick={() => { onAction?.('read'); controls.start({ x: 0 }); }}
                    >
                        <span className="B2 leading-[150%] tracking-[-0.025em]">읽음</span>
                    </button>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-800 text-gray-100"
                        onClick={() => { onAction?.('exit'); controls.start({ x: 0 }); }}
                    >
                        <span className="B2 leading-[150%] tracking-[-0.025em]">나가기</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
