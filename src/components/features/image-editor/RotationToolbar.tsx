import IconFlipActive from "@/assets/icons/icon_flip_active.svg?react";
import IconRotate from "@/assets/icons/icon_rotate.svg?react";

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
  return (
    <div className="flex flex-col z-10 pb-11">
      <div className="relative h-[15px] flex justify-center items-center opacity-0" />
      <div className="flex justify-center items-center gap-5 pt-[21px] overflow-x-auto scrollbar-hide">
        <div className={`flex flex-col gap-[10px] items-center ST2`}>
          <p className="text-[12px]">반전</p>
          <button
            key="flip"
            onClick={() => {
              onFlipChange(!isFlipped);
            }}
            className="w-[54px] h-[54px]"
          >
            {isFlipped ? <IconFlipActive /> : <IconFlipActive />}
          </button>
          <div
            className={`w-[8px] h-[8px] rounded-full ${
              isFlipped ? "bg-white" : "opacity-0"
            }`}
          />
        </div>
        <div className={`flex flex-col gap-[10px] items-center ST2`}>
          <p className="text-[12px]">회전</p>
          <button
            key="rotate"
            onClick={() => {
              // 시계 반대 방향으로 90도 회전
              onRotationChange((rotation - 90) % 360);
            }}
            className="w-[54px] h-[54px]"
          >
            {rotation === 0 ? <IconRotate /> : <IconRotate />}
          </button>
          <div
            className={`w-[8px] h-[8px] rounded-full ${
              rotation !== 0 ? "bg-white" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
