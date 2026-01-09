import IconXbutton from "@/assets/icons/icon_xbutton.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import { useNavigate } from "react-router-dom";
import { act, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";

interface TagSelectorProps {
  onNext: (selectedTag: string) => void;
}

export const TagSelector = ({ onNext }: TagSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);

  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  return (
    <div>
      <header className="flex justify-between items-center pt-2 pb-6 px-4">
        <IconXbutton className="cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="H2 text-white">Vibe Drop</h2>
        <p className="ST2 text-white cursor-pointer">다음</p>
      </header>
      <div className="flex items-center mx-4 mb-5 h-12 rounded-[5px] bg-gray-900">
        <IconSearch className="ml-4 mr-3" />
        <input type="text" placeholder="검색어를 입력하세요." className="B1" />
      </div>
      <div className="relative flex justify-between items-center">
        <div className="absolute bottom-[0.5px] left-0 w-[200px] h-[0.5px] mx-4 bg-gray-400" />
        <div className="flex">
          <button onClick={() => handleTabClick(0)} className="relative mx-2">
            <p
              className={`${
                activeIndex === 0
                  ? "ST2 text-gray-200 px-4"
                  : "B2 text-gray-600 px-5"
              } pb-[2px]`}
            >
              최근 검색어
            </p>
            {activeIndex === 0 && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 w-full h-[1.5px] bg-white z-10"
                transition={{ stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button onClick={() => handleTabClick(1)} className="relative">
            <p
              className={`${
                activeIndex === 1
                  ? "ST2 text-gray-200 px-[22px]"
                  : "B2 text-gray-600 px-[22px]"
              } pb-[2px]`}
            >
              태그 찾기
            </p>
            {activeIndex === 1 && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 w-full h-[1.5px] bg-white z-10"
                transition={{ stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
        <p
          className={`${
            activeIndex === 0 ? "opacity-100" : "opacity-0"
          } B2 text-gray-600 cursor-pointer mx-4`}
        >
          전체 삭제
        </p>
      </div>
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{
          hide: false,
          draggable: true,
          el: ".home-scrollbar",
        }}
        slidesPerView={1}
        spaceBetween={12}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
      >
        <SwiperSlide>최근 검색어</SwiperSlide>
        <SwiperSlide>태그 찾기</SwiperSlide>
      </Swiper>
    </div>
  );
};
