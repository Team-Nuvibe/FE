import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/hooks/useUserStore";
import FolderIcon from "@/assets/icons/icon_folder_vibetone2.svg?react";
import type { MostUsedBoardResponse } from "@/types/archive";
import { useNavigate } from "react-router";
import BackLight from "@/assets/images/img_backlight.svg?react";

const RecapSecondSlide = ({
  isActive,
  activeTab,
  data,
}: {
  isActive: boolean;
  activeTab: "weekly" | "all";
  data: MostUsedBoardResponse | undefined;
}) => {
  const { nickname } = useUserStore();
  const navigate = useNavigate();

  // 초기 상태는 false (닫힘)
  const [isOpen, setIsOpen] = useState(false);

  // API 데이터로부터 이미지 배열 생성 (최대 3개)
  const images = data?.boardImages.slice(0, 3) || [];

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

  const dropCount = data?.totalDropsCount || 0;
  const boardName = data?.boardName || "";

  // 슬라이드가 활성화되거나 activeTab이 변경될 때 애니메이션 시작
  useEffect(() => {
    if (isActive) {
      // 슬라이드가 활성화되면 애니메이션 리셋 후 시작
      setIsOpen(false);
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300); // 0.3초 후 애니메이션 시작

      return () => clearTimeout(timer);
    } else {
      // 슬라이드가 비활성화되면 닫힌 상태로 리셋
      setIsOpen(false);
    }
  }, [isActive, activeTab]);

  // ===== 이미지 위치 조정 영역 =====
  const CENTER_IMAGE_Y = -25; // 가운데 이미지 위치 (위로 올릴수록 음수 증가)
  const SIDE_IMAGE_Y = -40; // 양옆 이미지 위치 (위로 올릴수록 음수 증가)
  // =========================================================

  // 이미지 애니메이션 변수
  const imageVariants = {
    closed: {
      x: 0,
      y: 100,
      scale: 0.8,
      opacity: 0,
      rotate: 0,
    },
    open: ({ index }: { index: number }) => {
      let x = 0;
      let rotate = 0;

      if (index === 0) {
        x = 0;
        rotate = 0;
      } else if (index === 1) {
        x = -50;
        rotate = -15;
      } else {
        x = 50;
        rotate = 15;
      }

      return {
        x,
        y: index === 0 ? CENTER_IMAGE_Y : SIDE_IMAGE_Y,
        scale: 1,
        opacity: 1,
        rotate,
        transition: {
          type: "spring" as const,
          stiffness: 200,
          damping: 18,
          delay: index * 0.1,
        },
      };
    },
  };

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
                    이번주 아카이브
                  </>
                ) : (
                  `${nickname}의 이번주 아카이브`
                )
              ) : nickname.length > 5 ? (
                <>
                  {nickname}의
                  <br />
                  아카이브
                </>
              ) : (
                `${nickname}의 아카이브`
              )}
            </h1>
            <p className="B2 leading-[150%] tracking-[-0.35px] text-[#B9BDC2]">
              {activeTab === "weekly"
                ? "이번 주 가장 많이 쌓인 보드"
                : "가장 많이 쌓인 보드"}
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

      {/* --- [폴더 애니메이션 본체] --- */}
      <div className="relative mx-auto mt-22 mb-4 h-[220px] w-[280px]">
        {/* 배경 광원 효과 */}
        <BackLight className="absolute bottom-0 left-1/2 -translate-x-1/2" />
        {/* 1. Folder Back (뒷면) */}
        <div className="absolute bottom-5 left-1/2 h-[195px] w-[215px] -translate-x-1/2 rounded-[10px] border-[0.5px] border-solid border-[#36383E] bg-gray-800 opacity-50" />

        {/* 2. Images (중간 레이어 - 팝업 애니메이션) */}
        <div className="pointer-events-none absolute bottom-4 left-0 z-10 flex h-full w-full items-end justify-center">
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={index}
                custom={{ index, count: images.length }}
                variants={imageVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className={`shadow-3xl absolute origin-bottom overflow-hidden rounded-[5px] ${
                  index === 0 ? "h-[198px] w-[149px]" : "h-[146px] w-[110px]"
                }`}
                style={{
                  zIndex: index === 0 ? 20 : 10,
                }}
              >
                <img
                  src={src}
                  alt="archive"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 3. Folder Front  */}
        <div className="absolute bottom-0 left-1/2 z-30 h-[140px] w-[227px] -translate-x-1/2">
          <div className="absolute inset-[-19.92%_-4.39%_0_-4.39%]">
            <FolderIcon />
          </div>
        </div>
      </div>

      {/* 하단 정보 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isOpen ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-0 w-full px-[27.5px] pb-[24.87px]"
      >
        <div className="flex w-full items-end justify-between gap-9">
          <div className="flex h-[60px] w-[138px] flex-col">
            <p className="B2 leading-[150%] tracking-[-0.35px] text-gray-600">
              {dropCount}회 드랍
            </p>
            <h1 className="H2 leading-[150%] tracking-[-0.5px] text-white">
              {boardName}
            </h1>
          </div>
          <button
            onClick={() => navigate(`/archive-board/${data?.boardId}`)}
            className="mx-auto h-[36px] w-[132px] rounded-[5px] bg-gray-300 text-[14px] leading-[150%] font-medium tracking-[-0.35px] text-gray-800 transition-colors hover:bg-white"
          >
            보드 방문하기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecapSecondSlide;
