import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import OTPInput from "./OTPInput";
import CloseIcon from "@/assets/icons/icon_xbutton.svg?react";

interface OTPBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isVerifying?: boolean;
  isResending?: boolean;
}

export const OTPBottomSheet = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  isVerifying = false,
  isResending = false,
}: OTPBottomSheetProps) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
  };

  const handleVerifyClick = async () => {
    if (verificationCode.length < 6 || isVerifying) return;
    try {
      await onVerify(verificationCode);
      setVerificationCode(""); // Reset on success
    } catch {
      setVerificationCode(""); // Reset on error
    }
  };

  const handleResendClick = async () => {
    if (isResending) return;
    await onResend();
    setVerificationCode(""); // Reset code when resending
  };

  const handleClose = () => {
    setVerificationCode("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 bottom-0 left-0 z-101 flex flex-col rounded-t-[20px] bg-gray-900 px-6 pt-6 pb-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 left-6 p-2 text-white transition-opacity hover:opacity-70"
              aria-label="닫기"
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            {/* Title */}
            <div className="mb-8 text-center">
              <h2 className="text-[17px] leading-[150%] font-semibold tracking-[-0.025em] text-white">
                인증 코드 입력
              </h2>
            </div>

            {/* Subtitle */}
            <div className="mb-6 text-center">
              <p className="text-[12px] leading-[150%] font-normal tracking-[-0.025em] text-gray-400">
                인증 코드
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-4 flex justify-center">
              <OTPInput length={6} onComplete={handleCodeComplete} />
            </div>

            {/* Help Text */}
            <div className="mb-6 flex items-center justify-center gap-1 text-center text-[10px] leading-[150%] tracking-[-0.025em] text-gray-400">
              <span>인증 코드를 못 받았나요?</span>
              <button
                onClick={handleResendClick}
                disabled={isResending}
                className="text-gray-300 underline transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "발송 중..." : "재발송"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleVerifyClick}
              disabled={verificationCode.length < 6 || isVerifying}
              className="h-12 w-full rounded-[5px] bg-gray-600 text-[14px] leading-[150%] font-semibold tracking-[-0.025em] text-gray-900 transition-colors disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
            >
              {isVerifying ? "인증 중..." : "인증하기"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
