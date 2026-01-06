import { useEffect, useState } from 'react';
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
  isSameDay 
} from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal = ({ isOpen, onClose }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // 2025년 12월 기준
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 1. 달력에 표시할 데이터 (예: 다이아몬드가 표시될 날짜들)
  const [activeDates, setActiveDates] = useState<string[]>([]);

  //  달(Month)이 바뀔 때마다 서버에서 데이터 가져오기
  useEffect(() => {
    // 실제로는 API 호출 (예: axios.get(`/api/posts/dates?year=${year}&month=${month}`))
    const fetchMonthlyData = async () => {
      // 가짜 데이터 (서버에서 받아왔다고 가정)
      // 팁: 서버에서는 'YYYY-MM-DD' 문자열 형태로 주는 것이 제일 편합니다.
      const mockServerData = [
        '2026-01-03', '2026-01-05', '2026-01-12', 
        '2026-01-20', '2026-01-25'
      ];
      setActiveDates(mockServerData);
    };
    fetchMonthlyData();
  }, [currentDate]); // currentDate(달)가 바뀔 때마다 실행됨

  if (!isOpen) return null;

  // 2. 날짜 생성 로직 (핵심)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart); // 달력의 첫 칸 (보통 지난달의 날짜)
  const endDate = endOfWeek(monthEnd);       // 달력의 마지막 칸

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <button onClick={onClose}>
            {/* 뒤로가기 아이콘 */}
            <span className="text-white text-xl">{'<'}</span> 
        </button>
        <h1 className="H2 text-gray-200">아카이브 보드</h1>
        <div className="w-6" /> {/* 우측 여백용 */}
      </div>

      {/* Month Navigation */}
      <div className="flex flex-col items-center justify-center mt-4 mb-8">
        <span className="text-gray-500 text-[12px] mb-1">{format(currentDate, 'yyyy')}</span>
        <div className="flex items-center gap-8">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <span className="text-gray-500 text-xl">{'<'}</span>
          </button>
          <span className="text-[24px] font-bold text-white">
            {format(currentDate, 'M')}월
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <span className="text-gray-500 text-xl">{'>'}</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-6">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-4">
          {weeks.map((day) => (
            <div key={day} className="text-center text-[12px] text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-6">
          {calendarDays.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, monthStart);
            
            // ✨ [핵심] 현재 그리는 날짜(date)가 activeDates 배열에 있는지 확인
            // date-fns의 format을 써서 문자열끼리 비교하는 게 가장 확실합니다.
            const dateString = format(date, 'yyyy-MM-dd');
            const hasData = activeDates.includes(dateString);

            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => {
                  if (isCurrentMonth) {
                    setSelectedDate(date);
                     // 클릭 시 해당 날짜의 상세 데이터를 불러오는 로직을 여기에 추가할 수도 있습니다.
                  }
                }}
              >
                {/* ✨ hasData가 true일 때만 다이아몬드(bg-white) 표시 */}
                <div 
                  className={`
                    w-1.5 h-1.5 rotate-45 transition-colors duration-200
                    ${hasData && isCurrentMonth ? 'bg-white' : 'bg-transparent'}
                  `} 
                />
                
                <span 
                  className={`
                    text-[16px] 
                    ${!isCurrentMonth ? 'text-transparent' : 'text-gray-400'}
                    ${isSelected ? '!text-white font-bold' : ''}
                  `}
                >
                  {format(date, 'd').padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Card (선택된 날짜가 있을 때 표시) */}
      {selectedDate && (
        <div className="absolute bottom-10 left-4 right-4 bg-[#1C1C1E] rounded-[16px] p-4 flex gap-4 animate-slide-up">
           {/* 썸네일 */}
          <div className="w-[100px] h-[100px] bg-gray-600 rounded-[8px] overflow-hidden">
             {/* <img src="..." /> */}
          </div>
          
          {/* 정보 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-[14px] mb-1">지난 달의 오늘</p>
              <p className="text-gray-500 text-[12px]">Model {'>'}</p>
              <p className="text-white text-[20px] font-bold">#Raw</p>
            </div>
          
            <button className="w-full h-[36px] bg-[#3A3A3C] rounded-[8px] text-[#E5E5E5] text-[14px]">
              확인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};