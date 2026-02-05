import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
  FieldValues,
  Path,
} from "react-hook-form";
import InputBox from "../InputBox";

interface NicknameStepProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setFocus: UseFormSetFocus<T>;
}

const NicknameStep = <T extends FieldValues>({
  register,
  errors,
  setFocus,
}: NicknameStepProps<T>) => {
  useEffect(() => {
    setFocus("nickname" as Path<T>);
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
        닉네임
      </div>
      <InputBox
        {...register("nickname" as Path<T>)}
        type="text"
        placeholder="닉네임을 입력해주세요."
        hasError={!!errors?.nickname}
        errorMessage={errors.nickname?.message as string}
      />
    </div>
  );
};

export default NicknameStep;
