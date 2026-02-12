import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Xbutton24 from "@/assets/icons/icon_xbutton_24.svg?react";
import Downloadbutton from "@/assets/icons/icon_imagesave.svg?react";
import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg?react";
import ActiveScrapButton from "@/assets/icons/icon_bookmarked_lg.svg?react";
import InActiveScrapButton from "@/assets/icons/icon_bookmark_lg.svg?react";

interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}

interface ImageDetailModalProps {
  item: ModelItem;
  onClose: () => void;
  boardTitle?: string;
  onTagUpdate?: (newTag: string) => void;
  chatId?: number;
  isScraped?: boolean;
  senderNickname?: string;
  currentUserNickname?: string;
  onScrapToggle?: (chatId: number, currentStatus: boolean) => void;
  createdAt?: string;
}

export const ImageDetailModal = ({
  item,
  onClose,
  boardTitle,
  chatId,
  isScraped = false,
  senderNickname,
  currentUserNickname,
  onScrapToggle,
  createdAt,
}: ImageDetailModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [currentScrapStatus, setCurrentScrapStatus] = useState(isScraped);

  const isOwner = senderNickname === currentUserNickname;

  // 1. 이미지 프리로딩 (보여주기용 & 다운로드용)
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

  // prop이 변경되면 상태도 업데이트
  useEffect(() => {
    setCurrentScrapStatus(isScraped);
  }, [isScraped]);

  const handleScrapClick = () => {
    if (chatId && onScrapToggle) {
      // 조건부 낙관적 UI 업데이트
      // InactiveScrapButton(false)일 때만 즉시 상태 변경
      if (!currentScrapStatus) {
        setCurrentScrapStatus(true);
      }
      // ActiveScrapButton(true)일 때는 모달 확인 후 변경되므로 여기서는 변경하지 않음
      onScrapToggle(chatId, currentScrapStatus);
    }
  };

  // Format createdAt to "YYYY.MM.DD   |   HH:mm"
  const formattedDate = createdAt
    ? (() => {
        const date = new Date(createdAt);
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return "";
        }
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
      // 1) 기본 검정 배경 (투명도 없이 설정하여 배경이 비치지 않게 함)
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);

      // 2) 블러 처리된 배경 이미지 (더 강한 블러와 투명도 조절)
      // 블러 반경을 80px로 설정
      ctx.filter = "blur(80px) brightness(0.9)";
      ctx.globalAlpha = 0.8;

      // 배경 이미지 "cover" 효과 계산
      const scaleBg = Math.max(width / img.width, height / img.height);
      const bgX = (width - img.width * scaleBg) / 2;
      const bgY = (height - img.height * scaleBg) / 2;
      ctx.drawImage(img, bgX, bgY, img.width * scaleBg, img.height * scaleBg);

      // 3) 그라데이션 오버레이 (전체적으로 어둡게 눌러줌)
      ctx.filter = "none";
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "rgba(18, 18, 18, 0.4)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // [메인 이미지 그리기]
      // 이미지 영역 설정 (패딩 줄임: 800 -> 950, 높이 1060 -> 1200, 상단 150 -> 100)
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
      ctx.clip(); // 이 영역 밖은 잘라냄

      // object-cover 효과 구현 (비율 유지하며 꽉 채우기)
      const scale = Math.max(imgW / img.width, imgH / img.height);
      const x = imgX + (imgW - img.width * scale) / 2;
      const y = imgY + (imgH - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // [텍스트 그리기]
      const textX = imgX; // 이미지 왼쪽 라인에 맞춤
      let currentY = imgY + imgH + 80;

      // (1) Board Title
      if (boardTitle) {
        ctx.font = "400 36px 'Pretendard', sans-serif"; // 폰트 크기/두께
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${boardTitle} >`, textX, currentY); // 아이콘 대신 '>' 텍스트 사용
      }

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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 bg-black/90 selection:bg-none" // z-50 to stay above everything else except TagSelector
      >
        <div className="relative flex h-full w-full flex-col">
          {/* Background Blur */}
          <div
            className="absolute inset-0 z-0 overflow-hidden"
            onClick={onClose}
          >
            {item.thumbnail && (
              <img
                src={blobUrl || item.thumbnail!}
                alt="background blur"
                className="h-full w-full scale-110 object-cover opacity-60 blur-[100px]"
                referrerPolicy="no-referrer"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            />
          </div>

          {/* Header */}
          <div className="ignore-capture relative z-10 flex items-center justify-between px-4 pt-6 pb-4">
            <button onClick={onClose} className="-ml-2 p-2 text-white">
              <Xbutton24 />
            </button>
            <div className="flex items-center gap-2">
              {isOwner && (
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
              )}
              {chatId && onScrapToggle && (
                <button
                  className="-mr-2 p-2 text-white"
                  onClick={handleScrapClick}
                  aria-label="스크랩"
                >
                  {currentScrapStatus ? (
                    <ActiveScrapButton className="h-6 w-6" />
                  ) : (
                    <InActiveScrapButton className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
            {/* Main Image Container */}
            <div className="relative z-10 flex min-h-0 w-full flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="flex flex-col items-start gap-5 bg-transparent p-5"
              >
                {/* Image Frame */}
                <div className="relative h-97 w-72.75 shrink-0 overflow-hidden rounded-[10px] bg-white">
                  {item.thumbnail ? (
                    <>
                      <img
                        src={item.thumbnail}
                        alt={item.tag}
                        className={`absolute inset-0 h-full w-full transform object-cover transition-opacity duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        referrerPolicy="no-referrer"
                        onLoad={() => setIsLoaded(true)}
                      />
                      {!isLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-gray-200" />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-sm text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bottom Info */}
                <div className="flex w-full flex-col items-start">
                  {isOwner && boardTitle && (
                    <p className="B2 font-pretendard flex items-center leading-[150%] tracking-[-0.35px] text-white">
                      {boardTitle}
                      <ChevronRightIcon />
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="font-pretendard H1 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text leading-[150%] tracking-[-0.6px] text-transparent">
                      #{item.tag}
                    </div>
                  </div>
                  <p
                    className="font-montserrat pt-1 text-[10px] leading-[9.3px] font-light text-[#FAFAFA] italic"
                    style={{ opacity: 0.8 }}
                  >
                    {formattedDate}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
