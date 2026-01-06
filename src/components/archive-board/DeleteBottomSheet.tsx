import TrashIcon  from '@/assets/icons/icon_trashcan.svg?react';

interface Props {
  count: number;
  maintext: string;
  onDelete: () => void;
}

export const DeleteBottomSheet = ({ count, onDelete, maintext }: Props) => {
  return (
    <div 
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
          
          {/* 휴지통 아이콘 */}
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
        </div>
      </div>
    </div>
  );
};