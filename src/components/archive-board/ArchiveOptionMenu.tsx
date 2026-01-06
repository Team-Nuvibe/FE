import { useEffect, useRef } from 'react';

interface Props {
  onClose: () => void; // 메뉴 닫기
  onDeleteMode: () => void; // 이미지 삭제하기 모드 진입
  onMoveBoard?: () => void; // (추후 구현) 보드 이동
  onEditName?: () => void; // (추후 구현) 보드명 수정
}

export const ArchiveOptionMenu = ({ onClose, onDeleteMode, onMoveBoard, onEditName }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="absolute top-[60px] right-4 z-50 w-[215px] bg-[#2C2C2C] rounded-[12px] shadow-lg overflow-hidden py-2">
      {/* 1. 편집 (헤더 역할, 비활성화) */}
      <div className="px-4 py-2 text-[14px] text-[#8E8E93] font-medium">
        편집
      </div>

      {/* 2. 이미지 삭제하기 */}
      <button 
        onClick={() => {
          onDeleteMode();
          onClose();
        }}
        className="w-full text-left px-4 py-3 text-[16px] text-[#E5E5E5] hover:bg-[#3A3A3C] transition-colors"
      >
        이미지 삭제하기
      </button>

      {/* 3. 아카이브 보드 이동하기 */}
      <button 
        onClick={onMoveBoard}
        className="w-full text-left px-4 py-3 text-[16px] text-[#E5E5E5] hover:bg-[#3A3A3C] transition-colors"
      >
        아카이브 보드 이동하기
      </button>

      {/* 4. 보드명 수정하기 */}
      <button 
        onClick={onEditName}
        className="w-full text-left px-4 py-3 text-[16px] text-[#E5E5E5] hover:bg-[#3A3A3C] transition-colors"
      >
        보드명 수정하기
      </button>
    </div>
  );
};