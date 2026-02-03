import { useState, useEffect } from "react";
import { ChatListItem } from "@/components/tribe-chat/ChatListItem";
import type { ChatRoom } from "@/types/tribeChat";
import { MY_ROOMS, WAITING_ROOMS } from "@/constants/tribeChatData";
import IconChatScrap from "@/assets/icons/icon_chat_scrap.svg?react";
import IconNavbarTribe from "@/assets/icons/icon_navbar_tribe.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { TribeChatExitModal } from "@/components/tribe-chat/TribeChatExitModal";
import { useNavigate } from "react-router-dom";

const TribechatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ing" | "waiting">("ing");
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

  const [selectedRoomForExit, setSelectedRoomForExit] = useState<string | null>(
    null,
  );

  const handleConfirmExit = () => {
    if (selectedRoomForExit) {
      setMyRooms((prev) => prev.filter((r) => r.id !== selectedRoomForExit));
      setSelectedRoomForExit(null);
    }
  };

  // 룸 액션 핸들러
  const handleRoomAction = (
    roomId: string,
    action: "mute" | "pin" | "read" | "exit" | "enter",
  ) => {
    if (action === "mute") {
      setMyRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, isMuted: !r.isMuted } : r)),
      );
    } else if (action === "pin") {
      setMyRooms((prev) =>
        prev.map((r) =>
          r.id === roomId ? { ...r, isPinned: !r.isPinned } : r,
        ),
      );
    } else if (action === "read") {
      setMyRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r)),
      );
    } else if (action === "exit") {
      setSelectedRoomForExit(roomId);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-black text-white">
      <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-center bg-black px-4 pt-[70px] pb-6">
        {/* 탭 전환 */}
        <div className="flex items-center justify-center">
          {/* 활성화 탭 */}
          <div
            className={`flex h-[32px] w-[79px] cursor-pointer items-center justify-center transition-all duration-200 select-none ${
              activeTab === "ing"
                ? "border-b-[2px] border-gray-200"
                : "border-b-[1px] border-gray-700"
            }`}
            onClick={() => setActiveTab("ing")}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] ${
                activeTab === "ing" ? "text-gray-200" : "text-gray-600"
              }`}
            >
              활성화
            </span>
          </div>

          {/* 비활성화 탭 */}
          <div
            className={`flex h-[32px] w-[79px] cursor-pointer items-center justify-center transition-all duration-200 select-none ${
              activeTab === "waiting"
                ? "border-b-[2px] border-gray-200"
                : "border-b-[1px] border-gray-700"
            }`}
            onClick={() => setActiveTab("waiting")}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] ${
                activeTab === "waiting" ? "text-gray-200" : "text-gray-600"
              }`}
            >
              비활성화
            </span>
          </div>
        </div>

        {/* 우측 아이콘 (스크랩) - top 73px에 absolute 배치 */}
        <div className="absolute top-[73px] right-4">
          <IconChatScrap className="h-[24px] w-[24px] text-white" />
        </div>
      </div>

      {/* 리스트 콘텐츠 */}
      <div className="flex-1 touch-auto overflow-y-auto px-[14px] pt-[115px] pb-24">
        {activeTab === "ing" ? (
          myRooms.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <IconNavbarTribe className="h-[48px] w-[48px] text-gray-500" />
              <p className="ST2 mt-[12px] leading-[150%] tracking-[-0.025em] text-gray-500">
                아직 트라이브 챗이 없어요.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-[365px] flex-col">
              {myRooms.map((room) => (
                <ChatListItem
                  key={room.id}
                  room={room}
                  isActiveTab={true}
                  onAction={(action) => handleRoomAction(room.id, action)}
                  onClick={() => navigate(`/tribe-chat/:${room.id}`)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="mx-auto flex w-[365px] flex-col">
            {waitingRooms.map((room) => (
              <ChatListItem
                key={room.id}
                room={room}
                isActiveTab={false}
                onAction={(action) =>
                  console.log(`Action: ${action} on room ${room.id}`)
                }
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
            className="pointer-events-none fixed bottom-[100px] left-1/2 z-50 flex h-[48px] w-[344px] items-center justify-center rounded-[5px] bg-gray-200/85 py-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_1px_3px_0_rgba(18,18,18,0.3)] backdrop-blur-[30px]"
          >
            <span className="B2 text-center leading-[150%] tracking-[-0.025em] text-black">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 나가기 확인 모달 */}
      {selectedRoomForExit && (
        <TribeChatExitModal
          roomTitle={
            myRooms.find((r) => r.id === selectedRoomForExit)?.title ?? ""
          }
          onConfirm={handleConfirmExit}
          onCancel={() => setSelectedRoomForExit(null)}
        />
      )}
    </div>
  );
};

export default TribechatPage;
