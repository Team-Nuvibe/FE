import { useState, useMemo } from "react";
import { AxiosError } from "axios";
import BackButton from "@/assets/icons/icon_chevron_left.svg?react";
import RecapFirstSlide from "../../components/archive-board/vibetone/RecapFirstSlide";
import RecapSecondSlide from "../../components/archive-board/vibetone/RecapSecondSlide";
import RecapThirdSlide from "../../components/archive-board/vibetone/RecapThirdSlide";
import EmptyState from "../../components/archive-board/vibetone/EmptyState";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";
import ClockIcon from "@/assets/icons/icon_clock.svg?react";
import RefreshIcon from "@/assets/icons/icon_refreshbutton.svg?react";
import SaveIcon from "@/assets/icons/icon_imagesave.svg?react";
import DropIcon from "@/assets/logos/Subtract.svg?react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import {
  getTagUsageRanking,
  getMostUsedBoard,
  getUserUsagePattern,
} from "@/apis/archive-board/vibetone";

import { useSearchParams } from "react-router-dom";

const VibeTonePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "weekly" | "all") || "weekly";

  // 상태 관리: 탭, 활성 슬라이드 인덱스
  const [activeTab, setActiveTab] = useState<"weekly" | "all">(initialTab);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  // API period 파라미터 변환
  const period = activeTab === "weekly" ? "WEEK" : "TOTAL";

  // 3개의 슬라이드 데이터를 병렬로 fetch
  const {
    data: tagRankingData,
    isLoading: tagLoading,
    isError: tagError,
  } = useQuery({
    queryKey: ["tagRanking", period],
    queryFn: () => getTagUsageRanking(period),
    retry: (failureCount, error) => {
      if ((error as AxiosError).response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const {
    data: mostUsedBoardData,
    isLoading: boardLoading,
    isError: boardError,
  } = useQuery({
    queryKey: ["mostUsedBoard", period],
    queryFn: () => getMostUsedBoard(period),
    retry: (failureCount, error) => {
      if ((error as AxiosError).response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const {
    data: usagePatternData,
    isLoading: patternLoading,
    isError: patternError,
  } = useQuery({
    queryKey: ["usagePattern", period],
    queryFn: () => getUserUsagePattern(period),
    retry: (failureCount, error) => {
      if ((error as AxiosError).response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const handleDropVibe = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        alert("파일을 선택하지 않았습니다.");
        return;
      }
      navigate("/quickdrop", { state: { file } });
    };
    fileInput.click();
  };

  const handleSaveCard = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // 현재 활성화된 슬라이드 찾기 (swiper-slide-active 클래스 이용)
      const activeSlide = document.querySelector(
        ".swiper-slide.swiper-slide-active",
      ) as HTMLElement;

      if (!activeSlide) {
        alert("저장할 카드를 찾을 수 없습니다.");
        return;
      }

      // 이미지 데이터 URL로 변환 (toPng 사용)
      const dataUrl = await toPng(activeSlide, {
        cacheBust: true,
        backgroundColor: "#000000",
        pixelRatio: 2, // 고해상도
      });

      // Data URL을 Blob으로 변환
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // 파일명 생성
      const period = activeTab === "weekly" ? "Weekly" : "Total";
      const slideName = ["TagRanking", "MostUsedBoard", "UsagePattern"][
        activeSlideIndex
      ];
      const fileName = `VibeTone_${period}_${slideName}_${Date.now()}.png`;

      // 다운로드 또는 공유
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
          });
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Share failed:", error);
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to save card:", error);
      alert("카드 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 전체 로딩 상태
  const isLoading = tagLoading || boardLoading || patternLoading;

  // 빈 데이터 체크 (에러 또는 데이터 없음)
  const isEmpty = useMemo(() => {
    const hasTagData =
      !tagError &&
      tagRankingData?.data?.ranks &&
      tagRankingData.data.ranks.length > 0;
    const hasBoardData =
      !boardError &&
      mostUsedBoardData?.data?.boardImages &&
      mostUsedBoardData.data.boardImages.length > 0;
    const hasPatternData =
      !patternError &&
      usagePatternData?.data?.totalBoardCount &&
      usagePatternData.data.totalBoardCount > 0;

    return !hasTagData && !hasBoardData && !hasPatternData;
  }, [
    tagError,
    tagRankingData,
    boardError,
    mostUsedBoardData,
    patternError,
    usagePatternData,
  ]);

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-6 pb-4">
        <BackButton className="h-6 w-6" onClick={handleBack} />
        <h1 className="H2 text-gray-200">바이브 톤</h1>
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={() => navigate("/archive-board/vibecalendar")}
        >
          <ClockIcon />
        </button>
      </div>

      {/* Tab Navigation (필터 역할로 변경) */}
      <div className="flex h-[27px] shrink-0 items-end px-4">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`relative flex w-[52px] justify-center transition-all duration-200 ${
            activeTab === "weekly" ? "ST2 text-gray-200" : "ST2 text-gray-600"
          }`}
        >
          주간
          {/* 하단 인디케이터: 활성(흰색, 두께 2px) / 비활성(회색, 두께 0.5px) */}
          <div
            className={`absolute -bottom-1 left-1/2 w-[52px] -translate-x-1/2 ${
              activeTab === "weekly"
                ? "h-[2px] bg-gray-200"
                : "h-[0.5px] bg-gray-600"
            }`}
          />
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`relative flex w-[52px] justify-center transition-all duration-200 ${
            activeTab === "all" ? "ST2 text-gray-200" : "ST2 text-gray-600"
          }`}
        >
          전체
          <div
            className={`absolute -bottom-1 left-1/2 w-[52px] -translate-x-1/2 ${
              activeTab === "all"
                ? "h-[2px] bg-gray-200"
                : "h-[0.5px] bg-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1 flex-col pt-5">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="B1 text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <>
            {/* Check if there's no data to display */}
            {isEmpty ? (
              <div className="flex flex-1 items-center justify-center px-4">
                <EmptyState />
              </div>
            ) : (
              <Swiper
                modules={[Pagination]}
                onSlideChange={(swiper) =>
                  setActiveSlideIndex(swiper.activeIndex)
                }
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
          </>
        )}
      </div>
      {/* Pagination dots */}
      <div className="bottom-card-pagination flex justify-center gap-2 pt-3" />
      {/* Footer / Action Buttons */}
      <div className="mb-25 shrink-0 bg-black px-4 py-4">
        {isEmpty ? (
          /* Drop Your Vibe 버튼 */
          // TODO : onClick에 Dropvibe 연동
          <button
            className="mx-auto flex h-12 w-[171px] items-center justify-center gap-2 rounded-[84px] border border-gray-600 bg-black/90 px-4.5 py-3 shadow-[0_0_8px_rgba(255,255,255,0.1)] backdrop-blur-[5px] transition-all hover:border-gray-500 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
            onClick={handleDropVibe}
          >
            <DropIcon className="h-5.25 w-5.25" />
            <span
              className="H4 bg-linear-to-r from-[#f7f7f7] from-[35.588%] to-[rgba(247,247,247,0.5)] to-100% bg-clip-text leading-[150%] tracking-[-0.4px] whitespace-nowrap"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              Drop Your Vibe
            </span>
          </button>
        ) : (
          /* 재생성 & 카드 저장 버튼 */
          <div className="flex items-center gap-3">
            {/* Redo Button (왼쪽) */}
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-gray-800"
              aria-label="Redo"
            >
              <RefreshIcon />
            </button>

            {/* Save Card Button (오른쪽) */}
            <button
              className="mx-auto flex h-11 flex-1 items-center justify-center gap-4 rounded-[10px] border border-gray-800 transition-colors hover:bg-gray-900 disabled:opacity-50"
              onClick={handleSaveCard}
              disabled={isSaving}
            >
              <SaveIcon />
              <span className="ST2 tracking-[-0.4px] text-gray-200">
                {isSaving ? "저장 중..." : "이 카드 저장하기"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VibeTonePage;
