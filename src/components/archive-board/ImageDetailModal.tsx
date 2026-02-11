import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Xbutton24 from "@/assets/icons/icon_xbutton_24.svg?react";
import Downloadbutton from "@/assets/icons/icon_imagesave.svg?react";
import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg?react";

interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}

interface ImageDetailModalProps {
  item: ModelItem;
  onClose: () => void;
  boardTitle?: string;
  createdAt?: string;
}

export const ImageDetailModal = ({
  item,
  onClose,
  boardTitle = "Model",
  createdAt,
}: ImageDetailModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // 1. 이미지 프리로딩 (보여주기용)
  useEffect(() => {
    if (!item.thumbnail) return;

    // 새로운 이미지 로드 시작 시 기존 url을 초기화하여 stale 상태 방지
    setBlobUrl(null);

    let isMounted = true;
    let createdUrl: string | null = null;

    const loadBlob = async () => {
      try {
        const response = await fetch(item.thumbnail!, {
          mode: "cors",
          cache: "no-cache",
        });
        const blob = await response.blob();
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          createdUrl = url;
          setBlobUrl(url);
        }
      } catch {
        if (isMounted) setBlobUrl(item.thumbnail!);
      }
    };
    loadBlob();
    return () => {
      isMounted = false;
      // state인 blobUrl 대신, 이 effect 인스턴스에서 생성했던 createdUrl을 직접 revoke
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [item.thumbnail]);

  // 날짜 포맷팅
  const formattedDate = createdAt
    ? (() => {
        const date = new Date(createdAt);
        if (isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}.${month}.${day}   |   ${hours}:${minutes}`;
      })()
    : "";

  // [Canvas로 직접 그리기] (모바일에서는 이미지가 다운로드 되지 않는 현상 때문에 채용)
  const handleDownload = async () => {
    if (isDownloading || !blobUrl) return;
    setIsDownloading(true);

    try {
      // 1. 캔버스 생성 (메모리 상에만 존재)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      // 2. 고해상도 설정 (1080px 너비 기준)
      const width = 1080;
      const height = 1600; // 적절한 비율로 설정 (조절 가능)
      canvas.width = width;
      canvas.height = height;

      // 3. 폰트 로딩 대기
      await document.fonts.ready;

      // [이미지 로드] - 배경과 메인 이미지 모두 사용
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = blobUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // [배경 그리기]
      ctx.save();
      // 1) 기본 배경
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);

      // 2) 블러 처리된 배경 이미지
      ctx.filter = "blur(80px) brightness(0.9)";
      ctx.globalAlpha = 0.8;

      // 배경 이미지 "cover" 효과 계산
      const scaleBg = Math.max(width / img.width, height / img.height);
      const bgX = (width - img.width * scaleBg) / 2;
      const bgY = (height - img.height * scaleBg) / 2;
      ctx.drawImage(img, bgX, bgY, img.width * scaleBg, img.height * scaleBg);

      // 3) 그라데이션 오버레이
      ctx.filter = "none";
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "rgba(18, 18, 18, 0.4)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // [메인 이미지]
      const imgW = 950;
      const imgH = 1200;
      const imgX = (width - imgW) / 2;
      const imgY = 100;
      const borderRadius = 40;

      ctx.save();
      // 둥근 사각형 경로 생성
      ctx.beginPath();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ctx as any).roundRect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx as any).roundRect(imgX, imgY, imgW, imgH, borderRadius);
      } else {
        // Fallback for older browsers
        ctx.moveTo(imgX + borderRadius, imgY);
        ctx.lineTo(imgX + imgW - borderRadius, imgY);
        ctx.quadraticCurveTo(
          imgX + imgW,
          imgY,
          imgX + imgW,
          imgY + borderRadius,
        );
        ctx.lineTo(imgX + imgW, imgY + imgH - borderRadius);
        ctx.quadraticCurveTo(
          imgX + imgW,
          imgY + imgH,
          imgX + imgW - borderRadius,
          imgY + imgH,
        );
        ctx.lineTo(imgX + borderRadius, imgY + imgH);
        ctx.quadraticCurveTo(
          imgX,
          imgY + imgH,
          imgX,
          imgY + imgH - borderRadius,
        );
        ctx.lineTo(imgX, imgY + borderRadius);
        ctx.quadraticCurveTo(imgX, imgY, imgX + borderRadius, imgY);
      }
      ctx.closePath();
      ctx.clip();

      // object-cover 효과
      const scale = Math.max(imgW / img.width, imgH / img.height);
      const x = imgX + (imgW - img.width * scale) / 2;
      const y = imgY + (imgH - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // [텍스트 그리기]
      const textX = imgX;
      let currentY = imgY + imgH + 80;

      // (1) Board Title
      ctx.font = "400 36px 'Pretendard', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${boardTitle} >`, textX, currentY);

      // (2) Tag (그라데이션 텍스트)
      currentY += 80;
      ctx.font = "700 90px 'Pretendard', sans-serif";

      // 그라데이션 생성 (왼쪽 흰색 -> 오른쪽 회색)
      const gradient = ctx.createLinearGradient(textX, 0, textX + 300, 0);
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(1, "#8F9297");
      ctx.fillStyle = gradient;
      ctx.fillText(`#${item.tag}`, textX, currentY);

      // (3) Date
      currentY += 50;
      ctx.font = "300 32px 'Montserrat', sans-serif";
      ctx.fillStyle = "rgba(250, 250, 250, 0.8)"; // 투명도 80%
      ctx.fillText(formattedDate, textX, currentY);

      // [저장 하기]
      const dataUrl = canvas.toDataURL("image/png");
      const fileName = `Nuvibe_${item.tag}_${Date.now()}.png`;

      // 모바일 공유 및 다운로드 처리
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Canvas drawing failed:", error);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90"
    >
      <div className="relative flex h-full w-full flex-col">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0 overflow-hidden" onClick={onClose}>
          {item.thumbnail && blobUrl && (
            <img
              src={blobUrl}
              alt="background blur"
              className="h-full w-full scale-110 object-cover opacity-60 blur-[100px]"
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-6 pb-4">
          <button onClick={onClose} className="-ml-2 p-2 text-white">
            <Xbutton24 />
          </button>
          <button
            className="-mr-2 p-2 text-white disabled:opacity-50"
            onClick={handleDownload}
            disabled={isDownloading || !blobUrl}
          >
            {isDownloading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Downloadbutton />
            )}
          </button>
        </div>

        {/* View Only (화면에 보이는 UI) */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
          <div className="relative z-10 flex min-h-0 w-full flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-transparent"
            >
              <div className="flex flex-col items-start gap-5 p-5">
                <div className="relative h-97 w-72.75 shrink-0 overflow-hidden rounded-[10px] bg-white">
                  {blobUrl ? (
                    <img
                      src={blobUrl}
                      alt={item.tag}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                </div>
                <div className="flex w-full flex-col items-start">
                  <p className="B2 font-pretendard flex items-center leading-[150%] tracking-[-0.35px] text-white">
                    {boardTitle} <ChevronRightIcon />
                  </p>
                  <div className="font-pretendard H1 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text leading-[150%] tracking-[-0.6px] text-transparent">
                    #{item.tag}
                  </div>
                  <p className="font-montserrat pt-1 text-[10px] leading-[9.3px] font-light text-[#FAFAFA] italic opacity-80">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
