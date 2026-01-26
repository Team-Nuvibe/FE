import { useState, useEffect } from 'react';
import { ChatListItem } from '@/components/tribe-chat/ChatListItem';
import type { ChatRoom } from '@/types/tribeChat';
import { MY_ROOMS, WAITING_ROOMS } from '@/constants/tribeChatData';
import IconChatActive from '@/assets/icons/icon_chat_active.svg?react';
import IconChatInactive from '@/assets/icons/icon_chat_inactive.svg?react';
import IconChatScrap from '@/assets/icons/icon_chat_scrap.svg?react';
import { AnimatePresence, motion } from 'framer-motion';

const TribechatPage = () => {
  // 탭 상태: 'ing' (참여중) | 'waiting' (대기중)
  const [activeTab, setActiveTab] = useState<'ing' | 'waiting'>('ing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    // Clear existing timer if any (simple implementation)
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 더미 데이터 사용 (Constants)
  const [myRooms] = useState<ChatRoom[]>(MY_ROOMS);
  const [waitingRooms] = useState<ChatRoom[]>(WAITING_ROOMS);

  return (
    <div className="w-full h-full min-h-screen bg-[#121212] text-white flex flex-col relative">
      {/* 헤더 영역 */}
      {/* Top: 70px explicitly requested for content start. 
          Scrap Icon: Top 73px absolute.
      */}
      {/* 헤더 영역 - 리스트의 위치를 정확하게 잡기 위해 absolute 사용 */}
      <div className="absolute top-0 left-0 w-full px-4 pt-[70px] pb-6 flex items-center justify-center z-10 bg-[#121212]">

        {/* 탭 전환 (중앙 정렬, 122px width) */}
        <div className="relative w-[122px] h-[29px] select-none cursor-pointer">
          {activeTab === 'ing' ? (
            <IconChatActive className="w-full h-full" />
          ) : (
            <IconChatInactive className="w-full h-full" />
          )}

          {/* 숨겨진 클릭 영역 */}
          <div className="absolute inset-0 flex">
            <div
              className="flex-1"
              onClick={() => setActiveTab('ing')}
            />
            <div
              className="flex-1"
              onClick={() => setActiveTab('waiting')}
            />
          </div>
        </div>

        {/* 우측 아이콘 (스크랩) - top 73px에 absolute 배치 */}
        <div className="absolute right-4 top-[73px]">
          <IconChatScrap className="w-[24px] h-[24px] text-white" />
        </div>
      </div>


      {/* 리스트 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-[14px] pt-[115px] pb-24 touch-auto">
        {/* 참고: 컨테이너의 상단 패딩 115px 설정 */}
        {activeTab === 'ing' ? (
          <div className="flex flex-col w-[365px] mx-auto">
            {myRooms.map(room => (
              <ChatListItem
                key={room.id}
                room={room}
                isActiveTab={true}
                onAction={(action) => console.log(`Action: ${action} on room ${room.id}`)}
                onClick={() => console.log(`Clicked room ${room.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-[365px] mx-auto">
            {waitingRooms.map(room => (
              <ChatListItem
                key={room.id}
                room={room}
                isActiveTab={false}
                onAction={(action) => console.log(`Action: ${action} on room ${room.id}`)}
                onClick={() => {
                  // 방에 입장할 수 없는 경우 (대기중), 토스트 메시지 표시
                  if (room.memberCount < 5) {
                    showToast("아직 참여 인원이 충분하지 않아요.");
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 토스트 메시지 */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-[100px] left-1/2 w-[344px] h-[48px] bg-[#D0D3D7]/85 backdrop-blur-[30px] rounded-[5px] flex items-center justify-center py-[10px] z-50 pointer-events-none shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_1px_3px_0_rgba(18,18,18,0.3)]"
          >
            <span className="text-black B2 leading-[150%] tracking-[-0.025em] text-center">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TribechatPage;
