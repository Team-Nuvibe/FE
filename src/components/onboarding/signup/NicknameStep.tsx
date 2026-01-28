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
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="font-['Pretendard'] text-xl leading-[30px] font-semibold tracking-tight text-white">
          마지막이에요!
          <br />
          어떻게 불러드릴까요?
        </h2>
      </div>

      <InputBox
        {...register("nickname")}
        type="text"
        placeholder="닉네임"
        hasError={!!errors?.nickname}
        errorMessage={errors.nickname?.message as string}
        guideText="(추후 변경할 수 있어요)"
      />
    </div>
  );
};

export default NicknameStep;
