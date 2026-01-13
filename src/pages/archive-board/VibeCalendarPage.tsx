import React, { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
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
} from 'date-fns';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import 'swiper/css';
import ChevronLeftIcon from '@/assets/icons/icon_chevron_left.svg?react'
import MovemonthIcon from '@/assets/icons/icon_backbutton.svg?react'
import { AnimatePresence } from 'framer-motion';
import RevealImageModal from '../../components/archive-board/RevealImageModal';
import { useNavbarActions } from '../../hooks/useNavbarStore';

// 더미 데이터용 
import img7 from '@/assets/images/img_7.svg';

// 달력 그리드 컴포넌트 (최적화 적용)
interface CalendarGridProps {
  date: Date;
  activeDates: string[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CalendarGrid = React.memo(({ date, activeDates, selectedDate, onSelectDate }: CalendarGridProps) => {
  
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

  const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthStart = useMemo(() => startOfMonth(date), [date]);
  const today = useMemo(() => new Date(), []);

  return (
    <div className="px-[39px] h-full">
      <div className="grid grid-cols-7 pb-[10px]">
        {weeks.map((day) => (
          <div key={day} className="text-center text-[12px] text-gray-100 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1"> {/* gap-y-6에서 4로 살짝 조정하여 밀도 높임 */}
        {calendarDays.map((dayItem) => {
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          const dateString = format(dayItem, 'yyyy-MM-dd');
          
          const hasData = isCurrentMonth && activeDatesSet.has(dateString);
          const isSelected = selectedDate && isSameDay(dayItem, selectedDate);
          const isToday = isSameDay(dayItem, today);
          const isFuture = isAfter(dayItem, today);

          // 날짜 컨테이너 스타일
          let containerStyle = "bg-transparent";
          if (isCurrentMonth) {
            if (isSelected) {
              containerStyle = "bg-gray-800/50"; 
            } else if (isToday) {
              containerStyle = "bg-gray-800/100"; 
            }
          }
          
          // 텍스트 색상 
          const textStyle = (isSelected || isToday) 
            ? 'text-gray-100' 
            : isFuture || hasData
              ? 'text-gray-100' 
              : 'text-gray-400'; 

          return (
            <div 
              key={dateString} 
              className="flex justify-center" // Grid 셀 중앙 정렬
            >
              <div 
                className={`
                  flex flex-col items-center justify-center 
                  w-[36px] h-[46px] rounded-[12px] cursor-pointer transition-colors duration-200
                  gap-1
                  ${containerStyle}
                  ${!isCurrentMonth ? 'invisible' : ''}
                `}
                onClick={() => {
                  if (isCurrentMonth) onSelectDate(dayItem);
                }}
              >
                {/* 다이아몬드 아이콘 */}
                <div 
                  className={`
                    w-1.5 h-1.5 rotate-45 transition-colors rounded-[1px]
                    ${hasData ? 'bg-[#D9D9D9]' : 'bg-transparent'}
                  `} 
                />
                
                {/* Day Number */}
                <span 
                  className={`
                    text-[18px] font-normal leading-none
                    ${textStyle}
                  `}
                >
                  {format(dayItem, 'd').padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// 메인 페이지 컴포넌트
export const VibeCalandarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeDates, setActiveDates] = useState<string[]>([]);
  const [showReveal, setShowReveal] = useState(false);
  
  const swiperRef = useRef<SwiperClass | null>(null);

  const {setNavbarVisible} = useNavbarActions();

  useEffect(() => {
    setNavbarVisible(!showReveal);
    return () => setNavbarVisible(true);
  }, [showReveal, setNavbarVisible]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const mockServerData = [
        '2026-01-03', '2026-01-05', '2026-01-12', 
        '2026-01-20', '2026-01-25'
      ];
      setActiveDates(mockServerData);
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full px-4 pt-[27px] pb-[36px] flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
            <ChevronLeftIcon />
        </button>
        <h1 className="H2 text-gray-200">바이브 캘린더</h1>
        <div className="w-6" /> 
      </div>

      <div className="flex flex-col w-full items-center justify-center pb-[35px]">
        <span className="text-gray-400 text-[10px] mb-1">{format(currentDate, 'yyyy')}</span>
        <div className="flex w-full justify-between px-[35.03px]">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <MovemonthIcon />
          </button>
          <span className="text-[24px] font-bold text-white px-4">
            {format(currentDate, 'M')}월
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <MovemonthIcon className='rotate-180' />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <Swiper
          className="h-full"
          initialSlide={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChangeTransitionEnd={(swiper) => {handleSlideChange(swiper)}}
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

      {/* Bottom Card */}
      {selectedDate && !showReveal && (
        <div className="
        absolute bottom-[120px]
        left-0 right-0 mx-auto
        bg-gray-900 rounded-[10px] shadow-[inset_0_0_30px_0_rgba(255,255,255,0.2)]
        w-[341px]
        p-4 flex gap-4 animate-slide-up z-40"
        >
          <div className="w-[96px] h-[130px] bg-gray-600 rounded-[8px] overflow-hidden">
             {/* 썸네일 */}
          </div>
          
          <div className="flex-1 flex flex-col gap-5 justify-between">
            <div>
              <p className="text-gray-100 H3">지난 달의 오늘</p>
              <span className="
                H1
                bg-[linear-gradient(90deg,#FFF_35.59%,rgba(247,247,247,0.30)_105%)]
                bg-clip-text 
                text-transparent
              ">
                #Raw
              </span>
            </div>
          
            <button 
              className="w-full h-[36px] bg-gray-300 rounded-[8px] text-gray-800 ST3"
              onClick={() => setShowReveal(true)}>
              확인하기
            </button>
            
          </div>
        </div>
      )}
      <AnimatePresence>
        {showReveal && (
        <RevealImageModal
          imageUrl={img7}
          tag="#Raw"
          onClose={() => setShowReveal(false)}
        />
        )}
      </AnimatePresence>
    </div>
    
    
  );
};