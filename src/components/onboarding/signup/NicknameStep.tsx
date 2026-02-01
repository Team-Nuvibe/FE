import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
} from "react-hook-form";
import InputBox from "../InputBox";
import type { FormFields } from "@/pages/onboarding/SignUpPage";

interface NicknameStepProps {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  setFocus: UseFormSetFocus<FormFields>;
}

const NicknameStep = ({ register, errors, setFocus }: NicknameStepProps) => {
  useEffect(() => {
    setFocus("nickname");
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
        닉네임
      </div>
      <InputBox
        {...register("nickname")}
        type="text"
        placeholder="닉네임을 입력해주세요."
        hasError={!!errors?.nickname}
        errorMessage={errors.nickname?.message as string}
      />
    </div>
  );
};

export default NicknameStep;
