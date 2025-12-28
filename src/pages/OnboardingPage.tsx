import { X } from "lucide-react";
import Onboarding1_bg from "../assets/images/img_onboarding1_bg.svg?react";
import Onboarding2 from "../assets/images/img_onboarding2.svg?react";
import Onboarding2_frame_1 from "../assets/images/img_onboarding2_frame_1.svg?react";
import Onboarding2_frame_2 from "../assets/images/img_onboarding2_frame_2.svg?react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Onboarding1_frame_1 from "../assets/images/img_onboarding1_frame_1.png";
import Onboarding3_frame_1 from "../assets/images/img_onboarding3_frame_1.svg?react";
import Onboarding3_frame from "../assets/images/img_onboarding3_frame.svg?react";
import Onboarding3_text from "../assets/images/img_onboarding3_text.svg?react";
import { useState } from "react";

export const OnboardingPage = () => {
  const [isLast, setIsLast] = useState(false);
  return (
    <main className="flex flex-col w-full h-dvh">
      {/* 닫기 버튼 */}
      <div className="flex justify-end w-full px-10 py-3">
        <X className="cursor-pointer text-gray-600" />
      </div>
      <Swiper
        className="w-full flex-1"
        modules={[Pagination]}
        pagination={{ el: ".onboarding-pagination", type: "bullets" }}
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          const isAtEnd = swiper.activeIndex === 2;
          setIsLast(isAtEnd);
          if (isAtEnd) {
            swiper.allowSlidePrev = true;
          } else {
            swiper.allowSlidePrev = true;
          }
        }}
      >
        {/* Slide 1 */}
        <SwiperSlide className="flex flex-col w-full">
          <div className="px-12 my-4 shrink-0">
            <h1 className="H0 text-white mb-2">Drop your vibe.</h1>
            <p className="ST2 text-gray-300">이미지를 드롭하고,</p>
            <p className="ST2 text-gray-300">
              태그로 지금의 감각을 기록하세요.
            </p>
          </div>
          <div className="relative flex-1 flex justify-center items-center">
            <img
              src={Onboarding1_frame_1}
              alt=""
              className="absolute scale-70 z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[15%]"
            />
            <Onboarding1_bg className="absolute top-42 right-0 w-full blur-[1px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]" />
          </div>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide className="flex flex-col w-full">
          <div className="px-12 my-4 shrink-0">
            <h1 className="H0 text-white mb-2">Find your tribe.</h1>
            <p className="ST2 text-gray-300">말 없이도 통하는 감각.</p>
            <p className="ST2 text-gray-300">이미지로 이어지는 트라이브 챗</p>
          </div>
          <div className="relative flex-1 flex justify-center items-center">
            <Onboarding2 className="absolute top-1/2 left-1/2 -translate-x-1/2" />
            <Onboarding2_frame_1 className="absolute top-1/2 left-1/2 -translate-x-[85%] -translate-y-[-960%]" />
            <Onboarding2_frame_2 className="absolute top-1/2 left-1/2 -translate-x-[95%] -translate-y-[-1200%]" />
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide className="flex flex-col w-full ">
          <div className="px-12 my-4">
            <h1 className="H0 text-white mb-2">Your vibe, archived.</h1>
            <p className="ST2 text-gray-300">드롭한 이미지들이 보드에 쌓여</p>
            <p className="ST2 text-gray-300">나만의 톤과 흐름이 됩니다.</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            <Onboarding3_frame_1 className="absolute top-0" />
            <h1 className="absolute top-80 scale-[1.3] text-white H1">
              Vibers
            </h1>
            <button className="absolute cursor-pointer top-94 bg-white px-10 py-3 rounded-[10px] scale-120 drop-shadow-[0_0_8px_rgba(250,250,250,0.4)] border border-gray-500">
              <Onboarding3_text />
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        className={`onboarding-pagination flex justify-center gap-2 py-5 ${
          isLast ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      ></div>
    </main>
  );
};
