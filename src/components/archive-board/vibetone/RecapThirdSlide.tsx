import { motion } from "framer-motion";
import Profile from "@/assets/icons/icon_subtract_vibetone.svg?react";
import { useUserStore } from "@/hooks/useUserStore";
import type { UserUsagePatternResponse } from "@/types/archive";

// ----------------------------------------------------------------------
// [1] 애니메이션 설정 (Variants)
// ----------------------------------------------------------------------

// 컨테이너: 자식 요소들을 순차적으로 실행
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // 0.3초 간격으로 자식 애니메이션 실행
      delayChildren: 0.2,
    },
  },
};

// 중앙 이미지: 서서히 커지면서 등장
const centerImageVariants = {
  hidden: { scale: 0.5, opacity: 0, filter: "blur(10px)" },
  visible: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

// 텍스트 버블: 팝업 + 둥둥 떠다니기 (Floating)
const bubbleVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

// 둥둥 떠다니는 모션 (Infinite Loop)
const floatingAnimation = {
  y: [0, -8, 0], // 위로 8px 올라갔다 내려옴
  transition: {
    duration: 3, // 3초 동안
    repeat: Infinity, // 무한 반복
    ease: "easeInOut" as const,
    repeatType: "reverse" as const, // 왕복
  },
};

const RecapThirdSlide = ({
  isActive,
  activeTab,
  data,
}: {
  isActive: boolean;
  activeTab: "weekly" | "all";
  data: UserUsagePatternResponse | undefined;
}) => {
  const { nickname, profileImage } = useUserStore();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const weekDate = data
    ? {
        start: formatDate(data.startDate),
        end: `~${formatDate(data.endDate).slice(5)}`, // YYYY 제거하고 MM.DD만
      }
    : { start: "", end: "" };

  // API 데이터로부터 패턴 정보 - 직접 메시지 사용
  const dayMessage = data?.dayMessage || "";
  const preferenceMessage = data?.preferenceMessage || "";
  const timeMessage = data?.timeMessage || "";
  const maxDailyDropCount = data?.maxDailyDropCount || 0;

  return (
    <div className="relative flex h-full w-full flex-col rounded-[15px] bg-[radial-gradient(ellipse_at_center,#191A1B_0%,#252729_40%,#353739_70%,#454749_100%)] shadow-[inset_0_0_40px_0_rgba(255,255,255,0.25)] backdrop-blur-[25px]">
      {/* 헤더 영역 */}
      <div className="z-10 shrink-0 pt-[22px] pr-[29px] pb-4 pl-[25px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="H2 leading-[150%] tracking-[-0.5px] text-gray-100">
              {activeTab === "weekly" ? (
                nickname.length > 5 ? (
                  <>
                    {nickname}의
                    <br />
                    이번주 패턴
                  </>
                ) : (
                  `${nickname}의 이번주 패턴`
                )
              ) : nickname.length > 5 ? (
                <>
                  {nickname}의
                  <br />
                  패턴
                </>
              ) : (
                `${nickname}의 패턴`
              )}
            </h1>
            <p className="B2 leading-[150%] tracking-[-0.35px] text-[#B9BDC2]">
              {activeTab === "weekly" ? "이번 주 기록 흐름" : "기록 흐름"}
            </p>
          </div>
          <span className="text-right text-[10px] leading-[150%] font-light text-gray-100">
            <>
              {weekDate.start}
              <br />
              {weekDate.end}
            </>
          </span>
        </div>
      </div>

      {/* --- [메인 애니메이션 영역] --- */}
      <motion.div
        key={activeTab} // activeTab이 변경되면 컴포넌트 리마운트하여 애니메이션 재실행
        className="relative flex w-full flex-1 items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        {/* 1. 중앙 이미지 (Profile SVG + 내부 이미지) */}
        <motion.div
          className="relative z-10 flex h-[160px] w-[160px] items-center justify-center"
          variants={centerImageVariants}
        >
          {/* Profile SVG (외곽 프레임) */}
          <Profile className="absolute inset-0 h-full w-full" />

          {/* 중앙 이미지 */}
          <div className="relative z-10 h-[110px] w-[110px] overflow-hidden rounded-[40px]">
            <img
              src={profileImage}
              alt="pattern center"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* 2. 텍스트 버블들 (절대 위치로 배치) */}

        {/* 버블 1 */}
        <motion.div
          className="absolute bottom-[25%] left-4 z-20"
          variants={bubbleVariants}
          // 등장 후 둥둥 떠다니기 추가
          animate={isActive ? floatingAnimation : {}}
        >
          <div className="rounded-[5px] border-[0.5px] border-[rgba(228,228,228,0.3)] bg-[rgba(54,56,62,0.8)] p-[8px] backdrop-blur-[7.5px]">
            <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.3px] whitespace-nowrap text-[#E2E2E2]">
              {timeMessage}
            </p>
          </div>
        </motion.div>

        {/* 버블 2 */}
        <motion.div
          className="absolute top-[17%] right-6 z-20"
          variants={bubbleVariants}
          animate={
            isActive
              ? {
                  ...floatingAnimation,
                  transition: { ...floatingAnimation.transition, delay: 0.5 }, // 엇박자로 움직이게 딜레이
                }
              : {}
          }
        >
          <div className="rounded-[5px] border-[0.5px] border-[rgba(228,228,228,0.3)] bg-[rgba(54,56,62,0.8)] p-[8px] backdrop-blur-[7.5px]">
            <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.3px] whitespace-nowrap text-[#E2E2E2]">
              {dayMessage}
            </p>
          </div>
        </motion.div>

        {/* 버블 3 */}
        <motion.div
          className="absolute right-5 bottom-[15%] z-20"
          variants={bubbleVariants}
          animate={
            isActive
              ? {
                  ...floatingAnimation,
                  transition: { ...floatingAnimation.transition, delay: 1.0 }, // 엇박자
                }
              : {}
          }
        >
          <div className="rounded-[5px] border-[0.5px] border-[rgba(228,228,228,0.3)] bg-[rgba(54,56,62,0.8)] p-[8px] backdrop-blur-[7.5px]">
            <p className="text-[12px] leading-[1.5] font-medium tracking-[-0.3px] whitespace-nowrap text-[#E2E2E2]">
              {preferenceMessage}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 하단 통계 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.5, type: "spring" }}
        className="w-full px-6 pb-12"
      >
        <div className="flex items-start justify-between pt-6">
          {/* 통계 1 */}
          <div className="flex gap-1.25">
            <div className="mt-1 h-4.25 w-1 bg-gray-200" /> {/* 흰색 바 */}
            <div className="flex flex-col leading-[150%]">
              <span className="ST2 tracking-[-0.4px] text-gray-200">
                아카이브 보드
              </span>
              <span className="B2 tracking-[-0.35px] text-gray-200">
                {data?.totalBoardCount || 0}개
              </span>
            </div>
          </div>

          {/* 통계 2 */}
          <div className="flex gap-1.25">
            <div className="mt-1 h-4.25 w-1 bg-gray-200" /> {/* 흰색 바 */}
            <div className="flex flex-col leading-[150%]">
              <span className="ST2 tracking-[-0.4px] text-gray-200">
                사용한 태그
              </span>
              <span className="B2 tracking-[-0.35px] text-gray-200">
                {data?.totalTagCount || 0}개
              </span>
            </div>
          </div>

          {/* 통계 3 */}
          <div className="flex gap-1.25">
            <div className="mt-1 h-4.25 w-1 bg-gray-200" /> {/* 흰색 바 */}
            <div className="flex flex-col leading-[150%]">
              <span className="ST2 tracking-[-0.4px] text-gray-200">
                하루 평균 기록
              </span>
              <span className="B2 tracking-[-0.35px] text-gray-200">
                1일 {maxDailyDropCount}회
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecapThirdSlide;
