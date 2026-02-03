import drawingGuideMotion from "@/assets/animation/drawing_guide_motion.webm";

const MovingDotAnimation = () => {
  return (
    <div className="pointer-events-none relative h-full w-full">
      {/* 안내 텍스트 - 상단에 절대 위치 */}
      <div className="absolute top-12 left-1/2 z-10 -translate-x-1/2 space-y-1 text-center select-none">
        <p className="H2 leading-[150%] text-black">
          손끝을 따라
          <br />
          천천히 쓸어보세요
        </p>
      </div>

      {/* WEBM 비디오 애니메이션 - 중앙에 절대 위치 */}
      <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2">
        <video
          src={drawingGuideMotion}
          autoPlay
          loop
          muted
          playsInline
          className="h-[481px] w-[361px] object-contain mix-blend-screen invert"
        />
      </div>
    </div>
  );
};

export default MovingDotAnimation;
