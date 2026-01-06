import TrashIcon  from '@/assets/icons/icon_trashcan.svg?react';

interface Props {
  count: number;
  onDelete: () => void;
}

export const BoardDeleteBottomSheet = ({ count, onDelete }: Props) => {
  return (
    <div 
      className="
        fixed bottom-0 left-0 w-full z-50
        bg-black/90
        pb-[env(safe-area-inset-bottom)] 
      "
    >
      <div className="relative w-full h-[60px] flex items-center justify-center px-5">
        {/* 중앙 텍스트 */}
        <span className="ST2 text-gray-200">
          {count}개의 아카이브 보드 선택됨
        </span>
        
        {/* 휴지통 아이콘 */}
        <button 
          className="absolute right-5" 
          onClick={onDelete}
        >
          <TrashIcon className="w-[24px] h-[24px]" />
        </button>
      </div>
    </div>
  );
};