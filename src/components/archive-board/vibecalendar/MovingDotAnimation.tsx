import { useEffect, useState, useRef } from "react";
import drawingGuideMotion from "@/assets/animation/drawing_guide_motion.webm";

const MovingDotAnimation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // 모바일에서는 Canvas 사용 안 함 (성능 이슈로 크래시 발생)
    if (isMobile) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const renderFrame = () => {
      if (video.paused || video.ended) return;

      // Canvas 크기를 비디오 크기에 맞춤
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // 비디오 프레임을 Canvas에 그림
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 픽셀 데이터 가져오기
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 픽셀별로 처리: 알파 채널이 있는 부분만 처리
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]; // 알파 채널

        if (alpha > 0) {
          // 투명하지 않은 픽셀만 처리 (애니메이션 부분)

          // 색상 반전 (invert)
          data[i] = 255 - data[i]; // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B

          // brightness & contrast 조정 (PC만)
          const brightness = 1.0;
          const contrast = 1.0;

          for (let j = 0; j < 3; j++) {
            // brightness
            data[i + j] = data[i + j] * brightness;
            // contrast
            data[i + j] = ((data[i + j] / 255 - 0.5) * contrast + 0.5) * 255;
            // 0-255 범위로 제한
            data[i + j] = Math.max(0, Math.min(255, data[i + j]));
          }
        } else {
          // 완전 투명한 픽셀은 그대로 유지 (알파=0)
          data[i + 3] = 0;
        }
      }

      // 수정된 픽셀 데이터를 다시 Canvas에 그림
      ctx.putImageData(imageData, 0, 0);

      // 다음 프레임 요청
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    // 비디오가 재생될 준비가 되면 렌더링 시작
    const handleCanPlay = () => {
      video.play();
      renderFrame();
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

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

      {/* Canvas 애니메이션 - 중앙에 절대 위치 */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={
          isMobile
            ? {
                background:
                  "radial-gradient(circle, rgba(17, 24, 39, 0.3), rgba(156, 163, 175, 0.3))",
              }
            : {}
        }
      >
        {isMobile ? (
          /* 모바일: 원래 비디오 방식 (경량) */
          <video
            src={drawingGuideMotion}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            className="mx-auto h-auto w-[90vw] max-w-[361px] object-contain"
            style={{
              filter: "invert(1) brightness(0.8) contrast(1.3)",
              opacity: 0.4,
              mixBlendMode: "multiply",
            }}
          />
        ) : (
          <>
            {/* PC: Canvas 렌더링 (알파 채널 제어) */}
            <video
              ref={videoRef}
              src={drawingGuideMotion}
              autoPlay
              loop
              muted
              playsInline
              style={{ display: "none" }}
            />

            <canvas
              ref={canvasRef}
              className="h-[481px] w-[361px] object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MovingDotAnimation;
