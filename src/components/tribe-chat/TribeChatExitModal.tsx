
import IconWarning from '@/assets/icons/icon_warning.svg?react';

interface TribeChatExitModalProps {
    roomTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const TribeChatExitModal = ({ roomTitle, onConfirm, onCancel }: TribeChatExitModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="w-[304px] h-[178px] bg-[#2C2C2C] rounded-[10px] p-[20px] flex flex-col items-center justify-between shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center gap-[12px]">
                    <IconWarning className="w-[24px] h-[24px] text-gray-400" />

                    <div className="flex flex-col items-center">
                        <h4 className="H4 text-white leading-[150%] tracking-[-0.025em] text-center mb-[4px]">
                            {roomTitle} 트라이브 챗을 나갈까요?
                        </h4>
                        <span className="text-[12px] font-[400] text-gray-300 leading-[150%] tracking-[-0.025em] text-center">
                            채팅방을 나가면 스크랩이 사라집니다
                        </span>
                    </div>
                </div>

                <div className="flex w-full gap-[8px]">
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-[36px] bg-gray-700 rounded-[8px] flex items-center justify-center text-gray-300 B2 font-medium hover:opacity-90 transition-opacity"
                    >
                        나가기
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 h-[36px] bg-gray-300 rounded-[8px] flex items-center justify-center text-gray-800 B2 font-medium hover:opacity-90 transition-opacity"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};
