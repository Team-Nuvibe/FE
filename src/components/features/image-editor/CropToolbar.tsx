import IconOriginal from "@/assets/icons/icon_original.svg?react";
import IconOriginalActive from "@/assets/icons/icon_original_active.svg?react";
import IconFixedratio from "@/assets/icons/icon_fixedratio.svg?react";
import IconFixedratioActive from "@/assets/icons/icon_fixedratio_active.svg?react";

interface CropToolbarProps {
  cropMode: "original" | "fixedratio";
  onModeChange: (mode: "original" | "fixedratio") => void;
  onColorChange: (color: number) => void;
}

export const CropToolbar = ({
  cropMode,
  onModeChange,
  onColorChange,
}: CropToolbarProps) => {
  return (
    <div className="z-10 flex flex-col pb-11">
      <div className="relative flex h-[15px] items-center justify-center">
        <input
          type="range"
          min={0}
          max={255}
          className="z-10 h-[4.8px] w-[321px] cursor-pointer appearance-none rounded-[10px] bg-gradient-to-r from-[#FAFAFA] to-[var(--gray-900,#212224)] accent-white [&::-moz-range-thumb]:h-[15px] [&::-moz-range-thumb]:w-[15px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-100 [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-100"
          onChange={(e) => onColorChange(255 - Number(e.target.value))}
        />
      </div>
      <div className="scrollbar-hide flex items-center justify-center gap-5 overflow-x-auto pt-[21px]">
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
          <p className="text-[12px]">전체</p>
          <button
            key="original"
            onClick={() => {
              onModeChange("original");
            }}
          >
            {cropMode === "original" ? (
              <IconOriginalActive />
            ) : (
              <IconOriginal />
            )}
          </button>
          <div className="flex h-[18px] items-center justify-center">
            <div className={`h-[8px] w-[8px] rounded-full bg-white`} />
          </div>
        </div>
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
          <p className="text-[12px]">3:4</p>
          <button key="fixedratio" onClick={() => onModeChange("fixedratio")}>
            {cropMode === "fixedratio" ? (
              <IconFixedratioActive />
            ) : (
              <IconFixedratio />
            )}
          </button>
          <div className="flex h-[18px] items-center justify-center">
            <div className={`h-[8px] w-[8px] rounded-full bg-white`} />
          </div>
        </div>
      </div>
    </div>
  );
};
