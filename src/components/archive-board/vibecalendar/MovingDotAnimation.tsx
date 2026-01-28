import drawingGuideMotion from "@/assets/animation/drawing_guide_motion.gif";

const MovingDotAnimation = () => {
  return (
    <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center">
      {/* 안내 텍스트 */}
      <div className="z-10 shrink-0 space-y-1 text-center select-none">
        <p className="H2 leading-[150%] text-black">
          손끝을 따라
          <br />
          천천히 쓸어보세요
        </p>
      </div>

      {/* GIF 애니메이션 */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center">
        <img
          src={drawingGuideMotion}
          alt="Drawing guide animation"
          className="relative z-10 h-full w-full object-contain mix-blend-screen invert"
        />
      </div>
    </div>
  );
};

export default MovingDotAnimation;
