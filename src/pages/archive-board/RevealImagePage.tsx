import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import CloseIcon from "@/assets/icons/icon_xbutton_24.svg?react";
import RefreshIcon from "@/assets/icons/icon_refreshbutton.svg?react";
import DownloadIcon from "@/assets/icons/icon_savebutton.svg?react";

import defaultCoverImage from "@/assets/images/img_blur.svg";
import MovingDotAnimation from "@/components/archive-board/vibecalendar/MovingDotAnimation";
import { useNavbarActions } from "@/hooks/useNavbarStore";

const LoadingSpinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
);

interface LocationState {
  imageUrl: string;
  tag: string;
}

const RevealImagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // State에서 데이터 가져오기, 없으면 기본값 사용 (또는 리다이렉트)
  // const imageUrl = state?.imageUrl || "";
  // const tag = state?.tag || "#Vibe";

  // [MOCK DATA] State에서 데이터 가져오기, 없으면 mock 데이터 사용
  const imageUrl =
    state?.imageUrl ||
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop";
  const tag = state?.tag || "#Healing";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { setNavbarVisible } = useNavbarActions();

  // navbar 숨김
  useEffect(() => {
    setNavbarVisible(false);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  // [MOCK DATA] 테스트를 위해 리다이렉트 비활성화
  // useEffect(() => {
  //   if (!imageUrl) {
  //     navigate("/archive-board/vibecalendar", { replace: true });
  //   }
  // }, [imageUrl, navigate]);

  const drawLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const coverImg = new Image();
    coverImg.crossOrigin = "Anonymous";
    coverImg.src = defaultCoverImage;

    coverImg.onload = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 2, 3);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(coverImg, 0, 0, canvas.width, canvas.height);
    };
    coverImg.onerror = () => {
      // 에러 처리
    };
  }, []);

  useEffect(() => {
    drawLayer();
  }, [drawLayer]);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: (clientX - rect.left) * dpr, y: (clientY - rect.top) * dpr };
  };

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const radius = 35 * dpr;
    ctx.globalCompositeOperation = "destination-out";
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  const eraseLine = (x1: number, y1: number, x2: number, y2: number) => {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.max(Math.floor(distance / 5), 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      erase(x, y);
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (showGuide) setShowGuide(false);
    setIsDrawing(true);
    const pos = getPointerPos(e);
    lastPointRef.current = pos;
    erase(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!isDrawing) return;
    const pos = getPointerPos(e);
    if (lastPointRef.current) {
      eraseLine(lastPointRef.current.x, lastPointRef.current.y, pos.x, pos.y);
    }
    lastPointRef.current = pos;
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const handleReset = () => {
    drawLayer();
    setShowGuide(true);
  };

  const handleClose = () => {
    navigate(-1); // 뒤로가기
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    setIsDownloading(true);

    try {
      const downloadCanvas = document.createElement("canvas");
      const rect = container.getBoundingClientRect();
      const scale = 2;
      downloadCanvas.width = rect.width * scale;
      downloadCanvas.height = rect.height * scale;
      const ctx = downloadCanvas.getContext("2d");
      if (!ctx) throw new Error("Context failed");
      ctx.scale(scale, scale);

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      ctx.drawImage(canvas, 0, 0, rect.width, rect.height);

      const currentCount = parseInt(
        localStorage.getItem("revealVibeCount") || "0",
        10,
      );
      const newCount = currentCount + 1;
      localStorage.setItem("revealVibeCount", newCount.toString());
      const fileName = `RevealVibe${newCount}.png`;

      const blob = await new Promise<Blob | null>((resolve) => {
        downloadCanvas.toBlob(resolve, "image/png");
      });

      if (!blob) throw new Error("Blob creation failed");

      const file = new File([blob], fileName, { type: "image/png" });

      // Web Share API 사용
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
          });
          showToast("저장되었습니다");
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Share failed:", error);
          }
        }
      } else {
        // 네이티브 브라우저 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("다운로드 완료");
      }
    } catch (error) {
      console.error(error);
      showToast("오류가 발생했습니다");
    } finally {
      setIsDownloading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // imageUrl이 없으면 빈 화면 (리다이렉트 대기)
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex h-full w-full flex-col bg-black text-white">
      {/* 가이드 오버레이 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 z-40 bg-black/60"
          />
        )}
      </AnimatePresence>

      <div className="relative z-30 flex items-center justify-between px-4 pt-6 pb-[35.13px]">
        <button
          onClick={handleClose}
          className="flex h-6 w-6 items-center justify-center"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative z-30 flex items-start justify-between px-4 pb-6">
        <div>
          <p className="H2 text-gray-200">
            선명해진 과거의 <br />
            {tag}을 확인해보세요
          </p>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <button onClick={handleReset} disabled={isDownloading}>
            <RefreshIcon className={isDownloading ? "opacity-50" : ""} />
          </button>
          <button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <LoadingSpinner /> : <DownloadIcon />}
          </button>
        </div>
      </div>

      {/* 메인 캔버스 영역 */}
      <div className="relative z-50 flex items-center justify-center px-4 pb-6">
        <div
          ref={containerRef}
          className="relative aspect-[3/4] h-[481px] w-full max-w-[390px] overflow-hidden rounded-[10px] bg-white"
        >
          {/* 결과 이미지 */}
          <img
            src={imageUrl}
            alt="reveal"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* 스크래치 캔버스 */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer"
            style={{
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              touchAction: "none",
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />

          {/* 가이드 애니메이션 */}
          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
              >
                <MovingDotAnimation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 px-4 pb-6">
        <button
          onClick={handleClose}
          className="ST1 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border border-gray-700 bg-transparent text-gray-200"
        >
          Drop Your Current Vibe
        </button>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-gray-800/90 px-6 py-3 text-sm font-medium whitespace-nowrap text-white shadow-lg backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RevealImagePage;
