import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const hasData = activeDates.includes(dateString);

  // 오늘 날짜이고 데이터가 없는 경우
  if (isToday && !hasData) {
    return (
      <div className="absolute bottom-[120px] left-0 right-0 mx-auto w-[341px] z-40">
        <div className="
          bg-gray-900 rounded-[10px]
          w-full
          p-4 flex gap-4 items-start
          animate-slide-up"
        >
          {/* 썸네일 placeholder - Figma 디자인과 일치 */}
          <div className="w-[90px] h-[120px] bg-gray-800 border border-gray-700 border-dashed rounded-[5px] shrink-0" />
          
          <div className="flex-1 flex flex-col gap-[42px] justify-end">
            <div className="flex flex-col items-start">
              <p className="text-gray-100 H4">아직 드랍된 이미지가 없어요.</p>
              <p className="text-[#b9bdc2] text-[12px] leading-[1.5] tracking-[-0.3px]">오늘의 바이브를 지금 드랍해보세요 !</p>
            </div>
            
            <button 
              className="w-full h-[36px] bg-[#b9bdc2] rounded-[5px] text-gray-800 ST3"
              onClick={onDropClick}>
              바이브 드랍하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 있는 경우 (기존 Swiper UI)
  return (
    <div className="absolute bottom-[120px] left-0 right-0 mx-auto w-[341px] z-40 flex flex-col items-center">
      <div className="
        relative
        bg-gray-900 rounded-[10px] shadow-[inset_0_0_30px_0_rgba(255,255,255,0.2)]
        w-full
        animate-slide-up"
      >
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: '.bottom-card-pagination',
          }}
          className="w-full"
        >
          {vibeData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="p-4 flex gap-4">
                <div className="w-[96px] h-[130px] bg-gray-600 rounded-[8px] overflow-hidden">
                  <img 
                    src={item.thumbnail} 
                    alt={item.tag}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col gap-5 justify-between">
                  <div>
                    <p className="text-gray-100 H3">{item.label}</p>
                    <span className="
                      H1
                      bg-[linear-gradient(90deg,#FFF_35.59%,rgba(247,247,247,0.30)_105%)]
                      bg-clip-text 
                      text-transparent
                    ">
                      {item.tag}
                    </span>
                  </div>
                
                  <button 
                    className="w-full h-[36px] bg-gray-300 rounded-[8px] text-gray-800 ST3"
                    onClick={() => navigate('/archive-board/reveal', {
                      state: {
                        imageUrl: item.imageUrl || item.thumbnail,
                        tag: item.tag
                      }
                    })}>
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
