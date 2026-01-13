import WarningIcon from '@/assets/icons/icon_warning.svg?react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
            <div className="
                w-[304px] h-[178px] p-[20px] -translate-y-3
                bg-gray-900/80 backdrop-blur-[20px] rounded-[10px]
                flex flex-col items-center justify-center text-center
            ">
                <WarningIcon className="w-[32px] h-[32px] mb-[8px]" />

                <div className="mb-[20px] flex flex-col items-center">
                    <div className="text-[17px] font-semibold text-white leading-[150%] tracking-[-0.025em]">
                        계정을 정말 삭제하시겠습니까?
                    </div>
                    <p className="text-[11px] font-medium text-gray-300 leading-[150%] tracking-[-0.025em] mt-[4px]">
                        계정을 삭제하면 모든 기록이 영구적으로 삭제됩니다.
                    </p>
                </div>

                <div className="flex w-full justify-center gap-[8px]">
                    <button
                        onClick={onClose}
                        className="
                            w-[128px] h-[36px] rounded-[5px] bg-gray-700
                            text-gray-300 text-[14px] font-medium leading-[150%] tracking-[-0.025em]
                            flex items-center justify-center transition-colors
                        "
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="
                            w-[128px] h-[36px] rounded-[5px] bg-gray-300
                            text-gray-800 text-[14px] font-medium leading-[150%] tracking-[-0.025em]
                            flex items-center justify-center transition-colors
                        "
                    >
                        네 삭제할래요
                    </button>
                </div>
            </div>
        </div>
    );
};
