import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
} from "date-fns";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import "swiper/css";
import ChevronLeftIcon from "@/assets/icons/icon_chevron_left.svg?react";
import MovemonthIcon from "@/assets/icons/icon_backbutton.svg?react";

import { useNavbarActions } from "../../hooks/useNavbarStore";
import {
  getMonthlyUploadDates,
  getCalendarImages,
} from "@/apis/archive-board/vibetone";
import type { CalendarImageItemWithSource } from "@/types/archive";
import VibeCalendarBottomCard from "@/components/archive-board/vibecalendar/VibeCalendarBottomCard";

// 달력 그리드 컴포넌트 (최적화 적용)
interface CalendarGridProps {
  date: Date;
  activeDates: string[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CalendarGrid = React.memo(
  ({ date, activeDates, selectedDate, onSelectDate }: CalendarGridProps) => {
    const calendarDays = useMemo(() => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: startDate, end: endDate });
    }, [date]);

    const activeDatesSet = useMemo(() => {
      return new Set(activeDates);
    }, [activeDates]);

    const weeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthStart = useMemo(() => startOfMonth(date), [date]);
    const today = useMemo(() => new Date(), []);

    return (
      <div className="h-full px-[39px]">
        <div className="grid grid-cols-7 pb-[19.61px]">
          {weeks.map((day) => (
            <div
              key={day}
              className="text-center text-[12px] font-medium text-gray-100"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 pb-1">
          {calendarDays.map((dayItem) => {
            const isCurrentMonth = isSameMonth(dayItem, monthStart);
            const dateString = format(dayItem, "yyyy-MM-dd");

            const hasData = isCurrentMonth && activeDatesSet.has(dateString);
            const isSelected = selectedDate && isSameDay(dayItem, selectedDate);
            const isToday = isSameDay(dayItem, today);
            const isFuture = isAfter(dayItem, today);

            // 날짜 컨테이너 스타일
            let containerStyle = "bg-transparent";
            if (isCurrentMonth) {
              if (isToday) {
                if (selectedDate && !isSelected) {
                  containerStyle = "bg-gray-300/50";
                } else {
                  containerStyle = "bg-gray-300/100";
                }
              } else if (isSelected) {
                containerStyle = "bg-gray-300/30";
              }
            }

            // 텍스트 색상
            const textStyle = isToday
              ? "text-gray-900 font-[500]"
              : isSelected
                ? "text-gray-100 font-[400]"
                : isFuture || hasData
                  ? "text-gray-100"
                  : "text-gray-400";

            return (
              <div
                key={dateString}
                className="flex justify-center" // Grid 셀 중앙 정렬
              >
                <div
                  className={`flex h-[46px] w-[33px] cursor-pointer flex-col items-center justify-center rounded-[5px] px-1.5 pt-1.5 transition-colors duration-200 ${containerStyle} ${!isCurrentMonth ? "invisible" : ""} `}
                  onClick={() => {
                    if (isCurrentMonth) onSelectDate(dayItem);
                  }}
                >
                  {/* 다이아몬드 아이콘 */}
                  <div
                    className={`size-1.75 rotate-45 rounded-[2px] transition-colors ${hasData ? "bg-[#D9D9D9]" : "bg-transparent"} `}
                  />

                  {/* Day Number */}
                  <span
                    className={`flex items-center justify-center text-[18px] leading-[1.5] tracking-[-0.45px] ${textStyle} `}
                  >
                    {format(dayItem, "d").padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

// 메인 페이지 컴포넌트
export const VibeCalandarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeDates, setActiveDates] = useState<string[]>([]);
  const [calendarImages, setCalendarImages] = useState<
    CalendarImageItemWithSource[]
  >([]);

  const swiperRef = useRef<SwiperClass | null>(null);

  const { setNavbarVisible } = useNavbarActions();

  useEffect(() => {
    setNavbarVisible(true);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  useEffect(() => {
    // getMonthlyUploadDates 이용해서 하이라이트 할 날짜 데이터 불러오기
    const fetchMonthlyData = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const response = await getMonthlyUploadDates(year, month);

        if (response.data) {
          setActiveDates(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch monthly upload dates:", error);
        setActiveDates([]);
      }
    };
    fetchMonthlyData();
    setSelectedDate(null);
  }, [currentDate]);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate((prev) => {
      if (prev && isSameDay(prev, date)) {
        return null;
      }
      return date;
    });
  }, []);

  // selectedDate 변경 시 해당 날짜의 이미지 데이터 조회
  useEffect(() => {
    if (!selectedDate) {
      setCalendarImages([]);
      return;
    }

    const fetchCalendarImages = async () => {
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const response = await getCalendarImages(dateString);

        if (response.data) {
          // listOfWithImages와 todayImages를 구분하여 저장
          const imagesWithSource = [
            ...(response.data.listOfWithImages || []).map((item) => ({
              ...item,
              source: "lastMonth" as const,
            })),
            ...(response.data.todayImages || []).map((item) => ({
              ...item,
              source: "today" as const,
            })),
          ];
          setCalendarImages(imagesWithSource);
        }
      } catch (error) {
        console.error("Failed to fetch calendar images:", error);
        setCalendarImages([]);
      }
    };

    fetchCalendarImages();
  }, [selectedDate]);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    if (swiper.activeIndex === 1) return;
    if (swiper.activeIndex === 0) {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (swiper.activeIndex === 2) {
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  }, []);

  const prevMonthDate = useMemo(() => subMonths(currentDate, 1), [currentDate]);
  const nextMonthDate = useMemo(() => addMonths(currentDate, 1), [currentDate]);

  useLayoutEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(1, 0, false);
    }
  }, [currentDate]);

  /* 바이브 드랍 핸들러 */
  const handleDropVibe = useCallback(() => {
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
  }, [navigate]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between px-4 pt-[27px] pb-[24px]">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </button>
        <h1 className="H2 text-gray-200">바이브 캘린더</h1>
        <div className="w-6" />
      </div>

      <div className="flex w-full flex-col items-center justify-center pb-[28px]">
        <span className="mb-1 text-[10px] text-gray-400">
          {format(currentDate, "yyyy")}
        </span>
        <div className="flex w-full justify-between px-[35.03px]">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <MovemonthIcon />
          </button>
          <span className="px-4 text-[24px] font-bold text-white">
            {format(currentDate, "M")}월
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <MovemonthIcon className="rotate-180" />
          </button>
        </div>
      </div>

      <div className="min-h-0 w-full flex-1">
        <Swiper
          className="h-full"
          initialSlide={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChangeTransitionEnd={(swiper) => {
            handleSlideChange(swiper);
          }}
          spaceBetween={10}
          touchRatio={1}
        >
          <SwiperSlide>
            <CalendarGrid
              key={prevMonthDate.toISOString()}
              date={prevMonthDate}
              activeDates={activeDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </SwiperSlide>

          <SwiperSlide>
            <CalendarGrid
              key={currentDate.toISOString()}
              date={currentDate}
              activeDates={activeDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </SwiperSlide>

          <SwiperSlide>
            <CalendarGrid
              key={nextMonthDate.toISOString()}
              date={nextMonthDate}
              activeDates={activeDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Bottom Card with Swiper */}
      {selectedDate && (
        <VibeCalendarBottomCard
          selectedDate={selectedDate}
          activeDates={activeDates}
          vibeData={calendarImages.map((item: CalendarImageItemWithSource) => {
            // source 기반으로 label 결정
            const label =
              item.source === "lastMonth"
                ? "지난 달의 오늘"
                : format(selectedDate, "M월 d일");

            return {
              thumbnail: item.imageUrl,
              tag: item.tag,
              label: label,
              imageUrl: item.imageUrl,
            };
          })}
          onDropClick={handleDropVibe}
        />
      )}
    </div>
  );
};
