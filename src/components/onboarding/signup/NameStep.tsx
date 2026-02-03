import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
} from "react-hook-form";
import InputBox from "../InputBox";
import type { FormFields } from "@/pages/onboarding/SignUpPage";

interface NameStepProps {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  setFocus: UseFormSetFocus<FormFields>;
}

const NameStep = ({ register, errors, setFocus }: NameStepProps) => {
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
        이름
      </div>
      <InputBox
        {...register("name")}
        type="text"
        placeholder="이름을 입력해주세요."
        hasError={!!errors?.name}
        errorMessage={errors.name?.message as string}
      />
    </div>
  );
};

export default NameStep;
