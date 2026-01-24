import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@/assets/icons/icon_xbutton_24.svg?react";

interface EditBottomSheetProps {
  isOpen: boolean;
  initialTitle?: string;
  toptext: string;
  buttontext: string;
  onClose: () => void;
  onClick: (newTitle: string) => void;
}

export const BoardBottomSheet = ({
  isOpen,
  initialTitle = "",
  toptext,
  buttontext,
  onClose,
  onClick,
}: EditBottomSheetProps) => {
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

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onClick(text);
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
            className="relative mx-auto flex w-full max-w-[393px] flex-col gap-4 rounded-t-[25px] bg-gray-900 px-4 pt-6 pb-10"
          >
            {/* 헤더 */}
            <div className="relative flex items-center justify-center pb-4">
              <button onClick={onClose} className="absolute left-0 p-1">
                <CloseIcon />
              </button>
              <h2 className="H2 leading-[150%] tracking-[-0.5px] text-gray-200">
                {toptext}
              </h2>
            </div>

            {/* 입력 필드 컨테이너 */}
            <div
              className={`relative h-[56px] w-full rounded-[5px] border bg-gray-800 transition-colors duration-200 ${
                isShaking
                  ? "animate-shake border-gray-300"
                  : "border-transparent"
              } `}
            >
              {/* 입력창 (Input) */}
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="수정할 보드명을 입력해주세요."
                className="H3 h-full w-full bg-transparent px-4 pr-[60px] text-gray-100 placeholder:text-[16px] placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
              />

              {/* 글자수 카운터 (Span) */}
              <span
                className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[12px] leading-[150%] font-normal tracking-[-0.3px] tabular-nums ${text.length === 0 ? "text-gray-400" : "text-white"} `}
              >
                ({text.length}/15)
              </span>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={text.length === 0}
              className={`H3 h-[56px] w-full rounded-[5px] leading-[150%] tracking-[-0.45px] transition-colors ${
                text.length > 0
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-200"
                  : "cursor-not-allowed bg-gray-800 text-gray-600"
              } `}
            >
              {buttontext}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
