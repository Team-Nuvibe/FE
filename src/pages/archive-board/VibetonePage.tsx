import { useState, useEffect } from 'react';
import { BackButton } from '../../components/onboarding/BackButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router';

interface TagRanking {
  rank: number;
  tag: string;
  drops: number;
  status?: string;
}

const VibeTonePage = () => {
  const navigate = useNavigate();

  // 1. 상태 관리: 탭과 Swiper 인스턴스
  const [activeTab, setActiveTab] = useState<'weekly' | 'all'>('weekly');
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // 2. 데이터 정의 (Weekly용, All용)
  const weeklyRankings: TagRanking[] = [
    { rank: 1, tag: '#Minimal', drops: 5, status: '3 weeks in a row !' },
    { rank: 2, tag: '#Cozy', drops: 4, status: 'New this week !' },
    { rank: 3, tag: '#Vintage', drops: 3, status: 'Back again !' },
    { rank: 4, tag: '#Modern', drops: 1, status: 'Back again !' },
  ];

  const allRankings: TagRanking[] = [
    { rank: 1, tag: '#Minimal', drops: 150, status: 'All time best' },
    { rank: 2, tag: '#Street', drops: 120, status: 'Steady seller' },
    { rank: 3, tag: '#Retro', drops: 90, status: '' },
    { rank: 4, tag: '#Sporty', drops: 80, status: '' },
  ];

  // 3. 현재 탭에 맞는 데이터 선택
  const currentData = activeTab === 'weekly' ? weeklyRankings : allRankings;

  // 4. 탭이 변경될 때 Swiper를 0번 슬라이드로 초기화 (UX 향상)
  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.slideTo(0);
    }
  }, [activeTab, swiperInstance]);

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between shrink-0">
        <BackButton className="w-6 h-6" />
        <h1 className="H2 text-gray-200">바이브 톤</h1>
        <button
          className="w-6 h-6 flex items-center justify-center"
          onClick={() => navigate('/archive-board/vibecalendar')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation (필터 역할로 변경) */}
      <div className="px-4 flex gap-6 mb-2 shrink-0">
        <button
          onClick={() => setActiveTab('weekly')}
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
          onClick={() => setActiveTab('all')}
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

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col relative">
        <Swiper
          modules={[Pagination]}
          onSwiper={setSwiperInstance}
          pagination={{
            el: '.onboarding-pagination',
            clickable: true,
            type: 'bullets',
          }}
          className="w-full flex-1" // flex-1로 남은 공간 차지
        >
          {/* Slide 1: 랭킹 리스트 (currentData를 props처럼 사용) */}
          <SwiperSlide className="overflow-y-auto">
            <div className="px-4 pt-4 pb-10">
              {/* My Top Tag Card */}
              <div className="bg-gray-900 rounded-[10px] p-6 mb-6">
                <h2 className="H3 text-gray-200 mb-2">
                  My Top Tags ({activeTab === 'weekly' ? 'Weekly' : 'All Time'})
                </h2>
                <p className="B2 text-gray-400 mb-6">
                  {activeTab === 'weekly' ? 'This Week 34 drops' : 'Total 450 drops'}
                </p>

                {/* Rankings Map */}
                <div className="space-y-4">
                  {currentData.map((item) => (
                    <div key={`${item.tag}-${item.rank}`} className="flex items-center gap-4">
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
            </div>
          </SwiperSlide>

          {/* Slide 2: 추가 정보 혹은 다음 페이지 (예시) */}
          <SwiperSlide className="overflow-y-auto">
            <div className="px-4 pt-4 text-center text-gray-400">
              <p className="H3 mb-4">More Analysis</p>
              <p>추가적인 분석 데이터가 들어갈 페이지입니다.</p>
              <p>현재 탭: {activeTab}</p>
            </div>
          </SwiperSlide>

          {/* Pagination Container (Swiper 내부에 위치) */}
          <div className="onboarding-pagination !absolute !bottom-4 !left-0 !w-full flex justify-center gap-2 z-10" />
        </Swiper>
      </div>

      {/* Footer / Save Button (Swiper 밖으로 빼서 하단 고정) */}
      <div className="px-4 py-4 shrink-0 bg-black mb-25">
        <button className="w-full h-[56px] bg-transparent border border-gray-700 rounded-[10px] flex items-center justify-center gap-2 ST1 text-gray-200 hover:bg-gray-900 transition-colors">
          
          Save My {activeTab === 'weekly' ? 'Week' : 'History'}
        </button>
      </div>
    </div>
  );
};

export default VibeTonePage;