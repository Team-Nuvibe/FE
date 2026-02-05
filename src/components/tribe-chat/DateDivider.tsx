interface DateDividerProps {
  date: string; // 예: "2026. 01. 02"
}

const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="relative flex items-center justify-center py-1">
      {/* 배경 선 */}
      <div className="absolute inset-0 flex items-center">
        <div className="h-px w-full bg-gray-700" />
      </div>

      {/* 날짜 텍스트 with 배경 */}
      <div className="relative bg-black px-3">
        <span className="Caption1 text-[#64676D]">{date}</span>
      </div>
    </div>
  );
};

export default DateDivider;
