import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SearchIcon from '@/assets/icons/icon_search.svg?react'
import Plusbutton from '@/assets/icons/icon_plusbutton.svg?react'

interface ArchiveItem {
  id: string;
  title: string;
  thumbnail?: string;
}

interface ResentDrops {
  id: string;
  tag: string;
  time: string;
  thumbnail: string;
}

const ArchivePage  = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const resentDrops: ResentDrops[] = [
    { id: '1', tag: '#Start', time: '12m', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '2', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '3', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '4', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '5', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '6', tag: '#End', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },

  ];

  const tags = ['#Minimal', '#Warm', '#Object', '#Moody'];

  const archiveItems: ArchiveItem[] = [
    { id: '1', title: '2026 추구미' },
    { id: '2', title: '보드명' },
    { id: '3', title: '' },
    { id: '4', title: '' },
    { id: '5', title: '' },
    { id: '6', title: '' },
    { id: '7', title: '' },
    { id: '8', title: '' },
    { id: '9', title: '' },
    { id: '10', title: '' },
    { id: '11', title: '' },
    { id: '12', title: '' },
    { id: '13', title: '' },
  ];

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 touch-auto">
        {/* Video Posts Section with Overlay */}
        <div className="relative mb-37 mt-2">
          {/* Background Video Posts */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12} 
            slidesPerView={'auto'} 
            slidesOffsetBefore={16} 
            slidesOffsetAfter={16} 
            className="pb-2 [&>.swiper-wrapper]:!ease-linear" 
            speed={10000} // 이동 속도 
            resistanceRatio={0}
            freeMode={{ 
              enabled: true,
              momentum: false, // 관성 
              sticky: false,  
            }} 
            loop={false}
            allowTouchMove={true} // 사용자가 손가락으로 스와이프 가능
            autoplay={{
              delay: 0, // 딜레이 없이 부드럽게 계속 흐르게 설정
              disableOnInteraction: true, // 사용자가 건드려도 자동 재생이 꺼지지 않음
              stopOnLastSlide: true,
              waitForTransition: false,
            }}
          >
            {resentDrops.map((post) => (
              <SwiperSlide 
                key={post.id} 
                className="!w-[165px]"
              >
                <div className="relative w-full h-[220px] rounded-[10px] overflow-hidden backdrop-blur-[2px]">
                  <img 
                    src={post.thumbnail} 
                    alt={post.tag}
                    className="w-full h-full object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
                  <div className="absolute top-1 left-1 px-2 py-1 rounded-lg ST1">
                    <span
                      className="
                        bg-clip-text 
                        text-transparent 
                        bg-[linear-gradient(90deg,#F7F7F7_35.59%,rgba(247,247,247,0.3)_105%)]
                      "
                    >
                      {post.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 B2 text-white/80">
                    {post.time}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-[260px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
            {/* 프로필 이미지 */}
            <div className="w-[76.14px] h-[76.14px] rounded-full bg-black overflow-hidden border border-white/10 pointer-events-auto"> {/* 클릭 필요하면 pointer-events-auto */}
            <img 
              src="../../src/assets/logos/Subtract.svg" 
              alt="profile"
              className="w-full h-full object-cover"
            />
            </div>
            <div className="mt-5 font-[500] text-[28.42px] text-[#F7F7F7] leading-[140%] tracking-[-0.03em]">
              {/* user.nickname */}
              Vibers
            </div>
          </div>
        </div>

        {/* Vibe Tone */}
        <div className="px-4 mb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="ST1 text-gray-200">0000's Vibe Tone</p>
            <button className="text-[12px] font-normal text-[#828282]">more &gt;</button>
          </div>
          
          {/* Tags */}
          <div className="w-full">
            <Swiper
              spaceBetween={8}
              slidesPerView={'auto'}
              className="px-4"
              freeMode={true} 
            >
              {tags.map((tag) => (
                <SwiperSlide key={tag} className="!w-auto">
                  <div className="px-3 py-1.5 bg-[#252525] rounded-[5px] ST2 whitespace-nowrap">
                    <span 
                      className="
                        bg-clip-text 
                        text-transparent 
                        bg-[linear-gradient(90deg,#F7F7F7_35.59%,rgba(247,247,247,0.3)_105%)]
                      "
                    >
                      {tag}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Archive Section */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Header */}
          <div className="px-4 bg-black sticky top-0 z-10 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20.3px] font-normal">Archive</h2>
              <div className="flex gap-2">
                <button
                  className="B2 text-gray-200"
                >
                  선택
                </button>
                <button 
                >
                  <Plusbutton className="w-[16px] h-[16px]"/>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[48px] bg-gray-900 rounded-[5px] pl-10 pr-4 py-3 placeholder:text-gray-600 placeholder:text-[18px] placeholder:font-normal focus:outline-none"
              />
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="px-4">
            <div className="grid grid-cols-2 gap-4 pb-6">
              {archiveItems.map((item) => (
                <div 
                  key={item.id}
                  className="aspect-square bg-gradient-to-b from-white/20 to-white/10 rounded-[10px] flex items-center justify-center cursor-pointer"
                >
                  {item.title && (
                    <span className="ST2">{item.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;