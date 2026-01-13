import React, { useRef, useState } from "react";
import Img_3 from "@/assets/images/Img_3.png";
import Icon_shortcut_quickdrop from "@/assets/icons/icon_shortcut_quickdrop.svg?react";
import Icon_plus from "@/assets/icons/icon_plus.svg?react";
import Icon_notification from "@/assets/icons/icon_notification.svg?react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigate = useNavigate();

  const categories = [
    {
      name: "Mood",
      items: ["blur", "grain", "blur", "grain", "blur", "grain"],
    },
    { name: "Light", items: ["el1", "el2", "el3"] },
    { name: "Color", items: ["el1", "el2", "el3"] },
    { name: "Texture", items: ["el1", "el2", "el3"] },
    { name: "Object", items: ["el1", "el2", "el3"] },
    { name: "Daily", items: ["el1", "el2", "el3"] },
    { name: "Fashion", items: ["el1", "el2", "el3"] },
    { name: "Media", items: ["el1", "el2", "el3"] },
  ];

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
    <div className="flex flex-col w-full min-h-full">
      {/* 헤더 */}
      <header className="relative flex flex-col justify-between h-[50dvh] bg-cover bg-bottom bg-no-repeat shrink-0">
        <div
          className="absolute inset-0 w-full h-full object-cover bg-bottom bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${Img_3})`,
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
        <div className="flex justify-end p-6 z-10">
          <Icon_notification
            className="cursor-pointer"
            onClick={() => navigate("/notification")}
          />
        </div>
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col">
            <div className="B0 text-gray-100 px-4 z-10 tracking-tight">
              <p className="text-[24px] leading-4">Drop</p>
              <p className="text-[24px]">your vibe</p>
            </div>
            <div className="H1 pb-4 px-4 z-10">
              <h1 className="inline-block text-[28px] bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-transparent">
                #Minimal
              </h1>
            </div>
          </div>
          <div className="z-10 mr-4 mb-9 cursor-pointer">
            <Icon_shortcut_quickdrop onClick={() => navigate("/quickdrop")} />
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              ref={inputImageRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </header>
      {/* My Trace */}
      <section className="flex flex-col px-4 pt-4 pb-4 gap-4">
        <h2 className="H2 text-gray-200">나의 기록</h2>
        <div className="flex">
          <div className="w-[123px] h-[116px] bg-gray-900 rounded-[5px] flex justify-center items-center cursor-pointer border-dashed border-1 border-gray-800">
            <Icon_plus className="h-[16px]" />
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="flex flex-col pb-4">
        <div className="sticky top-0 z-40 bg-black pt-4 pb-4">
          <div className="relative mx-4">
            <div className="absolute bottom-[0.5px] left-0 w-full h-[0.5px] bg-gray-400" />
            <div
              ref={tabsContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide"
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
                  className={`relative flex flex-col items-center shrink-0 transition-colors cursor-pointer pb-2`}
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
                      className="absolute bottom-0 w-full h-[1.5px] bg-white z-10"
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
          className="w-full mt-1"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-[16px]">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="w-full aspect-[177/236] bg-gray-400 rounded-[5px] flex justify-center items-end cursor-pointer"
                    onClick={() => navigate(`/tag/${item}`)}
                    // 임시로 태그 id 대신 이름 사용
                  >
                    <div className="flex justify-center items-center bg-gray-900 rounded-[5px] w-[80px] h-[27px] px-9 mb-[10px]">
                      <p className="py-3 ST2 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text text-transparent">
                        #{item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="fixed bottom-0 left-0 w-full h-[12dvh] bg-gradient-to-b from-transparent to-[#121212] pointer-events-none z-50" />

      <div className="h-[calc(env(safe-area-inset-bottom)+12rem)] w-full shrink-0" />
    </div>
  );
};

export default HomePage;
