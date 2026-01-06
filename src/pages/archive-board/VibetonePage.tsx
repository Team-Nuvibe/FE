import { useState } from 'react';
import { BackButton } from '../../components/onboarding/BackButton';
// Swiper 관련 임포트 추가
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; 
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { CalendarModal } from '../../components/archive-board/CalendarModal';

interface TagRanking {
  rank: number;
  tag: string;
  drops: number;
  status?: string;
}

const VibeTonePage = () => {
  // 탭 상태와 스와이퍼 인스턴스 상태 관리
  const [activeTab, setActiveTab] = useState<'weekly' | 'all'>('weekly');
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const weeklyRankings: TagRanking[] = [
    { rank: 1, tag: '#Minimal', drops: 5, status: '3 weeks in a row !' },
    { rank: 2, tag: '#Minimal', drops: 4, status: 'New this week !' },
    { rank: 3, tag: '#Minimal', drops: 3, status: 'Back again !' },
    { rank: 4, tag: '#Minimal', drops: 1, status: 'Back again !' },
  ];

  // 탭 클릭 핸들러 (탭 변경 + 스와이퍼 이동)
  const handleTabClick = (tab: 'weekly' | 'all', index: number) => {
    setActiveTab(tab);
    swiperInstance?.slideTo(index);
  };

  // 캘린더 모달 상태 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between shrink-0">
        <BackButton className="w-6 h-6" />
        <h1 className="H2 text-gray-200">Viber's Vibe Tone</h1>
        <button className="w-6 h-6 flex items-center justify-center" onClick={() => setIsCalendarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 flex gap-6 mb-2 shrink-0">
        <button
          onClick={() => handleTabClick('weekly', 0)}
          className={`pb-2 ST1 relative transition-colors ${
            activeTab === 'weekly' ? 'text-gray-200' : 'text-gray-500'
          }`}
        >
          Weekly
          {activeTab === 'weekly' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200" />
          )}
        </button>
        <button
          onClick={() => handleTabClick('all', 1)}
          className={`pb-2 ST1 relative transition-colors ${
            activeTab === 'all' ? 'text-gray-200' : 'text-gray-500'
          }`}
        >
          All
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200" />
          )}
        </button>
        <div className="flex-1" />
        <span className="B2 text-gray-500 self-end pb-2">since : 2025.03</span>
      </div>

      {/* Swiper Area */}
      {/* flex-1을 주어 남은 영역을 모두 차지하게 함 */}
      <div className="flex-1 min-h-0 relative"> 
        <Swiper
          modules={[Pagination]}
          onSwiper={setSwiperInstance} // 스와이퍼 제어권 획득
          onSlideChange={(swiper) => {
            // 스와이프 시 탭 상태 동기화
            setActiveTab(swiper.activeIndex === 0 ? 'weekly' : 'all');
          }}
          pagination={{
            el: '.onboarding-pagination',
            clickable: true,
            type: 'bullets',
          }}
          className="w-full h-full"
        >
          {/* Slide 1: Weekly */}
          <SwiperSlide className="overflow-y-auto">
            <div className="px-4 pt-4 pb-24"> {/* 스크롤 패딩 확보 */}
              
              {/* My Top Tag Card */}
              <div className="bg-gray-900 rounded-[10px] p-6 mb-6">
                <h2 className="H3 text-gray-200 mb-2">My Top Tage</h2>
                <p className="B2 text-gray-400 mb-6">This Week 34 drops</p>

                {/* Rankings */}
                <div className="space-y-4">
                  {weeklyRankings.map((item) => (
                    <div key={item.rank} className="flex items-center gap-4">
                      <span className="H2 text-gray-200 w-8">{item.rank}.</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="B2 text-gray-400">{item.drops} Drops</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="ST1 text-gray-200 bg-gray-800 px-3 py-1 rounded-[5px]">
                            {item.tag}
                          </span>
                          {item.status && (
                            <span className="B2 text-gray-500 italic">{item.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button  */}
              
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide className="overflow-y-auto">
            <div>
              123123
            </div>
          </SwiperSlide>

          {/* Pagination Container */}
          <div className="onboarding-pagination !absolute !bottom-4 !left-0 !w-full flex justify-center gap-2 z-10" />
        </Swiper>
        <button className="w-full h-[56px] bg-transparent border border-gray-700 rounded-[10px] flex items-center justify-center gap-2 ST1 text-gray-200 hover:bg-gray-900 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Save My Week
        </button>
      </div>
      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
    </div>
  );
};

export default VibeTonePage;