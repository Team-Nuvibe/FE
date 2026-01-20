import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PicturesIcon from "@/assets/icons/icon_pictures.svg?react";
import BackButton from "@/assets/icons/icon_chevron_left.svg?react";
// emoji
import AmazingEmoji from "@/assets/icons/icon_emo_amazing.svg?react";
import LikeEmoji from "@/assets/icons/icon_emo_like.svg?react";
import NiceEmoji from "@/assets/icons/icon_emo_nice.svg?react";
// 스크랩 버튼
import ActiveScrapButton from "@/assets/icons/icon_bookmarked_lg.svg?react";
import InActiveScrapButton from "@/assets/icons/icon_bookmark_lg.svg?react";
import DropVibeButton from "@/components/common/DropVibeButton";
import { useNavbarActions } from "@/hooks/useNavbarStore";
// 이미지
import imgTemp1 from "@/assets/images/img_temp1.png";
import imgTemp9 from "@/assets/images/img_temp9.png";

// 채팅 메시지 타입
interface ChatMessage {
  id: string;
  imageUrl: string;
  timestamp: string;
  isMine: boolean;
  userProfile?: {
    name: string;
    avatar: string;
  };
  reactions: {
    amazing: number;
    like: number;
    nice: number;
  };
  myReactions: {
    amazing: boolean;
    like: boolean;
    nice: boolean;
  };
  isScraped: boolean;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤을 하단으로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // 페이지 진입 시 navbar 숨기기, 언마운트 시 다시 표시
  useEffect(() => {
    setNavbarVisible(false);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  // 페이지 진입 시 스크롤을 하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, []);

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

      {/* 메시지 리스트 */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-[115px] pb-[100px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isMine ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {/* 왼쪽 메시지 (다른 유저) */}
            {!message.isMine && message.userProfile && (
              <div className="flex items-start gap-[11px]">
                {/* 프로필 이미지 */}
                <div
                  className="h-[42px] w-[42px] shrink-0 rounded-full"
                  style={{ backgroundColor: message.userProfile.avatar }}
                />

                {/* 메시지 영역 */}
                <div className="flex flex-col items-start gap-1">
                  {/* 사용자 이름 */}
                  <span className="Label text-[#8F9297]">
                    {message.userProfile.name}
                  </span>

                  {/* 이미지 */}
                  <div className="relative overflow-hidden rounded-[18px] bg-gray-800">
                    <img
                      src={message.imageUrl}
                      alt="채팅 이미지"
                      className="h-auto w-full max-w-[217px] object-cover"
                    />
                  </div>

                  {/* 이모지 반응 */}
                  <div className="flex items-center gap-1 rounded-[84px] bg-[#64676D]/80 px-3 py-2 backdrop-blur-[5px]">
                    <button
                      onClick={() => toggleReaction(message.id, "like")}
                      className="relative flex items-center gap-1"
                    >
                      <LikeEmoji className="h-6 w-6" />
                      {message.reactions.like > 0 && (
                        <span className="Label text-white">
                          {message.reactions.like}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.like && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleReaction(message.id, "nice")}
                      className="relative flex items-center gap-1"
                    >
                      <NiceEmoji className="h-6 w-6" />
                      {message.reactions.nice > 0 && (
                        <span className="Label text-white">
                          {message.reactions.nice}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.nice && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] w-6 rounded-full bg-white" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleReaction(message.id, "amazing")}
                      className="relative flex items-center gap-1"
                    >
                      <AmazingEmoji className="h-6 w-6" />
                      {message.reactions.amazing > 0 && (
                        <span className="Label text-white">
                          {message.reactions.amazing}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.amazing && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 타임스탬프 */}
                <span className="Label self-end pb-2 text-[#75787E]">
                  {message.timestamp}
                </span>

                {/* 스크랩 버튼 */}
                <button
                  onClick={() => toggleScrap(message.id)}
                  className="shrink-0 self-end pb-2"
                  aria-label="스크랩"
                >
                  {message.isScraped ? (
                    <ActiveScrapButton className="h-8 w-8" />
                  ) : (
                    <InActiveScrapButton className="h-8 w-8" />
                  )}
                </button>
              </div>
            )}

            {/* 오른쪽 메시지 (내 메시지) */}
            {message.isMine && (
              <>
                {/* 타임스탬프 */}
                <span className="Label mb-2 text-[#75787E]">
                  {message.timestamp}
                </span>

                {/* 메시지 컨테이너 */}
                <div className="flex max-w-[70%] flex-col items-end">
                  {/* 이미지 */}
                  <div className="relative overflow-hidden rounded-[18px] bg-gray-800">
                    <img
                      src={message.imageUrl}
                      alt="채팅 이미지"
                      className="h-auto w-full max-w-[250px] object-cover"
                    />
                  </div>

                  {/* 이모지 반응 */}
                  <div className="mt-2 flex items-center gap-1 rounded-[84px] bg-[#64676D]/80 px-3 py-2 backdrop-blur-[5px]">
                    <button
                      onClick={() => toggleReaction(message.id, "like")}
                      className="relative flex items-center gap-1"
                    >
                      <LikeEmoji className="h-6 w-6" />
                      {message.reactions.like > 0 && (
                        <span className="Label text-white">
                          {message.reactions.like}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.like && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleReaction(message.id, "nice")}
                      className="relative flex items-center gap-1"
                    >
                      <NiceEmoji className="h-6 w-6" />
                      {message.reactions.nice > 0 && (
                        <span className="Label text-white">
                          {message.reactions.nice}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.nice && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleReaction(message.id, "amazing")}
                      className="relative flex items-center gap-1"
                    >
                      <AmazingEmoji className="h-6 w-6" />
                      {message.reactions.amazing > 0 && (
                        <span className="Label text-white">
                          {message.reactions.amazing}
                        </span>
                      )}
                      {/* 내가 반응한 경우 밑줄 표시 */}
                      {message.myReactions.amazing && (
                        <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 스크랩 버튼 */}
                <button
                  onClick={() => toggleScrap(message.id)}
                  className="mb-2 flex-shrink-0"
                  aria-label="스크랩"
                >
                  {message.isScraped ? (
                    <ActiveScrapButton className="h-6 w-6" />
                  ) : (
                    <InActiveScrapButton className="h-6 w-6" />
                  )}
                </button>
              </>
            )}
          </div>
        ))}
        {/* 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 하단 Drop Vibe 버튼 */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <DropVibeButton label="Drop Your Vibe" onClick={handleDropVibe} />
      </div>
    </div>
  );
};

export default TribechatRoomPage;
