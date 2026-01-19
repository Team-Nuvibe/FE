import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

import Xbutton from "@/assets/icons/icon_xbutton_sm.svg?react"
import Xbutton24 from "@/assets/icons/icon_xbutton_24.svg?react"
import Downloadbutton from "@/assets/icons/icon_imagesave.svg?react"
import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg?react"

import { TagSelector } from '@/components/features/TagSelector';


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
}

export const ImageDetailModal = ({ item, onClose, boardTitle = "Model", onTagUpdate }: ImageDetailModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (isDownloading || !captureRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null, // Capture actual background
        scale: 2, // Higher resolution
        useCORS: true, // Allow cross-origin images
        ignoreElements: (element) => element.classList.contains('ignore-capture'), // Ignore header buttons
      });

      const fileName = `Nuvibe_${item.tag}_${Date.now()}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Blob creation failed");
          setIsDownloading(false);
          return;
        }

        const file = new File([blob], fileName, { type: 'image/png' });

        // Web Share API
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
            });
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              console.error("Share failed:", error);
            }
          }
        } else {
          // Native Download Fallback
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      }, 'image/png');

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
        <div 
          ref={captureRef}
          className="relative w-full h-full flex flex-col"
        >
          {/* Background Blur */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden"
            onClick={onClose}
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt="background blur"
                className="w-full h-full object-cover blur-[100px] opacity-60 scale-110"
                referrerPolicy="no-referrer"
              />
            )}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            />
          </div>

          {/* Header */}
          <div className="ignore-capture relative z-10 px-4 pt-6 pb-4 flex items-center justify-between">
            <button onClick={onClose} className="p-2 -ml-2 text-white">
              <Xbutton24 />
            </button>
            <button 
              className="p-2 -mr-2 text-white disabled:opacity-50"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Downloadbutton />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-5 p-5 flex-1 min-h-0 ">
            {/* Main Image Container */}
            <div 
              className="relative z-10 w-full flex flex-col items-center justify-center min-h-0">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="flex flex-col items-start gap-5 p-5 bg-transparent"
              >
                  {/* Image Frame */}
                <div className="bg-white overflow-hidden relative rounded-[10px] w-72.75 h-97 shrink-0">
                  {item.thumbnail ? (
                    <>
                      <img
                        src={item.thumbnail}
                        alt={item.tag}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform ${
                          isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        referrerPolicy="no-referrer"
                        onLoad={() => setIsLoaded(true)}
                      />
                      {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bottom Info */}
                <div className="flex flex-col items-start w-full">
                  <p className="font-pretendard font-normal text-[14px] leading-[150%] tracking-[-0.35px] text-white flex items-center">
                    {boardTitle}
                    <ChevronRightIcon />
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 
                      className="font-pretendard H2 leading-[150%] tracking-[-0.6px] text-[#f7f7f7]"
                    >
                      #{item.tag}
                    </h2>
                    <button
                      className="text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsTagSelectorOpen(true)}
                    >
                      <Xbutton className='w-6 h-6'/>
                    </button>
                  </div>
                  <p 
                    className="font-montserrat pt-1 font-light italic text-[10px] leading-[9.3px] text-[#FAFAFA]"
                    style={{ opacity: 0.8 }}
                  >
                    2025.11.24   |   09:41
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tag Selector */}
      <AnimatePresence>
        {isTagSelectorOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-[60] bg-black" // Higher z-index than modal
          >
            <TagSelector
              onPrevious={() => setIsTagSelectorOpen(false)}
              onNext={(newTag) => {
                if (onTagUpdate) onTagUpdate(newTag);
                setIsTagSelectorOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
