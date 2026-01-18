import { useState } from 'react';
import { BackButton } from '../../components/onboarding/BackButton';
import RecapFirstSlide from '../../components/archive-board/vibetone/RecapFirstSlide';
import RecapSecondSlide from '../../components/archive-board/vibetone/RecapSecondSlide';
import RecapThirdSlide from '../../components/archive-board/vibetone/RecapThirdSlide';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router';
import ClockIcon from '@/assets/icons/icon_clock.svg?react';
import RefreshIcon from '@/assets/icons/icon_refreshbutton.svg?react';
import SaveIcon from '@/assets/icons/icon_imagesave.svg?react';

const VibeTonePage = () => {
  const navigate = useNavigate();

  // 상태 관리: 탭, 활성 슬라이드 인덱스
  const [activeTab, setActiveTab] = useState<'weekly' | 'all'>('weekly');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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
          <ClockIcon />
        </button>
      </div>

      {/* Tab Navigation (필터 역할로 변경) */}
      <div className="px-4 flex gap-9 shrink-0">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`ST2 relative transition-colors ${
            activeTab === 'weekly' ? 'text-gray-200' : 'text-gray-500'
          }`}
        >
          주간
          {activeTab === 'weekly' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`ST2 relative transition-colors ${
            activeTab === 'all' ? 'text-gray-200' : 'text-gray-500'
          }`}
        >
          전체
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col relative pt-4">
        <Swiper
          modules={[Pagination]}
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
          pagination={{
            el: '.bottom-card-pagination',
            clickable: true,
            type: 'bullets',
          }}
          className="w-full flex-1"
        >
          {/* Slide 1: 물리 엔진 기반 태그 애니메이션 (RecapFirstSlide) */}
          <SwiperSlide className="overflow-y-auto flex items-center justify-center px-4">
            <RecapFirstSlide isActive={activeSlideIndex === 0} activeTab={activeTab} />
          </SwiperSlide>

          {/* Slide 2: 폴더 팝업 애니메이션 (RecapSecondSlide) */}
          <SwiperSlide className="overflow-y-auto flex items-center justify-center px-4">
            <RecapSecondSlide isActive={activeSlideIndex === 1} activeTab={activeTab} />
          </SwiperSlide>

          {/* Slide 3: 패턴 분석 (RecapThirdSlide) */}
          <SwiperSlide className="overflow-y-auto flex items-center justify-center px-4">
            <RecapThirdSlide isActive={activeSlideIndex === 2} activeTab={activeTab} />
          </SwiperSlide>
        </Swiper>
      </div>
      {/* Pagination dots */}
      <div className="bottom-card-pagination flex justify-center gap-2 pt-3" />
      {/* Footer / Action Buttons - Figma Design */}
      <div className="px-4 py-4 shrink-0 bg-black mb-25">
        <div className="flex gap-3 items-center">
          {/* Redo Button (왼쪽) */}
          <button 
            className="w-11 h-11 border border-gray-800 rounded-[10px] flex items-center justify-center shrink-0"
            aria-label="Redo"
          >
            <RefreshIcon />
          </button>
          
          {/* Save Card Button (오른쪽) */}
          <button className="
            flex-1 h-11 border border-gray-800 rounded-[10px] 
            flex items-center justify-center gap-4 hover:bg-gray-900 transition-colors
            mx-auto">
            <SaveIcon />
            <span className="ST2 text-gray-200 tracking-[-0.4px]">이 카드 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeTonePage;