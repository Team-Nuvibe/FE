import ActiveScrapButton from "@/assets/icons/icon_bookmarked_lg.svg?react";
import InActiveScrapButton from "@/assets/icons/icon_bookmark_lg.svg?react";
import EmojiReactions from "./EmojiReactions";

export interface ChatMessage {
  id: string;
  imageUrl: string;
  timestamp: string;
  date: string; // 날짜 구분선용 (예: "2026. 01. 02")
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

interface ChatMessageProps {
  message: ChatMessage;
  onScrap: (messageId: string) => void;
  onReaction: (
    messageId: string,
    reactionType: "amazing" | "like" | "nice",
  ) => void;
}

const ChatMessageItem = ({
  message,
  onScrap,
  onReaction,
}: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.isMine ? "justify-end" : "justify-start"} items-end gap-2`}
    >
      {/* 왼쪽 메시지 (다른 유저) */}
      {!message.isMine && message.userProfile && (
        <div className="flex items-start gap-[11px]">
          {/* 프로필 이미지 */}
          {message.userProfile.avatar.startsWith("#") ? (
            <div
              className="h-[42px] w-[42px] shrink-0 rounded-full"
              style={{ backgroundColor: message.userProfile.avatar }}
            />
          ) : (
            <img
              src={message.userProfile.avatar}
              alt={message.userProfile.name}
              className="h-[42px] w-[42px] shrink-0 rounded-full object-cover"
            />
          )}

          {/* 메시지 영역 */}
          <div className="flex flex-col items-start gap-1">
            {/* 사용자 이름 */}
            <span className="Label text-[#8F9297]">
              {message.userProfile.name}
            </span>

            {/* 이미지와 타임스탬프, 스크랩 버튼을 같은 줄에 배치 */}
            <div className="flex items-center gap-2">
              {/* 이미지 컨테이너 */}
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-end justify-end gap-1">
                  <div className="relative overflow-hidden rounded-[18px] bg-gray-800">
                    <img
                      src={message.imageUrl}
                      alt="채팅 이미지"
                      className="h-auto w-full max-w-[217px] object-cover"
                    />
                  </div>
                  {/* 타임스탬프 */}
                  <span className="h-[15px] w-[25px] self-end text-[10px] leading-[150%] font-normal tracking-[-0.25px] text-[#75787E]">
                    {message.timestamp}
                  </span>
                </div>
                {/* 이모지 반응 */}
                <EmojiReactions
                  reactions={message.reactions}
                  myReactions={message.myReactions}
                  onReactionClick={(type) => onReaction(message.id, type)}
                />
              </div>

              {/* 스크랩 버튼 */}
              <button
                onClick={() => onScrap(message.id)}
                className="shrink-0"
                aria-label="스크랩"
              >
                {message.isScraped ? (
                  <ActiveScrapButton className="h-8 w-8" />
                ) : (
                  <InActiveScrapButton className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 오른쪽 메시지 (내 메시지) */}
      {message.isMine && (
        <div className="flex items-center gap-2">
          {/* 스크랩 버튼 */}
          <button
            onClick={() => onScrap(message.id)}
            className="shrink-0"
            aria-label="스크랩"
          >
            {message.isScraped ? (
              <ActiveScrapButton className="h-8 w-8" />
            ) : (
              <InActiveScrapButton className="h-8 w-8" />
            )}
          </button>

          {/* 메시지 컨테이너 */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-end justify-end gap-1">
              {/* 타임스탬프 */}
              <span className="h-[15px] w-[25px] self-end text-[10px] leading-[150%] font-normal tracking-[-0.25px] text-[#75787E]">
                {message.timestamp}
              </span>
              {/* 이미지 */}
              <div className="relative overflow-hidden rounded-[18px] bg-gray-800">
                <img
                  src={message.imageUrl}
                  alt="채팅 이미지"
                  className="h-auto w-full max-w-[250px] object-cover"
                />
              </div>
            </div>

            {/* 이모지 반응 */}
            <EmojiReactions
              reactions={message.reactions}
              myReactions={message.myReactions}
              onReactionClick={(type) => onReaction(message.id, type)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageItem;
