import React from "react";
import Img_3 from "@/assets/images/Img_3.png";
import Icon_shortcut_quickdrop from "@/assets/icons/icon_shortcut_quickdrop.svg?react";
import Icon_plus from "@/assets/icons/icon_plus.svg?react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full">
      {/* 헤더 */}
      <header className="relative flex flex-row justify-between items-end h-[55dvh] bg-cover bg-bottom bg-no-repeat">
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
        <div className="flex flex-col">
          <div className="B0 text-gray-100 px-6 z-10">
            <p className="text-[24px]">Drop</p>
            <p className="text-[24px]">your vibe</p>
          </div>
          <div className="H1 mb-6 px-6 z-10">
            <h1 className="inline-block text-[28px] bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-transparent">
              #Minimal
            </h1>
          </div>
        </div>
        <div className="z-10 mx-4 mb-9 cursor-pointer">
          <Icon_shortcut_quickdrop />
        </div>
      </header>
      {/* My Trace */}
      <section className="flex flex-col px-6 py-6 gap-4">
        <h2 className="H2 text-gray-200">MY trace</h2>
        <div className="flex">
          <div className="w-[123px] h-[116px] bg-gray-900 rounded-[5px] flex justify-center items-center cursor-pointer border-dashed border-1 border-gray-800">
            <Icon_plus className="h-[16px]" />
          </div>
        </div>
      </section>
      {/* Categories */}
      <section></section>
    </div>
  );
};

export default HomePage;
