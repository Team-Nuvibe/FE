import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import CloseIcon from "@/assets/icons/icon_xbutton_24.svg?react";
import RefreshIcon from "@/assets/icons/icon_refreshbutton.svg?react";
import DownloadIcon from "@/assets/icons/icon_savebutton.svg?react";
import DropIcon from "@/assets/logos/Subtract.svg?react";

import MovingDotAnimation from "@/components/archive-board/vibecalendar/MovingDotAnimation";
import { useNavbarActions } from "@/hooks/useNavbarStore";

const LoadingSpinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
);

interface LocationState {
  imageUrl: string;
  tag: string;
}

// Blur Box ( 모바일 환경을 위함 )
const boxesForGauss = (sigma: number, n: number) => {
  const wIdeal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) wl--;
  const wu = wl + 2;

  const mIdeal =
    (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
  const m = Math.round(mIdeal);

  const sizes = [];
  for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
  return sizes;
};

const boxBlurH = (
  scl: Uint8ClampedArray,
  tcl: Uint8ClampedArray,
  w: number,
  h: number,
  r: number,
) => {
  const iarr = 1 / (r + r + 1);
  for (let i = 0; i < h; i++) {
    let ti = i * w,
      li = ti,
      ri = ti + r;
    const fv = [scl[ti * 4], scl[ti * 4 + 1], scl[ti * 4 + 2]];
    const lv = [
      scl[(ti + w - 1) * 4],
      scl[(ti + w - 1) * 4 + 1],
      scl[(ti + w - 1) * 4 + 2],
    ];
    const val = [(r + 1) * fv[0], (r + 1) * fv[1], (r + 1) * fv[2]];
    for (let j = 0; j < r; j++) {
      val[0] += scl[(ti + j) * 4];
      val[1] += scl[(ti + j) * 4 + 1];
      val[2] += scl[(ti + j) * 4 + 2];
    }
    for (let j = 0; j <= r; j++) {
      val[0] += scl[ri * 4] - fv[0];
      val[1] += scl[ri * 4 + 1] - fv[1];
      val[2] += scl[ri * 4 + 2] - fv[2];
      ri++;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti++;
    }
    for (let j = r + 1; j < w - r; j++) {
      val[0] += scl[ri * 4] - scl[li * 4];
      val[1] += scl[ri * 4 + 1] - scl[li * 4 + 1];
      val[2] += scl[ri * 4 + 2] - scl[li * 4 + 2];
      ri++;
      li++;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti++;
    }
    for (let j = w - r; j < w; j++) {
      val[0] += lv[0] - scl[li * 4];
      val[1] += lv[1] - scl[li * 4 + 1];
      val[2] += lv[2] - scl[li * 4 + 2];
      li++;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti++;
    }
  }
};

const boxBlurT = (
  scl: Uint8ClampedArray,
  tcl: Uint8ClampedArray,
  w: number,
  h: number,
  r: number,
) => {
  const iarr = 1 / (r + r + 1);
  for (let i = 0; i < w; i++) {
    let ti = i,
      li = ti,
      ri = ti + r * w;
    const fv = [scl[ti * 4], scl[ti * 4 + 1], scl[ti * 4 + 2]];
    const lv = [
      scl[(ti + w * (h - 1)) * 4],
      scl[(ti + w * (h - 1)) * 4 + 1],
      scl[(ti + w * (h - 1)) * 4 + 2],
    ];
    const val = [(r + 1) * fv[0], (r + 1) * fv[1], (r + 1) * fv[2]];
    for (let j = 0; j < r; j++) {
      val[0] += scl[(ti + j * w) * 4];
      val[1] += scl[(ti + j * w) * 4 + 1];
      val[2] += scl[(ti + j * w) * 4 + 2];
    }
    for (let j = 0; j <= r; j++) {
      val[0] += scl[ri * 4] - fv[0];
      val[1] += scl[ri * 4 + 1] - fv[1];
      val[2] += scl[ri * 4 + 2] - fv[2];
      ri += w;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti += w;
    }
    for (let j = r + 1; j < h - r; j++) {
      val[0] += scl[ri * 4] - scl[li * 4];
      val[1] += scl[ri * 4 + 1] - scl[li * 4 + 1];
      val[2] += scl[ri * 4 + 2] - scl[li * 4 + 2];
      li += w;
      ri += w;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti += w;
    }
    for (let j = h - r; j < h; j++) {
      val[0] += lv[0] - scl[li * 4];
      val[1] += lv[1] - scl[li * 4 + 1];
      val[2] += lv[2] - scl[li * 4 + 2];
      li += w;
      tcl[ti * 4] = Math.round(val[0] * iarr);
      tcl[ti * 4 + 1] = Math.round(val[1] * iarr);
      tcl[ti * 4 + 2] = Math.round(val[2] * iarr);
      ti += w;
    }
  }
};

