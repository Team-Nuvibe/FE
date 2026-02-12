import WarningIcon from "@/assets/icons/icon_warning.svg?react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  count?: number;
  maintext: string;
  subtext: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  count,
  onClose,
  onConfirm,
  maintext,
  subtext,
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
            className="flex h-[174px] w-[304px] max-w-[335px] flex-col items-center justify-center rounded-[10px] bg-gray-900/85 p-[16px] text-center backdrop-blur-[22px]"
          >
            {/* 아이콘 */}
            <WarningIcon className="mb-3 h-[32px] w-[32px]" />
            <div className="mb-4">
              <div className="text-[17.38px] leading-[150%] font-semibold tracking-[-0.025em] text-white">
                {count}
                {maintext}
              </div>
              {/* 서브 텍스트 */}
              <p className="text-[10.43px] leading-[150%] font-medium tracking-[-0.025em] text-gray-300">
                {subtext}
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex w-full gap-2">
              <button
                onClick={onConfirm}
                className="ST3 flex h-[36px] w-[130px] items-center justify-center rounded-[5px] bg-gray-700 text-gray-300"
              >
                삭제하기
              </button>
              <button
                onClick={onClose}
                className="ST3 h-[36px] w-[130px] rounded-[5px] bg-gray-300 text-gray-800"
              >
                돌아가기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
