import Onboarding1_bg from "@/assets/images/img_onboarding1_bg.svg";
import Onboarding2 from "@/assets/images/img_onboarding2.svg";
import Onboarding2_frame_1 from "@/assets/images/img_onboarding2_frame_1.svg";
import Onboarding2_frame_2 from "@/assets/images/img_onboarding2_frame_2.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Onboarding1_frame_1 from "@/assets/images/img_onboarding1_frame_1.png";
import Onboarding3_frame from "@/assets/images/img_onboarding3_frame.png";
import Onboarding3_text from "@/assets/images/img_onboarding3_text.svg";
import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <div className="mt-2 flex w-full px-[30px]">
        <IconXbuttonGray3
          /* 인덱스가 2일 때 투명도를 0으로 만들고 클릭을 막아 공간이 그대로 유지되도록 함 */
          className={`cursor-pointer text-gray-600 transition-opacity duration-300 ${
            activeIndex === 2 ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onClick={() => navigate("/login")}
        />
      </div>
      <Swiper
        className="w-full flex-1"
        modules={[Pagination]}
        pagination={{
          el: ".onboarding-pagination",
          type: "bullets",
          clickable: true,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        spaceBetween={0}
        slidesPerView={1}
      >
        {/* Slide 1 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] mb-[45px] flex shrink-0 flex-col items-center gap-[3px]">
            <h1 className="H0 tracking-tight text-white">Drop your vibe.</h1>
            <div className="flex flex-col items-center">
              <p className="ST2 tracking-tight text-gray-300">
                이미지를 드롭하고,
              </p>
              <p className="ST2 tracking-tight text-gray-300">
                태그로 지금의 감각을 기록하세요.
              </p>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img
              src={Onboarding1_frame_1}
              alt=""
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-[11%] scale-80"
            />
            <img
              src={Onboarding1_bg}
              className="absolute top-45 right-0 w-full [mask-image:linear-gradient(to_top,black_0%,transparent_100%)] blur-[1px]"
            />
          </div>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] shrink-0 px-12">
            <h1 className="H0 mb-2 text-white">Find your tribe.</h1>
            <p className="ST2 text-gray-300">말 없이도 통하는 감각.</p>
            <p className="ST2 text-gray-300">이미지로 이어지는 트라이브 챗</p>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img
              src={Onboarding2}
              className="absolute top-1/2 left-1/2 -translate-x-1/2"
            />
            <img
              src={Onboarding2_frame_1}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-[85%] -translate-y-[-960%]"
            />
            <img
              src={Onboarding2_frame_2}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-[95%] -translate-y-[-1200%]"
            />
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] shrink-0 px-12">
            <h1 className="H0 mb-2 text-white">Your vibe, archived.</h1>
            <p className="ST2 text-gray-300">드롭한 이미지들이 보드에 쌓여</p>
            <p className="ST2 text-gray-300">나만의 톤과 흐름이 됩니다.</p>
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
            <img
              src={Onboarding3_frame}
              className="max-h-[50vh] w-[75%] -translate-y-[-10%] object-contain"
            />
            <div className="z-10 flex flex-col items-center gap-6">
              <h1 className="H1 -translate-y-2 scale-[1.2] text-white">
                Vibers
              </h1>
              <button
                onClick={() => navigate("/login")}
                className="scale-100 cursor-pointer rounded-[10px] border border-gray-500 bg-white px-10 py-3 drop-shadow-[0_0_8px_rgba(250,250,250,0.4)]"
              >
                <img src={Onboarding3_text} />
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        className={
          "onboarding-pagination absolute !bottom-16 z-50 flex w-full justify-center gap-2 pb-[env(safe-area-inset-bottom)]"
        }
      />
    </main>
  );
};
