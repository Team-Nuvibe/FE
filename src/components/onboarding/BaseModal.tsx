import WarningIcon from "@/assets/icons/icon_warning.svg?react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  maintext: string;
  subtext: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export const BaseModal = ({
  isOpen,
  onClose,
  maintext,
  subtext,
  children,
}: DeleteModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        // 1. 배경 blur 및 전체 컨테이너
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
        >
          {/* 모달 컨텐츠 박스 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: -12 }} // -translate-y-3 corresponds to -12px
            exit={{ scale: 0.9, opacity: 0, y: -12 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex h-[174px] w-[304px] max-w-[335px] flex-col items-center justify-center rounded-[10px] bg-gray-900/85 p-5 text-center backdrop-blur-[22px]"
          >
            {/* 아이콘 */}
            <WarningIcon className="mb-2 h-[32px] w-[32px]" />
            <div className="mb-4">
              <div className="text-[17.38px] leading-[150%] font-semibold tracking-[-0.025em] text-white">
                {maintext}
              </div>
              {/* 서브 텍스트 */}
              <p className="text-[10.43px] leading-[150%] font-medium tracking-[-0.025em] text-gray-300">
                {subtext}
              </p>
            </div>

            {/* 동적 컨텐츠 */}
            {children}

            {/* 버튼 영역 - children이 없을 때만 표시 */}
            {!children && (
              <button
                onClick={onClose}
                className="B2 mx-auto h-[36px] w-full rounded-[5px] bg-gray-300 text-gray-900"
              >
                확인
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
