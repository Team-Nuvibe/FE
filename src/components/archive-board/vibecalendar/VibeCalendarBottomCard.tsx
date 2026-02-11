import React from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface VibeData {
  thumbnail: string;
  tag: string;
  label: string;
  imageUrl?: string; // 실제 이미지 URL (reveal에 전달할 데이터)
}

interface VibeCalendarBottomCardProps {
  selectedDate: Date;
  activeDates: string[];
  vibeData?: VibeData[];
  onDropClick?: () => void;
}

const VibeCalendarBottomCard: React.FC<VibeCalendarBottomCardProps> = ({
  selectedDate,
  activeDates,
  vibeData = [],
  onDropClick,
}) => {
  const navigate = useNavigate();
  const today = new Date();
  const isToday = isSameDay(selectedDate, today);
  const dateString = format(selectedDate, "yyyy-MM-dd");
  const hasData = activeDates.includes(dateString);

  // 오늘 날짜이고 데이터가 없는 경우
  if (isToday && !hasData) {
    return (
      <div className="absolute right-0 bottom-[120px] left-0 z-40 mx-auto w-[341px]">
        <div className="animate-slide-up flex w-full items-start gap-4 rounded-[10px] bg-gray-900 p-4">
          {/* 썸네일 placeholder */}
          <div className="h-[120px] w-[90px] shrink-0 rounded-[5px] border border-dashed border-gray-700 bg-gray-800" />

          <div className="flex flex-1 flex-col justify-end gap-[42px]">
            <div className="flex flex-col items-start">
              <p className="H4 text-gray-100">아직 드랍된 이미지가 없어요.</p>
              <p className="text-[12px] leading-[1.5] tracking-[-0.3px] text-[#b9bdc2]">
                오늘의 바이브를 지금 드랍해보세요 !
              </p>
            </div>

            <button
              className="ST2 relative z-10 h-[36px] w-full rounded-[5px] border-none bg-gray-300 text-gray-800"
              onClick={onDropClick}
            >
              바이브 드랍하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 있는 경우
  return (
    <div className="absolute right-0 bottom-[120px] left-0 z-40 mx-auto flex w-[341px] flex-col items-center">
      <div className="animate-slide-up relative w-full rounded-[10px] bg-gray-900">
        {/* Shadow Layer */}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-[10px] shadow-[inset_0_0_30px_0_rgba(255,255,255,0.2)]" />

        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".bottom-card-pagination",
          }}
          className="relative z-20 w-full"
        >
          {vibeData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex gap-4 p-4">
                <div className="h-[130px] w-[96px] overflow-hidden rounded-[8px] bg-gray-600">
                  <img
                    src={item.thumbnail}
                    alt={item.tag}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5">
                  <div>
                    <p className="H3 text-gray-100">{item.label}</p>
                    <span className="H1 bg-[linear-gradient(90deg,#FFF_35.59%,rgba(247,247,247,0.30)_105%)] bg-clip-text text-transparent">
                      {item.tag}
                    </span>
                  </div>

                  <button
                    className="ST2 relative z-20 h-[36px] w-full rounded-[8px] border-none bg-gray-300 text-gray-800"
                    onClick={() =>
                      navigate("/archive-board/reveal", {
                        state: {
                          imageUrl: item.imageUrl || item.thumbnail,
                          tag: item.tag,
                        },
                      })
                    }
                  >
                    확인하기
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination Dots - Bottom Card 바로 아래 */}
      <div className="bottom-card-pagination flex justify-center gap-2 pt-3" />
    </div>
  );
};

export default VibeCalendarBottomCard;
