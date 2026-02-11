import drawingGuideMotionApng from "@/assets/animation/drawing_guide_motion.png";

const MovingDotAnimation = () => {
  return (
    <div className="pointer-events-none relative h-full w-full">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          src={drawingGuideMotionApng}
          alt="drawing guide animation"
          className="mx-auto h-auto w-[90vw] max-w-[361px] object-contain"
        />
      </div>

      <div className="absolute top-15 left-1/2 z-20 -translate-x-1/2 text-center whitespace-nowrap select-none">
        <p className="H2 mb-0 leading-[150%] text-black">손끝을 따라</p>
        <p className="H2 leading-[150%] text-black">천천히 쓸어보세요</p>
      </div>
    </div>
  );
};

export default MovingDotAnimation;
