import IconOriginal from "@/assets/icons/icon_original.svg?react";
import IconOriginalActive from "@/assets/icons/icon_original_active.svg?react";
import IconFixedratio from "@/assets/icons/icon_fixedratio.svg?react";
import IconFixedratioActive from "@/assets/icons/icon_fixedratio_active.svg?react";
import { useState } from "react";

interface CropToolbarProps {
  onReset: () => void;
}

export const CropToolbar = ({ onReset }: CropToolbarProps) => {
  // const cropTools = [
  //   {
  //     id: "original",
  //     icon: IconOriginal,
  //     activeIcon: IconOriginalActive,
  //     label: "원본",
  //   },
  //   {
  //     id: "fixedratio",
  //     icon: IconFixedratio,
  //     activeIcon: IconFixedratioActive,
  //     label: "3:4",
  //   },
  // ];

  const [activeCropTool, setActiveCropTool] = useState("original");

  return (
    <div className="z-10 flex flex-col pb-11">
      <div className="relative flex h-[15px] items-center justify-center opacity-0" />
      <div className="scrollbar-hide flex items-center justify-center gap-5 overflow-x-auto pt-[21px]">
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
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
          <div className={`h-[8px] w-[8px] rounded-full bg-white`} />
        </div>
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
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
          <div className={`h-[8px] w-[8px] rounded-full bg-white`} />
        </div>
      </div>
    </div>
  );
};
