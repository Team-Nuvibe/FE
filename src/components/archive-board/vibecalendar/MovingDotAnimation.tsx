import { useEffect, useState } from "react";
import drawingGuideMotion from "@/assets/animation/drawing_guide_motion.webm";

const MovingDotAnimation = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="pointer-events-none relative h-full w-full">
      {/* 애니메이션 컨테이너 - 중앙 위치 */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <video
          src={drawingGuideMotion}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          className="mx-auto h-auto w-[90vw] max-w-[361px] object-contain"
          style={{
            filter: isMobile
              ? "invert(1) brightness(1) opacity(0.3)"
              : "invert(1) brightness(0.1)",
            mixBlendMode: isMobile ? "normal" : "multiply",
          }}
        />
      </div>

      {/* 안내 텍스트 - 애니메이션 위에 오버레이 (피그마 디자인) */}
      <div className="absolute top-15 left-1/2 z-20 -translate-x-1/2 text-center whitespace-nowrap select-none">
        <p className="H2 mb-0 leading-[150%] text-black">손끝을 따라</p>
        <p className="H2 leading-[150%] text-black">천천히 쓸어보세요</p>
      </div>
    </div>
  );
};

export default MovingDotAnimation;
