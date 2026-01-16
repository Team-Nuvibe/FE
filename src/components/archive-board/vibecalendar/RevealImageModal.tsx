import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence 추가
import CloseIcon from '@/assets/icons/icon_xbutton_24.svg?react'
import RefreshIcon from '@/assets/icons/icon_refreshbutton.svg?react'
import DownloadIcon from '@/assets/icons/icon_savebutton.svg?react'

// [1] 고정으로 사용할 커버 이미지를 여기서 가져옵니다.
import defaultCoverImage from '@/assets/images/img_blur.svg'; 
import MovingDotAnimation from './MovingDotAnimation';

interface RevealImageModalProps {
  imageUrl: string; 
  tag: string;
  onClose: () => void;
}

const RevealImageModal: React.FC<RevealImageModalProps> = ({ 
  imageUrl,
  tag, 
  onClose 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // [추가] 가이드 표시 여부 상태
  const [showGuide, setShowGuide] = useState(true);

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const drawLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

      coverImg.width = canvas.width;
      coverImg.height = canvas.height;

      ctx.drawImage(coverImg, 0, 0, canvas.width, canvas.height);

      // [삭제됨] 기존 ctx.fillText 코드는 삭제했습니다. (GuideOverlay로 대체)
    };

  }, []); 

  useEffect(() => {
    drawLayer();
  }, [drawLayer]);


  // --- 지우개 및 이벤트 핸들러 로직 ---

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  };

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const radius = 35 * dpr; // 지우개 크기

    ctx.globalCompositeOperation = 'destination-out';
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
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
    e.preventDefault();
    
    // [수정] 터치가 시작되면 가이드를 숨김
    if (showGuide) setShowGuide(false);

    setIsDrawing(true);
    const pos = getPointerPos(e);
    lastPointRef.current = pos;
    erase(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPointerPos(e);
    if (lastPointRef.current) {
      eraseLine(lastPointRef.current.x, lastPointRef.current.y, pos.x, pos.y);
    }
    lastPointRef.current = pos;
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const handleReset = () => {
    drawLayer();
    // [수정] 리셋 시 가이드 다시 표시
    setShowGuide(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full bg-black text-white flex flex-col z-50"
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-[35.13px] flex items-center justify-between">
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center">
          <CloseIcon />
        </button>
      </div>
      
      {/* Title */}
      <div className="px-4 pb-6 flex justify-between items-start">
        <div>
          <p className="H2 text-gray-200">선명해진 과거의 <br />{tag}을 확인해보세요</p>
        </div>
        <div className="flex gap-3 items-center pt-6">
          <button onClick={handleReset}>
            <RefreshIcon />
          </button>
          <button>
            <DownloadIcon />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div className="flex px-4 pb-6 items-center justify-center">
        <div 
          ref={containerRef}
          className="relative w-full max-w-[390px] h-[481px] aspect-[3/4] rounded-[10px] overflow-hidden bg-white"
        >
          {/* 바닥 이미지 */}
          <img 
            src={imageUrl} 
            alt="reveal" 
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          
          {/* 커버 캔버스 */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none z-0" // z-0 명시
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                // pointer-events-none은 컴포넌트 내부에도 있지만, 안전을 위해 여기서도 줍니다.
                className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
              >
                <MovingDotAnimation />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-4 pb-6">
        <button 
          onClick={onClose}
          className="w-full h-[48px] bg-transparent border border-gray-700 rounded-[10px] flex items-center justify-center gap-2 ST1 text-gray-200"
        >
          Drop Your Current Vibe
        </button>
      </div>
    </motion.div>
  );
};

export default RevealImageModal;