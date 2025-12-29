import { X } from "lucide-react";
import Onboarding1_bg from "@/assets/images/img_onboarding1_bg.svg";
import Onboarding2 from "@/assets/images/img_onboarding2.svg";
import Onboarding2_frame_1 from "@/assets/images/img_onboarding2_frame_1.svg";
import Onboarding2_frame_2 from "@/assets/images/img_onboarding2_frame_2.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Onboarding1_frame_1 from "@/assets/images/img_onboarding1_frame_1.png";
import Onboarding3_frame_1 from "@/assets/images/img_onboarding3_frame_1.svg";
import Onboarding3_text from "@/assets/images/img_onboarding3_text.svg";
import { useState } from "react";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/pagination";

export const OnboardingPage = () => {
  const [isLast, setIsLast] = useState(false);
  const navigate = useNavigate();
  return (
    <main className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* 닫기 버튼 */}
      <div className="flex justify-end w-full px-10 py-3">
        <X
          className="cursor-pointer text-gray-600"
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
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          const isAtEnd = swiper.activeIndex === 2;
          setIsLast(isAtEnd);
          if (isAtEnd) {
            swiper.allowSlidePrev = false;
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
            <img
              src={Onboarding1_bg}
              className="absolute top-42 right-0 w-full blur-[1px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
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
          <div className="px-12 my-4">
            <h1 className="H0 text-white mb-2">Your vibe, archived.</h1>
            <p className="ST2 text-gray-300">드롭한 이미지들이 보드에 쌓여</p>
            <p className="ST2 text-gray-300">나만의 톤과 흐름이 됩니다.</p>
          </div>
          <div className="relative flex-1 flex justify-center">
            <img src={Onboarding3_frame_1} className="absolute top-0" />
            <h1 className="absolute top-80 scale-[1.3] text-white H1">
              Vibers
            </h1>
            <button
              onClick={() => navigate("/login")}
              className="absolute cursor-pointer top-94 bg-white px-10 py-3 rounded-[10px] scale-120 drop-shadow-[0_0_8px_rgba(250,250,250,0.4)] border border-gray-500"
            >
              <img src={Onboarding3_text} />
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        className={`onboarding-pagination absolute bottom-0 w-full flex justify-center gap-2 pb-[env(safe-area-inset-bottom)] z-50 ${
          isLast ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
    </main>
  );
};
