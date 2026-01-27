import { useState } from "react";
import { BackButton } from "../../components/onboarding/BackButton";
import RecapFirstSlide from "../../components/archive-board/vibetone/RecapFirstSlide";
import RecapSecondSlide from "../../components/archive-board/vibetone/RecapSecondSlide";
import RecapThirdSlide from "../../components/archive-board/vibetone/RecapThirdSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";
import ClockIcon from "@/assets/icons/icon_clock.svg?react";
import RefreshIcon from "@/assets/icons/icon_refreshbutton.svg?react";
import SaveIcon from "@/assets/icons/icon_imagesave.svg?react";
import { useQuery } from "@tanstack/react-query";
import {
  getTagUsageRanking,
  getMostUsedBoard,
  getUserUsagePattern,
} from "@/apis/archive-board/vibetone";

const VibeTonePage = () => {
  const navigate = useNavigate();

  // 상태 관리: 탭, 활성 슬라이드 인덱스
  const [activeTab, setActiveTab] = useState<"weekly" | "all">("weekly");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // API period 파라미터 변환
  const period = activeTab === "weekly" ? "WEEK" : "TOTAL";

  // 3개의 슬라이드 데이터를 병렬로 fetch
  const { data: tagRankingData, isLoading: tagLoading } = useQuery({
    queryKey: ["tagRanking", period],
    queryFn: () => getTagUsageRanking(period),
  });

  const { data: mostUsedBoardData, isLoading: boardLoading } = useQuery({
    queryKey: ["mostUsedBoard", period],
    queryFn: () => getMostUsedBoard(period),
  });

  const { data: usagePatternData, isLoading: patternLoading } = useQuery({
    queryKey: ["usagePattern", period],
    queryFn: () => getUserUsagePattern(period),
  });

  // 전체 로딩 상태
  const isLoading = tagLoading || boardLoading || patternLoading;

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-6 pb-4">
        <BackButton className="h-6 w-6" />
        <h1 className="H2 text-gray-200">바이브 톤</h1>
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={() => navigate("/archive-board/vibecalendar")}
        >
          <ClockIcon />
        </button>
      </div>

      {/* Tab Navigation (필터 역할로 변경) */}
      <div className="flex h-[27px] shrink-0 items-end gap-4 px-4">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`relative flex w-16 justify-center transition-all duration-200 ${
            activeTab === "weekly" ? "ST2 text-gray-200" : "B2 text-gray-600"
          }`}
        >
          주간
          {activeTab === "weekly" && (
            <div className="absolute -bottom-1 left-1/2 h-[2px] w-16 -translate-x-1/2 bg-gray-200" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`relative flex w-16 justify-center transition-all duration-200 ${
            activeTab === "all" ? "ST2 text-gray-200" : "B2 text-gray-600"
          }`}
        >
          전체
          {activeTab === "all" && (
            <div className="absolute -bottom-1 left-1/2 h-[2px] w-16 -translate-x-1/2 bg-gray-200" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1 flex-col pt-5">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="B1 text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <Swiper
            modules={[Pagination]}
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            pagination={{
              el: ".bottom-card-pagination",
              clickable: true,
              type: "bullets",
            }}
            className="w-full flex-1"
          >
            {/* Slide 1: 물리 엔진 기반 태그 애니메이션 (RecapFirstSlide) */}
            <SwiperSlide className="flex items-center justify-center overflow-y-auto px-4">
              <RecapFirstSlide
                isActive={activeSlideIndex === 0}
                activeTab={activeTab}
                data={tagRankingData?.data}
              />
            </SwiperSlide>

            {/* Slide 2: 폴더 팝업 애니메이션 (RecapSecondSlide) */}
            <SwiperSlide className="flex items-center justify-center overflow-y-auto px-4">
              <RecapSecondSlide
                isActive={activeSlideIndex === 1}
                activeTab={activeTab}
                data={mostUsedBoardData?.data}
              />
            </SwiperSlide>

            {/* Slide 3: 패턴 분석 (RecapThirdSlide) */}
            <SwiperSlide className="flex items-center justify-center overflow-y-auto px-4">
              <RecapThirdSlide
                isActive={activeSlideIndex === 2}
                activeTab={activeTab}
                data={usagePatternData?.data}
              />
            </SwiperSlide>
          </Swiper>
        )}
      </div>
      {/* Pagination dots */}
      <div className="bottom-card-pagination flex justify-center gap-2 pt-3" />
      {/* Footer / Action Buttons - Figma Design */}
      <div className="mb-25 shrink-0 bg-black px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Redo Button (왼쪽) */}
          <button
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-gray-800"
            aria-label="Redo"
          >
            <RefreshIcon />
          </button>

          {/* Save Card Button (오른쪽) */}
          <button className="mx-auto flex h-11 flex-1 items-center justify-center gap-4 rounded-[10px] border border-gray-800 transition-colors hover:bg-gray-900">
            <SaveIcon />
            <span className="ST2 tracking-[-0.4px] text-gray-200">
              이 카드 저장하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeTonePage;
