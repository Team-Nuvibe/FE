import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
  FieldValues,
  Path,
} from "react-hook-form";
import InputBox from "../InputBox";

interface NameStepProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setFocus: UseFormSetFocus<T>;
}

const NameStep = <T extends FieldValues>({
  register,
  errors,
  setFocus,
}: NameStepProps<T>) => {
  useEffect(() => {
    setFocus("name" as Path<T>);
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
        이름
      </div>
      <InputBox
        {...register("name" as Path<T>)}
        type="text"
        placeholder="이름을 입력해주세요."
        hasError={!!errors?.name}
        errorMessage={errors.name?.message as string}
      />
    </div>
  );
};

export default NameStep;
