import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";

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
  const [currentScrapStatus, setCurrentScrapStatus] = useState(isScraped);
  const captureRef = useRef<HTMLDivElement>(null);

  const isOwner = senderNickname === currentUserNickname;

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

  const handleDownload = async () => {
    if (isDownloading || !captureRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: "transparent", // Capture actual background
        pixelRatio: 2, // Higher resolution
        filter: (node) => !node.classList?.contains("ignore-capture"), // Ignore header buttons
      });

      const fileName = `Nuvibe_${item.tag}_${Date.now()}.png`;

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (!blob) {
        console.error("Blob creation failed");
        setIsDownloading(false);
        return;
      }

      const file = new File([blob], fileName, { type: "image/png" });

      // Web Share API
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
          });
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Share failed:", error);
          }
        }
      } else {
        // Native Download Fallback
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsDownloading(false);
    } catch (error) {
      console.error("Download failed:", error);
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
        <div ref={captureRef} className="relative flex h-full w-full flex-col">
          {/* Background Blur */}
          <div
            className="absolute inset-0 z-0 overflow-hidden"
            onClick={onClose}
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
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
                  disabled={isDownloading}
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
