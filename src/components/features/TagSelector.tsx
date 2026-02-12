import IconXbuttonQuickdropTag from "@/assets/icons/icon_xbutton_quickdrop_tag.svg?react";
import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import IconSearchGray5 from "@/assets/icons/icon_search_gray5.svg?react";
import IconArrowUpRight from "@/assets/icons/icon_arrow_up_right.svg?react";
import IconRectangleGray9 from "@/assets/icons/icon_rectangle_gray9.svg?react";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import useGetFindTags from "@/hooks/queries/useGetFindTags";
import useDebounce from "@/hooks/useDebounce";
import useGetSearchTags from "@/hooks/queries/useGetSearchTags";

interface TagSelectorProps {
  onNext: (selectedTag: string) => void;
  onPrevious: () => void;
}

export const TagSelector = ({ onNext, onPrevious }: TagSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    return savedSearches ? JSON.parse(savedSearches) : [];
  });
  const debouncedSearchInput = useDebounce(searchInput, 300).trim();

  // 검색어 하이라이트 함수
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="text-gray-400">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </>
    );
  };

  const addRecentSearch = (tag: string) => {
    console.log("addRecentSearch 호출됨:", tag);

    // 기존 localStorage에서 직접 읽기
    const savedSearches = localStorage.getItem("recentSearches");
    const prev = savedSearches ? JSON.parse(savedSearches) : [];

    // 중복 제거 후 맨 앞에 추가
    const filtered = prev.filter((item: string) => item !== tag);
    const updated = [tag, ...filtered].slice(0, 10);

    // 즉시 localStorage에 저장
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    console.log("localStorage 저장됨:", updated);

    // state도 업데이트 (컴포넌트가 살아있으면)
    setRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (tag: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== tag);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const { data: tagsData, isPending: isPendingTags } = useGetFindTags(
    selectedCategory || "",
  );
  const { data: searchTagsData } = useGetSearchTags(debouncedSearchInput);

  const tags = tagsData?.data || [];
  const searchTags = searchTagsData?.data || [];

  const swiperRef = useRef<SwiperType | null>(null);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  const categories = [
    "MOOD",
    "LIGHT",
    "COLOR",
    "TEXTURE",
    "SPACE",
    "DAILY",
    "FASHION",
    "MEDIA",
    "TRAVEL",
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-col">
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
            onClick={() => {
              if (selectedTag) {
                addRecentSearch(selectedTag);
                onNext(selectedTag);
              }
            }}
          >
            다음
          </p>
        </header>
        <div
          className="mx-4 mb-4 flex h-12 items-center rounded-[5px] bg-gray-900"
          onBlur={() => {
            // onClick 이벤트가 먼저 실행되도록 지연
            setTimeout(() => setIsSearchOpen(false), 200);
          }}
        >
          <IconSearch className="mr-3 ml-4" />
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="B1 tracking-tight placeholder:text-[16px] placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onClick={() => setIsSearchOpen(true)}
          />
        </div>
      </div>
      {isSearchOpen && (
        <div className="mx-4 flex flex-col items-center">
          {searchTags.length > 0 && (
            <div className="flex w-full flex-col items-center gap-3 px-[10px]">
              {searchTags.map((tag) => (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <IconRectangleGray9 className="h-[32px] w-[32px]" />
                      <IconSearch className="absolute top-1/2 left-1/2 z-10 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 transform" />
                    </div>
                    <p
                      className="ST2 cursor-pointer text-gray-100"
                      onClick={() => {
                        addRecentSearch(tag);
                        onNext(tag);
                      }}
                    >
                      {highlightText(tag, searchInput)}
                    </p>
                  </div>
                  <IconArrowUpRight
                    className="cursor-pointer"
                    onClick={() => {
                      addRecentSearch(tag);
                      onNext(tag);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!isSearchOpen && (
        <>
          <div className="relative mx-4 mt-1 mb-4 flex items-center justify-between tracking-tight">
            <div className="absolute bottom-[0.5px] left-0 h-[0.5px] w-[215px] bg-gray-400" />
            <div className="flex">
              <button onClick={() => handleTabClick(0)} className="relative">
                <p
                  className={`${
                    activeIndex === 0 ? "ST2 text-gray-200" : "B1 text-gray-600"
                  } px-[22px] pb-[4px] transition`}
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
                  className={`${
                    activeIndex === 1 ? "ST2 text-gray-200" : "B1 text-gray-600"
                  } px-[22px] pb-[4px] transition`}
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
              className={`${
                activeIndex === 0 ? "opacity-100" : "opacity-0"
              } B2 cursor-pointer text-gray-600`}
              onClick={() => clearRecentSearches()}
            >
              전체 삭제
            </p>
          </div>
          <Swiper
            className="w-full flex-1"
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
              {recentSearches.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
                  <IconSearchGray5 className="h-12 w-12" />
                  <h4 className="H4 text-gray-600">최근 검색어가 없어요.</h4>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 px-4">
                  {recentSearches.map((tag) => (
                    <div
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-[5px] bg-gray-900 px-2 py-[3px]"
                      key={tag}
                    >
                      <p
                        className="ST1 cursor-pointer tracking-tight text-gray-200"
                        onClick={() => onNext(tag)}
                      >
                        #{tag}
                      </p>
                      <IconXbuttonQuickdropTag
                        className="w-[8px] cursor-pointer"
                        onClick={() => removeRecentSearch(tag)}
                      />
                    </div>
                  ))}
                </div>
              )}
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
                      <span className="ST1 invisible block">
                        {category[0] + category.slice(1).toLowerCase()}
                      </span>
                      <span
                        className={`absolute inset-0 flex items-center justify-center ${
                          selectedCategory === category ? "ST1" : "B0"
                        }`}
                      >
                        {category[0] + category.slice(1).toLowerCase()}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <>
                    <p className="ST1 mt-4 mb-3 text-gray-200">태그</p>
                    <div className="flex flex-wrap gap-2">
                      {!isPendingTags &&
                        tags.length > 0 &&
                        tags.map((tag) => (
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
        </>
      )}
    </div>
  );
};
