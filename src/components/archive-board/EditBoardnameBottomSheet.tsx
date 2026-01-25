import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from "@/assets/icons/icon_xbutton_24.svg?react";

interface EditBottomSheetProps {
  isOpen: boolean;
  initialTitle?: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

export const EditBoardNameBottomSheet = ({ isOpen, initialTitle = '', onClose, onSave }: EditBottomSheetProps) => {
  const [text, setText] = useState(initialTitle);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setText(initialTitle);
      setIsShaking(false);
    }
  }, [isOpen, initialTitle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.length > 15) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 400); 
    } else {
      setText(newValue);
    }
  };

  const handleSave = () => {
    if (text.trim().length > 0) {
      onSave(text);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          
          {/* 배경 (Backdrop) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60" 
            onClick={onClose}
          />

          {/* 바텀 시트 (Content) */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full flex flex-col max-w-[393px] mx-auto bg-gray-900 rounded-t-[25px] px-4 pt-6 pb-10 gap-4"
          >
            
            {/* 헤더 */}
            <div className="relative flex items-center justify-center pb-4">
              <button 
                onClick={onClose}
                className="absolute left-0 p-1"
              >
                <CloseIcon/>
              </button>
              <h2 className="H2 text-gray-200 leading-[150%] tracking-[-0.5px]">
                아카이브 보드명 수정
              </h2>
            </div>

            {/* 입력 필드 컨테이너 */}
            <div 
              className={`
                relative w-full h-[56px] bg-gray-800 rounded-[5px]
                border transition-colors duration-200
                ${isShaking 
                  ? 'border-gray-300 animate-shake' 
                  : 'border-transparent' 
                }
              `}
            >
              {/* 입력창 (Input) */}
              <input 
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="수정할 보드명을 입력해주세요."
                className="w-full h-full bg-transparent text-gray-100 H3 
                placeholder:text-gray-400 placeholder:text-[16px] placeholder:font-normal
                focus:outline-none px-4 pr-[60px]" 
              />
              
              {/* 글자수 카운터 (Span) */}
              <span 
                className={`
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-[12px] font-normal leading-[150%] tracking-[-0.3px] 
                  tabular-nums pointer-events-none
                  ${text.length === 0 ? 'text-gray-400' : 'text-white'}
                `}
              >
                ({text.length}/15)
              </span>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              disabled={text.length === 0}
              className={`
                w-full h-[56px] rounded-[5px] H3 transition-colors leading-[150%] tracking-[-0.45px]
                ${text.length > 0 
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-200' 
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              저장하기
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};