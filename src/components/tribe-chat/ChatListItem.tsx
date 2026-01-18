import { motion, useAnimation, type PanInfo } from 'framer-motion';
import { useState } from 'react';
import IconChatSilent from '@/assets/icons/icon_chat_silent.svg?react';
import IconChatPin from '@/assets/icons/icon_chat_pin.svg?react';
import IconChatPinned from '@/assets/icons/icon_chat_pinned.svg?react';
import type { ChatRoom } from '@/types/tribeChat';

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
                className={`relative w-full h-[116px] flex items-center px-4 border-b border-[#3E3E3E] transition-colors bg-[#121212]
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
                {/* 썸네일 영역 */}
                <div className={`w-[75px] h-[100px] rounded-[18px] mr-4 shrink-0 
            ${isEnterable ? 'bg-[#D9D9D9]' : 'bg-[#3A3A3A]'}
        `} />

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1 mb-1">
                        <span className={`text-[20px] font-[600] leading-[150%] tracking-[-0.025em] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#F7F7F7]/30
                ${isEnterable ? '' : 'text-[#888888]'}
            `}>
                            {room.title}
                        </span>
                        {room.isPinned && <IconChatPinned className="w-[18px] h-[18px]" />}
                    </div>
                    <div className={`text-[12px] font-normal leading-[150%] tracking-[-0.025em]
             ${isEnterable ? 'text-[#8F9297]' : 'text-[#666666]'}
          `}>
                        {room.memberCount} 명
                    </div>
                </div>

                {/* 액션 버튼 - 수직 중앙 정렬 */}
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2">
                    {isEnterable ? (
                        <button
                            className="w-[57px] h-[28px] bg-[#B9BDC2] border border-[#D0D3D7] rounded-[5px] flex items-center justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction?.('enter');
                            }}
                        >
                            <span className="text-[#121212] text-[12px] font-medium leading-[150%] tracking-[-0.025em]">입장하기</span>
                        </button>
                    ) : (
                        <div className="w-[57px] h-[28px] bg-[#36383e] rounded-[5px] flex items-center justify-center">
                            <span className="text-[#75787E] text-[12px] font-medium leading-[150%] tracking-[-0.025em]">대기 중</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 활성 탭 로직 (스와이프 가능)
    const activeSwipeWidth = 116; // 스와이프 액션의 총 너비
    const handleDragEnd = async (event: any, info: PanInfo) => {
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
        <div className="relative w-full h-[116px] select-none overflow-hidden bg-[#121212] border-b border-[#3E3E3E]">

            {/* 배경 액션 레이어 */}
            <div className="absolute inset-0 flex justify-between bg-[#2C2C2C]">
                {/* 왼쪽 액션 (오른쪽으로 스와이프 시 노출) */}
                <div className="flex h-full" style={{ width: activeSwipeWidth }}>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-700 text-gray-100"
                        onClick={() => { onAction?.('mute'); controls.start({ x: 0 }); }}
                    >
                        <IconChatSilent width={24} height={24} />
                    </button>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-500 text-gray-100"
                        onClick={() => { onAction?.('pin'); controls.start({ x: 0 }); }}
                    >
                        <IconChatPin width={24} height={24} />
                    </button>
                </div>

                {/* 오른쪽 액션 (왼쪽으로 스와이프 시 노출) */}
                <div className="flex h-full ml-auto" style={{ width: activeSwipeWidth }}>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-500 text-gray-100"
                        onClick={() => { onAction?.('read'); controls.start({ x: 0 }); }}
                    >
                        <span className="text-[12px] font-[400] leading-[150%] tracking-[-0.025em]">읽음</span>
                    </button>
                    <button
                        className="flex-1 h-full flex items-center justify-center bg-gray-700 text-gray-100"
                        onClick={() => { onAction?.('exit'); controls.start({ x: 0 }); }}
                    >
                        <span className="text-[12px] font-[400] leading-[150%] tracking-[-0.025em]">나가기</span>
                    </button>
                </div>
            </div>

            {/* 전경 콘텐츠 레이어 */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -activeSwipeWidth, right: activeSwipeWidth }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative w-full h-full bg-[#121212] flex items-center px-4 z-10"
                onClick={() => {
                    if (swipedState !== 'none') {
                        controls.start({ x: 0 });
                        setSwipedState('none');
                    } else {
                        onClick?.();
                    }
                }}
            >
                {/* 썸네일 */}
                <div className="w-[75px] h-[100px] bg-[#D9D9D9] rounded-[18px] mr-4 shrink-0 transition-opacity active:opacity-80
                " />

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-[20px] font-[600] text-transparent bg-clip-text bg-gradient-to-b from-white to-[#F7F7F7]/30 leading-[150%] tracking-[-0.025em]">
                            {room.title}
                        </span>
                        {room.isPinned && <IconChatPinned className="w-[18px] h-[18px]" />}
                    </div>
                    <div className="text-[12px] font-normal text-[#8F9297] leading-[150%] tracking-[-0.025em]">
                        {room.memberCount} 명
                    </div>
                </div>

                {/* 우측 정보 (절대 위치) */}
                <div className="absolute right-[14px] top-[36px] flex flex-col items-end">
                    <span className="text-[10px] text-[#75787E] font-[400] leading-[150%] tracking-[-0.025em]">
                        {room.lastMessageTime}
                    </span>
                </div>

                {room.unreadCount && room.unreadCount > 0 && (
                    <div className="absolute right-[14px] top-[61px] w-[24px] h-[24px] bg-[#75787E] rounded-[5px] flex items-center justify-center">
                        <span className="text-[10px] font-[400] text-white leading-[150%] tracking-[-0.025em]">
                            {room.unreadCount}
                        </span>
                    </div>
                )}

            </motion.div>
        </div>
    );
};
