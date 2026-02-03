import TrashIcon from '@/assets/icons/icon_trashcan.svg?react';
import { motion } from 'framer-motion';
import ExitIcon from '@/assets/icons/icon_exit.svg?react';

interface Props {
  count: number;
  maintext: string;
  onDelete?: () => void;
  onMove?: () => void;
}

export const CountBottomSheet = ({ count, onDelete, onMove, maintext }: Props) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="
        fixed bottom-0 
        w-full max-w-[393px] 
        left-1/2 -translate-x-1/2 
        z-50
        bg-black/90
        pb-[env(safe-area-inset-bottom)] 
      "
    >
      <div className="relative w-full flex items-center justify-center py-[35px] px-[19px]">
        {/* 아이콘의 기준점을 위한 container */}
        <div className="relative flex items-center">
          {/* 중앙 텍스트 */}
          <span className="ST2 text-gray-200 whitespace-nowrap">
            {count}{maintext}
          </span>

          {/* 이미지 삭제일 때 휴지통 아이콘 */}
          {onDelete && (
            <button
              className="
                absolute 
                left-full 
                ml-[60px] 
                top-1/2 -translate-y-1/2"
              onClick={onDelete}
            >
              <TrashIcon className="w-[24px] h-[24px]" />
            </button>
          )}

          {/* 이미지 이동하기 일때 Exit 아이콘 (원래 의도: 이동 아이콘) */}
          {onMove && (
            <button
              className="
                absolute 
                left-full 
                ml-[60px] 
                top-1/2 -translate-y-1/2"
              onClick={onMove}
            >
              <ExitIcon className="w-[24px] h-[24px]" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};