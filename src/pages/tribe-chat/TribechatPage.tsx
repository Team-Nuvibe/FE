import { useState, useEffect, useMemo } from "react";
import { ChatListItem } from "@/components/tribe-chat/ChatListItem";
import IconChatScrap from "@/assets/icons/icon_chat_scrap.svg?react";
import IconNavbarTribe from "@/assets/icons/icon_navbar_tribe.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { TribeChatExitModal } from "@/components/tribe-chat/TribeChatExitModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useGetActiveTribeList from "@/hooks/queries/tribe-chat/useGetActiveTribeList";
import useGetWaitingTribeList from "@/hooks/queries/tribe-chat/useGetWaitingTribeList";
import useToggleTribeFavorite from "@/hooks/mutation/tribe-chat/useToggleTribeFavorite";
import useLeaveTribe from "@/hooks/mutation/tribe-chat/useLeaveTribe";
import useMarkTribeAsRead from "@/hooks/mutation/tribe-chat/useMarkTribeAsRead";
import useActivateUserTribe from "@/hooks/mutation/tribe-chat/useActivateUserTribe";
import { queryClient } from "@/App";

const TribechatPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(search);
  const initialTab = queryParams.get("tab") === "waiting" ? "waiting" : "ing";
  const [activeTab, setActiveTab] = useState<"ing" | "waiting">(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRoomForExit, setSelectedRoomForExit] = useState<{
    userTribeId: number;
    tribeId: number;
    title: string;
  } | null>(null);
  // 음소거 상태 관리를 위한 로컬 스토리지 로직 추가
  const [mutedTribeData, setMutedTribeData] = useState<Record<number, string>>(() => {
    const savedMutedData = localStorage.getItem("mutedTribeData");
    return savedMutedData ? JSON.parse(savedMutedData) : {};
  });

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

  useEffect(() => {
    // URL 파라미터가 바뀌면 탭 변경 연동
    const tabParam = new URLSearchParams(search).get("tab");
    if (tabParam === "waiting") setActiveTab("waiting");
    else if (tabParam === "ing") setActiveTab("ing");
  }, [search]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    // mutedTribeData 상태가 바뀔 때마다 로컬 스토리지에 저장
    localStorage.setItem("mutedTribeData", JSON.stringify(mutedTribeData));
  }, [mutedTribeData]);

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

  const showToast = (message: string) => {
    setToastMessage(message);
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
    } else if (action === "mute") {
      const now = new Date().toISOString();
      setMutedTribeData((prev) => {
        const next = { ...prev };
        if (next[tribeId]) {
          delete next[tribeId]; // 이미 있으면 제거 (음소거 해제)
        } else {
          next[tribeId] = now; // 없으면 현재 시각을 기준으로 음소거 설정
        }
        return next;
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
  const activeRooms = useMemo(() => {
    return activeTribeData?.data.items.map((item) => ({
      ...item,
      id: item.tribeId.toString(),
      userTribeId: item.userTribeId,
      title: `#${item.imageTag}`,
      memberCount: item.counts ?? 0,
      isPinned: item.isFavorite,
      isMuted: !!mutedTribeData[item.tribeId], // 객체에 키가 존재하는지 확인
      unreadCount: item.unreadCount ?? 0,
      lastMessageTime: item.lastActivityAt,
      tags: [item.imageTag],
    })) ?? [];
  }, [activeTribeData, mutedTribeData]); // 의존성 배열 확인

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

  // 채팅방 정렬 로직 적용
  const sortedActiveRooms = useMemo(() => {
    const indexedRooms = activeRooms.map((room, index) => ({
      ...room,
      originalIndex: index, // 서버에서 받은 순서 저장
    }));
    return [...indexedRooms].sort((a, b) => {
      // 1. 고정된 (Pinned) 채팅방 상단 고정
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1; // 고정된 방이 위로 (-1)
      }
      // 고정된 방끼리는 설정 순서대로 위치 고정
      if (a.isPinned) {
        return a.originalIndex - b.originalIndex;
      }
      // 고정되지 않은 방끼리는 안 읽은 메시지 여부 비교
      const aHasUnread = (a.unreadCount ?? 0) > 0;
      const bHasUnread = (b.unreadCount ?? 0) > 0;
      if (aHasUnread !== bHasUnread) {
        return aHasUnread ? -1 : 1; // 안 읽은 메시지 있는 방이 위로
      }
      // 안 읽은 메시지 여부가 같다면 최근 활동 시간 비교 (최신 순 정렬)
      const timeA = new Date(a.lastMessageTime ?? 0).getTime();
      const timeB = new Date(b.lastMessageTime ?? 0).getTime();
      return timeB - timeA; // 최신 시간이 위로
    });
  }, [activeRooms]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-black text-white">
      <div className="absolute top-0 left-0 z-20 flex w-full items-center justify-center bg-black px-4 pt-[8px] pb-4">
        {/* 탭 전환 */}
        <div className="flex items-center justify-center">
          {/* 활성화 탭 */}
          <div
            className="relative flex h-[32px] w-[79px] cursor-pointer items-center justify-center border-b-[1px] border-gray-700 select-none"
            onClick={() => setActiveTab("ing")}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] transition-colors duration-200 ${activeTab === "ing" ? "text-gray-200" : "text-gray-600"
                }`}
            >
              활성화
            </span>
            {activeTab === "ing" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute right-0 bottom-[-1px] left-0 z-10 h-[1.5px] bg-white"
                transition={{ stiffness: 500, damping: 30 }}
              />
            )}
          </div>

          {/* 비활성화 탭 */}
          <div
            className="relative flex h-[32px] w-[79px] cursor-pointer items-center justify-center border-b-[1px] border-gray-700 select-none"
            onClick={() => setActiveTab("waiting")}
          >
            <span
              className={`ST2 leading-[150%] tracking-[-0.025em] transition-colors duration-200 ${activeTab === "waiting" ? "text-gray-200" : "text-gray-600"
                }`}
            >
              비활성화
            </span>
            {activeTab === "waiting" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute right-0 bottom-[-1px] left-0 z-10 h-[1.5px] bg-white"
                transition={{ stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        </div>

        {/* 우측 아이콘 (스크랩) - top 73px에 absolute 배치 */}

        <div className="absolute top-[12px] right-4">
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
      <div className="flex-1 touch-auto overflow-y-auto px-[14px] pt-[56px] pb-24">
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
              {sortedActiveRooms.map((room) => (
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
                  onClick={() => {
                    // 채팅방 입장 시 읽음 처리 API 호출 후 이동
                    markAsRead(Number(room.id), {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["activeTribeList"] });
                        navigate(`/tribe-chat/${room.id}`, {
                          state: { imageTag: room.tags?.[0] || "Tribe" },
                        });
                      },
                    });
                  }}
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