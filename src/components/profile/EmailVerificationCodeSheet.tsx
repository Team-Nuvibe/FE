import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from "@/assets/icons/icon_xbutton_24.svg?react";

interface EmailVerificationCodeSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (code: string) => void;
    onResend: () => void;
    isVerifying: boolean;
}

export const EmailVerificationCodeSheet = ({
    isOpen,
    onClose,
    onConfirm,
    onResend,
    isVerifying
}: EmailVerificationCodeSheetProps) => {
    const [codes, setCodes] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setCodes(Array(6).fill(''));
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCodes = [...codes];
        newCodes[index] = value.slice(-1);
        setCodes(newCodes);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !codes[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleConfirm = () => {
        const fullCode = codes.join('');
        if (fullCode.length === 6) {
            onConfirm(fullCode);
        }
    };

    const isComplete = codes.every(code => code !== '');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60"
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full flex flex-col gap-[10px] max-w-[393px] mx-auto bg-gray-900 rounded-t-[25px] px-[16px] pt-[24px] pb-[32px]"
                    >
                        {/* Header */}
                        <div className="relative flex items-center justify-center mb-[14px]">
                            <button
                                onClick={onClose}
                                className="absolute left-0 w-[24px] h-[24px] flex items-center justify-center"
                            >
                                <CloseIcon className="w-[24px] h-[24px] text-white" />
                            </button>
                            <h2 className="text-[20px] font-semibold text-gray-100 leading-[150%] tracking-[-0.025em]">
                                인증 코드 입력
                            </h2>
                        </div>

                        {/* Input Label */}
                        <label className="text-gray-200 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[2px] block text-left">
                            인증 코드
                        </label>

                        {/* OTP Inputs */}
                        <div className="flex justify-center mb-[22px]">
                            {codes.map((code, index) => (
                                <div
                                    key={index}
                                    className={`
                                        relative w-[52px] h-[62px] 
                                        ${index === 3 ? 'ml-[16px]' : index > 0 ? 'ml-[8px]' : ''}
                                    `}
                                >
                                    <input
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={code}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`
                                            w-full h-full bg-gray-800 rounded-[5px] 
                                            text-white text-[24px] font-medium text-center
                                            outline-none border border-transparent
                                            focus:border-gray-600 focus:bg-gray-700
                                            caret-transparent
                                            selection:bg-transparent
                                        `}
                                    />
                                    {/* Cursor simulation if needed, but simple input is usually fine */}
                                </div>
                            ))}
                        </div>

                        {/* Resend Link */}
                        <div className="flex justify-center items-center gap-[8px] mb-[6px]">
                            <span className="text-gray-300 text-[12px] font-normal leading-[150%] tracking-[-0.025em]">
                                인증 코드를 받지 못하셨나요?
                            </span>
                            <button
                                onClick={onResend}
                                className="text-gray-200 text-[12px] font-medium leading-[150%] tracking-[-0.025em]"
                            >
                                새 코드 받기
                            </button>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={!isComplete || isVerifying}
                            className={`
                                w-full h-[48px] rounded-[5px]
                                text-[16px] font-semibold leading-[150%] tracking-[-0.025em]
                                flex items-center justify-center transition-colors
                                ${isComplete
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                            `}
                        >
                            {isVerifying ? '인증 중...' : '인증하기'}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