const boxBlur = (
  scl: Uint8ClampedArray,
  tcl: Uint8ClampedArray,
  w: number,
  h: number,
  r: number,
) => {
  for (let i = 0; i < scl.length; i++) tcl[i] = scl[i];
  boxBlurH(tcl, scl, w, h, r);
  boxBlurT(scl, tcl, w, h, r);
};

const stackBlurCanvasRGB = (
  canvas: HTMLCanvasElement,
  top_x: number,
  top_y: number,
  width: number,
  height: number,
  radius: number,
) => {
  if (isNaN(radius) || radius < 1) return;
  radius |= 0;
  const context = canvas.getContext("2d");
  if (!context) return;
  let imageData;
  try {
    imageData = context.getImageData(top_x, top_y, width, height);
  } catch {
    return;
  }

  const boxes = boxesForGauss(radius, 3);
  const pixels = imageData.data;
  const temp1 = new Uint8ClampedArray(pixels);
  const temp2 = new Uint8ClampedArray(pixels);

  boxBlur(temp1, temp2, width, height, (boxes[0] - 1) / 2);
  boxBlur(temp2, temp1, width, height, (boxes[1] - 1) / 2);
  boxBlur(temp1, temp2, width, height, (boxes[2] - 1) / 2);

  imageData.data.set(temp2);
  context.putImageData(imageData, top_x, top_y);
};

const RevealImagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // State에서 데이터 가져오기, 없으면 기본값 사용 (리다이렉트)
  const imageUrl = state?.imageUrl || "";
  const tag = state?.tag || "#Vibe";

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

  useEffect(() => {
    if (!imageUrl) {
      navigate("/archive-board/vibecalendar", { replace: true });
    }
  }, [imageUrl, navigate]);

  const drawLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    // Force reload to avoid CORS issues from cached images
    img.src = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;

    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 2, 3);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bleed = 80;

      // Mobile compatibility: Use manual StackBlur for high quality smooth blur
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        // Downscale slightly for performance (0.5 is good balance of quality/speed)
        const scale = 0.5;
        tempCanvas.width = canvas.width * scale;
        tempCanvas.height = canvas.height * scale;

        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        // StackBlur
        // 40px blur
        const radius = Math.round(40 * scale);
        stackBlurCanvasRGB(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          radius,
        );

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw blurred image with bleed
        ctx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          -bleed,
          -bleed,
          canvas.width + bleed * 2,
          canvas.height + bleed * 2,
        );
      } else {
        // Fallback
        ctx.drawImage(
          img,
          -bleed,
          -bleed,
          canvas.width + bleed * 2,
          canvas.height + bleed * 2,
        );
      }

      // Color overlay #B9BDC2 with 20% opacity
      ctx.fillStyle = "rgba(185, 189, 194, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    img.onerror = () => {
      // 에러 처리
    };
  }, [imageUrl]);

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

  // 원본 이미지와 스크래치 캔버스를 합성하여 Blob으로 반환하는 공통 함수
  const getCompositeBlob = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

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

    return new Promise<Blob | null>((resolve) => {
      downloadCanvas.toBlob(resolve, "image/png");
    });
  };

  // Drop Vibe 버튼 클릭
  const handleDropVibe = () => {
    // 파일 선택 다이얼로그 열기
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        navigate("/quickdrop", {
          state: {
            file,
            tag: tag,
          },
        });
      }
    };

    fileInput.click();
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const blob = await getCompositeBlob();
      if (!blob) throw new Error("Blob creation failed");

      const currentCount = parseInt(
        localStorage.getItem("revealVibeCount") || "0",
        10,
      );
      const newCount = currentCount + 1;
      localStorage.setItem("revealVibeCount", newCount.toString());
      const fileName = `RevealVibe${newCount}.png`;

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
            선명해진 과거의 <br />#{tag}을 확인해보세요
          </p>
        </div>
        <div className="flex items-center gap-6 pt-6">
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

      {/* 하단 Drop Vibe 버튼 */}
      <div className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2">
        <button
          onClick={handleDropVibe}
          className="mx-auto flex h-12 w-[230px] items-center justify-center gap-2 rounded-[84px] border border-gray-600 bg-black/90 px-4.5 py-3 shadow-[0_0_8px_rgba(255,255,255,0.1)] backdrop-blur-[5px] transition-all hover:border-gray-500 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
        >
          <DropIcon className="h-5.25 w-5.25" />
          <span
            className="H4 bg-linear-to-r from-[#f7f7f7] from-[35.588%] to-[rgba(247,247,247,0.5)] to-100% bg-clip-text leading-[150%] tracking-[-0.4px] whitespace-nowrap"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            Drop Your Current Vibe
          </span>
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
