import React, { useEffect, useRef, useState } from "react";
import Img_3 from "@/assets/images/img_3.png";
import Icon_shortcut_quickdrop from "@/assets/icons/icon_shortcut_quickdrop.svg?react";
import Icon_plus from "@/assets/icons/icon_plus.svg?react";
import Icon_notification from "@/assets/icons/icon_notification.svg?react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useGetAllCategoriesTags from "@/hooks/queries/useGetAllCategoriesTags";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigate = useNavigate();

  const { categories, categoryQueries } = useGetAllCategoriesTags();

  const isLoading = categoryQueries.some((query) => query.isLoading);
  const isSuccess = categoryQueries.every((query) => query.isSuccess);

  useEffect(() => {
    if (isSuccess && swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.updateAutoHeight(150);
    }
  }, [isSuccess]);

  const handleCategoryClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    scrollToTab(index);
  };

  const scrollToTab = (index: number) => {
    const container = tabsContainerRef.current;
    const tab = tabRefs.current[index];

    if (container && tab) {
      const scrollLeft =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("파일을 선택하지 않았습니다.");
      return;
    }
    console.log("Selected file:", file);
    navigate("/quickdrop", { state: { file } });
  };

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* 헤더 */}
      <header className="relative flex h-[50dvh] shrink-0 flex-col justify-between bg-cover bg-bottom bg-no-repeat">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-bottom bg-no-repeat object-cover"
          style={{
            backgroundImage: `url(${Img_3})`,
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
        <div className="z-10 flex justify-end p-6">
          <Icon_notification
            className="cursor-pointer"
            onClick={() => navigate("/notification")}
          />
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col">
            <div className="B0 z-10 px-4 tracking-tight text-gray-100">
              <p className="text-[24px] leading-4">Drop</p>
              <p className="text-[24px]">your vibe</p>
            </div>
            <div className="H1 z-10 px-4 pt-[10px] pb-4">
              <h1 className="inline-block bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-[28px] text-transparent">
                #Minimal
              </h1>
            </div>
          </div>
          <div className="relative z-10 mr-4 mb-9 cursor-pointer">
            <Icon_shortcut_quickdrop onClick={() => navigate("/quickdrop")} />
            <input
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept="image/*"
              ref={inputImageRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </header>
      {/* My Trace */}
      <section className="flex flex-col gap-4 px-4 pt-4 pb-4">
        <h2 className="H2 text-gray-200">나의 기록</h2>
        <div className="flex">
          <div className="flex h-[116px] w-[123px] cursor-pointer items-center justify-center rounded-[5px] border-1 border-dashed border-gray-800 bg-gray-900">
            <Icon_plus className="h-[16px]" />
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="flex flex-col pb-4">
        <div className="sticky top-0 z-40 bg-black pt-4 pb-4">
          <div className="relative mx-4">
            <div className="absolute bottom-[0.5px] left-0 h-[0.5px] w-full bg-gray-400" />
            <div
              ref={tabsContainerRef}
              className="scrollbar-hide flex gap-3 overflow-x-auto"
              style={{
                maskImage:
                  "linear-gradient(to right, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 90%, transparent 100%)",
              }}
            >
              {categories.map((category, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => handleCategoryClick(index)}
                  className={`relative flex shrink-0 cursor-pointer flex-col items-center pb-2 transition-colors`}
                >
                  <p
                    className={`ST2 transition-colors duration-200 ${
                      activeIndex === index
                        ? "B2 text-white"
                        : "B2 text-gray-400"
                    }`}
                  >
                    {"\u00A0" + category.name + "\u00A0"}
                  </p>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 z-10 h-[1.5px] w-full bg-white"
                      transition={{ stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className=""></div>
        <div className="mx-4"></div>

        <Swiper
          modules={[Scrollbar]}
          scrollbar={{
            hide: false,
            draggable: true,
            el: ".home-scrollbar",
          }}
          slidesPerView={1}
          spaceBetween={12}
          autoHeight={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            scrollToTab(swiper.activeIndex);
          }}
          className="w-full"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-2 gap-x-[10px] gap-y-[10px] px-[16px]">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex aspect-[177/236] w-full cursor-pointer items-end justify-center rounded-[5px]"
                    onClick={() =>
                      navigate(`/tag/${item.tag}`, {
                        state: { imageUrl: item.imageUrl },
                      })
                    }
                    // 임시로 태그 id 대신 이름 사용
                    style={{
                      backgroundImage: item.imageUrl
                        ? `url(${item.imageUrl})`
                        : "linear-gradient(135deg, #3A3A3A 0%, #1C1C1C 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="mb-[10px] flex h-[27px] w-[80px] items-center justify-center rounded-[5px] bg-gray-900 px-9">
                      <p className="ST2 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text py-3 text-transparent">
                        #{item.tag}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="pointer-events-none fixed bottom-0 left-0 z-50 h-[12dvh] w-full bg-gradient-to-b from-transparent to-[#121212]" />

      <div className="h-[calc(env(safe-area-inset-bottom)+12rem)] w-full shrink-0" />
    </div>
  );
};

export default HomePage;
