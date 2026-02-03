import { useState, useEffect } from 'react';
import { ChatListItem } from '@/components/tribe-chat/ChatListItem';
import type { ChatRoom } from '@/types/tribeChat';
import { MY_ROOMS, WAITING_ROOMS } from '@/constants/tribeChatData';
import IconChatScrap from '@/assets/icons/icon_chat_scrap.svg?react';
import IconNavbarTribe from '@/assets/icons/icon_navbar_tribe.svg?react';
import { AnimatePresence, motion } from 'framer-motion';
import { TribeChatExitModal } from '@/components/tribe-chat/TribeChatExitModal';

const TribechatPage = () => {
  const [activeTab, setActiveTab] = useState<'ing' | 'waiting'>('ing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
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
  const [myRooms, setMyRooms] = useState<ChatRoom[]>(MY_ROOMS);
  const [waitingRooms] = useState<ChatRoom[]>(WAITING_ROOMS);

  const [selectedRoomForExit, setSelectedRoomForExit] = useState<string | null>(null);

  const handleConfirmExit = () => {
    if (selectedRoomForExit) {
      setMyRooms(prev => prev.filter(r => r.id !== selectedRoomForExit));
      setSelectedRoomForExit(null);
    }
  };

  // 룸 액션 핸들러
  const handleRoomAction = (roomId: string, action: 'mute' | 'pin' | 'read' | 'exit' | 'enter') => {
    if (action === 'mute') {
      setMyRooms(prev => prev.map(r => r.id === roomId ? { ...r, isMuted: !r.isMuted } : r));
    } else if (action === 'pin') {
      setMyRooms(prev => prev.map(r => r.id === roomId ? { ...r, isPinned: !r.isPinned } : r));
    } else if (action === 'read') {
      setMyRooms(prev => prev.map(r => r.id === roomId ? { ...r, unreadCount: 0 } : r));
    } else if (action === 'exit') {
      setSelectedRoomForExit(roomId);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-black text-white flex flex-col relative">
      <div className="absolute top-0 left-0 w-full px-4 pt-[70px] pb-6 flex items-center justify-center z-10 bg-black">

        {/* 탭 전환 */}
        <div className="flex items-center justify-center">
          {/* 활성화 탭 */}
          <div
            className={`w-[79px] h-[32px] flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${activeTab === 'ing'
              ? 'border-b-[2px] border-gray-200'
              : 'border-b-[1px] border-gray-700'
              }`}
            onClick={() => setActiveTab('ing')}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] ${activeTab === 'ing'
                ? 'text-gray-200'
                : 'text-gray-600'
                }`}
            >
              활성화
            </span>
          </div>

          {/* 비활성화 탭 */}
          <div
            className={`w-[79px] h-[32px] flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${activeTab === 'waiting'
              ? 'border-b-[2px] border-gray-200'
              : 'border-b-[1px] border-gray-700'
              }`}
            onClick={() => setActiveTab('waiting')}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] ${activeTab === 'waiting'
                ? 'text-gray-200'
                : 'text-gray-600'
                }`}
            >
              비활성화
            </span>
          </div>
        </div>

        {/* 우측 아이콘 (스크랩) - top 73px에 absolute 배치 */}
        <div className="absolute right-4 top-[73px]">
          <IconChatScrap className="w-[24px] h-[24px] text-white" />
        </div>
      </div>


      {/* 리스트 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-[14px] pt-[115px] pb-24 touch-auto">
        {activeTab === 'ing' ? (
          myRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <IconNavbarTribe className="w-[48px] h-[48px] text-gray-500" />
              <p className="mt-[12px] text-gray-500 ST2 leading-[150%] tracking-[-0.025em]">
                아직 트라이브 챗이 없어요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-[365px] mx-auto">
              {myRooms.map(room => (
                <ChatListItem
                  key={room.id}
                  room={room}
                  isActiveTab={true}
                  onAction={(action) => handleRoomAction(room.id, action)}
                  onClick={() => console.log(`Clicked room ${room.id}`)}
                />
              ))}
            </div>
          )
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
            className="fixed bottom-[100px] left-1/2 w-[344px] h-[48px] bg-gray-200/85 backdrop-blur-[30px] rounded-[5px] flex items-center justify-center py-[10px] z-50 pointer-events-none shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_1px_3px_0_rgba(18,18,18,0.3)]"
          >
            <span className="text-black B2 leading-[150%] tracking-[-0.025em] text-center">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 나가기 확인 모달 */}
      {
        selectedRoomForExit && (
          <TribeChatExitModal
            roomTitle={myRooms.find(r => r.id === selectedRoomForExit)?.title ?? ''}
            onConfirm={handleConfirmExit}
            onCancel={() => setSelectedRoomForExit(null)}
          />
        )
      }
    </div >
  );
}

export default TribechatPage;
