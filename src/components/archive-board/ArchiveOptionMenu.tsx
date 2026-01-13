interface Props {
  onClose: () => void; // 메뉴 닫기
  onDeleteMode: () => void; // 이미지 삭제하기 모드 진입
  onMoveBoard?: () => void; // (추후 구현) 보드 이동
  onEditName?: () => void; // (추후 구현) 보드명 수정
}

export const ArchiveOptionMenu = ({ onClose, onDeleteMode, onMoveBoard, onEditName }: Props) => {
  
  // useRef와 useEffect를 제거했습니다. 
  // 대신 배경(Backdrop) div에 onClick={onClose}를 걸어 처리합니다.

  return (
    <>
      {/* 1. 배경 (Backdrop) */}
      {/* fixed inset-0으로 화면 전체를 덮고, z-40으로 설정 */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose} 
      />

      {/* 2. 메뉴 본체 */}
      {/* z-50으로 배경보다 위에 올라오도록 설정 */}
      <div className="
        absolute top-[60px] right-4 z-50
        w-[241px] h-[144px]
        bg-gray-900/90 rounded-[10px] overflow-hidden backdrop-blur-[10px]
        text-[12px] animate-fade-in">
        
        {/* 1. 편집 (헤더 역할, 비활성화) */}
        <div className="px-4.5 py-2.25 text-gray-500 font-normal border-b-[0.5px] border-gray-700">
          편집
        </div>
        
        {/* 2. 이미지 삭제하기 */}
        <button 
          onClick={() => {
            onDeleteMode();
            onClose();
          }}
          className="w-full text-left px-4.5 py-2.25 text-gray-300 font-medium
          hover:bg-gray-700 hover:text-white transition-colors  
          border-b-[0.5px] border-gray-700"
        >
          이미지 삭제하기
        </button>

        {/* 3. 아카이브 보드 이동하기 */}
        <button 
          onClick={onMoveBoard}
          className="w-full text-left px-4.5 py-2.25 text-gray-300 font-medium
          hover:bg-gray-700 hover:text-white transition-colors  
          border-b-[0.5px] border-gray-700"
        >
          이미지 이동하기
        </button>

        {/* 4. 보드명 수정하기 */}
        <button 
          onClick={onEditName}
          className="w-full text-left px-4.5 py-2.25 text-gray-300 font-medium
          hover:bg-gray-700 hover:text-white transition-colors  
          border-b-[0.5px] border-gray-700"
        >
          아카이브 보드명 수정하기
        </button>
      </div>
    </>
  );
};