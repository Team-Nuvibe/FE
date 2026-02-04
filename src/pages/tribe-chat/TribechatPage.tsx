import { useState, useEffect } from "react";
import { ChatListItem } from "@/components/tribe-chat/ChatListItem";
import IconChatScrap from "@/assets/icons/icon_chat_scrap.svg?react";
import IconNavbarTribe from "@/assets/icons/icon_navbar_tribe.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { TribeChatExitModal } from "@/components/tribe-chat/TribeChatExitModal";
import { useNavigate } from "react-router-dom";
import useGetActiveTribeList from "@/hooks/queries/tribe-chat/useGetActiveTribeList";
import useGetWaitingTribeList from "@/hooks/queries/tribe-chat/useGetWaitingTribeList";
import useToggleTribeFavorite from "@/hooks/mutation/tribe-chat/useToggleTribeFavorite";
import useLeaveTribe from "@/hooks/mutation/tribe-chat/useLeaveTribe";
import useMarkTribeAsRead from "@/hooks/mutation/tribe-chat/useMarkTribeAsRead";
import useActivateUserTribe from "@/hooks/mutation/tribe-chat/useActivateUserTribe";

const TribechatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ing" | "waiting">("ing");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRoomForExit, setSelectedRoomForExit] = useState<{
    userTribeId: number;
    tribeId: number;
    title: string;
  } | null>(null);

  // React Query 훅
  const { data: activeTribeData, isLoading: isLoadingActive } =
    useGetActiveTribeList();
  const { data: waitingTribeData, isLoading: isLoadingWaiting } =
    useGetWaitingTribeList();

  // Mutation 훅
  const { mutate: toggleFavorite } = useToggleTribeFavorite();
  const { mutate: leaveTribe } = useLeaveTribe();
  const { mutate: markAsRead } = useMarkTribeAsRead();
  const { mutate: activateUserTribe } = useActivateUserTribe();

  // API 응답 로그 (디버깅용)
  useEffect(() => {
    if (activeTribeData) {
      console.log("✅ 활성화된 트라이브 목록:", activeTribeData);
      console.log("✅ 활성화된 트라이브 items:", activeTribeData.data?.items);
    }
  }, [activeTribeData]);

  useEffect(() => {
    if (waitingTribeData) {
      console.log("⏳ 대기 중인 트라이브 목록:", waitingTribeData);
      console.log("⏳ 대기 중인 트라이브 items:", waitingTribeData.data?.items);
    }
  }, [waitingTribeData]);

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

  const handleConfirmExit = () => {
    if (selectedRoomForExit) {
      leaveTribe(selectedRoomForExit.userTribeId, {
        onSuccess: () => {
          showToast("트라이브 챗에서 나갔습니다.");
          setSelectedRoomForExit(null);
        },
        onError: () => {
          showToast("나가기에 실패했습니다.");
        },
      });
    }
  };

  // 룸 액션 핸들러
  const handleRoomAction = (
    userTribeId: number,
    tribeId: number,
    action: "mute" | "pin" | "read" | "exit" | "enter",
    roomTitle: string,
  ) => {
    if (action === "pin") {
      // 즐겨찾기 토글
      toggleFavorite(userTribeId, {
        onSuccess: () => {
          showToast("즐겨찾기가 변경되었습니다.");
        },
        onError: () => {
          showToast("즐겨찾기 변경에 실패했습니다.");
        },
      });
    } else if (action === "read") {
      // 읽음 처리
      markAsRead(tribeId, {
        onSuccess: () => {
          showToast("모두 읽음 처리되었습니다.");
        },
        onError: () => {
          showToast("읽음 처리에 실패했습니다.");
        },
      });
    } else if (action === "exit") {
      // 나가기 모달 표시
      setSelectedRoomForExit({ userTribeId, tribeId, title: roomTitle });
    }
  };

  // 활성화된 트라이브 데이터 변환
  const activeRooms =
    activeTribeData?.data.items.map((item) => ({
      id: item.tribeId.toString(),
      userTribeId: item.userTribeId, // API response now has userTribeId
      title: `#${item.imageTag}`,
      memberCount: item.counts ?? 0,
      isPinned: item.isFavorite,
      isMuted: false, // API 응답에 없으므로 기본값
      unreadCount: item.unreadCount ?? 0,
      lastMessageTime: item.lastActivityAt,
      tags: [item.imageTag],
    })) ?? [];

  // 대기 중인 트라이브 데이터 변환
  const waitingRooms =
    waitingTribeData?.data.items.map((item) => ({
      id: item.tribeId.toString(),
      userTribeId: item.userTribeId,
      title: `#${item.imageTag}`,
      memberCount: item.counts,
      isPinned: false,
      isMuted: false,
      unreadCount: 0,
      tags: [item.imageTag],
    })) ?? [];

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
          <IconChatScrap
            className="h-[24px] w-[24px] text-white"
            onClick={() => {
              const activeTags = Array.from(
                new Set(activeRooms.flatMap((room) => room.tags ?? [])),
              );
              navigate("/tribe-chat/scrap", {
                state: { tags: activeTags },
              });
            }}
          />
        </div>
      </div>

      {/* 리스트 콘텐츠 */}
      <div className="flex-1 touch-auto overflow-y-auto px-[14px] pt-[115px] pb-24">
        {activeTab === "ing" ? (
          isLoadingActive ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="ST2 leading-[150%] tracking-[-0.025em] text-gray-500">
                로딩 중...
              </p>
            </div>
          ) : activeRooms.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <IconNavbarTribe className="h-[48px] w-[48px] text-gray-500" />
              <p className="ST2 mt-[12px] leading-[150%] tracking-[-0.025em] text-gray-500">
                아직 트라이브 챗이 없어요.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-[365px] flex-col">
              {activeRooms.map((room) => (
                <ChatListItem
                  key={room.id}
                  room={room}
                  isActiveTab={true}
                  onAction={(action) =>
                    handleRoomAction(
                      room.userTribeId,
                      Number(room.id),
                      action,
                      room.title,
                    )
                  }
                  onClick={() =>
                    navigate(`/tribe-chat/${room.id}`, {
                      state: { imageTag: room.tags?.[0] || "Tribe" },
                    })
                  }
                />
              ))}
            </div>
          )
        ) : isLoadingWaiting ? (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="ST2 leading-[150%] tracking-[-0.025em] text-gray-500">
              로딩 중...
            </p>
          </div>
        ) : waitingRooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <IconNavbarTribe className="h-[48px] w-[48px] text-gray-500" />
            <p className="ST2 mt-[12px] leading-[150%] tracking-[-0.025em] text-gray-500">
              아직 트라이브 챗이 없어요.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-[365px] flex-col">
            {waitingRooms.map((room) => (
              <ChatListItem
                key={room.id}
                room={room}
                isActiveTab={false}
                onAction={(action) => {
                  if (action === "enter") {
                    // 대기 탭: 트라이브 활성화 후 채팅방으로 이동
                    activateUserTribe(room.userTribeId, {
                      onSuccess: () => {
                        showToast(`${room.title}에 입장했습니다.`);
                        navigate(`/tribe-chat/${room.id}`, {
                          state: { imageTag: room.tags?.[0] || "Tribe" },
                        });
                      },
                      onError: () => {
                        showToast("트라이브 활성화에 실패했습니다.");
                      },
                    });
                  }
                }}
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
          roomTitle={selectedRoomForExit.title}
          onConfirm={handleConfirmExit}
          onCancel={() => setSelectedRoomForExit(null)}
        />
      )}
    </div>
  );
};

export default TribechatPage;
