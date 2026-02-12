import WarningIcon from '@/assets/icons/icon_warning.svg?react';
import UncheckedIcon from '@/assets/icons/icon-unchecked.svg?react';
import CheckedIcon from '@/assets/icons/icon-checked.svg?react';
import { useState, useEffect } from 'react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) => {
    const [isChecked, setIsChecked] = useState(false);

    // 모달 열리면 상태 초기화
    useEffect(() => {
        if (isOpen) setIsChecked(false);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
            <div className="
                w-[304px] h-[211px] p-[20px]
                bg-gray-900/80 backdrop-blur-[20px] rounded-[10px]
                flex flex-col items-center justify-center text-center
            ">
                <WarningIcon className="w-[32px] h-[32px] mb-[8px]" />

                <div className="flex flex-col items-center">
                    <div className="text-[17px] font-semibold text-white leading-[150%] tracking-[-0.025em] whitespace-pre-wrap">
                        정말로 삭제하시겠습니까?
                    </div>
                    <p className="text-[11px] font-medium text-gray-300 leading-[150%] tracking-[-0.025em] mt-[4px]">
                        해당 모든 데이터가 삭제됩니다.
                    </p>
                </div>

                <div
                    className="mb-[20px] mt-[12px] flex items-center justify-center cursor-pointer gap-[12px]"
                    onClick={() => setIsChecked(!isChecked)}
                >
                    {isChecked ? (
                        <CheckedIcon className="w-[18px] h-[18px]" />
                    ) : (
                        <UncheckedIcon className="w-[18px] h-[18px]" />
                    )}
                    <span className="text-[14px] font-medium leading-[150%] tracking-[-0.025em] text-gray-100">
                        네, 동의합니다.
                    </span>
                </div>

                <div className="flex w-full justify-center gap-[8px]">
                    <button
                        onClick={onConfirm}
                        disabled={!isChecked}
                        className={`
                            w-[128px] h-[36px] rounded-[5px]
                            text-[14px] font-medium leading-[150%] tracking-[-0.025em]
                            flex items-center justify-center transition-colors
                            ${isChecked
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-800 text-gray-400 cursor-not-allowed'}
                        `}
                    >
                        삭제하기
                    </button>
                    <button
                        onClick={onClose}
                        className="
                            w-[128px] h-[36px] rounded-[5px] bg-gray-300
                            text-gray-800 text-[14px] font-medium leading-[150%] tracking-[-0.025em]
                            flex items-center justify-center transition-colors
                        "
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};
