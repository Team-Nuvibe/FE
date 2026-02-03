import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import { useState } from "react";

export const ScrapPage = () => {
  const [currentTag, setCurrentTag] = useState("latest");

  const myTags = ["Warm", "Blur", "Moody", "Minimal"];

  return (
    <div className="flex flex-col">
      <header className="relative mx-4 mt-2 mb-6 flex w-full items-center justify-center">
        <h2 className="H2 tracking-tight text-gray-200">스크랩 모아보기</h2>
        <button className="absolute left-0 h-6 w-6 cursor-pointer">
          <IconChevronLeft />
        </button>
      </header>
      <section className="mx-4 flex gap-2">
        <button
          className={`flex cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] ${currentTag === "latest" ? `bg-gray-200` : `bg-gray-900`}`}
          onClick={() => setCurrentTag("latest")}
        >
          <p
            className={`ST2 tracking-tight text-gray-900 ${currentTag === "latest" ? `text-gray-900` : `bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-transparent`}`}
          >
            최신순
          </p>
        </button>
        {myTags.map((tag) => (
          <button
            className={`flex cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] ${currentTag === tag ? `bg-gray-200` : `bg-gray-900`}`}
            onClick={() => setCurrentTag(tag)}
          >
            <p
              className={`ST2 tracking-tight text-gray-900 ${currentTag === tag ? `text-gray-900` : `bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-transparent`}`}
            >
              #{tag}
            </p>
          </button>
        ))}
      </section>
      <div className="mx-4 mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="B2 tracking-tight text-gray-500">2025.07.18</p>
          <div className="flex gap-2">
            <div className="aspect-[3/4] w-[114px] rounded-[5px] bg-gray-400"></div>
            <div className="aspect-[3/4] w-[114px] rounded-[5px] bg-gray-400"></div>
            <div className="aspect-[3/4] w-[114px] rounded-[5px] bg-gray-400"></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="B2 tracking-tight text-gray-500">2025.07.05</p>
          <div className="flex gap-2">
            <div className="aspect-[3/4] w-[114px] rounded-[5px] bg-gray-400"></div>
            <div className="aspect-[3/4] w-[114px] rounded-[5px] bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
