import WarningIcon from '@/assets/icons/icon_warning.svg?react'

interface DeleteModalProps {
  isOpen: boolean;
  count: number;
  maintext: string;
  subtext: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({ isOpen, count, onClose, onConfirm, maintext, subtext }: DeleteModalProps) => {
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
          {maintext}
          </div>
          {/* 서브 텍스트 */}
          <p className="text-[10.43px] font-medium text-gray-300 leading-[150%] tracking-[-0.025em]">
            {subtext}
          </p>
        </div>
        

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