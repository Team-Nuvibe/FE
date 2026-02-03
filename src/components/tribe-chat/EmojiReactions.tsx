import AmazingEmoji from "@/assets/icons/icon_emo_amazing.svg?react";
import LikeEmoji from "@/assets/icons/icon_emo_like.svg?react";
import NiceEmoji from "@/assets/icons/icon_emo_nice.svg?react";

interface EmojiReactionsProps {
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
  onReactionClick: (reactionType: "amazing" | "like" | "nice") => void;
}

const EmojiReactions = ({
  reactions,
  myReactions,
  onReactionClick,
}: EmojiReactionsProps) => {
  return (
    <div className="flex items-center gap-1 rounded-[84px] bg-[#64676D]/80 px-3 py-2 backdrop-blur-[5px]">
      <button
        onClick={() => onReactionClick("like")}
        className="relative flex items-center gap-1"
      >
        <LikeEmoji className="h-6 w-6" />
        {reactions.like > 0 && (
          <span className="Label text-white">{reactions.like}</span>
        )}
        {/* 내가 반응한 경우 밑줄 표시 */}
        {myReactions.like && (
          <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
        )}
      </button>
      <button
        onClick={() => onReactionClick("nice")}
        className="relative flex items-center gap-1"
      >
        <NiceEmoji className="h-6 w-6" />
        {reactions.nice > 0 && (
          <span className="Label text-white">{reactions.nice}</span>
        )}
        {/* 내가 반응한 경우 밑줄 표시 */}
        {myReactions.nice && (
          <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
        )}
      </button>
      <button
        onClick={() => onReactionClick("amazing")}
        className="relative flex items-center gap-1"
      >
        <AmazingEmoji className="h-6 w-6" />
        {reactions.amazing > 0 && (
          <span className="Label text-white">{reactions.amazing}</span>
        )}
        {/* 내가 반응한 경우 밑줄 표시 */}
        {myReactions.amazing && (
          <div className="absolute right-0 -bottom-0.5 left-0 h-[2px] rounded-full bg-white" />
        )}
      </button>
    </div>
  );
};

export default EmojiReactions;
