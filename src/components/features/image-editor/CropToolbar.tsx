import IconOriginal from "@/assets/icons/icon_original.svg?react";
import IconOriginalActive from "@/assets/icons/icon_original_active.svg?react";
import IconFixedratio from "@/assets/icons/icon_fixedratio.svg?react";
import IconFixedratioActive from "@/assets/icons/icon_fixedratio_active.svg?react";
import { useState } from "react";

interface CropToolbarProps {
  onReset: () => void;
}

export const CropToolbar = ({ onReset }: CropToolbarProps) => {
  const cropTools = [
    {
      id: "original",
      icon: IconOriginal,
      activeIcon: IconOriginalActive,
      label: "원본",
    },
    {
      id: "fixedratio",
      icon: IconFixedratio,
      activeIcon: IconFixedratioActive,
      label: "3:4",
    },
  ];

  const [activeCropTool, setActiveCropTool] = useState("original");

  return (
    <div className="flex flex-col z-10 pb-11">
      <div className="relative h-[15px] flex justify-center items-center opacity-0" />
      <div className="flex justify-center items-center gap-5 pt-[21px] overflow-x-auto scrollbar-hide">
        <div className={`flex flex-col gap-[10px] items-center ST2`}>
          <p className="text-[12px]">원본</p>
          <button
            key="original"
            onClick={() => {
              setActiveCropTool("original");
              onReset();
            }}
          >
            {activeCropTool === "original" ? (
              <IconOriginalActive />
            ) : (
              <IconOriginal />
            )}
          </button>
          <div className={`w-[8px] h-[8px] rounded-full bg-white`} />
        </div>
        <div className={`flex flex-col gap-[10px] items-center ST2`}>
          <p className="text-[12px]">3:4</p>
          <button
            key="fixedratio"
            onClick={() => setActiveCropTool("fixedratio")}
          >
            {activeCropTool === "fixedratio" ? (
              <IconFixedratioActive />
            ) : (
              <IconFixedratio />
            )}
          </button>
          <div className={`w-[8px] h-[8px] rounded-full bg-white`} />
        </div>
      </div>
    </div>
  );
};
