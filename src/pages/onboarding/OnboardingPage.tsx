import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import Onboarding1_2 from "@/assets/images/img_onboarding1_2.svg";
import Onboarding2_2 from "@/assets/images/img_onboarding2_2.svg?react";
import Onboarding2_3 from "@/assets/images/img_onboarding2_3.svg?react";
import Onboarding2_4 from "@/assets/images/img_onboarding2_4.svg?react";
import Onboarding3_1 from "@/assets/images/img_onboarding3_1.svg";
import Onboarding3_2 from "@/assets/images/img_onboarding3_2.svg";
import ImageRawTag from "@/assets/images/tag-default-images/011_raw.webp";
import ImageSilverTag from "@/assets/images/tag-default-images/035_silver.webp";
import IconChevronRightWhiteSquare from "@/assets/icons/icon_chevron_right_white_square.svg?react";
import LogoSubtract from "@/assets/logos/Subtract.svg";
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
            <p className="B1 text-center tracking-tight text-gray-300">
              이미지를 드롭하고,
              <br />
              태그로 지금의 감각을 기록하세요.
            </p>
          </div>
          <div className="relative mx-auto flex flex-1 items-center justify-center">
            {/* <img src={Onboarding1_1} className="absolute -top-7.5 z-10" />*/}
            <img
              src={Onboarding1_2}
              className="absolute top-45 right-0 w-full [mask-image:linear-gradient(to_top,black_0%,transparent_100%)] blur-[1.3px]"
            />
            <div className="relative h-[376px] w-[282px] overflow-hidden rounded-[15px] border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {/* 선명한 이미지 레이어 (상단) */}
              <div
                className="absolute inset-0 rounded-[15px]"
                style={{
                  backgroundImage: `url(${ImageRawTag})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* 블러 + 어두운 이미지 레이어 (하단) */}
              <div
                className="absolute inset-0 rounded-[15px]"
                style={{
                  backgroundImage: `url(${ImageRawTag})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(15px)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 50%, black 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 50%, black 100%)",
                }}
              />
              {/* 어두운 그라데이션 오버레이 */}
              <div
                className="absolute inset-0 rounded-[15px]"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              />
              <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-4">
                <div className="flex items-center">
                  <p className="text-[10px] font-normal tracking-tight text-white">
                    Model
                  </p>
                  <IconChevronRightWhiteSquare className="w-4" />
                </div>
                {/* TODO: 그라데이션 안되는 버그 픽스 */}
                <p className="ST0 mb-3 inline-block bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text leading-[150%] tracking-tight text-transparent">
                  #Raw
                </p>
                <p className="font-[Montserrat] text-[10px] font-light text-white italic">
                  2025. 11. 24
                  {"\u00A0\u00A0\u00A0"}|{"\u00A0\u00A0\u00A0"}09:41
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] mb-[45px] flex shrink-0 flex-col items-center gap-[3px]">
            <h1 className="H0 tracking-tight text-white">Find your tribe.</h1>
            <p className="B1 text-center tracking-tight text-gray-300">
              말 없이도 통하는 감각.
              <br />
              이미지로 이어지는 트라이브 챗을 경험하세요.
            </p>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            {/* <img
              src={Onboarding2_1}
              className="absolute -top-1.5 translate-x-4"
            /> */}
            <div className="flex gap-2">
              <div className="flex items-start gap-[11px]">
                {/* 프로필 이미지 */}
                <img
                  src={LogoSubtract}
                  alt="Viber"
                  className="h-[44px] w-[44px] shrink-0 rounded-full object-cover"
                />
                {/* 메시지 영역 */}
                <div className="flex flex-col items-start gap-1">
                  {/* 사용자 이름 */}
                  <span className="Label text-[#8F9297]">Viber</span>
                  {/* 이미지와 타임스탬프, 스크랩 버튼을 같은 줄에 배치 */}
                  <div className="flex items-center gap-2">
                    {/* 이미지 컨테이너 */}
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-end justify-end gap-1">
                        <div className="relative overflow-hidden rounded-[18px] bg-gray-800">
                          <img
                            src={ImageSilverTag}
                            alt="채팅 이미지"
                            className="h-auto w-full max-w-[253px] object-cover"
                          />
                        </div>
                      </div>
                      {/* 이모지 반응 */}
                      <div className="flex -translate-x-[5.5px]">
                        <Onboarding2_2 />
                        <Onboarding2_3 />
                        <Onboarding2_4 />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide className="flex w-full flex-col">
          <div className="mt-[40px] mb-[45px] flex shrink-0 flex-col items-center gap-[3px]">
            <h1 className="H0 tracking-tight text-white">
              Your vibe, archived.
            </h1>
            <p className="B1 text-center tracking-tight text-gray-300">
              드롭한 바이브를 보드에 쌓아
              <br />
              나만의 톤과 흐름을 만들어 보세요.
            </p>
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
            <img
              src={Onboarding3_1}
              className="absolute top-0 object-contain"
            />
            <img src={Onboarding3_2} className="absolute top-[250px]" />
            <button
              onClick={() => navigate("/login")}
              className="absolute top-[416px] cursor-pointer rounded-[10px] border-[1px] border-gray-100/50 bg-white px-10 py-[5px] drop-shadow-[0_0_12px_rgba(250,250,250,0.6)]"
            >
              <p className="bg-[linear-gradient(to_right,black,rgba(0,0,0,0.5))] bg-clip-text text-[20px] font-medium text-transparent">
                Start Nuvibe
              </p>
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
