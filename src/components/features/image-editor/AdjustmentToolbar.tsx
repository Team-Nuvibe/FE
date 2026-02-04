import { useState } from "react";
import IconBrightness from "@/assets/icons/icon_brightness.svg?react";
import IconBrightnessActive from "@/assets/icons/icon_brightness_active.svg?react";
import IconContrast from "@/assets/icons/icon_contrast.svg?react";
import IconContrastActive from "@/assets/icons/icon_contrast_active.svg?react";
import IconSaturation from "@/assets/icons/icon_saturation.svg?react";
import IconSaturationActive from "@/assets/icons/icon_saturation_active.svg?react";
import IconStructure from "@/assets/icons/icon_structure.svg?react";
import IconStructureActive from "@/assets/icons/icon_structure_active.svg?react";
import IconTemperature from "@/assets/icons/icon_temperature.svg?react";
import IconTemperatureActive from "@/assets/icons/icon_temperature_active.svg?react";
import IconExposure from "@/assets/icons/icon_exposure.svg?react";
import IconExposureActive from "@/assets/icons/icon_exposure_active.svg?react";

interface AdjustmentToolbarProps {
  levels: {
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  };
  onChange: (newLevels: {
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  }) => void;
}

export const AdjustmentToolbar = ({
  levels,
  onChange,
}: AdjustmentToolbarProps) => {
  const [activeAdjustmentTool, setActiveAdjustmentTool] =
    useState<keyof typeof levels>("brightness");

  const adjustmentTools: {
    id: keyof typeof levels;
    icon: React.ComponentType;
    activeIcon: React.ComponentType;
    label: string;
  }[] = [
    {
      id: "brightness",
      icon: IconBrightness,
      activeIcon: IconBrightnessActive,
      label: "밝기",
    },
    {
      id: "exposure",
      icon: IconExposure,
      activeIcon: IconExposureActive,
      label: "노출",
    },
    {
      id: "contrast",
      icon: IconContrast,
      activeIcon: IconContrastActive,
      label: "대비",
    },
    {
      id: "structure",
      icon: IconStructure,
      activeIcon: IconStructureActive,
      label: "구조",
    },
    {
      id: "temperature",
      icon: IconTemperature,
      activeIcon: IconTemperatureActive,
      label: "온도",
    },
    {
      id: "saturation",
      icon: IconSaturation,
      activeIcon: IconSaturationActive,
      label: "채도",
    },
  ];

  return (
    <div className="z-10 flex flex-col pb-11">
      <div className="relative flex h-[15px] items-center justify-center">
        <input
          type="range"
          min={-50}
          max={50}
          value={levels[activeAdjustmentTool as keyof typeof levels]}
          onChange={(e) =>
            onChange({
              ...levels,
              [activeAdjustmentTool]: Number(e.target.value),
            })
          }
          className="z-10 h-[1px] w-[345px] cursor-pointer appearance-none rounded-[10px] bg-gray-700 accent-white [&::-moz-range-thumb]:h-[15px] [&::-moz-range-thumb]:w-[15px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-100 [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-100"
        />
        <div className="absolute top-[4.5px] h-[6px] w-[6px] rounded-full bg-gray-700" />
      </div>
      <div className="scrollbar-hide flex gap-5 overflow-x-auto pt-[21px]">
        {adjustmentTools.map((tool) => (
          <div
            className={`ST2 flex flex-col items-center gap-[10px] ${
              tool.id === "brightness" && `pl-6`
            } ${tool.id === "saturation" && `pr-6`}`}
          >
            <p className="text-[12px]">{tool.label}</p>
            <button
              key={tool.id}
              onClick={() => setActiveAdjustmentTool(tool.id)}
            >
              {activeAdjustmentTool === tool.id ? (
                <tool.activeIcon />
              ) : (
                <tool.icon />
              )}
            </button>
            {activeAdjustmentTool !== tool.id && (
              <div className="flex h-[18px] items-center justify-center">
                <div
                  className={`h-[8px] w-[8px] rounded-full ${levels[tool.id as keyof typeof levels] === 0 ? `opacity-0` : `bg-white`}`}
                />
              </div>
            )}
            {activeAdjustmentTool === tool.id && (
              <p className="text-[12px] font-medium tracking-tight text-white">
                {levels[tool.id as keyof typeof levels] !== 0 &&
                  levels[tool.id as keyof typeof levels]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
