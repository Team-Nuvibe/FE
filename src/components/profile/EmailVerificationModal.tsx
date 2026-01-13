import WarningIcon from '@/assets/icons/icon_warning.svg?react';

interface AlertModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const EmailVerificationModal = ({ isOpen, title, message, onClose }: AlertModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
            <div className="
                w-[304px] h-[178px] p-[20px] -translate-y-3
                bg-gray-900/80 backdrop-blur-[20px] rounded-[10px]
                flex flex-col items-center justify-center text-center
            ">
                <WarningIcon className="w-[32px] h-[32px] mb-[8px]" />

                <div className="mb-[28px] flex flex-col items-center w-full">
                    <div className="text-[17px] font-semibold text-white leading-[150%] tracking-[-0.025em]">
                        {title}
                    </div>
                    <p className="text-[11px] font-medium text-gray-300 leading-[150%] tracking-[-0.025em] mt-[4px] whitespace-pre-wrap">
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="
                        w-full h-[36px] rounded-[5px] bg-gray-300
                        text-gray-800 text-[14px] font-medium leading-[150%] tracking-[-0.025em]
                        flex items-center justify-center transition-colors
                    "
                >
                    확인
                </button>
            </div>
        </div>
    );
};
