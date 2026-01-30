import XbuttonIcon from "@/assets/icons/icon_onboarding_close.svg?react";
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
import Onboarding1_1 from "@/assets/images/img_onboarding1_1.svg";
import Onboarding1_2 from "@/assets/images/img_onboarding1_2.svg";
import Onboarding2_1 from "@/assets/images/img_onboarding2_1.svg";
import Onboarding3_1 from "@/assets/images/img_onboarding3_1.svg";
import Onboarding3_2 from "@/assets/images/img_onboarding3_2.svg";
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
              <p className="B1 tracking-tight text-gray-300 text-center">
                이미지를 드롭하고,
              <br/>
                태그로 지금의 감각을 기록하세요.
              </p>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img src={Onboarding1_1} className="absolute -top-7.5 z-10" />
            <img
              src={Onboarding1_2}
              className="absolute top-45 right-0 w-full [mask-image:linear-gradient(to_top,black_0%,transparent_100%)] blur-[1.3px]"
            />
          </div>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] mb-[45px] flex shrink-0 flex-col items-center gap-[3px]">
            <h1 className="H0 tracking-tight text-white">Find your tribe.</h1>
              <p className="B1 tracking-tight text-gray-300 text-center">
                말 없이도 통하는 감각.
              <br/>
                이미지로 이어지는 트라이브 챗
              </p>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img
              src={Onboarding2_1}
              className="absolute -top-1.5 translate-x-4"
            />
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] mb-[45px] flex shrink-0 flex-col items-center gap-[3px]">
            <h1 className="H0 tracking-tight text-white">Your vibe, archived.</h1>
              <p className="B1 tracking-tight text-gray-300 text-center">
                드롭한 이미지들이 보드에 쌓여
              <br/>
                나만의 톤과 흐름이 됩니다.
              </p>
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
            <img
              src={Onboarding3_1}
              className="absolute top-0 object-contain"
            />
            <img src={Onboarding3_2} className="absolute top-[250px]"/>
            <button
              onClick={() => navigate("/login")}
              className="absolute top-[416px] cursor-pointer rounded-[10px] border-[1px] border-gray-100/50 bg-white px-10 py-[5px] drop-shadow-[0_0_12px_rgba(250,250,250,0.6)]"
            >
              <p className="font-medium text-[20px] bg-[linear-gradient(to_right,black,rgba(0,0,0,0.5))] bg-clip-text text-transparent">Start Nuvibe</p>
            </button>
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
