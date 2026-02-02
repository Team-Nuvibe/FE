import React, { useState } from "react";
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

// 애니메이션 입자(Particle) 타입 정의
interface ReactionParticle {
  id: number;
  type: "amazing" | "like" | "nice";
}

const EmojiReactions = ({
  reactions,
  myReactions,
  onReactionClick,
}: EmojiReactionsProps) => {
  // 떠오르는 아이콘들을 관리하는 상태
  const [particles, setParticles] = useState<ReactionParticle[]>([]);
  // 스포트라이트 효과를 위한 클릭된 버튼 추적
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // 클릭 시 파티클 추가 및 핸들러 실행
  const handleReaction = (type: "amazing" | "like" | "nice") => {
    onReactionClick(type);

    // 스포트라이트 효과 트리거 (100ms delay + 300ms transition = 400ms)
    setClickedButton(type);
    setTimeout(() => {
      setClickedButton(null);
    }, 400); // 스포트라이트 100ms + 최종 상태 전환 300ms

    // 현재 시간 기반의 고유 ID로 파티클 생성
    const newParticle = { id: Date.now(), type };
    setParticles((prev) => [...prev, newParticle]);

    // 1초 뒤에 해당 파티클 제거 (메모리 누수 방지)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  // 버튼 설정 데이터 (중복 코드 제거용)
  const buttonConfigs = [
    { type: "like" as const, Icon: LikeEmoji },
    { type: "nice" as const, Icon: NiceEmoji },
    { type: "amazing" as const, Icon: AmazingEmoji },
  ];

  return (
    <>
      {/* Tailwind 설정 없이 바로 동작하도록 인라인 스타일로 키프레임 정의 */}
      <style>
        {`
          @keyframes float-up {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
          }
          .animate-float-up {
            animation: float-up 0.8s ease-out forwards;
          }
        `}
      </style>

      <div className="flex items-center gap-2">
        {buttonConfigs.map(({ type, Icon }) => {
          // 내가 반응했는지 확인
          const isMyReaction = myReactions[type];

          // 스포트라이트 효과: 클릭 시 밝은 색, 이후 어두운 색으로 변화
          const isClicked = clickedButton === type;

          // 배경 스타일 결정 (클릭 여부와 상관없이 myReaction만 확인)
          let backgroundStyle = {};
          let bgColorClass = "";

          if (isMyReaction) {
            // 내가 반응한 버튼
            bgColorClass = "bg-gray-600";
          } else {
            // 선택하지 않은 버튼
            backgroundStyle = {
              background:
                "linear-gradient(0deg, rgba(33, 34, 36, 0.80) 0%, rgba(33, 34, 36, 0.80) 100%), rgba(100, 103, 109, 0.80)",
            };
          }

          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`relative flex items-center justify-center gap-1 rounded-[30px] ${bgColorClass} px-3 py-1 shadow-[0px_4px_4px_0px_rgba(18,18,18,0.15)] backdrop-blur-[10px] hover:scale-105 active:scale-95`}
              style={{
                ...backgroundStyle,
                transition: "all 300ms ease-out",
              }}
            >
              {/* 기본 아이콘 with 밑줄 */}
              <div className="relative flex items-center justify-center">
                <Icon className="h-5 w-5" />

                {/* 클릭 시에만 0.5초 동안 빛나는 밑줄 표시 - 아이콘 아래 */}
                {isClicked && (
                  <div
                    className="absolute h-[2px] rounded-full bg-white"
                    style={{
                      width: "17px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      bottom: "-3px",
                      boxShadow:
                        "0 -8px 30px rgba(255, 255, 255, 0.9), 0 -4px 20px rgba(255, 255, 255, 1), 0 -2px 12px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 1)",
                    }}
                  />
                )}
              </div>

              {/* 숫자 표시 */}
              {reactions[type] > 0 && (
                <span className="Label text-white">{reactions[type]}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default EmojiReactions;
