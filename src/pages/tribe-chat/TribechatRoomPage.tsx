import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import PicturesIcon from "@/assets/icons/icon_pictures.svg?react";
import BackButton from "@/assets/icons/icon_chevron_left.svg?react";
import DropVibeButton from "@/components/common/DropVibeButton";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import ChatMessageItem, {
  type ChatMessage,
} from "@/components/tribe-chat/ChatMessageItem";
// 이미지
import imgTemp1 from "@/assets/images/img_temp1.png";
import imgTemp9 from "@/assets/images/img_temp9.png";

// 더미 데이터
const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    imageUrl: imgTemp1,
    timestamp: "17:03",
    isMine: false,
    userProfile: {
      name: "제이미",
      avatar: "#E2E2E2",
    },
    reactions: {
      amazing: 1,
      like: 1,
      nice: 1,
    },
    myReactions: {
      amazing: false,
      like: true,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "2",
    imageUrl: imgTemp9,
    timestamp: "17:05",
    isMine: true,
    reactions: {
      amazing: 0,
      like: 0,
      nice: 0,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "3",
    imageUrl: imgTemp1,
    timestamp: "17:12",
    isMine: false,
    userProfile: {
      name: "제이미",
      avatar: "#E2E2E2",
    },
    reactions: {
      amazing: 2,
      like: 0,
      nice: 3,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "4",
    imageUrl: imgTemp9,
    timestamp: "17:20",
    isMine: false,
    userProfile: {
      name: "선우",
      avatar: "#B9BDC2",
    },
    reactions: {
      amazing: 0,
      like: 1,
      nice: 0,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "5",
    imageUrl: imgTemp1,
    timestamp: "17:25",
    isMine: true,
    reactions: {
      amazing: 1,
      like: 2,
      nice: 0,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "6",
    imageUrl: imgTemp9,
    timestamp: "17:30",
    isMine: false,
    userProfile: {
      name: "제이미",
      avatar: "#E2E2E2",
    },
    reactions: {
      amazing: 0,
      like: 0,
      nice: 1,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: true,
    },
    isScraped: false,
  },
  {
    id: "7",
    imageUrl: imgTemp1,
    timestamp: "17:35",
    isMine: true,
    reactions: {
      amazing: 0,
      like: 0,
      nice: 0,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
  {
    id: "8",
    imageUrl: imgTemp9,
    timestamp: "17:40",
    isMine: false,
    userProfile: {
      name: "선우",
      avatar: "#B9BDC2",
    },
    reactions: {
      amazing: 1,
      like: 1,
      nice: 1,
    },
    myReactions: {
      amazing: false,
      like: false,
      nice: false,
    },
    isScraped: false,
  },
];

const TribechatRoomPage = () => {
  const navigate = useNavigate();
  const { tagId } = useParams<{ tagId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>(DUMMY_MESSAGES);
  const { setNavbarVisible } = useNavbarActions();

  // 역방향 무한 스크롤: 상단 감지를 위한 useInView 훅
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // TODO: 나중에 useInfiniteQuery로 교체
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMessages(...);
  const hasNextPage = false; // 임시
  const isFetchingNextPage = false; // 임시

  // 페이지 진입 시 navbar 숨기기, 언마운트 시 다시 표시
  useEffect(() => {
    setNavbarVisible(false);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

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
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isScraped: !msg.isScraped } : msg,
      ),
    );
  };

  // 이모지 반응 추가/제거 (한 채팅당 1개만 가능)
  const toggleReaction = (
    messageId: string,
    reactionType: keyof ChatMessage["reactions"],
  ) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const isMyReaction = msg.myReactions[reactionType];

          // 현재 내가 반응한 이모지 찾기
          const currentReaction = (
            Object.keys(msg.myReactions) as Array<keyof typeof msg.myReactions>
          ).find((key) => msg.myReactions[key]);

          // 새로운 reactions 객체
          const newReactions = { ...msg.reactions };
          const newMyReactions = { amazing: false, like: false, nice: false };

          if (isMyReaction) {
            // 같은 이모지를 다시 클릭 -> 반응 취소
            newReactions[reactionType] = msg.reactions[reactionType] - 1;
          } else {
            // 다른 이모지 클릭
            if (currentReaction) {
              // 기존 반응 제거
              newReactions[currentReaction] =
                msg.reactions[currentReaction] - 1;
            }
            // 새로운 반응 추가
            newReactions[reactionType] = msg.reactions[reactionType] + 1;
            newMyReactions[reactionType] = true;
          }

          return {
            ...msg,
            reactions: newReactions,
            myReactions: newMyReactions,
          };
        }
        return msg;
      }),
    );
  };

  // Drop Vibe 버튼 클릭
  const handleDropVibe = () => {
    console.log("Drop Vibe button");
    // TODO: 이미지 업로드 로직 구현
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#121212]">
      {/* 헤더 */}
      <header className="sticky top-0 left-0 z-20 flex w-full items-center justify-between border-b border-gray-900 bg-[#121212]/90 px-4 py-5 backdrop-blur-sm">
        {/* 뒤로가기 버튼 */}
        <button
          className="flex h-10 w-10 items-center justify-center"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >
          <BackButton className="h-6 w-6" />
        </button>

        {/* 태그 이름 */}
        <h1 className="H2 absolute left-1/2 -translate-x-1/2 text-white">
          #{tagId || "Raw"}
        </h1>

        {/* 사진 아이콘 */}
        <button
          className="flex h-10 w-10 items-center justify-center"
          aria-label="사진 보기"
        >
          <PicturesIcon className="h-6 w-6" />
        </button>
      </header>

      {/* 배경 그라데이션 */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[187px] w-full">
        <div className="absolute bottom-0 h-[187px] w-full bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      {/* 메시지 리스트 - 역방향 스크롤 */}
      <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto px-4 pt-[115px] pb-[100px]">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            onScrap={toggleScrap}
            onReaction={toggleReaction}
          />
        ))}

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
      </div>

      {/* 하단 Drop Vibe 버튼 */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <DropVibeButton label="Drop Your Vibe" onClick={handleDropVibe} />
      </div>
    </div>
  );
};

export default TribechatRoomPage;
