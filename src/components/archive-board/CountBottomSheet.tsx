import TrashIcon from "@/assets/icons/icon_trashcan.svg?react";
import { motion } from "framer-motion";
import ExitIcon from "@/assets/icons/icon_exit.svg?react";

interface Props {
  count: number;
  maintext: string;
  onDelete?: () => void;
  onMove?: () => void;
}

export const CountBottomSheet = ({
  count,
  onDelete,
  onMove,
  maintext,
}: Props) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 bg-black/90 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative flex w-full items-center justify-center border-t border-gray-900 px-[19px] py-[35px]">
        {/* 아이콘의 기준점을 위한 container */}
        <div className="relative flex items-center">
          {/* 중앙 텍스트 */}
          <span className="ST2 whitespace-nowrap text-gray-200">
            {count}
            {maintext}
          </span>

          {/* 이미지 삭제일 때 휴지통 아이콘 */}
          {onDelete && (
            <button
              className="absolute top-1/2 left-full ml-[60px] -translate-y-1/2"
              onClick={onDelete}
            >
              <TrashIcon className="h-[24px] w-[24px]" />
            </button>
          )}

          {/* 이미지 이동하기 일때 Exit 아이콘 (원래 의도: 이동 아이콘) */}
          {onMove && (
            <button
              className="absolute top-1/2 left-full ml-[60px] -translate-y-1/2"
              onClick={onMove}
            >
              <ExitIcon className="h-[24px] w-[24px]" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
