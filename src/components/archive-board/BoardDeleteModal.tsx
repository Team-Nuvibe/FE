import WarningIcon from '@/assets/icons/icon_warning.svg?react'

interface Props {
  isOpen: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const BoardDeleteModal = ({ isOpen, count, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    // 1. 배경 blur
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4">
      
      {/* 모달 컨텐츠 박스 */}
      <div className="w-[296px] h-[167px] max-w-[335px] bg-gray-900/85 backdrop-blur-[22px] rounded-[10px] p-[16px] flex flex-col items-center text-center">
        
        {/* 아이콘 */}
        <WarningIcon className="w-[32px] h-[32px] mb-2"/>
        <div className="mb-4">
          <div className="text-[17.38px] font-semibold text-white leading-[150%] tracking-[-0.025em]">
          정말 해당 보드를 삭제하시겠습니까?
          </div>
          {/* 서브 텍스트 */}
          <p className="text-[10.43px] font-medium text-gray-300 leading-[150%] tracking-[-0.025em]">
            삭제하면 보드 안의 모든 이미지가 사라져요.
          </p>
        </div>
        {/* 메인 텍스트 */}
        

        {/* 버튼 영역 */}
        <div className="flex w-full gap-2">
          <button
            onClick={onConfirm}
            className=" 
              w-[130px] h-[36px] rounded-[5px] bg-gray-700 flex items-center justify-center
              text-gray-300 B2"
          >
            네 삭제할래요
          </button>
          <button
            onClick={onClose}
            className="
              w-[130px] h-[36px] rounded-[5px] bg-gray-300
              text-gray-800 B2"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};