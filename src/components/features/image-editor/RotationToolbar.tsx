import IconFlip from "@/assets/icons/icon_flip.svg?react";
import IconFlipActive from "@/assets/icons/icon_flip_active.svg?react";
import IconRotate from "@/assets/icons/icon_rotate.svg?react";
import IconRotateActive from "@/assets/icons/icon_rotate_active.svg?react";
import { useState } from "react";

interface RotationToolbarProps {
  rotation: number;
  isFlipped: boolean;
  onRotationChange: (angle: number) => void;
  onFlipChange: (isFlipped: boolean) => void;
}

export const RotationToolbar = ({
  rotation,
  isFlipped,
  onRotationChange,
  onFlipChange,
}: RotationToolbarProps) => {
  const [activeRotationTool, setActiveRotationTool] = useState<string>("");
  return (
    <div className="z-10 flex flex-col pb-11">
      <div className="relative flex h-[15px] items-center justify-center opacity-0" />
      <div className="scrollbar-hide flex items-center justify-center gap-5 overflow-x-auto pt-[21px]">
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
          <p className="text-[12px]">반전</p>
          <button
            key="flip"
            onClick={() => {
              onFlipChange(!isFlipped);
              setActiveRotationTool("flip");
            }}
            className="h-[54px] w-[54px]"
          >
            {activeRotationTool === "flip" ? <IconFlipActive /> : <IconFlip />}
          </button>
          <div className="flex h-[18px] items-center justify-center">
            <div
              className={`h-[8px] w-[8px] rounded-full ${isFlipped && activeRotationTool === "rotate" ? "bg-white" : "opacity-0"}`}
            />
          </div>
        </div>
        <div className={`ST2 flex flex-col items-center gap-[10px]`}>
          <p className="text-[12px]">회전</p>
          <button
            key="rotate"
            onClick={() => {
              // 시계 반대 방향으로 90도 회전
              onRotationChange((rotation - 90) % 360);
              setActiveRotationTool("rotate");
            }}
            className="h-[54px] w-[54px]"
          >
            {activeRotationTool === "rotate" ? (
              <IconRotateActive />
            ) : (
              <IconRotate />
            )}
          </button>
          <div className="flex h-[18px] items-center justify-center">
            <div
              className={`h-[8px] w-[8px] rounded-full ${rotation !== 0 && activeRotationTool === "flip" ? "bg-white" : "opacity-0"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
