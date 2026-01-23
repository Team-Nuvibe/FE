import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconXbuttonQuickdropTag from "@/assets/icons/icon_xbutton_quickdrop_tag.svg?react";
import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";

interface TagSelectorProps {
  onNext: (selectedTag: string) => void;
  onPrevious: () => void;
}

export const TagSelector = ({ onNext, onPrevious }: TagSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const swiperRef = useRef<SwiperType | null>(null);

  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  // 임시 최근 검색어 데이터
  const recentSearches = ["Grain", "Morning", "Mono"];

  // 임시 카테고리 데이터
  const categories = [
    "Mood",
    "Light",
    "Color",
    "Texture",
    "Space",
    "Daily",
    "Fashion",
    "Media",
    "Travel",
  ];

  // 임시 Mood 태그 데이터
  const moodTags = [
    "Blur",
    "Grain",
    "Silence",
    "Calm",
    "Slow",
    "Lovely",
    "Heavy",
    "Light",
    "Raw",
    "Warm",
    "Cool",
    "Deep",
    "Still",
    "Soft",
    "Muted",
  ];

  return (
    <div>
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-4 pt-2 pb-6 tracking-tight">
          <IconChevronLeft
            className="cursor-pointer"
            onClick={() => onPrevious()}
          />
          <h2 className="H2 text-white">바이브 드랍</h2>
          <p
            className={`ST2 ${
              selectedTag
                ? "cursor-pointer text-white"
                : "cursor-not-allowed text-gray-700"
            }`}
            onClick={() => onNext(selectedTag)}
          >
            다음
          </p>
        </header>
        <div className="mx-4 mb-5 flex h-12 items-center rounded-[5px] bg-gray-900">
          <IconSearch className="mr-3 ml-4" />
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="B1 tracking-tight focus:outline-none"
          />
        </div>
      </div>

      <div className="relative mx-4 mb-4 flex items-center justify-between tracking-tight">
        <div className="absolute bottom-[0.5px] left-0 h-[0.5px] w-[199px] bg-gray-400" />
        <div className="flex">
          <button onClick={() => handleTabClick(0)} className="relative">
            <p
              className={`B2 transition-transform ${
                activeIndex === 0 ? "scale-115 text-gray-200" : "text-gray-600"
              } px-[22px] pb-[2px]`}
            >
              최근 검색어
            </p>
            {activeIndex === 0 && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 z-10 h-[1.5px] w-full bg-white"
              />
            )}
          </button>
          <button onClick={() => handleTabClick(1)} className="relative">
            <p
              className={`B2 transition-transform ${
                activeIndex === 1 ? "scale-115 text-gray-200" : "text-gray-600"
              } px-[22px] pb-[2px]`}
            >
              태그 찾기
            </p>
            {activeIndex === 1 && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 z-10 h-[1.5px] w-full bg-white"
                transition={{ stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
        <p
          className={`B2 ${
            activeIndex === 0 ? "opacity-100" : "opacity-0"
          } B2 cursor-pointer text-gray-600`}
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
        <SwiperSlide>
          <div className="flex flex-wrap gap-3 px-4">
            {recentSearches.map((tag) => (
              <div
                className="flex cursor-pointer items-center justify-between gap-3 rounded-[5px] bg-gray-900 px-2 py-[3px]"
                key={tag}
                onClick={() => onNext(tag)}
              >
                <p className="ST1 tracking-tight text-gray-200">#{tag}</p>
                <IconXbuttonQuickdropTag className="w-[8px] cursor-pointer" />
              </div>
            ))}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col px-4 tracking-tight">
            <p className="ST1 mb-3 text-gray-200">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`relative cursor-pointer rounded-[5px] border-[1px] border-gray-900 px-2 py-[3px] ${
                    selectedCategory === category
                      ? "bg-gray-900 text-gray-200"
                      : "bg-black text-gray-500"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="ST1 invisible block">{category}</span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center ${
                      selectedCategory === category ? "ST1" : "B0"
                    }`}
                  >
                    {category}
                  </span>
                </button>
              ))}
            </div>
            {selectedCategory === "Mood" && (
              <>
                <p className="ST1 mt-4 mb-3 text-gray-200">태그</p>
                <div className="flex flex-wrap gap-2">
                  {moodTags.map((tag) => (
                    <button
                      key={tag}
                      className={`relative cursor-pointer rounded-[5px] border-[1px] border-gray-900 px-2 py-[3px] ${
                        selectedTag === tag
                          ? "bg-gray-900 text-gray-200"
                          : "bg-black text-gray-500"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <span className="ST1 invisible block">#{tag}</span>
                      <span
                        className={`absolute inset-0 flex items-center justify-center ${
                          selectedTag === tag ? "ST1" : "B0"
                        }`}
                      >
                        #{tag}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
