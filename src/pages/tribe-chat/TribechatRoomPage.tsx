import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/key";
import { type ApiResponse } from "@/types/common";
import { type ChatTimelineResponse } from "@/types/tribeChat";
import PicturesIcon from "@/assets/icons/icon_pictures.svg?react";
import BackButton from "@/assets/icons/icon_chevron_left.svg?react";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import ChatMessageItem, {
  type ChatMessage,
} from "@/components/tribe-chat/ChatMessageItem";
import DateDivider from "@/components/tribe-chat/DateDivider";
// React Query Hooks
import useGetChatTimeline from "@/hooks/queries/tribe-chat/useGetChatTimeline";
import useReactToChatEmoji from "@/hooks/mutation/tribe-chat/useReactToChatEmoji";
import useToggleImageScrap from "@/hooks/mutation/tribe-chat/useToggleImageScrap";
import DropIcon from "@/assets/logos/Subtract.svg?react";
import useGetActiveTribeList from "@/hooks/queries/tribe-chat/useGetActiveTribeList";
import { useUserStore } from "@/hooks/useUserStore";

const TribechatRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tribeId } = useParams<{ tribeId: string }>();
  const queryClient = useQueryClient();
  const { setNavbarVisible } = useNavbarActions();
  const { nickname } = useUserStore();

  // Active Tribe List for fallback tag
  const { data: activeTribeList } = useGetActiveTribeList();

  // Get imageTag from location state passed during navigation
  // If not in state, look it up in the active tribe list
  const stateImageTag = (location.state as { imageTag?: string })?.imageTag;
  const foundTribe = activeTribeList?.data?.items.find(
    (t) => t.tribeId === Number(tribeId),
  );
  const imageTag = stateImageTag || foundTribe?.imageTag || "Tribe";

  // React Query - Timeline Data
  const {
    data: timelineData,
    isLoading,
    isError,
    error,
  } = useGetChatTimeline({
    tribeId: Number(tribeId),
    size: 20,
  });

  // React Query - Mutations
  const { mutate: toggleScrapMutation } = useToggleImageScrap();
  const { mutate: reactToEmoji } = useReactToChatEmoji();

  // API 응답 로그 (디버깅용)
  useEffect(() => {
    console.log("🔍 TribeId from URL:", tribeId);
    console.log("🔍 Timeline Loading:", isLoading);
    console.log("🔍 Timeline Error:", isError, error);

    if (timelineData) {
      console.log("📨 Chat Timeline Data:", timelineData);
      console.log("📨 Timeline Items:", timelineData.data?.items);
    } else if (!isLoading) {
      console.warn("⚠️ No timeline data received");
    }
  }, [timelineData, isLoading, isError, error, tribeId]);

  // Transform API response to ChatMessage format
  const messages: ChatMessage[] = useMemo(() => {
    return (
      timelineData?.data.items.map((item) => {
        // reactionSummary를 reactions 객체로 변환
        const reactions = {
          amazing: 0,
          like: 0,
          nice: 0,
        };
        item.reactionsSummary?.forEach((reaction) => {
          if (reaction.type === "WOW") reactions.amazing += reaction.count;
          if (reaction.type === "LIKE") reactions.like += reaction.count;
          if (reaction.type === "COOL") reactions.nice += reaction.count;
        });

        return {
          id: item.chatId.toString(),
          imageUrl: item.imageUrl,
          timestamp: new Date(item.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          date: new Date(item.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          isMine: item.sender ? item.sender.nickname === nickname : true, // sender가 없으면 내가 보낸 메시지
          userProfile: item.sender
            ? {
              name: item.sender.nickname || "Unknown",
              avatar: item.sender.profileImage || "#E2E2E2",
            }
            : undefined,
          reactions,
          myReactions: {
            amazing: item.myReactionType === "WOW",
            like: item.myReactionType === "LIKE",
            nice: item.myReactionType === "COOL",
          },
          isScrapped: item.isScrapped ?? false, // API 값을 사용하거나 기본값 false
        };
      }) ?? []
    );
  }, [timelineData, nickname]);

  // 역방향 무한 스크롤: 상단 감지를 위한 useInView 훅
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // TODO: 나중에 useInfiniteQuery로 교체
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMessages(...);
  const hasNextPage = false; // 임시
  const isFetchingNextPage = false; // 임시

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const targetMessageId = queryParams.get("target");

  // 페이지 진입 시 navbar 숨기기, 언마운트 시 다시 표시
  useEffect(() => {
    setNavbarVisible(false);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  // 특정 메시지(이미지)로 스크롤 이동 로직
  useEffect(() => {
    if (targetMessageId) {
      // 렌더링 후 스크롤을 위해 약간의 지연시간 부여
      const timer = setTimeout(() => {
        const element = document.getElementById(`msg-${targetMessageId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [targetMessageId, messages]);

  // 역방향 무한 스크롤: 상단 도달 시 과거 메시지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      // TODO: 나중에 fetchNextPage() 호출
      console.log("Load more messages...");
      // fetchNextPage();
    }
  }, [inView, hasNextPage]);

  // 스크랩 토글
  const toggleScrap = (messageId: string) => {
    toggleScrapMutation(Number(messageId), {
      onSuccess: () => {
        console.log("✅ Scrap toggled successfully");
        // 현재 페이지의 타임라인 캐시 업데이트 (optimistic UI update effect)
        queryClient.setQueryData<ApiResponse<ChatTimelineResponse>>(
          [QUERY_KEY.chatTimeline, Number(tribeId), undefined, 20],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: oldData.data.items.map((item) =>
                  item.chatId === Number(messageId)
                    ? { ...item, isScrapped: !item.isScrapped }
                    : item,
                ),
              },
            };
          },
        );
        // 다른 관련 쿼리 무효화 (detail, grid 등)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.scrapedImages],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.tribeScrapedImages],
        });
      },
      onError: () => {
        console.error("❌ Failed to toggle scrap");
      },
    });
  };

  // 이모지 반응 추가/제거 (한 채팅당 1개만 가능)
  const toggleReaction = (
    messageId: string,
    reactionType: keyof ChatMessage["reactions"],
  ) => {
    const emojiMap = {
      amazing: "WOW" as const,
      like: "LIKE" as const,
      nice: "COOL" as const,
    };

    reactToEmoji(
      {
        chatId: Number(messageId),
        type: emojiMap[reactionType],
      },
      {
        onSuccess: () => {
          console.log(`✅ Emoji ${reactionType} added`);
        },
        onError: () => {
          console.error(`❌ Failed to add emoji ${reactionType}`);
        },
      },
    );
  };

  // Drop Vibe 버튼 클릭
  const handleDropVibe = () => {
    // 파일 선택 다이얼로그 열기
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && tribeId) {
        navigate("/quickdrop", {
          state: {
            file,
            tag: imageTag, // TribeChat의 현재 태그 전달
            fromTribe: true,
            tribeId: Number(tribeId),
          },
        });
      }
    };

    fileInput.click();
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#121212]">
      {/* 헤더 */}
      <header className="sticky top-0 left-0 z-20 flex w-full items-center justify-between border-b border-gray-900 bg-[#121212]/90 px-4 py-5 backdrop-blur-sm">
        {/* 뒤로가기 버튼 */}
        <button
          className="flex h-10 w-10 items-center justify-center"
          aria-label="뒤로가기"
          onClick={() => navigate("/tribe-chat")}
        >
          <BackButton className="h-6 w-6" />
        </button>

        {/* 태그 이름 */}
        <h1 className="H2 absolute left-1/2 -translate-x-1/2 text-white">
          #{imageTag}
        </h1>

        {/* 사진 아이콘 */}
        <button
          className="flex h-10 w-10 items-center justify-center p-0"
          aria-label="사진 보기"
          onClick={() =>
            navigate("/tribe-chat/scrap", {
              state: { tribeId: Number(tribeId) },
            })
          }
        >
          <PicturesIcon className="h-6 w-6 text-white" />
        </button>
      </header>

      {/* 배경 그라데이션 */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[187px] w-full">
        <div className="absolute bottom-0 h-[187px] w-full bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      {/* 메시지 리스트 - 역방향 스크롤 */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto px-4 pt-[115px] pb-[100px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="ST2 text-gray-500">로딩 중...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="ST2 text-gray-500">아직 채팅이 없어요</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // 다음 메시지 (역방향이므로 index + 1이 실제로는 이전 메시지)
              const nextMessage = messages[index + 1];

              // 간격: 항상 24px
              const marginBottom = "mb-6";

              // 날짜가 바뀌었는지 확인 (역방향이므로 nextMessage가 이전 메시지)
              const isDateChanged =
                !nextMessage || nextMessage.date !== message.date;

              return (
                <div key={message.id} id={`msg-${message.id}`}>
                  {/* 날짜 구분선: 다음 메시지와 날짜가 다를 때 표시 */}
                  {isDateChanged && (
                    <div className="my-7">
                      {" "}
                      {/* 총 28px: 위아래 패딩 4px (py-1) + 채팅과의 간격 24px */}
                      <DateDivider date={message.date} />
                    </div>
                  )}

                  {/* 채팅 메시지 */}
                  <div className={marginBottom}>
                    <ChatMessageItem
                      message={message}
                      onScrap={toggleScrap}
                      onReaction={toggleReaction}
                    />
                  </div>
                </div>
              );
            })}

            {/* 상단 감지 영역 - 과거 메시지 로딩 트리거 */}
            <div
              ref={loadMoreRef}
              className="flex h-4 w-full shrink-0 items-center justify-center"
            >
              {isFetchingNextPage && (
                <span className="text-xs text-gray-500">
                  과거 대화 불러오는 중...
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* 하단 Drop Vibe 버튼 */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <button
          onClick={handleDropVibe}
          className="mx-auto flex h-12 w-[171px] items-center justify-center gap-2 rounded-[84px] border border-gray-600 bg-black/90 px-4.5 py-3 shadow-[0_0_8px_rgba(255,255,255,0.1)] backdrop-blur-[5px] transition-all hover:border-gray-500 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
        >
          <DropIcon className="h-5.25 w-5.25" />
          <span
            className="H4 bg-linear-to-r from-[#f7f7f7] from-[35.588%] to-[rgba(247,247,247,0.5)] to-100% bg-clip-text leading-[150%] tracking-[-0.4px] whitespace-nowrap"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            Drop Your Vibe
          </span>
        </button>
      </div>
    </div>
  );
};

export default TribechatRoomPage;
