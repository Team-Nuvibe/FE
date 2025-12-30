import XbuttonIcon from "@/assets/icons/icon_xbutton.svg?react";
import Onboarding1_bg from "@/assets/images/img_onboarding1_bg.svg";
import Onboarding2 from "@/assets/images/img_onboarding2.svg";
import Onboarding2_frame_1 from "@/assets/images/img_onboarding2_frame_1.svg";
import Onboarding2_frame_2 from "@/assets/images/img_onboarding2_frame_2.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Onboarding1_frame_1 from "@/assets/images/img_onboarding1_frame_1.png";
import Onboarding3_frame from "@/assets/images/img_onboarding3_frame.png";
import Onboarding3_text from "@/assets/images/img_onboarding3_text.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <main className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* 닫기 버튼 - 인덱스가 2가 아닐 때만 (세번째 슬라이드가 아닐 때) 버튼 렌더링 */}
      <div className="flex justify-end w-full px-4 py-2">
        <XbuttonIcon
          /* 인덱스가 2일 때 투명도를 0으로 만들고 클릭을 막아 공간이 그대로 유지되도록 함 */
          className={`cursor-pointer text-gray-600 transition-opacity duration-300
          ${
            activeIndex === 2 ? "opacity-0 pointer-events-none" : "opacity-100"
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
              className="absolute scale-80 z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[11%]"
            />
            <img
              src={Onboarding1_bg}
              className="absolute top-45 right-0 w-full blur-[1px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
            />
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
            <img
              src={Onboarding2}
              className="absolute top-1/2 left-1/2 -translate-x-1/2"
            />
            <img
              src={Onboarding2_frame_1}
              className="absolute top-1/2 left-1/2 -translate-x-[85%] -translate-y-[-960%] z-10"
            />
            <img
              src={Onboarding2_frame_2}
              className="absolute top-1/2 left-1/2 -translate-x-[95%] -translate-y-[-1200%] z-10"
            />
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide className="flex flex-col w-full ">
          <div className="px-12 my-4 shrink-0">
            <h1 className="H0 text-white mb-2">Your vibe, archived.</h1>
            <p className="ST2 text-gray-300">드롭한 이미지들이 보드에 쌓여</p>
            <p className="ST2 text-gray-300">나만의 톤과 흐름이 됩니다.</p>
          </div>
          <div className="relative flex-1 flex flex-col justify-center items-center gap-10">
            <img
              src={Onboarding3_frame}
              className="w-[75%] object-contain max-h-[50vh] -translate-y-[-10%]"
            />
            <div className="flex flex-col items-center gap-6 z-10">
              <h1 className="scale-[1.2] text-white H1 -translate-y-2">
                Vibers
              </h1>
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer bg-white px-10 py-3 rounded-[10px] scale-100 drop-shadow-[0_0_8px_rgba(250,250,250,0.4)] border border-gray-500"
              >
                <img src={Onboarding3_text} />
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        className={
          "onboarding-pagination absolute bottom-0 w-full flex justify-center gap-2 pb-[env(safe-area-inset-bottom)] z-50"
        }
      />
    </main>
  );
};
