import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
  FieldPath,
} from "react-hook-form";
import InputBox from "../InputBox";

interface EmailStepProps<T extends Record<string, any>> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isEmailVerified: boolean;
  isEmailSending: boolean;
  handleEmailVerification: () => void;
  isEmailValid: boolean;
  setFocus: UseFormSetFocus<T>;
}

const EmailStep = <T extends Record<string, any>>({
  register,
  errors,
  isEmailVerified,
  isEmailSending,
  handleEmailVerification,
  isEmailValid,
  setFocus,
}: EmailStepProps<T>) => {
  useEffect(() => {
    setFocus("email" as FieldPath<T>);
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
        이메일
      </div>

      <InputBox
        {...register("email" as FieldPath<T>)}
        type="email"
        placeholder="이메일을 입력해주세요."
        hasError={!!errors?.email}
        errorMessage={errors.email?.message as string}
        rightElement={
          <button
            type="button"
            onClick={handleEmailVerification}
            disabled={!isEmailValid || isEmailVerified || isEmailSending}
            className={`ml-2 flex h-[28px] w-[73px] shrink-0 items-center justify-center rounded-[5px] p-1.25 text-[10px] leading-[150%] font-normal tracking-[-0.25px] whitespace-nowrap transition-colors ${
              isEmailVerified
                ? "cursor-not-allowed bg-gray-700 text-gray-300"
                : isEmailValid
                  ? "bg-gray-300 text-gray-900"
                  : "cursor-not-allowed bg-gray-700 text-gray-300"
            }`}
          >
            {isEmailVerified
              ? "인증 완료"
              : isEmailSending
                ? "발송 중..."
                : "인증 코드 받기"}
          </button>
        }
      />
    </div>
  );
};

export default EmailStep;
